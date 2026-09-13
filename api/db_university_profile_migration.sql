-- =====================================================================
-- ملف الجامعة البحثية (University Research Profile) — المرحلة الأولى
-- من مواصفة Research Excellence Platform (University Onboarding).
--
-- يضيف: ملف بحثي أساسي للجامعة (university_profiles) + السجلات الفرعية
-- (الحرم الجامعي، الكليات، الأقسام، المراكز البحثية) + سجل تدقيق لتقييمات
-- الجاهزية بالذكاء الاصطناعي (university_readiness_assessments).
--
-- ملاحظة: لا يمس هذا الملف جدول profiles_entity الحالي (المشترك بين
-- university/college/research_center/ministry) — الجداول هنا إضافية
-- وخاصة بدور "university" فقط، وتُنشأ بشكل كسول (lazy) عند أول حفظ
-- للملف البحثي، وليس عند التسجيل.
--
-- طريقة التشغيل: افتح phpMyAdmin (XAMPP) → اختر قاعدة البيانات "ris"
-- → تبويب SQL → الصق هذا الملف كاملاً → Go
-- (آمن للتشغيل أكثر من مرة — يستخدم IF NOT EXISTS)
-- =====================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 1) الملف البحثي الأساسي للجامعة (علاقة 1:1 مع user_id)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS university_profiles (
  id INT NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  country VARCHAR(120) DEFAULT NULL,
  type VARCHAR(50) DEFAULT NULL,
  official_domains TEXT DEFAULT NULL,
  arabic_name VARCHAR(255) DEFAULT NULL,
  research_strategy TEXT DEFAULT NULL,
  priority_areas TEXT DEFAULT NULL,
  research_goals TEXT DEFAULT NULL,
  profile_status ENUM('draft', 'submitted', 'under_review', 'approved') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_university_profile_user (user_id),
  CONSTRAINT fk_university_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2) الحرم الجامعي (Campuses) — عدة سجلات لكل جامعة
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS university_campuses (
  id INT NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_campus_user (user_id),
  CONSTRAINT fk_campus_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3) الكليات (Colleges) — قد تنتمي لحرم جامعي معيّن (اختياري)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS university_colleges (
  id INT NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  campus_id INT DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_college_user (user_id),
  KEY idx_college_campus (campus_id),
  CONSTRAINT fk_college_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_college_campus FOREIGN KEY (campus_id) REFERENCES university_campuses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4) الأقسام (Departments) — تنتمي دائمًا لكلية
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS university_departments (
  id INT NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  college_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_department_user (user_id),
  KEY idx_department_college (college_id),
  CONSTRAINT fk_department_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_department_college FOREIGN KEY (college_id) REFERENCES university_colleges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5) المراكز البحثية (Research Centers) — قد تتبع الجامعة أو أي وحدة
--    فرعية منها (حرم/كلية/قسم). المرجع مرن (بلا FK) ويُتحقق منه بالـ PHP
--    لأن الأب قد يكون في أحد 4 جداول مختلفة.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS university_research_centers (
  id INT NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  parent_unit_type ENUM('university', 'campus', 'college', 'department') NOT NULL DEFAULT 'university',
  parent_unit_id INT DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  research_areas TEXT DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_research_center_user (user_id),
  CONSTRAINT fk_research_center_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6) سجل تدقيق تقييمات الجاهزية بالذكاء الاصطناعي (اختياري لكن موصى به)
--    يحفظ كل تشغيلة لتقييم الجاهزية عبر OpenRouter لعرض آخر نتيجة دون
--    إعادة الاستدعاء (المكلف ماديًا) في كل زيارة للصفحة.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS university_readiness_assessments (
  id INT NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  model VARCHAR(100) DEFAULT NULL,
  request_payload LONGTEXT DEFAULT NULL,
  response_json LONGTEXT DEFAULT NULL,
  overall_score DECIMAL(5,2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_readiness_user (user_id),
  CONSTRAINT fk_readiness_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
