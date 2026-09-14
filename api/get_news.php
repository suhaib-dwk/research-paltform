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

    $stmt = $conn->prepare("SELECT id, title_ar, title_en, image_url, category, slug, created_at FROM news WHERE is_published = 1 ORDER BY created_at DESC LIMIT 6");
    $stmt->execute();
    $news = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // إرجاع البيانات
    echo json_encode(["status" => "success", "data" => $news], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>