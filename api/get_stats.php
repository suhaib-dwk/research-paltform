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

    $userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;
    if ($userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'user_id is required']);
    }

    $stmt = $conn->prepare("SELECT COUNT(*) AS total FROM researches WHERE user_id = ?");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $researchesCount = (int) $stmt->get_result()->fetch_assoc()['total'];
    $stmt->close();

    // ===== تجميع شهري لآخر 12 شهراً (لرسم recharts) =====
    $stmt = $conn->prepare(
        "SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym, COUNT(*) AS total
         FROM researches
         WHERE user_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
         GROUP BY ym ORDER BY ym ASC"
    );
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $res = $stmt->get_result();
    $byMonth = [];
    while ($row = $res->fetch_assoc()) {
        $byMonth[$row['ym']] = (int) $row['total'];
    }
    $stmt->close();
    $conn->close();

    $monthNamesAr = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    $monthNamesEn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    $monthly = [];
    for ($i = 11; $i >= 0; $i--) {
        $ts = strtotime("-{$i} months");
        $ym = date('Y-m', $ts);
        $monthIndex = (int) date('n', $ts) - 1;
        $monthly[] = [
            'label_ar' => $monthNamesAr[$monthIndex],
            'label_en' => $monthNamesEn[$monthIndex],
            'total' => $byMonth[$ym] ?? 0,
        ];
    }

    // ⚠️ citations/views/downloads: لا يوجد نظام تتبع فعلي بعد — صفر حقيقي بدل بيانات وهمية
    jsonResponse([
        'status' => 'success',
        'data' => [
            'researches' => $researchesCount,
            'citations' => 0,
            'views' => 0,
            'downloads' => 0,
            'monthly' => $monthly,
        ],
    ]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('GET_STATS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to load stats']);
}
