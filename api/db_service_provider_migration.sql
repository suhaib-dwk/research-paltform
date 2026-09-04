-- =====================================================================
-- Migration: نظام "مقدّم خدمة" كامل + جداول طلبات لـ 8 خدمات ناقصة
--
-- يبني:
--   1) صف جديد بجدول roles (service_provider)
--   2) profiles_service_provider — الملف الشخصي (CV + مؤهلات)
--   3) service_provider_services — ربط many-to-many مع الخدمات المختارة
--   4) 8 جداول طلبات منفصلة (نفس روح review_requests الموجود)
--
-- طريقة التشغيل: mysql CLI أو phpMyAdmin على قاعدة "ris" المحلية
-- آمن لإعادة التشغيل (IF NOT EXISTS / فحص information_schema قبل أي INSERT حرج)
-- =====================================================================

SET NAMES utf8mb4;

-- ===== 1) صف roles جديد =====
INSERT INTO roles (`key`, name_ar, name_en, icon, category, sort_order, is_active)
SELECT 'service_provider', 'مقدّم خدمة', 'Service Provider', 'Briefcase', 'individual', 11, 1
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE `key` = 'service_provider');

-- ===== 2) profiles_service_provider =====
CREATE TABLE IF NOT EXISTS profiles_service_provider (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    phone           VARCHAR(50) DEFAULT NULL,
    email           VARCHAR(255) DEFAULT NULL,
    qualifications  TEXT DEFAULT NULL,
    bio             TEXT DEFAULT NULL,
    cv_file_name    VARCHAR(255) DEFAULT NULL,
    cv_file_path    VARCHAR(500) DEFAULT NULL,
    cv_file_size    INT UNSIGNED DEFAULT NULL,
    avatar_path     VARCHAR(500) DEFAULT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_sp_user (user_id),
    CONSTRAINT fk_sp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 3) service_provider_services (many-to-many) =====
CREATE TABLE IF NOT EXISTS service_provider_services (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    service_slug    VARCHAR(50) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_sps_user_slug (user_id, service_slug),
    CONSTRAINT fk_sps_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY idx_sps_slug (service_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 4) 8 جداول طلبات (بنية مشتركة + أعمدة خاصة لكل خدمة) =====

CREATE TABLE IF NOT EXISTS translation_requests (
    id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id               BIGINT UNSIGNED NOT NULL,
    assigned_provider_id  BIGINT UNSIGNED DEFAULT NULL,
    source_lang           VARCHAR(50) DEFAULT NULL,
    target_lang           VARCHAR(50) DEFAULT NULL,
    field_ar              VARCHAR(255) DEFAULT NULL,
    notes                 TEXT DEFAULT NULL,
    file_name             VARCHAR(255) DEFAULT NULL,
    file_path             VARCHAR(500) DEFAULT NULL,
    file_size             INT UNSIGNED DEFAULT NULL,
    file_ext              VARCHAR(10) DEFAULT NULL,
    status                ENUM('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
    result_notes          TEXT DEFAULT NULL,
    result_file_name      VARCHAR(255) DEFAULT NULL,
    result_file_path      VARCHAR(500) DEFAULT NULL,
    result_file_size      INT UNSIGNED DEFAULT NULL,
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tr_provider FOREIGN KEY (assigned_provider_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_tr_user (user_id), KEY idx_tr_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS proofreading_requests (
    id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id               BIGINT UNSIGNED NOT NULL,
    assigned_provider_id  BIGINT UNSIGNED DEFAULT NULL,
    citation_style        VARCHAR(50) DEFAULT NULL,
    notes                 TEXT DEFAULT NULL,
    file_name             VARCHAR(255) DEFAULT NULL,
    file_path             VARCHAR(500) DEFAULT NULL,
    file_size             INT UNSIGNED DEFAULT NULL,
    file_ext              VARCHAR(10) DEFAULT NULL,
    status                ENUM('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
    result_notes          TEXT DEFAULT NULL,
    result_file_name      VARCHAR(255) DEFAULT NULL,
    result_file_path      VARCHAR(500) DEFAULT NULL,
    result_file_size      INT UNSIGNED DEFAULT NULL,
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pr_provider FOREIGN KEY (assigned_provider_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_pr_user (user_id), KEY idx_pr_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS consultation_requests (
    id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id               BIGINT UNSIGNED NOT NULL,
    assigned_provider_id  BIGINT UNSIGNED DEFAULT NULL,
    topic                 VARCHAR(500) DEFAULT NULL,
    preferred_datetime    DATETIME DEFAULT NULL,
    notes                 TEXT DEFAULT NULL,
    file_name             VARCHAR(255) DEFAULT NULL,
    file_path             VARCHAR(500) DEFAULT NULL,
    file_size             INT UNSIGNED DEFAULT NULL,
    file_ext              VARCHAR(10) DEFAULT NULL,
    status                ENUM('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
    result_notes          TEXT DEFAULT NULL,
    result_file_name      VARCHAR(255) DEFAULT NULL,
    result_file_path      VARCHAR(500) DEFAULT NULL,
    result_file_size      INT UNSIGNED DEFAULT NULL,
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cr_provider FOREIGN KEY (assigned_provider_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_cr_user (user_id), KEY idx_cr_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS journal_selection_requests (
    id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id               BIGINT UNSIGNED NOT NULL,
    assigned_provider_id  BIGINT UNSIGNED DEFAULT NULL,
    research_field        VARCHAR(255) DEFAULT NULL,
    priority               ENUM('impact','speed','open_access','no_preference') DEFAULT 'no_preference',
    notes                 TEXT DEFAULT NULL,
    file_name             VARCHAR(255) DEFAULT NULL,
    file_path             VARCHAR(500) DEFAULT NULL,
    file_size             INT UNSIGNED DEFAULT NULL,
    file_ext              VARCHAR(10) DEFAULT NULL,
    status                ENUM('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
    result_notes          TEXT DEFAULT NULL,
    result_file_name      VARCHAR(255) DEFAULT NULL,
    result_file_path      VARCHAR(500) DEFAULT NULL,
    result_file_size      INT UNSIGNED DEFAULT NULL,
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_jsr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_jsr_provider FOREIGN KEY (assigned_provider_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_jsr_user (user_id), KEY idx_jsr_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS journal_evaluation_requests (
    id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id               BIGINT UNSIGNED NOT NULL,
    assigned_provider_id  BIGINT UNSIGNED DEFAULT NULL,
    journal_name          VARCHAR(500) NOT NULL,
    journal_issn          VARCHAR(50) DEFAULT NULL,
    journal_link           VARCHAR(500) DEFAULT NULL,
    notes                 TEXT DEFAULT NULL,
    status                ENUM('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
    result_notes          TEXT DEFAULT NULL,
    result_file_name      VARCHAR(255) DEFAULT NULL,
    result_file_path      VARCHAR(500) DEFAULT NULL,
    result_file_size      INT UNSIGNED DEFAULT NULL,
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_jer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_jer_provider FOREIGN KEY (assigned_provider_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_jer_user (user_id), KEY idx_jer_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS template_requests (
    id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id               BIGINT UNSIGNED NOT NULL,
    assigned_provider_id  BIGINT UNSIGNED DEFAULT NULL,
    journal_name          VARCHAR(500) NOT NULL,
    notes                 TEXT DEFAULT NULL,
    status                ENUM('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
    result_notes          TEXT DEFAULT NULL,
    result_file_name      VARCHAR(255) DEFAULT NULL,
    result_file_path      VARCHAR(500) DEFAULT NULL,
    result_file_size      INT UNSIGNED DEFAULT NULL,
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tpr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tpr_provider FOREIGN KEY (assigned_provider_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_tpr_user (user_id), KEY idx_tpr_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS correspondence_requests (
    id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id               BIGINT UNSIGNED NOT NULL,
    assigned_provider_id  BIGINT UNSIGNED DEFAULT NULL,
    correspondence_type   ENUM('cover_letter','response_to_reviewers','withdrawal','general') NOT NULL DEFAULT 'general',
    notes                 TEXT DEFAULT NULL,
    file_name             VARCHAR(255) DEFAULT NULL,
    file_path             VARCHAR(500) DEFAULT NULL,
    file_size             INT UNSIGNED DEFAULT NULL,
    file_ext              VARCHAR(10) DEFAULT NULL,
    status                ENUM('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
    result_notes          TEXT DEFAULT NULL,
    result_file_name      VARCHAR(255) DEFAULT NULL,
    result_file_path      VARCHAR(500) DEFAULT NULL,
    result_file_size      INT UNSIGNED DEFAULT NULL,
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cor_provider FOREIGN KEY (assigned_provider_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_cor_user (user_id), KEY idx_cor_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS publication_requests (
    id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id               BIGINT UNSIGNED NOT NULL,
    assigned_provider_id  BIGINT UNSIGNED DEFAULT NULL,
    target_journal        VARCHAR(500) DEFAULT NULL,
    notes                 TEXT DEFAULT NULL,
    file_name             VARCHAR(255) DEFAULT NULL,
    file_path             VARCHAR(500) DEFAULT NULL,
    file_size             INT UNSIGNED DEFAULT NULL,
    file_ext              VARCHAR(10) DEFAULT NULL,
    status                ENUM('pending','assigned','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
    result_notes          TEXT DEFAULT NULL,
    result_file_name      VARCHAR(255) DEFAULT NULL,
    result_file_path      VARCHAR(500) DEFAULT NULL,
    result_file_size      INT UNSIGNED DEFAULT NULL,
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pub_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pub_provider FOREIGN KEY (assigned_provider_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_pub_user (user_id), KEY idx_pub_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== تعديل لاحق: translation_requests تحتاج urgency + english_variant =====
-- (اكتُشف أن TranslationPage.jsx المبنية مسبقاً بالمشروع تستخدم هذين الحقلين)
ALTER TABLE translation_requests
  ADD COLUMN IF NOT EXISTS urgency ENUM('normal','fast','urgent') NOT NULL DEFAULT 'normal' AFTER target_lang,
  ADD COLUMN IF NOT EXISTS english_variant VARCHAR(10) DEFAULT NULL AFTER urgency;

-- ===== تعديل لاحق: correspondence_requests تحتاج نوعي رسالة إضافيين =====
-- (اكتُشف أن CorrespondencePage.jsx المبنية مسبقاً تستخدم 5 أنواع وليس 4)
ALTER TABLE correspondence_requests
  MODIFY COLUMN correspondence_type ENUM('cover_letter','response_to_reviewers','withdrawal','revision','inquiry','general') NOT NULL DEFAULT 'general';

SELECT 'roles' AS check_name, COUNT(*) AS row_count FROM roles WHERE `key` = 'service_provider'
UNION ALL SELECT 'profiles_service_provider', COUNT(*) FROM profiles_service_provider
UNION ALL SELECT 'service_provider_services', COUNT(*) FROM service_provider_services
UNION ALL SELECT 'translation_requests', COUNT(*) FROM translation_requests
UNION ALL SELECT 'proofreading_requests', COUNT(*) FROM proofreading_requests
UNION ALL SELECT 'consultation_requests', COUNT(*) FROM consultation_requests
UNION ALL SELECT 'journal_selection_requests', COUNT(*) FROM journal_selection_requests
UNION ALL SELECT 'journal_evaluation_requests', COUNT(*) FROM journal_evaluation_requests
UNION ALL SELECT 'template_requests', COUNT(*) FROM template_requests
UNION ALL SELECT 'correspondence_requests', COUNT(*) FROM correspondence_requests
UNION ALL SELECT 'publication_requests', COUNT(*) FROM publication_requests;
