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

    $threadId = isset($_GET['thread_id']) ? (int) $_GET['thread_id'] : 0;
    $userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;

    if ($threadId <= 0 || $userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'thread_id and user_id are required']);
    }

    // ===== تحقق ملكية المحادثة =====
    $stmt = $conn->prepare("SELECT id FROM message_threads WHERE id = ? AND user_id = ? LIMIT 1");
    $stmt->bind_param('ii', $threadId, $userId);
    $stmt->execute();
    if ($stmt->get_result()->num_rows === 0) {
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'thread_not_found']);
    }
    $stmt->close();

    // ===== جلب كل الرسائل =====
    $stmt = $conn->prepare(
        "SELECT id, sender_type, body, attachment_path, attachment_name, created_at
         FROM messages WHERE thread_id = ? ORDER BY created_at ASC"
    );
    $stmt->bind_param('i', $threadId);
    $stmt->execute();
    $res = $stmt->get_result();

    $messages = [];
    while ($row = $res->fetch_assoc()) {
        $messages[] = [
            'id' => (int) $row['id'],
            'sender_type' => $row['sender_type'],
            'body' => $row['body'],
            'attachment_path' => $row['attachment_path'],
            'attachment_name' => $row['attachment_name'],
            'created_at' => $row['created_at'],
        ];
    }
    $stmt->close();

    // ===== تعليم المحادثة كمقروءة ضمنياً =====
    $upd = $conn->prepare("UPDATE message_threads SET is_read = 1 WHERE id = ?");
    $upd->bind_param('i', $threadId);
    $upd->execute();
    $upd->close();

    $conn->close();

    jsonResponse(['status' => 'success', 'data' => $messages]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_THREAD_MESSAGES ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load messages']);
}
