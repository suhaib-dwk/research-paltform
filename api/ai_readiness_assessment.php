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

require_once('a03_helpers.php');

try {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);
    $userId = isset($body['user_id']) ? (int) $body['user_id'] : 0;
    if ($userId <= 0) {
        jsonResponse(['status' => 'error', 'message' => 'user_id is required']);
    }

    require_once('a01_connect.php');
    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    $roleKey = get_user_role_key($conn, $userId);
    if (!$roleKey) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'invalid_user']);
    }
    if ($roleKey !== 'university') {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'unsupported_role']);
    }

    // ===== Stage A: تحليل هوية الجامعة عبر العضوية — يُستخدم في سجل التدقيق أدناه =====
    $universityId = get_university_id_for_user($conn, $userId);

    // ===== 1) جلب أول مزوّد ذكاء اصطناعي مفعّل من قاعدة البيانات (لوحة تحكم الأدمن) =====
    // الأولوية لـ OpenRouter عند تفعيل الاثنين معًا (ORDER BY FIELD أدناه)، حفاظًا على
    // نفس سلوك النسخة السابقة قبل دعم تعدد المزوّدين.
    $providerRow = null;
    $providerResult = $conn->query(
        "SELECT provider_key, api_key_encrypted, model FROM ai_provider_settings
         WHERE is_enabled = 1 AND api_key_encrypted IS NOT NULL
         ORDER BY FIELD(provider_key, 'openrouter', 'openai') LIMIT 1"
    );
    if ($providerResult) {
        $providerRow = $providerResult->fetch_assoc();
    }

    if (!$providerRow) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'ai_not_configured']);
    }

    $cryptoPath = __DIR__ . '/ai_provider_crypto.php';
    if (!file_exists($cryptoPath)) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'ai_not_configured']);
    }
    require_once $cryptoPath;

    $providerKey = $providerRow['provider_key'];
    $aiModel = $providerRow['model'] ?: 'openai/gpt-4o-mini';
    $apiKey = ai_provider_decrypt($providerRow['api_key_encrypted']);

    if (empty($apiKey)) {
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'ai_not_configured']);
    }

    // ===== نقاط النهاية لكل مزوّد (كلاهما متوافق مع OpenAI Chat Completions API) =====
    $endpoints = [
        'openrouter' => 'https://openrouter.ai/api/v1/chat/completions',
        'openai'     => 'https://api.openai.com/v1/chat/completions',
    ];
    $apiEndpoint = $endpoints[$providerKey];

    // ===== 2) جلب ملف الجامعة الكامل (نفس منطق get_university_profile.php) =====
    $profile = get_university_profile_data($conn, $userId);

    // ===== 3) بناء الطلب (نفس صيغة OpenAI Chat Completions، متوافقة مع كلا المزوّدين) =====
    $schemaInstructions = <<<'SCHEMA'
أعد فقط كائن JSON بهذا الشكل بالضبط (بدون أي نص خارج الـ JSON):
{
  "overall_readiness_percent": <رقم من 0 إلى 100>,
  "dimensions": [
    { "key": "data", "label_ar": "جاهزية البيانات", "label_en": "Data Readiness", "percent": <0-100>, "status": "met|partial|not_met" },
    { "key": "evidence", "label_ar": "جاهزية الأدلة", "label_en": "Evidence Readiness", "percent": <0-100>, "status": "met|partial|not_met" },
    { "key": "definition", "label_ar": "جاهزية التعريفات", "label_en": "Definition Readiness", "percent": <0-100>, "status": "met|partial|not_met" },
    { "key": "methodology", "label_ar": "جاهزية المنهجية", "label_en": "Methodology Readiness", "percent": <0-100>, "status": "met|partial|not_met" },
    { "key": "performance", "label_ar": "جاهزية الأداء", "label_en": "Performance Readiness", "percent": <0-100>, "status": "met|partial|not_met" }
  ],
  "category_scores": {
    "quality": <0-100>, "productivity": <0-100>, "impact": <0-100>,
    "funding": <0-100>, "internationalization": <0-100>, "governance": <0-100>
  },
  "critical_gaps": [ { "ar": "...", "en": "..." } ],
  "opportunities": [ { "ar": "...", "en": "..." } ]
}
SCHEMA;

    $systemPrompt = "أنت خبير تقييم جاهزية بحثية أكاديمية ضمن منصة Research Excellence Platform. "
        . "مهمتك: تحليل ملف بيانات جامعة (الاسم، الهيكل الأكاديمي: الحرم الجامعي/الكليات/الأقسام/المراكز البحثية، "
        . "استراتيجية البحث، مجالات الأولوية، أهداف البحث) وتقدير مدى جاهزيتها البحثية بشكل تقريبي منطقي "
        . "استنادًا فقط لاكتمال ووضوح البيانات المُدخلة (وليس بيانات خارجية غير متوفرة لك). "
        . "كن متحفظًا وواقعيًا: بيانات ناقصة أو فارغة تعني نسبة جاهزية منخفضة في تلك الأبعاد، وليس تخمينًا متفائلًا. "
        . $schemaInstructions;

    $userPrompt = "بيانات ملف الجامعة (JSON):\n" . json_encode($profile, JSON_UNESCAPED_UNICODE);

    $requestBody = [
        'model' => $aiModel,
        'response_format' => ['type' => 'json_object'],
        'temperature' => 0.3,
        'messages' => [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $userPrompt],
        ],
    ];

    // ===== 4) استدعاء مزوّد الذكاء الاصطناعي المفعّل (OpenRouter أو OpenAI) =====
    $requestHeaders = [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ];
    if ($providerKey === 'openrouter') {
        // رؤوس اختيارية يوصي بها OpenRouter لتحديد هوية التطبيق المستدعي
        $requestHeaders[] = 'HTTP-Referer: https://ris-platform.local';
        $requestHeaders[] = 'X-Title: IR Source Research Excellence Platform';
    }

    $ch = curl_init($apiEndpoint);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($requestBody, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => $requestHeaders,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 45,
        CURLOPT_CONNECTTIMEOUT => 10,
    ]);

    $responseRaw = curl_exec($ch);
    $curlErrno = curl_errno($ch);
    $curlError = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($curlErrno !== 0) {
        error_log('AI_READINESS curl error: ' . $curlError);
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'ai_request_failed']);
    }

    if ($httpCode !== 200) {
        error_log('AI_READINESS non-200 response (' . $httpCode . '): ' . substr((string) $responseRaw, 0, 2000));
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'ai_request_failed']);
    }

    $decoded = json_decode($responseRaw, true);
    $content = $decoded['choices'][0]['message']['content'] ?? null;
    if (!$content) {
        error_log('AI_READINESS missing content in response: ' . substr((string) $responseRaw, 0, 2000));
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'ai_response_invalid']);
    }

    $result = json_decode($content, true);
    if (!is_array($result) || !isset($result['overall_readiness_percent'])) {
        error_log('AI_READINESS could not parse model JSON: ' . substr((string) $content, 0, 2000));
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'ai_response_invalid']);
    }

    $result['generated_at'] = date('c');
    $result['model'] = $aiModel;
    $result['provider'] = $providerKey;

    // ===== 5) حفظ سجل تدقيق (لا يمنع نجاح الاستجابة إن فشل الحفظ) =====
    try {
        $stmt = $conn->prepare(
            "INSERT INTO university_readiness_assessments (user_id, university_id, model, request_payload, response_json, overall_score)
             VALUES (?, ?, ?, ?, ?, ?)"
        );
        if ($stmt) {
            $reqJson = json_encode($profile, JSON_UNESCAPED_UNICODE);
            $respJson = json_encode($result, JSON_UNESCAPED_UNICODE);
            $overallScore = (float) $result['overall_readiness_percent'];
            // ملاحظة: bind_param يقبل NULL بأمان لباراميتر من النوع 'i' حتى لو
            // $universityId = null (حالة دفاعية نادرة) — لن يفشل الإدراج بسببها،
            // والعمود نفسه NULL-able.
            $stmt->bind_param('iisssd', $userId, $universityId, $aiModel, $reqJson, $respJson, $overallScore);
            $stmt->execute();
            $stmt->close();
        }
    } catch (Throwable $ignored) {
        // تجاهل فشل حفظ سجل التدقيق فقط، لا نفشل الطلب كاملاً بسببه
    }

    $conn->close();
    jsonResponse(['status' => 'success', 'data' => $result]);

} catch (Throwable $e) {
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
    error_log('AI_READINESS_ASSESSMENT ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    jsonResponse(['status' => 'error', 'message' => 'ai_request_failed']);
}
