<?php
// =====================================================================
// مفتاح تشفير إعدادات مزوّدي الذكاء الاصطناعي — قالب مثال، لا يحتوي مفتاحًا حقيقيًا
//
// هذا الملف مختلف عن api/ai_config.php القديم: لم نعد نضع مفتاح OpenRouter/
// OpenAI الحقيقي هنا مباشرة. بدل ذلك، مفاتيح API الحقيقية تُدخَل من لوحة
// تحكم الأدمن (تبويب "الذكاء الاصطناعي") وتُخزَّن مشفّرة بقاعدة البيانات
// (جدول ai_provider_settings، عمود api_key_encrypted).
//
// المفتاح هنا هو فقط "مفتاح التشفير" (Encryption Key) المستخدم لتشفير/فك
// تشفير تلك المفاتيح المخزّنة — وليس مفتاح AI بحد ذاته.
//
// لتفعيل الميزة:
//   1) انسخ هذا الملف إلى: api/ai_provider_crypto.php (نفس المجلد)
//   2) ولّد مفتاح تشفير عشوائي قوي (32 بايت) وضعه مكان القيمة أدناه، مثلاً:
//        php -r "echo bin2hex(random_bytes(32));"
//   3) لا ترفع api/ai_provider_crypto.php على git إطلاقًا — مضاف بالفعل
//      إلى .gitignore لهذا السبب بالضبط.
//   4) بعد ذلك، ادخل من لوحة تحكم الأدمن → الإعدادات → الذكاء الاصطناعي،
//      وأدخل مفتاح OpenRouter و/أو OpenAI الحقيقي هناك مباشرة.
//
// ⚠️ إن تغيّر هذا المفتاح لاحقًا، ستصبح كل المفاتيح المشفّرة المخزّنة سابقًا
// غير قابلة لفك التشفير — سيتوجب إعادة إدخالها من لوحة التحكم من جديد.
// =====================================================================

// مفتاح تشفير بصيغة hex (64 حرفًا = 32 بايت) — استبدله بمفتاح عشوائي حقيقي في ai_provider_crypto.php
define('AI_PROVIDER_ENCRYPTION_KEY', 'REPLACE-WITH-64-HEX-CHARS-RANDOM-KEY-0000000000000000000000');

// ===== دوال التشفير/فك التشفير المشتركة (AES-256-GCM) =====
// تُستخدم من save_ai_provider_settings.php و ai_readiness_assessment.php

function ai_provider_encrypt(string $plaintext): ?string {
    $keyHex = AI_PROVIDER_ENCRYPTION_KEY;
    if (empty($keyHex) || strpos($keyHex, 'REPLACE-WITH') !== false || strlen($keyHex) !== 64) {
        return null; // مفتاح التشفير غير مُعدّ بعد
    }
    $key = hex2bin($keyHex);
    $iv = random_bytes(12); // GCM nonce قياسي 12 بايت
    $tag = '';
    $ciphertext = openssl_encrypt($plaintext, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
    if ($ciphertext === false) return null;
    // نخزّن iv + tag + ciphertext معًا بترميز base64 واحد، مفصولة بـ ':'
    return base64_encode($iv) . ':' . base64_encode($tag) . ':' . base64_encode($ciphertext);
}

function ai_provider_decrypt(?string $encoded): ?string {
    if (empty($encoded)) return null;
    $keyHex = AI_PROVIDER_ENCRYPTION_KEY;
    if (empty($keyHex) || strpos($keyHex, 'REPLACE-WITH') !== false || strlen($keyHex) !== 64) {
        return null;
    }
    $parts = explode(':', $encoded);
    if (count($parts) !== 3) return null;
    [$ivB64, $tagB64, $ciphertextB64] = $parts;
    $iv = base64_decode($ivB64);
    $tag = base64_decode($tagB64);
    $ciphertext = base64_decode($ciphertextB64);
    if ($iv === false || $tag === false || $ciphertext === false) return null;
    $key = hex2bin($keyHex);
    $plaintext = openssl_decrypt($ciphertext, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
    return $plaintext === false ? null : $plaintext;
}
