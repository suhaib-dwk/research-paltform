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
    if (!$roleKey) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'invalid_user']);
    }
    if ($roleKey !== 'university') {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'unsupported_role']);
    }

    // ===== لا نعتبر عدم وجود صف بجدول university_profiles خطأ — أول زيارة =====
    // للصفحة، الدالة المشتركة ترجع قيمًا افتراضية (profile_status = draft، مصفوفات فارغة).
    $profile = get_university_profile_data($conn, $userId);

    $conn->close();

    jsonResponse(['status' => 'success', 'data' => $profile]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_UNIVERSITY_PROFILE ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load university profile']);
}
