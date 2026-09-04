<?php
// =====================================================================
// submit_review.php — تقديم طلب تحكيم جديد (services/ReviewServicePage.jsx)
// ⚠️ لا يخلط مع submit_review_score.php (إنهاء تحكيم بدرجة من طرف المُحكِّم،
// يخدم dashboard/ReviewsPage.jsx على جدول reviews المنفصل تماماً).
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
$researchTitle = trim($_POST['research_title'] ?? '');
$reviewType = trim($_POST['review_type'] ?? '');
$academicLevel = trim($_POST['academic_level'] ?? '');
$notes = trim($_POST['notes'] ?? '');
$parentRequestId = isset($_POST['parent_request_id']) && $_POST['parent_request_id'] !== '' ? (int) $_POST['parent_request_id'] : null;

if ($userId <= 0) {
    echo json_encode(["status" => "error", "message" => "unauthorized"]);
    exit();
}
if ($researchTitle === '') {
    echo json_encode(["status" => "error", "message" => "research_title_required"]);
    exit();
}
if (mb_strlen($researchTitle) > 500) {
    echo json_encode(["status" => "error", "message" => "research_title_too_long"]);
    exit();
}
if (!in_array($reviewType, ['initial', 'expert', 'final'], true)) {
    echo json_encode(["status" => "error", "message" => "invalid_review_type"]);
    exit();
}
if (!in_array($academicLevel, ['bachelor', 'master', 'phd'], true)) {
    echo json_encode(["status" => "error", "message" => "invalid_academic_level"]);
    exit();
}

// ✅ نفس قيود allowedLevels بالفرونت إند: expert/final غير متاحة لـ bachelor
$allowedLevelsByType = [
    'initial' => ['bachelor', 'master', 'phd'],
    'expert' => ['master', 'phd'],
    'final' => ['master', 'phd'],
];
if (!in_array($academicLevel, $allowedLevelsByType[$reviewType], true)) {
    echo json_encode(["status" => "error", "message" => "review_type_not_allowed_for_level"]);
    exit();
}

$needsParent = $reviewType !== 'initial';

$fileName = null;
$filePath = null;
$fileSize = null;
$fileExt = null;

if ($needsParent) {
    // ===== expert/final: يجب اختيار طلب أب مكتمل من النوع السابق =====
    if (!$parentRequestId) {
        echo json_encode(["status" => "error", "message" => "parent_request_not_found"]);
        exit();
    }
    $sourceType = $reviewType === 'expert' ? 'initial' : 'expert';
    $stmt = $conn->prepare(
        "SELECT id FROM review_requests WHERE id = ? AND user_id = ? AND review_type = ? AND status = 'completed' LIMIT 1"
    );
    $stmt->bind_param('iis', $parentRequestId, $userId, $sourceType);
    $stmt->execute();
    $found = $stmt->get_result()->num_rows > 0;
    $stmt->close();
    if (!$found) {
        $conn->close();
        echo json_encode(["status" => "error", "message" => "parent_request_not_found"]);
        exit();
    }
} else {
    // ===== initial: يجب رفع ملف =====
    if (!isset($_FILES['file']) || $_FILES['file']['error'] != 0) {
        echo json_encode(["status" => "error", "message" => "file_required"]);
        exit();
    }
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

    $uploadDir = '../uploads/review_requests/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $fileName = 'review_' . $userId . '_' . time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
    $targetPath = $uploadDir . $fileName;
    if (!move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
        echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
        exit();
    }
    $filePath = 'uploads/review_requests/' . $fileName;
    $fileSize = $_FILES['file']['size'];
    $fileName = $originalName;
}

$stmt = $conn->prepare(
    "INSERT INTO review_requests
        (user_id, research_title, review_type, academic_level, parent_request_id, notes,
         file_name, file_path, file_size, file_ext, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')"
);
$stmt->bind_param('isssisssis', $userId, $researchTitle, $reviewType, $academicLevel, $parentRequestId, $notes, $fileName, $filePath, $fileSize, $fileExt);

if (!$stmt->execute()) {
    $err = $stmt->error;
    $stmt->close();
    $conn->close();
    echo json_encode(["status" => "error", "message" => "database_insert_failed", "debug" => $err]);
    exit();
}
$newId = $conn->insert_id;
$stmt->close();

log_activity($conn, $userId, 'review_request_submit', 'review', 'طلب تحكيم: ' . $researchTitle, 'Review request: ' . $researchTitle, 'review_requests', $newId);

$conn->close();

$typeLabels = ['initial' => ['ar' => 'تحكيم أولي', 'en' => 'Initial Review'], 'expert' => ['ar' => 'تحكيم خبير', 'en' => 'Expert Review'], 'final' => ['ar' => 'تحكيم نهائي', 'en' => 'Final Review']];
$levelLabels = ['bachelor' => ['ar' => 'بكالوريوس', 'en' => "Bachelor's"], 'master' => ['ar' => 'ماجستير', 'en' => "Master's"], 'phd' => ['ar' => 'دكتوراه', 'en' => 'PhD']];

echo json_encode([
    "status" => "success",
    "data" => [
        "id" => $newId,
        "research_title" => $researchTitle,
        "review_type" => $reviewType,
        "review_type_ar" => $typeLabels[$reviewType]['ar'],
        "review_type_en" => $typeLabels[$reviewType]['en'],
        "academic_level" => $academicLevel,
        "level_ar" => $levelLabels[$academicLevel]['ar'],
        "level_en" => $levelLabels[$academicLevel]['en'],
        "file_name" => $fileName,
        "file_size" => $fileSize,
        "file_ext" => $fileExt,
        "status" => "pending",
        "created_at" => date('Y-m-d H:i:s'),
    ],
], JSON_UNESCAPED_UNICODE);
