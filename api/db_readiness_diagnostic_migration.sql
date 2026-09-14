-- =====================================================================
-- db_readiness_diagnostic_migration.sql — Stage A.5 / P5
--
-- المشكلة: ai_readiness_assessment.php كان يُخرج نسبة "جاهزية إجمالية"
-- وأبعاداً مئوية (بيانات/أدلة/تعريفات/منهجية/أداء) وcategory_scores
-- (جودة/إنتاجية/أثر/تمويل/...) مباشرة من نص خام أرجعه نموذج ذكاء
-- اصطناعي، بلا أي إعادة حساب أو تحقق، ويُعرَض للمستخدم كأنه نتيجة
-- رسمية — رغم أن الطلب المُرسَل للنموذج نفسه يصف ما يُنتجه بأنه "تقدير
-- تقريبي" فقط. هذا يخالف المبدأ المعماري: الذكاء الاصطناعي لا يجوز أن
-- يكون الحاسبة الرسمية الوحيدة لأي نتيجة اعتماد/تصنيف/تميز بحثي.
--
-- الإصلاح: تحويل الدور من "تقييم جاهزية" إلى "تحليل أولي تشخيصي" ناتج
-- نوعي (ملاحظات/فجوات/أولويات مقترحة) بدل نسب مئوية "رسمية الشكل".
-- هذا الملف يضيف عمودين وصفيين فقط لتمييز السجلات القديمة (نسب مئوية)
-- عن الجديدة (تشخيص نوعي) دون حذف أي بيانات تاريخية.
-- =====================================================================

SET NAMES utf8mb4;

ALTER TABLE university_readiness_assessments ADD COLUMN IF NOT EXISTS assessment_type VARCHAR(30) NULL DEFAULT NULL AFTER university_id;
ALTER TABLE university_readiness_assessments ADD COLUMN IF NOT EXISTS diagnostic_version VARCHAR(10) NULL DEFAULT NULL AFTER assessment_type;

-- ===== تعليم أي سجل موجود مسبقاً (بلا assessment_type) كنوع قديم صراحةً —
-- لا يُعرَض أبداً مستقبلاً كأنه تشخيص رسمي جديد =====
UPDATE university_readiness_assessments SET assessment_type = 'legacy_readiness' WHERE assessment_type IS NULL OR assessment_type = '';

SELECT 'total_rows' AS check_name, COUNT(*) AS row_count FROM university_readiness_assessments
UNION ALL SELECT 'legacy_readiness_rows', COUNT(*) FROM university_readiness_assessments WHERE assessment_type = 'legacy_readiness'
UNION ALL SELECT 'diagnostic_rows', COUNT(*) FROM university_readiness_assessments WHERE assessment_type = 'ai_research_profile_diagnostic';
