<?php
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
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    $userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;
    if ($userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'user_id is required']);
    }

    $stmt = $conn->prepare(
        "SELECT notifications_email, notifications_sms, two_factor_enabled, language
         FROM user_settings WHERE user_id = ? LIMIT 1"
    );
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $stmt->close();
    $conn->close();

    // ✅ لا صف بعد؟ نُرجع القيم الافتراضية (نفس ما بتصميم الواجهة الوهمي الحالي)
    $data = $row ?: [
        'notifications_email' => 1,
        'notifications_sms' => 0,
        'two_factor_enabled' => 0,
        'language' => 'ar',
    ];

    jsonResponse([
        'status' => 'success',
        'data' => [
            'notifications_email' => (bool) $data['notifications_email'],
            'notifications_sms' => (bool) $data['notifications_sms'],
            'two_factor_enabled' => (bool) $data['two_factor_enabled'],
            'language' => $data['language'],
        ],
    ]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_SETTINGS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load settings']);
}
