<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
require_once('a02_cors.php');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    ob_end_flush();
    exit;
}

function jsonResponse($data) {
    ob_end_clean();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

require_once('a03_helpers.php');

try {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        jsonResponse(['status' => 'error', 'message' => 'Invalid JSON body']);
    }

    require_once('a01_connect.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    // ===== Stage A.5: userId من الجلسة المُصادَق عليها، لا من حقل
    // user_id وارد ضمن جسم الطلب (كان يُتيح لأي متصل ادّعاء هوية أي
    // مستخدم آخر بمجرد تغيير قيمة نصية في JSON) =====
    require_once('a04_auth.php');
    $userId = require_authenticated_user($conn);

    // ===== الحقول النصية/المفردة =====
    $arabicName = trim((string) ($body['arabic_name'] ?? ''));
    $country = trim((string) ($body['country'] ?? ''));
    $type = trim((string) ($body['type'] ?? ''));
    $officialDomains = trim((string) ($body['official_domains'] ?? ''));
    $researchStrategy = trim((string) ($body['research_strategy'] ?? ''));
    $requestedProfileStatus = trim((string) ($body['profile_status'] ?? 'draft'));
    $allowedStatuses = ['draft', 'submitted', 'under_review', 'approved'];
    if (!in_array($requestedProfileStatus, $allowedStatuses, true)) {
        $requestedProfileStatus = 'draft';
    }

    $priorityAreas = is_array($body['priority_areas'] ?? null) ? array_values(array_filter(array_map('trim', $body['priority_areas']))) : [];
    $researchGoals = is_array($body['research_goals'] ?? null) ? array_values(array_filter(array_map('trim', $body['research_goals']))) : [];

    $campuses = is_array($body['campuses'] ?? null) ? $body['campuses'] : [];
    $colleges = is_array($body['colleges'] ?? null) ? $body['colleges'] : [];
    $departments = is_array($body['departments'] ?? null) ? $body['departments'] : [];
    $researchCenters = is_array($body['research_centers'] ?? null) ? $body['research_centers'] : [];

    $roleKey = get_user_role_key($conn, $userId);
    if (!$roleKey) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'invalid_user']);
    }
    if ($roleKey !== 'university') {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'unsupported_role']);
    }

    // ===== Stage A: كل القراءة/الكتابة تُحلّ عبر university_id، لا user_id =====
    $universityId = get_university_id_for_user($conn, $userId);
    if (!$universityId) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'no_university_membership']);
    }

    // ===== صلاحية تغيير profile_status: فقط عضو admin بهذه الجامعة =====
    // عضو غير admin يمكنه حفظ كل الحقول الأخرى، لكن أي قيمة profile_status
    // واردة منه تُتجاهل وتُستبدل بالقيمة المخزّنة حاليًا (لا تُرفض العملية كاملة).
    $isUniversityAdmin = can_change_profile_status($conn, $userId, $universityId);
    if ($isUniversityAdmin) {
        $profileStatus = $requestedProfileStatus;
    } else {
        $stmtCur = $conn->prepare("SELECT profile_status FROM university_profiles WHERE university_id = ? LIMIT 1");
        $stmtCur->bind_param('i', $universityId);
        $stmtCur->execute();
        $curRow = $stmtCur->get_result()->fetch_assoc();
        $stmtCur->close();
        $profileStatus = $curRow['profile_status'] ?? 'draft';
    }

    $conn->begin_transaction();

    // ===== 0) تحديث universities — حقول الهوية المؤسسية (المصدر الوحيد
    // الموثوق لها بدءًا من Stage A؛ الصف نفسه مضمون الوجود دائمًا هنا لأن
    // get_university_id_for_user أعلاه لم يُرجع null) =====
    $stmt = $conn->prepare("UPDATE universities SET arabic_name = ?, country = ?, type = ?, official_domains = ? WHERE id = ?");
    if (!$stmt) {
        $conn->rollback();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Prepare universities update failed', 'debug' => $conn->error]);
    }
    $stmt->bind_param('ssssi', $arabicName, $country, $type, $officialDomains, $universityId);
    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        $conn->rollback();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Update universities failed', 'debug' => $err]);
    }
    $stmt->close();

    // ===== 1) upsert university_profiles — عبر مفتاح فريد على
    // university_id (وليس user_id، الذي بقي عمود تدقيق/توافق تاريخي فقط) =====
    $priorityAreasJson = json_encode($priorityAreas, JSON_UNESCAPED_UNICODE);
    $researchGoalsJson = json_encode($researchGoals, JSON_UNESCAPED_UNICODE);

    $stmt = $conn->prepare(
        "INSERT INTO university_profiles
            (user_id, university_id, research_strategy, priority_areas, research_goals, profile_status)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            research_strategy = VALUES(research_strategy), priority_areas = VALUES(priority_areas),
            research_goals = VALUES(research_goals), profile_status = VALUES(profile_status)"
    );
    if (!$stmt) {
        $conn->rollback();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Prepare university_profiles failed', 'debug' => $conn->error]);
    }
    $stmt->bind_param(
        'iissss',
        $userId, $universityId, $researchStrategy,
        $priorityAreasJson, $researchGoalsJson, $profileStatus
    );
    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        $conn->rollback();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Save university_profiles failed', 'debug' => $err]);
    }
    $stmt->close();

    // =========================================================================
    // 2) Stage A.5 / P3: خوارزمية تسوية سطر-بسطر بدل حذف الكل وإعادة الإدراج.
    //
    // المشكلة القديمة: كل حفظ كان يحذف كل صفوف الحرم/الكليات/الأقسام/المراكز
    // البحثية ثم يعيد إدراجها من الصفر — معرّفات جديدة عند كل حفظ، تكسر أي
    // مرجع خارجي مستقبلي (باحثون، مشاريع، أدلة) قد يشير إليها.
    //
    // الخوارزمية الجديدة، لكل جدول من الأربعة (بترتيب الاعتمادية: حرم ثم
    // كليات ثم أقسام ثم مراكز بحثية):
    //   - صف وارد بمعرّف id حقيقي ينتمي فعلاً لهذه الجامعة → UPDATE في مكانه
    //     (شرط WHERE id=? AND university_id=? هو تحقق الملكية بنفسه — أي
    //     معرّف مزوَّر ينتمي لجامعة أخرى يطابق صفراً من الصفوف، لا يُحدَّث
    //     أي شيء، ونُبلِّغ عن الخطأ صراحةً بدل الصمت).
    //   - صف بمعرّف id غير معروف/غير منتمٍ لهذه الجامعة → رفض الحفظ بالكامل
    //     (invalid_org_unit_reference) بدل معاملته كصف جديد صامتاً.
    //   - صف بلا id حقيقي (جديد من الواجهة، عبر tempId أو بلا معرّف إطلاقاً)
    //     → INSERT، مع حفظ خريطة tempId→id الحقيقي الجديد لربط الأبناء
    //     ضمن نفس الطلب (نفس الأسلوب المُستخدم أصلاً سابقاً).
    //   - أي صف كان موجوداً في قاعدة البيانات قبل هذا الحفظ ولم يظهر إطلاقاً
    //     ضمن المصفوفة الواردة → يُعتبر مُزالاً من قِبل المستخدم → soft-delete
    //     (deleted_at = NOW()) لا حذف فعلي — تمهيداً لمرحلة لاحقة قد تحتاج
    //     مراجع خارجية مستقرة حتى لسجلات أُزيلت من واجهة الملف.
    // =========================================================================

    // ----- تحقق ملكية الوحدة الأب (يُستخدم لكليات/أقسام/مراكز بحثية) -----
    function verify_parent_ownership($conn, $table, $parentId, $universityId) {
        if ($parentId === null) return true;
        $stmt = $conn->prepare("SELECT id FROM `$table` WHERE id = ? AND university_id = ? AND deleted_at IS NULL LIMIT 1");
        $stmt->bind_param('ii', $parentId, $universityId);
        $stmt->execute();
        $found = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        return (bool) $found;
    }

    // ----- تسوية جدول واحد: تُرجع [idMap (tempId/id وارد => id حقيقي), error] -----
    function reconcile_org_unit_table(
        $conn, $table, $universityId, $userId, $incomingRows,
        $mutableCols, $extraColBuilder, $existingRowsErrorCode
    ) {
        // جلب المعرّفات الحقيقية الموجودة حالياً لهذه الجامعة في هذا الجدول
        $existingIds = [];
        $stmt = $conn->prepare("SELECT id FROM `$table` WHERE university_id = ? AND deleted_at IS NULL");
        $stmt->bind_param('i', $universityId);
        $stmt->execute();
        $res = $stmt->get_result();
        while ($r = $res->fetch_assoc()) { $existingIds[(int) $r['id']] = true; }
        $stmt->close();

        $seenIds = []; // المعرّفات الحقيقية التي "لمسها" هذا الطلب (تبقى غير محذوفة)
        $idMap = [];   // tempId/معرّف وارد من العميل => معرّف حقيقي (جديد أو موجود)

        foreach ($incomingRows as $i => $row) {
            $rawId = $row['id'] ?? null;
            $isRealExistingId = is_numeric($rawId) && (int) $rawId > 0 && isset($existingIds[(int) $rawId]);

            if ($rawId !== null && $rawId !== '' && is_numeric($rawId) && (int) $rawId > 0 && !$isRealExistingId) {
                // معرّف رقمي حقيقي لكنه لا ينتمي لهذه الجامعة (مزوَّر/جامعة
                // أخرى) — رفض صريح، وليس معاملته كصف جديد صامتاً
                return [null, $existingRowsErrorCode];
            }

            [$extraCols, $extraTypes, $extraVals] = $extraColBuilder($row, $idMap, $i);
            if ($extraCols === false) {
                // مرجع أب لا ينتمي لهذه الجامعة
                return [null, 'invalid_parent_unit_reference'];
            }

            if ($isRealExistingId) {
                $realId = (int) $rawId;
                $setParts = [];
                $types = '';
                $vals = [];
                foreach ($mutableCols as $col) {
                    $setParts[] = "`$col` = ?";
                    $types .= 's';
                    $vals[] = (string) ($row[$col] ?? '');
                }
                foreach ($extraCols as $idx => $col) {
                    $setParts[] = "`$col` = ?";
                    $types .= $extraTypes[$idx];
                    $vals[] = $extraVals[$idx];
                }
                $setParts[] = "sort_order = ?";
                $types .= 'i';
                $vals[] = $i;

                $types .= 'ii';
                $vals[] = $realId;
                $vals[] = $universityId;

                $sql = "UPDATE `$table` SET " . implode(', ', $setParts) . " WHERE id = ? AND university_id = ? AND deleted_at IS NULL";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param($types, ...$vals);
                if (!$stmt->execute()) {
                    return [null, 'update_failed:' . $stmt->error];
                }
                if ($stmt->affected_rows === 0) {
                    // كان يُفترض أن يطابق (existingIds تحقّق منه أعلاه) — لو لم
                    // يحدث ذلك فهذا يعني حالة سباق نادرة، نُعامله كخطأ صريح
                    // بدل الصمت (القيم قد تكون مطابقة فعلاً فلا يوجد تغيير،
                    // وهذا مقبول — لا نفشل فقط لعدم تغيّر شيء)
                }
                $stmt->close();
                $seenIds[$realId] = true;
                $clientKey = (string) ($row['id'] ?? $row['tempId'] ?? $i);
                $idMap[$clientKey] = $realId;
            } else {
                // صف جديد بالكامل
                $insertCols = array_merge($mutableCols, $extraCols, ['sort_order', 'university_id', 'user_id']);
                $placeholders = implode(', ', array_fill(0, count($insertCols), '?'));
                $insertColsQuoted = implode(', ', array_map(fn($c) => "`$c`", $insertCols));

                $types = str_repeat('s', count($mutableCols)) . $extraTypes . 'iii';
                $vals = [];
                foreach ($mutableCols as $col) { $vals[] = (string) ($row[$col] ?? ''); }
                foreach ($extraVals as $v) { $vals[] = $v; }
                $vals[] = $i;
                $vals[] = $universityId;
                $vals[] = $userId;

                $sql = "INSERT INTO `$table` ($insertColsQuoted) VALUES ($placeholders)";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    return [null, 'insert_prepare_failed:' . $conn->error];
                }
                $stmt->bind_param($types, ...$vals);
                if (!$stmt->execute()) {
                    return [null, 'insert_failed:' . $stmt->error];
                }
                $newId = $conn->insert_id;
                $stmt->close();
                $clientKey = (string) ($row['id'] ?? $row['tempId'] ?? $i);
                $idMap[$clientKey] = $newId;
                $seenIds[$newId] = true;
            }
        }

        // ===== soft-delete لأي صف كان موجوداً ولم يظهر في هذا الطلب =====
        $toRemove = array_diff(array_keys($existingIds), array_keys($seenIds));
        if (!empty($toRemove)) {
            $placeholders = implode(',', array_fill(0, count($toRemove), '?'));
            $types = str_repeat('i', count($toRemove)) . 'i';
            $vals = array_values($toRemove);
            $vals[] = $universityId;
            $sql = "UPDATE `$table` SET deleted_at = NOW() WHERE id IN ($placeholders) AND university_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param($types, ...$vals);
            if (!$stmt->execute()) {
                return [null, 'soft_delete_failed:' . $stmt->error];
            }
            $stmt->close();
        }

        return [$idMap, null];
    }

    $failWith = function ($message) use ($conn) {
        $conn->rollback();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => $message]);
    };

    // ----- الحرم الجامعي: name, location -----
    [$campusIdMap, $err] = reconcile_org_unit_table(
        $conn, 'university_campuses', $universityId, $userId, $campuses,
        ['name', 'location'],
        function ($row, $idMap, $i) { return [[], '', []]; },
        'invalid_org_unit_reference'
    );
    if ($err) { $failWith($err); }

    // ----- الكليات: name + campus_id (اختياري، يُحل عبر campusIdMap أو
    // معرّف حقيقي موجود مسبقاً — يُتحقَّق من ملكيته لنفس الجامعة) -----
    [$collegeIdMap, $err] = reconcile_org_unit_table(
        $conn, 'university_colleges', $universityId, $userId, $colleges,
        ['name'],
        function ($row, $idMap, $i) use ($conn, $universityId, $campusIdMap) {
            $campusClientId = $row['campus_id'] ?? null;
            if ($campusClientId === null || $campusClientId === '') {
                return [['campus_id'], 'i', [null]];
            }
            $key = (string) $campusClientId;
            if (isset($campusIdMap[$key])) {
                return [['campus_id'], 'i', [$campusIdMap[$key]]];
            }
            // معرّف حرم جامعي موجود مسبقاً (لم يُلمَس بهذا الطلب) — تحقق ملكيته
            if (is_numeric($campusClientId) && verify_parent_ownership($conn, 'university_campuses', (int) $campusClientId, $universityId)) {
                return [['campus_id'], 'i', [(int) $campusClientId]];
            }
            return [false, null, null];
        },
        'invalid_org_unit_reference'
    );
    if ($err) { $failWith($err); }

    // ----- الأقسام: name + college_id (تحقق ملكية مماثل) -----
    [$departmentIdMap, $err] = reconcile_org_unit_table(
        $conn, 'university_departments', $universityId, $userId, $departments,
        ['name'],
        function ($row, $idMap, $i) use ($conn, $universityId, $collegeIdMap) {
            $collegeClientId = $row['college_id'] ?? null;
            if ($collegeClientId === null || $collegeClientId === '') {
                return [false, null, null]; // college_id إلزامي (NOT NULL في المخطط)
            }
            $key = (string) $collegeClientId;
            if (isset($collegeIdMap[$key])) {
                return [['college_id'], 'i', [$collegeIdMap[$key]]];
            }
            if (is_numeric($collegeClientId) && verify_parent_ownership($conn, 'university_colleges', (int) $collegeClientId, $universityId)) {
                return [['college_id'], 'i', [(int) $collegeClientId]];
            }
            return [false, null, null];
        },
        'invalid_org_unit_reference'
    );
    if ($err) { $failWith($err); }

    // ----- المراكز البحثية: name + research_areas(json) + parent_unit_type/id -----
    $allowedParentTypes = ['university', 'campus', 'college', 'department'];
    $parentCheckTables = [
        'campus' => 'university_campuses',
        'college' => 'university_colleges',
        'department' => 'university_departments',
    ];
    $parentIdMaps = [
        'campus' => $campusIdMap,
        'college' => $collegeIdMap,
        'department' => $departmentIdMap,
    ];

    [$researchCenterIdMap, $err] = reconcile_org_unit_table(
        $conn, 'university_research_centers', $universityId, $userId, $researchCenters,
        ['name'],
        function ($row, $idMap, $i) use ($conn, $universityId, $allowedParentTypes, $parentCheckTables, $parentIdMaps) {
            $parentType = trim((string) ($row['parent_unit_type'] ?? 'university'));
            if (!in_array($parentType, $allowedParentTypes, true)) $parentType = 'university';

            $areas = is_array($row['research_areas'] ?? null) ? array_values(array_filter(array_map('trim', $row['research_areas']))) : [];
            $areasJson = json_encode($areas, JSON_UNESCAPED_UNICODE);

            if ($parentType === 'university') {
                return [['parent_unit_type', 'parent_unit_id', 'research_areas'], 'sis', [$parentType, null, $areasJson]];
            }

            $parentClientId = $row['parent_unit_id'] ?? null;
            if ($parentClientId === null || $parentClientId === '') {
                return [false, null, null];
            }
            $key = (string) $parentClientId;
            $map = $parentIdMaps[$parentType];
            if (isset($map[$key])) {
                return [['parent_unit_type', 'parent_unit_id', 'research_areas'], 'sis', [$parentType, $map[$key], $areasJson]];
            }
            $checkTbl = $parentCheckTables[$parentType];
            if (is_numeric($parentClientId) && verify_parent_ownership($conn, $checkTbl, (int) $parentClientId, $universityId)) {
                return [['parent_unit_type', 'parent_unit_id', 'research_areas'], 'sis', [$parentType, (int) $parentClientId, $areasJson]];
            }
            return [false, null, null];
        },
        'invalid_org_unit_reference'
    );
    if ($err) { $failWith($err); }

    log_activity($conn, $userId, 'university_profile_update', 'university_profile', 'تحديث ملف الجامعة البحثية', 'University research profile updated');

    $conn->commit();
    $conn->close();

    jsonResponse(['status' => 'success', 'message' => 'University profile saved successfully']);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->rollback();
        $conn->close();
    }
    error_log('SAVE_UNIVERSITY_PROFILE ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to save university profile']);
}
