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
    kicker_ar: "الجامعات — الجودة والاعتماد والجاهزية للتصنيفات",
    kicker_en: "Universities — Quality, accreditation & rankings",
    title_pre_ar: "إدارة الأداء والتميّز البحثي ", title_em_ar: "كوظيفة مؤسسية", title_post_ar: ".",
    title_pre_en: "Research excellence ", title_em_en: "as an institutional function", title_post_en: ".",
    intro_ar: "تربط SOURCE الأداء البحثي للجامعة بمتطلبات الجودة والاعتماد والجاهزية للتصنيفات، من خلال لوحات أداء على مستوى الجامعة والكلية والقسم والباحث، وملف بحثي مؤسسي، ومؤشرات تساعد على رصد الفجوات ومجالات التحسين، ضمن سياق مرتبط بالأولويات الوطنية.",
    intro_en: "One environment linking the university's research profile to national accreditation and international rankings: performance dashboards by university, college, department and researcher, documented evidence, and improvement plans tied to indicators — aligned with the national priorities set by the Ministry.",
    focus_ar: ["لوحات أداء بحثي على مستوى الجامعة والكلية والقسم والباحث", "ملف بحثي مؤسسي وسجلات موثقة للإنتاج والأداء البحثي", "مؤشرات تساعد على متابعة الجودة والاعتماد والجاهزية للتصنيفات", "رصد الفجوات ومجالات التحسين بناءً على بيانات فعلية"],
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
    title_pre_ar: "أكثر من شاشة تقارير — ", title_em_ar: "رؤية وطنية للبحث العلمي", title_post_ar: ".",
    title_pre_en: "Not a reporting screen — ", title_em_en: "a national research intelligence layer", title_post_en: ".",
    intro_ar: "تجمع هذه الطبقة البيانات والمؤشرات البحثية المعتمدة في صورة وطنية مترابطة، وتربطها بالأولويات والشراكات وفرص التمويل، بما يساعد الوزارة على فهم المشهد البحثي، رصد الفجوات والاتجاهات، ودعم التوجيه والقرار ضمن حوكمة وصلاحيات واضحة ومعلومات قابلة للتتبع إلى مصادرها.",
    intro_en: "It runs on the data universities authorise for sharing, links it to state institutions' data, opportunities and partnerships, and moves the Ministry from “showing numbers” to “understanding reality, then choosing the intervention” — with clear governance and permissions, and every figure traceable to its source.",
  },
};

// ── المسارات والمؤشرات المشتركة لصفحات المؤسسات (المقترح، المكون الثاني) ──
export const QUALITY_TRACKS = [
  {
    number: "01",
    title_ar: "الجودة والاعتماد المحلي", title_en: "National quality & accreditation",
    desc_ar: "تدعم SOURCE الجامعة في تنظيم بياناتها وأدلتها البحثية وربطها بمتطلبات الجودة والاعتماد المعتمدة، بما يساعد على متابعة الجاهزية ورصد النواقص قبل التقديم.",
    desc_en: "Under the approved frameworks and standards, within the remit of the National Centre for Quality Assurance and Accreditation of Educational and Training Institutions.",
    items_ar: ["ملف بحثي مؤسسي وسجلات موثقة للإنتاج والأداء البحثي", "ربط الأدلة والمؤشرات بمتطلبات الجودة والاعتماد ذات الصلة", "رصد النواقص ومجالات التحسين ودعم إعداد التقارير المؤسسية"],
    items_en: ["An institutional research profile with documented output records", "Evidence matched to accreditation standards, gaps flagged before submission", "Compliance reports ready for the national centre and institutional leadership"],
  },
  {
    number: "02",
    title_ar: "الجاهزية للتصنيفات الدولية", title_en: "International rankings",
    desc_ar: "تساعد SOURCE الجامعة على متابعة المؤشرات ذات الصلة بالتصنيفات الدولية، وتحليل أدائها البحثي والعوامل المرتبطة به، بما يدعم خطط التحسين والاستعداد للتصنيف.",
    desc_en: "QS World, Times Higher Education Arab and QS Arab rankings — through a complete set of criteria the institution completes from actual research performance data.",
    items_ar: ["متابعة مؤشرات الأداء ذات الصلة بالتصنيفات وربطها بخطط التحسين", "تحليل الإنتاج البحثي والتعاون الدولي والتأليف المشترك", "دعم الجاهزية للتصنيفات دون ضمان نتيجة أو مركز تصنيفي"],
    items_en: ["Ranking indicators monitored and tied to improvement plans", "International collaboration and co-authorship analytics", "The system neither promises nor guarantees a ranking position — it improves the indicators behind it"],
  },
];

export const PERFORMANCE_AREAS = [
  { title_ar: "الإنتاج البحثي والجودة", title_en: "Research output & quality", desc_ar: "حجم النشر ونموه، جودة المجلات، تقييمات جودة البحث، والجاهزية للنشر.", desc_en: "Publication volume and growth, journal quality, research quality assessments, publication readiness." },
  { title_ar: "الأثر البحثي", title_en: "Research impact", desc_ar: "أداء الاستشهادات، مؤشرات الأثر المعيارية حيث تسمح البيانات المرخصة، والظهور والوصول البحثي.", desc_en: "Citation performance, normalised impact where licensed data allow, visibility and reach." },
  { title_ar: "الشراكات والتعاون الدولي", title_en: "Partnerships & international collaboration", desc_ar: "التأليف الدولي المشترك، الشراكات البحثية، ومجموعات البحث بين المؤسسات.", desc_en: "International co-authorship, research partnerships, cross-institutional research groups." },
  { title_ar: "التمويل وأداء المشاريع", title_en: "Funding & project performance", desc_ar: "المنح البحثية، المشاريع الممولة، معدلات الإنجاز، والاستثمار في المجالات ذات الأولوية.", desc_en: "Research grants, funded projects, completion rates, investment in priority fields." },
  { title_ar: "الابتكار ونقل المعرفة", title_en: "Innovation & knowledge transfer", desc_ar: "براءات الاختراع، نشاط الملكية الفكرية، البحث التطبيقي، والمخرجات التجارية والابتكارية.", desc_en: "Patents, IP activity, applied research, commercial outputs." },
  { title_ar: "الأداء المؤسسي", title_en: "Institutional performance", desc_ar: "الأداء على مستوى الجامعة والكلية والقسم والمركز والباحث، والتقدم في خطط التحسين.", desc_en: "Performance by university, college, department, centre and researcher, and improvement plan progress." },
];

export const DATA_FLOW = [
  { title_ar: "السجلات البحثية المؤسسية", title_en: "Research Data Core", desc_ar: "تحتفظ الجامعة بملفها البحثي وسجلاتها الموثقة للإنتاج والأداء البحثي.", desc_en: "Institutional data is collected once in its research profile." },
  { title_ar: "جودة البيانات والتحقق", title_en: "Institutional validation", desc_ar: "تُراجع البيانات وتُدار جودتها قبل استخدامها في المؤشرات والتحليلات المؤسسية والوطنية.", desc_en: "The institution validates its data and evidence before any sharing." },
  { title_ar: "التكامل المؤسسي", title_en: "Institutional snapshot", desc_ar: "تتكامل SOURCE مع أنظمة الجامعة والمستودعات والمصادر المعتمدة من خلال واجهات وتكاملات مضبوطة.", desc_en: "A dated, versioned snapshot with a source for every period." },
  { title_ar: "الحوكمة والصلاحيات", title_en: "National sharing policy", desc_ar: "تحدد الوزارة، ضمن إطار الحوكمة المعتمد، قواعد الوصول إلى البيانات ومشاركتها والصلاحيات المرتبطة بها.", desc_en: "What is shared with the Ministry is governed by data classification and permissions." },
  { title_ar: "لوحات الوزارة", title_en: "Ministry dashboards", desc_ar: "تغذي البيانات المعتمدة والمؤشرات الموحّدة لوحات الوزارة والذكاء البحثي الوطني، بما يسمح بالمقارنة والتحليل والمتابعة على المستوى الوطني.", desc_en: "Approved data arrives through APIs or controlled synchronisation — no manual re-entry." },
];

// ── المساحات الأربع لطبقة الوزارة — نصوص Source.docx:
//    title/question/desc/items = صفحة الوزارة، home_question/home_desc = بطاقات تاب الوزارة في الرئيسية.
//    العنصر الأول في items أُضيف بطلب سابق (الشات بوت، الأولويات المقترحة، الشراكات كبيانات، إعلانات التمويل).
export const MINISTRY_SPACES = [
  {
    number: "01", slug: "data-intelligence", mock: "kpi",
    title_ar: "البيانات والذكاء البحثي الوطني", title_en: "National research data & intelligence",
    question_ar: "ماذا يحدث في البحث العلمي على المستوى الوطني؟", question_en: "What is happening across the national research landscape?",
    home_question_ar: "ماذا يحدث في البحث العلمي على المستوى الوطني؟",
    home_desc_ar: "تجمع البيانات والمؤشرات البحثية في صورة وطنية مترابطة، مع إمكانية التحليل حسب الجامعة والمجال والسنة والجغرافيا، ومقارنة الأداء والاتجاهات والفجوات بين المؤسسات والمجالات.",
    desc_ar: "تجمع هذه المساحة البيانات والمؤشرات البحثية في صورة وطنية قابلة للتحليل بحسب الجامعة والمجال والسنة والجغرافيا، بما يساعد الوزارة على متابعة النشاط البحثي والاتجاهات والفجوات ومقارنة الأداء عبر مستويات مختلفة.",
    desc_en: "This space brings research data and indicators together into a national picture that can be analysed by university, field, year and geography, helping the Ministry follow research activity, trends and gaps and compare performance across levels.",
    items_ar: ["المساعد الذكي: مساعد بالذكاء الاصطناعي يحلّل أرقام البحث الوطني ويشرحها بلغة طبيعية", "الباحثون والمنشورات والمشاريع والتمويل والتعاون وغيرها من مؤشرات النشاط والأداء البحثي", "تحليل الاتجاهات والفجوات والتغيرات على مستوى المؤسسات والمجالات", "تنبيهات تساعد على رصد مجالات بحثية صاعدة، أولويات ضعيفة التغطية، وفجوات في التمويل أو القدرات"],
    items_en: ["SOURCE Chatbot: an AI chatbot that analyses and explains national research figures in natural language", "Researchers, publications, projects, funding, collaboration and other research activity and performance indicators", "Analysis of trends, gaps and changes across institutions and fields", "Alerts that help spot emerging research fields, weakly covered priorities, and funding or capacity gaps"],
  },
  {
    number: "02", slug: "priorities", mock: "priorities",
    title_ar: "الأولويات البحثية الوطنية", title_en: "National research priorities",
    question_ar: "ما الذي تحتاج الدولة إلى توجيه البحث نحوه، وأين تتركز الفجوات؟", question_en: "Which research areas require greater national focus, and where are the gaps?",
    home_question_ar: "ما الذي تحتاج الدولة أن تبحث فيه، وأين الفجوات؟",
    home_desc_ar: "تربط احتياجات الدولة وتحديات القطاعات بالأولويات البحثية، وتساعد على قياس مدى تغطيتها ورصد المجالات التي تحتاج إلى مزيد من البحث أو الدعم.",
    desc_ar: "تساعد هذه المساحة الوزارة على ربط الاحتياجات والتحديات الوطنية بالمجالات البحثية، ومقارنة الأولويات بما يُنتج فعلياً من أبحاث، بما يوضح المجالات التي تحتاج إلى مزيد من الاهتمام أو التمويل أو التعاون.",
    desc_en: "This space helps the Ministry link national needs and challenges to research fields and compare priorities with the research actually produced, showing which areas need more attention, funding or collaboration.",
    items_ar: ["أولويات مقترحة من الذكاء الاصطناعي بمؤشر فجوة مشروح — بانتظار اعتماد الوزارة", "تنظيم الأولويات البحثية الوطنية وربطها بالمجالات والموضوعات ذات الصلة", "قياس مستوى النشاط البحثي المرتبط بكل أولوية", "رصد الفجوات التي يمكن أن تستفيد من توجيه بحثي أو تمويلي أو شراكات جديدة"],
    items_en: ["AI-suggested priorities with an explained gap index — pending Ministry approval", "Organising national research priorities and linking them to related fields and topics", "Measuring the level of research activity linked to each priority", "Spotting gaps that could benefit from research direction, funding or new partnerships"],
  },
  {
    number: "03", slug: "partnerships", mock: "network",
    title_ar: "الشراكات البحثية", title_en: "Research partnerships",
    question_ar: "أين توجد فرص التعاون على المستوى الوطني والإقليمي والدولي؟", question_en: "Where are the strongest opportunities for collaboration nationally, regionally and internationally?",
    home_question_ar: "مع من يمكن أن نتعاون داخلياً وإقليمياً ودولياً؟",
    home_desc_ar: "تساعد على تحديد فرص التعاون بين الجامعات والباحثين والمؤسسات، ورصد المجالات التي يمكن أن تستفيد من شراكات وطنية أو إقليمية أو دولية.",
    desc_ar: "تساعد هذه المساحة على قراءة شبكات التعاون القائمة واكتشاف فرص جديدة بين الجامعات والباحثين والمراكز والمؤسسات والشركاء الخارجيين، وخاصة عندما يمكن للشراكة أن تدعم أولوية وطنية أو تعالج فجوة بحثية.",
    desc_en: "This space helps read existing collaboration networks and discover new opportunities between universities, researchers, centres, institutions and external partners — especially where a partnership can support a national priority or close a research gap.",
    items_ar: ["كل شراكة بيانات: أطرافها ومشاريعها ومخرجاتها ومدتها — تُسجَّل محليًا وتقرأها الوزارة", "اكتشاف باحثين ومؤسسات ذات اهتمامات أو قدرات بحثية متكاملة", "ربط فرص التعاون بالأولويات والمجالات والقدرات البحثية", "متابعة الشراكات والاتفاقيات ذات الصلة ومخرجاتها ضمن المنظومة"],
    items_en: ["Every partnership is data: its parties, projects, outputs and term — recorded locally, read by the Ministry", "Discovering researchers and institutions with complementary interests or research capabilities", "Linking collaboration opportunities to priorities, fields and research capabilities", "Following related partnerships and agreements and their outputs within the system"],
  },
  {
    number: "04", slug: "funding", mock: "funding",
    title_ar: "فرص التمويل البحثي", title_en: "Research funding opportunities",
    question_ar: "ما فرص التمويل المتاحة، وكيف يمكن ربطها بالأولويات والقدرات البحثية؟", question_en: "What funding opportunities are available, and how can they be matched with national priorities and research capabilities?",
    home_question_ar: "أين توجد فرص تمويل مناسبة، ولمن؟",
    home_desc_ar: "تجمع فرص التمويل البحثي ذات الصلة، وتساعد على ربطها بالأولويات والمجالات والقدرات البحثية المناسبة، مع إظهار متطلبات الفرصة ومصدرها.",
    desc_ar: "تجمع هذه المساحة فرص التمويل ذات الصلة وتساعد على ربطها بالباحثين والفرق والمؤسسات والمجالات البحثية المناسبة، مع إظهار متطلبات كل فرصة ومواعيدها ومصدرها.",
    desc_en: "This space gathers relevant funding opportunities and helps match them to the right researchers, teams, institutions and research fields, showing each opportunity's requirements, deadlines and source.",
    items_ar: ["أخبار وإعلانات تمويل متجددة للطلبة والباحثين: منح ودعوات وفرص", "عرض فرص التمويل المحلية والإقليمية والدولية ذات الصلة", "مساعدة الباحثين والفرق والمؤسسات على اكتشاف الفرص الأقرب إلى موضوعاتهم وقدراتهم", "ربط فرص التمويل بالأولويات الوطنية والمجالات البحثية التي تحتاج إلى دعم"],
    items_en: ["Constantly refreshed funding news and announcements for students and researchers: grants, calls and opportunities", "Showing relevant local, regional and international funding opportunities", "Helping researchers, teams and institutions discover the opportunities closest to their topics and capabilities", "Linking funding opportunities to national priorities and research fields that need support"],
  },
];

// ── من البيانات إلى فهم أعمق للمشهد البحثي (highlight = خطوة القرار البشري) ──
export const POLICY_JOURNEY = [
  { ar: "البيانات", en: "Data", desc_ar: "جمع المؤشرات والمعلومات ذات الصلة.", desc_en: "Gathering the relevant indicators and information." },
  { ar: "قراءة المشهد", en: "Reading the landscape", desc_ar: "ما الذي يحدث وأين؟", desc_en: "What is happening, and where?" },
  { ar: "رصد الفجوات والاتجاهات", en: "Spotting gaps & trends", desc_ar: "ما المجالات التي تحتاج إلى مزيد من الاهتمام؟", desc_en: "Which areas need more attention?" },
  { ar: "استكشاف الخيارات", en: "Exploring options", desc_ar: "ما فرص التمويل أو التعاون أو التوجيه المتاحة؟", desc_en: "What funding, collaboration or direction options exist?" },
  { ar: "القرار البشري", en: "Human decision", desc_ar: "تتخذ الوزارة القرار وفق صلاحياتها وأطرها المعتمدة.", desc_en: "The Ministry decides within its mandate and approved frameworks.", highlight: true },
  { ar: "المتابعة", en: "Monitoring", desc_ar: "تُستخدم المؤشرات لمتابعة التطور والأثر بمرور الوقت.", desc_en: "Indicators are used to follow progress and impact over time." },
];

export const MINISTRY_PRINCIPLES = [
  { ar: "البيانات والمؤشرات المعروضة قابلة للتتبع إلى مصادرها المعتمدة.", en: "The data and indicators shown are traceable to their approved sources." },
  { ar: "يساعد الذكاء الاصطناعي في التحليل ورصد الأنماط والفرص، ولا يتخذ القرار الحكومي بدلاً من المسؤولين.", en: "AI helps analyse and spot patterns and opportunities; it never makes the government decision in place of officials." },
  { ar: "تتم مشاركة البيانات والوصول إليها ضمن حوكمة وصلاحيات تعتمدها الوزارة والمؤسسات المشاركة.", en: "Data sharing and access follow governance and permissions approved by the Ministry and participating institutions." },
  { ar: "تُعرض البيانات على المستوى المناسب بحسب الصلاحيات وحساسية المعلومات.", en: "Data is shown at the appropriate level according to permissions and the sensitivity of the information." },
  { ar: "تبقى الأولويات والمؤشرات قابلة للتطوير والتحديث بحسب احتياجات الوزارة وتطور المشهد البحثي.", en: "Priorities and indicators remain open to development and updating as the Ministry's needs and the research landscape evolve." },
];

export const MINISTRY_ROLES = [
  { ar: "القيادة وصنّاع القرار", en: "Leadership & decision-makers", desc_ar: "رؤية وطنية للمؤشرات والاتجاهات والأولويات ومتابعة الأداء العام.", desc_en: "A national view of indicators, trends and priorities, and oversight of overall performance." },
  { ar: "فرق البحث والسياسات", en: "Research & policy teams", desc_ar: "تحليل المجالات والأولويات والفجوات والاتجاهات البحثية.", desc_en: "Analysis of research fields, priorities, gaps and trends." },
  { ar: "فرق التمويل والشراكات", en: "Funding & partnerships teams", desc_ar: "متابعة فرص التمويل والتعاون وربطها بالاحتياجات والقدرات البحثية.", desc_en: "Following funding and collaboration opportunities and linking them to research needs and capabilities." },
  { ar: "فرق البيانات والحوكمة", en: "Data & governance teams", desc_ar: "متابعة جودة البيانات ومصادرها وصلاحيات الوصول إليها.", desc_en: "Overseeing data quality, sources and access permissions." },
];

export const MINISTRY_REPORTS = [
  { ar: "حالة البحث العلمي", en: "State of research" },
  { ar: "الأولويات البحثية الوطنية", en: "National research priorities" },
  { ar: "مقارنات الأداء البحثي", en: "Research performance comparisons" },
  { ar: "التمويل البحثي", en: "Research funding" },
  { ar: "الشراكات البحثية", en: "Research partnerships" },
  { ar: "القدرات والفجوات البحثية", en: "Research capacity & gaps" },
  { ar: "تحليلات مخصصة لدعم أسئلة الوزارة", en: "Custom analyses for Ministry questions" },
];

export const getLevelLabel = (key, lang) => LEVEL_LABELS[key]?.[lang] ?? key;
