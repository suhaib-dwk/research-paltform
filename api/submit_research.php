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

$userId = isset($_POST['user_id']) ? (int) $_POST['user_id'] : 0;
$title = trim($_POST['title'] ?? '');
$abstract = trim($_POST['abstract'] ?? '');
$keywords = trim($_POST['keywords'] ?? '');
$field = trim($_POST['field'] ?? '');

if ($userId <= 0) {
    echo json_encode(["status" => "error", "message" => "user_id is required"]);
    exit();
}
if ($title === '') {
    echo json_encode(["status" => "error", "message" => "title_required"]);
    exit();
}
if ($abstract === '') {
    echo json_encode(["status" => "error", "message" => "abstract_required"]);
    exit();
}
if (!in_array($field, ['cs', 'eng', 'med'], true)) {
    echo json_encode(["status" => "error", "message" => "invalid_field"]);
    exit();
}
if (!isset($_FILES['file']) || $_FILES['file']['error'] != 0) {
    echo json_encode(["status" => "error", "message" => "file_required"]);
    exit();
}

$originalName = $_FILES['file']['name'];
$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
if (!in_array($ext, ['pdf', 'doc', 'docx'], true)) {
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

$uploadDir = '../uploads/researches/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$fileName = 'research_' . $userId . '_' . time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
$targetPath = $uploadDir . $fileName;

if (!move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
    echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
    exit();
}

$fileUrl = 'uploads/researches/' . $fileName;
$fileSize = $_FILES['file']['size'];

$stmt = $conn->prepare(
    "INSERT INTO researches (user_id, title_ar, abstract, keywords, field, file_name, file_path, file_size, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'under_review')"
);
$stmt->bind_param('issssssi', $userId, $title, $abstract, $keywords, $field, $originalName, $fileUrl, $fileSize);

if (!$stmt->execute()) {
    $err = $stmt->error;
    $stmt->close();
    $conn->close();
    echo json_encode(["status" => "error", "message" => "database_insert_failed", "debug" => $err]);
    exit();
}
$newId = $conn->insert_id;
$stmt->close();

log_activity($conn, $userId, 'research_submit', 'research', 'تقديم بحث: ' . $title, 'Research submitted: ' . $title, 'researches', $newId);

$conn->close();

echo json_encode([
    "status" => "success",
    "data" => [
        "id" => $newId,
        "title_ar" => $title,
        "title_en" => null,
        "status" => "under_review",
        "created_at" => date('Y-m-d H:i:s'),
    ],
], JSON_UNESCAPED_UNICODE);
