<?php
// =====================================================================
// get_ai_provider_settings.php — جلب حالة إعدادات مزوّدي الذكاء الاصطناعي
// (OpenRouter / OpenAI) لعرضها في لوحة تحكم الأدمن.
//
// أمان: لا يُعاد المفتاح الحقيقي أو المشفّر أبدًا في الاستجابة — فقط
// آخر 4 خانات منه (api_key_last4) للتأكيد البصري أن مفتاحًا مُدخَل بالفعل،
// بالإضافة إلى حالة التفعيل والموديل المختار.
//
// وصول: super_admin فقط (يُتحقق عبر roles.key، نفس منطق get_user_role_key).
// =====================================================================

ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
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

    $userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;
    if ($userId <= 0) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'user_id is required']);
    }

    $roleKey = get_user_role_key($conn, $userId);
    if ($roleKey !== 'super_admin') {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'unauthorized']);
    }

    $result = $conn->query(
        "SELECT provider_key, is_enabled, api_key_last4, model FROM ai_provider_settings ORDER BY provider_key"
    );

    $providers = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $providers[] = [
                'provider_key' => $row['provider_key'],
                'is_enabled' => (bool) $row['is_enabled'],
                'has_key' => !empty($row['api_key_last4']),
                'api_key_last4' => $row['api_key_last4'],
                'model' => $row['model'],
            ];
        }
    }
    $conn->close();

    jsonResponse(['status' => 'success', 'data' => $providers]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_AI_PROVIDER_SETTINGS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load AI provider settings']);
}
