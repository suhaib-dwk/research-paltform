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

    $requesterId = isset($_POST['requester_id']) ? (int) $_POST['requester_id'] : 0;
    $targetUserId = isset($_POST['target_user_id']) ? (int) $_POST['target_user_id'] : 0;
    $newStatus = trim($_POST['new_status'] ?? '');

    if ($requesterId <= 0 || $targetUserId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'requester_id and target_user_id are required']);
    }
    if (!in_array($newStatus, ['active', 'rejected'], true)) {
        jsonResponse(['status' => 'error', 'message' => 'invalid_status']);
    }

    $requesterRole = get_user_role_key($conn, $requesterId);
    if ($requesterRole !== 'employee') {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'unauthorized']);
    }

    // ===== تحديث ذرّي: status و is_active معاً بجملة واحدة، يضمن عدم تعارضهما أبداً =====
    $isActive = ($newStatus === 'active') ? 1 : 0;
    $stmt = $conn->prepare("UPDATE users SET status = ?, is_active = ? WHERE id = ?");
    $stmt->bind_param('sii', $newStatus, $isActive, $targetUserId);

    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Update failed', 'debug' => $err]);
    }
    $affected = $stmt->affected_rows;
    $stmt->close();

    if ($affected === 0) {
        // ممكن تكون القيمة نفسها أصلاً (لا تغيير فعلي) — ليست بالضرورة خطأ، نتحقق من الوجود
        $check = $conn->prepare("SELECT id FROM users WHERE id = ? LIMIT 1");
        $check->bind_param('i', $targetUserId);
        $check->execute();
        $exists = $check->get_result()->num_rows > 0;
        $check->close();
        if (!$exists) {
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'user_not_found']);
        }
    }

    $eventType = $newStatus === 'active' ? 'account_approved' : 'account_rejected';
    $textAr = $newStatus === 'active' ? 'تم اعتماد الحساب' : 'تم رفض الحساب';
    $textEn = $newStatus === 'active' ? 'Account approved' : 'Account rejected';
    log_activity($conn, $targetUserId, $eventType, 'account', $textAr, $textEn);

    $conn->close();

    jsonResponse(['status' => 'success', 'data' => ['user_id' => $targetUserId, 'status' => $newStatus]]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('UPDATE_USER_STATUS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to update user status']);
}
