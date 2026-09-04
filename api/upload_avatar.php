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
if ($userId <= 0) {
    echo json_encode(["status" => "error", "message" => "user_id is required"]);
    exit();
}

if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] != 0) {
    echo json_encode(["status" => "error", "message" => "file_required"]);
    exit();
}

// ===== التحقق من الامتداد والحجم =====
$originalName = $_FILES['avatar']['name'];
$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
    echo json_encode(["status" => "error", "message" => "invalid_file_type"]);
    exit();
}
if ($_FILES['avatar']['size'] > 5 * 1024 * 1024) {
    echo json_encode(["status" => "error", "message" => "file_size_exceeded"]);
    exit();
}

// ===== جلب دور المستخدم لتحديد الجدول الصحيح =====
$roleKey = get_user_role_key($conn, $userId);
$fields = $roleKey ? get_profile_contact_fields($roleKey) : null;
if (!$fields) {
    $conn->close();
    echo json_encode(["status" => "error", "message" => "unsupported_role"]);
    exit();
}

// ===== رفع الملف (نفس نمط manage_home_slides.php / quality_upload_evidence.php) =====
$uploadDir = '../uploads/avatars/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        echo json_encode(["status" => "error", "message" => "Failed to create upload directory"]);
        exit();
    }
}

$fileName = 'avatar_' . $userId . '_' . time() . '.' . $ext;
$targetPath = $uploadDir . $fileName;

if (move_uploaded_file($_FILES['avatar']['tmp_name'], $targetPath)) {
    $fileUrl = 'uploads/avatars/' . $fileName;

    $stmt = $conn->prepare("UPDATE `{$fields['table']}` SET `{$fields['avatar_col']}` = ? WHERE user_id = ?");
    $stmt->bind_param('si', $fileUrl, $userId);

    if ($stmt->execute()) {
        log_activity($conn, $userId, 'avatar_update', 'account', 'تحديث الصورة الشخصية', 'Profile picture updated');
        echo json_encode([
            "status" => "success",
            "data" => ["avatar_path" => $fileUrl],
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["status" => "error", "message" => "Database update failed"]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
}

$conn->close();
