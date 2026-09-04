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
    "SELECT id, source_lang, target_lang, urgency, english_variant, notes, file_name, file_size, file_ext,
            status, result_notes, result_file_name, result_file_path, result_file_size, created_at
     FROM translation_requests WHERE user_id = ? ORDER BY created_at DESC"
);
$stmt->bind_param('i', $userId);
$stmt->execute();
$res = $stmt->get_result();

$langLabels = ['ar' => ['ar' => 'العربية', 'en' => 'Arabic'], 'en' => ['ar' => 'الإنجليزية', 'en' => 'English']];

$requests = [];
while ($row = $res->fetch_assoc()) {
    $srcAr = $langLabels[$row['source_lang']]['ar'] ?? $row['source_lang'];
    $srcEn = $langLabels[$row['source_lang']]['en'] ?? $row['source_lang'];
    $tgtAr = $langLabels[$row['target_lang']]['ar'] ?? $row['target_lang'];
    $tgtEn = $langLabels[$row['target_lang']]['en'] ?? $row['target_lang'];
    $requests[] = [
        'id' => (int) $row['id'],
        'title_ar' => 'ترجمة: ' . $srcAr . ' ← ' . $tgtAr,
        'title_en' => 'Translation: ' . $srcEn . ' -> ' . $tgtEn,
        'source_lang' => $row['source_lang'],
        'target_lang' => $row['target_lang'],
        'urgency' => $row['urgency'],
        'english_variant' => $row['english_variant'],
        'notes' => $row['notes'],
        'file_name' => $row['file_name'],
        'file_size' => $row['file_size'] !== null ? (int) $row['file_size'] : null,
        'file_ext' => $row['file_ext'],
        'status' => $row['status'],
        'progress' => $row['status'] === 'in_progress' ? 50 : 0,
        'score' => null,
        'info_needed_ar' => null,
        'info_needed_en' => null,
        'revision_note_ar' => null,
        'revision_note_en' => null,
        'translated_file_name' => $row['result_file_name'],
        'translated_file_path' => $row['result_file_path'],
        'translated_file_size' => $row['result_file_size'] !== null ? (int) $row['result_file_size'] : null,
        'result_notes' => $row['result_notes'],
        'result_file_name' => $row['result_file_name'],
        'result_file_path' => $row['result_file_path'],
        'result_file_size' => $row['result_file_size'] !== null ? (int) $row['result_file_size'] : null,
        'meta_ar' => $srcAr . ' ← ' . $tgtAr,
        'meta_en' => $srcEn . ' -> ' . $tgtEn,
        'date' => substr($row['created_at'], 0, 10),
    ];
}
$stmt->close();
$conn->close();

echo json_encode(["status" => "success", "data" => $requests], JSON_UNESCAPED_UNICODE);
