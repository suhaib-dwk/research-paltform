<?php
// =====================================================================
// upload_admin_image.php — رفع صورة عام من لوحة الأدمن (AdminDataTable)
//
// يخدم أي حقل من نوع "image" بأي جدول تديره الجداول العامة (col.type ===
// 'image' في AdminDataTable.jsx) — بدلاً من إجبار المستخدم على كتابة رابط
// صورة خارجي يدويًا. يرجّع فقط المسار النسبي (uploads/admin/...) ليُخزَّن
// بنفس عمود image_url كما لو كُتب رابطًا يدويًا — لا تغيير على شكل البيانات
// المخزَّنة، فقط على طريقة الحصول عليها.
//
// أمان: مصادقة super_admin حقيقية عبر الجلسة (نفس معيار admin_crud.php)،
// + تحقق صارم من نوع الملف الفعلي (fileinfo/MIME، لا الاعتماد على الامتداد
// المُرسَل من العميل وحده) وحجمه، + اسم ملف عشوائي (لا اسم العميل الأصلي).
// =====================================================================
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
require_once('a02_cors.php');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TO_EXT = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];

try {
    require_once('a01_connect.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        http_response_code(500);
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    // ===== مصادقة حقيقية — نفس معيار admin_crud.php، لا فحص واجهة أمامية فقط =====
    require_once('a04_auth.php');
    require_platform_permission($conn, 'super_admin');
    $conn->close();

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        jsonResponse(['status' => 'error', 'message' => 'no_file_uploaded']);
    }

    $file = $_FILES['image'];

    if ($file['size'] > MAX_FILE_BYTES) {
        http_response_code(400);
        jsonResponse(['status' => 'error', 'message' => 'file_too_large']);
    }

    // ✅ التحقق من نوع الملف الفعلي بقراءة محتواه (fileinfo)، وليس بالثقة
    // بامتداد الاسم أو Content-Type المُرسَلين من العميل — كلاهما قابل للتزوير.
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $actualMime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!isset(ALLOWED_MIME_TO_EXT[$actualMime])) {
        http_response_code(400);
        jsonResponse(['status' => 'error', 'message' => 'unsupported_file_type']);
    }
    $ext = ALLOWED_MIME_TO_EXT[$actualMime];

    $uploadDir = __DIR__ . '/../uploads/admin/';
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        jsonResponse(['status' => 'error', 'message' => 'upload_dir_failed']);
    }

    // ✅ اسم ملف عشوائي بالكامل — لا نستخدم اسم الملف الأصلي القادم من العميل إطلاقاً
    $fileName = 'img_' . bin2hex(random_bytes(12)) . '.' . $ext;
    $targetPath = $uploadDir . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        http_response_code(500);
        jsonResponse(['status' => 'error', 'message' => 'move_failed']);
    }

    jsonResponse(['status' => 'success', 'data' => ['image_url' => 'uploads/admin/' . $fileName]]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('UPLOAD_ADMIN_IMAGE ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    http_response_code(500);
    jsonResponse(['status' => 'error', 'message' => 'upload_failed']);
}
