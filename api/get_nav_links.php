<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once ('a01_connect.php');

 $conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// جلب الصفحات الفعالة والتي يجب أن تظهر في القائمة فقط، مرتبة حسب الترتيب
 $sql = "SELECT title_ar, title_en, slug FROM pages WHERE is_active = 1 AND show_in_nav = 1 ORDER BY sort_order ASC";
 $result = $conn->query($sql);

 $links = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $links[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $links]);
 $conn->close();
?>