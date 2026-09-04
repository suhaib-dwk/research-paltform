-- =====================================================================
-- Migration: review_requests — نظام طلبات التحكيم (services/ReviewServicePage.jsx)
--
-- ⚠️ هذا جدول منفصل تماماً عن جدول reviews (الذي يخدم dashboard/ReviewsPage.jsx
-- الخاص بالمُحكِّم نفسه لإنهاء تحكيم بدرجة عبر submit_review_score.php).
-- review_requests يخدم الطرف الآخر: الطالب/الباحث الذي يطلب تحكيماً جديداً
-- لبحثه، بتسلسل ثلاثي (initial → expert → final)، مع دعم رفع ملف المراجع
-- من طرف المحكم لاحقاً (منفصل عن ملف البحث الأصلي المرفوع من الطالب).
--
-- طريقة التشغيل: mysql CLI أو phpMyAdmin على قاعدة "ris" المحلية
-- آمن لإعادة التشغيل (IF NOT EXISTS)
-- =====================================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS review_requests (
    id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id               BIGINT UNSIGNED NOT NULL,
    research_title        VARCHAR(500) NOT NULL,
    review_type           ENUM('initial','expert','final') NOT NULL,
    academic_level        ENUM('bachelor','master','phd') NOT NULL,
    parent_request_id     BIGINT UNSIGNED DEFAULT NULL,
    notes                 TEXT DEFAULT NULL,

    -- ملف البحث الأصلي المرفوع من الطالب (التحكيم الأولي فقط؛ يُعاد استخدامه ضمنياً للخبير/النهائي عبر parent)
    file_name             VARCHAR(255) DEFAULT NULL,
    file_path             VARCHAR(500) DEFAULT NULL,
    file_size             INT UNSIGNED DEFAULT NULL,
    file_ext              VARCHAR(10) DEFAULT NULL,

    status                ENUM('pending','in_progress','info_needed','revision_required','completed','rejected') NOT NULL DEFAULT 'pending',
    progress              TINYINT UNSIGNED NOT NULL DEFAULT 0,
    score                 DECIMAL(5,2) DEFAULT NULL,

    info_needed_ar        TEXT DEFAULT NULL,
    info_needed_en        TEXT DEFAULT NULL,
    revision_note_ar      TEXT DEFAULT NULL,
    revision_note_en      TEXT DEFAULT NULL,

    -- الملف المُراجَع الذي يرفعه المحكم بعد اكتمال التحكيم
    reviewer_id           BIGINT UNSIGNED DEFAULT NULL,
    reviewed_file_name    VARCHAR(255) DEFAULT NULL,
    reviewed_file_path    VARCHAR(500) DEFAULT NULL,
    reviewed_file_size    INT UNSIGNED DEFAULT NULL,

    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_req_user     FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_req_parent   FOREIGN KEY (parent_request_id) REFERENCES review_requests(id) ON DELETE SET NULL,
    CONSTRAINT fk_review_req_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_review_req_user (user_id),
    KEY idx_review_req_type_status (review_type, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'review_requests' AS table_name, COUNT(*) AS row_count FROM review_requests;
