<?php
// ينشئ طلب تعاون بحثي جديد من مستخدم (requester) إلى مستخدم آخر (recipient).
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

const MAX_SUBJECT_CHARS = 300;
const MAX_MESSAGE_CHARS = 2000;

try {
    require_once('a01_connect.php');
    require_once('a03_helpers.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    $requesterId = isset($_POST['requester_id']) ? (int) $_POST['requester_id'] : 0;
    $recipientId = isset($_POST['recipient_id']) ? (int) $_POST['recipient_id'] : 0;
    $subject = trim($_POST['subject'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if ($requesterId <= 0 || $recipientId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'requester_id and recipient_id are required']);
    }
    if ($requesterId === $recipientId) {
        jsonResponse(['status' => 'error', 'message' => 'cannot_collaborate_with_self']);
    }
    if ($subject === '') {
        jsonResponse(['status' => 'error', 'message' => 'subject_required']);
    }
    if (mb_strlen($subject) > MAX_SUBJECT_CHARS) {
        $subject = mb_substr($subject, 0, MAX_SUBJECT_CHARS);
    }
    if (mb_strlen($message) > MAX_MESSAGE_CHARS) {
        $message = mb_substr($message, 0, MAX_MESSAGE_CHARS);
    }

    // ===== تحقق أن المستلم فعلاً مستخدم مؤهل للتعاون (باحث/هيئة تدريسية/جامعة/مركز بحثي) =====
    $stmt = $conn->prepare(
        "SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
         WHERE u.id = ? AND r.key IN ('researcher','faculty','university','research_center')
           AND u.status = 'active' AND u.deleted_at IS NULL LIMIT 1"
    );
    $stmt->bind_param('i', $recipientId);
    $stmt->execute();
    $validRecipient = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$validRecipient) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'invalid_recipient']);
    }

    $stmt = $conn->prepare(
        "INSERT INTO collaborations (requester_id, recipient_id, subject, message, status)
         VALUES (?, ?, ?, ?, 'pending')"
    );
    $stmt->bind_param('iiss', $requesterId, $recipientId, $subject, $message);

    if (!$stmt->execute()) {
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'insert_failed']);
    }
    $newId = $conn->insert_id;
    $stmt->close();

    log_activity(
        $conn, $requesterId, 'collaboration_request', 'collaborations',
        'أرسلت طلب تعاون: ' . $subject, 'Sent a collaboration request: ' . $subject,
        'collaborations', $newId
    );

    $conn->close();

    jsonResponse(['status' => 'success', 'data' => ['id' => $newId]]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('CREATE_COLLABORATION_REQUEST ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to create collaboration request']);
}
