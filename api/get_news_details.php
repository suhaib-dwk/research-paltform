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
        
        $stmt = $conn->prepare("SELECT * FROM news WHERE slug = :slug AND is_published = 1 LIMIT 1");
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();
        $news = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($news) {
            // إرجاع البيانات بنجاح
            echo json_encode(["status" => "success", "data" => $news], JSON_UNESCAPED_UNICODE);
        } else {
            // الخبر غير موجود
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "News article not found"], JSON_UNESCAPED_UNICODE);
        }
    } else {
        // لم يتم تمرير slug في الرابط
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing slug parameter"], JSON_UNESCAPED_UNICODE);
    }
} catch (PDOException $e) {
    // خطأ في قاعدة البيانات
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>