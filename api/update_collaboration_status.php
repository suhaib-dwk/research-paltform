<?php
// يحدّث حالة طلب تعاون (قبول/رفض) — فقط المستلم (recipient) يملك صلاحية الرد على الطلب.
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

    $collabId = isset($_POST['collaboration_id']) ? (int) $_POST['collaboration_id'] : 0;
    $userId = isset($_POST['user_id']) ? (int) $_POST['user_id'] : 0;
    $status = trim($_POST['status'] ?? '');

    if ($collabId <= 0 || $userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'collaboration_id and user_id are required']);
    }
    if (!in_array($status, ['accepted', 'rejected'], true)) {
        jsonResponse(['status' => 'error', 'message' => 'invalid_status']);
    }

    // ===== تحقق أن المستخدم الحالي هو فعلاً المستلم (recipient) وأن الطلب لا يزال pending =====
    $stmt = $conn->prepare(
        "SELECT id, requester_id, subject FROM collaborations
         WHERE id = ? AND recipient_id = ? AND status = 'pending' LIMIT 1"
    );
    $stmt->bind_param('ii', $collabId, $userId);
    $stmt->execute();
    $collab = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$collab) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'collaboration_not_found_or_not_pending']);
    }

    $stmt = $conn->prepare("UPDATE collaborations SET status = ? WHERE id = ?");
    $stmt->bind_param('si', $status, $collabId);

    if (!$stmt->execute()) {
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'update_failed']);
    }
    $stmt->close();

    $eventType = $status === 'accepted' ? 'collaboration_accept' : 'collaboration_reject';
    $textAr = ($status === 'accepted' ? 'قبلت طلب التعاون: ' : 'رفضت طلب التعاون: ') . $collab['subject'];
    $textEn = ($status === 'accepted' ? 'Accepted collaboration request: ' : 'Rejected collaboration request: ') . $collab['subject'];
    log_activity($conn, $userId, $eventType, 'collaborations', $textAr, $textEn, 'collaborations', $collabId);

    $conn->close();

    jsonResponse(['status' => 'success', 'data' => ['id' => $collabId, 'status' => $status]]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('UPDATE_COLLABORATION_STATUS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to update collaboration status']);
}
