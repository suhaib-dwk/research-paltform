<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
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
    require_once('a03_helpers.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    $requesterId = isset($_GET['requester_id']) ? (int) $_GET['requester_id'] : 0;
    if ($requesterId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'requester_id is required']);
    }

    $requesterRole = get_user_role_key($conn, $requesterId);
    if ($requesterRole !== 'employee') {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'unauthorized']);
    }

    // ===== جلب كل المستخدمين مع دورهم =====
    $res = $conn->query(
        "SELECT u.id, u.email, u.status, r.key AS role_key
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.deleted_at IS NULL
         ORDER BY u.id DESC"
    );

    $usersByRole = []; // role_key => [user_id => row]
    $allUsers = [];
    while ($row = $res->fetch_assoc()) {
        $usersByRole[$row['role_key']][] = (int) $row['id'];
        $allUsers[(int) $row['id']] = [
            'id' => (int) $row['id'],
            'email' => $row['email'],
            'status' => $row['status'],
            'role' => $row['role_key'],
            'name_ar' => $row['email'], // fallback افتراضي، يُستبدل أدناه إن وُجد اسم فعلي
            'name_en' => $row['email'],
        ];
    }

    // ===== لكل دور، استعلام واحد على جدول profiles_* المطابق لجلب الاسم =====
    foreach ($usersByRole as $roleKey => $userIds) {
        $fields = get_profile_contact_fields($roleKey);
        if (!$fields || empty($userIds)) continue;

        $placeholders = implode(',', array_fill(0, count($userIds), '?'));
        $sql = "SELECT user_id, `{$fields['name_col']}` AS name_val FROM `{$fields['table']}` WHERE user_id IN ($placeholders)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) continue;

        $types = str_repeat('i', count($userIds));
        $stmt->bind_param($types, ...$userIds);
        $stmt->execute();
        $res2 = $stmt->get_result();
        while ($row2 = $res2->fetch_assoc()) {
            $uid = (int) $row2['user_id'];
            if (isset($allUsers[$uid]) && $row2['name_val']) {
                $allUsers[$uid]['name_ar'] = $row2['name_val'];
                $allUsers[$uid]['name_en'] = $row2['name_val']; // لا يوجد تخزين ثنائي اللغة للاسم حالياً
            }
        }
        $stmt->close();
    }

    $conn->close();

    jsonResponse(['status' => 'success', 'data' => array_values($allUsers)]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_ALL_USERS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load users']);
}
