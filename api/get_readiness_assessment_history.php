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
    require_once('a03_helpers.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    // ===== Stage A.5: userId من الجلسة المُصادَق عليها، لا من ?user_id= =====
    require_once('a04_auth.php');
    $userId = require_authenticated_user($conn);

    $roleKey = get_user_role_key($conn, $userId);
    if (!$roleKey || $roleKey !== 'university') {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'unsupported_role']);
    }

    // ===== Stage A: "آخر تقييم" يعني آخر تقييم للمؤسسة نفسها (university_id)،
    // بصرف النظر عن أي عضو شغّله — وليس آخر تقييم شغّله هذا الشخص تحديدًا =====
    $universityId = get_university_id_for_user($conn, $userId);
    if (!$universityId) {
        $conn->close();
        jsonResponse(['status' => 'success', 'data' => null]);
    }

    // ===== آخر تحليل تشخيصي محفوظ فقط — لتفادي استدعاء الذكاء الاصطناعي
    // (مدفوع) في كل زيارة للصفحة؛ الاستدعاء الفعلي يحدث فقط عند ضغط
    // المستخدم على الزر. Stage A.5: يُقيَّد صراحةً بـ
    // assessment_type='ai_research_profile_diagnostic' — سجلات
    // legacy_readiness القديمة (نسب مئوية) لا تُعرَض أبداً هنا كأنها
    // تشخيص رسمي جديد، حتى لو كانت أحدث زمنياً من عدم وجود أي تشخيص جديد. =====
    $stmt = $conn->prepare(
        "SELECT model, response_json, created_at
         FROM university_readiness_assessments
         WHERE university_id = ? AND assessment_type = 'ai_research_profile_diagnostic'
         ORDER BY id DESC
         LIMIT 1"
    );
    $stmt->bind_param('i', $universityId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    $conn->close();

    if (!$row) {
        jsonResponse(['status' => 'success', 'data' => null]);
    }

    $result = json_decode($row['response_json'], true);
    if (!is_array($result)) {
        jsonResponse(['status' => 'success', 'data' => null]);
    }

    jsonResponse(['status' => 'success', 'data' => $result]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_READINESS_HISTORY ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load readiness history']);
}
