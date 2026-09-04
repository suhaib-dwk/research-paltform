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
    "SELECT id, research_title, review_type, academic_level, parent_request_id,
            file_name, file_size, file_ext, status, progress, score,
            info_needed_ar, info_needed_en, revision_note_ar, revision_note_en,
            reviewed_file_name, reviewed_file_path, reviewed_file_size, created_at
     FROM review_requests WHERE user_id = ? ORDER BY created_at DESC"
);
$stmt->bind_param('i', $userId);
$stmt->execute();
$res = $stmt->get_result();

$typeLabels = [
    'initial' => ['ar' => 'تحكيم أولي', 'en' => 'Initial Review'],
    'expert' => ['ar' => 'تحكيم خبير', 'en' => 'Expert Review'],
    'final' => ['ar' => 'تحكيم نهائي', 'en' => 'Final Review'],
];
$levelLabels = [
    'bachelor' => ['ar' => 'بكالوريوس', 'en' => "Bachelor's"],
    'master' => ['ar' => 'ماجستير', 'en' => "Master's"],
    'phd' => ['ar' => 'دكتوراه', 'en' => 'PhD'],
];

$requests = [];
while ($row = $res->fetch_assoc()) {
    $type = $typeLabels[$row['review_type']] ?? ['ar' => $row['review_type'], 'en' => $row['review_type']];
    $level = $levelLabels[$row['academic_level']] ?? ['ar' => $row['academic_level'], 'en' => $row['academic_level']];
    $requests[] = [
        'id' => (int) $row['id'],
        'title_ar' => $row['research_title'],
        'title_en' => $row['research_title'],
        'review_type' => $row['review_type'],
        'academic_level' => $row['academic_level'],
        'parent_request_id' => $row['parent_request_id'] !== null ? (int) $row['parent_request_id'] : null,
        'file_name' => $row['file_name'],
        'file_size' => $row['file_size'] !== null ? (int) $row['file_size'] : null,
        'file_ext' => $row['file_ext'],
        'status' => $row['status'],
        'progress' => (int) $row['progress'],
        'score' => $row['score'] !== null ? (float) $row['score'] : null,
        'info_needed_ar' => $row['info_needed_ar'],
        'info_needed_en' => $row['info_needed_en'],
        'revision_note_ar' => $row['revision_note_ar'],
        'revision_note_en' => $row['revision_note_en'],
        'reviewed_file_name' => $row['reviewed_file_name'],
        'reviewed_file_path' => $row['reviewed_file_path'],
        'reviewed_file_size' => $row['reviewed_file_size'] !== null ? (int) $row['reviewed_file_size'] : null,
        'meta_ar' => $type['ar'] . ' · ' . $level['ar'],
        'meta_en' => $type['en'] . ' · ' . $level['en'],
        'date' => substr($row['created_at'], 0, 10),
    ];
}
$stmt->close();
$conn->close();

echo json_encode(["status" => "success", "data" => $requests], JSON_UNESCAPED_UNICODE);
