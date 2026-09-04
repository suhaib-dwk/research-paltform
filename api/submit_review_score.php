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

    $reviewId = isset($_POST['review_id']) ? (int) $_POST['review_id'] : 0;
    $reviewerId = isset($_POST['reviewer_id']) ? (int) $_POST['reviewer_id'] : 0;
    $score = isset($_POST['score']) && $_POST['score'] !== '' ? (float) $_POST['score'] : null;
    $comments = trim($_POST['comments'] ?? '');

    if ($reviewId <= 0 || $reviewerId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'review_id and reviewer_id are required']);
    }
    if ($score === null || $score < 0 || $score > 100) {
        jsonResponse(['status' => 'error', 'message' => 'invalid_score']);
    }

    // ===== تحقق أن المُحكِّم هو صاحب سجل التحكيم فعلاً =====
    $stmt = $conn->prepare(
        "SELECT rv.id, r.title_ar, r.title_en FROM reviews rv
         JOIN researches r ON r.id = rv.research_id
         WHERE rv.id = ? AND rv.reviewer_id = ? LIMIT 1"
    );
    $stmt->bind_param('ii', $reviewId, $reviewerId);
    $stmt->execute();
    $review = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$review) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'review_not_found']);
    }

    $stmt = $conn->prepare(
        "UPDATE reviews SET status = 'completed', score = ?, comments = ?, completed_at = NOW() WHERE id = ?"
    );
    $stmt->bind_param('dsi', $score, $comments, $reviewId);

    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Update failed', 'debug' => $err]);
    }
    $stmt->close();

    log_activity(
        $conn, $reviewerId, 'review_submit', 'review',
        'أنهيت تحكيم بحث: ' . $review['title_ar'],
        'Completed review: ' . ($review['title_en'] ?: $review['title_ar']),
        'reviews', $reviewId
    );

    $conn->close();

    jsonResponse(['status' => 'success', 'data' => ['review_id' => $reviewId, 'status' => 'completed', 'score' => $score]]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('SUBMIT_REVIEW ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to submit review']);
}
