-- =====================================================================
-- db_seed_funding_news.sql — إعلانات فرص تمويل (تصنيف grants) في جدول news
--
-- تظهر في صفحة /ministry-space/funding (قسم «أخبار وإعلانات») وفي /all-news.
-- برامج دولية حقيقية تُفتح دوريًا؛ بلا مواعيد أو مبالغ لأنها تتغير كل دورة —
-- المحتوى يحيل إلى الموقع الرسمي. نفس القائمة موجودة كاحتياط في الواجهة
-- (FUNDING_FALLBACK في src/data/ministrySpacesDetails.js).
-- آمن للتشغيل أكثر من مرة: INSERT IGNORE على المفتاح الفريد slug.
-- =====================================================================

SET NAMES utf8mb4;

INSERT IGNORE INTO `news` (`title_ar`, `title_en`, `content_ar`, `content_en`, `image_url`, `slug`, `category`, `is_published`) VALUES
(
  'إيراسموس+ — منح تنقّل الطلبة وأعضاء هيئة التدريس مع الجامعات الأوروبية',
  'Erasmus+ — mobility grants for students and staff with European universities',
  '<p>برنامج الاتحاد الأوروبي للتعليم والتدريب. يموّل تنقّل الطلبة وأعضاء هيئة التدريس بين الجامعات الأوروبية وجامعات الدول الشريكة، ومشاريع بناء القدرات في التعليم العالي.</p><p>تُقدَّم الطلبات عادةً عبر الجامعة الشريكة. تحقق من الأهلية والمواعيد في الموقع الرسمي: <a href="https://erasmus-plus.ec.europa.eu/" target="_blank" rel="noopener">erasmus-plus.ec.europa.eu</a></p>',
  '<p>The European Union programme for education and training. It funds student and staff mobility between European universities and partner-country universities, and capacity-building projects in higher education.</p><p>Applications usually go through the partner university. Check eligibility and deadlines on the official site: <a href="https://erasmus-plus.ec.europa.eu/" target="_blank" rel="noopener">erasmus-plus.ec.europa.eu</a></p>',
  '/Home/home03.jpg', 'erasmus-plus-mobility', 'grants', 1
),
(
  'زمالات ماري سكوودوفسكا-كوري (Horizon Europe) — للباحثين من كل الجنسيات',
  'Marie Skłodowska-Curie fellowships (Horizon Europe) — open to researchers of any nationality',
  '<p>زمالات بحثية ضمن برنامج Horizon Europe تدعم الباحثين في مرحلة ما بعد الدكتوراه وبرامج الدكتوراه وتبادل الكوادر البحثية، ومفتوحة للباحثين من كل الجنسيات.</p><p>التفاصيل والدعوات المفتوحة في الموقع الرسمي: <a href="https://marie-sklodowska-curie-actions.ec.europa.eu/" target="_blank" rel="noopener">marie-sklodowska-curie-actions.ec.europa.eu</a></p>',
  '<p>Research fellowships under Horizon Europe supporting postdoctoral researchers, doctoral programmes and staff exchanges, open to researchers of any nationality.</p><p>Details and open calls on the official site: <a href="https://marie-sklodowska-curie-actions.ec.europa.eu/" target="_blank" rel="noopener">marie-sklodowska-curie-actions.ec.europa.eu</a></p>',
  '/Home/home01.jpg', 'msca-postdoctoral-fellowships', 'grants', 1
),
(
  'منح DAAD الألمانية — ماجستير ودكتوراه وزيارات بحثية',
  'DAAD scholarships (Germany) — master''s, PhD and research stays',
  '<p>الهيئة الألمانية للتبادل الأكاديمي تقدّم منحًا للخريجين والباحثين الدوليين للدراسة والبحث في ألمانيا: ماجستير، دكتوراه، وزيارات بحثية قصيرة.</p><p>قاعدة بيانات المنح والشروط في الموقع الرسمي: <a href="https://www.daad.de/en/" target="_blank" rel="noopener">daad.de</a></p>',
  '<p>The German Academic Exchange Service offers scholarships for international graduates and researchers to study and research in Germany: master''s, PhD and short research stays.</p><p>Scholarship database and conditions on the official site: <a href="https://www.daad.de/en/" target="_blank" rel="noopener">daad.de</a></p>',
  '/Home/home05.jpg', 'daad-scholarships', 'grants', 1
),
(
  'منح تشيفنينغ البريطانية — ماجستير لمدة عام في المملكة المتحدة',
  'Chevening scholarships (UK) — one-year master''s in the United Kingdom',
  '<p>برنامج منح الحكومة البريطانية لدراسة ماجستير لمدة عام في أي جامعة بريطانية، موجّه لأصحاب الخبرة المهنية والقدرات القيادية.</p><p>الدول المؤهلة والشروط والمواعيد في الموقع الرسمي: <a href="https://www.chevening.org/" target="_blank" rel="noopener">chevening.org</a></p>',
  '<p>The UK government scholarship programme for a one-year master''s at any UK university, aimed at people with professional experience and leadership potential.</p><p>Eligible countries, conditions and deadlines on the official site: <a href="https://www.chevening.org/" target="_blank" rel="noopener">chevening.org</a></p>',
  '/Home/home04.png', 'chevening-scholarships', 'grants', 1
),
(
  'منح البنك الإسلامي للتنمية — لمواطني الدول الأعضاء ومنها ليبيا',
  'Islamic Development Bank scholarships — for citizens of member countries, including Libya',
  '<p>برنامج منح البنك الإسلامي للتنمية لطلبة البكالوريوس والدراسات العليا والباحثين من الدول الأعضاء في مجالات تخدم التنمية.</p><p>البرامج المتاحة والشروط في الموقع الرسمي: <a href="https://www.isdb.org/scholarships" target="_blank" rel="noopener">isdb.org/scholarships</a></p>',
  '<p>The Islamic Development Bank scholarship programme for undergraduate, postgraduate students and researchers from member countries in development-related fields.</p><p>Available programmes and conditions on the official site: <a href="https://www.isdb.org/scholarships" target="_blank" rel="noopener">isdb.org/scholarships</a></p>',
  '/Home/home03.jpg', 'isdb-scholarships', 'grants', 1
),
(
  'زمالات TWAS — للعلماء والباحثين من الدول النامية',
  'TWAS fellowships — for scientists and researchers from developing countries',
  '<p>أكاديمية العلوم للعالم النامي (TWAS) تقدّم زمالات دكتوراه وما بعد الدكتوراه وزيارات بحثية للعلماء من الدول النامية بالشراكة مع مؤسسات بحثية دولية.</p><p>الزمالات المفتوحة في الموقع الرسمي: <a href="https://twas.org/" target="_blank" rel="noopener">twas.org</a></p>',
  '<p>The World Academy of Sciences (TWAS) offers PhD, postdoctoral and visiting fellowships for scientists from developing countries in partnership with international research institutions.</p><p>Open fellowships on the official site: <a href="https://twas.org/" target="_blank" rel="noopener">twas.org</a></p>',
  '/Home/home01.jpg', 'twas-fellowships', 'grants', 1
);
