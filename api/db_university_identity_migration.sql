-- =====================================================================
-- الهوية المؤسسية للجامعة (Stage A) — من مواصفة Research Excellence Platform
--
-- يصحّح خللاً معماريًا: بيانات الجامعة كانت مربوطة بحساب الشخص الذي سجّلها
-- (user_id) بدل الجامعة نفسها. هذا الملف يضيف:
--   - universities: هوية المؤسسة الدائمة (الاسم، البلد، النوع، النطاقات...)
--   - university_roles: قائمة أدوار العضوية المؤسسية (قابلة للتوسعة بصفوف
--     جديدة فقط — لا علاقة لها بجدول roles العام الذي يمثل نوع الحساب)
--   - university_users: عضوية مستخدم↔جامعة (مستخدم واحد لجامعة واحدة كحد
--     أقصى في هذه المرحلة، مفروض بقيد UNIQUE حقيقي على مستوى القاعدة)
--   - عمود university_id على الجداول الستة الموجودة مسبقًا (university_profiles،
--     _campuses، _colleges، _departments، _research_centers،
--     _readiness_assessments)، مع نقل الملكية الفعلية من user_id إلى
--     university_id على جدول university_profiles تحديدًا (قيد UNIQUE جديد).
--
-- لا يُحذف أي عمود user_id قديم — يبقى كعمود تدقيق/توافق تاريخي فقط.
-- لا يُعدَّل login.php ولا profiles_entity إطلاقًا.
--
-- آمن للتشغيل أكثر من مرة (مُختبَر فعليًا مرتين متتاليتين بدون أي خطأ):
-- كل عبارات إضافة/حذف القيود تستخدم فحص وجود عبر information_schema قبل
-- التنفيذ، وليس الاعتماد على IF NOT EXISTS في ADD CONSTRAINT (غير مدعومة
-- في هذا الإصدار من MariaDB لهذه العبارة تحديدًا).
--
-- طريقة التشغيل: افتح phpMyAdmin (XAMPP) → اختر قاعدة البيانات "ris"
-- → تبويب SQL → الصق هذا الملف كاملاً → Go
-- =====================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 1) universities — الهوية المؤسسية الدائمة (الجذر الجديد، المصدر الوحيد
--    الموثوق لاسم الجامعة وبياناتها الأساسية بدءًا من هذه المرحلة)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS universities (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(300) NOT NULL,
  arabic_name VARCHAR(255) DEFAULT NULL,
  country VARCHAR(120) DEFAULT NULL,
  type VARCHAR(50) DEFAULT NULL,
  official_domains TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2) university_roles — قائمة مرجعية بأدوار العضوية المؤسسية، قابلة
--    للتوسعة بإضافة صفوف فقط (لا تعديل مخطط). منفصلة تمامًا عن جدول
--    roles العام (الذي يمثل نوع الحساب: طالب/جامعة/موظف...، وليس وظيفة
--    الشخص داخل مؤسسة بعينها).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS university_roles (
  id INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(50) NOT NULL,
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_university_role_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- أدوار مفعّلة فعليًا في هذه المرحلة:
INSERT INTO university_roles (`key`, name_ar, name_en, is_active)
SELECT * FROM (SELECT 'admin' AS k, 'مدير الجامعة' AS ar, 'University Admin' AS en, 1 AS act) x
WHERE NOT EXISTS (SELECT 1 FROM university_roles WHERE `key` = 'admin');

INSERT INTO university_roles (`key`, name_ar, name_en, is_active)
SELECT * FROM (SELECT 'member' AS k, 'عضو' AS ar, 'Member' AS en, 1 AS act) x
WHERE NOT EXISTS (SELECT 1 FROM university_roles WHERE `key` = 'member');

-- أدوار مستقبلية من المواصفة الرئيسية — مُضافة غير مفعّلة (is_active=0)
-- استعدادًا للمراحل القادمة فقط، لا منطق صلاحيات فعلي لها بعد:
INSERT INTO university_roles (`key`, name_ar, name_en, is_active)
SELECT * FROM (SELECT 'research_office' AS k, 'مكتب البحث العلمي' AS ar, 'Research Office' AS en, 0 AS act) x
WHERE NOT EXISTS (SELECT 1 FROM university_roles WHERE `key` = 'research_office');

INSERT INTO university_roles (`key`, name_ar, name_en, is_active)
SELECT * FROM (SELECT 'researcher' AS k, 'باحث' AS ar, 'Researcher' AS en, 0 AS act) x
WHERE NOT EXISTS (SELECT 1 FROM university_roles WHERE `key` = 'researcher');

INSERT INTO university_roles (`key`, name_ar, name_en, is_active)
SELECT * FROM (SELECT 'data_steward' AS k, 'أمين البيانات' AS ar, 'Data Steward' AS en, 0 AS act) x
WHERE NOT EXISTS (SELECT 1 FROM university_roles WHERE `key` = 'data_steward');

INSERT INTO university_roles (`key`, name_ar, name_en, is_active)
SELECT * FROM (SELECT 'evidence_reviewer' AS k, 'مراجع الأدلة' AS ar, 'Evidence Reviewer' AS en, 0 AS act) x
WHERE NOT EXISTS (SELECT 1 FROM university_roles WHERE `key` = 'evidence_reviewer');

INSERT INTO university_roles (`key`, name_ar, name_en, is_active)
SELECT * FROM (SELECT 'expert' AS k, 'خبير' AS ar, 'Expert' AS en, 0 AS act) x
WHERE NOT EXISTS (SELECT 1 FROM university_roles WHERE `key` = 'expert');

INSERT INTO university_roles (`key`, name_ar, name_en, is_active)
SELECT * FROM (SELECT 'executive' AS k, 'تنفيذي' AS ar, 'Executive' AS en, 0 AS act) x
WHERE NOT EXISTS (SELECT 1 FROM university_roles WHERE `key` = 'executive');

-- ---------------------------------------------------------------------
-- 3) university_users — عضوية مستخدم↔جامعة. مستخدم واحد ينتمي لجامعة
--    واحدة كحد أقصى في هذه المرحلة (مفروض بقيد UNIQUE حقيقي، وليس مجرد
--    اصطلاح استعلام LIMIT 1).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS university_users (
  id INT NOT NULL AUTO_INCREMENT,
  university_id INT NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  university_role_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_uu_user (user_id),
  KEY idx_uu_university (university_id),
  KEY idx_uu_role (university_role_id),
  CONSTRAINT fk_uu_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
  CONSTRAINT fk_uu_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_uu_role FOREIGN KEY (university_role_id) REFERENCES university_roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4) إضافة عمود university_id (قابل للـ NULL مؤقتًا) على الجداول الستة
--    الموجودة مسبقًا — قبل التعبئة، لذلك يجب أن يكون NULL-able بالبداية.
-- ---------------------------------------------------------------------
ALTER TABLE university_profiles              ADD COLUMN IF NOT EXISTS university_id INT NULL AFTER user_id;
ALTER TABLE university_campuses              ADD COLUMN IF NOT EXISTS university_id INT NULL AFTER user_id;
ALTER TABLE university_colleges              ADD COLUMN IF NOT EXISTS university_id INT NULL AFTER user_id;
ALTER TABLE university_departments           ADD COLUMN IF NOT EXISTS university_id INT NULL AFTER user_id;
ALTER TABLE university_research_centers      ADD COLUMN IF NOT EXISTS university_id INT NULL AFTER user_id;
ALTER TABLE university_readiness_assessments ADD COLUMN IF NOT EXISTS university_id INT NULL AFTER user_id;

-- ---------------------------------------------------------------------
-- 5) تزويد لمرة واحدة: إنشاء أول صف universities + عضوية admin للحساب
--    الحقيقي الوحيد الموجود حاليًا (user_id = 18). محصور بهذا المستخدم
--    تحديدًا، وليس تعميمًا لكل حسابات دور "university" — لا يوجد غيره
--    اليوم فعليًا بملف بحثي حقيقي.
-- ---------------------------------------------------------------------
INSERT INTO universities (name, arabic_name, country, type, official_domains)
SELECT pe.entity_name, up.arabic_name, up.country, up.type, up.official_domains
FROM profiles_entity pe
JOIN university_profiles up ON up.user_id = pe.user_id
WHERE pe.user_id = 18
  AND NOT EXISTS (SELECT 1 FROM university_users WHERE user_id = 18);

INSERT INTO university_users (university_id, user_id, university_role_id)
SELECT u.id, 18, (SELECT id FROM university_roles WHERE `key` = 'admin')
FROM universities u
WHERE u.name = (SELECT entity_name FROM profiles_entity WHERE user_id = 18)
  AND NOT EXISTS (SELECT 1 FROM university_users WHERE user_id = 18)
ORDER BY u.id DESC LIMIT 1;

-- ---------------------------------------------------------------------
-- 6) تعبئة عمود university_id على الجداول الستة عبر جدول العضوية
--    (آمن للتكرار: WHERE university_id IS NULL يجعل أي إعادة تشغيل
--    لا تلمس أي صف تمت تعبئته من قبل)
-- ---------------------------------------------------------------------
UPDATE university_profiles up JOIN university_users uu ON uu.user_id = up.user_id
  SET up.university_id = uu.university_id WHERE up.university_id IS NULL;
UPDATE university_campuses t JOIN university_users uu ON uu.user_id = t.user_id
  SET t.university_id = uu.university_id WHERE t.university_id IS NULL;
UPDATE university_colleges t JOIN university_users uu ON uu.user_id = t.user_id
  SET t.university_id = uu.university_id WHERE t.university_id IS NULL;
UPDATE university_departments t JOIN university_users uu ON uu.user_id = t.user_id
  SET t.university_id = uu.university_id WHERE t.university_id IS NULL;
UPDATE university_research_centers t JOIN university_users uu ON uu.user_id = t.user_id
  SET t.university_id = uu.university_id WHERE t.university_id IS NULL;
UPDATE university_readiness_assessments t JOIN university_users uu ON uu.user_id = t.user_id
  SET t.university_id = uu.university_id WHERE t.university_id IS NULL;

-- ---------------------------------------------------------------------
-- 7) نقل الملكية الفعلية لجدول university_profiles من user_id إلى
--    university_id: حذف القيد الفريد القديم + مفتاحه الخارجي (آمنان
--    للتكرار عبر DROP ... IF EXISTS — مُختبَر فعليًا). عمود user_id نفسه
--    لا يُحذف، يبقى عمود تدقيق/توافق تاريخي فقط.
-- ---------------------------------------------------------------------
ALTER TABLE university_profiles DROP FOREIGN KEY IF EXISTS fk_university_profile_user;
ALTER TABLE university_profiles DROP KEY IF EXISTS uniq_university_profile_user;

-- ---------------------------------------------------------------------
-- 8) إضافة القيود الجديدة (المفتاح الفريد الجديد + كل المفاتيح الخارجية
--    نحو universities) — بنمط فحص وجود عبر information_schema قبل كل
--    إضافة، مُختبَر فعليًا مرتين متتاليتين بدون أي خطأ SQL في أي منهما.
-- ---------------------------------------------------------------------

-- university_profiles: المفتاح الفريد الجديد على university_id
SET @c := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
           WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'university_profiles'
             AND CONSTRAINT_NAME = 'uniq_university_profile_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_profiles ADD UNIQUE KEY uniq_university_profile_university (university_id)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @c := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
           WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'university_profiles'
             AND CONSTRAINT_NAME = 'fk_up_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_profiles ADD CONSTRAINT fk_up_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- university_campuses
SET @c := (SELECT COUNT(*) FROM information_schema.STATISTICS
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'university_campuses'
             AND INDEX_NAME = 'idx_campus_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_campuses ADD INDEX idx_campus_university (university_id)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @c := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
           WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'university_campuses'
             AND CONSTRAINT_NAME = 'fk_campus_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_campuses ADD CONSTRAINT fk_campus_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- university_colleges
SET @c := (SELECT COUNT(*) FROM information_schema.STATISTICS
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'university_colleges'
             AND INDEX_NAME = 'idx_college_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_colleges ADD INDEX idx_college_university (university_id)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ملاحظة: الاسم fk_college_university مستخدَم مسبقًا من جدول قديم غير
-- ذي صلة (ref_colleges) — نستخدم اسمًا مميّزًا هنا لتفادي أي تعارض تسمية
-- على مستوى قاعدة البيانات كاملة (أسماء قيود InnoDB يجب أن تكون فريدة
-- ضمن نفس الـ schema، وليس فقط ضمن نفس الجدول).
SET @c := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
           WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'university_colleges'
             AND CONSTRAINT_NAME = 'fk_ucollege_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_colleges ADD CONSTRAINT fk_ucollege_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- university_departments
SET @c := (SELECT COUNT(*) FROM information_schema.STATISTICS
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'university_departments'
             AND INDEX_NAME = 'idx_department_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_departments ADD INDEX idx_department_university (university_id)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @c := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
           WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'university_departments'
             AND CONSTRAINT_NAME = 'fk_department_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_departments ADD CONSTRAINT fk_department_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- university_research_centers
SET @c := (SELECT COUNT(*) FROM information_schema.STATISTICS
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'university_research_centers'
             AND INDEX_NAME = 'idx_research_center_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_research_centers ADD INDEX idx_research_center_university (university_id)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @c := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
           WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'university_research_centers'
             AND CONSTRAINT_NAME = 'fk_research_center_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_research_centers ADD CONSTRAINT fk_research_center_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- university_readiness_assessments
SET @c := (SELECT COUNT(*) FROM information_schema.STATISTICS
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'university_readiness_assessments'
             AND INDEX_NAME = 'idx_readiness_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_readiness_assessments ADD INDEX idx_readiness_university (university_id)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @c := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
           WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'university_readiness_assessments'
             AND CONSTRAINT_NAME = 'fk_readiness_university');
SET @sql := IF(@c = 0,
  'ALTER TABLE university_readiness_assessments ADD CONSTRAINT fk_readiness_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ---------------------------------------------------------------------
-- 9) تحقق نهائي — يُشغَّل تلقائيًا في نهاية الملف لعرض نتيجة الترحيل
-- ---------------------------------------------------------------------
SELECT 'universities' AS check_name, COUNT(*) AS row_count FROM universities
UNION ALL SELECT 'university_roles', COUNT(*) FROM university_roles
UNION ALL SELECT 'university_users', COUNT(*) FROM university_users
UNION ALL SELECT 'university_profiles_backfilled', COUNT(*) FROM university_profiles WHERE university_id IS NOT NULL
UNION ALL SELECT 'university_campuses_backfilled', COUNT(*) FROM university_campuses WHERE university_id IS NOT NULL
UNION ALL SELECT 'university_colleges_backfilled', COUNT(*) FROM university_colleges WHERE university_id IS NOT NULL
UNION ALL SELECT 'university_departments_backfilled', COUNT(*) FROM university_departments WHERE university_id IS NOT NULL
UNION ALL SELECT 'university_profiles_unique_on_university_id',
  (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE()
     AND TABLE_NAME = 'university_profiles' AND CONSTRAINT_NAME = 'uniq_university_profile_university');
