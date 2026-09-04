<?php
// =====================================================================
// get_provider_dashboard.php — لوحة مقدّم الخدمة: الطلبات المتاحة + طلباتي
// يجمع من كل الجداول الثمانية التي مقدّم الخدمة مختص بها فقط
// (عبر service_provider_services)، مرتّبة زمنياً تنازلياً.
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
if ($providerId <= 0) {
    echo json_encode(["status" => "error", "message" => "unauthorized"]);
    exit();
}

// ✅ خدمات هذا المقدّم المختص بها
$qualifiedSlugs = [];
$stmt = $conn->prepare("SELECT service_slug FROM service_provider_services WHERE user_id = ?");
$stmt->bind_param('i', $providerId);
$stmt->execute();
$res = $stmt->get_result();
while ($row = $res->fetch_assoc()) {
    $qualifiedSlugs[] = $row['service_slug'];
}
$stmt->close();

$tableMap = get_service_table_map();

// ===== أعمدة "خاصة" لكل جدول تُستخدم كعنوان/وصف موجز (meta) =====
$metaColMap = [
    'translation'        => ['col' => "CONCAT(source_lang, ' → ', target_lang)", 'extra' => ['source_lang', 'target_lang', 'field_ar']],
    'proofreading'       => ['col' => "COALESCE(citation_style, '')", 'extra' => ['citation_style']],
    'consultation'       => ['col' => 'topic', 'extra' => ['topic', 'preferred_datetime']],
    'journal-selection'  => ['col' => 'research_field', 'extra' => ['research_field', 'priority']],
    'journal-evaluation' => ['col' => 'journal_name', 'extra' => ['journal_name', 'journal_issn', 'journal_link']],
    'template'           => ['col' => 'journal_name', 'extra' => ['journal_name']],
    'correspondence'     => ['col' => 'correspondence_type', 'extra' => ['correspondence_type']],
    'publication'        => ['col' => "COALESCE(target_journal, '')", 'extra' => ['target_journal']],
];

$available = [];
$mine = [];

foreach ($qualifiedSlugs as $slug) {
    if (!isset($tableMap[$slug])) continue;
    $table = $tableMap[$slug];
    $metaCol = $metaColMap[$slug]['col'] ?? "''";

    // === الطلبات المتاحة: pending وبلا مُسنَد بعد ===
    $sql = "SELECT id, $metaCol AS meta, notes, status, created_at FROM `$table` WHERE status = 'pending' AND assigned_provider_id IS NULL ORDER BY created_at DESC";
    $r = $conn->query($sql);
    if ($r) {
        while ($row = $r->fetch_assoc()) {
            $available[] = [
                'id' => (int) $row['id'],
                'service_slug' => $slug,
                'meta' => $row['meta'],
                'notes' => $row['notes'],
                'status' => $row['status'],
                'created_at' => $row['created_at'],
            ];
        }
    }

    // === طلباتي: مُسنَدة لهذا المقدّم (assigned/in_progress/completed) ===
    $stmt2 = $conn->prepare("SELECT id, $metaCol AS meta, notes, status, result_notes, result_file_name, result_file_path, created_at FROM `$table` WHERE assigned_provider_id = ? ORDER BY created_at DESC");
    $stmt2->bind_param('i', $providerId);
    $stmt2->execute();
    $r2 = $stmt2->get_result();
    while ($row = $r2->fetch_assoc()) {
        $mine[] = [
            'id' => (int) $row['id'],
            'service_slug' => $slug,
            'meta' => $row['meta'],
            'notes' => $row['notes'],
            'status' => $row['status'],
            'result_notes' => $row['result_notes'],
            'result_file_name' => $row['result_file_name'],
            'result_file_path' => $row['result_file_path'],
            'created_at' => $row['created_at'],
        ];
    }
    $stmt2->close();
}

// ترتيب زمني تنازلي عام بعد التجميع من كل الجداول
usort($available, fn($a, $b) => strcmp($b['created_at'], $a['created_at']));
usort($mine, fn($a, $b) => strcmp($b['created_at'], $a['created_at']));

$conn->close();

echo json_encode([
    "status" => "success",
    "data" => [
        "qualified_services" => $qualifiedSlugs,
        "available_requests" => $available,
        "my_requests" => $mine,
    ],
], JSON_UNESCAPED_UNICODE);
