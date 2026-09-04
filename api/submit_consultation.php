<?php
// =====================================================================
// submit_consultation.php — تقديم طلب استشارة جديد (خدمة consultation)
// ⚠️ الاستثناء الوحيد بين الخدمات الثماني: الملف اختياري وليس إلزامياً.
// =====================================================================
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

$userId = isset($_POST['user_id']) ? (int) $_POST['user_id'] : 0;
$topic = trim($_POST['topic'] ?? '');
$preferredDatetime = trim($_POST['preferred_datetime'] ?? '');
$notes = trim($_POST['notes'] ?? '');

if ($userId <= 0) {
    echo json_encode(["status" => "error", "message" => "unauthorized"]);
    exit();
}
if ($topic === '') {
    echo json_encode(["status" => "error", "message" => "topic_required"]);
    exit();
}

$preferredDatetimeParam = null;
if ($preferredDatetime !== '') {
    $ts = strtotime($preferredDatetime);
    if ($ts === false) {
        echo json_encode(["status" => "error", "message" => "invalid_datetime"]);
        exit();
    }
    $preferredDatetimeParam = date('Y-m-d H:i:s', $ts);
}

$fileName = null;
$filePath = null;
$fileSize = null;
$fileExt = null;

if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
    $originalName = $_FILES['file']['name'];
    $fileExt = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    if (!in_array($fileExt, ['pdf', 'doc', 'docx'], true)) {
        echo json_encode(["status" => "error", "message" => "invalid_file_type"]);
        exit();
    }
    if ($_FILES['file']['size'] > 20 * 1024 * 1024) {
        echo json_encode(["status" => "error", "message" => "file_size_exceeded"]);
        exit();
    }
    if ($_FILES['file']['size'] === 0) {
        echo json_encode(["status" => "error", "message" => "file_empty"]);
        exit();
    }

    $uploadDir = '../uploads/service_results/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $fileName = 'consultation_' . $userId . '_' . time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
    $targetPath = $uploadDir . $fileName;
    if (!move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
        echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
        exit();
    }
    $filePath = 'uploads/service_results/' . $fileName;
    $fileSize = $_FILES['file']['size'];
    $fileName = $originalName;
}

$stmt = $conn->prepare(
    "INSERT INTO consultation_requests
        (user_id, topic, preferred_datetime, notes, file_name, file_path, file_size, file_ext, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')"
);
$stmt->bind_param('isssssis', $userId, $topic, $preferredDatetimeParam, $notes, $fileName, $filePath, $fileSize, $fileExt);

if (!$stmt->execute()) {
    $err = $stmt->error;
    $stmt->close();
    $conn->close();
    echo json_encode(["status" => "error", "message" => "database_insert_failed", "debug" => $err]);
    exit();
}
$newId = $conn->insert_id;
$stmt->close();

log_activity($conn, $userId, 'service_request_submit', 'consultation', 'طلب استشارة جديد: ' . $topic, 'New consultation request: ' . $topic, 'consultation_requests', $newId);

$conn->close();

echo json_encode([
    "status" => "success",
    "data" => ["id" => $newId, "status" => "pending", "created_at" => date('Y-m-d H:i:s')],
], JSON_UNESCAPED_UNICODE);
