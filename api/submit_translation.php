<?php
// =====================================================================
// submit_translation.php — تقديم طلب ترجمة جديد (خدمة translation)
// ⚠️ العقد مطابق تماماً لما تتوقعه src/pages/services/TranslationPage.jsx
// الموجودة مسبقاً بالمشروع (source_lang/target_lang/urgency/english_variant).
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
$sourceLang = trim($_POST['source_lang'] ?? '');
$targetLang = trim($_POST['target_lang'] ?? '');
$urgency = trim($_POST['urgency'] ?? 'normal');
$englishVariant = trim($_POST['english_variant'] ?? '');
$notes = trim($_POST['notes'] ?? '');

if ($userId <= 0) {
    echo json_encode(["status" => "error", "message" => "unauthorized"]);
    exit();
}
if (!in_array($sourceLang, ['ar', 'en'], true)) {
    echo json_encode(["status" => "error", "message" => "invalid_source_lang"]);
    exit();
}
if (!in_array($targetLang, ['ar', 'en'], true)) {
    echo json_encode(["status" => "error", "message" => "invalid_target_lang"]);
    exit();
}
if ($sourceLang === $targetLang) {
    echo json_encode(["status" => "error", "message" => "same_lang_not_allowed"]);
    exit();
}
if (!in_array($urgency, ['normal', 'fast', 'urgent'], true)) {
    echo json_encode(["status" => "error", "message" => "invalid_urgency"]);
    exit();
}
if ($targetLang === 'en') {
    if ($englishVariant === '') {
        echo json_encode(["status" => "error", "message" => "english_variant_required"]);
        exit();
    }
    if (!in_array($englishVariant, ['us', 'uk', 'au', 'ca'], true)) {
        echo json_encode(["status" => "error", "message" => "invalid_english_variant"]);
        exit();
    }
} else {
    $englishVariant = null;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] != 0) {
    echo json_encode(["status" => "error", "message" => "file_required"]);
    exit();
}
$originalName = $_FILES['file']['name'];
$fileExt = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
if (!in_array($fileExt, ['pdf', 'doc', 'docx', 'txt', 'rtf'], true)) {
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
$fileName = 'translation_' . $userId . '_' . time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
$targetPath = $uploadDir . $fileName;
if (!move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
    echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
    exit();
}
$filePath = 'uploads/service_results/' . $fileName;
$fileSize = $_FILES['file']['size'];
$fileName = $originalName;

$stmt = $conn->prepare(
    "INSERT INTO translation_requests
        (user_id, source_lang, target_lang, urgency, english_variant, notes, file_name, file_path, file_size, file_ext, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')"
);
$stmt->bind_param('isssssssis', $userId, $sourceLang, $targetLang, $urgency, $englishVariant, $notes, $fileName, $filePath, $fileSize, $fileExt);

if (!$stmt->execute()) {
    $err = $stmt->error;
    $stmt->close();
    $conn->close();
    echo json_encode(["status" => "error", "message" => "database_insert_failed", "debug" => $err]);
    exit();
}
$newId = $conn->insert_id;
$stmt->close();

$langLabels = ['ar' => ['ar' => 'العربية', 'en' => 'Arabic'], 'en' => ['ar' => 'الإنجليزية', 'en' => 'English']];
$titleAr = 'ترجمة: ' . $langLabels[$sourceLang]['ar'] . ' ← ' . $langLabels[$targetLang]['ar'];
$titleEn = 'Translation: ' . $langLabels[$sourceLang]['en'] . ' -> ' . $langLabels[$targetLang]['en'];

log_activity($conn, $userId, 'service_request_submit', 'translation', $titleAr, $titleEn, 'translation_requests', $newId);

$conn->close();

echo json_encode([
    "status" => "success",
    "data" => [
        "id" => $newId,
        "title_ar" => $titleAr,
        "title_en" => $titleEn,
        "source_lang" => $sourceLang,
        "target_lang" => $targetLang,
        "english_variant" => $englishVariant,
        "urgency" => $urgency,
        "file_name" => $fileName,
        "file_size" => $fileSize,
        "file_ext" => $fileExt,
        "status" => "pending",
        "meta_ar" => $langLabels[$sourceLang]['ar'] . ' ← ' . $langLabels[$targetLang]['ar'],
        "meta_en" => $langLabels[$sourceLang]['en'] . ' -> ' . $langLabels[$targetLang]['en'],
        "created_at" => date('Y-m-d H:i:s'),
    ],
], JSON_UNESCAPED_UNICODE);
