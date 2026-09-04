<?php
// =====================================================================
// get_service_providers.php — قائمة كل مقدّمي الخدمة وخدماتهم (للوحة الموظف)
// =====================================================================
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

$sql = "SELECT u.id AS user_id, u.email, u.status, u.is_active, u.created_at,
               p.full_name, p.phone, p.qualifications, p.bio, p.cv_file_name, p.cv_file_path, p.cv_file_size, p.avatar_path
        FROM users u
        JOIN roles r ON u.role_id = r.id
        JOIN profiles_service_provider p ON p.user_id = u.id
        WHERE r.`key` = 'service_provider' AND u.deleted_at IS NULL
        ORDER BY u.created_at DESC";
$res = $conn->query($sql);

$providers = [];
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $providers[(int) $row['user_id']] = [
            'user_id' => (int) $row['user_id'],
            'email' => $row['email'],
            'status' => $row['status'],
            'is_active' => (bool) $row['is_active'],
            'full_name' => $row['full_name'],
            'phone' => $row['phone'],
            'qualifications' => $row['qualifications'],
            'bio' => $row['bio'],
            'cv_file_name' => $row['cv_file_name'],
            'cv_file_path' => $row['cv_file_path'],
            'cv_file_size' => $row['cv_file_size'] !== null ? (int) $row['cv_file_size'] : null,
            'avatar_path' => $row['avatar_path'],
            'created_at' => $row['created_at'],
            'services' => [],
        ];
    }
}

if (!empty($providers)) {
    $ids = implode(',', array_map('intval', array_keys($providers)));
    $svcRes = $conn->query("SELECT user_id, service_slug FROM service_provider_services WHERE user_id IN ($ids)");
    if ($svcRes) {
        while ($row = $svcRes->fetch_assoc()) {
            $uid = (int) $row['user_id'];
            if (isset($providers[$uid])) {
                $providers[$uid]['services'][] = $row['service_slug'];
            }
        }
    }
}

$conn->close();

echo json_encode(["status" => "success", "data" => array_values($providers)], JSON_UNESCAPED_UNICODE);
