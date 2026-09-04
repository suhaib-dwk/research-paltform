<?php
// =====================================================================
// submit_service_result.php — رفع نتيجة الخدمة من طرف مقدّم الخدمة المُسنَد
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

$providerId = isset($_POST['provider_id']) ? (int) $_POST['provider_id'] : 0;
$serviceSlug = trim($_POST['service_slug'] ?? '');
$requestId = isset($_POST['request_id']) ? (int) $_POST['request_id'] : 0;
$resultNotes = trim($_POST['result_notes'] ?? '');

if ($providerId <= 0 || $requestId <= 0) {
    echo json_encode(["status" => "error", "message" => "unauthorized"]);
    exit();
}

$tableMap = get_service_table_map();
if (!isset($tableMap[$serviceSlug])) {
    echo json_encode(["status" => "error", "message" => "invalid_service_slug"]);
    exit();
}
$table = $tableMap[$serviceSlug];

// ✅ التحقق أن هذا الطلب مُسنَد فعلاً لهذا المقدّم تحديداً
$stmt = $conn->prepare("SELECT id FROM `$table` WHERE id = ? AND assigned_provider_id = ? LIMIT 1");
$stmt->bind_param('ii', $requestId, $providerId);
$stmt->execute();
$found = $stmt->get_result()->num_rows > 0;
$stmt->close();
if (!$found) {
    $conn->close();
    echo json_encode(["status" => "error", "message" => "not_assigned_to_you"]);
    exit();
}

$resultFileName = null;
$resultFilePath = null;
$resultFileSize = null;

if (isset($_FILES['result_file']) && $_FILES['result_file']['error'] == 0) {
    $originalName = $_FILES['result_file']['name'];
    $fileExt = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    if (!in_array($fileExt, ['pdf', 'doc', 'docx', 'zip'], true)) {
        echo json_encode(["status" => "error", "message" => "invalid_file_type"]);
        exit();
    }
    if ($_FILES['result_file']['size'] > 20 * 1024 * 1024) {
        echo json_encode(["status" => "error", "message" => "file_size_exceeded"]);
        exit();
    }
    if ($_FILES['result_file']['size'] === 0) {
        echo json_encode(["status" => "error", "message" => "file_empty"]);
        exit();
    }

    $uploadDir = '../uploads/service_results/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $resultFileName = 'result_' . $serviceSlug . '_' . $requestId . '_' . time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
    $targetPath = $uploadDir . $resultFileName;
    if (!move_uploaded_file($_FILES['result_file']['tmp_name'], $targetPath)) {
        echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
        exit();
    }
    $resultFilePath = 'uploads/service_results/' . $resultFileName;
    $resultFileSize = $_FILES['result_file']['size'];
    $resultFileName = $originalName;
}

$sql = "UPDATE `$table` SET status = 'completed', result_notes = ?, result_file_name = ?, result_file_path = ?, result_file_size = ? WHERE id = ? AND assigned_provider_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sssiii', $resultNotes, $resultFileName, $resultFilePath, $resultFileSize, $requestId, $providerId);
if (!$stmt->execute()) {
    $err = $stmt->error;
    $stmt->close();
    $conn->close();
    echo json_encode(["status" => "error", "message" => "database_update_failed", "debug" => $err]);
    exit();
}
$affected = $stmt->affected_rows;
$stmt->close();

if ($affected === 0) {
    $conn->close();
    echo json_encode(["status" => "error", "message" => "update_failed"]);
    exit();
}

log_activity($conn, $providerId, 'service_request_complete', $serviceSlug, 'تم إنهاء طلب خدمة', 'Service request completed', $table, $requestId);

$conn->close();

echo json_encode(["status" => "success", "data" => ["id" => $requestId, "status" => "completed"]], JSON_UNESCAPED_UNICODE);
