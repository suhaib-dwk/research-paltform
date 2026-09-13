-- =====================================================================
-- Migration: ai_provider_settings — إعدادات مزوّدي الذكاء الاصطناعي
-- (OpenRouter / OpenAI) تُدار ديناميكيًا من لوحة تحكم الأدمن بدل تعديل
-- ملف PHP ثابت (api/ai_config.php القديم).
--
-- المفتاح الفعلي يُخزَّن مشفّرًا (AES) وليس نصًا صريحًا — انظر
-- api/ai_provider_crypto.php لمفتاح التشفير المحلي ودوال التشفير/الفك.
--
-- طريقة التشغيل: mysql CLI أو phpMyAdmin على قاعدة "ris" المحلية.
-- آمن لإعادة التشغيل (IF NOT EXISTS، وصف الأعمدة قبل أي INSERT).
-- =====================================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS ai_provider_settings (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    provider_key      VARCHAR(30) NOT NULL,        -- 'openrouter' | 'openai' | ...
    is_enabled        TINYINT(1) NOT NULL DEFAULT 0,
    api_key_encrypted TEXT DEFAULT NULL,            -- المفتاح مشفّر (AES-256-GCM)، لا يُخزَّن أبدًا كنص صريح
    api_key_last4     VARCHAR(8) DEFAULT NULL,      -- آخر 4 خانات من المفتاح الحقيقي، لعرضها بالواجهة دون كشف المفتاح كاملاً
    model             VARCHAR(100) DEFAULT NULL,    -- مثال: 'openai/gpt-4o-mini' لـ OpenRouter، أو 'gpt-4o-mini' لـ OpenAI مباشرة
    updated_by        BIGINT UNSIGNED DEFAULT NULL, -- آخر مستخدم (أدمن) عدّل هذا الإعداد
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_ai_provider_key (provider_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== بذر الصفين الافتراضيين (معطّلين، بدون مفتاح) إن لم يكونا موجودين =====
INSERT IGNORE INTO ai_provider_settings (provider_key, is_enabled, model) VALUES
    ('openrouter', 0, 'openai/gpt-4o-mini'),
    ('openai',     0, 'gpt-4o-mini');
