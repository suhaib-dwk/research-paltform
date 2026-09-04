<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
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

try {
    require_once('a01_connect.php');
    require_once('a03_helpers.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    $userId = isset($_POST['user_id']) ? (int) $_POST['user_id'] : 0;
    $fullName = trim($_POST['full_name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $personalEmail = trim($_POST['personal_email'] ?? '');

    if ($userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'user_id is required']);
    }
    if ($fullName === '') {
        jsonResponse(['status' => 'error', 'message' => 'full_name_required']);
    }
    if ($personalEmail !== '' && !filter_var($personalEmail, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['status' => 'error', 'message' => 'invalid_email_format']);
    }

    // ===== جلب دور المستخدم وبريد الدخول الأساسي =====
    $stmt = $conn->prepare(
        "SELECT u.email, r.key AS role_key FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ? AND u.deleted_at IS NULL LIMIT 1"
    );
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $res = $stmt->get_result();
    $userRow = $res->fetch_assoc();
    $stmt->close();

    if (!$userRow) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'invalid_user']);
    }

    $roleKey = $userRow['role_key'];
    $fields = get_profile_contact_fields($roleKey);
    if (!$fields) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'unsupported_role']);
    }

    // ===== UPDATE على جدول profiles_* الصحيح بالأعمدة المطابقة لهذا الدور =====
    $setParts = ["`{$fields['name_col']}` = ?"];
    $params = [$fullName];
    $types = 's';

    if ($fields['phone_col']) {
        $setParts[] = "`{$fields['phone_col']}` = ?";
        $params[] = $phone;
        $types .= 's';
    }
    if ($fields['email_col'] && $personalEmail !== '') {
        $setParts[] = "`{$fields['email_col']}` = ?";
        $params[] = $personalEmail;
        $types .= 's';
    }

    $sql = "UPDATE `{$fields['table']}` SET " . implode(', ', $setParts) . " WHERE user_id = ?";
    $params[] = $userId;
    $types .= 'i';

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Prepare failed', 'debug' => $conn->error]);
    }
    $stmt->bind_param($types, ...$params);

    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Update failed', 'debug' => $err]);
    }
    $stmt->close();

    log_activity($conn, $userId, 'profile_update', 'account', 'تحديث الملف الشخصي', 'Profile updated');

    $conn->close();

    // ===== إرجاع بيانات محدَّثة بنفس بنية login.php.data ليعاد تخزينها بـ loginUser() =====
    jsonResponse([
        'status' => 'success',
        'data' => [
            'user_id' => $userId,
            'role' => $roleKey,
            'name' => $fullName,
            'email' => $userRow['email'], // بريد تسجيل الدخول الأساسي لا يتغيّر من هذه الشاشة
            'phone' => $phone,
            'personal_email' => $personalEmail,
        ],
    ]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('UPDATE_ACCOUNT ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to update account']);
}
