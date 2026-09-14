<?php
// يعيد قائمة المستخدمين المؤهلين للتعاون البحثي (باحث/هيئة تدريسية/جامعة/مركز بحثي)
// باستثناء المستخدم الحالي نفسه، لعرضها كخيارات عند إنشاء طلب تعاون جديد.
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

    $excludeUserId = isset($_GET['exclude_user_id']) ? (int) $_GET['exclude_user_id'] : 0;

    $sql = "
        SELECT u.id AS user_id, r.key AS role_key,
               COALESCE(pf.name, pr.full_name, pe.entity_name) AS display_name
        FROM users u
        JOIN roles r ON r.id = u.role_id
        LEFT JOIN profiles_faculty pf ON pf.user_id = u.id AND r.key = 'faculty'
        LEFT JOIN profiles_researcher pr ON pr.user_id = u.id AND r.key = 'researcher'
        LEFT JOIN profiles_entity pe ON pe.user_id = u.id AND r.key IN ('university', 'research_center')
        WHERE r.key IN ('researcher', 'faculty', 'university', 'research_center')
          AND u.status = 'active'
          AND u.deleted_at IS NULL
          AND u.id != ?
        ORDER BY display_name ASC
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $excludeUserId);
    $stmt->execute();
    $res = $stmt->get_result();

    $partners = [];
    while ($row = $res->fetch_assoc()) {
        if (empty($row['display_name'])) continue; // بروفايل غير مكتمل بعد
        $partners[] = [
            'user_id' => (int) $row['user_id'],
            'role' => $row['role_key'],
            'name' => $row['display_name'],
        ];
    }
    $stmt->close();
    $conn->close();

    jsonResponse(['status' => 'success', 'data' => $partners]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_COLLABORATION_PARTNERS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load partners']);
}
