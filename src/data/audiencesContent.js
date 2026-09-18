// =========================================================
// محتوى الصفحات الداخلية للفئات المستفيدة (/audience/:key) — مبني على
// المقترح (سيبال) ودليل خدمات الباحثين ومواصفة طبقة الوزارة.
//
// ثلاثة تصاميم مختلفة حسب المجموعة (group):
//   journey      → مراحل الباحث (undergrad / grad / faculty): رحلة + خدمات الكتالوج
//   quality      → المؤسسات (university / college / research_center): مساران + مؤشرات
//   intelligence → الوزارة (ministry): المساحات الأربع + رحلة القرار
//
// النصوص عربي/إنجليزي بالمفتاح نفسه مع لاحقة _ar / _en.
// =========================================================

export const AUDIENCE_GROUP = {
  undergrad: "journey",
  grad: "journey",
  faculty: "journey",
  university: "quality",
  college: "quality",
  research_center: "quality",
  ministry: "intelligence",
};

// ── المستويات الثلاثة للتمكين (المقترح: القدرة / الخبرة / الفرص) ──
const LEVEL_LABELS = {
  capability: { ar: "القدرة", en: "Capability" },
  expertise: { ar: "الخبرة", en: "Expertise" },
  opportunity: { ar: "الفرص", en: "Opportunity" },
};

export const AUDIENCES = {
  // ───────────────────────── مراحل الباحث ─────────────────────────
  undergrad: {
    level: "U",
    image: "/Home/home04.png",
    next: "grad",
    kicker_ar: "المرحلة الأولى — الجاهزية البحثية والفحص المبكر",
    kicker_en: "Stage one — Research readiness & early screening",
    title_pre_ar: "ابدأ بحثك ", title_em_ar: "على أساس صحيح", title_post_ar: ".",
    title_pre_en: "Start your research ", title_em_en: "on solid ground", title_post_en: ".",
    intro_ar: "خدمات وقائية وتعليمية ترفع جاهزيتك البحثية قبل أن تستثمر وقتًا إضافيًا: تقييم مبكر للموضوع والمنهجية والمراجع واللغة — بلا أحكام أكاديمية نهائية؛ القرار يبقى لك ولمشرفك.",
    intro_en: "Preventive, educational services that raise your research readiness before you invest more time: an early assessment of topic, methodology, references and language — with no final academic verdicts; the decision stays with you and your supervisor.",
    levels: [
      { key: "capability", desc_ar: "نشرات ومواد تدريبية تشرح خطوات النشر العلمي كمراحل متتابعة، وتطوير الفكرة البحثية وتحليل جدواها قبل البدء.", desc_en: "Guides and training materials that explain publication as a sequence of steps, plus idea development and feasibility analysis before you begin." },
      { key: "expertise", desc_ar: "تقييم أولي للموضوع والمنهجية، وفحص الاقتباس والتشابه، وتدقيق لغوي وترجمة أكاديمية تحافظ على المصطلحات.", desc_en: "A first assessment of topic and methodology, citation and similarity screening, and academic language editing and translation that preserve terminology." },
      { key: "opportunity", desc_ar: "ملف بحثي يبدأ معك من الآن، وتواصل منظم مع المشرف، وانتقال طبيعي إلى خدمات الدراسات العليا لاحقًا.", desc_en: "A research profile that starts with you now, structured contact with your supervisor, and a natural transition to postgraduate services later." },
    ],
    steps: [
      { title_ar: "وضوح الموضوع", title_en: "Topic clarity", desc_ar: "تقييم الموضوع وقابلية التطبيق قبل أي التزام.", desc_en: "Topic and applicability assessment before any commitment.", ids: ["U05", "U06"] },
      { title_ar: "اتساق المنهجية", title_en: "Methodology fit", desc_ar: "مشكلة البحث وأهدافه وأسئلته وأدواته معًا.", desc_en: "Problem, objectives, questions and instruments — together.", ids: ["U04"] },
      { title_ar: "التقييم الأولي", title_en: "First assessment", desc_ar: "درجة جاهزية بحثية بدرجات فرعية وأولويات تحسين.", desc_en: "A readiness score with sub-scores and improvement priorities.", ids: ["U01"] },
      { title_ar: "النزاهة والوضوح", title_en: "Integrity & clarity", desc_ar: "فحص الاقتباس ومؤشر المحتوى الآلي، ثم اللغة والترجمة.", desc_en: "Citation screening and the AI content indicator, then language and translation.", ids: ["U02", "U03", "U08", "U07"] },
    ],
    quote_ar: "هذه الخدمات مصممة لتكون وقائية وتعليمية. الهدف هو رفع جاهزية الطالب البحثية، وليس إصدار أحكام أكاديمية نهائية.",
    quote_en: "These services are designed to be preventive and educational. The goal is to raise the student's research readiness — not to issue final academic verdicts.",
    quote_source_ar: "دليل خدمات الباحثين — خدمات طالب البكالوريوس",
    quote_source_en: "Researcher Services Catalogue — Undergraduate services",
  },

  grad: {
    level: "P",
    image: "/Home/home03.jpg",
    next: "faculty",
    kicker_ar: "المرحلة الثانية — تطوير البحث ودعم النشر",
    kicker_en: "Stage two — Research development & publication support",
    title_pre_ar: "من رسالتك ", title_em_ar: "إلى ورقة منشورة", title_post_ar: ".",
    title_pre_en: "From your thesis ", title_em_en: "to a published paper", title_post_en: ".",
    intro_ar: "خدمات بحث ونشر متقدمة: تقييم متعدد المحاور، تحكيم متخصص، تحليل الفجوة البحثية، اختيار المجلة وفحص التوافق معها، وإدارة المراجعات والرد على المحكمين — كل ذلك مرتبط بملف بحث واحد.",
    intro_en: "Advanced research and publication services: multi-axis assessment, expert review, research gap analysis, journal matching and compliance checks, and revision management with responses to reviewers — all tied to one research file.",
    levels: [
      { key: "capability", desc_ar: "مواءمة فكرتك مع الأولويات الوطنية والمؤسسية، وتحليل الفجوة البحثية ومراجعة الأدبيات لتحديد ما لم يُعالَج بعد.", desc_en: "Aligning your idea with national and institutional priorities, analysing the research gap and the literature to find what remains unaddressed." },
      { key: "expertise", desc_ar: "تحكيم علمي متخصص من خبير في مجالك، وتحليل إحصائي بإشراف خبير، وتقييم متقدم يتجاوز اللغة إلى المساهمة العلمية.", desc_en: "Expert scientific review in your field, statistician-supervised analysis, and an advanced assessment that goes beyond language to scientific contribution." },
      { key: "opportunity", desc_ar: "مطابقة المجلات ودرجة الملاءمة، جاهزية الإرسال بدرجة واحدة، وتشبيك مع باحثين وفرق بحثية في تخصصك.", desc_en: "Journal matching with a fit score, a single submission-readiness score, and networking with researchers and teams in your field." },
    ],
    steps: [
      { title_ar: "الفجوة والأدبيات", title_en: "Gap & literature", desc_ar: "خريطة الفجوات وتقييم تغطية الأدبيات.", desc_en: "A gap map and a literature coverage assessment.", ids: ["P03", "P04"] },
      { title_ar: "التقييم والتحكيم", title_en: "Assessment & review", desc_ar: "تقييم متقدم ثم تحكيم بشري متخصص وتحليل إحصائي.", desc_en: "Advanced assessment, then expert human review and statistical support.", ids: ["P01", "P02", "P05"] },
      { title_ar: "المجلة والإرسال", title_en: "Journal & submission", desc_ar: "اختيار المجلة، التوافق، التنسيق، خطاب التغطية، الجاهزية.", desc_en: "Journal matching, compliance, formatting, cover letter, readiness.", ids: ["P06", "P07", "P08", "P09", "P10", "P11"] },
      { title_ar: "المراجعات والرد", title_en: "Revisions & response", desc_ar: "تحليل ملاحظات المحكمين، خطاب الرد، الإصدارات، إعادة الإرسال.", desc_en: "Reviewer comment analysis, response letter, versions, resubmission.", ids: ["P12", "P13", "P14", "P15"] },
    ],
    quote_ar: "كل خدمة يجب أن ترتبط بالمرحلة التي يمر بها الباحث وبملف البحث نفسه — فتتحول الخدمات من عمليات منفصلة إلى مسار نشر قابل للقياس والتتبع.",
    quote_en: "Every service must be tied to the researcher's stage and to the research file itself — turning separate tasks into a measurable, trackable publication workflow.",
    quote_source_ar: "دليل خدمات الباحثين — الخلاصة التنفيذية",
    quote_source_en: "Researcher Services Catalogue — Executive summary",
  },

  faculty: {
    level: "F",
    image: "/Home/04.jpg",
    next: null,
    kicker_ar: "المرحلة الثالثة — إدارة البحث والنشر المتقدمة",
    kicker_en: "Stage three — Advanced research & publication management",
    title_pre_ar: "أدر دورة النشر كاملة، ", title_em_ar: "من المسودة إلى ما بعد النشر", title_post_ar: ".",
    title_pre_en: "Run the whole publication cycle, ", title_em_en: "from draft to post-publication", title_post_en: ".",
    intro_ar: "خدمات احترافية متكاملة لمن يستهدف النشر الدولي: تقييم شامل، تحكيم خبير متقدم، استراتيجية نشر ومحفظة مجلات، تحليل الرفض وإعادة الإرسال، والترويج العلمي بعد النشر — مع ملف بحثي يجمع رحلتك كلها ويغذي مؤشرات جامعتك.",
    intro_en: "Integrated professional services for researchers targeting international publication: full evaluation, advanced expert review, publication strategy and journal portfolio, rejection analysis and resubmission, and post-publication promotion — with a research profile that gathers your whole journey and feeds your university's indicators.",
    levels: [
      { key: "capability", desc_ar: "استراتيجية نشر بمستوى طموح واضح ومخاطر وبدائل وجدول زمني، ومحفظة مجلات بمستويات بدل مجلة واحدة.", desc_en: "A publication strategy with a clear ambition level, risks, alternatives and timeline, and a tiered journal portfolio instead of a single journal." },
      { key: "expertise", desc_ar: "تحرير علمي متقدم يتناول بنية الحجة والمنطق العلمي، وتحكيم خبير، وتحليل جذري لأسباب الرفض.", desc_en: "Advanced scientific editing of argument structure and logic, expert peer review, and root-cause analysis of rejections." },
      { key: "opportunity", desc_ar: "ترويج علمي بعد النشر، إدارة مراسلات النشر في ملف واحد، ومسار نشر كامل تتفعّل خدماته حسب المرحلة.", desc_en: "Post-publication promotion, publication correspondence managed in one file, and an end-to-end pipeline whose services activate by stage." },
    ],
    steps: [
      { title_ar: "التقييم الشامل", title_en: "Full evaluation", desc_ar: "منظور علمي ومنهجي ولغوي ونشري قبل استهداف المجلة.", desc_en: "Scientific, methodological, linguistic and publishing lenses before targeting a journal.", ids: ["F01"] },
      { title_ar: "الاستراتيجية والمحفظة", title_en: "Strategy & portfolio", desc_ar: "خطة نشر، مجلات بمستويات، وتحقق مؤرخ من كل مجلة.", desc_en: "A publication plan, tiered journals and a dated verification of each.", ids: ["F04", "F05", "F06"] },
      { title_ar: "التحكيم والتحرير", title_en: "Review & editing", desc_ar: "تحكيم خبير متقدم وتحرير علمي يتجاوز اللغة.", desc_en: "Advanced expert review and scientific editing beyond language.", ids: ["F02", "F03"] },
      { title_ar: "الرفض وإعادة الإرسال", title_en: "Rejection & resubmission", desc_ar: "تحليل الأسباب الجذرية وخطة إعادة إرسال ومراسلات منظمة.", desc_en: "Root causes, a resubmission plan and organised correspondence.", ids: ["F07", "F08", "F09"] },
      { title_ar: "ما بعد النشر", title_en: "After publication", desc_ar: "ترويج علمي، ملف باحث، ومسار نشر كامل.", desc_en: "Research promotion, a researcher profile and the full pipeline.", ids: ["F10", "F11", "F12"] },
    ],
    quote_ar: "الطبقة الأولى في سورس يجب أن تظهر للمستخدم كرحلة بحثية متدرجة وليست كقائمة خدمات منفصلة.",
    quote_en: "SOURCE's first layer must appear to the user as a staged research journey, not as a list of separate services.",
    quote_source_ar: "دليل خدمات الباحثين — الخلاصة التنفيذية",
    quote_source_en: "Researcher Services Catalogue — Executive summary",
  },

  // ───────────────────────── المؤسسات ─────────────────────────
  university: {
    image: "/Home/home05.jpg",
    kicker_ar: "الجامعات — الجودة والاعتماد والتصنيفات",
    kicker_en: "Universities — Quality, accreditation & rankings",
    title_pre_ar: "إدارة التميز البحثي ", title_em_ar: "كوظيفة مؤسسية", title_post_ar: ".",
    title_pre_en: "Research excellence ", title_em_en: "as an institutional function", title_post_en: ".",
    intro_ar: "بيئة واحدة تربط الملف البحثي للجامعة بالاعتماد المحلي والتصنيفات الدولية: لوحات أداء للجامعة والكلية والقسم والباحث، أدلة موثقة، وخطط تحسين مرتبطة بالمؤشرات — منسجمة مع الأولويات الوطنية التي حددتها الوزارة.",
    intro_en: "One environment linking the university's research profile to national accreditation and international rankings: performance dashboards by university, college, department and researcher, documented evidence, and improvement plans tied to indicators — aligned with the national priorities set by the Ministry.",
    focus_ar: ["لوحة بحثية شاملة لكل الكليات والباحثين والإنتاج المنشور", "ملف بحثي مؤسسي وسجلات موثقة للإنتاج العلمي", "خطط تحسين مبنية على بيانات فعلية لا على التخمين", "تقارير جاهزة للقيادة ولمكاتب البحث العلمي"],
    focus_en: ["A comprehensive research dashboard for every college, researcher and published output", "An institutional research profile with documented output records", "Improvement plans built on real data, not guesswork", "Reports ready for leadership and research offices"],
  },
  college: {
    image: "/Home/home04.png",
    kicker_ar: "الكليات — الجودة والاعتماد والتصنيفات",
    kicker_en: "Colleges — Quality, accreditation & rankings",
    title_pre_ar: "كل قسم أكاديمي ", title_em_ar: "في الصورة", title_post_ar: ".",
    title_pre_en: "Every department ", title_em_en: "in the picture", title_post_en: ".",
    intro_ar: "تتابع الكلية الإنتاج البحثي لكل قسم أكاديمي، وتطابق أبحاثها بمعايير الاعتماد المحلي، وترفع تقارير أداء جاهزة إلى مستوى الجامعة — بلا إعادة إدخال للبيانات، لأن السجل البحثي الواحد يتدفق من الباحث إلى القسم إلى الكلية إلى الجامعة.",
    intro_en: "The college tracks each department's research output, matches its research to national accreditation standards, and escalates ready performance reports to the university — with no re-entry of data, because the single research record flows from researcher to department to college to university.",
    focus_ar: ["متابعة الإنتاج البحثي لكل قسم أكاديمي بالكلية", "تقارير أداء جاهزة للتصعيد مباشرة لمستوى الجامعة", "مطابقة الأبحاث بمعايير الاعتماد المحلي", "إدارة طلبات أعضاء هيئة التدريس والطلبة من مكان واحد"],
    focus_en: ["Research output tracking for every academic department", "Performance reports ready to escalate to the university", "Matching research to national accreditation standards", "Faculty and student requests managed in one place"],
  },
  research_center: {
    image: "/Home/home01.jpg",
    kicker_ar: "المراكز البحثية — المشاريع والشراكات والتمويل",
    kicker_en: "Research centres — Projects, partnerships & funding",
    title_pre_ar: "وثّق مخرجاتك، ", title_em_ar: "وابنِ شراكاتك", title_post_ar: ".",
    title_pre_en: "Document your outputs, ", title_em_en: "build your partnerships", title_post_en: ".",
    intro_ar: "يوثّق المركز مشاريعه ومخرجاته وبنيته التحتية في سجل منظم، ويظهر في شبكة الشراكات الوطنية والإقليمية، ويتلقى فرص التمويل المطابقة لمجالاته — فيصبح جزءًا من الصورة الوطنية للبحث لا جزيرة منفصلة.",
    intro_en: "The centre documents its projects, outputs and infrastructure in a structured record, appears in the national and regional partnership network, and receives funding opportunities matched to its fields — becoming part of the national research picture rather than an isolated island.",
    focus_ar: ["توثيق المشاريع والمخرجات والمختبرات والأجهزة بشكل منظم", "الظهور في محرك مطابقة الشراكات وفق التخصص والبنية التحتية", "تنبيهات بفرص التمويل المطابقة لمجالات المركز", "نشر النتائج ومطابقتها بمجلات متخصصة مناسبة"],
    focus_en: ["Structured documentation of projects, outputs, labs and equipment", "Visibility in the partnership matching engine by field and infrastructure", "Alerts for funding opportunities matched to the centre's fields", "Publishing results and matching them to suitable specialised journals"],
  },

  // ───────────────────────── الوزارة ─────────────────────────
  ministry: {
    image: "/Home/home01.jpg",
    kicker_ar: "الوزارة — لوحات الوزارة والذكاء البحثي الوطني",
    kicker_en: "Ministry — Ministry dashboards & national research intelligence",
    title_pre_ar: "ليست شاشة تقارير — ", title_em_ar: "طبقة ذكاء بحثي وطني", title_post_ar: ".",
    title_pre_en: "Not a reporting screen — ", title_em_en: "a national research intelligence layer", title_post_en: ".",
    intro_ar: "تعمل فوق بيانات الجامعات المصرّح بمشاركتها، وتربطها ببيانات مؤسسات الدولة والفرص والشراكات، لتنقل الوزارة من «عرض الأرقام» إلى «فهم الواقع ثم اختيار التدخل» — بحوكمة وصلاحيات واضحة، وكل رقم يعود إلى مصدره.",
    intro_en: "It runs on the data universities authorise for sharing, links it to state institutions' data, opportunities and partnerships, and moves the Ministry from “showing numbers” to “understanding reality, then choosing the intervention” — with clear governance and permissions, and every figure traceable to its source.",
  },
};

// ── المسارات والمؤشرات المشتركة لصفحات المؤسسات (المقترح، المكون الثاني) ──
export const QUALITY_TRACKS = [
  {
    number: "01",
    title_ar: "الجودة والاعتماد المحلي", title_en: "National quality & accreditation",
    desc_ar: "وفق الأطر والمعايير المعتمدة، وضمن اختصاص المركز الوطني لضمان جودة واعتماد المؤسسات التعليمية والتدريبية.",
    desc_en: "Under the approved frameworks and standards, within the remit of the National Centre for Quality Assurance and Accreditation of Educational and Training Institutions.",
    items_ar: ["ملف بحثي مؤسسي وسجلات موثقة للإنتاج العلمي", "مطابقة الأدلة بمعايير الاعتماد وكشف الناقص قبل التقديم", "تقارير امتثال جاهزة للمركز الوطني ولقيادة المؤسسة"],
    items_en: ["An institutional research profile with documented output records", "Evidence matched to accreditation standards, gaps flagged before submission", "Compliance reports ready for the national centre and institutional leadership"],
  },
  {
    number: "02",
    title_ar: "التصنيفات الدولية", title_en: "International rankings",
    desc_ar: "تصنيف QS العالمي، وتصنيف Times Higher Education للجامعات العربية، وتصنيف QS العربي — عبر مجموعة معايير كاملة تُعبّئها المؤسسة استنادًا إلى بيانات الأداء البحثي الفعلي.",
    desc_en: "QS World, Times Higher Education Arab and QS Arab rankings — through a complete set of criteria the institution completes from actual research performance data.",
    items_ar: ["مراقبة مؤشرات التصنيف وربطها بخطط التحسين", "تحليلات التعاون الدولي والتأليف المشترك", "لا يُعدّ النظام ولا يضمن مركزًا في التصنيف — بل يحسّن المؤشرات التي تصنعه"],
    items_en: ["Ranking indicators monitored and tied to improvement plans", "International collaboration and co-authorship analytics", "The system neither promises nor guarantees a ranking position — it improves the indicators behind it"],
  },
];

export const PERFORMANCE_AREAS = [
  { title_ar: "الإنتاج البحثي والجودة", title_en: "Research output & quality", desc_ar: "حجم النشر ونموه، جودة المجلات، تقييمات جودة البحث، الجاهزية للنشر.", desc_en: "Publication volume and growth, journal quality, research quality assessments, publication readiness." },
  { title_ar: "الأثر البحثي", title_en: "Research impact", desc_ar: "أداء الاستشهادات، مؤشرات الأثر المعيارية حيث تسمح البيانات المرخصة، الظهور والوصول.", desc_en: "Citation performance, normalised impact where licensed data allow, visibility and reach." },
  { title_ar: "الشراكات والتعاون الدولي", title_en: "Partnerships & international collaboration", desc_ar: "التأليف الدولي المشترك، الشراكات البحثية، مجموعات البحث العابرة للمؤسسات.", desc_en: "International co-authorship, research partnerships, cross-institutional research groups." },
  { title_ar: "التمويل وأداء المشاريع", title_en: "Funding & project performance", desc_ar: "المنح البحثية، المشاريع الممولة، معدلات الإنجاز، الاستثمار في المجالات ذات الأولوية.", desc_en: "Research grants, funded projects, completion rates, investment in priority fields." },
  { title_ar: "الابتكار ونقل المعرفة", title_en: "Innovation & knowledge transfer", desc_ar: "براءات الاختراع، نشاط الملكية الفكرية، البحث التطبيقي، المخرجات التجارية.", desc_en: "Patents, IP activity, applied research, commercial outputs." },
  { title_ar: "الأداء المؤسسي", title_en: "Institutional performance", desc_ar: "الأداء حسب الجامعة والكلية والقسم والمركز والباحث، وتقدم خطط التحسين.", desc_en: "Performance by university, college, department, centre and researcher, and improvement plan progress." },
];

export const DATA_FLOW = [
  { title_ar: "نواة البيانات البحثية", title_en: "Research Data Core", desc_ar: "تُجمع بيانات المؤسسة مرة واحدة في ملفها البحثي.", desc_en: "Institutional data is collected once in its research profile." },
  { title_ar: "التحقق المؤسسي", title_en: "Institutional validation", desc_ar: "تعتمد المؤسسة بياناتها وأدلتها قبل أي مشاركة.", desc_en: "The institution validates its data and evidence before any sharing." },
  { title_ar: "لقطة مؤسسية", title_en: "Institutional snapshot", desc_ar: "نسخة مؤرخة بإصدار ومصدر لكل فترة.", desc_en: "A dated, versioned snapshot with a source for every period." },
  { title_ar: "سياسة المشاركة الوطنية", title_en: "National sharing policy", desc_ar: "ما يُشارَك مع الوزارة يحدده تصنيف البيانات والصلاحيات.", desc_en: "What is shared with the Ministry is governed by data classification and permissions." },
  { title_ar: "لوحات الوزارة", title_en: "Ministry dashboards", desc_ar: "تصل البيانات المعتمدة عبر API أو مزامنة مضبوطة — لا إعادة إدخال يدوي.", desc_en: "Approved data arrives through APIs or controlled synchronisation — no manual re-entry." },
];

// ── المساحات الأربع لطبقة الوزارة (مواصفة الجزء الثالث) ──
export const MINISTRY_SPACES = [
  {
    number: "01", slug: "data-intelligence", mock: "kpi",
    title_ar: "البيانات والذكاء البحثي الوطني", title_en: "National research data & intelligence",
    question_ar: "ماذا يحدث في البحث العلمي على المستوى الوطني؟", question_en: "What is happening in scientific research nationally?",
    desc_ar: "قاعدة البيانات البحثية الوطنية وواجهة الذكاء الوطني: لوحة بفلاتر السنة والجامعة والمجال والجغرافيا والقطاع، ومقارنات جامعة مقابل المتوسط الوطني، ومنطقة مقابل منطقة، وتخصص مقابل تخصص، وتمويل مقابل مخرجات، وأولوية مقابل نشاط.",
    desc_en: "The national research database and intelligence interface: a dashboard filtered by year, university, field, geography and sector, with comparisons of university vs national average, region vs region, field vs field, funding vs output, and priority vs activity.",
    items_ar: ["مستشار بحثي ذكي (AI): محادثة بلغة طبيعية تحلّل أرقام البحث الوطني وتشرحها", "الباحثون والمنشورات والمشاريع والتمويل والتعاون والابتكار والبنية التحتية والقدرات والأثر", "تمييز صريح بين البيانات الخام والمتحقق منها والموحّدة والمؤشرات المشتقة ورؤى السياسة", "تنبيهات: فجوة حرجة، مجال صاعد، أولوية ناقصة التمويل، فرصة شراكة، نقص قدرات"],
    items_en: ["Smart research advisor (AI): a natural-language chat that analyses and explains national research figures", "Researchers, publications, projects, funding, collaboration, innovation, infrastructure, capacity and impact", "Explicit separation of raw, verified, normalised data, derived indicators and policy insights", "Alerts: critical gap, emerging field, underfunded priority, collaboration opportunity, capacity shortage"],
  },
  {
    number: "02", slug: "priorities", mock: "priorities",
    title_ar: "الأولويات البحثية الوطنية", title_en: "National research priorities",
    question_ar: "ما الذي تحتاج الدولة أن تبحث فيه، وأين الفجوات؟", question_en: "What does the country need to research, and where are the gaps?",
    desc_ar: "الذكاء الاصطناعي يقترح الأولويات من الفجوات بين احتياجات الدولة والإنتاج البحثي الفعلي، والوزارة تعتمد. الجسر العكسي بين الدولة والجامعات: من احتياجات الدولة إلى تحديات القطاعات إلى أولويات وموضوعات، ثم قياس تغطيتها بحثيًا وتحويل الفجوات إلى دعوات وتمويل وشراكات. القطاعات قابلة للتهيئة — لا أسماء ثابتة في الكود.",
    desc_en: "AI suggests priorities from the gaps between national needs and actual research output, and the Ministry approves. The reverse bridge from the state to universities: from national needs to sector challenges to priorities and topics, then measuring their research coverage and turning gaps into calls, funding and partnerships. Sectors are configurable — never hard-coded.",
    items_ar: ["أولويات مقترحة من الذكاء الاصطناعي بمؤشر فجوة مشروح — بانتظار اعتماد الوزارة", "مؤشر أولوية بصيغة وأوزان معتمدة (الحاجة، الفجوة، مواءمة السياسة، القدرة، الاتجاه)", "تغطية الأولوية = النشاط البحثي الفعلي مقابل المستهدف، على مستوى الجامعات والجغرافيا", "دورة اعتماد: مسودة → أدلة → مراجعة قطاعية → مراجعة خبراء → اعتماد الوزارة → نشر"],
    items_en: ["AI-suggested priorities with an explained gap index — pending Ministry approval", "A priority index with an approved formula and weights (need, gap, policy alignment, capacity, trend)", "Priority coverage = actual research activity vs target, by university and geography", "Approval cycle: draft → evidence → sector review → expert review → Ministry approval → published"],
  },
  {
    number: "03", slug: "partnerships", mock: "network",
    title_ar: "الشراكات والاتفاقيات البحثية", title_en: "Research partnerships & agreements",
    question_ar: "من يتعاون مع من على المستوى المحلي، وما الذي تنتجه هذه الشراكات؟", question_en: "Who collaborates with whom locally, and what do these partnerships produce?",
    desc_ar: "الشراكات لا تُنشئها الوزارة — تنشأ على المستوى المحلي بين الطلبة والباحثين والجامعات والمراكز والجهات المحلية، وتصل إلى الوزارة كبيانات: اتفاقيات ومشاريع ومخرجات. محرك ذكاء للشراكات لا قاعدة اتفاقيات فقط: من يتعاون مع من، في ماذا، بأي نتائج، وأين توجد فرصة شراكة تعالج فجوة وطنية — بين الجامعات، ومع المراكز والصناعة والبلديات، ومع الشركاء العرب والدوليين.",
    desc_en: "The Ministry doesn't create partnerships — they start locally between students, researchers, universities, centres and local bodies, and reach the Ministry as data: agreements, projects and outputs. A partnership intelligence engine, not just an agreements database: who collaborates with whom, on what, with which results, and where a partnership could close a national gap — between universities, with centres, industry and municipalities, and with Arab and international partners.",
    items_ar: ["كل شراكة بيانات: أطرافها ومشاريعها ومخرجاتها ومدتها — تُسجَّل محليًا وتقرأها الوزارة", "مطابقة بأبعاد معلنة: تقارب الموضوع، الخبرة المكمّلة، البنية التحتية، ملاءمة التمويل، خدمة الأولوية، الأثر، الجغرافيا", "كل مطابقة تشرح سبب الاقتراح، ثم مراجعة بشرية وتواصل", "إدارة الاتفاقيات بالتزاماتها ومخرجاتها ومؤشراتها وتنبيه قبل الانتهاء"],
    items_en: ["Every partnership is data: its parties, projects, outputs and term — recorded locally, read by the Ministry", "Matching on declared dimensions: topic similarity, complementary expertise, infrastructure, funding fit, priority fit, impact, geography", "Every match explains why it was proposed, followed by human review and outreach", "Agreements managed with commitments, outputs, KPIs and renewal alerts"],
  },
  {
    number: "04", slug: "funding", mock: "funding",
    title_ar: "فرص التمويل وذكاء التمويل البحثي", title_en: "Funding opportunities & funding intelligence",
    question_ar: "أين توجد فرص تمويل مناسبة، ولمن؟", question_en: "Where is suitable funding, and for whom?",
    desc_ar: "يربط «من يحتاج التمويل؟» بـ«أين توجد الأموال المناسبة؟»: فرص محلية وعربية وإقليمية ودولية وصناعية وجامعية داخلية، مع شروط الأهلية والمواعيد والنطاق الجغرافي ومصدر رسمي وحالة تحقق.",
    desc_en: "It connects “who needs funding?” with “where is the right money?”: local, Arab, regional, international, industry and internal university opportunities, with eligibility, deadlines, geographic scope, an official source and a verification status.",
    items_ar: ["أخبار وإعلانات تمويل متجددة للطلبة والباحثين: منح ودعوات وفرص", "مطابقة ملف الباحث أو الفريق والموضوع والسجل والأهلية والميزانية مع الفرص", "درجة الملاءمة ترتيب داخلي — وليست قرار قبول من الجهة الممولة", "تنبيهات المواعيد وسير عمل التقديم من داخل المنصة"],
    items_en: ["Constantly refreshed funding news and announcements for students and researchers: grants, calls and opportunities", "Matching the researcher or team profile, topic, track record, eligibility and budget to opportunities", "The fit score is an internal ranking — never an acceptance decision by the funder", "Deadline alerts and an application workflow inside the platform"],
  },
];

export const POLICY_JOURNEY = [
  { ar: "البيانات", en: "Data" },
  { ar: "وصفي — ماذا يحدث؟", en: "Descriptive — what is happening?" },
  { ar: "تشخيصي — لماذا؟", en: "Diagnostic — why?" },
  { ar: "سيناريو — ماذا لو تدخّلنا؟", en: "Scenario — what if we act?" },
  { ar: "خيارات السياسة", en: "Policy options" },
  { ar: "قرار بشري", en: "Human decision" },
  { ar: "التنفيذ", en: "Implementation" },
  { ar: "المتابعة", en: "Monitoring" },
  { ar: "تقييم الأثر", en: "Impact evaluation" },
];

export const MINISTRY_PRINCIPLES = [
  { ar: "كل رقم في اللوحة يعود إلى مصدره: جامعة، سنة، وحدة، مصدر خارجي أو سجل رسمي.", en: "Every figure on the dashboard traces back to its source: university, year, unit, external source or official record." },
  { ar: "الذكاء الاصطناعي يكتشف الأنماط ويشرحها ويقترح خيارات — لكنه لا يتخذ القرار الحكومي.", en: "AI detects patterns, explains them and proposes options — it never makes the government decision." },
  { ar: "لا نسخة يدوية مستقلة من بيانات الجامعات، ولا ربط مباشر بقواعدها دون طبقة استقبال وحوكمة.", en: "No separate manual copy of university data, and no direct link to their databases without an ingestion and governance layer." },
  { ar: "الجغرافيا والقطاعات والأولويات قابلة للتهيئة من الوزارة — لا شيء ثابت في الكود.", en: "Geography, sectors and priorities are configurable by the Ministry — nothing is hard-coded." },
  { ar: "لا تظهر بيانات فردية حساسة في اللوحات الوطنية إلا وفق الصلاحيات والسياسات.", en: "No sensitive individual data appears in national dashboards except under permissions and policy." },
  { ar: "كل توصية سياسة لها حزمة أدلة، وكل مطابقة شراكة أو تمويل تشرح سببها وشروطها.", en: "Every policy recommendation has an evidence pack; every partnership or funding match explains its reason and conditions." },
];

export const MINISTRY_ROLES = [
  { ar: "الوزير والقيادة التنفيذية", en: "Minister & executive leadership", desc_ar: "اللوحات الوطنية والتقارير الاستراتيجية والمقارنات المعتمدة.", desc_en: "National dashboards, strategic reports and approved comparisons." },
  { ar: "إدارة البحث العلمي", en: "Research directorate", desc_ar: "التحليلات الوطنية ضمن الاختصاص.", desc_en: "National analytics within its remit." },
  { ar: "فريق السياسات", en: "Policy team", desc_ar: "ذكاء السياسات والأولويات والسيناريوهات وحزم القرار.", desc_en: "Policy intelligence, priorities, scenarios and decision packs." },
  { ar: "وحدة التمويل", en: "Funding unit", desc_ar: "فرص التمويل وأداء المشاريع الممولة.", desc_en: "Funding opportunities and funded-project performance." },
  { ar: "وحدة الشراكات", en: "Partnerships unit", desc_ar: "الشركاء والاتفاقيات والمطابقة.", desc_en: "Partners, agreements and matching." },
  { ar: "حوكمة البيانات", en: "Data governance", desc_ar: "جودة البيانات والنسب والصلاحيات والتدقيق.", desc_en: "Data quality, provenance, permissions and audit." },
];

export const MINISTRY_REPORTS = [
  { ar: "حالة البحث العلمي", en: "State of research" },
  { ar: "الأولويات البحثية الوطنية", en: "National research priorities" },
  { ar: "التقرير البحثي الإقليمي", en: "Regional research report" },
  { ar: "مقارنة الجامعات", en: "University benchmark" },
  { ar: "تقرير التمويل البحثي", en: "Research funding report" },
  { ar: "تقرير الشراكات", en: "Partnership report" },
  { ar: "تقرير القدرات البحثية", en: "Research capacity report" },
  { ar: "موجز سياسة لسؤال حكومي محدد", en: "Policy brief for a specific question" },
];

export const getLevelLabel = (key, lang) => LEVEL_LABELS[key]?.[lang] ?? key;
