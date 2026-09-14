-- =====================================================================
-- db_academic_quality_tenant_migration.sql — Stage A.5 / P2
--
-- المشكلة: academic_quality_entity_responses كانت مملوكة بـ entity_id
-- (قيمة user_id خام) موثوقة من العميل بلا أي تحقق من الملكية الفعلية —
-- ثغرة IDOR حقيقية تسمح بقراءة/كتابة بيانات جامعة أخرى عبر تغيير معطى
-- واحد في الطلب. هذا الملف يضيف university_id كمالك حقيقي، يُعبَّأ
-- بالاعتماد على عضوية university_users الموجودة أصلاً من Stage A،
-- ويستبدل مفتاح الفرادة القديم المبني على entity_id بآخر على
-- university_id. entity_id يبقى عمود تدقيق/توافق تاريخي، لا يُحذف.
--
-- academic_quality_indicators/_elements/_standard لا تُمس إطلاقاً —
-- بيانات إطار مرجعي عام مشترك بين كل الجامعات، وليست بيانات مستأجر.
-- academic_quality_evidence_files لا تحتاج تعديل مخطط: ملكيتها تُشتق
-- تلقائياً عبر response_id → academic_quality_entity_responses.university_id.
--
-- متوافق MariaDB 10.4: كل إضافة عمود عبر ADD COLUMN IF NOT EXISTS (مؤكَّد
-- أنها تعمل)، وكل قيد (UNIQUE KEY/FOREIGN KEY/INDEX) عبر النمط الديناميكي
-- المُتحقَّق منه فعلياً في Stage A: فحص information_schema ثم
-- PREPARE/EXECUTE/DEALLOCATE — آمن للتشغيل المتكرر بلا أي خطأ في كلتا
-- المرتين.
-- =====================================================================

SET NAMES utf8mb4;

-- ===== 1) إضافة university_id (nullable مبدئياً قبل التعبئة) =====
ALTER TABLE academic_quality_entity_responses ADD COLUMN IF NOT EXISTS university_id INT NULL AFTER entity_id;

-- ===== 2) تعبئة تلقائية: entity_id اليوم = قيمة user_id تملك صف عضوية
-- في university_users (نفس منطق get_university_id_for_user لكن كتحديث
-- جماعي عبر JOIN) =====
UPDATE academic_quality_entity_responses r
  JOIN university_users uu ON uu.user_id = r.entity_id
  SET r.university_id = uu.university_id
  WHERE r.university_id IS NULL;

-- ===== 3) حذف مفتاح الفرادة القديم المبني على entity_id (آمن للتكرار) =====
ALTER TABLE academic_quality_entity_responses DROP KEY IF EXISTS uniq_entity_indicator_period;

-- ===== 4) إضافة مفتاح الفرادة الجديد على university_id — نمط
-- ديناميكي مُتحقَّق منه، يضيف القيد فقط إن لم يكن موجوداً =====
SET @c := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
           WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'academic_quality_entity_responses'
             AND CONSTRAINT_NAME = 'uniq_university_indicator_period');
SET @sql := IF(@c = 0,
  'ALTER TABLE academic_quality_entity_responses ADD UNIQUE KEY uniq_university_indicator_period (university_id, indicator_id, reporting_period)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ===== 5) فهرس دعم على university_id =====
SET @c := (SELECT COUNT(*) FROM information_schema.STATISTICS
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'academic_quality_entity_responses'
             AND INDEX_NAME = 'idx_quality_response_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE academic_quality_entity_responses ADD INDEX idx_quality_response_university (university_id)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ===== 6) مفتاح خارجي إلى universities(id)، بنفس نمط الجداول الستة
-- التي هاجرت في Stage A (ON DELETE CASCADE) =====
SET @c := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
           WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'academic_quality_entity_responses'
             AND CONSTRAINT_NAME = 'fk_quality_response_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE academic_quality_entity_responses ADD CONSTRAINT fk_quality_response_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ===== تحقّق نهائي =====
SELECT 'academic_quality_entity_responses_total' AS check_name, COUNT(*) AS row_count FROM academic_quality_entity_responses
UNION ALL SELECT 'backfilled_university_id', COUNT(*) FROM academic_quality_entity_responses WHERE university_id IS NOT NULL
UNION ALL SELECT 'still_null_university_id', COUNT(*) FROM academic_quality_entity_responses WHERE university_id IS NULL
UNION ALL SELECT 'unique_key_on_university_id_exists',
  (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE()
     AND TABLE_NAME = 'academic_quality_entity_responses' AND CONSTRAINT_NAME = 'uniq_university_indicator_period')
UNION ALL SELECT 'old_entity_unique_key_gone',
  (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE()
     AND TABLE_NAME = 'academic_quality_entity_responses' AND CONSTRAINT_NAME = 'uniq_entity_indicator_period');
