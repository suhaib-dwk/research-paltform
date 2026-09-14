<?php
// يعيد كل طلبات التعاون الخاصة بمستخدم معيّن (سواء كان هو الطالب أو المستلم)
// مع اسم الطرف الآخر ودوره، مرتّبة الأحدث أولاً.
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
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    $userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;
    if ($userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'user_id is required']);
    }

    // اسم وطرف الشخص المقابل: لو أنا الطالب (requester) الطرف الآخر هو المستلم، والعكس صحيح
    $sql = "
        SELECT
            c.id, c.requester_id, c.recipient_id, c.subject, c.message, c.status, c.created_at,
            (c.requester_id = ?) AS is_outgoing,
            other_role.key AS other_role_key,
            COALESCE(other_pf.name, other_pr.full_name, other_pe.entity_name) AS other_name
        FROM collaborations c
        JOIN users other_u ON other_u.id = IF(c.requester_id = ?, c.recipient_id, c.requester_id)
        JOIN roles other_role ON other_role.id = other_u.role_id
        LEFT JOIN profiles_faculty other_pf ON other_pf.user_id = other_u.id AND other_role.key = 'faculty'
        LEFT JOIN profiles_researcher other_pr ON other_pr.user_id = other_u.id AND other_role.key = 'researcher'
        LEFT JOIN profiles_entity other_pe ON other_pe.user_id = other_u.id AND other_role.key IN ('university', 'research_center')
        WHERE c.requester_id = ? OR c.recipient_id = ?
        ORDER BY c.created_at DESC
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('iiii', $userId, $userId, $userId, $userId);
    $stmt->execute();
    $res = $stmt->get_result();

    $items = [];
    while ($row = $res->fetch_assoc()) {
        $items[] = [
            'id' => (int) $row['id'],
            'subject' => $row['subject'],
            'message' => $row['message'],
            'status' => $row['status'],
            'created_at' => $row['created_at'],
            'is_outgoing' => (bool) $row['is_outgoing'],
            'other_party' => [
                'role' => $row['other_role_key'],
                'name' => $row['other_name'] ?: '—',
            ],
        ];
    }
    $stmt->close();
    $conn->close();

    jsonResponse(['status' => 'success', 'data' => $items]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_COLLABORATIONS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load collaborations']);
}
