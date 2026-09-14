<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

require_once('a01_connect.php');
 $conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// ✅ القائمة البيضاء الشاملة
 $allowed_tables = [
    'contact_messages', 'faqs', 'home_slides', 'news', 'pages', 
    'platform_services', 'site_info', 'site_settings', 'users'
];

 $action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');
 $tableName = isset($_GET['table']) ? $_GET['table'] : (isset($_POST['table']) ? $_POST['table'] : '');

if (!in_array($tableName, $allowed_tables)) {
    echo json_encode(["status" => "error", "message" => "Access Denied: Invalid table"]);
    exit();
}

// ✅ جلب البيانات
if ($action === 'get') {
    $sql = "SELECT * FROM `$tableName` ORDER BY id DESC";
    $result = $conn->query($sql);
    $data = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    echo json_encode(["status" => "success", "data" => $data], JSON_UNESCAPED_UNICODE);
}

// ✅ حذف سجل
elseif ($action === 'delete') {
    // منع حذف المستخدمين من هنا لحماية النظام
    if ($tableName === 'users') {
        echo json_encode(["status" => "error", "message" => "Cannot delete users from this panel"]);
        exit();
    }
    
    $id = (int)$_POST['id'];
    $stmt = $conn->prepare("DELETE FROM `$tableName` WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Delete failed"]);
    }
}
// ✅ إضافة سجل جديد
elseif ($action === 'add') {
    // استخراج البيانات من دون الحقول المحظورة
    $fields = [];
    foreach ($_POST as $key => $value) {
        if (!in_array($key, ['action', 'table'])) {
            // إذا لم يتم إرسال الحقل، ضع قيمة افتراضية
            if ($value === '') {
                if (strpos($key, 'is_active') !== false || strpos($key, 'is_published') !== false) {
                    $fields[$key] = 1; // القيم المنطقية تعتبر 1 افتراضياً
                } else {
                    $fields[$key] = '';
                }
            } else {
                $fields[$key] = $value;
            }
        }
    }

    // منع إدراج حقول معينة
    unset($fields['id']);
    unset($fields['created_at']);
    unset($fields['updated_at']);
    unset($fields['email_verified_at']);

    $columns = implode(", ", array_map(function($col) use (&$conn) { return "`" . $conn->real_escape_string($col) . "`"; }, array_keys($fields)));
    $placeholders = implode(", ", array_fill(count($fields), "?"));
    $types = [];
    $params = [];
    
    foreach ($fields as $val) {
        if (is_numeric($val)) {
            $types[] = "i";
            $params[] = (int)$val;
        } else {
            $types[] = "s";
            $params[] = $val;
        }
    }
    
    $sql = "INSERT INTO `$tableName` ($columns) VALUES ($placeholders)";
    $stmt = $conn->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Add failed"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Prepare failed"]);
    }
}
// ✅ تحديث حقل معين
elseif ($action === 'update_field') {
    $id = (int)$_POST['id'];
    $field = $conn->real_escape_string($_POST['field']);
    $value = $_POST['value']; 
    
    // ✅ الحقول الممنوعة من التعديل تماماً
    $forbidden_fields = ['id', 'password_hash', 'created_at', 'updated_at', 'email_verified_at'];
    if (in_array($field, $forbidden_fields)) {
        echo json_encode(["status" => "error", "message" => "Cannot update this field directly"]);
        exit();
    }

    if (is_numeric($value)) {
        $stmt = $conn->prepare("UPDATE `$tableName` SET `$field` = ? WHERE id = ?");
        $stmt->bind_param("ii", $value, $id);
    } else {
        $stmt = $conn->prepare("UPDATE `$tableName` SET `$field` = ? WHERE id = ?");
        $stmt->bind_param("si", $value, $id);
    }
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Update failed"]);
    }
}

 $conn->close();
?>