<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
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

    $userId = isset($body['user_id']) ? (int) $body['user_id'] : 0;
    if ($userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'user_id is required']);
    }

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

    require_once('a01_connect.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

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

    // ===== 1) upsert university_profiles — الآن بمفتاح فريد جديد على
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

    // ===== 2) استراتيجية "استبدال كامل" للسجلات الفرعية — مؤقتة عمدًا لهذه
    // المرحلة فقط (Stage A). لا تُستخدم كأساس لأي مرجع خارجي مستقر بعد؛
    // قبل Stage B (Research Data Core) يجب تحويل هذه الجداول الأربعة إلى
    // إدراج-للجديد/تحديث-للموجود/حذف-فعلي-أو-ناعم-للمحذوف، لأن وحدات لاحقة
    // (باحثون، مشاريع، أدلة) ستُشير إلى هذه المعرّفات كمفاتيح خارجية ثابتة —
    // معرّفات تتغيّر بكل حفظ ستكسر تلك الإشارات.

    // --- حذف القديم بالترتيب المعاكس للاعتماديات (أبناء أولاً)، الآن عبر university_id ---
    foreach (['university_research_centers', 'university_departments', 'university_colleges', 'university_campuses'] as $tbl) {
        $stmt = $conn->prepare("DELETE FROM `$tbl` WHERE university_id = ?");
        $stmt->bind_param('i', $universityId);
        if (!$stmt->execute()) {
            $err = $stmt->error;
            $stmt->close();
            $conn->rollback();
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => "Clear $tbl failed", 'debug' => $err]);
        }
        $stmt->close();
    }

    // --- إدراج الحرم الجامعي، مع حفظ خريطة المعرف المؤقت (من الواجهة) -> المعرف الحقيقي الجديد ---
    $campusIdMap = []; // tempId (from client) => new DB id
    $stmt = $conn->prepare("INSERT INTO university_campuses (user_id, university_id, name, location, sort_order) VALUES (?, ?, ?, ?, ?)");
    foreach ($campuses as $i => $c) {
        $name = trim((string) ($c['name'] ?? ''));
        if ($name === '') continue;
        $location = trim((string) ($c['location'] ?? ''));
        $stmt->bind_param('iissi', $userId, $universityId, $name, $location, $i);
        if (!$stmt->execute()) {
            $err = $stmt->error;
            $stmt->close();
            $conn->rollback();
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'Insert campus failed', 'debug' => $err]);
        }
        $clientId = $c['id'] ?? $c['temp_id'] ?? $i;
        $campusIdMap[(string) $clientId] = $conn->insert_id;
    }
    $stmt->close();

    // --- إدراج الكليات، مع ربطها بمعرف الحرم الجامعي الحقيقي (إن وُجد) ---
    $collegeIdMap = [];
    $stmt = $conn->prepare("INSERT INTO university_colleges (user_id, university_id, campus_id, name, sort_order) VALUES (?, ?, ?, ?, ?)");
    foreach ($colleges as $i => $c) {
        $name = trim((string) ($c['name'] ?? ''));
        if ($name === '') continue;
        $campusClientId = $c['campus_id'] ?? null;
        $campusRealId = ($campusClientId !== null && isset($campusIdMap[(string) $campusClientId]))
            ? $campusIdMap[(string) $campusClientId]
            : null;
        $stmt->bind_param('iiisi', $userId, $universityId, $campusRealId, $name, $i);
        if (!$stmt->execute()) {
            $err = $stmt->error;
            $stmt->close();
            $conn->rollback();
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'Insert college failed', 'debug' => $err]);
        }
        $clientId = $c['id'] ?? $c['temp_id'] ?? $i;
        $collegeIdMap[(string) $clientId] = $conn->insert_id;
    }
    $stmt->close();

    // --- إدراج الأقسام، مع ربطها بمعرف الكلية الحقيقي ---
    $stmt = $conn->prepare("INSERT INTO university_departments (user_id, university_id, college_id, name, sort_order) VALUES (?, ?, ?, ?, ?)");
    foreach ($departments as $i => $d) {
        $name = trim((string) ($d['name'] ?? ''));
        $collegeClientId = $d['college_id'] ?? null;
        if ($name === '' || $collegeClientId === null || !isset($collegeIdMap[(string) $collegeClientId])) continue;
        $collegeRealId = $collegeIdMap[(string) $collegeClientId];
        $stmt->bind_param('iiisi', $userId, $universityId, $collegeRealId, $name, $i);
        if (!$stmt->execute()) {
            $err = $stmt->error;
            $stmt->close();
            $conn->rollback();
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'Insert department failed', 'debug' => $err]);
        }
    }
    $stmt->close();

    // --- المراكز البحثية: تحقق إلزامي من انتماء الوحدة الأب لنفس الجامعة ---
    // (يمنع تسرّب مراجع بين جامعات مختلفة — لا يعتمد على ثقة العميل إطلاقًا)
    $allowedParentTypes = ['university', 'campus', 'college', 'department'];
    $parentCheckTables = [
        'campus' => 'university_campuses',
        'college' => 'university_colleges',
        'department' => 'university_departments',
    ];
    foreach ($researchCenters as $rc) {
        $parentType = trim((string) ($rc['parent_unit_type'] ?? 'university'));
        if (!in_array($parentType, $allowedParentTypes, true)) $parentType = 'university';
        if ($parentType === 'university') continue; // لا حاجة لمعرف أب — الجامعة ذاتها مُستنتجة من university_id
        $parentId = isset($rc['parent_unit_id']) && $rc['parent_unit_id'] !== '' ? (int) $rc['parent_unit_id'] : null;
        if ($parentId === null) continue;
        $checkTbl = $parentCheckTables[$parentType];
        $chk = $conn->prepare("SELECT id FROM `$checkTbl` WHERE id = ? AND university_id = ? LIMIT 1");
        $chk->bind_param('ii', $parentId, $universityId);
        $chk->execute();
        $found = $chk->get_result()->fetch_assoc();
        $chk->close();
        if (!$found) {
            $conn->rollback();
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'invalid_parent_unit_reference']);
        }
    }

    // --- إدراج المراكز البحثية بعد التحقق ---
    $stmt = $conn->prepare("INSERT INTO university_research_centers (user_id, university_id, parent_unit_type, parent_unit_id, name, research_areas, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($researchCenters as $i => $rc) {
        $name = trim((string) ($rc['name'] ?? ''));
        if ($name === '') continue;
        $parentType = trim((string) ($rc['parent_unit_type'] ?? 'university'));
        if (!in_array($parentType, $allowedParentTypes, true)) $parentType = 'university';
        // ملاحظة: عند parent_unit_type = 'university' يُفرض parent_unit_id = null
        // دائمًا — الجامعة ذاتها مُستنتجة أصلًا من عمود university_id على هذا الصف،
        // فلا حاجة لمعرف بحث إضافي.
        $parentId = ($parentType === 'university')
            ? null
            : (isset($rc['parent_unit_id']) && $rc['parent_unit_id'] !== '' ? (int) $rc['parent_unit_id'] : null);
        $areas = is_array($rc['research_areas'] ?? null) ? array_values(array_filter(array_map('trim', $rc['research_areas']))) : [];
        $areasJson = json_encode($areas, JSON_UNESCAPED_UNICODE);
        $stmt->bind_param('iisissi', $userId, $universityId, $parentType, $parentId, $name, $areasJson, $i);
        if (!$stmt->execute()) {
            $err = $stmt->error;
            $stmt->close();
            $conn->rollback();
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'Insert research center failed', 'debug' => $err]);
        }
    }
    $stmt->close();

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
