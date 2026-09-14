<?php
// =====================================================================
// admin_crud.php — Stage A.5: أُعيدت كتابته بالكامل
//
// قبل هذه المرحلة: هذا الملف كان بلا أي مصادقة إطلاقاً — أي زائر غير
// مسجّل دخول قادر على قراءة/حذف/تعديل جدول users بالكامل، بما في ذلك
// role_id وis_active وstatus (ترقية صلاحيات كاملة إلى super_admin بلا
// أي حماية). الإصلاح هنا من شقين:
//   1) مصادقة+تفويض حقيقيان عبر الجلسة (require_platform_permission)
//      بدل الاعتماد على فحص واجهة أمامية بحت (localStorage) كان قابلاً
//      للتجاوز بالكامل من أدوات المطوّر في أي متصفح.
//   2) استبدال القائمة السوداء الصغيرة لاسم العمود في update_field
//      بقائمة بيضاء حقيقية (SHOW COLUMNS الفعلي لكل جدول + قائمة حظر
//      يدوية للأعمدة الحساسة) — بنفس نمط register.php المُتحقَّق منه.
// =====================================================================
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header("Content-Type: application/json; charset=UTF-8");
require_once('a02_cors.php');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    ob_end_flush();
    exit;
}

function jsonResponse($data) {
    ob_end_clean();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

require_once('a01_connect.php');
$conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    jsonResponse(["status" => "error", "message" => "Database connection failed"]);
}
$conn->set_charset('utf8mb4');

// ===== Stage A.5: مصادقة + تفويض حقيقيان — يفرضان جلسة صالحة بدور
// super_admin قبل أي عملية، بغض النظر عن أي user_id/role وارد من العميل =====
require_once('a04_auth.php');
$authenticatedUserId = require_platform_permission($conn, 'super_admin');

// ✅ القائمة البيضاء الشاملة للجداول
$allowed_tables = [
    'contact_messages', 'faqs', 'home_slides', 'news', 'pages',
    'platform_services', 'site_info', 'site_settings', 'users'
];

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');
$tableName = isset($_GET['table']) ? $_GET['table'] : (isset($_POST['table']) ? $_POST['table'] : '');

if (!in_array($tableName, $allowed_tables, true)) {
    jsonResponse(["status" => "error", "message" => "Access Denied: Invalid table"]);
}

// ===== Stage A.5: قائمة بيضاء حقيقية لأعمدة الجدول (نفس نمط
// register.php: SHOW COLUMNS الفعلي، وليس قائمة افتراضات ثابتة قد
// تنحرف عن المخطط الحقيقي) =====
function admin_crud_get_valid_columns($conn, $tableName) {
    $cols = [];
    $res = $conn->query("SHOW COLUMNS FROM `$tableName`");
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $cols[] = $row['Field'];
        }
    }
    return $cols;
}

// ===== أعمدة حسّاسة مرفوضة دائماً بغض النظر عن كونها أعمدة حقيقية —
// خصوصاً أعمدة users المرتبطة بالصلاحيات/الهوية، وهي بالضبط ما كان
// الثغرة الأصلية تسمح بتعديله (role_id/is_active/status/email/deleted_at
// لم تكن محظورة سابقاً رغم أنها الأخطر) =====
function admin_crud_get_forbidden_columns($tableName) {
    $map = [
        'users' => [
            'id', 'password_hash', 'role_id', 'is_active', 'status',
            'email', 'email_verified_at', 'deleted_at', 'created_at', 'updated_at',
        ],
    ];
    return $map[$tableName] ?? ['id', 'created_at', 'updated_at'];
}

// ===== يتحقق أن $field عمود حقيقي في الجدول، بصيغة اسم آمنة، وليس
// ضمن الأعمدة المحظورة — يُستخدم في add/update_field/update_row =====
function admin_crud_is_field_allowed($field, $validColumns, $forbiddenColumns) {
    if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $field)) return false;
    if (!in_array($field, $validColumns, true)) return false;
    if (in_array($field, $forbiddenColumns, true)) return false;
    return true;
}

$validColumns = admin_crud_get_valid_columns($conn, $tableName);
$forbiddenColumns = admin_crud_get_forbidden_columns($tableName);

// ✅ جلب البيانات
if ($action === 'get') {
    $sql = "SELECT * FROM `$tableName` ORDER BY id DESC";
    $result = $conn->query($sql);
    $data = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    jsonResponse(["status" => "success", "data" => $data]);
}

// ✅ حذف سجل
elseif ($action === 'delete') {
    // منع حذف المستخدمين من هنا لحماية النظام
    if ($tableName === 'users') {
        jsonResponse(["status" => "error", "message" => "Cannot delete users from this panel"]);
    }

    $id = (int) ($_POST['id'] ?? 0);
    $stmt = $conn->prepare("DELETE FROM `$tableName` WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        jsonResponse(["status" => "success", "message" => "Deleted successfully"]);
    } else {
        jsonResponse(["status" => "error", "message" => "Delete failed"]);
    }
}

// ✅ إضافة سجل جديد
elseif ($action === 'add') {
    $fields = [];
    foreach ($_POST as $key => $value) {
        if (in_array($key, ['action', 'table'], true)) continue;
        // Stage A.5: قائمة بيضاء حقيقية بدل مجرد استبعاد id/created_at/إلخ
        if (!admin_crud_is_field_allowed($key, $validColumns, $forbiddenColumns)) continue;

        if ($value === '') {
            if (strpos($key, 'is_active') !== false || strpos($key, 'is_published') !== false) {
                $fields[$key] = 1;
            } else {
                $fields[$key] = '';
            }
        } else {
            $fields[$key] = $value;
        }
    }

    if (empty($fields)) {
        jsonResponse(["status" => "error", "message" => "No valid fields to insert"]);
    }

    $columns = implode(", ", array_map(fn($col) => "`$col`", array_keys($fields)));
    $placeholders = implode(", ", array_fill(0, count($fields), "?"));
    $types = [];
    $params = [];

    foreach ($fields as $val) {
        if (is_numeric($val)) {
            $types[] = "i";
            $params[] = (int) $val;
        } else {
            $types[] = "s";
            $params[] = $val;
        }
    }

    $sql = "INSERT INTO `$tableName` ($columns) VALUES ($placeholders)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param(implode('', $types), ...$params);
        if ($stmt->execute()) {
            jsonResponse(["status" => "success", "message" => "Added successfully"]);
        } else {
            jsonResponse(["status" => "error", "message" => "Add failed"]);
        }
    } else {
        jsonResponse(["status" => "error", "message" => "Prepare failed"]);
    }
}

// ✅ تحديث حقل معين
elseif ($action === 'update_field') {
    $id = (int) ($_POST['id'] ?? 0);
    $field = $_POST['field'] ?? '';
    $value = $_POST['value'] ?? '';

    // Stage A.5: قائمة بيضاء حقيقية (SHOW COLUMNS + حظر يدوي للحسّاس)
    // بدل القائمة السوداء القديمة المكوّنة من 5 أسماء فقط
    if (!admin_crud_is_field_allowed($field, $validColumns, $forbiddenColumns)) {
        jsonResponse(["status" => "error", "message" => "Cannot update this field directly"]);
    }

    if (is_numeric($value)) {
        $stmt = $conn->prepare("UPDATE `$tableName` SET `$field` = ? WHERE id = ?");
        $stmt->bind_param("ii", $value, $id);
    } else {
        $stmt = $conn->prepare("UPDATE `$tableName` SET `$field` = ? WHERE id = ?");
        $stmt->bind_param("si", $value, $id);
    }

    if ($stmt->execute()) {
        jsonResponse(["status" => "success", "message" => "Updated successfully"]);
    } else {
        jsonResponse(["status" => "error", "message" => "Update failed"]);
    }
}

// ✅ Stage A.5: تحديث سجل كامل (كان مفقوداً — AdminDataTable.jsx كان
// يستدعي action=update_row من واجهة "تعديل السجل" وهذا كان يفشل صامتاً
// لعدم وجود هذا الإجراء أصلاً على الخادم. يُطبَّق الآن بنفس القائمة
// البيضاء المستخدمة في update_field/add.)
elseif ($action === 'update_row') {
    $id = (int) ($_POST['id'] ?? 0);
    if ($id <= 0) {
        jsonResponse(["status" => "error", "message" => "Invalid id"]);
    }

    $setClauses = [];
    $types = [];
    $params = [];
    foreach ($_POST as $key => $value) {
        if (in_array($key, ['action', 'table', 'id'], true)) continue;
        if (!admin_crud_is_field_allowed($key, $validColumns, $forbiddenColumns)) continue;

        $setClauses[] = "`$key` = ?";
        if (is_numeric($value)) {
            $types[] = "i";
            $params[] = (int) $value;
        } else {
            $types[] = "s";
            $params[] = $value;
        }
    }

    if (empty($setClauses)) {
        jsonResponse(["status" => "error", "message" => "No valid fields to update"]);
    }

    $types[] = "i";
    $params[] = $id;

    $sql = "UPDATE `$tableName` SET " . implode(", ", $setClauses) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param(implode('', $types), ...$params);
        if ($stmt->execute()) {
            jsonResponse(["status" => "success", "message" => "Updated successfully"]);
        } else {
            jsonResponse(["status" => "error", "message" => "Update failed"]);
        }
    } else {
        jsonResponse(["status" => "error", "message" => "Prepare failed"]);
    }
}

else {
    jsonResponse(["status" => "error", "message" => "Unknown action"]);
}

$conn->close();
