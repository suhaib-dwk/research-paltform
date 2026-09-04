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
    $targetUserId = isset($_GET['target_user_id']) ? (int) $_GET['target_user_id'] : 0;

    if ($requesterId <= 0 || $targetUserId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'requester_id and target_user_id are required']);
    }

    $requesterRole = get_user_role_key($conn, $requesterId);
    if ($requesterRole !== 'employee') {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'unauthorized']);
    }

    $stmt = $conn->prepare(
        "SELECT u.id, u.email, u.status, u.is_active, u.created_at, r.key AS role_key
         FROM users u JOIN roles r ON u.role_id = r.id
         WHERE u.id = ? AND u.deleted_at IS NULL LIMIT 1"
    );
    $stmt->bind_param('i', $targetUserId);
    $stmt->execute();
    $res = $stmt->get_result();
    $user = $res->fetch_assoc();
    $stmt->close();

    if (!$user) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'user_not_found']);
    }

    $roleKey = $user['role_key'];
    $fields = get_profile_contact_fields($roleKey);
    $profile = [];

    if ($fields) {
        $cols = array_filter([$fields['name_col'], $fields['phone_col'], $fields['email_col'], $fields['avatar_col']]);
        $colList = implode(', ', array_map(fn($c) => "`$c`", array_unique($cols)));
        $stmt2 = $conn->prepare("SELECT {$colList} FROM `{$fields['table']}` WHERE user_id = ? LIMIT 1");
        if ($stmt2) {
            $stmt2->bind_param('i', $targetUserId);
            $stmt2->execute();
            $res2 = $stmt2->get_result();
            $profile = $res2->fetch_assoc() ?: [];
            $stmt2->close();
        }
    }

    $conn->close();

    jsonResponse([
        'status' => 'success',
        'data' => [
            'id' => (int) $user['id'],
            'email' => $user['email'],
            'status' => $user['status'],
            'role' => $roleKey,
            'created_at' => $user['created_at'],
            'name' => $fields ? ($profile[$fields['name_col']] ?? null) : null,
            'phone' => ($fields && $fields['phone_col']) ? ($profile[$fields['phone_col']] ?? null) : null,
            'contact_email' => ($fields && $fields['email_col']) ? ($profile[$fields['email_col']] ?? null) : null,
            'avatar_path' => $fields ? ($profile[$fields['avatar_col']] ?? null) : null,
        ],
    ]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_USER_DETAILS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load user details']);
}
