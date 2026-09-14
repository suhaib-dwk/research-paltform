<?php
// ✅ منع أي خرج عَرضي (تحذيرات أو مسافات) يُفسد JSON
ob_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once('a01_connect.php');
 $conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    ob_end_clean();
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

 $response = ["status" => "error", "message" => "", "files" => []];

try {
    // ✅ استخدام REQUEST_METHOD بدل $_POST
    // لأن $_POST تصبح فارغة إذا تجاوز حجم الرفع الحد المسموح
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Invalid request method");
    }

    // ✅ التحقق من تجاوز حد الرفع
    if (empty($_POST) && empty($_FILES)) {
        throw new Exception("No data received. The file might exceed the upload limit (post_max_size in php.ini)");
    }

    $textFields = [
        'site_name_ar', 'site_name_en', 'site_tagline_ar', 'site_tagline_en',
        'hero_badge_ar', 'hero_badge_en', 'hero_title_ar', 'hero_title_en',
        'hero_desc_ar', 'hero_desc_en'
    ];

    $stmt = $conn->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");

    // حفظ الحقول النصية
    foreach ($textFields as $key) {
        if (isset($_POST[$key])) {
            $value = $_POST[$key];
            $stmt->bind_param("ss", $key, $value);
            $stmt->execute();
        }
    }

    // ✅ إعداد مجلد الرفع مع التحقق
require_once('a02_directory.php');
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception("Failed to create upload directory. Check folder permissions.");
        }
    }

    // ✅ دالة موحدة لرفع الملفات
    $fileKeys = ['site_logo', 'site_favicon'];
    
    foreach ($fileKeys as $fileKey) {
        // تجاهل إذا لم يتم اختيار ملف جديد
        if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] === UPLOAD_ERR_NO_FILE) {
            continue;
        }

        // ✅ التحقق من أخطاء الرفع
        if ($_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
            $errors = [
                UPLOAD_ERR_INI_SIZE   => "File exceeds limit in php.ini (upload_max_filesize)",
                UPLOAD_ERR_FORM_SIZE  => "File exceeds form limit (MAX_FILE_SIZE)",
                UPLOAD_ERR_PARTIAL    => "File was only partially uploaded",
                UPLOAD_ERR_NO_TMP_DIR => "Missing temporary folder",
                UPLOAD_ERR_CANT_WRITE => "Failed to write file to disk",
                UPLOAD_ERR_EXTENSION  => "Upload stopped by extension"
            ];
            $errMsg = $errors[$_FILES[$fileKey]['error']] ?? "Unknown upload error";
            throw new Exception("$fileKey: $errMsg");
        }

        // ✅ التحقق من الحجم (5MB)
        if ($_FILES[$fileKey]['size'] > 5 * 1024 * 1024) {
            throw new Exception("$fileKey: File size exceeds 5MB limit");
        }

        // ✅ التحقق من نوع الملف
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/x-icon', 'image/vnd.microsoft.icon'];
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $detectedType = $finfo->file($_FILES[$fileKey]['tmp_name']);
        
        if (!in_array($detectedType, $allowedTypes)) {
            throw new Exception("$fileKey: Invalid file type ($detectedType). Allowed: JPG, PNG, GIF, WEBP, ICO");
        }

        // ✅ إنشاء اسم فريد ورفع الملف
        $ext = strtolower(pathinfo($_FILES[$fileKey]['name'], PATHINFO_EXTENSION));
        if (empty($ext)) $ext = ($detectedType === 'image/x-icon' || $detectedType === 'image/vnd.microsoft.icon') ? 'ico' : 'png';
        
        $fileName = $fileKey . '_' . time() . '.' . $ext;
        $targetPath = $uploadDir . $fileName;

        if (!move_uploaded_file($_FILES[$fileKey]['tmp_name'], $targetPath)) {
            throw new Exception("$fileKey: Failed to move uploaded file. Check write permissions for uploads/");
        }

        // ✅ حفظ الرابط في قاعدة البيانات
        $fileUrl = 'uploads/' . $fileName;
        $stmt->bind_param("ss", $fileKey, $fileUrl);
        $stmt->execute();

        // ✅ إرجاع الرابط الجديد لـ React
        $response['files'][$fileKey] = $fileUrl;
    }

    $response['status'] = "success";
    $response['message'] = "Settings updated successfully";

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

 $conn->close();

// ✅ مسح أي تحذيرات PHP عَرضية ثم إخراج JSON نظيف
ob_end_clean();
echo json_encode($response, JSON_UNESCAPED_UNICODE);
exit;
?>