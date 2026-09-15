// =========================================================
// محتوى صفحات الركائز التقنية الأربع (/pillar/:key) — التصميم "السينمائي
// الداكن بفصول": هيرو داكن → الفصل 01 ما هو → 02 المكونات → 03 كيف يعمل →
// 04 الضمانة → لمن يفيد → الركيزة السابقة/التالية.
// المصادر: المقترح (البنية التقنية وسيادة البيانات والأمن، الطبقات
// التشغيلية)، مواصفة طبقة الوزارة (تدفق البيانات، الحوكمة، AI)، ودليل
// الخدمات (سير العمل والخدمات المركّبة).
// =========================================================

export const PILLAR_ORDER = ["digital", "ai", "automation", "security"];

export const PILLARS = {
  digital: {
    number: "01",
    image: "/Home/home01.jpg",
    name_ar: "التحول الرقمي", name_en: "Digital Transformation",
    title_pre_ar: "بيئة تشغيل رقمية واحدة، ", title_em_ar: "لا أنظمة متفرقة.",
    title_pre_en: "One digital operating environment, ", title_em_en: "not scattered systems.",
    intro_ar: "كل مراحل البحث العلمي — من الفكرة إلى التقديم والمراجعة والنشر والأرشفة — خرجت من الورق والأنظمة المنفصلة إلى منظومة واحدة متصلة، تربط الباحث بجامعته والجامعة بالوزارة عبر سجل بحثي مستمر واحد.",
    intro_en: "Every research stage — from idea to submission, review, publication and archiving — moved off paper and disconnected tools into one connected system that links the researcher to their university and the university to the Ministry through a single continuous research record.",
    what_title_ar: "منصة واحدة تعمل كطبقة تكامل وطنية، لا كبديل لأنظمة الجامعات.",
    what_title_en: "One platform that works as a national integration layer, not a replacement for university systems.",
    what_desc_ar: "المنصة الرقمية هي بيئة التشغيل الأساسية للمستخدمين والسجلات البحثية والمشاريع ومسارات النشر والخدمات والمستودعات ولوحات المعلومات والتحليلات والتكاملات.",
    what_desc_en: "The digital platform is the core operating environment for users, research records, projects, publication pipelines, services, repositories, dashboards, analytics and integrations.",
    verbs: [
      { verb_ar: "يوحّد", verb_en: "Unifies", label_ar: "سجل بحثي مستمر واحد", label_en: "One continuous research record", desc_ar: "ينتقل السجل نفسه عبر كل مرحلة: من فكرة الباحث إلى مؤشرات الجامعة إلى لوحات الوزارة — بلا إعادة إدخال.", desc_en: "The same record moves through every stage: from the researcher's idea to university indicators to Ministry dashboards — with no re-entry." },
      { verb_ar: "يربط", verb_en: "Connects", label_ar: "الوزارة والجامعات والباحثين", label_en: "Ministry, universities and researchers", desc_ar: "ثلاثة مستويات في منظومة واحدة بترتيب صاحب القرار، وكل خدمة تنبع من احتياج حددته الوزارة.", desc_en: "Three levels in one system, ordered by decision-maker, with every service stemming from a need the Ministry has defined." },
      { verb_ar: "يتكامل", verb_en: "Integrates", label_ar: "بنية معيارية قائمة على الواجهات البرمجية", label_en: "A modular, API-first architecture", desc_ar: "معايير مفتوحة وموصلات موثقة مع أنظمة الوزارة والجامعات والمستودعات ومعرّفات الباحثين، على مراحل لا كشرط للإطلاق.", desc_en: "Open standards and documented connectors to Ministry and university systems, repositories and researcher identifiers — phased, not a launch precondition." },
    ],
    components_title_ar: "الطبقات التي تُبنى عليها المنصة.", components_title_en: "The layers the platform is built on.",
    components: [
      { title_ar: "تجربة المستخدم", title_en: "User experience", desc_ar: "واجهات ويب متجاوبة بالعربية والإنجليزية، بوابات إدارية، وواجهات API جاهزة للهواتف — بدءًا بلوحات الوزارة.", desc_en: "Responsive Arabic/English web interfaces, admin portals and mobile-ready APIs — starting with Ministry dashboards." },
      { title_ar: "التطبيق وواجهات API", title_en: "Application & APIs", desc_ar: "خدمات معيارية لدورة حياة البحث والمستخدمين وسير العمل والنشر والمحافظ والتحليلات والإدارة المؤسسية.", desc_en: "Modular services for the research lifecycle, users, workflow, publishing, portfolios, analytics and institutional administration." },
      { title_ar: "البيانات والتكامل", title_en: "Data & integration", desc_ar: "قواعد بيانات تشغيلية ومخازن تحليلات وبحث وفهرسة وتخزين آمن للمستندات، مع بوابة API وطوابير ومزامنة مضبوطة.", desc_en: "Operational databases, analytics stores, search and indexing, secure document storage, with an API gateway, queues and controlled synchronisation." },
    ],
    how_title_ar: "من الباحث إلى الوزارة — وبالعكس.", how_title_en: "From researcher to Ministry — and back.",
    steps: [
      { title_ar: "الباحث", title_en: "Researcher", desc_ar: "فكرة → منهجية → تحليل → نشر → ملف بحثي.", desc_en: "Idea → methodology → analysis → publication → profile." },
      { title_ar: "الجامعة", title_en: "University", desc_ar: "نواة البيانات البحثية → الأدلة → التميز البحثي → جاهزية الاعتماد والتصنيف.", desc_en: "Research Data Core → evidence → research excellence → accreditation & ranking readiness." },
      { title_ar: "الوزارة", title_en: "Ministry", desc_ar: "قاعدة بيانات وطنية → أولويات → شراكات → تمويل.", desc_en: "National database → priorities → partnerships → funding." },
      { title_ar: "السياسة والاستثمار", title_en: "Policy & investment", desc_ar: "تعود الأولويات والتمويل لتوجّه الباحث من جديد.", desc_en: "Priorities and funding flow back to guide the researcher again.", highlight: true },
    ],
    guarantee_kicker_ar: "الضمانة", guarantee_kicker_en: "The guarantee",
    guarantee_title_ar: "الجامعة لا تعيد إدخال بياناتها للوزارة.", guarantee_title_en: "Universities never re-enter their data for the Ministry.",
    split_a_label_ar: "المنصة", split_a_label_en: "The platform", split_a_word_ar: "تتكامل", split_a_word_en: "Integrates",
    split_a_desc_ar: "البيانات المعتمدة والمسموح بمشاركتها تنتقل عبر واجهات برمجية أو مزامنة مضبوطة، وكل مزامنة تحمل توقيتًا ومصدرًا وإصدارًا.", split_a_desc_en: "Approved, shareable data moves through APIs or controlled synchronisation, and every sync carries a timestamp, a source and a version.",
    split_b_label_ar: "أنظمة الجامعات", split_b_label_en: "University systems", split_b_word_ar: "تبقى", split_b_word_en: "Remain",
    split_b_desc_ar: "لا يستبدل النظام أنظمة معلومات الجامعات القائمة، بل يربط دعم القرار بالبيانات المؤسسية والخدمات البحثية عبر إطار وطني مشترك.", split_b_desc_en: "The system does not replace existing university information systems; it links decision support to institutional data and research services through a shared national framework.",
    quote_ar: "بدلًا من استبدال الأنظمة الجامعية الحالية، ستعمل المنصة كطبقة تكامل وطنية تربط الذكاء البحثي ودعم القرار بجودة البحث واعتماده وتصنيفه.",
    quote_en: "Rather than replacing existing university systems, the platform works as a national integration layer linking research intelligence and decision support to research quality, accreditation and rankings.",
    audiences: [
      { key: "researcher", items_ar: ["ملف بحثي واحد يجمع المخطوطات والخدمات والحالات", "مسار نشر تتفعّل خدماته حسب المرحلة"], items_en: ["One research profile gathering manuscripts, services and statuses", "A publication pipeline whose services activate by stage"] },
      { key: "university", items_ar: ["لوحات وتقارير بلا إدخال مكرر للبيانات", "لقطات مؤسسية مؤرخة بإصدار ومصدر"], items_en: ["Dashboards and reports with no duplicate data entry", "Dated institutional snapshots with version and source"] },
      { key: "ministry", items_ar: ["صورة وطنية موحدة تصل عبر طبقة استقبال وحوكمة", "مقارنة اللقطات الوطنية عبر الزمن"], items_en: ["A unified national picture arriving through an ingestion and governance layer", "National snapshots comparable over time"] },
    ],
  },

  ai: {
    number: "02",
    image: "/Home/home05.jpg",
    name_ar: "الذكاء الاصطناعي", name_en: "Artificial Intelligence",
    title_pre_ar: "ذكاء يقترح ويُسرّع، ", title_em_ar: "وإنسان يقرر.",
    title_pre_en: "AI that suggests and accelerates, ", title_em_en: "and a human who decides.",
    intro_ar: "خدمات ذكاء اصطناعي محكومة في مهام محددة: ترشيح الباحثين، تحليل الفجوات، تقييم الجاهزية للنشر، مواءمة المجالات والمجلات، وتحليل الأداء المؤسسي — مع الإبقاء على المراجعة البشرية في القرارات الأعلى تأثيرًا.",
    intro_en: "Governed AI services for specific tasks: researcher recommendation, gap analysis, publication readiness, field and journal matching, and institutional performance analysis — with human review retained for the highest-impact decisions.",
    what_title_ar: "ذكاء يعمل في الخلفية، لا في الواجهة.", what_title_en: "Intelligence that works in the background, not in the foreground.",
    what_desc_ar: "مساعدون بحثيون ووكلاء تحليليون ضمن حوكمة واضحة: لا صندوق أسود ولا قرارات خفية — اقتراحات مُعلَّلة تُعرض على من يملك القرار.",
    what_desc_en: "Research assistants and analytical agents under clear governance: no black box and no hidden decisions — reasoned suggestions presented to whoever holds the decision.",
    verbs: [
      { verb_ar: "يرشّح", verb_en: "Recommends", label_ar: "الباحثين والشركاء وفرص التمويل", label_en: "Researchers, partners and funding", desc_ar: "يقترح أفضل الباحثين لتشكيل الفرق وفق إمكاناتهم وتأثيرهم ومؤهلاتهم المسجلة، والشركاء والفرص المطابقة — مع سبب كل ترشيح.", desc_en: "Proposes the best researchers for teams by potential, impact and registered qualifications, plus matching partners and opportunities — with the reason for each recommendation." },
      { verb_ar: "يحلّل", verb_en: "Analyses", label_ar: "الفجوات والجاهزية والأداء", label_en: "Gaps, readiness and performance", desc_ar: "تحليل الفجوات البحثية، اكتشاف نقاط ضعف المخطوطات، تقييم الجاهزية للنشر، واكتشاف الاتجاهات والشذوذ في البيانات الوطنية.", desc_en: "Research gap analysis, manuscript weakness detection, publication readiness scoring, and trend and anomaly detection in national data." },
      { verb_ar: "يوائم", verb_en: "Matches", label_ar: "المجلات والمؤتمرات والأولويات", label_en: "Journals, conferences and priorities", desc_ar: "مواءمة ذكية مع المجلات والمؤتمرات وفق البيانات المرخصة، ومواءمة الفكرة مع الأولويات الوطنية أو المؤسسية.", desc_en: "Smart matching to journals and conferences using licensed data, and aligning ideas with national or institutional priorities." },
    ],
    components_title_ar: "ثلاث عائلات من الأدوات.", components_title_en: "Three families of tools.",
    components: [
      { title_ar: "مساعدون بحثيون", title_en: "Research assistants", desc_ar: "للباحث: تقييم أولي ومتقدم للجاهزية، تحليل الفجوة، مسودات خطابات التغطية والرد على المحكمين — قابلة للقبول أو الرفض من الباحث نفسه.", desc_en: "For the researcher: preliminary and advanced readiness assessment, gap analysis, draft cover letters and reviewer responses — accepted or rejected by the researcher." },
      { title_ar: "وكلاء تحليليون", title_en: "Analytical agents", desc_ar: "للجامعة والوزارة: اكتشاف الاتجاهات، تجميع الموضوعات، شرح الفروق بين المؤسسات، كشف الأرقام الشاذة، ومسودات موجزات السياسة.", desc_en: "For universities and the Ministry: trend detection, topic clustering, benchmark explanation, anomaly detection and policy brief drafting." },
      { title_ar: "محركات مطابقة", title_en: "Matching engines", desc_ar: "المجلات، الشركاء، فرص التمويل — كل مطابقة تعرض سبب الاقتراح وشروط الأهلية، ودرجة الملاءمة ترتيب داخلي لا قرار قبول.", desc_en: "Journals, partners, funding — every match shows why it was proposed and its eligibility terms; the fit score is an internal ranking, never an acceptance decision." },
    ],
    how_title_ar: "من الملف إلى القرار في أربع خطوات.", how_title_en: "From file to decision in four steps.",
    steps: [
      { title_ar: "يقرأ", title_en: "Reads", desc_ar: "يفحص المخطوطات والمستندات والمؤشرات المرفوعة عبر خدمات مضبوطة وقابلة للتدقيق.", desc_en: "Examines uploaded manuscripts, documents and indicators through controlled, auditable services." },
      { title_ar: "يطابق", title_en: "Matches", desc_ar: "يربط كل ملف بالمعيار أو المجلة أو الأولوية الصحيحة.", desc_en: "Links each file to the right standard, journal or priority." },
      { title_ar: "يقترح مع السبب", title_en: "Suggests with reasons", desc_ar: "اقتراحات مرتّبة حسب الأولوية، ومع كل اقتراح سببه ومصادره ودرجة الثقة.", desc_en: "Suggestions ranked by priority, each with its reason, sources and confidence." },
      { title_ar: "الإنسان يقرر", title_en: "A human decides", desc_ar: "الباحث يقبل أو يرفض، والفريق المختص يعتمد، والوزارة تقرر السياسة والتمويل.", desc_en: "The researcher accepts or rejects, the expert team approves, the Ministry decides policy and funding.", highlight: true },
    ],
    guarantee_kicker_ar: "الضمانة", guarantee_kicker_en: "The guarantee",
    guarantee_title_ar: "حدّ واضح بين ما يقترحه النظام وما يقرره الإنسان.", guarantee_title_en: "A clear line between what the system suggests and what a human decides.",
    split_a_label_ar: "الذكاء الاصطناعي", split_a_label_en: "AI", split_a_word_ar: "يقترح", split_a_word_en: "Suggests",
    split_a_desc_ar: "يفحص ويطابق ويرتّب الاقتراحات مع سبب كل اقتراح — ثم يتوقف. لا وصول غير مقيد لقواعد البيانات المؤسسية؛ الطلبات تمر عبر بوابة محكومة مع استرجاع مضبوط وتقييم للنماذج وسجلات تدقيق.", split_a_desc_en: "It examines, matches and ranks suggestions with reasons — then stops. No unrestricted access to institutional databases; requests pass through a governed gateway with controlled retrieval, model evaluation and audit logs.",
    split_b_label_ar: "الإنسان", split_b_label_en: "Human", split_b_word_ar: "يقرر", split_b_word_en: "Decides",
    split_b_desc_ar: "توصيات الذكاء الاصطناعي تدعم القرارات الأكاديمية والمؤسسية الرسمية ولا تستبدلها؛ ولا تُعرض أي نتيجة كحكم أكاديمي نهائي.", split_b_desc_en: "AI recommendations support official academic and institutional decisions and never replace them; no result is presented as a final academic verdict.",
    quote_ar: "الذكاء الاصطناعي يكتشف الأنماط ويشرحها ويقترح خيارات، لكنه لا يتخذ القرار الحكومي.",
    quote_en: "AI detects patterns, explains them and proposes options — but it does not make the government decision.",
    audiences: [
      { key: "researcher", items_ar: ["صياغة أدق دون تغيير صوتك العلمي", "تنبيه للاستنتاجات غير المدعومة والمقاطع التي تحتاج تحققًا"], items_en: ["Sharper wording without changing your scientific voice", "Alerts for unsupported conclusions and passages needing verification"] },
      { key: "university", items_ar: ["كشف الأدلة الناقصة قبل موعد التقديم", "تحديد الفجوات الأكثر تأثيرًا على نتيجة التصنيف"], items_en: ["Missing evidence flagged before the submission date", "The gaps with the biggest effect on ranking results identified"] },
      { key: "ministry", items_ar: ["ترشيح فرق بحثية وشركاء وفرص تمويل مع السبب", "حزم أدلة قابلة للمراجعة — والقرار للوزارة"], items_en: ["Research teams, partners and funding recommended with reasons", "Reviewable evidence packs — the decision remains the Ministry's"] },
    ],
  },

  automation: {
    number: "03",
    image: "/Home/home03.jpg",
    name_ar: "الأتمتة", name_en: "Automation",
    title_pre_ar: "سير عمل يتحرك وحده، ", title_em_ar: "فلا شيء ينتظر متابعة يدوية.",
    title_pre_en: "Workflows that move on their own, ", title_em_en: "so nothing waits on manual follow-up.",
    intro_ar: "تنتقل حالة البحث تلقائيًا بين مراحل الرحلة، وتصل التنبيهات والمهام إلى أصحابها، وتتجمع نتائج الفحوص في درجة جاهزية واحدة، وتتدفق البيانات المعتمدة من الجامعة إلى الوزارة بمزامنة مضبوطة — كل ذلك في الخلفية.",
    intro_en: "Research status moves automatically between journey stages, alerts and tasks reach their owners, check results combine into one readiness score, and approved data flows from university to Ministry through controlled synchronisation — all in the background.",
    what_title_ar: "محرك سير عمل واحد يربط الخدمات بالمرحلة.", what_title_en: "One workflow engine that ties services to the stage.",
    what_desc_ar: "بدل خدمات منفصلة يتابعها الباحث يدويًا، ينشئ مشروع بحث واحدًا فتتفعّل الخدمات حسب مرحلته، وتُحفظ كل خدمة داخل ملف البحث ومسار النشر الخاص به.",
    what_desc_en: "Instead of separate services the researcher chases manually, one research project is created and services activate by its stage, with each service saved inside the research file and its publication pipeline.",
    verbs: [
      { verb_ar: "ينقل", verb_en: "Moves", label_ar: "الحالة بين المراحل تلقائيًا", label_en: "Status between stages automatically", desc_ar: "من التقييم إلى التحكيم إلى اختيار المجلة إلى الإرسال إلى المراجعات — تنتقل الحالة دون تدخل يدوي.", desc_en: "From assessment to review to journal selection to submission to revisions — status moves without manual intervention." },
      { verb_ar: "ينبّه", verb_en: "Alerts", label_ar: "بالمهام والمواعيد والنواقص", label_en: "Tasks, deadlines and missing items", desc_ar: "تنبيهات للباحث بالمهام، وللمؤسسة بالأدلة الناقصة، وللوزارة بالفجوات والفرص والمواعيد النهائية للتمويل.", desc_en: "Alerts to researchers for tasks, to institutions for missing evidence, and to the Ministry for gaps, opportunities and funding deadlines." },
      { verb_ar: "يجمّع", verb_en: "Aggregates", label_ar: "نتائج الفحوص في درجة واحدة", label_en: "Check results into one score", desc_ar: "فحوص اللغة والمنهجية والمراجع والمجلة تتحول إلى درجة جاهزية إرسال واحدة وقائمة أخيرة بالمشكلات المانعة.", desc_en: "Language, methodology, references and journal checks become a single submission-readiness score and a final list of blocking issues." },
    ],
    components_title_ar: "الخدمات المركّبة التي تُشغّل الرحلة.", components_title_en: "The composite services that run the journey.",
    components: [
      { title_ar: "مسار النشر الكامل", title_en: "End-to-end publication pipeline", desc_ar: "واجهة واحدة من المسودة حتى النشر وما بعده: حالة كل مرحلة، مهام، تنبيهات، وسجل بحث كامل.", desc_en: "One interface from draft to publication and beyond: stage status, tasks, alerts and a full research history.", id: "F12" },
      { title_ar: "إدارة المراجعات والإصدارات", title_en: "Revision management", desc_ar: "النسخة الأصلية ثم Revision 1 و2، مع تعليقات المحكمين وخطابات الرد وسجل التغييرات في مسار واحد.", desc_en: "The original then Revision 1 and 2, with reviewer comments, response letters and a change history in one track.", id: "P14" },
      { title_ar: "جاهزية الإرسال", title_en: "Submission readiness", desc_ar: "تشغيل الفحوص، حساب الدرجة، وقائمة أخيرة قبل الإرسال — ذكاء اصطناعي ومحرك سير عمل.", desc_en: "Run the checks, compute the score, and produce a final pre-submission checklist — AI plus workflow engine.", id: "P10" },
    ],
    how_title_ar: "دورة خدمة واحدة، من الرفع إلى ملف البحث.", how_title_en: "One service cycle, from upload to the research file.",
    steps: [
      { title_ar: "رفع", title_en: "Upload", desc_ar: "يرفع المستخدم الملفات أو يدخل البيانات المطلوبة للخدمة.", desc_en: "The user uploads files or enters the data the service needs." },
      { title_ar: "فحص", title_en: "Screening", desc_ar: "تشغيل الفحوص الآلية حسب نوع الخدمة.", desc_en: "Automated checks run according to the service type." },
      { title_ar: "خبير عند الحاجة", title_en: "Expert when needed", desc_ar: "تُحال الحالات التي تتطلب خبيرًا بشريًا وفق ضوابط السرية.", desc_en: "Cases that require a human expert are referred under confidentiality controls." },
      { title_ar: "تقرير وحفظ", title_en: "Report & save", desc_ar: "يستلم المستخدم التقرير، وتُحفظ الخدمة داخل ملف البحث ومسار النشر.", desc_en: "The user receives the report, and the service is saved in the research file and pipeline.", highlight: true },
    ],
    guarantee_kicker_ar: "الضمانة", guarantee_kicker_en: "The guarantee",
    guarantee_title_ar: "الأتمتة تنقل الحالة — ولا تُصدر الحكم.", guarantee_title_en: "Automation moves the status — it never issues the verdict.",
    split_a_label_ar: "الأتمتة", split_a_label_en: "Automation", split_a_word_ar: "تُشغّل", split_a_word_en: "Runs",
    split_a_desc_ar: "تحرّك الحالة، وترسل التنبيهات، وتجمّع النتائج، وتزامن البيانات المعتمدة بين الجامعة والوزارة بتوقيت ومصدر وإصدار لكل عملية.", split_a_desc_en: "It moves status, sends alerts, aggregates results and syncs approved data between university and Ministry with a timestamp, source and version for every operation.",
    split_b_label_ar: "الخبير والمؤسسة", split_b_label_en: "Expert & institution", split_b_word_ar: "تعتمد", split_b_word_en: "Approve",
    split_b_desc_ar: "الخدمات البشرية تظهر بوضوح متى كانت مطلوبة، وقرار القبول أو الرفض يبقى للمجلة وهيئة التحرير، واعتماد البيانات يبقى للمؤسسة قبل أي مشاركة.", split_b_desc_en: "Human services are clearly marked whenever required, acceptance or rejection remains with the journal and editorial board, and data approval remains with the institution before any sharing.",
    quote_ar: "يجب حفظ نسخة من المدخلات والمخرجات وسجل التعديلات وفق سياسة الخصوصية — وكل مزامنة تحمل توقيتًا ومصدرًا وإصدارًا.",
    quote_en: "Inputs, outputs and the change log must be retained under the privacy policy — and every synchronisation carries a timestamp, a source and a version.",
    audiences: [
      { key: "researcher", items_ar: ["تنبيهات ومهام بدل المتابعة اليدوية", "إعادة إرسال تعيد تشغيل الفحوص تلقائيًا"], items_en: ["Alerts and tasks instead of manual follow-up", "Resubmission re-runs the checks automatically"] },
      { key: "university", items_ar: ["تقارير امتثال واعتماد تُنتج آليًا من الملف البحثي", "تنبيه بالأدلة الناقصة قبل الموعد"], items_en: ["Compliance and accreditation reports produced automatically from the profile", "Missing-evidence alerts before the deadline"] },
      { key: "ministry", items_ar: ["استقبال آلي للبيانات المعتمدة مع تحقق وتوحيد ونسب", "تنبيهات الفجوات والفرص والمواعيد"], items_en: ["Automated ingestion of approved data with validation, normalisation and lineage", "Alerts for gaps, opportunities and deadlines"] },
    ],
  },

  security: {
    number: "04",
    image: "/Home/04.jpg",
    name_ar: "الأمن وسيادة البيانات", name_en: "Security & Data Sovereignty",
    title_pre_ar: "بيانات داخل الدولة، ", title_em_ar: "وقرار بيد أصحابه.",
    title_pre_en: "Data kept in-country, ", title_em_en: "and decisions kept with their owners.",
    intro_ar: "تبقى أنظمة الإنتاج الأساسية والبيانات البحثية المعتمدة داخل الدولة، مع بيئة احتياطية مشفرة ومنفصلة جغرافيًا للتعافي من الكوارث، وتشفير للبيانات الحساسة أثناء النقل وفي السكون، وصلاحيات حسب الدور، ومسارات تدقيق كاملة.",
    intro_en: "Core production systems and approved research data stay in-country, with an encrypted, geographically separate backup environment for disaster recovery, encryption of sensitive data in transit and at rest, role-based access and full audit trails.",
    what_title_ar: "الأمن هنا ليس طبقة مضافة، بل شرط في التصميم.", what_title_en: "Security here is not an add-on — it is a design condition.",
    what_desc_ar: "صُممت المنصة كنظام وطني يحافظ على سيادة البيانات: ملكية المصدر الأصلي تبقى للجهة المنتجة، وتدير الوزارة قواعد الوصول والاستخدام على المستوى الوطني وفق الحوكمة المعتمدة.",
    what_desc_en: "The platform is designed as a national system that preserves data sovereignty: ownership of the original source stays with the producing body, and the Ministry manages access and usage rules at the national level under approved governance.",
    verbs: [
      { verb_ar: "يحمي", verb_en: "Protects", label_ar: "تشفير أثناء النقل وفي السكون", label_en: "Encryption in transit and at rest", desc_ar: "البيانات الحساسة مشفرة في كل حالاتها، مع تخزين آمن للمستندات وبيئة احتياطية مشفرة في موقع تعتمده الوزارة.", desc_en: "Sensitive data is encrypted in every state, with secure document storage and an encrypted backup environment at a Ministry-approved site." },
      { verb_ar: "يضبط", verb_en: "Controls", label_ar: "صلاحيات حسب الدور والسمات", label_en: "Role- and attribute-based access", desc_ar: "هوية مركزية، دخول موحد، مصادقة متعددة العوامل للحسابات ذات الصلاحيات العالية، وضوابط للوصول المميز.", desc_en: "Central identity, single sign-on, multi-factor authentication for high-privilege accounts and privileged-access controls." },
      { verb_ar: "يسجّل", verb_en: "Records", label_ar: "سجلات مركزية ومسارات تدقيق", label_en: "Central logs and audit trails", desc_ar: "مراقبة أمنية، جدار حماية تطبيقات، تنبيهات، لوحات تشغيلية، وإجراءات استجابة للحوادث.", desc_en: "Security monitoring, a web application firewall, alerts, operational dashboards and incident-response procedures." },
    ],
    components_title_ar: "ثلاث ضمانات تقنية.", components_title_en: "Three technical guarantees.",
    components: [
      { title_ar: "سيادة البيانات والنشر", title_en: "Data sovereignty & hosting", desc_ar: "الإنتاج الأساسي وقواعد البيانات الجوهرية داخل الدولة؛ أي تكرار خارجها يخضع لموافقة الوزارة ومتطلبات الإقامة والخصوصية وتصنيف البيانات.", desc_en: "Core production and databases hosted in-country; any replication outside is subject to Ministry approval and residency, privacy and classification requirements." },
      { title_ar: "الهوية والوصول", title_en: "Identity & access", desc_ar: "SSO، مصادقة متعددة العوامل، تفويض قائم على الدور والسمات، وضوابط للوصول المميز — لكل مستوى: الوزارة والجامعة والباحث.", desc_en: "SSO, MFA, role- and attribute-based authorisation and privileged-access controls — for every level: Ministry, university and researcher." },
      { title_ar: "الذكاء الاصطناعي المسؤول", title_en: "Responsible AI", desc_ar: "لا وصول غير مقيد للذكاء الاصطناعي إلى قواعد البيانات المؤسسية؛ الطلبات تمر عبر خدمات مضبوطة وقابلة للتدقيق، مع تحقق بشري للمخرجات الأعلى تأثيرًا.", desc_en: "No unrestricted AI access to institutional databases; requests pass through controlled, auditable services with human verification of the highest-impact outputs." },
    ],
    how_title_ar: "من تصنيف البيانات إلى الوصول المصرّح.", how_title_en: "From data classification to authorised access.",
    steps: [
      { title_ar: "تصنيف", title_en: "Classify", desc_ar: "عام / داخلي / سري / مقيد — مع مالك البيانات وأساس مشاركتها.", desc_en: "Public / internal / confidential / restricted — with a data owner and a sharing basis." },
      { title_ar: "قواعد المشاركة", title_en: "Sharing rules", desc_ar: "تحدد المؤسسة والوزارة ما يُشارَك ومع من ولأي غرض.", desc_en: "Institution and Ministry define what is shared, with whom and for what purpose." },
      { title_ar: "استقبال وتحقق ونسب", title_en: "Ingest, validate, trace", desc_ar: "كل سجل يحمل المصدر والفترة وحالة التحقق والإصدار وسلسلة النسب.", desc_en: "Every record carries its source, period, verification status, version and lineage." },
      { title_ar: "وصول حسب الدور", title_en: "Access by role", desc_ar: "لا تظهر البيانات الفردية الحساسة على المستوى الوطني إلا وفق الصلاحيات.", desc_en: "Sensitive individual data appears nationally only under permissions.", highlight: true },
    ],
    guarantee_kicker_ar: "الضمانة", guarantee_kicker_en: "The guarantee",
    guarantee_title_ar: "أهداف تشغيلية معلنة، وتُثبَّت بعد الاكتشاف التقني.", guarantee_title_en: "Declared operating targets, confirmed after technical discovery.",
    split_a_label_ar: "التوافر والتعافي", split_a_label_en: "Availability & recovery", split_a_word_ar: "99.9%", split_a_word_en: "99.9%",
    split_a_desc_ar: "هدف تخطيطي للتوافر باستثناء الصيانة المعتمدة، مع مؤشرات إرشادية: RPO من ساعة إلى أربع ساعات، وRTO من أربع إلى ثماني ساعات لسيناريوهات الكوارث الكبرى — تُتحقق قبل أن تصبح مستويات خدمة تعاقدية.", split_a_desc_en: "A planning target for availability excluding approved maintenance, with indicative RPO of 1–4 hours and RTO of 4–8 hours for major disasters — validated before becoming contractual service levels.",
    split_b_label_ar: "النطاق", split_b_label_en: "Scale", split_b_word_ar: "+500 ألف", split_b_word_en: "500K+",
    split_b_desc_ar: "أساس تخطيطي لأكثر من 500,000 حساب مسجل و10–25 ألف جلسة متزامنة في الذروة، قابل للتوسع إلى ملايين سجلات البيانات الوصفية — افتراضات تصميمية تُتحقق بالاختبار.", split_b_desc_en: "A planning basis of 500,000+ registered accounts and 10–25K concurrent peak sessions, scalable to millions of metadata records — design assumptions validated by testing.",
    quote_ar: "أي تكرار للبيانات خارج بيئة الإنتاج الأساسية يخضع لموافقة الوزارة ومتطلبات إقامة البيانات والخصوصية والأمن السيبراني المطبقة.",
    quote_en: "Any replication of data outside the core production environment is subject to Ministry approval and the applicable data-residency, privacy and cybersecurity requirements.",
    audiences: [
      { key: "researcher", items_ar: ["ملفاتك مشفرة، وسياسة سرية واضحة عند إحالتها لخبير", "مسؤوليتك عن المحتوى والبيانات موضحة في كل خدمة"], items_en: ["Your files encrypted, with a clear confidentiality policy when referred to an expert", "Your responsibility for content and data stated in every service"] },
      { key: "university", items_ar: ["ترى ما تم تصديره أو مشاركته وفق السياسة المعتمدة", "ملكية المصدر الأصلي تبقى للجامعة"], items_en: ["You see what was exported or shared under the approved policy", "Ownership of the original source stays with the university"] },
      { key: "ministry", items_ar: ["حوكمة البيانات الرئيسية والتحقق وإزالة التكرار وتتبع النسب", "صلاحيات بحسب الدور لكل وحدة وزارية"], items_en: ["Master data governance, validation, de-duplication and lineage tracking", "Role-based permissions for every Ministry unit"] },
    ],
  },
};

export const PILLAR_AUDIENCE_LABELS = {
  researcher: { ar: "الباحث", en: "Researcher" },
  university: { ar: "الجامعة", en: "University" },
  ministry: { ar: "الوزارة", en: "Ministry" },
};
