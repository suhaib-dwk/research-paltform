-- =====================================================================
-- جودة الأكاديمية — معيار البحث العلمي (المعيار 06، الوزن 24%)
-- ضمن نظام الجودة الأكاديمية والاعتماد المؤسسي للجامعات العراقية
-- مصدر المحتوى: docs/Iraqi_Research_Quality_Standard_FULL_Editable.docx
--
-- ملاحظة مهمة: الجدولان academic_quality_standard و academic_quality_elements
-- موجودان مسبقًا في قاعدة البيانات "ris" (أُنشئا من عمل سابق) ومعبّآن فعلاً
-- بالمعيار 06 وعناصره الثمانية. هذا الملف يكمل عليهما فقط:
--   - INSERT بصيغة "أدرج فقط إذا لم توجد بيانات" على الجدولين القائمين
--     (تحسبًا لتشغيله على نسخة قاعدة بيانات فارغة من هذين الجدولين)
--   - إنشاء الجداول المتبقية اللازمة: المؤشرات، استجابات الجهات، ملفات الأدلة
--
-- طريقة التشغيل: افتح phpMyAdmin (XAMPP) → اختر قاعدة البيانات "ris"
-- → تبويب SQL → الصق هذا الملف كاملاً → Go
-- (آمن للتشغيل أكثر من مرة — يستخدم IF NOT EXISTS و ON DUPLICATE KEY)
-- =====================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 0) تأكيد وجود جدولي المعيار والعناصر (بنفس البنية الموجودة فعليًا بالقاعدة)
--    لن يُنفَّذا إذا كانا موجودين مسبقًا
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_quality_standard (
  id INT NOT NULL AUTO_INCREMENT,
  standard_number VARCHAR(10) NOT NULL DEFAULT '06',
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  subtitle_ar VARCHAR(255) DEFAULT NULL,
  subtitle_en VARCHAR(255) DEFAULT NULL,
  weight_percent INT NOT NULL DEFAULT 24,
  indicators_count INT NOT NULL DEFAULT 44,
  goals_count INT NOT NULL DEFAULT 48,
  intro_ar TEXT DEFAULT NULL,
  intro_en TEXT DEFAULT NULL,
  cycle_ar TEXT DEFAULT NULL,
  cycle_en TEXT DEFAULT NULL,
  source_note_ar VARCHAR(500) DEFAULT NULL,
  source_note_en VARCHAR(500) DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS academic_quality_elements (
  id INT NOT NULL AUTO_INCREMENT,
  standard_id INT NOT NULL DEFAULT 1,
  element_number INT NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  PRIMARY KEY (id),
  KEY standard_id (standard_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إدراج المعيار إن كانت القاعدة فارغة منه فقط (لا يُكرر إن وُجد صف مسبقًا)
INSERT INTO academic_quality_standard
    (standard_number, title_ar, title_en, subtitle_ar, subtitle_en, weight_percent, indicators_count, goals_count, source_note_ar, source_note_en)
SELECT '06', 'معيار البحث العلمي', 'Scientific Research Standard',
       'ضمن نظام الجودة الأكاديمية والاعتماد المؤسسي للجامعات العراقية',
       'Within the academic quality and institutional accreditation system for Iraqi universities',
       24, 44, 48,
       'المصدر المرجعي الأساسي: دليل معايير الاعتماد المؤسسي لمؤسسات التعليم العالي في العراق، معيار البحث العلمي.',
       'Reference source: Institutional Accreditation Standards Guide for Iraqi Higher Education Institutions, Scientific Research Standard.'
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_standard WHERE standard_number = '06');

-- إدراج العناصر الثمانية إن لم تكن موجودة (نتحقق بعنصر رقم 1 كعلامة)
INSERT INTO academic_quality_elements (standard_id, element_number, title_ar, title_en, sort_order)
SELECT s.id, e.element_number, e.title_ar, e.title_en, e.element_number
FROM (SELECT id FROM academic_quality_standard WHERE standard_number = '06' LIMIT 1) s
CROSS JOIN (
    SELECT 1 AS element_number, 'بيئة البحث العلمي' AS title_ar, 'Research Environment' AS title_en
    UNION ALL SELECT 2, 'تمويل البحث العلمي', 'Research Funding'
    UNION ALL SELECT 3, 'نشر البحث العلمي', 'Research Publication'
    UNION ALL SELECT 4, 'تسويق البحث العلمي', 'Research Marketing'
    UNION ALL SELECT 5, 'الإبداع والابتكار', 'Creativity & Innovation'
    UNION ALL SELECT 6, 'أخلاقيات البحث العلمي', 'Research Ethics'
    UNION ALL SELECT 7, 'مصادر المعلومات', 'Information Resources'
    UNION ALL SELECT 8, 'التعاون الدولي في الأنشطة العلمية والبحثية', 'International Collaboration'
) e
WHERE NOT EXISTS (
    SELECT 1 FROM academic_quality_elements ex
    WHERE ex.standard_id = s.id AND ex.element_number = e.element_number
);

-- ---------------------------------------------------------------------
-- 1) المؤشرات (44 مؤشرًا) — مرتبطة بجدول academic_quality_elements الموجود
-- indicator_type:
--   compliance   → وجود/عدم وجود سياسة أو جهة أو إجراء: 0 / 50 / 100
--   maturity     → قياس نضج الممارسة: 0/25/50/75/100
--   quantitative → قيمة فعلية مقابل مستهدف رقمي (سقف 100)
--   percentage   → نسبة فعلية مقابل نسبة مستهدفة / Benchmark
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_quality_indicators (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    element_id          INT NOT NULL,
    indicator_number    INT NOT NULL,
    code                VARCHAR(20)  NOT NULL UNIQUE,
    title_ar            VARCHAR(500) NOT NULL,
    indicator_type      ENUM('compliance','quantitative','percentage','maturity') NOT NULL,
    description         TEXT NULL,
    required_inputs     TEXT NULL,
    required_evidence   TEXT NULL,
    module_name         VARCHAR(255) NULL,
    sort_order          INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_aqi_element FOREIGN KEY (element_id) REFERENCES academic_quality_elements(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2) استجابات الجهة الأكاديمية (جامعة/كلية/مركز بحثي) لكل مؤشر ولكل فترة
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_quality_entity_responses (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    entity_id           INT NOT NULL,           -- users.id لصاحب الحساب (جامعة/كلية/مركز)
    indicator_id        INT NOT NULL,
    reporting_period     VARCHAR(20) NOT NULL,   -- مثال: 2025-2026
    actual_value        DECIMAL(14,2) NULL,
    target_value         DECIMAL(14,2) NULL,
    maturity_level       TINYINT NULL,
    compliance_level     ENUM('none','partial','full') NULL,
    assessment           ENUM('not_verified','partial','full') NOT NULL DEFAULT 'not_verified',
    evidence_quality     TINYINT NULL,
    score                DECIMAL(6,2) NOT NULL DEFAULT 0,
    gap_notes            TEXT NULL,
    corrective_action    TEXT NULL,
    owner_name           VARCHAR(255) NULL,
    due_date             DATE NULL,
    status                VARCHAR(50) NOT NULL DEFAULT 'draft',
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_entity_indicator_period (entity_id, indicator_id, reporting_period),
    CONSTRAINT fk_aqer_indicator FOREIGN KEY (indicator_id) REFERENCES academic_quality_indicators(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3) ملفات الأدلة المرفوعة لكل استجابة
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_quality_evidence_files (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    response_id  INT NOT NULL,
    file_name    VARCHAR(255) NOT NULL,
    file_path    VARCHAR(500) NOT NULL,
    uploaded_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aqef_response FOREIGN KEY (response_id) REFERENCES academic_quality_entity_responses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- بيانات ابتدائية: المؤشرات الـ44 (تُدرج فقط إن لم تكن موجودة بالفعل)
-- =====================================================================

-- العنصر الأول: بيئة البحث العلمي (المؤشرات 01–10)
INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=1 LIMIT 1), 1, 'IND-01', 'وجود جهة مؤسسية تتولى خطة البحث العلمي', 'compliance',
 'وجود جهة أو وحدة أو قسم رسمي مسؤول عن التخطيط للبحث العلمي واعتماد وتنفيذ خطة البحث العلمي في الجامعة.',
 'اسم الجهة، الهيكل التنظيمي، المسؤول، تاريخ التشكيل، خطة البحث العلمي، تاريخ اعتماد الخطة، مدة الخطة، أهداف الخطة',
 'قرار التشكيل، الهيكل التنظيمي، خطة البحث العلمي، محضر اعتماد الخطة',
 'Institutional Research Governance Module', 1
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-01');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=1 LIMIT 1), 2, 'IND-02', 'مشاركة الجهات المستفيدة في صياغة خطة البحث', 'maturity',
 'قياس مدى إشراك أصحاب المصلحة (القطاع الخاص، الحكومة، المجتمع، المؤسسات الإنتاجية/الصحية/التعليمية، الجهات المهنية) في تحديد الأولويات البحثية.',
 'اسم الجهة، نوع الجهة، تاريخ المشاركة، طريقة المشاركة، الموضوع، التوصيات، المخرجات',
 'محاضر الاجتماعات، ورش العمل، الاستبيانات، الكتب الرسمية، التوصيات',
 'Stakeholder Engagement Module', 2
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-02');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=1 LIMIT 1), 3, 'IND-03', 'ارتباط خطة البحث بسوق العمل والمجتمع', 'maturity',
 'قياس مدى ارتباط الأولويات البحثية بالاحتياجات الحقيقية للبلد والمجتمع وسوق العمل.',
 'أولوية البحث، المشكلة الوطنية، احتياج سوق العمل، القطاع المستهدف، الجهة المستفيدة، نوع الأثر المتوقع',
 'دراسات الاحتياجات، تقارير سوق العمل، وثائق الخطة، الدراسات الاستراتيجية',
 'Research Priority Mapping', 3
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-03');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=1 LIMIT 1), 4, 'IND-04', 'الالتزام بسياسات الابتعاث والبحث العلمي', 'compliance',
 'وجود سياسات وتعليمات واضحة للابتعاث والبحث العلمي وتطبيقها.',
 'سياسة الابتعاث، تعليمات البحث العلمي، عدد المبتعثين، التخصصات، الدول، الجامعات، مدة الابتعاث، نتائج الابتعاث',
 'السياسات، القرارات، التقارير، سجلات الابتعاث',
 'Research & Scholarship Policy Module', 4
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-04');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=1 LIMIT 1), 5, 'IND-05', 'تحفيز الباحثين', 'maturity',
 'قياس وجود نظام مؤسسي لتحفيز الباحثين (حوافز النشر، الجوائز، المنح، دعم المؤتمرات والنشر، تخفيض النصاب، الحوافز المعنوية).',
 'حوافز النشر، الجوائز، المنح، دعم المؤتمرات، دعم النشر، تخفيض النصاب، الحوافز المعنوية',
 'سياسة الحوافز، القرارات، قوائم المستفيدين، تقارير الصرف',
 'Researcher Incentives Module', 5
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-05');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=1 LIMIT 1), 6, 'IND-06', 'مستلزمات البحث العلمي', 'percentage',
 'قياس مدى توفر البنية التحتية التي يحتاجها الباحث (مختبرات، أجهزة، برمجيات، قواعد بيانات، مرافق).',
 'المختبرات، الأجهزة، البرمجيات، قواعد البيانات، المرافق، الطاقة الاستيعابية، نسبة الاستخدام، حالة المعدات',
 'سجل الأصول، قوائم المعدات، عقود البرمجيات، تقارير الاستخدام',
 'Research Infrastructure & Assets Module', 6
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-06');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=1 LIMIT 1), 7, 'IND-07', 'صيانة البنية التحتية والمعدات', 'compliance',
 'قياس وجود نظام صيانة ومعايرة للمعدات البحثية. يستطيع النظام إرسال تنبيه عند اقتراب موعد الصيانة (خلال 30 يومًا).',
 'اسم الجهاز، الرقم التعريفي، تاريخ الشراء، آخر صيانة، الصيانة القادمة، حالة الجهاز، المعايرة',
 'سجلات الصيانة، العقود، شهادات المعايرة',
 'Research Asset Maintenance', 7
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-07');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=1 LIMIT 1), 8, 'IND-08', 'سياسات ملكية معدات البحث', 'compliance',
 'تحديد من يملك المعدات ومن يديرها ومن يتحمل مسؤولية صيانتها واستخدامها.',
 'المعدات، المالك، مصدر التمويل، الجهة المستخدمة، مسؤول الصيانة، سياسة الاستخدام',
 'سياسة الملكية، سجل الأصول، القرارات',
 NULL, 8
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-08');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=1 LIMIT 1), 9, 'IND-09', 'الصحة والسلامة المهنية للباحثين', 'compliance',
 'وجود نظام للسلامة وحماية الباحثين، خصوصًا في المختبرات والمرافق البحثية.',
 'سياسة السلامة، تقييم المخاطر، التدريب، معدات الحماية، إجراءات الطوارئ، الحوادث',
 'سجلات التدريب، تقارير التفتيش، تقييم المخاطر',
 'Research Health & Safety Compliance', 9
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-09');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=1 LIMIT 1), 10, 'IND-10', 'المحافظة على البيئة', 'compliance',
 'قياس التزام الأنشطة البحثية بالمتطلبات البيئية.',
 'النفايات، المواد الخطرة، طريقة التخلص، الإجراءات البيئية، الحوادث',
 'السياسة البيئية، سجلات النفايات، التقارير',
 NULL, 10
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-10');

-- العنصر الثاني: تمويل البحث العلمي (المؤشرات 11–14)
INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=2 LIMIT 1), 11, 'IND-11', 'وجود موازنة سنوية كافية للبحث العلمي', 'quantitative',
 'قياس حجم الموارد المالية المخصصة فعليًا للبحث العلمي. مؤشرات مشتقة: Research Budget، Research Spending Rate، Research Budget per Faculty، External Funding Rate.',
 'موازنة البحث، الإنفاق الفعلي، المنح الداخلية، المنح الخارجية، دعم المؤتمرات، دعم النشر',
 NULL,
 'Research Finance Module', 11
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-11');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=2 LIMIT 1), 12, 'IND-12', 'أولوية البحوث ذات المردود الاقتصادي', 'maturity',
 'قياس قدرة الجامعة على دعم الأبحاث التي يمكن أن تحقق قيمة اقتصادية أو إنتاجية.',
 'عدد الأبحاث التطبيقية، المشاريع، القطاع المستفيد، التقنية، العائد المتوقع، الأثر الاقتصادي',
 'تقارير المشاريع، العقود، الشراكات',
 'Research Economic Impact Module', 12
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-12');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=2 LIMIT 1), 13, 'IND-13', 'قدرة الجهة البحثية على تحديد الخبرات والفرص التجارية', 'maturity',
 'قدرة الجامعة على معرفة: من يملك الخبرة؟ ما التقنية الموجودة؟ ما السوق المحتمل؟ من الشريك الصناعي؟',
 'الباحث، التخصص، الخبرة، التقنية، براءات الاختراع، السوق المحتمل، القطاع',
 NULL,
 'Research Expertise Marketplace', 13
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-13');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=2 LIMIT 1), 14, 'IND-14', 'المشاركة في مشاريع ممولة محليًا ودوليًا', 'quantitative',
 'مؤشرات مشتقة: Number of Grants، Total Funding، International Funding، External Funding Rate، Funding per Researcher.',
 'اسم المشروع، الباحث الرئيسي، الفريق، مصدر التمويل، الدولة، قيمة التمويل، مدة المشروع، الشريك',
 NULL,
 'Grant Management System', 14
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-14');

-- العنصر الثالث: نشر البحث العلمي (المؤشرات 15–17)
INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=3 LIMIT 1), 15, 'IND-15', 'توجيه وتحفيز النشر في المجلات العالمية ذات معامل التأثير', 'percentage',
 'النظام يستطيع حساب: Indexed Publication Rate، Q1 Publication Rate، Q1+Q2 Publication Rate، Publication per Faculty، International Collaboration Rate، Citation Impact.',
 'Publication ID، عنوان البحث، المؤلفون، الباحث، Researcher ID، المجلة، ISSN، الناشر، Scopus، Web of Science، Quartile، Impact Factor، CiteScore، SJR، DOI، سنة النشر، نوع البحث، التعاون الدولي، عدد الاستشهادات',
 'DOI، رابط الناشر، بيانات Scopus، بيانات Web of Science، نسخة المنشور',
 'Institutional Publication Database', 15
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-15');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=3 LIMIT 1), 16, 'IND-16', 'قاعدة بيانات للبحوث', 'compliance',
 'وجود قاعدة بيانات مؤسسية متكاملة للإنتاج البحثي، ترتبط بالباحث والمنشور والمشروع والمنحة والبراءة والمؤتمر والمركز البحثي والاستشهادات. يفضل ألا تكون مجرد ملفات PDF بل بيانات structured data.',
 'الباحث، المنشور، المشروع، المنحة، البراءة، المؤتمر، المركز البحثي، الاستشهادات',
 NULL,
 'Research Repository', 16
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-16');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=3 LIMIT 1), 17, 'IND-17', 'دعم البحوث التطبيقية المرتبطة بالمجتمع وسوق العمل', 'maturity',
 'قياس قدرة الجامعة على دعم البحوث التطبيقية المرتبطة باحتياجات المجتمع وسوق العمل الفعلية.',
 'البحث، الباحث، المشكلة، الجهة المستفيدة، القطاع، نوع الأثر، النتائج، الاستخدام الفعلي',
 'العقود، تقارير الأثر، مخرجات المشاريع، خطابات الجهات المستفيدة',
 'Research Impact Module', 17
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-17');

-- العنصر الرابع: تسويق البحث العلمي (المؤشرات 18–20 — كما وردت حرفيًا بنص الوثيقة الأصلي)
INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=4 LIMIT 1), 18, 'IND-18', 'علاقات وروابط مع المؤسسات ذات العلاقة محليًا ودوليًا', 'maturity',
 'قياس علاقات الجامعة وروابطها مع المؤسسات ذات العلاقة بتسويق نتاج البحث العلمي محليًا ودوليًا.',
 'الباحث، البراءة، المخترع، تاريخ الإيداع، الدولة، الحالة، الجائزة، مستوى الجائزة، السنة',
 'شهادة البراءة، شهادة الجائزة، قرار الجامعة',
 'Innovation & IP Module', 18
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-18');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=4 LIMIT 1), 19, 'IND-19', 'تشجيع الجوائز وبراءات الاختراع', 'quantitative',
 'قياس تشجيع الجامعة للحصول على براءات الاختراع والجوائز.',
 'الباحث، البراءة، المخترع، تاريخ الإيداع، الدولة، الحالة، الجائزة، مستوى الجائزة، السنة',
 'شهادة البراءة، شهادة الجائزة، قرار الجامعة',
 'Innovation & IP Module', 19
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-19');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=4 LIMIT 1), 20, 'IND-20', 'سياسة الملكية الفكرية وتسويقها', 'compliance',
 'وجود سياسة مؤسسية لإدارة الملكية الفكرية، الاختراعات، الترخيص، التسويق، والعائدات.',
 'سياسة IP، المالك، المخترع، التقنية، الترخيص، الشركة، العائد، حالة التسويق',
 NULL,
 'IP Management System', 20
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-20');

-- العنصر السادس: أخلاقيات البحث العلمي (المؤشر 21)
INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=6 LIMIT 1), 21, 'IND-21', 'وجود معايير معلنة وموثقة لأخلاقيات البحث العلمي', 'compliance',
 'وجود نظام مؤسسي يضمن أن البحث يتم وفق المعايير الأخلاقية. سير العمل المقترح: الباحث → تقديم طلب أخلاقيات → مراجعة أولية → مراجعة اللجنة → موافقة/إعادة/رفض → شهادة → أرشفة.',
 'سياسة الأخلاقيات، لجنة الأخلاقيات، أعضاء اللجنة، طلبات الموافقة، حالة الطلب، تاريخ التقديم، تاريخ الموافقة، القرار، الباحث، المشروع',
 'السياسة، قرارات اللجنة، شهادات الموافقة',
 'Research Ethics Workflow', 21
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-21');

-- العنصر السابع: مصادر المعلومات (المؤشرات 22–29)
INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=7 LIMIT 1), 22, 'IND-22', 'توفير الكتب والإصدارات الحديثة', 'quantitative',
 'قياس مدى توفر الكتب والدوريات وقواعد البيانات الحديثة في المكتبة.',
 'الكتب، الدوريات، قواعد البيانات، سنة الإصدار، التخصص، عدد الموارد',
 'سجل المكتبة، عقود الاشتراك',
 'Library Resource Inventory', 22
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-22');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=7 LIMIT 1), 23, 'IND-23', 'دليل المكتبة', 'compliance',
 'وجود دليل معلن لخدمات المكتبة وساعات العمل وقواعد البيانات والخدمات الإلكترونية.',
 'دليل المكتبة، الخدمات، ساعات العمل، قواعد البيانات، الخدمات الإلكترونية، خدمات الباحثين',
 'دليل المكتبة، صفحة الخدمات',
 NULL, 23
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-23');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=7 LIMIT 1), 24, 'IND-24', 'البيئة الصحية والفيزيائية للمكتبة', 'maturity',
 'قياس مدى ملاءمة البيئة الصحية والفيزيائية للمكتبة (الطاقة الاستيعابية، السلامة، الإتاحة، التجهيزات).',
 'الطاقة الاستيعابية، السلامة، الإتاحة، التجهيزات، التفتيش، الملاحظات',
 'تقارير التفتيش، تقارير السلامة',
 NULL, 24
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-24');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=7 LIMIT 1), 25, 'IND-25', 'أنظمة عالمية للتعاون مع الجامعات', 'quantitative',
 'مدى استخدام الجامعة للشبكات والأنظمة العالمية التي تسهل التعاون والوصول إلى المعلومات.',
 'النظام، الشبكة، الشريك، الدولة، نوع الوصول، عدد المستخدمين، معدل الاستخدام',
 'الاتفاقيات، تقارير الاستخدام',
 NULL, 25
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-25');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=7 LIMIT 1), 26, 'IND-26', 'تطوير النظم المكتبية', 'maturity',
 'قياس تطور خدمات المكتبة وليس مجرد وجود المكتبة.',
 'النظام الإلكتروني، الخدمات الرقمية، التحديثات، التكامل، الدعم البحثي، خطة التطوير',
 NULL,
 'Library Maturity Model', 26
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-26');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=7 LIMIT 1), 27, 'IND-27', 'المكتبات الإلكترونية وشبكات المعلومات', 'quantitative',
 'مؤشرات مشتقة: Database Usage، Downloads، Active Researchers، Remote Access Rate.',
 'قواعد البيانات، عدد المستخدمين، عمليات البحث، التنزيلات، الوصول عن بعد، ساعات الاستخدام',
 NULL,
 NULL, 27
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-27');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=7 LIMIT 1), 28, 'IND-28', 'المشاركة في التصنيفات العالمية المتعلقة بالبحث العلمي', 'quantitative',
 'قياس مشاركة الجامعة في التصنيفات العالمية وتتبع تغير مركزها سنويًا.',
 'اسم التصنيف، السنة، المركز، مؤشرات التصنيف، نتيجة الجامعة، التغير السنوي',
 NULL,
 'Ranking Intelligence Module', 28
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-28');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=7 LIMIT 1), 29, 'IND-29', 'بنوك المعلومات', 'compliance',
 'وجود بنوك معلومات مؤسسية متاحة ومتكاملة للمستخدمين.',
 'اسم قاعدة البيانات، النوع، المحتوى، المستخدمون، الوصول، التكامل، معدل الاستخدام',
 NULL,
 'Institutional Information Bank', 29
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-29');

-- العنصر الثامن: التعاون الدولي في الأنشطة العلمية والبحثية (المؤشرات 30–44)
INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 30, 'IND-30', 'برنامج دعم التعاون مع الجامعات والشبكات البحثية العالمية', 'compliance',
 'وجود برنامج مؤسسي داعم للتعاون مع الجامعات والشبكات البحثية العالمية.',
 'اسم البرنامج، الباحثون، الشبكة، الشركاء، الأنشطة، النتائج، التمويل',
 NULL,
 'International Research Collaboration Program', 30
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-30');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 31, 'IND-31', 'اتفاقيات استخدام أو ملكية معدات بحثية عالية الكلفة', 'quantitative',
 'قياس اتفاقيات مشاركة أو ملكية المعدات البحثية عالية الكلفة مع شركاء.',
 'اسم المعدة، المالك، الجامعة، الشريك، الاتفاقية، الاستخدام، الكلفة، مدة الاتفاقية',
 NULL,
 'Shared Research Infrastructure', 31
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-31');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 32, 'IND-32', 'الاتفاقيات العلمية والبحثية وتبادل الزيارات', 'quantitative',
 'قياس عدد وفاعلية الاتفاقيات العلمية وتبادل الزيارات البحثية.',
 'الشريك، الدولة، الباحث، الزيارة، المشروع، النشاط، المخرجات',
 'الاتفاقية، تقارير الزيارة، صور أو مستندات النشاط عند الحاجة',
 NULL, 32
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-32');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 33, 'IND-33', 'بروتوكولات مع مكتبات جامعات عالمية', 'quantitative',
 'قياس بروتوكولات التعاون مع مكتبات جامعات عالمية.',
 'اسم المكتبة، الجامعة، الدولة، الاتفاقية، نوع الوصول، الخدمات، الاستخدام',
 NULL,
 'International Library Access', 33
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-33');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 34, 'IND-34', 'مذكرات تفاهم وشراكات بحثية', 'maturity',
 'النظام لا يقيس عدد الاتفاقيات فقط، بل يميز بين شراكة غير نشطة (اتفاقية بدون نشاط) وشراكة نشطة (اتفاقية + مشروع + باحثون + مخرج).',
 'الشريك، الاتفاقية، النشاط، المشروع، الباحثون، المخرجات',
 NULL,
 NULL, 34
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-34');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 35, 'IND-35', 'دعم التفرغ البحثي في المؤسسات العالمية', 'quantitative',
 'قياس دعم الجامعة لتفرغ الباحثين للعمل البحثي في مؤسسات عالمية.',
 'الباحث، المؤسسة المضيفة، الدولة، مدة التفرغ، الموضوع، المخرج، المنشورات الناتجة',
 NULL,
 'Research Mobility Module', 35
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-35');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 36, 'IND-36', 'تشجيع الباحثين للحصول على جوائز دولية', 'quantitative',
 'قياس تشجيع الجامعة لباحثيها للحصول على جوائز دولية.',
 'الباحث، الجائزة، المنظمة، السنة، الترشيح، النتيجة، مستوى الجائزة',
 'خطاب الترشيح، الشهادة، قرار الجائزة',
 NULL, 36
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-36');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 37, 'IND-37', 'توفير ساعات بحثية للتدريسيين', 'percentage',
 'قياس مدى توفير وقت مؤسسي لأعضاء هيئة التدريس للبحث العلمي.',
 'عضو هيئة التدريس، الكلية، القسم، النصاب، الساعات البحثية، التخفيض، النشاط البحثي',
 NULL,
 'Academic Workload Analytics', 37
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-37');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 38, 'IND-38', 'احتساب العمل البحثي ضمن النصاب التدريسي', 'compliance',
 'وجود لائحة تحتسب العمل البحثي ضمن النصاب التدريسي وتطبيقها فعليًا. يجب الربط مع Faculty Profile + Workload System.',
 'اللائحة، عضو هيئة التدريس، النشاط البحثي، عدد الساعات، الساعات المحتسبة، القرار',
 'اللائحة، جدول العبء التدريسي، القرار',
 NULL, 38
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-38');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 39, 'IND-39', 'دعم المؤتمرات وورش العمل الإقليمية والدولية', 'quantitative',
 'مؤشرات مشتقة: عدد المشاركات، عدد المشاركات الدولية، التمويل، نسبة المشاركة المدعومة.',
 'المؤتمر، الدولة، الباحث، نوع المشاركة، البحث، التمويل، قيمة الدعم، المخرجات',
 'شهادة المشاركة، البحث، الإيصالات، التقرير',
 NULL, 39
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-39');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 40, 'IND-40', 'دعم العضوية في الهيئات الدولية', 'quantitative',
 'قياس دعم الجامعة لعضوية باحثيها في الهيئات الدولية.',
 'الباحث، الهيئة، الدولة، نوع العضوية، تاريخ العضوية، المنصب، الحالة',
 'شهادة العضوية، خطاب الجهة',
 'International Academic Membership Registry', 40
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-40');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 41, 'IND-41', 'فرق البحث لخدمة قطاعات الإنتاج', 'maturity',
 'ربط البحث العلمي بالقطاعات الاقتصادية والإنتاجية عبر فرق بحثية مخصصة.',
 'فريق البحث، أعضاء الفريق، التخصصات، القطاع، المشروع، الجهة المستفيدة، التمويل، المخرجات',
 NULL,
 'Research Team Registry', 41
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-41');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 42, 'IND-42', 'خطط إنشاء المراكز البحثية', 'maturity',
 'حالات المشروع: مقترح ← قيد المراجعة ← معتمد ← قيد التطوير ← تشغيلي.',
 'اسم المركز، التخصص، الحاجة، الهدف، الميزانية، الجدول الزمني، المسؤول، الحالة',
 NULL,
 'Research Center Planning Module', 42
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-42');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 43, 'IND-43', 'المشاريع والأبحاث متعددة التخصصات', 'quantitative',
 'مؤشرات مشتقة: Interdisciplinary Research Rate، Number of Interdisciplinary Projects، Faculties Involved، Cross-disciplinary Publications.',
 'المشروع، التخصصات، الباحثون، الكليات، التمويل، المنشورات، النتائج',
 NULL,
 NULL, 43
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-43');

INSERT INTO academic_quality_indicators (element_id, indicator_number, code, title_ar, indicator_type, description, required_inputs, required_evidence, module_name, sort_order)
SELECT (SELECT id FROM academic_quality_elements WHERE element_number=8 LIMIT 1), 44, 'IND-44', 'المشاريع والأبحاث المشتركة مع الشركاء الاستراتيجيين', 'quantitative',
 'قياس الأبحاث والمشاريع التي تنفذها الجامعة مع شركاء استراتيجيين.',
 'الشريك، الدولة، المشروع، الباحثون، التمويل، المنشورات، البراءات، الأثر، مدة المشروع',
 'العقود، الاتفاقيات، تقارير المشروع، المنشورات، البراءات، تقارير الأثر',
 'Strategic Research Collaboration Module', 44
WHERE NOT EXISTS (SELECT 1 FROM academic_quality_indicators WHERE code='IND-44');
