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

    $taskId = isset($_POST['task_id']) ? (int) $_POST['task_id'] : 0;
    $userId = isset($_POST['user_id']) ? (int) $_POST['user_id'] : 0;
    $status = trim($_POST['status'] ?? '');

    if ($taskId <= 0 || $userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'task_id and user_id are required']);
    }
    if (!in_array($status, ['pending', 'in_progress', 'completed'], true)) {
        jsonResponse(['status' => 'error', 'message' => 'invalid_status']);
    }

    // ===== تحقق ملكية المهمة =====
    $stmt = $conn->prepare("SELECT id, title_ar, title_en FROM tasks WHERE id = ? AND user_id = ? LIMIT 1");
    $stmt->bind_param('ii', $taskId, $userId);
    $stmt->execute();
    $task = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$task) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'task_not_found']);
    }

    $completedAtSql = $status === 'completed' ? 'NOW()' : 'NULL';
    $stmt = $conn->prepare("UPDATE tasks SET status = ?, completed_at = {$completedAtSql} WHERE id = ?");
    $stmt->bind_param('si', $status, $taskId);

    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Update failed', 'debug' => $err]);
    }
    $stmt->close();

    if ($status === 'completed') {
        log_activity($conn, $userId, 'task_complete', 'task', 'أكملت المهمة: ' . $task['title_ar'], 'Completed task: ' . $task['title_en'], 'tasks', $taskId);
    }

    $conn->close();

    jsonResponse(['status' => 'success', 'data' => ['task_id' => $taskId, 'status' => $status]]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('UPDATE_TASK_STATUS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to update task status']);
}
