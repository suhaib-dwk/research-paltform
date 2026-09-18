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

    // ✅ فلتر تصنيف اختياري (?category=grants,announcements) — تستخدمه صفحة فرص التمويل
    // لعرض إعلانات التمويل فقط. بدونه يبقى السلوك كما هو (آخر 6 أخبار من كل التصنيفات).
    $allowedCategories = ['updates', 'grants', 'events', 'announcements'];
    $categories = [];
    if (!empty($_GET['category'])) {
        $categories = array_values(array_intersect(explode(',', (string) $_GET['category']), $allowedCategories));
    }
    $limit = isset($_GET['limit']) ? max(1, min(24, (int) $_GET['limit'])) : 6;

    $sql = "SELECT id, title_ar, title_en, image_url, category, slug, created_at FROM news WHERE is_published = 1";
    if ($categories) {
        $sql .= " AND category IN (" . implode(',', array_fill(0, count($categories), '?')) . ")";
    }
    $sql .= " ORDER BY created_at DESC LIMIT " . $limit;
    $stmt = $conn->prepare($sql);
    $stmt->execute($categories);
    $news = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // إرجاع البيانات
    echo json_encode(["status" => "success", "data" => $news], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>