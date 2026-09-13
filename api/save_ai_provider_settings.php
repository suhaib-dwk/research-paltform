<?php
// =====================================================================
// save_ai_provider_settings.php — حفظ إعدادات مزوّد ذكاء اصطناعي واحد
// (OpenRouter أو OpenAI) من لوحة تحكم الأدمن.
//
// الطلب (JSON): { user_id, provider_key, is_enabled, model, api_key? }
// - api_key اختياري: إن أُرسل نصًا غير فارغ يُشفَّر ويُستبدل المخزَّن.
//   إن لم يُرسَل إطلاقًا (أو أُرسل فارغًا)، يبقى المفتاح المخزَّن سابقًا
//   كما هو — هذا يسمح للأدمن بتعديل is_enabled/model فقط دون إعادة كتابة
//   مفتاح كان قد أدخله سابقًا، ودون أن تُعاد قيمته له بالواجهة أصلاً.
//
// أمان: التشفير عبر ai_provider_crypto.php (AES-256-GCM). إن لم يكن مفتاح
// التشفير مُعدًّا بعد على هذا الخادم، يُرفض حفظ أي api_key جديد صراحةً
// (crypto_not_configured) بدل تخزينه كنص صريح بالخطأ.
//
// وصول: super_admin فقط.
// =====================================================================

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

require_once('a03_helpers.php');

try {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);

    $userId = isset($body['user_id']) ? (int) $body['user_id'] : 0;
    $providerKey = trim((string) ($body['provider_key'] ?? ''));
    $isEnabled = !empty($body['is_enabled']) ? 1 : 0;
    $model = trim((string) ($body['model'] ?? ''));
    $apiKey = isset($body['api_key']) ? trim((string) $body['api_key']) : '';

    if ($userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'user_id is required']);
    }
    if (!in_array($providerKey, ['openrouter', 'openai'], true)) {
        jsonResponse(['status' => 'error', 'message' => 'invalid_provider_key']);
    }
    if ($model === '') {
        jsonResponse(['status' => 'error', 'message' => 'model is required']);
    }

    require_once('a01_connect.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    $roleKey = get_user_role_key($conn, $userId);
    if ($roleKey !== 'super_admin') {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'unauthorized']);
    }

    // ===== تشفير المفتاح الجديد إن أُرسل =====
    $updateKey = ($apiKey !== '');
    $encryptedKey = null;
    $keyLast4 = null;

    if ($updateKey) {
        $cryptoPath = __DIR__ . '/ai_provider_crypto.php';
        if (!file_exists($cryptoPath)) {
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'crypto_not_configured']);
        }
        require_once $cryptoPath;

        $encryptedKey = ai_provider_encrypt($apiKey);
        if ($encryptedKey === null) {
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'crypto_not_configured']);
        }
        $keyLast4 = substr($apiKey, -4);
    }

    if ($updateKey) {
        $stmt = $conn->prepare(
            "INSERT INTO ai_provider_settings (provider_key, is_enabled, api_key_encrypted, api_key_last4, model, updated_by)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                is_enabled = VALUES(is_enabled),
                api_key_encrypted = VALUES(api_key_encrypted),
                api_key_last4 = VALUES(api_key_last4),
                model = VALUES(model),
                updated_by = VALUES(updated_by)"
        );
        $stmt->bind_param('sissss', $providerKey, $isEnabled, $encryptedKey, $keyLast4, $model, $userId);
    } else {
        // ===== لا تعديل على المفتاح — نحدّث فقط الحالة/الموديل، ونحافظ على المفتاح المخزَّن إن كان الصف موجودًا =====
        $stmt = $conn->prepare(
            "INSERT INTO ai_provider_settings (provider_key, is_enabled, model, updated_by)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                is_enabled = VALUES(is_enabled),
                model = VALUES(model),
                updated_by = VALUES(updated_by)"
        );
        $stmt->bind_param('siss', $providerKey, $isEnabled, $model, $userId);
    }

    if (!$stmt->execute()) {
        // ملاحظة أمان: لا نُعيد $stmt->error (رسالة MySQL الخام) للعميل — قد تكشف
        // تفاصيل بنية الجدول. نسجّلها بـ error_log فقط ونُعيد رسالة عامة.
        error_log('SAVE_AI_PROVIDER_SETTINGS SQL error: ' . $stmt->error);
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Save failed']);
    }
    $stmt->close();

    log_activity($conn, $userId, 'ai_provider_settings_update', 'admin', "تم تحديث إعدادات مزوّد الذكاء الاصطناعي: {$providerKey}", "AI provider settings updated: {$providerKey}");

    $conn->close();
    jsonResponse(['status' => 'success']);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('SAVE_AI_PROVIDER_SETTINGS ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'Failed to save AI provider settings']);
}
