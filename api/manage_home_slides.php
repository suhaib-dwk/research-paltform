<?php
// ✅ إيقاف عرض الأخطاء كـ HTML لضمان خروج JSON نقي
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once('a01_connect.php');
 $conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

 $action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'add') {
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        // ✅ التأكد من وجود المجلد وأنه قابل للكتابة
        $uploadDir = '../uploads/slides/';
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                echo json_encode(["status" => "error", "message" => "Failed to create upload directory"]);
                exit();
            }
        }
        
        $fileName = 'slide_' . time() . '_' . basename($_FILES['image']['name']);
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $imageUrl = 'uploads/slides/' . $fileName;
            
            $res = $conn->query("SELECT MAX(sort_order) as max_order FROM home_slides");
            $row = $res->fetch_assoc();
            $maxOrder = $row ? (int)$row['max_order'] : 0;
            
            $stmt = $conn->prepare("INSERT INTO home_slides (image_url, sort_order) VALUES (?, ?)");
            $newOrder = $maxOrder + 1;
            $stmt->bind_param("si", $imageUrl, $newOrder);
            
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Slide added", "image_url" => $imageUrl]);
            } else {
                echo json_encode(["status" => "error", "message" => "Database insert failed"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "No file uploaded or upload error"]);
    }
} elseif ($action === 'delete') {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    if ($id > 0) {
        $stmt = $conn->prepare("DELETE FROM home_slides WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Slide deleted"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Delete failed"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid ID"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);
}
 $conn->close();
?>