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

try {
    require_once('a01_connect.php');
    require_once('a03_helpers.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    $userId = isset($_POST['user_id']) ? (int) $_POST['user_id'] : 0;
    if ($userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'user_id is required']);
    }

    $notifEmail = isset($_POST['notifications_email']) && $_POST['notifications_email'] === 'true' ? 1 : 0;
    $notifSms   = isset($_POST['notifications_sms']) && $_POST['notifications_sms'] === 'true' ? 1 : 0;
    $twoFactor  = isset($_POST['two_factor_enabled']) && $_POST['two_factor_enabled'] === 'true' ? 1 : 0;
    $language   = in_array(($_POST['language'] ?? ''), ['ar', 'en'], true) ? $_POST['language'] : 'ar';

    $stmt = $conn->prepare(
        "INSERT INTO user_settings (user_id, notifications_email, notifications_sms, two_factor_enabled, language)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            notifications_email = VALUES(notifications_email),
            notifications_sms = VALUES(notifications_sms),
            two_factor_enabled = VALUES(two_factor_enabled),
            language = VALUES(language)"
    );
    $stmt->bind_param('iiiis', $userId, $notifEmail, $notifSms, $twoFactor, $language);

    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Save failed', 'debug' => $err]);
    }
    $stmt->close();

    log_activity($conn, $userId, 'settings_update', 'account', 'تم تحديث الإعدادات', 'Settings updated');

    $conn->close();

    jsonResponse(['status' => 'success', 'data' => [
        'notifications_email' => (bool) $notifEmail,
        'notifications_sms' => (bool) $notifSms,
        'two_factor_enabled' => (bool) $twoFactor,
        'language' => $language,
    ]]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('SAVE_SETTINGS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to save settings']);
}
