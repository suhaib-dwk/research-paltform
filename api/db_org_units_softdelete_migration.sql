-- =====================================================================
-- db_org_units_softdelete_migration.sql — Stage A.5 / P3
--
-- المشكلة: حفظ ملف الجامعة كان يحذف كل صفوف campuses/colleges/
-- departments/research_centers ويعيد إدراجها من الصفر عند كل حفظ —
-- معرّفات جديدة في كل مرة، بلا استقرار. أي وحدة مستقبلية (باحثون،
-- مشاريع، أدلة) ستشير إلى هذه المعرّفات كمفاتيح خارجية سيُكسَر
-- ارتباطها فور أول حفظ لاحق للملف.
--
-- هذا الملف يضيف عمود deleted_at (soft-delete) للجداول الأربعة، تحضيراً
-- لخوارزمية الحفظ الجديدة في save_university_profile.php التي ستُحدِّث
-- الصفوف الموجودة مكانها بدل حذفها وإعادة إدراجها، وستُعلِّم الصفوف
-- المُزالة بـ deleted_at بدل حذفها فعلياً فوراً — حتى مع عدم وجود أي
-- جدول آخر يشير إليها اليوم (حذف فعلي ما يزال آمناً تقنياً حالياً)، كي
-- لا تُفقَد بيانات كان يمكن لمرحلة لاحقة أن تحتاج أثرها التاريخي.
--
-- إضافة عمود عادي بلا قيد/مفتاح خارجي — ADD COLUMN IF NOT EXISTS وحدها
-- كافية ومتوافقة MariaDB 10.4 (بخلاف قيود FK التي تحتاج النمط الديناميكي).
-- =====================================================================

SET NAMES utf8mb4;

ALTER TABLE university_campuses         ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL AFTER sort_order;
ALTER TABLE university_colleges         ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL AFTER sort_order;
ALTER TABLE university_departments      ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL AFTER sort_order;
ALTER TABLE university_research_centers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL AFTER sort_order;

-- ===== تحقّق نهائي =====
SELECT 'university_campuses_has_deleted_at' AS check_name,
  (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'university_campuses' AND COLUMN_NAME = 'deleted_at') AS present
UNION ALL SELECT 'university_colleges_has_deleted_at',
  (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'university_colleges' AND COLUMN_NAME = 'deleted_at')
UNION ALL SELECT 'university_departments_has_deleted_at',
  (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'university_departments' AND COLUMN_NAME = 'deleted_at')
UNION ALL SELECT 'university_research_centers_has_deleted_at',
  (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'university_research_centers' AND COLUMN_NAME = 'deleted_at');
