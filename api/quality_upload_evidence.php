<?php
// =====================================================================
// quality_upload_evidence.php — Stage A.5: أُعيدت كتابته بالكامل
//
// قبل هذه المرحلة: (1) entity_id كان وارداً من العميل بلا أي تحقق هوية
// — IDOR يسمح بإرفاق أدلة لاستجابة جامعة أخرى؛ (2) لا قيود على نوع
// الملف المرفوع إطلاقاً — امتداد .php كان يُقبل ويُحفظ بمسار عام
// قابل للتنفيذ مباشرة (لا يوجد .htaccess في المشروع كله)؛ (3) اسم
// الملف المخزَّن مبني جزئياً على اسم الملف الوارد من العميل.
//
// الإصلاح: مصادقة+تفويض جامعة عبر الجلسة (P2)، قائمة بيضاء صارمة
// لامتداد الملف + التحقق الفعلي من نوعه بقراءة محتواه (P4)، اسم ملف
// عشوائي بالكامل من الخادم (P4)، حد أقصى لحجم الملف (P4)، و.htaccess
// جديد في مجلد الرفع يمنع تنفيذ أي سكربت حتى لو تسرّب ملف غير مسموح.
// =====================================================================
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header("Content-Type: application/json; charset=UTF-8");
require_once('a02_cors.php');
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

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

// ===== قائمة الامتدادات المسموح بها + أنواع MIME الحقيقية المطابقة لها
// (يُتحقَّق من الاثنين معاً: الامتداد وحده غير كافٍ لأنه مجرد نص من
// اسم الملف، ونوع MIME المُرسَل من المتصفح وحده غير كافٍ لأنه قابل
// للتزوير — القراءة الفعلية لمحتوى الملف عبر finfo هي الفيصل) =====
function evidence_allowed_types() {
    return [
        'pdf'  => ['application/pdf'],
        'doc'  => ['application/msword'],
        'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'],
        'xls'  => ['application/vnd.ms-excel'],
        'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'],
        'png'  => ['image/png'],
        'jpg'  => ['image/jpeg'],
        'jpeg' => ['image/jpeg'],
    ];
}

try {
    require_once('a01_connect.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(["status" => "error", "message" => "Database connection failed"]);
    }
    $conn->set_charset('utf8mb4');

    // ===== Stage A.5: university_id من الجلسة المُصادَق عليها =====
    require_once('a04_auth.php');
    $actingUserId = require_authenticated_user($conn);
    $universityId = require_university_access($conn);

    $indicatorId = isset($_POST['indicator_id']) ? (int) $_POST['indicator_id'] : 0;
    $period      = isset($_POST['reporting_period']) ? trim($_POST['reporting_period']) : '';

    if ($indicatorId <= 0 || $period === '') {
        jsonResponse(["status" => "error", "message" => "indicator_id and reporting_period are required"]);
    }

    if (!isset($_FILES['evidence']) || $_FILES['evidence']['error'] != 0) {
        jsonResponse(["status" => "error", "message" => "No file uploaded or upload error"]);
    }

    // ===== P4: حد أقصى لحجم الملف (10 ميغابايت) قبل أي معالجة أخرى =====
    $maxBytes = 10 * 1024 * 1024;
    if ($_FILES['evidence']['size'] > $maxBytes) {
        jsonResponse(["status" => "error", "message" => "file_too_large"]);
    }

    // ===== P4: التحقق من الامتداد (اسمياً) ثم من محتوى الملف الفعلي
    // (finfo — بصمة الملف الحقيقية، وليست وصف المتصفح القابل للتزوير) =====
    $ext = strtolower(pathinfo($_FILES['evidence']['name'], PATHINFO_EXTENSION));
    $allowedTypes = evidence_allowed_types();
    if (!isset($allowedTypes[$ext])) {
        jsonResponse(["status" => "error", "message" => "invalid_file_type"]);
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $actualMime = finfo_file($finfo, $_FILES['evidence']['tmp_name']);
    finfo_close($finfo);

    if (!in_array($actualMime, $allowedTypes[$ext], true)) {
        jsonResponse(["status" => "error", "message" => "file_content_mismatch"]);
    }

    // ===== التأكد من وجود سجل استجابة لهذه الجامعة+المؤشر+الفترة، أو
    // إنشاء واحد فارغ — الآن عبر university_id بدل entity_id =====
    $stmt = $conn->prepare(
        "SELECT id FROM academic_quality_entity_responses WHERE university_id = ? AND indicator_id = ? AND reporting_period = ? LIMIT 1"
    );
    $stmt->bind_param('iis', $universityId, $indicatorId, $period);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($row = $res->fetch_assoc()) {
        $responseId = (int) $row['id'];
        $stmt->close();
    } else {
        $stmt->close();
        $insert = $conn->prepare(
            "INSERT INTO academic_quality_entity_responses (entity_id, university_id, indicator_id, reporting_period, assessment, score, status)
             VALUES (?, ?, ?, ?, 'not_verified', 0, 'draft')"
        );
        $insert->bind_param('iiis', $actingUserId, $universityId, $indicatorId, $period);
        if (!$insert->execute()) {
            jsonResponse(["status" => "error", "message" => "Failed to create response record"]);
        }
        $responseId = $conn->insert_id;
        $insert->close();
    }

    // ===== P4: اسم ملف عشوائي بالكامل من الخادم — لا يُشتق أي جزء منه من
    // اسم الملف الوارد من العميل (يمنع تنفيذ .php المُقنَّع كـ .pdf وأي
    // محاولة اجتياز مسار path traversal بشكل بنيوي، لا بالفلترة فقط) =====
    $safeFileName = 'evidence_' . $universityId . '_' . bin2hex(random_bytes(16)) . '.' . $ext;
    $uploadDir = '../uploads/quality_evidence/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            jsonResponse(["status" => "error", "message" => "Failed to create upload directory"]);
        }
    }
    $targetPath = $uploadDir . $safeFileName;

    if (move_uploaded_file($_FILES['evidence']['tmp_name'], $targetPath)) {
        // اسم الملف الأصلي الوارد من العميل يُحفظ فقط للعرض في الواجهة —
        // لا يُستخدم أبداً كجزء من مسار فعلي على القرص
        $originalName = basename($_FILES['evidence']['name']);
        $fileUrl = 'uploads/quality_evidence/' . $safeFileName;

        $stmt = $conn->prepare(
            "INSERT INTO academic_quality_evidence_files (response_id, file_name, file_path) VALUES (?, ?, ?)"
        );
        $stmt->bind_param('iss', $responseId, $originalName, $fileUrl);

        if ($stmt->execute()) {
            $evidenceFileId = $conn->insert_id;

            // ===== تسجيل نشاط رفع دليل (log_activity الموجودة أصلاً) =====
            log_activity($conn, $actingUserId, 'evidence_upload', 'academic_quality',
                'رفع ملف دليل لمؤشر جودة', 'Evidence file uploaded for a quality indicator',
                'academic_quality_evidence_files', $evidenceFileId);

            jsonResponse([
                "status" => "success",
                "message" => "Evidence uploaded",
                "data" => [
                    "id" => $evidenceFileId,
                    "file_name" => $originalName,
                ],
            ]);
        } else {
            @unlink($targetPath);
            jsonResponse(["status" => "error", "message" => "Database insert failed"]);
        }
        $stmt->close();
    } else {
        jsonResponse(["status" => "error", "message" => "Failed to move uploaded file"]);
    }

    $conn->close();

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('QUALITY_UPLOAD_EVIDENCE ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(["status" => "error", "message" => "Upload failed"]);
}
