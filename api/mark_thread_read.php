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
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    $threadId = isset($_POST['thread_id']) ? (int) $_POST['thread_id'] : 0;
    $userId = isset($_POST['user_id']) ? (int) $_POST['user_id'] : 0;

    if ($threadId <= 0 || $userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'thread_id and user_id are required']);
    }

    $stmt = $conn->prepare("UPDATE message_threads SET is_read = 1 WHERE id = ? AND user_id = ?");
    $stmt->bind_param('ii', $threadId, $userId);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    jsonResponse(['status' => 'success']);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('MARK_THREAD_READ ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to mark thread as read']);
}
