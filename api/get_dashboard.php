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

    $userId = isset($_POST['user_id']) ? (int) $_POST['user_id'] : 0;
    $lang = ($_POST['lang'] ?? 'ar') === 'en' ? 'en' : 'ar';
    $isAr = $lang === 'ar';

    if ($userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'user_id is required']);
    }

    $roleKey = get_user_role_key($conn, $userId);

    // ===== 1. stats حسب الدور =====
    $stats = [];
    if ($roleKey === 'employee') {
        $res = $conn->query("SELECT status, COUNT(*) AS c FROM researches GROUP BY status");
        $byStatus = [];
        while ($row = $res->fetch_assoc()) $byStatus[$row['status']] = (int) $row['c'];

        $stats = [
            'total_requests' => array_sum($byStatus),
            'total_completed' => $byStatus['published'] ?? 0,
            'total_in_progress' => $byStatus['under_review'] ?? 0,
            'total_needs_action' => $byStatus['draft'] ?? 0,
        ];
    } else {
        $stmt = $conn->prepare("SELECT COUNT(*) AS c FROM reviews WHERE reviewer_id = ?");
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $reviewTotal = (int) $stmt->get_result()->fetch_assoc()['c'];
        $stmt->close();

        $stmt = $conn->prepare("SELECT status, COUNT(*) AS c FROM researches WHERE user_id = ? GROUP BY status");
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $res = $stmt->get_result();
        $byStatus = [];
        while ($row = $res->fetch_assoc()) $byStatus[$row['status']] = (int) $row['c'];
        $stmt->close();

        $stats = [
            'review_total' => $reviewTotal,
            'translation_total' => 0, // نظام الترجمة غير مبني بعد
            'total_completed' => $byStatus['published'] ?? 0,
            'total_in_progress' => $byStatus['under_review'] ?? 0,
            'total_pending' => $byStatus['draft'] ?? 0,
        ];
    }

    // ===== 2. activity: آخر 8 صفوف من activity_log =====
    $eventTypeMap = [
        'login' => 'submit', 'profile_update' => 'submit', 'avatar_update' => 'submit',
        'settings_update' => 'submit', 'research_submit' => 'submit', 'message_reply' => 'submit',
        'task_complete' => 'accept', 'account_approved' => 'accept',
        'review_submit' => 'review', 'account_rejected' => 'review',
    ];
    $serviceLabels = [
        'review' => ['ar' => 'تحكيم', 'en' => 'Review'],
        'translation' => ['ar' => 'ترجمة', 'en' => 'Translation'],
        'research' => ['ar' => 'أبحاث', 'en' => 'Research'],
        'account' => ['ar' => 'الحساب', 'en' => 'Account'],
        'task' => ['ar' => 'المهام', 'en' => 'Tasks'],
        'messages' => ['ar' => 'الرسائل', 'en' => 'Messages'],
    ];

    $stmt = $conn->prepare("SELECT id, event_type, service, text_ar, text_en, created_at FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 8");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $res = $stmt->get_result();
    $activity = [];
    while ($row = $res->fetch_assoc()) {
        $svc = $row['service'] ?: 'account';
        $activity[] = [
            'id' => (int) $row['id'],
            'type' => $eventTypeMap[$row['event_type']] ?? 'submit',
            'text_ar' => $row['text_ar'],
            'text_en' => $row['text_en'],
            'time_ago_ar' => time_ago($row['created_at'], true),
            'time_ago_en' => time_ago($row['created_at'], false),
            'service' => $svc,
            'service_ar' => $serviceLabels[$svc]['ar'] ?? $svc,
            'service_en' => $serviceLabels[$svc]['en'] ?? $svc,
        ];
    }
    $stmt->close();

    // ===== 3. monthly: تجميع أبحاث آخر 12 شهراً =====
    $stmt = $conn->prepare(
        "SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym, COUNT(*) AS total
         FROM researches WHERE user_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
         GROUP BY ym"
    );
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $res = $stmt->get_result();
    $byMonth = [];
    while ($row = $res->fetch_assoc()) $byMonth[$row['ym']] = (int) $row['total'];
    $stmt->close();
    $conn->close();

    $monthNamesAr = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    $monthNamesEn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    $monthly = [];
    for ($i = 11; $i >= 0; $i--) {
        $ts = strtotime("-{$i} months");
        $ym = date('Y-m', $ts);
        $mi = (int) date('n', $ts) - 1;
        $monthly[] = ['label_ar' => $monthNamesAr[$mi], 'label_en' => $monthNamesEn[$mi], 'total' => $byMonth[$ym] ?? 0];
    }

    jsonResponse([
        'status' => 'success',
        'data' => ['stats' => $stats, 'activity' => $activity, 'monthly' => $monthly],
    ]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_DASHBOARD ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load dashboard']);
}
