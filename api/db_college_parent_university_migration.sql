-- =========================================================
-- الكلية تابعة لجامعة: عمود الجامعة الأم في ملف الجهة (profiles_entity)
-- يُملأ من نموذج تسجيل الكلية (/register?role=college) باختيار الجامعة من
-- القائمة المرجعية ref_universities. register.php يُدرج أي حقل يطابق اسم
-- عمود موجود في جدول الملف، فلا يحتاج تعديلًا.
-- =========================================================
ALTER TABLE `profiles_entity`
  ADD COLUMN `parent_university_id` INT NULL DEFAULT NULL AFTER `entity_type`,
  ADD KEY `idx_profiles_entity_parent_university` (`parent_university_id`);
