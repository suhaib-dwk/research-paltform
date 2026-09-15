// =========================================================
// كتالوج خدمات الباحثين (الطبقة الأولى — Layer 1) — المصدر: "دليل خدمات
// الباحثين ومواصفات الخدمات للمنصة". 35 خدمة موزّعة على ثلاث مراحل بحثية
// (U = طالب البكالوريوس، P = طالب الدراسات العليا، F = عضو هيئة التدريس
// والباحث) وسبع عائلات عرض (القسم 8 بالدليل).
//
// يُستخدم في: قسم "الخدمات" بالصفحة الرئيسية (تابات العائلات)، صفحة
// /services (الكتالوج الكامل)، وصفحة /platform-service/:key (التفاصيل).
//
// قاعدة الدليل: يجب أن يظهر بوضوح متى تتطلب الخدمة خبيرًا بشريًا، ولا تُعرض
// أي نتيجة ذكاء اصطناعي كحكم أكاديمي نهائي — لذلك لكل خدمة حقل exec.
// =========================================================

export const SERVICE_FAMILIES = [
  { key: "assessment", label_ar: "التقييم البحثي", label_en: "Research Assessment" },
  { key: "development", label_ar: "تطوير البحث", label_en: "Research Development" },
  { key: "editing", label_ar: "التحرير والترجمة", label_en: "Editing & Translation" },
  { key: "review", label_ar: "التحكيم العلمي", label_en: "Expert Scientific Review" },
  { key: "journal", label_ar: "المجلة والنشر", label_en: "Journal & Publication" },
  { key: "revision", label_ar: "المراجعات والرد على المحكمين", label_en: "Peer Review & Revision" },
  { key: "post", label_ar: "ما بعد النشر وملف الباحث", label_en: "Post-Publication & Profile" },
];

// نوع التنفيذ (القسم 6 بالدليل: AI / Human / Hybrid + Workflow للخدمات المركّبة)
export const EXEC_TYPES = {
  ai: { label_ar: "ذكاء اصطناعي مساعد", label_en: "AI-assisted" },
  human: { label_ar: "خبير بشري", label_en: "Human expert" },
  hybrid: { label_ar: "ذكاء اصطناعي + خبير بشري", label_en: "AI + human expert" },
  workflow: { label_ar: "سير عمل المنصة", label_en: "Platform workflow" },
};

// المرحلة البحثية التي تستهدفها الخدمة — تطابق مفاتيح roles.* بالترجمة
export const SERVICE_LEVELS = {
  U: { key: "undergrad", label_ar: "طالب البكالوريوس", label_en: "Undergraduate" },
  P: { key: "grad", label_ar: "طالب الدراسات العليا", label_en: "Postgraduate" },
  F: { key: "faculty", label_ar: "عضو هيئة التدريس والباحث", label_en: "Faculty & Researchers" },
};

export const SERVICES_CATALOGUE = [
  // ───────── طالب البكالوريوس (U) — الجاهزية البحثية والفحص المبكر ─────────
  {
    id: "U01", family: "assessment", exec: "ai",
    name_ar: "التقييم البحثي الأولي", name_en: "Preliminary Research Assessment",
    desc_ar: "تقييم مبكر للبحث أو المقترح يوضح مستوى جاهزيته قبل الانتقال إلى مراحل متقدمة، بدرجات فرعية للموضوع والمنهجية والمراجع واللغة.",
    desc_en: "An early assessment of a paper or proposal showing its readiness before advanced stages, with sub-scores for topic, methodology, references and language.",
    how_ar: ["يرفع الطالب ملف البحث أو المقترح.", "يختار التخصص ونوع العمل البحثي.", "تشغّل المنصة فحوص التقييم الآلي.", "يظهر تقرير مبسّط مع درجات وملاحظات وتوصيات."],
    inputs_ar: ["ملف البحث أو المقترح", "موضوع البحث والتخصص", "المراجع المتاحة إن وجدت"],
    outputs_ar: ["درجة الجاهزية البحثية (Research Readiness Score)", "درجات فرعية للموضوع والمنهجية والمراجع واللغة", "قائمة أولويات للتحسين"],
  },
  {
    id: "U02", family: "assessment", exec: "ai",
    name_ar: "فحص الاقتباس والتشابه", name_en: "Citation & Similarity Screening",
    desc_ar: "فحص أولي للتشابه النصي وسلامة الإسناد المرجعي، يشير إلى المواضع التي تستحق المراجعة بدل إصدار حكم قطعي.",
    desc_en: "A preliminary check of text similarity and citation integrity that flags passages worth reviewing rather than issuing a verdict.",
    how_ar: ["يرفع الطالب الملف.", "تحلل المنصة النص والمراجع والاستشهادات.", "تظهر مناطق تستحق المراجعة بدل إصدار حكم قطعي."],
    inputs_ar: ["البحث بصيغة Word أو PDF", "قائمة المراجع"],
    outputs_ar: ["مؤشر التشابه (Similarity Indicator)", "تنبيهات سلامة الاستشهاد", "قائمة بالمراجع أو الاستشهادات غير المتسقة"],
  },
  {
    id: "U03", family: "assessment", exec: "ai",
    name_ar: "مؤشر استخدام الذكاء الاصطناعي", name_en: "AI Content Indicator",
    desc_ar: "مؤشر تحليلي يحدد المقاطع التي قد تستحق مراجعة إضافية بسبب احتمال استخدام أدوات توليد أو إعادة صياغة آلية — مؤشر مخاطر لا حكم نهائي.",
    desc_en: "An analytical indicator highlighting passages that may warrant extra review for possible machine generation or paraphrasing — a risk flag, never a verdict.",
    how_ar: ["يرفع الطالب النص.", "تحلل المنصة مؤشرات الأسلوب والاتساق.", "تحدد المقاطع التي تحتاج إلى مراجعة."],
    inputs_ar: ["النص أو البحث"],
    outputs_ar: ["مؤشر المحتوى (AI Content Indicator)", "علامات مخاطر (AI Risk Flags)", "تنبيه بالمقاطع التي تحتاج إلى تحقق بشري"],
  },
  {
    id: "U04", family: "assessment", exec: "hybrid",
    name_ar: "مراجعة منهجية البحث", name_en: "Research Methodology Review",
    desc_ar: "مراجعة مبكرة لمدى توافق مشكلة البحث وأهدافه وأسئلته ومنهجيته وأدواته معًا، مع خيار مراجعة خبير بشري.",
    desc_en: "An early review of how well the research problem, objectives, questions, methodology and instruments fit together, with an optional expert review.",
    how_ar: ["يحدد الطالب نوع الدراسة.", "يرفع المقترح أو فصل المنهجية.", "تحلل المنصة الاتساق بين عناصر التصميم البحثي."],
    inputs_ar: ["مشكلة البحث", "الأهداف والأسئلة", "المنهجية", "العينة والأداة إن وجدت"],
    outputs_ar: ["درجة جاهزية المنهجية", "مواطن عدم الاتساق", "توصيات تطوير"],
  },
  {
    id: "U05", family: "assessment", exec: "ai",
    name_ar: "تقييم موضوع البحث", name_en: "Research Topic Assessment",
    desc_ar: "فحص أولي لوضوح موضوع البحث وأهميته وإمكانية تطويره إلى دراسة قابلة للتنفيذ، مع اقتراحات لتضييق النطاق أو تحسينه.",
    desc_en: "A first check of a topic's clarity, relevance and potential to become a feasible study, with suggestions to narrow or sharpen its scope.",
    how_ar: ["يدخل الطالب عنوان الموضوع أو يرفع المقترح.", "تحلل المنصة وضوح الموضوع ومجاله وتوفر المصادر الأولي.", "يحصل الطالب على تقرير تحسين."],
    inputs_ar: ["العنوان", "وصف مختصر للفكرة", "التخصص"],
    outputs_ar: ["تقييم الموضوع", "ملاحظات على وضوح الموضوع", "اقتراحات لتضييق أو تحسين النطاق"],
  },
  {
    id: "U06", family: "assessment", exec: "ai",
    name_ar: "تقييم قابلية التطبيق", name_en: "Applicability Assessment",
    desc_ar: "فحص ما إذا كانت فكرة البحث قابلة للتنفيذ عمليًا من حيث البيانات والعينة والأدوات والوقت والموارد، مع تقرير مخاطر وفجوات.",
    desc_en: "A check of whether a research idea is practically feasible in terms of data, sample, tools, time and resources, with a risk-and-gap report.",
    how_ar: ["يدخل الطالب متطلبات الدراسة.", "تطابق المنصة المتطلبات مع عناصر التنفيذ.", "يظهر تقرير مخاطر وفجوات."],
    inputs_ar: ["نوع البيانات المطلوبة", "العينة المستهدفة", "الأدوات والموارد", "المدة المتاحة"],
    outputs_ar: ["درجة قابلية التطبيق", "مخاطر التنفيذ", "قائمة متطلبات يجب توفيرها"],
  },
  {
    id: "U07", family: "editing", exec: "hybrid",
    name_ar: "الترجمة الأكاديمية", name_en: "Academic Translation",
    desc_ar: "ترجمة متخصصة للنصوص الأكاديمية مع الحفاظ على المصطلحات العلمية والسياق والتناسق الاصطلاحي، بمراجعة لغوية مناسبة لمستوى الخدمة.",
    desc_en: "Specialised translation of academic texts that preserves scientific terminology, context and consistency, with language review matching the service tier.",
    how_ar: ["يرفع الطالب الملف.", "يحدد اللغة المصدر واللغة الهدف والتخصص.", "تجري الترجمة مع مراجعة لغوية مناسبة لمستوى الخدمة.", "يستلم النسخة النهائية."],
    inputs_ar: ["النص أو الملف", "اللغة المطلوبة", "التخصص"],
    outputs_ar: ["نسخة مترجمة أكاديميًا", "مسرد مصطلحات عند الحاجة"],
  },
  {
    id: "U08", family: "editing", exec: "hybrid",
    name_ar: "التدقيق والتحرير اللغوي الأكاديمي", name_en: "Academic Language Editing",
    desc_ar: "تحسين اللغة الأكاديمية من حيث القواعد والإملاء وعلامات الترقيم واختيار الكلمات والوضوح والاتساق، دون المساس بالمحتوى العلمي.",
    desc_en: "Improving academic language — grammar, spelling, punctuation, word choice, clarity and consistency — without altering the scientific content.",
    how_ar: ["يرفع الطالب النص.", "يحدد التخصص واللغة.", "ينفَّذ التحرير.", "يستلم النسخة المعدلة مع توضيحات حسب مستوى الخدمة."],
    inputs_ar: ["الملف أو النص", "التخصص"],
    outputs_ar: ["نسخة محررة لغويًا", "ملاحظات لغوية عند الحاجة"],
  },

  // ───────── طالب الدراسات العليا (P) — تطوير البحث ودعم النشر ─────────
  {
    id: "P01", family: "assessment", exec: "hybrid",
    name_ar: "التقييم البحثي المتقدم", name_en: "Advanced Research Assessment",
    desc_ar: "تقييم شامل يتجاوز اللغة إلى المشكلة البحثية والفجوة والمنهجية والنتائج والمناقشة والمساهمة العلمية، مع إمكانية طلب مراجعة خبير.",
    desc_en: "A comprehensive assessment beyond language: research problem, gap, methodology, results, discussion and contribution — with optional expert review.",
    how_ar: ["يرفع الباحث البحث كاملًا.", "يحدد المجال والتخصص.", "تقوم المنصة بالتقييم متعدد المحاور.", "يمكن طلب مراجعة خبير بعد التقرير الآلي."],
    inputs_ar: ["المخطوط كاملًا", "المراجع", "معلومات الدراسة والمنهجية"],
    outputs_ar: ["تقرير التقييم البحثي المتقدم", "درجة الجاهزية البحثية", "قائمة بالمشكلات الكبرى والصغرى"],
  },
  {
    id: "P02", family: "review", exec: "human",
    name_ar: "التحكيم العلمي المتخصص", name_en: "Expert Scientific Review",
    desc_ar: "مراجعة بشرية من خبير متخصص في مجال البحث لتقييم الجودة العلمية والمنهجية والمساهمة والأخطاء التي قد يلاحظها المحكمون.",
    desc_en: "A human review by a subject-matter expert assessing scientific quality, methodology, contribution and the issues reviewers are likely to raise.",
    how_ar: ["تحدد المنصة تخصص البحث.", "تختار خبيرًا مناسبًا وفق التخصص والمنهجية.", "يستلم الخبير البحث وفق ضوابط السرية.", "يرفع تقرير التحكيم."],
    inputs_ar: ["البحث", "المجال والتخصص الدقيق", "أي تعليمات للمراجعة"],
    outputs_ar: ["تقرير تحكيم الخبير", "الملاحظات الكبرى والصغرى", "توصية الجاهزية للنشر"],
  },
  {
    id: "P03", family: "development", exec: "hybrid",
    name_ar: "تحليل الفجوة البحثية", name_en: "Research Gap Analysis",
    desc_ar: "تحليل الأدبيات والمراجع المتاحة لمساعدة الباحث على تحديد ما هو معروف وما لم تتم معالجته بصورة كافية، مع خريطة للفجوات.",
    desc_en: "Analysis of the available literature to show what is known and what remains under-addressed, producing a research gap map.",
    how_ar: ["يرفع الباحث البحث أو مراجعة الأدبيات.", "تُحلل الأدبيات والمراجع ضمن المصادر التي يدعمها النظام.", "يظهر تقرير للفجوات والموضوعات المرتبطة."],
    inputs_ar: ["مراجعة الأدبيات", "المراجع", "كلمات مفتاحية"],
    outputs_ar: ["خريطة الفجوات البحثية", "قائمة بالفجوات المحتملة", "اقتراحات لمواضع تعزيز المساهمة العلمية"],
  },
  {
    id: "P04", family: "development", exec: "hybrid",
    name_ar: "تقييم مراجعة الأدبيات", name_en: "Literature Review Assessment",
    desc_ar: "فحص مدى تغطية الأدبيات وملاءمتها وحداثتها وجودة المصادر وترابطها مع مشكلة البحث، مع تنبيهات للأدبيات الناقصة.",
    desc_en: "Assessment of literature coverage, relevance, recency, source quality and alignment with the research problem, with missing-literature alerts.",
    how_ar: ["يرفع الباحث فصل الأدبيات أو البحث كاملًا.", "تحلل المراجع والاقتباسات.", "تظهر الفجوات ومواطن التحسين."],
    inputs_ar: ["مراجعة الأدبيات", "قائمة المراجع"],
    outputs_ar: ["تقييم تغطية الأدبيات", "تنبيهات الأدبيات الناقصة", "ملاحظات على البناء النظري"],
  },
  {
    id: "P05", family: "development", exec: "human",
    name_ar: "التحليل الإحصائي وتحليل البيانات", name_en: "Statistical & Data Analysis Support",
    desc_ar: "مساعدة في اختيار أو مراجعة التحليل الإحصائي وتحويل البيانات إلى جداول وأشكال وصياغة نتائج جاهزة للنشر.",
    desc_en: "Help choosing or reviewing the statistical analysis and turning data into publication-ready tables, figures and results.",
    how_ar: ["يرفع الباحث البيانات والبحث.", "يحدد هدف التحليل.", "يتم تنفيذ التحليل أو مراجعته.", "تظهر النتائج والجداول والتفسيرات."],
    inputs_ar: ["مجموعة البيانات", "وصف المتغيرات", "البحث أو المنهجية", "التحليل السابق إن وجد"],
    outputs_ar: ["التحليل الإحصائي", "جداول وأشكال جاهزة للنشر", "تفسير النتائج", "ملاحظات منهجية"],
  },
  {
    id: "P06", family: "journal", exec: "hybrid",
    name_ar: "اختيار المجلة المناسبة", name_en: "Journal Matching",
    desc_ar: "مطابقة البحث مع المجلات المحتملة وفق الموضوع ونطاق المجلة وجودتها وأهداف الباحث، مع قائمة بدائل ودرجة ملاءمة.",
    desc_en: "Matching the paper with candidate journals by topic, scope, quality and the author's goals, with alternatives and a fit score.",
    how_ar: ["يرفع الباحث المخطوط أو الملخص.", "يحدد هدف النشر.", "تحلل المنصة ملاءمة المجلات.", "تظهر قائمة مرتبة بالمجلات."],
    inputs_ar: ["الملخص أو المخطوط", "التخصص", "هدف النشر", "قيود التكلفة أو الوصول المفتوح إن وجدت"],
    outputs_ar: ["أفضل مطابقة", "مجلات بديلة", "درجة الملاءمة", "مقارنة بين المجلات"],
  },
  {
    id: "P07", family: "journal", exec: "ai",
    name_ar: "فحص توافق البحث مع المجلة", name_en: "Journal Compliance Check",
    desc_ar: "التأكد من توافق المخطوط مع تعليمات المجلة المستهدفة قبل الإرسال، مع تقرير بالفجوات والتعديلات المطلوبة.",
    desc_en: "Checking that the manuscript follows the target journal's instructions before submission, with a gap report and required edits.",
    how_ar: ["يحدد الباحث المجلة.", "تقرأ المنصة متطلبات المجلة المعتمدة في قاعدة البيانات.", "يقارن النظام المخطوط مع المتطلبات.", "يظهر تقرير بالفجوات."],
    inputs_ar: ["المخطوط", "اسم المجلة أو رابطها"],
    outputs_ar: ["درجة التوافق مع المجلة", "قائمة تحقق", "قائمة بالتعديلات المطلوبة"],
  },
  {
    id: "P08", family: "journal", exec: "human",
    name_ar: "تنسيق المخطوط حسب المجلة", name_en: "Manuscript Formatting",
    desc_ar: "إعادة تنسيق البحث بما يتوافق مع تعليمات المجلة من حيث العناوين والجداول والأشكال والمراجع وبنية الملف.",
    desc_en: "Reformatting the paper to the journal's instructions — headings, tables, figures, references and file structure.",
    how_ar: ["يحدد الباحث المجلة.", "يرفع المخطوط.", "تطبَّق متطلبات المجلة.", "يستلم النسخة المنسقة."],
    inputs_ar: ["المخطوط", "اسم المجلة", "الملفات المساندة"],
    outputs_ar: ["مخطوط جاهز للمجلة", "تنسيق الجداول والأشكال حسب المتطلبات"],
  },
  {
    id: "P09", family: "journal", exec: "hybrid",
    name_ar: "خطاب التغطية للمجلة", name_en: "Journal Cover Letter",
    desc_ar: "إعداد أو مراجعة خطاب تغطية يوضح مساهمة البحث وملاءمته للمجلة، بمسودة يراجعها الباحث ويعتمدها.",
    desc_en: "Drafting or reviewing a cover letter that states the paper's contribution and fit for the journal, for the author to review and approve.",
    how_ar: ["يحدد الباحث المجلة.", "تُرفع نسخة البحث.", "يتم إنشاء مسودة.", "يراجعها الباحث ويعتمدها."],
    inputs_ar: ["المخطوط", "المجلة", "المساهمة البحثية"],
    outputs_ar: ["مسودة خطاب التغطية", "نسخة قابلة للتعديل"],
  },
  {
    id: "P10", family: "journal", exec: "workflow",
    name_ar: "جاهزية الإرسال", name_en: "Submission Readiness",
    desc_ar: "تجميع نتائج فحوص اللغة والمنهجية والمراجع والمجلة في درجة واحدة توضح ما إذا كان البحث جاهزًا للإرسال، مع قائمة أخيرة قبله.",
    desc_en: "Combining the language, methodology, references and journal checks into one readiness score and a final pre-submission checklist.",
    how_ar: ["تشغّل المنصة فحوص اللغة والمنهجية والمراجع والمجلة.", "تحسب الدرجة.", "تظهر قائمة أخيرة قبل الإرسال."],
    inputs_ar: ["المخطوط", "المجلة", "نتائج الخدمات السابقة إن وجدت"],
    outputs_ar: ["درجة جاهزية الإرسال", "قائمة التحقق النهائية", "المشكلات المانعة للإرسال"],
  },
  {
    id: "P11", family: "journal", exec: "workflow",
    name_ar: "دعم تجهيز الإرسال", name_en: "Submission Support",
    desc_ar: "مساعدة الباحث في تجهيز الملفات والمعلومات والبيانات المطلوبة لعملية الإرسال، مع التحقق من اكتمال الحزمة.",
    desc_en: "Helping the author assemble the files, information and data required for submission, and verifying the package is complete.",
    how_ar: ["يحدد الباحث المجلة.", "يتبع قائمة التحقق.", "يرفع الملفات.", "تتحقق المنصة من اكتمال الحزمة."],
    inputs_ar: ["المخطوط", "خطاب التغطية", "الأشكال والجداول", "معلومات المؤلفين"],
    outputs_ar: ["حزمة الإرسال", "قائمة تحقق", "تنبيه بالعناصر الناقصة"],
  },
  {
    id: "P12", family: "revision", exec: "hybrid",
    name_ar: "تحليل ملاحظات المحكمين", name_en: "Reviewer Comment Analysis",
    desc_ar: "تنظيم تعليقات المحكمين وتحويلها إلى مهام تعديل واضحة، مع ربط كل تعليق بالجزء المتأثر في البحث.",
    desc_en: "Organising reviewer comments into clear revision tasks, linking each comment to the affected part of the paper.",
    how_ar: ["يرفع الباحث تعليقات المحكمين.", "تحلَّل التعليقات وتُجمع حسب الموضوع.", "يُربط كل تعليق بالجزء المتأثر في البحث."],
    inputs_ar: ["تعليقات المحكمين", "خطاب المحرر", "المخطوط الحالي"],
    outputs_ar: ["مصفوفة تعليقات المحكمين", "تصنيف كبرى/صغرى", "مهام التعديل"],
  },
  {
    id: "P13", family: "revision", exec: "hybrid",
    name_ar: "خطاب الرد على المحكمين", name_en: "Response Letter",
    desc_ar: "إعداد ومراجعة خطاب منظم يرد على كل تعليق من المحكمين باحترام ووضوح ويبين التعديل الذي تم، نقطة بنقطة.",
    desc_en: "Preparing and reviewing a structured, point-by-point letter that answers every reviewer comment and shows the change made.",
    how_ar: ["يرفع الباحث تعليقات المحكمين والنسخة المعدلة.", "تولّد المنصة هيكل الرد.", "يراجع الخبير المحتوى العلمي عند طلب الخدمة الاحترافية.", "يستلم الباحث النسخة النهائية."],
    inputs_ar: ["تعليقات المحكمين", "خطاب المحرر", "المخطوط المعدل"],
    outputs_ar: ["الرد على المحكمين", "رد نقطة بنقطة", "خريطة التعديلات"],
  },
  {
    id: "P14", family: "revision", exec: "workflow",
    name_ar: "إدارة المراجعات والإصدارات", name_en: "Revision Management",
    desc_ar: "إدارة النسخ المختلفة من المخطوط وتعليقات المحكمين وخطاب الرد ضمن مسار واحد مع سجل للتغييرات.",
    desc_en: "Managing manuscript versions, reviewer comments and response letters in one track with a change history.",
    how_ar: ["تُحفظ النسخة الأصلية.", "تُضاف ملاحظات المحكمين.", "تُنشأ نسخة Revision 1 ثم Revision 2 عند الحاجة.", "يظهر سجل للتغييرات."],
    inputs_ar: ["المخطوطات", "تعليقات المحكمين", "خطابات الرد"],
    outputs_ar: ["سجل الإصدارات", "متتبع المراجعات", "لوحة الحالة"],
  },
  {
    id: "P15", family: "revision", exec: "hybrid",
    name_ar: "دعم إعادة الإرسال", name_en: "Resubmission Support",
    desc_ar: "إعادة تشغيل فحوص الجودة والامتثال واللغة والردود بعد التعديلات وقبل إعادة إرسال البحث، مع تقرير جاهزية جديد.",
    desc_en: "Re-running the quality, compliance, language and response checks after revisions and before resubmission, with a new readiness report.",
    how_ar: ["يرفع الباحث النسخة المعدلة.", "تُربط بملاحظات الجولة السابقة.", "تشغّل المنصة فحوصًا جديدة.", "يصدر تقرير جاهزية جديد."],
    inputs_ar: ["المخطوط المعدل", "تعليقات المحكمين السابقة", "خطاب الرد"],
    outputs_ar: ["درجة جاهزية إعادة الإرسال", "قائمة التحقق النهائية للتعديلات"],
  },

  // ───────── عضو هيئة التدريس والباحث (F) — إدارة البحث والنشر المتقدمة ─────────
  {
    id: "F01", family: "assessment", exec: "hybrid",
    name_ar: "التقييم البحثي الشامل", name_en: "Full Research Evaluation",
    desc_ar: "تقييم متكامل للمخطوط من منظور علمي ومنهجي ولغوي ونشري قبل استهداف مجلة محددة أو مجلة عالية التصنيف.",
    desc_en: "An integrated scientific, methodological, linguistic and publishing evaluation before targeting a specific or high-ranking journal.",
    how_ar: ["يرفع الباحث المخطوط والبيانات المساندة.", "تحدد المنصة نوع التقييم المطلوب.", "ينفَّذ التقييم متعدد الخبرات."],
    inputs_ar: ["المخطوط كاملًا", "البيانات المساندة", "المجال المستهدف", "أهداف النشر"],
    outputs_ar: ["تقرير التقييم الشامل", "خريطة مخاطر النشر", "خطة التعديلات ذات الأولوية"],
  },
  {
    id: "F02", family: "review", exec: "human",
    name_ar: "تحكيم خبير متقدم", name_en: "Advanced Expert Peer Review",
    desc_ar: "مراجعة علمية متخصصة من خبير ذي خبرة مناسبة لمجال البحث ومنهجيته، مع توصية نشر.",
    desc_en: "A specialised scientific review by an expert matched to the paper's field and methodology, with a publication recommendation.",
    how_ar: ["تحدد المنصة مجال البحث.", "تطابق البحث مع خبير مناسب.", "يراجع الخبير البحث ويقدم التقرير."],
    inputs_ar: ["المخطوط", "التخصص", "المنهجية"],
    outputs_ar: ["تقرير تحكيم الخبير", "الملاحظات الكبرى والصغرى", "توصية النشر"],
  },
  {
    id: "F03", family: "editing", exec: "human",
    name_ar: "التحرير العلمي المتقدم", name_en: "Advanced Scientific Editing",
    desc_ar: "تحرير يتجاوز اللغة إلى بنية الحجة والمنطق العلمي وتصميم البحث ووضوح الفرضيات والنتائج والمناقشة.",
    desc_en: "Editing beyond language: argument structure, scientific logic, study design and the clarity of hypotheses, results and discussion.",
    how_ar: ["يرفع الباحث المخطوط.", "تُراجع احتياجاته.", "يحرر الخبير النص علميًا ولغويًا.", "يستلم الباحث النسخة المعدلة والتقرير."],
    inputs_ar: ["المخطوط", "سياق البحث", "المجلة المستهدفة إن وجدت"],
    outputs_ar: ["مخطوط محرر علميًا", "تعليق الخبير", "توصيات التعديل"],
  },
  {
    id: "F04", family: "journal", exec: "hybrid",
    name_ar: "استراتيجية النشر", name_en: "Publication Strategy",
    desc_ar: "بناء خطة نشر للبحث تتضمن المجلة المستهدفة ومستوى الطموح والمخاطر والبدائل والجدول الزمني.",
    desc_en: "Building a publication plan covering the target journal, ambition level, risks, alternatives and timeline.",
    how_ar: ["يحدد الباحث هدف النشر.", "تحلل المنصة البحث والمجلات.", "يتم بناء خطة نشر قابلة للتنفيذ."],
    inputs_ar: ["المخطوط", "أهداف النشر", "الميزانية أو تفضيلات الوصول"],
    outputs_ar: ["استراتيجية النشر", "المجلة المستهدفة", "مجلات بديلة", "جدول زمني"],
  },
  {
    id: "F05", family: "journal", exec: "hybrid",
    name_ar: "محفظة المجلات", name_en: "Journal Portfolio",
    desc_ar: "بدل اختيار مجلة واحدة، مجموعة مجلات مرتبة حسب الملاءمة والطموح والمخاطر بمستويات ومقارنة بين البدائل.",
    desc_en: "Instead of one journal, a tiered set of journals ranked by fit, ambition and risk, with a comparison matrix.",
    how_ar: ["يتم تحليل البحث.", "تصنَّف المجلات إلى مستويات.", "تُعرض مقارنة بين البدائل."],
    inputs_ar: ["المخطوط أو الملخص", "المجال", "أهداف النشر"],
    outputs_ar: ["مجلات المستوى الأول", "مجلات المستوى الثاني", "بدائل أقل مخاطرة", "مصفوفة مقارنة"],
  },
  {
    id: "F06", family: "journal", exec: "workflow",
    name_ar: "التحقق من بيانات المجلة", name_en: "Journal Selection & Verification",
    desc_ar: "فحص معلومات المجلة قبل اعتمادها: الفهرسة والناشر والنطاق ومتطلبات الإرسال والوصول المفتوح والرسوم — مع تاريخ آخر تحقق.",
    desc_en: "Verifying a journal before relying on it: indexing, publisher, scope, submission requirements, open access and fees — dated to the last check.",
    how_ar: ["يحدد الباحث المجلة.", "تسحب المنصة البيانات من مصادر موثوقة ومحدثة.", "يظهر سجل تحقق بتاريخ آخر تحديث."],
    inputs_ar: ["اسم المجلة أو ISSN"],
    outputs_ar: ["بطاقة التحقق من المجلة", "معلومات الفهرسة والناشر", "تاريخ آخر تحديث", "علامات التحقق"],
  },
  {
    id: "F07", family: "revision", exec: "hybrid",
    name_ar: "إدارة مراسلات النشر", name_en: "Publication Correspondence",
    desc_ar: "تنظيم مراسلات الباحث مع المجلة والمحرر والمحكمين ضمن ملف البحث نفسه، مع مسودات ردود قابلة للمراجعة.",
    desc_en: "Organising the author's correspondence with the journal, editor and reviewers inside the paper's file, with reviewable draft replies.",
    how_ar: ["يربط الباحث مراسلات النشر بالبحث وفق الإمكانات التقنية المتاحة.", "تُحفظ الرسائل والقرارات.", "تنشئ المنصة مسودات الردود عند الحاجة."],
    inputs_ar: ["رسائل التحرير", "خطابات القرار", "تعليقات المحكمين"],
    outputs_ar: ["الخط الزمني للمراسلات", "مسودات الردود", "بنود العمل"],
  },
  {
    id: "F08", family: "revision", exec: "hybrid",
    name_ar: "تحليل الرفض", name_en: "Rejection Analysis",
    desc_ar: "تحليل أسباب الرفض وتحديد ما إذا كانت مرتبطة بالملاءمة أو الجودة أو المنهجية أو العرض أو تعليمات المجلة، مع مسار تحسين.",
    desc_en: "Analysing why a paper was rejected — fit, quality, methodology, presentation or journal instructions — and proposing an improvement path.",
    how_ar: ["يرفع الباحث قرار الرفض وتعليقات المحكمين.", "تحلل المنصة الأسباب.", "تربط الأسباب بالبحث.", "تقترح مسار التحسين."],
    inputs_ar: ["خطاب الرفض", "تعليقات المحكمين", "المخطوط المرسل"],
    outputs_ar: ["تقرير تحليل الرفض", "الأسباب الجذرية", "أولويات التعديل"],
  },
  {
    id: "F09", family: "revision", exec: "hybrid",
    name_ar: "استراتيجية إعادة الإرسال", name_en: "Resubmission Strategy",
    desc_ar: "تحويل الرفض أو طلب التعديلات إلى خطة إعادة إرسال تشمل تعديل البحث واختيار مجلة بديلة وتجهيز النسخة الجديدة.",
    desc_en: "Turning a rejection or revision request into a resubmission plan: revising the paper, choosing an alternative journal and preparing the new version.",
    how_ar: ["تحلل المنصة سبب الرفض.", "تُراجع قائمة المجلات البديلة.", "ينفّذ الباحث التعديلات.", "تُطبَّق فحوص الجاهزية من جديد."],
    inputs_ar: ["خطاب الرفض أو القرار", "تعليقات المحكمين", "المخطوط"],
    outputs_ar: ["خطة إعادة الإرسال", "محفظة مجلات جديدة", "قائمة تحقق التعديلات"],
  },
  {
    id: "F10", family: "post", exec: "hybrid",
    name_ar: "الترويج العلمي بعد النشر", name_en: "Research Promotion",
    desc_ar: "تحويل البحث المنشور إلى مواد تعريفية تعرض أثره بصورة واضحة وأكاديمية: أبرز النتائج، ملخص مبسّط، وملخص بياني عند الطلب.",
    desc_en: "Turning a published paper into clear, academic outreach material: research highlights, a plain-language summary and a graphical abstract on request.",
    how_ar: ["يربط الباحث البحث المنشور.", "تستخرج المنصة أهم الرسائل.", "يتم إنشاء مواد ترويجية وفق القنوات المطلوبة."],
    inputs_ar: ["المقال المنشور", "أبرز النتائج", "الأشكال"],
    outputs_ar: ["أبرز النتائج البحثية", "ملخص بلغة مبسّطة", "ملخص بياني عند طلبه"],
  },
  {
    id: "F11", family: "post", exec: "workflow",
    name_ar: "ملف الباحث البحثي", name_en: "Researcher Publication Profile",
    desc_ar: "لوحة شخصية تجمع رحلة الأبحاث والمنشورات وحالاتها ومؤشرات النشر والخدمات المستخدمة في خط زمني واحد.",
    desc_en: "A personal dashboard bringing together the researcher's papers, publications, statuses, publishing indicators and services in one timeline.",
    how_ar: ["تنشئ المنصة ملف الباحث.", "تربط الأبحاث والمخطوطات والخدمات.", "تظهر حالة كل بحث في خط زمني."],
    inputs_ar: ["ملف الباحث", "المخطوطات", "المنشورات"],
    outputs_ar: ["لوحة الباحث", "محفظة المنشورات", "حالة المخطوطات"],
  },
  {
    id: "F12", family: "post", exec: "workflow",
    name_ar: "مسار النشر الكامل", name_en: "End-to-End Publication Pipeline",
    desc_ar: "واجهة واحدة لإدارة البحث من المسودة حتى النشر وما بعده: تتفعّل الخدمات حسب المرحلة، وتنتقل الحالة تلقائيًا مع تنبيهات ومهام.",
    desc_en: "One interface to manage a paper from draft to publication and beyond: services activate by stage, status moves automatically, with alerts and tasks.",
    how_ar: ["ينشئ الباحث مشروع بحث.", "تتفعّل الخدمات حسب مرحلة البحث.", "تنتقل الحالة تلقائيًا بين مراحل الرحلة.", "يحصل الباحث على تنبيهات ومهام."],
    inputs_ar: ["مشروع البحث", "المخطوطات", "بيانات المحكمين والمجلة"],
    outputs_ar: ["مسار النشر", "حالة كل مرحلة", "المهام", "التنبيهات", "سجل البحث"],
  },
];

export const getServiceById = (id) =>
  SERVICES_CATALOGUE.find((s) => s.id === id);

export const getServicesByFamily = (familyKey) =>
  SERVICES_CATALOGUE.filter((s) => s.family === familyKey);

export const getServiceLevel = (service) => SERVICE_LEVELS[service.id.charAt(0)];
