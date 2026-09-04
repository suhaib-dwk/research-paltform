<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once('a01_connect.php');
$conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}
$conn->set_charset('utf8mb4');

$entityId = isset($_GET['entity_id']) ? (int) $_GET['entity_id'] : 0;
$period   = isset($_GET['period']) ? trim($_GET['period']) : '';

if ($entityId <= 0 || $period === '') {
    echo json_encode(['status' => 'error', 'message' => 'entity_id and period are required']);
    exit;
}

// الوزن الرسمي لمعيار البحث العلمي ضمن الاعتماد المؤسسي العراقي
$standardWeight = 24.0;

// ===== عدد مؤشرات كل عنصر + مجموع درجاتها القصوى الرسمية (max_score) =====
// ⚠️ نظام الدرجات الموزون: كل مؤشر له سقف حقيقي مختلف بدل 100 موحّد،
// لذا نحتاج مجموع max_score لكل عنصر (element_max_score) وليس فقط عدّها.
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
        'score_sum' => 0.0,        // مجموع النقاط الفعلية للمؤشرات المُجابة فقط
        'max_score_answered' => 0.0, // مجموع السقوف القصوى لنفس المؤشرات المُجابة فقط
        'element_score' => 0.0,
    ];
}

// ===== جمع الدرجات المُدخلة لهذه الجهة والفترة، مصنّفة حسب العنصر =====
$stmt = $conn->prepare(
    "SELECT i.element_id, r.score, i.max_score
     FROM academic_quality_entity_responses r
     JOIN academic_quality_indicators i ON i.id = r.indicator_id
     WHERE r.entity_id = ? AND r.reporting_period = ?"
);
$stmt->bind_param('is', $entityId, $period);
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

// ===== حساب درجة كل عنصر (نسبة مرجّحة: مجموع النقاط الفعلية / مجموع السقوف، من 100) =====
// المؤشرات غير المُدخلة لا تُحتسب صفرًا هنا كي لا يُعاقَب عنصر لم يُبدأ العمل عليه بعد،
// لكن يظهر "answered_indicators/total_indicators" لتوضيح نسبة الإكمال في الواجهة.
$totalIndicators = 0;
$totalAnswered = 0;
$standardScoreSum = 0.0;      // مجموع النقاط الفعلية عبر كل المعيار (للمؤشرات المُجابة)
$standardMaxScoreSum = 0.0;   // مجموع السقوف القصوى لنفس هذه المؤشرات

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

// ===== درجة المعيار = نسبة مرجّحة (مجموع النقاط الفعلية / مجموع السقوف) لكل العناصر المُجابة =====
$standardScore = $standardMaxScoreSum > 0 ? round(($standardScoreSum / $standardMaxScoreSum) * 100, 2) : 0.0;
$contribution = round($standardScore * ($standardWeight / 100), 2);
$completionRate = $totalIndicators > 0 ? round(($totalAnswered / $totalIndicators) * 100, 1) : 0.0;

echo json_encode([
    'status' => 'success',
    'data' => [
        'entity_id' => $entityId,
        'reporting_period' => $period,
        'standard_score' => $standardScore,
        'standard_weight_percent' => $standardWeight,
        'contribution_to_institutional_quality' => $contribution,
        'completion_rate_percent' => $completionRate,
        'total_indicators' => $totalIndicators,
        'answered_indicators' => $totalAnswered,
        'elements' => array_values($elements),
    ],
], JSON_UNESCAPED_UNICODE);
