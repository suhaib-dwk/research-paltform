<?php
// =====================================================================
// quality_evidence_download.php — Stage A.5 / P4 (جديد)
//
// يستبدل النمط القديم في quality_upload_evidence.php الذي كان يُرجع
// رابطاً عاماً مباشراً (uploads/quality_evidence/...) قابلاً للوصول
// من أي أحد بلا أي تحقق هوية أو ملكية، بشكل دائم. هنا: كل طلب تنزيل
// يُعاد التحقق فيه من الجلسة + ملكية الجامعة عبر الانضمام إلى
// academic_quality_entity_responses.university_id (ليس هناك حاجة
// لعمود university_id على جدول الأدلة نفسه — الملكية تُشتق عبر
// response_id، تماماً كما ورد في مخطط P2).
// =====================================================================
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
require_once('a02_cors.php');
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

$mimeByExt = [
    'pdf' => 'application/pdf', 'doc' => 'application/msword',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls' => 'application/vnd.ms-excel',
    'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'png' => 'image/png', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
];

try {
    require_once('a01_connect.php');
    $conn = new mysqli($host, $username, $password, $db_name);
    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    require_once('a04_auth.php');
    $universityId = require_university_access($conn);

    $fileId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    if ($fileId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'id is required']);
    }

    // ===== انضمام واحد يشتق الملكية عبر response_id → university_id —
    // عمداً 404 لا 403 عند عدم التطابق، لتفادي كشف وجود المعرّف لجامعة
    // أخرى (تجنّب "existence oracle") =====
    $stmt = $conn->prepare(
        "SELECT ef.file_path, ef.file_name, er.university_id
         FROM academic_quality_evidence_files ef
         JOIN academic_quality_entity_responses er ON er.id = ef.response_id
         WHERE ef.id = ? LIMIT 1"
    );
    $stmt->bind_param('i', $fileId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    $conn->close();

    if (!$row || (int) $row['university_id'] !== $universityId) {
        http_response_code(404);
        jsonResponse(['status' => 'error', 'message' => 'not_found']);
    }

    // basename() دفاعياً رغم أن المسار مُولَّد من الخادم أصلاً منذ P4
    $realPath = __DIR__ . '/../uploads/quality_evidence/' . basename($row['file_path']);
    if (!file_exists($realPath)) {
        http_response_code(404);
        jsonResponse(['status' => 'error', 'message' => 'file_missing']);
    }

    $ext = strtolower(pathinfo($realPath, PATHINFO_EXTENSION));
    $mime = $mimeByExt[$ext] ?? 'application/octet-stream';

    ob_end_clean();
    header('Content-Type: ' . $mime);
    header('Content-Disposition: inline; filename="' . rawurlencode($row['file_name']) . '"');
    header('Content-Length: ' . filesize($realPath));
    readfile($realPath);
    exit;

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('QUALITY_EVIDENCE_DOWNLOAD ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Download failed']);
}
