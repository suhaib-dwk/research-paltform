<?php
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once('a01_connect.php');
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

$stmt = $conn->prepare(
    "SELECT id, correspondence_type, notes, file_name, file_size, file_ext,
            status, result_notes, result_file_name, result_file_path, result_file_size, created_at
     FROM correspondence_requests WHERE user_id = ? ORDER BY created_at DESC"
);
$stmt->bind_param('i', $userId);
$stmt->execute();
$res = $stmt->get_result();

$typeLabels = [
    'cover_letter' => ['ar' => 'رسالة تغطية', 'en' => 'Cover Letter'],
    'response_to_reviewers' => ['ar' => 'رد على الملاحظات', 'en' => 'Rebuttal Letter'],
    'withdrawal' => ['ar' => 'رسالة سحب', 'en' => 'Withdrawal Letter'],
    'revision' => ['ar' => 'رسالة تنقيح', 'en' => 'Revision Letter'],
    'inquiry' => ['ar' => 'رسالة استفسار', 'en' => 'Inquiry Letter'],
    'general' => ['ar' => 'عام', 'en' => 'General'],
];

$requests = [];
while ($row = $res->fetch_assoc()) {
    $type = $typeLabels[$row['correspondence_type']] ?? ['ar' => $row['correspondence_type'], 'en' => $row['correspondence_type']];
    $requests[] = [
        'id' => (int) $row['id'],
        'correspondence_type' => $row['correspondence_type'],
        'notes' => $row['notes'],
        'file_name' => $row['file_name'],
        'file_size' => $row['file_size'] !== null ? (int) $row['file_size'] : null,
        'file_ext' => $row['file_ext'],
        'status' => $row['status'],
        'result_notes' => $row['result_notes'],
        'result_file_name' => $row['result_file_name'],
        'result_file_path' => $row['result_file_path'],
        'result_file_size' => $row['result_file_size'] !== null ? (int) $row['result_file_size'] : null,
        'meta_ar' => $type['ar'],
        'meta_en' => $type['en'],
        'date' => substr($row['created_at'], 0, 10),
    ];
}
$stmt->close();
$conn->close();

echo json_encode(["status" => "success", "data" => $requests], JSON_UNESCAPED_UNICODE);
