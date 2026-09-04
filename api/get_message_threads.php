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
        "SELECT t.id, t.subject_ar, t.subject_en, t.sender_type, t.is_read, t.last_message_at,
                (SELECT body FROM messages m WHERE m.thread_id = t.id ORDER BY m.created_at DESC LIMIT 1) AS last_body
         FROM message_threads t
         WHERE t.user_id = ?
         ORDER BY t.last_message_at DESC"
    );
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $res = $stmt->get_result();

    $threads = [];
    while ($row = $res->fetch_assoc()) {
        $threads[] = [
            'id' => (int) $row['id'],
            'subject_ar' => $row['subject_ar'],
            'subject_en' => $row['subject_en'],
            'sender' => $row['sender_type'],
            'read' => (bool) $row['is_read'],
            'date' => substr($row['last_message_at'], 0, 10),
            'last_body' => $row['last_body'],
        ];
    }
    $stmt->close();
    $conn->close();

    jsonResponse(['status' => 'success', 'data' => $threads]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_MESSAGE_THREADS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load message threads']);
}
