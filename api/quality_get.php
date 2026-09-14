<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
require_once('a02_cors.php');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

try {
    require_once('a01_connect.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    // ===== Stage A.5: university_id يُحلّ من الجلسة المُصادَق عليها، لا من
    // entity_id وارد من العميل — يمنع IDOR عبر تغيير هذا المعطى =====
    require_once('a04_auth.php');
    $universityId = require_university_access($conn);
    $period = isset($_GET['period']) ? trim($_GET['period']) : '';

    // ===== 1. جلب العناصر =====
    $elements = [];
    $res = $conn->query("SELECT id, element_number, title_ar, title_en, sort_order FROM academic_quality_elements ORDER BY sort_order ASC");
    while ($row = $res->fetch_assoc()) {
        $row['id'] = (int) $row['id'];
        $row['code'] = 'EL-' . str_pad((string) $row['element_number'], 2, '0', STR_PAD_LEFT);
        $row['name_ar'] = $row['title_ar'];
        $row['name_en'] = $row['title_en'];
        $row['indicators'] = [];
        $elements[$row['id']] = $row;
    }

    // ===== 2. جلب المؤشرات =====
    // ⚠️ max_score و title_en أُضيفا عبر db_quality_weighted_migration.sql (نظام الدرجات
    // الموزون الرسمي حسب دليل معايير الاعتماد المؤسسي — كل مؤشر له سقف حقيقي مختلف بدل 100 موحّد)
    $indicatorsById = [];
    $res = $conn->query("SELECT id, element_id, code, title_ar, title_en, indicator_type, max_score, description,
                                 required_inputs, required_evidence, module_name, sort_order
                          FROM academic_quality_indicators ORDER BY sort_order ASC");
    while ($row = $res->fetch_assoc()) {
        $row['id'] = (int) $row['id'];
        $row['element_id'] = (int) $row['element_id'];
        $row['max_score'] = (float) $row['max_score'];
        $row['response'] = null; // سيُملأ لاحقًا إن وُجدت استجابة
        $indicatorsById[$row['id']] = $row;
        if (isset($elements[$row['element_id']])) {
            $elements[$row['element_id']]['indicators'][] = $row['id'];
        }
    }

    // ===== 3. إن طُلبت جهة+فترة معينة، اجلب استجاباتها =====
    $responses = [];
    if ($period !== '') {
        $stmt = $conn->prepare(
            "SELECT indicator_id, actual_value, target_value, maturity_level, compliance_level,
                    assessment, evidence_quality, score, gap_notes, corrective_action,
                    owner_name, due_date, status, updated_at
             FROM academic_quality_entity_responses
             WHERE university_id = ? AND reporting_period = ?"
        );
        $stmt->bind_param('is', $universityId, $period);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $indId = (int) $row['indicator_id'];
            $row['indicator_id'] = $indId;
            $row['actual_value'] = $row['actual_value'] !== null ? (float) $row['actual_value'] : null;
            $row['target_value'] = $row['target_value'] !== null ? (float) $row['target_value'] : null;
            $row['maturity_level'] = $row['maturity_level'] !== null ? (int) $row['maturity_level'] : null;
            $row['evidence_quality'] = $row['evidence_quality'] !== null ? (int) $row['evidence_quality'] : null;
            $row['score'] = (float) $row['score'];
            $responses[$indId] = $row;

            if (isset($indicatorsById[$indId])) {
                $indicatorsById[$indId]['response'] = $row;
            }
        }
        $stmt->close();

        // جلب ملفات الأدلة المرتبطة (عبر id الاستجابات)
        if (!empty($responses)) {
            $stmt2 = $conn->prepare(
                "SELECT ef.response_id, ef.id, ef.file_name, ef.file_path, ef.uploaded_at, er.indicator_id
                 FROM academic_quality_evidence_files ef
                 JOIN academic_quality_entity_responses er ON er.id = ef.response_id
                 WHERE er.university_id = ? AND er.reporting_period = ?"
            );
            $stmt2->bind_param('is', $universityId, $period);
            $stmt2->execute();
            $res2 = $stmt2->get_result();
            while ($f = $res2->fetch_assoc()) {
                $indId = (int) $f['indicator_id'];
                if (isset($indicatorsById[$indId])) {
                    if (!isset($indicatorsById[$indId]['evidence_files'])) {
                        $indicatorsById[$indId]['evidence_files'] = [];
                    }
                    $indicatorsById[$indId]['evidence_files'][] = [
                        'id' => (int) $f['id'],
                        'file_name' => $f['file_name'],
                        'file_path' => $f['file_path'],
                        'uploaded_at' => $f['uploaded_at'],
                    ];
                }
            }
            $stmt2->close();
        }
    }

    // ===== 4. تركيب النتيجة النهائية بشكل شجرة عناصر → مؤشرات =====
    $out = [];
    foreach ($elements as $el) {
        $indicatorsForEl = [];
        foreach ($el['indicators'] as $indId) {
            $indicatorsForEl[] = $indicatorsById[$indId];
        }
        $out[] = [
            'id' => $el['id'],
            'code' => $el['code'],
            'name_ar' => $el['name_ar'],
            'name_en' => $el['name_en'],
            'sort_order' => (int) $el['sort_order'],
            'indicators' => $indicatorsForEl,
        ];
    }

    // ===== Stage A.5 / P8: وزن المعيار من قاعدة البيانات بدل ثابت PHP
    // مكرّر في هذا الملف وquality_summary.php — العمود موجود أصلاً بقيمة
    // صحيحة (weight_percent INT DEFAULT 24)، فقط كنّا لا نقرأه =====
    $weightPercent = 24; // احتياطي دفاعي فقط إن أرجع الاستعلام لا شيء
    $wRes = $conn->query("SELECT weight_percent FROM academic_quality_standard WHERE is_active = 1 LIMIT 1");
    if ($wRes && ($wRow = $wRes->fetch_assoc())) {
        $weightPercent = (int) $wRow['weight_percent'];
    }

    $conn->close();

    jsonResponse([
        'status' => 'success',
        'data' => [
            'standard' => [
                'code' => '06',
                'name_ar' => 'البحث العلمي',
                'name_en' => 'Scientific Research',
                'weight_percent' => $weightPercent,
                'indicators_count' => 44,
                // ⚠️ مجموع max_score لكل المؤشرات الـ44 حسب الدليل الرسمي (54+24+16+8+12+6+42+78)
                'total_max_score' => 240,
            ],
            'elements' => $out,
        ],
    ]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('QUALITY_GET ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load quality framework']);
}
