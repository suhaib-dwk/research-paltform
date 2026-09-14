<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
require_once('a02_cors.php');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

try {
    require_once('a01_connect.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        http_response_code(500);
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    require_once('a04_auth.php');
    $userId = require_authenticated_user($conn);
    $roleKey = get_user_role_key($conn, $userId);

    // ===== إعادة اشتقاق البريد + الاسم بنفس منطق login.php (نفس الخريطة
    // المُشتركة الآن) — لا شيء يُقرأ من الجلسة سوى user_id =====
    $stmt = $conn->prepare("SELECT email FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    $email = $row['email'] ?? null;

    $userName = $email;
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

    // ===== عضوية الجامعة (إن وُجدت) + الدور المؤسسي =====
    $universityId = get_university_id_for_user($conn, $userId);
    $universityRoleKey = null;
    if ($universityId) {
        $stmt3 = $conn->prepare(
            "SELECT ur.key AS role_key FROM university_users uu
             JOIN university_roles ur ON ur.id = uu.university_role_id
             WHERE uu.user_id = ? AND uu.university_id = ? LIMIT 1"
        );
        $stmt3->bind_param('ii', $userId, $universityId);
        $stmt3->execute();
        $r3 = $stmt3->get_result()->fetch_assoc();
        $stmt3->close();
        $universityRoleKey = $r3['role_key'] ?? null;
    }

    $conn->close();

    jsonResponse([
        'status' => 'success',
        'data' => [
            'user_id'          => $userId,
            'role'             => $roleKey,
            'name'             => $userName,
            'email'            => $email,
            'university_id'    => $universityId,
            'university_role'  => $universityRoleKey,
        ],
    ]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('ME ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    // ✅ بدون هذا، أي استثناء غير متوقع (مثال: get_university_id_for_user على مستخدم
    // بلا جلسة صالحة) كان يخرج بكود حالة HTTP غير محدد بدل 500 واضح — ظهر فعلياً
    // كـ 400 غامض بأدوات المطوّر بدل رسالة خطأ مفهومة.
    http_response_code(500);
    jsonResponse(['status' => 'error', 'message' => 'Failed to fetch current user']);
}
