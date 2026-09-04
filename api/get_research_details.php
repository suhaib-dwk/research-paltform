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

    $researchId = isset($_GET['research_id']) ? (int) $_GET['research_id'] : 0;
    $userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;

    if ($researchId <= 0 || $userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'research_id and user_id are required']);
    }

    // ===== يُسمح لصاحب البحث، أو لأي مُحكِّم مُسنَد إليه بحث بهذا الـ id =====
    $stmt = $conn->prepare(
        "SELECT r.id, r.title_ar, r.title_en, r.abstract, r.keywords, r.field,
                r.file_name, r.file_path, r.file_size, r.status, r.created_at, r.user_id
         FROM researches r WHERE r.id = ? LIMIT 1"
    );
    $stmt->bind_param('i', $researchId);
    $stmt->execute();
    $research = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$research) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'research_not_found']);
    }

    $isOwner = (int) $research['user_id'] === $userId;
    if (!$isOwner) {
        $stmt2 = $conn->prepare("SELECT id FROM reviews WHERE research_id = ? AND reviewer_id = ? LIMIT 1");
        $stmt2->bind_param('ii', $researchId, $userId);
        $stmt2->execute();
        $isReviewer = $stmt2->get_result()->num_rows > 0;
        $stmt2->close();
        if (!$isReviewer) {
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'unauthorized']);
        }
    }

    $conn->close();

    jsonResponse([
        'status' => 'success',
        'data' => [
            'id' => (int) $research['id'],
            'title_ar' => $research['title_ar'],
            'title_en' => $research['title_en'],
            'abstract' => $research['abstract'],
            'keywords' => $research['keywords'],
            'field' => $research['field'],
            'file_name' => $research['file_name'],
            'file_path' => $research['file_path'],
            'file_size' => $research['file_size'] !== null ? (int) $research['file_size'] : null,
            'status' => $research['status'],
            'date' => substr($research['created_at'], 0, 10),
        ],
    ]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_RESEARCH_DETAILS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load research details']);
}
