<?php
// إعدادات الرؤوس لحل مشاكل CORS نهائياً
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
require_once ('a01_connect.php');

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // التحقق من وجود slug في الرابط
    if (isset($_GET['slug'])) {
        $slug = $_GET['slug'];
        $stmt = $conn->prepare("SELECT * FROM platform_services WHERE slug = :slug AND is_active = 1 LIMIT 1");
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();
        $service = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($service) {
            echo json_encode(["status" => "success", "data" => $service]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Service not found"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Slug parameter is missing"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
?>