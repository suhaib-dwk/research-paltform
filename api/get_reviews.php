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
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    $reviewerId = isset($_GET['reviewer_id']) ? (int) $_GET['reviewer_id'] : 0;
    if ($reviewerId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'reviewer_id is required']);
    }

    // ✅ status: CSV اختياري (مثال: "pending,in_progress" أو "completed"). بدون قيمة = الكل.
    $statusParam = isset($_GET['status']) ? trim($_GET['status']) : '';
    $statusList = array_filter(array_map('trim', explode(',', $statusParam)));
    $validStatuses = ['pending', 'in_progress', 'completed'];
    $statusList = array_values(array_intersect($statusList, $validStatuses));

    $sql = "SELECT rv.id, rv.research_id, rv.review_type, rv.status, rv.score, rv.comments, rv.assigned_at,
                   r.title_ar, r.title_en
            FROM reviews rv
            JOIN researches r ON r.id = rv.research_id
            WHERE rv.reviewer_id = ?";
    $types = 'i';
    $params = [$reviewerId];

    if (!empty($statusList)) {
        $placeholders = implode(',', array_fill(0, count($statusList), '?'));
        $sql .= " AND rv.status IN ($placeholders)";
        foreach ($statusList as $s) {
            $types .= 's';
            $params[] = $s;
        }
    }
    $sql .= " ORDER BY rv.assigned_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $res = $stmt->get_result();

    $reviews = [];
    while ($row = $res->fetch_assoc()) {
        $reviews[] = [
            'id' => (int) $row['id'],
            'research_id' => (int) $row['research_id'],
            'review_type' => $row['review_type'],
            'title_ar' => $row['title_ar'],
            'title_en' => $row['title_en'],
            'status' => $row['status'],
            'score' => $row['score'] !== null ? (float) $row['score'] : null,
            'comments' => $row['comments'],
            'date' => substr($row['assigned_at'], 0, 10),
        ];
    }
    $stmt->close();
    $conn->close();

    jsonResponse(['status' => 'success', 'data' => $reviews]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_REVIEWS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load reviews']);
}
