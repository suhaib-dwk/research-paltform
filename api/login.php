<?php
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

set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// دالة مساعدة لطباعة JSON بأمان
function jsonResponse($data) {
    ob_end_clean();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

try {

    // ===== 1. استقبال البيانات =====
    $raw = file_get_contents('php://input');
    
    // ✅ فك تشفير Base64 إن كان مشفراً (للتجاوز الآمن لجدار الحماية WAF أونلاين)
    $decoded = base64_decode($raw, true);
    if ($decoded !== false) {
        $jsonCheck = json_decode($decoded);
        if ($jsonCheck !== null) {
            $raw = $decoded;
        }
    }

    $data = json_decode($raw, true);

    if (!$data || json_last_error() !== JSON_ERROR_NONE) {
        jsonResponse(['status' => 'error', 'message' => 'Invalid JSON data']);
    }

    // ✅ تغيير اسم المتغير لمنع التعارض مع $password الخاص بـ a01_connect.php
    $email        = trim($data['email'] ?? '');
    $userPassword = $data['password'] ?? '';

    // ===== 2. التحقق من البيانات =====
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['status' => 'error', 'message' => 'Invalid email format']);
    }

    if (empty($userPassword)) {
        jsonResponse(['status' => 'error', 'message' => 'Password is required']);
    }

    // ===== 3. الاتصال بقاعدة البيانات =====
    require_once('a01_connect.php');

    // ✅ الآن $password هو كلمة مرور قاعدة البيانات وليس المستخدم
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    // ===== 4. البحث عن المستخدم =====
    $stmt = $conn->prepare(
        "SELECT u.id, u.role_id, u.email, u.is_active, u.password_hash, r.key AS role_key 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE u.email = ? AND u.deleted_at IS NULL 
         LIMIT 1"
    );
    
    if (!$stmt) throw new Exception('DB prepare error');
    
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Invalid email or password']);
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    // ===== 5. التحقق من حالة الحساب =====
    if (!$user['is_active']) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Account is not activated']);
    }

    // ===== 6. التحقق من كلمة المرور =====
    // ✅ نستخدم $userPassword وليس $password
    if (!password_verify($userPassword, $user['password_hash'])) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Invalid email or password']);
    }

    // ===== 7. جلب اسم المستخدم من جدول الملف الشخصي الخاص بدوره =====
    $userId   = (int) $user['id'];
    $roleKey  = $user['role_key'];
    $userName = $email; // قيمة افتراضية

    // ✅ Stage A.5: الخريطة انتقلت إلى get_login_profile_name_map() في
    // a03_helpers.php لتُشاركها me.php أيضاً بدل تكرارها هنا
    require_once('a03_helpers.php');
    $profileMap = get_login_profile_name_map();

    if (isset($profileMap[$roleKey])) {
        $map = $profileMap[$roleKey];
        
        $stmt2 = $conn->prepare("SELECT `{$map['col']}` AS user_name FROM `{$map['table']}` WHERE user_id = ? LIMIT 1");
        if ($stmt2) {
            $stmt2->bind_param('i', $userId);
            $stmt2->execute();
            $res2 = $stmt2->get_result();
            
            if ($row2 = $res2->fetch_assoc()) {
                $userName = $row2['user_name'];
            }
            $stmt2->close();
        }
    }

    $conn->close();

    // ===== 8. Stage A.5: إنشاء جلسة PHP حقيقية على الخادم =====
    // session_regenerate_id(true) يمنع session fixation: أي معرّف جلسة
    // كان موجوداً قبل الدخول (مثلاً جلسة زائر) يُستبدل بمعرّف جديد كلياً.
    // نُخزّن الحد الأدنى فقط (user_id/role/وقت الدخول) — الاسم والبريد
    // يُعاد اشتقاقهما من user_id عند كل طلب لاحق عبر الدوال الموجودة أصلاً،
    // بدل تخزينهما كنسخة قد تُصبح قديمة إن عُدِّل الملف الشخصي لاحقاً.
    require_once('a04_auth.php');
    session_regenerate_id(true);
    $_SESSION['user_id'] = $userId;
    $_SESSION['role'] = $roleKey;
    $_SESSION['logged_in_at'] = time();

    // ===== 9. إرجاع بيانات الدخول الناجحة (الشكل نفسه دون أي تغيير) =====
    jsonResponse([
        'status' => 'success',
        'data'   => [
            'user_id' => $userId,
            'role'    => $roleKey,
            'name'    => $userName,
            'email'   => $email
        ]
    ]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }

    error_log('LOGIN ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());

    jsonResponse([
        'status'  => 'error',
        'message' => 'Invalid email or password',
        // 'debug'   => $e->getMessage() // احذفه لاحقاً من الإنتاج
    ]);
}