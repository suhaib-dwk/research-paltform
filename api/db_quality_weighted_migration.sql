-- =====================================================================
-- Migration: نظام الدرجات الموزون الرسمي لمعيار البحث العلمي (06)
-- + إضافة الترجمة الإنجليزية لعناوين المؤشرات
--
-- المصدر: دليل معايير الاعتماد المؤسسي الوطنية لمؤسسات التعليم العالي
--          في العراق (جهاز الإشراف والتقويم العلمي)
--
-- ما يفعله هذا الملف:
--   1. يضيف عمود max_score (الدرجة القصوى الرسمية لكل مؤشر) لجدول
--      academic_quality_indicators — كان غير موجود، وكل مؤشر كان
--      يُحسب افتراضياً من سقف 100 موحّد بغض النظر عن وزنه الحقيقي.
--   2. يضيف عمود title_en (الترجمة الإنجليزية لعنوان المؤشر) لنفس
--      الجدول — كان غير موجود إطلاقاً، وهذا كان سبب ظهور عناوين
--      المؤشرات بالعربي دائماً حتى عند اختيار اللغة الإنجليزية بالواجهة.
--   3. يعبّئ القيمتين للمؤشرات الـ44 كافة بحسب الدليل الرسمي.
--
-- ملاحظة مهمة (خطأ بيانات مُصحَّح): المؤشران IND-19 و IND-20 كانا
-- مربوطين خطأً بالعنصر الرابع (تسويق البحث العلمي) رغم أن محتواهما
-- (تشجيع الجوائز وبراءات الاختراع / سياسة الملكية الفكرية) يطابق
-- تماماً العنصر الخامس الرسمي (الإبداع والابتكار)، الذي كان معرَّفاً
-- في academic_quality_elements لكن بلا أي مؤشرات مرتبطة به. تم نقل
-- element_id لكليهما إلى العنصر الخامس، فأصبح: العنصر 4 = مؤشر واحد
-- (IND-18، 8 درجات)، والعنصر 5 = مؤشرين (IND-19 وIND-20، 6+6=12 درجة)
-- — مطابق تماماً لمجاميع الدليل الرسمي (8 و12 على التوالي).
--
-- طريقة التشغيل: افتح phpMyAdmin (XAMPP) → اختر قاعدة البيانات "ris"
-- → تبويب SQL → الصق هذا الملف كاملاً → Go
-- (آمن للتشغيل أكثر من مرة بفضل فحص IF NOT EXISTS على الأعمدة عبر
--  إجراء مخزّن مؤقت أدناه)
-- =====================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 0) إضافة العمودين بأمان (تُنفَّذ فقط إن لم يكونا موجودين مسبقًا)
-- ---------------------------------------------------------------------
SET @col_max_score := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'academic_quality_indicators' AND COLUMN_NAME = 'max_score'
);
SET @sql_max_score := IF(@col_max_score = 0,
  'ALTER TABLE academic_quality_indicators ADD COLUMN max_score DECIMAL(6,2) NOT NULL DEFAULT 100 AFTER indicator_type',
  'SELECT "max_score column already exists" AS info'
);
PREPARE stmt FROM @sql_max_score;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_title_en := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'academic_quality_indicators' AND COLUMN_NAME = 'title_en'
);
SET @sql_title_en := IF(@col_title_en = 0,
  'ALTER TABLE academic_quality_indicators ADD COLUMN title_en VARCHAR(500) NULL AFTER title_ar',
  'SELECT "title_en column already exists" AS info'
);
PREPARE stmt FROM @sql_title_en;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------------------------------------------------------------------
-- 1) تعبئة max_score و title_en لكل مؤشر من الـ44 (حسب الدليل الرسمي)
-- ---------------------------------------------------------------------

-- العنصر 1: بيئة البحث العلمي (المجموع: 54)
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Existence of an institutional unit responsible for the scientific research plan' WHERE code = 'IND-01';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Participation of beneficiary stakeholders in formulating the research plan' WHERE code = 'IND-02';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Alignment of the research plan with labor market and community needs' WHERE code = 'IND-03';
UPDATE academic_quality_indicators SET max_score = 4, title_en = 'Commitment to scholarship and scientific research policies' WHERE code = 'IND-04';
UPDATE academic_quality_indicators SET max_score = 4, title_en = 'Researcher incentives' WHERE code = 'IND-05';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Scientific research requisites' WHERE code = 'IND-06';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Maintenance of infrastructure and equipment' WHERE code = 'IND-07';
UPDATE academic_quality_indicators SET max_score = 4, title_en = 'Policies on ownership of research equipment' WHERE code = 'IND-08';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Occupational health and safety of researchers' WHERE code = 'IND-09';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Environmental protection' WHERE code = 'IND-10';

-- العنصر 2: تمويل البحث العلمي (المجموع: 24)
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Availability of an adequate annual budget for scientific research' WHERE code = 'IND-11';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Priority for research with economic return' WHERE code = 'IND-12';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Ability to identify expertise and commercial opportunities' WHERE code = 'IND-13';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Participation in locally and internationally funded projects' WHERE code = 'IND-14';

-- العنصر 3: نشر البحث العلمي (المجموع: 16)
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Encouraging publication in high-impact-factor international journals' WHERE code = 'IND-15';
UPDATE academic_quality_indicators SET max_score = 4, title_en = 'Institutional database for published research' WHERE code = 'IND-16';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Support for applied research linked to community and labor market needs' WHERE code = 'IND-17';

-- العنصر 4: تسويق البحث العلمي (المجموع: 8) — مؤشر واحد فقط
UPDATE academic_quality_indicators SET max_score = 8, title_en = 'Maintaining and activating relations with relevant local and international institutions' WHERE code = 'IND-18';

-- العنصر 5: الإبداع والابتكار (المجموع: 12) — إصلاح element_id (كان مرتبطاً خطأً بالعنصر 4)
UPDATE academic_quality_indicators SET element_id = (SELECT id FROM academic_quality_elements WHERE element_number = 5 LIMIT 1),
    max_score = 6, title_en = 'Encouraging faculty and graduates to obtain international awards or patents' WHERE code = 'IND-19';
UPDATE academic_quality_indicators SET element_id = (SELECT id FROM academic_quality_elements WHERE element_number = 5 LIMIT 1),
    max_score = 6, title_en = 'Clear and fair intellectual property ownership and marketing policies' WHERE code = 'IND-20';

-- العنصر 6: أخلاقيات البحث العلمي (المجموع: 6)
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Existence of published and documented scientific research ethics standards' WHERE code = 'IND-21';

-- العنصر 7: مصادر المعلومات (المجموع: 42)
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Availability of up-to-date books and publications' WHERE code = 'IND-22';
UPDATE academic_quality_indicators SET max_score = 2, title_en = 'Availability of a library guide' WHERE code = 'IND-23';
UPDATE academic_quality_indicators SET max_score = 4, title_en = 'Health and physical environment of library halls' WHERE code = 'IND-24';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Availability of global systems for collaboration with universities' WHERE code = 'IND-25';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Development of library systems' WHERE code = 'IND-26';
UPDATE academic_quality_indicators SET max_score = 8, title_en = 'Equipping electronic libraries and linking them to information networks' WHERE code = 'IND-27';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Participation in prominent global rankings related to scientific research' WHERE code = 'IND-28';
UPDATE academic_quality_indicators SET max_score = 4, title_en = 'Establishing information banks and using modern access technologies' WHERE code = 'IND-29';

-- العنصر 8: التعاون الدولي في الأنشطة العلمية والبحثية (المجموع: 78)
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Support program for collaboration with global universities and research networks' WHERE code = 'IND-30';
UPDATE academic_quality_indicators SET max_score = 8, title_en = 'Agreements on shared use or ownership of high-cost research equipment' WHERE code = 'IND-31';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Scientific and research agreements and visit exchanges' WHERE code = 'IND-32';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Protocols with international university libraries' WHERE code = 'IND-33';
UPDATE academic_quality_indicators SET max_score = 2, title_en = 'Memoranda of understanding and research partnerships' WHERE code = 'IND-34';
UPDATE academic_quality_indicators SET max_score = 8, title_en = 'Support for research sabbaticals at international institutions' WHERE code = 'IND-35';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Encouraging researchers to obtain international awards' WHERE code = 'IND-36';
UPDATE academic_quality_indicators SET max_score = 2, title_en = 'Provision of dedicated research hours for faculty members' WHERE code = 'IND-37';
UPDATE academic_quality_indicators SET max_score = 4, title_en = 'Crediting research work within the teaching workload' WHERE code = 'IND-38';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Support for regional and international conferences and workshops' WHERE code = 'IND-39';
UPDATE academic_quality_indicators SET max_score = 4, title_en = 'Support for membership in international bodies' WHERE code = 'IND-40';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Research teams serving production sectors' WHERE code = 'IND-41';
UPDATE academic_quality_indicators SET max_score = 2, title_en = 'Plans for establishing research centers' WHERE code = 'IND-42';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Interdisciplinary research projects' WHERE code = 'IND-43';
UPDATE academic_quality_indicators SET max_score = 6, title_en = 'Joint research projects with strategic partners' WHERE code = 'IND-44';

-- ---------------------------------------------------------------------
-- 2) تحقق سريع بعد التنفيذ (اختياري — يعرض المجموع لكل عنصر للمقارنة
--    مع الدليل: 54, 24, 16, 8, 12, 6, 42, 78 = 240 إجمالاً)
-- ---------------------------------------------------------------------
SELECT e.element_number, e.title_ar, SUM(i.max_score) AS total_max_score, COUNT(*) AS indicators_count
FROM academic_quality_indicators i
JOIN academic_quality_elements e ON e.id = i.element_id
GROUP BY e.element_number, e.title_ar
ORDER BY e.element_number;
