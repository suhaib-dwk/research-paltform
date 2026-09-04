<?php
// =====================================================================
// submit_template.php — تقديم طلب قالب مجلة جديد (خدمة template)
// ⚠️ لا ملف من الطالب — فقط اسم المجلة المطلوب قالبها.
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
$journalName = trim($_POST['journal_name'] ?? '');
$notes = trim($_POST['notes'] ?? '');

if ($userId <= 0) {
    echo json_encode(["status" => "error", "message" => "unauthorized"]);
    exit();
}
if ($journalName === '') {
    echo json_encode(["status" => "error", "message" => "journal_name_required"]);
    exit();
}
if (mb_strlen($journalName) > 500) {
    echo json_encode(["status" => "error", "message" => "journal_name_too_long"]);
    exit();
}

$stmt = $conn->prepare(
    "INSERT INTO template_requests (user_id, journal_name, notes, status) VALUES (?, ?, ?, 'pending')"
);
$stmt->bind_param('iss', $userId, $journalName, $notes);

if (!$stmt->execute()) {
    $err = $stmt->error;
    $stmt->close();
    $conn->close();
    echo json_encode(["status" => "error", "message" => "database_insert_failed", "debug" => $err]);
    exit();
}
$newId = $conn->insert_id;
$stmt->close();

log_activity($conn, $userId, 'service_request_submit', 'template', 'طلب قالب مجلة: ' . $journalName, 'Template request: ' . $journalName, 'template_requests', $newId);

$conn->close();

echo json_encode([
    "status" => "success",
    "data" => ["id" => $newId, "status" => "pending", "created_at" => date('Y-m-d H:i:s')],
], JSON_UNESCAPED_UNICODE);
