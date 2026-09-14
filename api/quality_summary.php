<?php
// =====================================================================
// quality_summary.php — Stage A.5: أُعيدت كتابته لإضافة المصادقة (كان
// بلا أي تحقق هوية إطلاقاً) ولمواءمة نمط الملفات الأخرى في api/
// (ob_start/try-catch/jsonResponse بدل echo json_encode مباشر بلا حماية).
// =====================================================================
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

    // ===== Stage A.5: university_id من الجلسة المُصادَق عليها، لا من
    // entity_id وارد من العميل =====
    require_once('a04_auth.php');
    $universityId = require_university_access($conn);

    $period = isset($_GET['period']) ? trim($_GET['period']) : '';
    if ($period === '') {
        jsonResponse(['status' => 'error', 'message' => 'period is required']);
    }

    // ===== Stage A.5 / P8: وزن المعيار من قاعدة البيانات بدل ثابت PHP =====
    $standardWeight = 24.0;
    $wRes = $conn->query("SELECT weight_percent FROM academic_quality_standard WHERE is_active = 1 LIMIT 1");
    if ($wRes && ($wRow = $wRes->fetch_assoc())) {
        $standardWeight = (float) $wRow['weight_percent'];
    }

    // ===== عدد مؤشرات كل عنصر + مجموع درجاتها القصوى الرسمية (max_score) =====
    $res = $conn->query(
        "SELECT e.id AS element_id, e.element_number, e.title_ar, e.title_en, e.sort_order,
                COUNT(i.id) AS total_indicators, COALESCE(SUM(i.max_score), 0) AS element_max_score
         FROM academic_quality_elements e
         LEFT JOIN academic_quality_indicators i ON i.element_id = e.id
         GROUP BY e.id
         ORDER BY e.sort_order ASC"
    );
    $elements = [];
    while ($row = $res->fetch_assoc()) {
        $elements[(int) $row['element_id']] = [
            'element_id' => (int) $row['element_id'],
            'code' => 'EL-' . str_pad((string) $row['element_number'], 2, '0', STR_PAD_LEFT),
            'name_ar' => $row['title_ar'],
            'name_en' => $row['title_en'],
            'sort_order' => (int) $row['sort_order'],
            'total_indicators' => (int) $row['total_indicators'],
            'element_max_score' => (float) $row['element_max_score'],
            'answered_indicators' => 0,
            'score_sum' => 0.0,
            'max_score_answered' => 0.0,
            'element_score' => 0.0,
        ];
    }

    // ===== جمع الدرجات المُدخلة لهذه الجامعة والفترة، مصنّفة حسب العنصر =====
    $stmt = $conn->prepare(
        "SELECT i.element_id, r.score, i.max_score
         FROM academic_quality_entity_responses r
         JOIN academic_quality_indicators i ON i.id = r.indicator_id
         WHERE r.university_id = ? AND r.reporting_period = ?"
    );
    $stmt->bind_param('is', $universityId, $period);
    $stmt->execute();
    $res = $stmt->get_result();
    while ($row = $res->fetch_assoc()) {
        $elId = (int) $row['element_id'];
        if (isset($elements[$elId])) {
            $elements[$elId]['answered_indicators'] += 1;
            $elements[$elId]['score_sum'] += (float) $row['score'];
            $elements[$elId]['max_score_answered'] += (float) $row['max_score'];
        }
    }
    $stmt->close();
    $conn->close();

    $totalIndicators = 0;
    $totalAnswered = 0;
    $standardScoreSum = 0.0;
    $standardMaxScoreSum = 0.0;

    foreach ($elements as $elId => $el) {
        $answered = $el['answered_indicators'];
        $totalIndicators += $el['total_indicators'];
        $totalAnswered += $answered;

        $elementScore = $el['max_score_answered'] > 0
            ? round(($el['score_sum'] / $el['max_score_answered']) * 100, 2)
            : 0.0;
        $elements[$elId]['element_score'] = $elementScore;

        if ($answered > 0) {
            $standardScoreSum += $el['score_sum'];
            $standardMaxScoreSum += $el['max_score_answered'];
        }
    }

    $standardScore = $standardMaxScoreSum > 0 ? round(($standardScoreSum / $standardMaxScoreSum) * 100, 2) : 0.0;
    $contribution = round($standardScore * ($standardWeight / 100), 2);
    $completionRate = $totalIndicators > 0 ? round(($totalAnswered / $totalIndicators) * 100, 1) : 0.0;

    jsonResponse([
        'status' => 'success',
        'data' => [
            'university_id' => $universityId,
            'reporting_period' => $period,
            'standard_score' => $standardScore,
            'standard_weight_percent' => $standardWeight,
            'contribution_to_institutional_quality' => $contribution,
            'completion_rate_percent' => $completionRate,
            'total_indicators' => $totalIndicators,
            'answered_indicators' => $totalAnswered,
            'elements' => array_values($elements),
        ],
    ]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('QUALITY_SUMMARY ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load quality summary']);
}
