<?php
// =====================================================================
// accept_service_request.php — استلام طلب خدمة من طرف مقدّم خدمة (claim-based)
// تحديث ذرّي WHERE assigned_provider_id IS NULL + فحص affected_rows،
// حتى لا يستطيع مقدّمان استلام نفس الطلب في سباق تزامني.
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

// ✅ التحقق أن مقدّم الخدمة فعلاً مختص بهذه الخدمة
$stmt = $conn->prepare("SELECT 1 FROM service_provider_services WHERE user_id = ? AND service_slug = ? LIMIT 1");
$stmt->bind_param('is', $providerId, $serviceSlug);
$stmt->execute();
$isQualified = $stmt->get_result()->num_rows > 0;
$stmt->close();
if (!$isQualified) {
    $conn->close();
    echo json_encode(["status" => "error", "message" => "not_qualified_for_service"]);
    exit();
}

// ✅ الاستلام الذرّي: يتحول pending → assigned فقط إن كان لا يزال بلا مُسنَد
$sql = "UPDATE `$table` SET assigned_provider_id = ?, status = 'assigned' WHERE id = ? AND assigned_provider_id IS NULL AND status = 'pending'";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ii', $providerId, $requestId);
$stmt->execute();
$affected = $stmt->affected_rows;
$stmt->close();

if ($affected === 0) {
    // إما الطلب غير موجود أو تم استلامه بالفعل من طرف آخر
    $conn->close();
    echo json_encode(["status" => "error", "message" => "already_assigned"]);
    exit();
}

log_activity($conn, $providerId, 'service_request_accept', $serviceSlug, 'تم استلام طلب خدمة', 'Service request accepted', $table, $requestId);

$conn->close();

echo json_encode(["status" => "success", "data" => ["id" => $requestId, "status" => "assigned"]], JSON_UNESCAPED_UNICODE);
