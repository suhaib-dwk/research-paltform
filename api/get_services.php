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

    // جلب الخدمات الفعالة مرتبة حسب الترتيب
    $stmt = $conn->prepare("SELECT * FROM platform_services WHERE is_active = 1 ORDER BY sort_order ASC");
    $stmt->execute();
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // إرجاع البيانات كـ JSON
    echo json_encode([
        "status" => "success",
        "data" => $services
    ]);

} catch (PDOException $e) {
    // في حال حدوث خطأ
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $e->getMessage()
    ]);
}
?>