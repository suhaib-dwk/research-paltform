<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once('a01_connect.php');

 $conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

 $sql = "SELECT setting_key, setting_value FROM site_settings";
 $result = $conn->query($sql);

 $settings = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
}

echo json_encode(["status" => "success", "data" => $settings], JSON_UNESCAPED_UNICODE);

 $conn->close();
?>