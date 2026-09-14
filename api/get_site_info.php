<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once ('a01_connect.php');


 $conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

 $sql = "SELECT * FROM site_info WHERE id = 1";
 $result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode(["status" => "success", "data" => $result->fetch_assoc()]);
} else {
    echo json_encode(["status" => "error", "message" => "Site info not found"]);
}
 $conn->close();
?>