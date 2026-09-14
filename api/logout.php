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

try {
    require_once('a01_connect.php');
    $conn = new mysqli($host, $username, $password, $db_name);
    if (!$conn->connect_error) {
        $conn->set_charset('utf8mb4');
    }

    // ===== a04_auth.php يبدأ الجلسة تلقائياً عند require — لا حاجة لفرض
    // مصادقة هنا: تسجيل الخروج آمن ومثالي أن يكون بلا حالة فشل، حتى لو
    // لم تكن هناك جلسة فعلية أصلاً (idempotent) =====
    require_once('a04_auth.php');

    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();

    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }

    jsonResponse(['status' => 'success']);

} catch (Throwable $e) {
    error_log('LOGOUT ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    // تسجيل الخروج يُعتبر ناجحاً دائماً من منظور العميل — حتى مع خطأ داخلي
    jsonResponse(['status' => 'success']);
}
