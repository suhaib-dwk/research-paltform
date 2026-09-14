<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once('a01_connect.php');

 $conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

 $sql = "SELECT id, image_url, sort_order FROM home_slides WHERE is_active = 1 ORDER BY sort_order ASC";
 $result = $conn->query($sql);

 $slides = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $slides[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $slides], JSON_UNESCAPED_UNICODE);

 $conn->close();
?>