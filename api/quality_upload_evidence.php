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

$entityId    = isset($_POST['entity_id']) ? (int) $_POST['entity_id'] : 0;
$indicatorId = isset($_POST['indicator_id']) ? (int) $_POST['indicator_id'] : 0;
$period      = isset($_POST['reporting_period']) ? trim($_POST['reporting_period']) : '';

if ($entityId <= 0 || $indicatorId <= 0 || $period === '') {
    echo json_encode(["status" => "error", "message" => "entity_id, indicator_id and reporting_period are required"]);
    exit();
}

if (!isset($_FILES['evidence']) || $_FILES['evidence']['error'] != 0) {
    echo json_encode(["status" => "error", "message" => "No file uploaded or upload error"]);
    exit();
}

// ===== التأكد من وجود سجل استجابة لهذا المؤشر، أو إنشاء واحد فارغ =====
$stmt = $conn->prepare(
    "SELECT id FROM academic_quality_entity_responses WHERE entity_id = ? AND indicator_id = ? AND reporting_period = ? LIMIT 1"
);
$stmt->bind_param('iis', $entityId, $indicatorId, $period);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
    $responseId = (int) $row['id'];
    $stmt->close();
} else {
    $stmt->close();
    $insert = $conn->prepare(
        "INSERT INTO academic_quality_entity_responses (entity_id, indicator_id, reporting_period, assessment, score, status)
         VALUES (?, ?, ?, 'not_verified', 0, 'draft')"
    );
    $insert->bind_param('iis', $entityId, $indicatorId, $period);
    if (!$insert->execute()) {
        echo json_encode(["status" => "error", "message" => "Failed to create response record"]);
        exit();
    }
    $responseId = $conn->insert_id;
    $insert->close();
}

// ===== رفع الملف (نفس نمط manage_home_slides.php) =====
$uploadDir = '../uploads/quality_evidence/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        echo json_encode(["status" => "error", "message" => "Failed to create upload directory"]);
        exit();
    }
}

$originalName = basename($_FILES['evidence']['name']);
$fileName = 'evidence_' . time() . '_' . $originalName;
$targetPath = $uploadDir . $fileName;

if (move_uploaded_file($_FILES['evidence']['tmp_name'], $targetPath)) {
    $fileUrl = 'uploads/quality_evidence/' . $fileName;

    $stmt = $conn->prepare(
        "INSERT INTO academic_quality_evidence_files (response_id, file_name, file_path) VALUES (?, ?, ?)"
    );
    $stmt->bind_param('iss', $responseId, $originalName, $fileUrl);

    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Evidence uploaded",
            "data" => [
                "id" => $conn->insert_id,
                "file_name" => $originalName,
                "file_path" => $fileUrl,
            ],
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["status" => "error", "message" => "Database insert failed"]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
}

$conn->close();
