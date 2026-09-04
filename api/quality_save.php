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

set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

function jsonResponse($data) {
    ob_end_clean();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// ===== حساب الدرجة حسب نوع المؤشر =====
// ⚠️ نظام الدرجات الموزون الرسمي (دليل معايير الاعتماد المؤسسي): كل مؤشر له
// درجة قصوى حقيقية مختلفة ($maxScore، تُجلب من عمود academic_quality_indicators.max_score)
// بدل الافتراض القديم أن كل مؤشر سقفه 100 نقطة موحّدة. الدالة تُرجع الآن "نقاطاً فعلية"
// (0 إلى $maxScore) وليس نسبة مئوية ثابتة من 100.
function computeScore($indicatorType, $data, $maxScore) {
    switch ($indicatorType) {
        case 'compliance':
            $level = $data['compliance_level'] ?? 'none';
            return match ($level) {
                'full' => $maxScore,
                'partial' => round($maxScore / 2, 2),
                default => 0.0,
            };

        case 'maturity':
            $level = isset($data['maturity_level']) ? (int) $data['maturity_level'] : 0;
            // تقريب لأقرب مستوى صالح: 0/25/50/75/100 (نسبة مئوية)، ثم تحويلها لنقاط من سقف المؤشر
            $valid = [0, 25, 50, 75, 100];
            $closest = 0;
            $minDiff = PHP_INT_MAX;
            foreach ($valid as $v) {
                $diff = abs($v - $level);
                if ($diff < $minDiff) {
                    $minDiff = $diff;
                    $closest = $v;
                }
            }
            return round(($closest / 100) * $maxScore, 2);

        case 'quantitative':
        case 'percentage':
            $actual = isset($data['actual_value']) && $data['actual_value'] !== '' ? (float) $data['actual_value'] : null;
            $target = isset($data['target_value']) && $data['target_value'] !== '' ? (float) $data['target_value'] : null;
            if ($actual === null || $target === null || $target <= 0) {
                return 0.0;
            }
            $ratio = min(1, max(0, $actual / $target));
            return round($ratio * $maxScore, 2);

        default:
            return 0.0;
    }
}

try {
    $raw = file_get_contents('php://input');

    $decoded = base64_decode($raw, true);
    if ($decoded !== false) {
        $jsonCheck = json_decode($decoded);
        if ($jsonCheck !== null) {
            $raw = $decoded;
        }
    }

    $data = json_decode($raw, true);

    if (!$data || json_last_error() !== JSON_ERROR_NONE) {
        jsonResponse(['status' => 'error', 'message' => 'Invalid JSON data']);
    }

    $entityId    = (int) ($data['entity_id'] ?? 0);
    $indicatorId = (int) ($data['indicator_id'] ?? 0);
    $period      = trim($data['reporting_period'] ?? '');

    if ($entityId <= 0 || $indicatorId <= 0 || $period === '') {
        jsonResponse(['status' => 'error', 'message' => 'entity_id, indicator_id and reporting_period are required']);
    }

    require_once('a01_connect.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    // ===== التحقق أن entity_id مستخدم حقيقي بدور جهة أكاديمية =====
    $stmt = $conn->prepare(
        "SELECT u.id, r.key AS role_key FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.id = ? AND u.deleted_at IS NULL LIMIT 1"
    );
    $stmt->bind_param('i', $entityId);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows === 0) {
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Invalid entity_id']);
    }
    $entityRow = $res->fetch_assoc();
    $stmt->close();

    $allowedRoles = ['university', 'college', 'research_center'];
    if (!in_array($entityRow['role_key'], $allowedRoles, true)) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'This role cannot submit quality data']);
    }

    // ===== جلب نوع المؤشر ودرجته القصوى =====
    $stmt = $conn->prepare("SELECT indicator_type, max_score FROM academic_quality_indicators WHERE id = ? LIMIT 1");
    $stmt->bind_param('i', $indicatorId);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows === 0) {
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Invalid indicator_id']);
    }
    $indicatorRow = $res->fetch_assoc();
    $indicatorType = $indicatorRow['indicator_type'];
    $maxScore = (float) $indicatorRow['max_score'];
    $stmt->close();

    // ===== تجهيز الحقول =====
    $actualValue     = isset($data['actual_value']) && $data['actual_value'] !== '' ? (float) $data['actual_value'] : null;
    $targetValue     = isset($data['target_value']) && $data['target_value'] !== '' ? (float) $data['target_value'] : null;
    $maturityLevel   = isset($data['maturity_level']) && $data['maturity_level'] !== '' ? (int) $data['maturity_level'] : null;
    $complianceLevel = in_array(($data['compliance_level'] ?? ''), ['none', 'partial', 'full'], true) ? $data['compliance_level'] : null;
    $assessment      = in_array(($data['assessment'] ?? ''), ['not_verified', 'partial', 'full'], true) ? $data['assessment'] : 'not_verified';
    $evidenceQuality = isset($data['evidence_quality']) && $data['evidence_quality'] !== '' ? (int) $data['evidence_quality'] : null;
    $gapNotes        = trim($data['gap_notes'] ?? '');
    $correctiveAction = trim($data['corrective_action'] ?? '');
    $ownerName       = trim($data['owner_name'] ?? '');
    $dueDate         = trim($data['due_date'] ?? '');
    $dueDateSql      = ($dueDate !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $dueDate)) ? $dueDate : null;
    $status          = trim($data['status'] ?? 'draft');

    $score = computeScore($indicatorType, [
        'compliance_level' => $complianceLevel,
        'maturity_level'   => $maturityLevel,
        'actual_value'     => $actualValue,
        'target_value'     => $targetValue,
    ], $maxScore);

    // ===== إدراج أو تحديث =====
    $stmt = $conn->prepare(
        "INSERT INTO academic_quality_entity_responses
            (entity_id, indicator_id, reporting_period, actual_value, target_value,
             maturity_level, compliance_level, assessment, evidence_quality, score,
             gap_notes, corrective_action, owner_name, due_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            actual_value = VALUES(actual_value),
            target_value = VALUES(target_value),
            maturity_level = VALUES(maturity_level),
            compliance_level = VALUES(compliance_level),
            assessment = VALUES(assessment),
            evidence_quality = VALUES(evidence_quality),
            score = VALUES(score),
            gap_notes = VALUES(gap_notes),
            corrective_action = VALUES(corrective_action),
            owner_name = VALUES(owner_name),
            due_date = VALUES(due_date),
            status = VALUES(status)"
    );

    if (!$stmt) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Prepare failed', 'debug' => $conn->error]);
    }

    $stmt->bind_param(
        'iisddissidsssss',
        $entityId, $indicatorId, $period, $actualValue, $targetValue,
        $maturityLevel, $complianceLevel, $assessment, $evidenceQuality, $score,
        $gapNotes, $correctiveAction, $ownerName, $dueDateSql, $status
    );

    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Save failed', 'debug' => $err]);
    }
    $stmt->close();
    $conn->close();

    jsonResponse([
        'status' => 'success',
        'data' => [
            'indicator_id' => $indicatorId,
            'score' => $score,
            'max_score' => $maxScore,
        ],
    ]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('QUALITY_SAVE ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Save failed']);
}
