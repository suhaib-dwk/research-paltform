<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

// إعدادات قاعدة البيانات
require_once ('a01_connect.php');


 $conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "فشل الاتصال بقاعدة البيانات"]);
    exit();
}

// جلب الأسئلة الشائعة الفعالة فقط، مرتبة حسب الترتيب
 $sql = "SELECT id, question_ar, question_en, answer_ar, answer_en FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC";
 $result = $conn->query($sql);

 $faqs = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $faqs[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $faqs]);
 $conn->close();
?>