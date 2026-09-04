-- =====================================================================
-- Migration: Backend حقيقي لصفحات الداشبورد (بدل البيانات الوهمية)
-- يبني: activity_log, user_settings, message_threads+messages,
--       researches, reviews, tasks, users.status, avatar_path
--
-- طريقة التشغيل: mysql CLI أو phpMyAdmin على قاعدة "ris" المحلية
-- آمن لإعادة التشغيل (IF NOT EXISTS على الجداول، فحص information_schema
-- قبل أي ALTER TABLE، نفس أسلوب db_quality_weighted_migration.sql).
-- =====================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 1) activity_log — سجل نشاط عام (ActivityPage + DashboardHome.activity)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_log (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT UNSIGNED NOT NULL,
    event_type    VARCHAR(50) NOT NULL,
    service       VARCHAR(30) DEFAULT NULL,
    text_ar       VARCHAR(500) NOT NULL,
    text_en       VARCHAR(500) NOT NULL,
    ref_table     VARCHAR(60)  DEFAULT NULL,
    ref_id        BIGINT UNSIGNED DEFAULT NULL,
    ip_address    VARCHAR(45) DEFAULT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY idx_activity_user_created (user_id, created_at),
    KEY idx_activity_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2) user_settings — تفضيلات شخصية (1-to-1 مع users) — SettingsPage
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_settings (
    user_id               BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    notifications_email   TINYINT(1) NOT NULL DEFAULT 1,
    notifications_sms     TINYINT(1) NOT NULL DEFAULT 0,
    two_factor_enabled    TINYINT(1) NOT NULL DEFAULT 0,
    language              ENUM('ar','en') NOT NULL DEFAULT 'ar',
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3) message_threads + messages — رسائل داخلية حقيقية — MessagesPage
--    (منفصل تماماً عن contact_messages، الذي يبقى نموذج "تواصل معنا" العام)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS message_threads (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    subject_ar      VARCHAR(300) NOT NULL,
    subject_en      VARCHAR(300) NOT NULL,
    sender_type     ENUM('system','admin','employee','user') NOT NULL DEFAULT 'system',
    sender_id       BIGINT UNSIGNED DEFAULT NULL,
    is_read         TINYINT(1) NOT NULL DEFAULT 0,
    last_message_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_thread_user   FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_thread_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_thread_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    thread_id       BIGINT UNSIGNED NOT NULL,
    sender_type     ENUM('system','admin','employee','user') NOT NULL,
    sender_id       BIGINT UNSIGNED DEFAULT NULL,
    body            TEXT NOT NULL,
    attachment_path VARCHAR(500) DEFAULT NULL,
    attachment_name VARCHAR(255) DEFAULT NULL,
    is_read         TINYINT(1) NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_msg_thread FOREIGN KEY (thread_id) REFERENCES message_threads(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_msg_thread_created (thread_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4) researches — أبحاث المستخدمين — ResearchesPage + NewResearchPage
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS researches (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT UNSIGNED NOT NULL,
    title_ar      VARCHAR(500) NOT NULL,
    title_en      VARCHAR(500) DEFAULT NULL,
    abstract      TEXT NOT NULL,
    keywords      VARCHAR(500) DEFAULT NULL,
    field         ENUM('cs','eng','med') NOT NULL,
    file_name     VARCHAR(255) NOT NULL,
    file_path     VARCHAR(500) NOT NULL,
    file_size     INT UNSIGNED DEFAULT NULL,
    status        ENUM('draft','under_review','published','rejected') NOT NULL DEFAULT 'under_review',
    published_at  TIMESTAMP NULL DEFAULT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_research_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY idx_research_user_status (user_id, status),
    KEY idx_research_field (field)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5) reviews — تحكيم أبحاث (مرتبط بـ researches) — ReviewsPage + History
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    research_id   BIGINT UNSIGNED NOT NULL,
    reviewer_id   BIGINT UNSIGNED NOT NULL,
    review_type   ENUM('initial','expert','final') NOT NULL,
    status        ENUM('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
    score         DECIMAL(5,2) DEFAULT NULL,
    comments      TEXT DEFAULT NULL,
    assigned_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at  TIMESTAMP NULL DEFAULT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_research FOREIGN KEY (research_id) REFERENCES researches(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY idx_review_reviewer_status (reviewer_id, status),
    KEY idx_review_research (research_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6) tasks — مهام مُسندة لكل مستخدم — TasksPage
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT UNSIGNED NOT NULL,
    title_ar      VARCHAR(300) NOT NULL,
    title_en      VARCHAR(300) NOT NULL,
    status        ENUM('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
    due_date      DATE DEFAULT NULL,
    completed_at  TIMESTAMP NULL DEFAULT NULL,
    created_by    BIGINT UNSIGNED DEFAULT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_user    FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_task_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    KEY idx_task_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7) users.status — حالة اعتماد الحساب (pending/active/rejected) — employee/UsersPage
--    ⚠️ لا تعديل على login.php — يستمر بالاعتماد حصراً على is_active.
--    التزامن بين العمودين يُضمن فقط من update_user_status.php مستقبلاً.
-- ---------------------------------------------------------------------
SET @col_status := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'status'
);
SET @sql_status := IF(@col_status = 0,
  'ALTER TABLE users ADD COLUMN status ENUM(\'pending\',\'active\',\'rejected\') NOT NULL DEFAULT \'pending\' AFTER is_active',
  'SELECT 1 AS info'
);
PREPARE stmt FROM @sql_status;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- تعيين القيمة الابتدائية بناءً على is_active الحالي (يُنفَّذ دائماً بأمان،
-- الشرط status='pending' يمنع الكتابة فوق أي قيمة أُدخلت يدوياً لاحقاً)
UPDATE users SET status = 'active'  WHERE is_active = 1 AND status = 'pending';
UPDATE users SET status = 'pending' WHERE is_active = 0 AND status = 'pending';

SET @idx_status := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND INDEX_NAME = 'idx_users_status'
);
SET @sql_idx_status := IF(@idx_status = 0,
  'ALTER TABLE users ADD INDEX idx_users_status (status)',
  'SELECT 1 AS info'
);
PREPARE stmt FROM @sql_idx_status;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------------------------------------------------------------------
-- 8) avatar_path — صورة شخصية لكل جدول profiles_* الفردي — AccountPage
-- ---------------------------------------------------------------------
DROP PROCEDURE IF EXISTS add_avatar_column_if_missing;
DELIMITER $$
CREATE PROCEDURE add_avatar_column_if_missing(IN tbl VARCHAR(64))
BEGIN
    DECLARE col_count INT DEFAULT 0;
    SELECT COUNT(*) INTO col_count FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = tbl AND COLUMN_NAME = 'avatar_path';
    IF col_count = 0 THEN
        SET @sql = CONCAT('ALTER TABLE `', tbl, '` ADD COLUMN avatar_path VARCHAR(500) DEFAULT NULL');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

CALL add_avatar_column_if_missing('profiles_undergrad');
CALL add_avatar_column_if_missing('profiles_grad');
CALL add_avatar_column_if_missing('profiles_faculty');
CALL add_avatar_column_if_missing('profiles_researcher');
CALL add_avatar_column_if_missing('profiles_reviewer');
CALL add_avatar_column_if_missing('profiles_system');
CALL add_avatar_column_if_missing('profiles_entity');

DROP PROCEDURE IF EXISTS add_avatar_column_if_missing;

-- ---------------------------------------------------------------------
-- 9) تحقق سريع بعد التنفيذ
-- ---------------------------------------------------------------------
SELECT 'activity_log' AS table_name, COUNT(*) AS row_count FROM activity_log
UNION ALL SELECT 'user_settings', COUNT(*) FROM user_settings
UNION ALL SELECT 'message_threads', COUNT(*) FROM message_threads
UNION ALL SELECT 'messages', COUNT(*) FROM messages
UNION ALL SELECT 'researches', COUNT(*) FROM researches
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'tasks', COUNT(*) FROM tasks;

SELECT id, email, is_active, status FROM users LIMIT 5;
