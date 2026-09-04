<?php
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once('a01_connect.php');
require_once('a03_helpers.php');
$conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}
$conn->set_charset('utf8mb4');

$threadId = isset($_POST['thread_id']) ? (int) $_POST['thread_id'] : 0;
$userId = isset($_POST['user_id']) ? (int) $_POST['user_id'] : 0;
$body = trim($_POST['body'] ?? '');

if ($threadId <= 0 || $userId <= 0) {
    echo json_encode(["status" => "error", "message" => "thread_id and user_id are required"]);
    exit();
}
if ($body === '') {
    echo json_encode(["status" => "error", "message" => "body_required"]);
    exit();
}

// ===== تحقق ملكية المحادثة =====
$stmt = $conn->prepare("SELECT id FROM message_threads WHERE id = ? AND user_id = ? LIMIT 1");
$stmt->bind_param('ii', $threadId, $userId);
$stmt->execute();
if ($stmt->get_result()->num_rows === 0) {
    $stmt->close();
    $conn->close();
    echo json_encode(["status" => "error", "message" => "thread_not_found"]);
    exit();
}
$stmt->close();

// ===== رفع مرفق اختياري =====
$attachmentPath = null;
$attachmentName = null;
if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] == 0) {
    $uploadDir = '../uploads/messages/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $originalName = basename($_FILES['attachment']['name']);
    $fileName = 'msg_' . time() . '_' . $originalName;
    $targetPath = $uploadDir . $fileName;
    if (move_uploaded_file($_FILES['attachment']['tmp_name'], $targetPath)) {
        $attachmentPath = 'uploads/messages/' . $fileName;
        $attachmentName = $originalName;
    }
}

// ===== إدراج الرسالة =====
$stmt = $conn->prepare(
    "INSERT INTO messages (thread_id, sender_type, sender_id, body, attachment_path, attachment_name, is_read)
     VALUES (?, 'user', ?, ?, ?, ?, 1)"
);
$stmt->bind_param('iisss', $threadId, $userId, $body, $attachmentPath, $attachmentName);

if (!$stmt->execute()) {
    $err = $stmt->error;
    $stmt->close();
    $conn->close();
    echo json_encode(["status" => "error", "message" => "Save failed", "debug" => $err]);
    exit();
}
$newMessageId = $conn->insert_id;
$stmt->close();

// ===== تحديث آخر وقت رسالة بالمحادثة =====
$upd = $conn->prepare("UPDATE message_threads SET last_message_at = NOW() WHERE id = ?");
$upd->bind_param('i', $threadId);
$upd->execute();
$upd->close();

log_activity($conn, $userId, 'message_reply', 'messages', 'تم إرسال رد', 'Reply sent', 'message_threads', $threadId);

$conn->close();

echo json_encode([
    "status" => "success",
    "data" => [
        "id" => $newMessageId,
        "body" => $body,
        "attachment_path" => $attachmentPath,
        "attachment_name" => $attachmentName,
        "created_at" => date('Y-m-d H:i:s'),
    ],
], JSON_UNESCAPED_UNICODE);
