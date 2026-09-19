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

// =========================================================
// الطبقات التشغيلية الثلاث (المقترح، جدول "طبقة التشغيل / الدور"):
// المنصة الرقمية · خدمات الذكاء الاصطناعي · شبكة الخبراء.
// تُعرض في الصفحة الرئيسية (أكورديون "عن SOURCE") ولكل طبقة صفحتها
// الداخلية على نفس قالب الركائز (/pillar/:key).
// =========================================================
export const LAYER_ORDER = ["platform", "ai_services", "experts"];

export const LAYERS = {
  platform: {
    group: "layer",
    number: "01",
    image: "/Home/layer-platform.jpg",
    hero_image: "/Home/layer-platform-hero.jpg", // صورة هيرو صفحة الطبقة فقط (الكارد بالرئيسية يبقى بالصورة الأولى)
    name_ar: "المنصة الرقمية", name_en: "Digital platform",
    card_desc_ar: "بيئة التشغيل الأساسية للمستخدمين والسجلات البحثية والمشاريع ومسارات النشر والخدمات والمستودعات ولوحات المعلومات والتحليلات والتكاملات.",
    card_desc_en: "The core operating environment for users, research records, projects, publication pipelines, services, repositories, dashboards, analytics and integrations.",
    title_pre_ar: "البيئة التشغيلية التي تجمع ", title_em_ar: "رحلة البحث في مسار واحد.",
    title_pre_en: "One operating environment ", title_em_en: "for everything research.",
    intro_ar: "تدير المنصة الرقمية ما يرتبط بالعمل البحثي من حسابات وصلاحيات، سجلات ومشاريع، مسارات خدمات ونشر، مستودعات، لوحات معلومات وتحليلات وتكاملات. وتتيح متابعة هذه العناصر ضمن سجل مترابط وقابل للتتبع، بدلاً من التعامل معها كعمليات منفصلة.",
    intro_en: "The digital platform is the layer everyone works on: user accounts and roles, research records and projects, publication pipelines and services, repositories, dashboards, analytics and integrations — in one place linking the researcher to their university and the university to the Ministry.",
    what_title_ar: "الطبقة التشغيلية المشتركة بين الباحث والجامعة والوزارة.",
    what_title_en: "The layer researchers, universities and the Ministry all work on.",
    what_desc_ar: "بيئة تشغيل موحدة لإدارة المستخدمين والسجلات البحثية والمشاريع ومسارات النشر والخدمات والمستودعات ولوحات المعلومات والتحليلات والتكاملات. ولا تستبدل أنظمة الجامعات القائمة، بل تعمل كطبقة تكامل تربطها ضمن إطار وطني واحد.",
    what_desc_en: "The core operating environment for users, research records, projects, publication pipelines, services, repositories, dashboards, analytics and integrations — it does not replace existing university systems; it works as a national integration layer above them.",
    verbs: [
      { verb_ar: "يستضيف", verb_en: "Hosts", label_ar: "المستخدمين والسجلات البحثية", label_en: "Users and research records", desc_ar: "حسابات وصلاحيات بحسب الدور، من الطالب والباحث إلى الكلية والجامعة والوزارة، مع سجل بحثي مستمر يرافق النشاط البحثي عبر مراحله المختلفة.", desc_en: "An account for every role (student, researcher, college, university, Ministry) and one research record that travels with its owner through every stage." },
      { verb_ar: "يشغّل", verb_en: "Runs", label_ar: "المشاريع ومسارات النشر والخدمات", label_en: "Projects, publication pipelines and services", desc_ar: "مسارات عمل تنظم انتقال البحث بين مراحله، وتفعّل الخدمات بحسب احتياج الباحث ومرحلة العمل البحثي.", desc_en: "Workflows that move status automatically between stages, and services that activate by the researcher's level and the research stage." },
      { verb_ar: "يعرض", verb_en: "Surfaces", label_ar: "المستودعات واللوحات والتحليلات", label_en: "Repositories, dashboards and analytics", desc_ar: "مستودعات موثقة، ولوحات معلومات على مستويات الباحث والقسم والكلية والجامعة والوزارة، إلى جانب التحليلات والتكاملات المعتمدة مع الأنظمة ذات العلاقة.", desc_en: "Documented repositories, dashboards for university, college, department and researcher, and integrations with Ministry and university systems and researcher identifiers." },
    ],
    components_title_ar: "ما الذي تحتويه المنصة الرقمية.", components_title_en: "What the digital platform contains.",
    components: [
      { title_ar: "المستخدمون والسجلات والمشاريع", title_en: "Users, records & projects", desc_ar: "حسابات وصلاحيات بحسب الدور، سجلات بحثية موثقة، ومشاريع تُدار ضمن مراحل وحالات واضحة.", desc_en: "Accounts with roles and permissions, verified research profiles, and projects with clear stages and statuses." },
      { title_ar: "مسارات النشر والخدمات", title_en: "Publication pipelines & services", desc_ar: "مسارات عمل تدعم تطور البحث من المراحل الأولى وحتى النشر وما بعده، مع خدمات تتفعّل بحسب احتياج الباحث ومرحلة البحث.", desc_en: "A full publication pipeline from draft to post-publication, and a services catalogue that scales with the researcher's level." },
      { title_ar: "المستودعات واللوحات والتكاملات", title_en: "Repositories, dashboards & integrations", desc_ar: "تخزين منظم وآمن للملفات، لوحات معلومات وتحليلات على مختلف المستويات، وتكاملات موثقة مع الأنظمة المعتمدة.", desc_en: "Secure document storage, dashboards and analytics for every level, and documented APIs for integration." },
    ],
    how_title_ar: "من الحساب إلى اللوحة — ضمن مسار مترابط.", how_title_en: "From account to dashboard — in one environment.",
    steps: [
      { title_ar: "الحساب والدور", title_en: "Account & role", desc_ar: "يدخل المستخدم بحسب دوره، فتظهر له الصلاحيات والأدوات المرتبطة به.", desc_en: "The user registers with their role and gets their tools and permissions." },
      { title_ar: "السجل البحثي", title_en: "Research record", desc_ar: "تتطور الفكرة إلى مشروع ثم إلى بحث منشور، ويُحفظ المسار ضمن سجل بحثي مستمر.", desc_en: "Idea → project → manuscript → publication, in one record." },
      { title_ar: "المسار والخدمة", title_en: "Pipeline & service", desc_ar: "تتفعّل الخدمات بحسب مرحلة البحث واحتياج المستخدم، وتُوثَّق مخرجاتها ضمن السجل.", desc_en: "Services activate by stage and their outcomes are documented in the record." },
      { title_ar: "اللوحة والتحليل", title_en: "Dashboard & analytics", desc_ar: "تغذي البيانات لوحات القسم والكلية والجامعة والوزارة، دون الحاجة إلى إعادة إدخالها في كل مستوى.", desc_en: "The record flows into college, university and Ministry dashboards with no re-entry.", highlight: true },
    ],
    guarantee_kicker_ar: "الضمانة", guarantee_kicker_en: "The guarantee",
    guarantee_title_ar: "تكامل واضح، وصلاحيات محددة، ومشاركة بيانات محكومة.", guarantee_title_en: "Each level's data stays where it is; only what is authorised is shared.", guarantee_desc_ar: "تتكامل SOURCE مع أنظمة الجامعات ضمن صلاحيات وحوكمة واضحة، وتُدار مشاركة البيانات وفق ما تعتمده الوزارة والمؤسسات المشاركة.", guarantee_desc_en: "SOURCE integrates with university systems under clear permissions and governance, and data sharing is managed as approved by the Ministry and participating institutions.",
    split_a_label_ar: "المنصة", split_a_label_en: "The platform", split_a_word_ar: "تستضيف", split_a_word_en: "Hosts",
    split_a_desc_ar: "السجلات والخدمات واللوحات ضمن بيئة تشغيل واحدة، مع صلاحيات بحسب الدور وإمكانية تتبع الوصول والتغييرات.", split_a_desc_en: "Records, services and dashboards in one environment with role-based permissions and full audit trails.",
    split_b_label_ar: "أنظمة الجامعات", split_b_label_en: "University systems", split_b_word_ar: "تتكامل", split_b_word_en: "Integrate",
    split_b_desc_ar: "تبقى أنظمة الجامعات القائمة جزءاً من بيئتها المؤسسية، وتتصل بـ SOURCE من خلال تكاملات ومزامنة مضبوطة وفق ما يتم اعتماده في مرحلة التنفيذ.", split_b_desc_en: "Existing university systems remain as they are and connect to the platform through APIs and controlled synchronisation.", split_c_label_ar: "مصادر البيانات", split_c_label_en: "Data sources", split_c_word_ar: "تُغذّي", split_c_word_en: "Feed in", split_c_desc_ar: "تستقبل SOURCE البيانات من المستخدمين والجامعات، إلى جانب البيانات والمصادر المعتمدة على مستوى الوزارة، بما يتيح بناء صورة بحثية أكثر ترابطاً دون افتراض أن جميع البيانات تُدار من مصدر واحد.", split_c_desc_en: "SOURCE receives data from users and universities alongside approved Ministry-level data and sources, building a more connected research picture without assuming all data is managed from a single source.",
    quote_ar: "المنصة الرقمية هي بيئة التشغيل التي تربط المستخدمين والسجلات والمشاريع والخدمات والبيانات والتحليلات ضمن إطار وطني متكامل ومحكوم.",
    quote_en: "The digital platform is the core operating environment for users, research records, projects, publication pipelines, services, repositories, dashboards, analytics and integrations.", who_title_ar: "كيف تخدم المنصة الرقمية كل مستوى؟",
    audiences: [
      { key: "researcher", items_ar: ["مسار موحد لإدارة البحث والخدمات من الفكرة إلى النشر وما بعده", "ملف بحثي مستمر يجمع النشاط والمخرجات والخدمات في مكان واحد"], items_en: ["One account and one research profile for everything they publish and request", "A publication pipeline whose services activate by stage"] },
      { key: "university", items_ar: ["متابعة الأداء البحثي على مستوى الباحث والقسم والكلية والجامعة", "تكامل مع الأنظمة القائمة دون استبدالها، مع وصول أوضح للبيانات والتحليلات"], items_en: ["University, college and department dashboards from the same record", "Integration with existing systems, no replacement"] },
      { key: "ministry", items_ar: ["وصول منظم إلى البيانات والمؤشرات المعتمدة على المستوى الوطني", "لوحات وتحليلات تدعم متابعة الأداء والأولويات واتجاهات البحث"], items_en: ["A national picture arriving from universities through integrations", "Repositories and analytics with documented sources"] },
    ],
  },

  ai_services: {
    group: "layer",
    number: "02",
    image: "/Home/layer-ai.jpg",
    name_ar: "خدمات الذكاء الاصطناعي", name_en: "AI services",
    card_desc_ar: "مساعدون بحثيون ووكلاء تحليليون ضمن حوكمة واضحة يدعمون تطوير البحث وتقييم الجودة ومواءمة المجلات وتحليل الأداء ودعم القرار، مع إشراف بشري عند الحاجة.",
    card_desc_en: "Research assistants and analytical agents under clear governance that support research development, quality assessment, journal matching, performance analysis and decision support — with human oversight where needed.",
    title_pre_ar: "دعم ذكي للبحث والتحليل، ", title_em_ar: "مع بقاء القرار للإنسان.",
    title_pre_en: "Research assistants and analytical agents — ", title_em_en: "with people having the final say.",
    intro_ar: "تعمل هذه الطبقة على مهام محددة تدعم الباحث والمؤسسة، مثل تحليل الفجوات، تقييم جاهزية البحث، مواءمة المجلات، تحليل الأداء، واقتراح الباحثين أو الفرق المناسبة بحسب الحاجة. تعمل الخدمات ضمن حوكمة واضحة وصلاحيات محددة، وتبقى المخرجات الأعلى تأثيراً خاضعة للمراجعة البشرية. لا تُعرض نتائج الذكاء الاصطناعي كحكم أكاديمي نهائي، بل كأداة مساندة للبحث والتحليل واتخاذ القرار.",
    intro_en: "A governed AI layer: it suggests, analyses, assesses readiness, matches journals, analyses performance and supports decisions — under clear governance and with human oversight where needed. No AI output is ever presented as a final academic verdict.",
    what_title_ar: "ذكاء اصطناعي يدعم كل مستوى، دون أن يحل محل الحكم البشري.",
    what_title_en: "AI that serves every level — and decides for no one.",
    what_desc_ar: "تضم هذه الطبقة مساعدين بحثيين للباحث، ووكلاء تحليليين للجامعة والوزارة، لتنفيذ مهام محددة مثل تحليل الفجوات، تقييم الجاهزية، مواءمة المجلات، وتحليل الأداء، ضمن حوكمة واضحة ومخرجات قابلة للمراجعة والتتبع.",
    what_desc_en: "Research assistants for the researcher (idea, gap, methodology, readiness, journal matching) and analytical agents for the university and the Ministry (performance and gap analysis, decision support) — all under clear governance, with every output traceable to its source.",
    verbs: [
      { verb_ar: "يطوّر", verb_en: "Develops", label_ar: "البحث وجودة مخرجاته", label_en: "Research from idea to manuscript", desc_ar: "يساعد في تحليل الفكرة والفجوة البحثية، وتحديد نقاط القوة والتحسين، ودعم الباحث خلال مراحل تطوير البحث.", desc_en: "Idea and research-gap analysis, methodology, references and language review, and an early assessment before investing more time." },
      { verb_ar: "يقيّم", verb_en: "Assesses", label_ar: "الجاهزية وملاءمة مسارات النشر", label_en: "Quality, readiness and journal fit", desc_ar: "يدعم تقييم جاهزية البحث للنشر، ومقارنة المجلات المحتملة، وفحص مدى توافق البحث مع نطاق المجلة ومتطلباتها.", desc_en: "A single submission-readiness score, journal matching with a fit score, and compliance checks against journal requirements." },
      { verb_ar: "يحلّل", verb_en: "Supports", label_ar: "الأداء والفجوات والفرص", label_en: "Performance analysis and decision support", desc_ar: "يساعد الجامعات والوزارة على قراءة مؤشرات الأداء، رصد الفجوات والاتجاهات، ودعم التحليل الذي تستند إليه القرارات والخطط.", desc_en: "For the university: data-driven indicators and improvement plans. For the Ministry: priority-gap analysis and traceable recommendations." },
    ],
    components_title_ar: "مكوّنات طبقة الذكاء الاصطناعي", components_title_en: "The components of the AI layer.",
    components: [
      { title_ar: "المساعدون البحثيون", title_en: "Research assistants", desc_ar: "أدوات ذكية تدعم الباحث في تحليل الفكرة والفجوة، تقييم الجاهزية، مواءمة المجلات، وتطوير بعض عناصر البحث خلال مراحله المختلفة.", desc_en: "An assistant inside the researcher's account for titles and introductions, gap analysis, readiness assessment and journal matching." },
      { title_ar: "الوكلاء التحليليون", title_en: "Analytical agents", desc_ar: "تحلل مؤشرات الأداء والفجوات والاتجاهات على مستوى الجامعة والكلية والقسم، وتدعم قراءة الصورة الوطنية مقارنة بالأولويات البحثية.", desc_en: "Analysis of university, college and department performance, and of the national picture and the gaps between priorities and actual output." },
      { title_ar: "الحوكمة والإشراف البشري", title_en: "Governance & human oversight", desc_ar: "صلاحيات واضحة، ومخرجات قابلة للمراجعة والتتبع، مع إبقاء القرارات الأكاديمية والمؤسسية الأعلى تأثيراً خاضعة للمراجعة البشرية.", desc_en: "Clear permissions, a log of every output and its source, and expert human review where needed before any action." },
    ],
    how_title_ar: "من الطلب إلى نتيجة قابلة للمراجعة والتتبع.", how_title_en: "From request to documented result.",
    steps: [
      { title_ar: "الطلب", title_en: "Request", desc_ar: "يطلب الباحث أو الجامعة تحليلاً أو تقييماً من داخل المنصة.", desc_en: "The researcher or university requests an analysis or assessment from inside the platform." },
      { title_ar: "التحليل الآلي", title_en: "Automated analysis", desc_ar: "يعمل المساعد أو الوكيل على البيانات المصرّح باستخدامها، ويُنتج مخرجات مبنية على البيانات المتاحة.", desc_en: "The assistant or agent works on authorised data and produces a reasoned result." },
      { title_ar: "الإشراف البشري", title_en: "Human oversight", desc_ar: "تُراجع المخرجات من خبير عند الحاجة، أو عندما ترتبط بقرار أكاديمي أو مؤسسي أعلى تأثيراً.", desc_en: "The result is reviewed by an expert where needed or when it touches an academic decision." },
      { title_ar: "النتيجة الموثقة", title_en: "Documented result", desc_ar: "تُحفظ المخرجات ضمن السجل مع مصدرها وتاريخها، بحيث تبقى قابلة للمراجعة والتتبع ولا تُعامل كحكم أكاديمي نهائي.", desc_en: "The result is saved in the research record with its source and date — never as a final verdict.", highlight: true },
    ],
    guarantee_kicker_ar: "الضمانة", guarantee_kicker_en: "The guarantee",
    guarantee_title_ar: "الذكاء الاصطناعي يدعم القرار، ولا يستبدله.", guarantee_title_en: "No AI output is ever presented as a final academic verdict.",
    split_a_label_ar: "الذكاء الاصطناعي", split_a_label_en: "The AI", split_a_word_ar: "يقترح", split_a_word_en: "Suggests",
    split_a_desc_ar: "يحلّل ويرشّح ويقيّم الجاهزية ويوائم الخيارات، مع ربط المخرجات بالبيانات والمصادر التي استندت إليها.", split_a_desc_en: "It recommends, analyses, assesses and matches — explaining every result and linking it to its source.",
    split_b_label_ar: "الخبير والمشرف", split_b_label_en: "Experts & supervisors", split_b_word_ar: "يقرّر", split_b_word_en: "Decides",
    split_b_desc_ar: "تبقى القرارات الأكاديمية والمهنية لدى المشرفين والخبراء والمحكّمين وهيئات التحرير، ولا تضمن SOURCE قبول أي بحث للنشر.", split_b_desc_en: "Academic decisions belong to the supervisor, reviewer and editorial board, and acceptance to the journal — the platform never guarantees it and the AI never decides it.",
    quote_ar: "مخرجات الذكاء الاصطناعي أدوات مساندة للبحث والتحليل، وليست أحكاماً أكاديمية نهائية.",
    quote_en: "No AI output is presented as a final academic verdict, and SOURCE never guarantees acceptance in any journal — acceptance is the journal's and its editorial board's decision.", who_title_ar: "كيف تدعم خدمات الذكاء الاصطناعي كل مستوى؟",
    audiences: [
      { key: "researcher", items_ar: ["تقييم مبكر للفكرة والمنهجية وتحديد نقاط التحسين", "دعم في مواءمة المجلات وتقييم الجاهزية للنشر"], items_en: ["Early assessment of idea and methodology before investing more time", "Journal matching and a single submission-readiness score"] },
      { key: "university", items_ar: ["تحليل الأداء البحثي ورصد الفجوات والاتجاهات", "دعم متابعة مؤشرات الجودة والاعتماد والجاهزية للتصنيفات"], items_en: ["Performance analysis and data-driven improvement plans", "Accreditation and ranking readiness indicators"] },
      { key: "ministry", items_ar: ["تحليل الفجوة بين الأولويات الوطنية وما يُنتَج فعلياً", "قراءات وتحليلات تدعم توجيه الأولويات والقرارات"], items_en: ["Gap analysis between priorities and actual output", "Traceable recommendations that support decisions"] },
    ],
  },

  experts: {
    group: "layer",
    number: "03",
    image: "/Home/layer-experts.jpg",
    hero_image: "/Home/layer-experts-hero.jpg", // صورة هيرو صفحة الطبقة فقط (الكارد بالرئيسية يبقى بالصورة الأولى)
    hero_image_pos: "center 38%", // الصورة طولية — نُظهر الشاشة ورؤوس الأشخاص
    name_ar: "شبكة الخبراء", name_en: "Expert network",
    card_desc_ar: "وصول مُدار إلى المراجعين والخبراء المتخصصين وخبراء المنهجية والإحصائيين والمحررين والمترجمين ومستشاري النشر وخبراء الابتكار والملكية الفكرية.",
    card_desc_en: "Managed access to reviewers, subject experts, methodologists, statisticians, editors, translators, publication advisors and innovation & IP experts.",
    title_pre_ar: "خبرة بشرية متخصصة، ", title_em_ar: "متاحة ضمن المنظومة عند الحاجة.",
    title_pre_en: "A managed expert network, ", title_em_en: "not a list of names.",
    intro_ar: "تتيح SOURCE الوصول إلى شبكة من الخبرات المتخصصة في المراجعة العلمية، والمنهجية، والإحصاء، والتحرير والترجمة، والنشر، والابتكار، والملكية الفكرية. وتُدار الاستعانة بالخبير من داخل المنصة بحسب نوع الحاجة والمرحلة البحثية، بما يضمن وضوح الدور وربط الخبرة بالخدمة المطلوبة.",
    intro_en: "Specialised human expertise reaches the researcher and the university from inside the platform: reviewers and subject experts, methodologists and statisticians, editors and translators, publication advisors, and innovation & IP experts — every expert registered, accredited and rated, with access managed by clear criteria.",
    what_title_ar: "طبقة خبرة بشرية متخصصة تُستدعى بحسب الحاجة.",
    what_title_en: "The layer that adds human expertise after AI — where it is needed.",
    what_desc_ar: "تتيح الشبكة الوصول إلى مراجعين وخبراء متخصصين، وخبراء منهجية وإحصاء، ومحررين ومترجمين، ومستشاري نشر، وخبراء في الابتكار والملكية الفكرية. ويُوجَّه الطلب إلى الخبرة الأنسب بحسب نوع الخدمة والمرحلة البحثية، مع بقاء دور الخبير جزءاً مكملاً للخدمات الرقمية والذكاء الاصطناعي.",
    what_desc_en: "Managed access to reviewers, subject experts, methodologists, statisticians, editors, translators, publication advisors and innovation & IP experts — the right expert is matched to the request, the work is delivered and tracked from the expert's dashboard, and a reliability record builds over time.",
    verbs: [
      { verb_ar: "يحكّم", verb_en: "Reviews", label_ar: "مراجعون وخبراء متخصصون ومنهجيون وإحصائيون", label_en: "Reviewers, subject experts, methodologists and statisticians", desc_ar: "مراجعة علمية متخصصة، ودعم في المنهجية والإحصاء، حيث تتطلب الخدمة حكماً وخبرة بشرية.", desc_en: "Specialised scientific review, methodology assessment, and statistician-supervised analysis." },
      { verb_ar: "يحرّر", verb_en: "Edits", label_ar: "محررون ومترجمون ومستشارو نشر", label_en: "Editors, translators and publication advisors", desc_ar: "تحرير علمي ولغوي، ترجمة أكاديمية، ودعم في اختيار مسارات النشر والاستعداد للتقديم.", desc_en: "Language editing and scientific editing, academic translation that preserves terminology, and a publication strategy with a journal portfolio." },
      { verb_ar: "يدعم الابتكار", verb_en: "Protects", label_ar: "خبراء الابتكار والملكية الفكرية", label_en: "Innovation and IP experts", desc_ar: "دعم متخصص في الابتكار، والملكية الفكرية، ومسارات تطوير المخرجات البحثية ذات الصلة.", desc_en: "Guidance on patents, protecting research outputs and turning them into innovation." },
    ],
    components_title_ar: "من تضم شبكة الخبراء", components_title_en: "Who the expert network includes.",
    components: [
      { title_ar: "التحكيم والمنهجية والإحصاء", title_en: "Review, methodology & statistics", desc_ar: "مراجعون متخصصون، وخبراء منهجية، وإحصائيون يقدمون مراجعة ودعماً متخصصاً بحسب طبيعة البحث واحتياجه.", desc_en: "Reviewers in every field, methodologists, and statisticians supervising analysis." },
      { title_ar: "التحرير والترجمة والنشر", title_en: "Editing, translation & publishing", desc_ar: "محررون علميون ولغويون، ومترجمون أكاديميون، ومستشارو نشر يدعمون الباحث في تحسين جودة العمل والاستعداد للتقديم والنشر.", desc_en: "Scientific and language editors, academic translators, and publication advisors accompanying the researcher to acceptance." },
      { title_ar: "الابتكار والملكية الفكرية", title_en: "Innovation & IP", desc_ar: "خبراء في الابتكار والملكية الفكرية يقدمون دعماً متخصصاً في تطوير المخرجات البحثية ومسارات حمايتها واستثمارها.", desc_en: "Patent and IP experts and specialists in turning research outputs into value." },
    ],
    how_title_ar: "من الطلب إلى تنفيذ الخدمة — ضمن مسار مُدار داخل المنصة.", how_title_en: "From request to delivery — with access managed by the platform.",
    steps: [
      { title_ar: "الطلب", title_en: "Request", desc_ar: "يطلب الباحث أو الجامعة خدمة خبير بحسب نوع الحاجة البحثية.", desc_en: "The researcher or university requests an expert service from the services catalogue." },
      { title_ar: "المطابقة", title_en: "Matching", desc_ar: "تُوجّه الخدمة إلى الخبير الأنسب وفق التخصص وطبيعة الطلب ومتطلبات الخدمة.", desc_en: "The platform matches the right expert by field, experience and performance record." },
      { title_ar: "التنفيذ والمتابعة", title_en: "Delivery & tracking", desc_ar: "ينفّذ الخبير المهمة المطلوبة، وتُتابَع حالة الخدمة ومخرجاتها من داخل المنصة.", desc_en: "The expert delivers from their own dashboard and the status is tracked inside the platform." },
      { title_ar: "التسليم والمراجعة", title_en: "Handover & rating", desc_ar: "تُسلَّم المخرجات وتُراجع بحسب نوع الخدمة، مع توثيق ما تم إنجازه ضمن السجل المرتبط بالطلب.", desc_en: "The work is handed over and rated, building the expert's reliability record over time.", highlight: true },
    ],
    guarantee_kicker_ar: "الضمانة", guarantee_kicker_en: "The guarantee",
    guarantee_title_ar: "خبرة بشرية مؤهلة، والوصول إليها يتم ضمن إطار واضح ومُدار.", guarantee_title_en: "Every expert is registered, accredited and rated — and access is managed inside the platform, not outside it.",
    split_a_label_ar: "المنصة", split_a_label_en: "The platform", split_a_word_ar: "تدير", split_a_word_en: "Manages",
    split_a_desc_ar: "طلبات الخبرة، توجيهها بحسب التخصص والحاجة، ومتابعة حالة الخدمة ومخرجاتها داخل المنصة.", split_a_desc_en: "Expert registration and accreditation, request matching, status tracking, rating and the reliability record.",
    split_b_label_ar: "الخبير", split_b_label_en: "The expert", split_b_word_ar: "ينفّذ", split_b_word_en: "Delivers",
    split_b_desc_ar: "يقدم المراجعة أو الدعم المتخصص المطلوب، وتبقى مخرجاته مرتبطة بالخدمة والسجل البحثي ذي الصلة.", split_b_desc_en: "Receives requests and delivers work from a dedicated dashboard, communicating directly with the researcher and university inside the platform.", split_c_label_ar: "الدور البشري", split_c_label_en: "The human role", split_c_word_ar: "يبقى أساسياً", split_c_word_en: "Stays central", split_c_desc_ar: "تُستخدم شبكة الخبراء في المهام التي تتطلب حكماً مهنياً أو أكاديمياً لا ينبغي أن يعتمد فيها على الذكاء الاصطناعي وحده.", split_c_desc_en: "The expert network is used for tasks that require professional or academic judgement that should not rely on AI alone.",
    quote_ar: "",
    quote_en: "Value reaches the researcher through three levels of enablement: capability through training, expertise through writing and review, and opportunity through networking and publishing.", who_title_ar: "كيف تدعم شبكة الخبراء كل مستوى؟",
    audiences: [
      { key: "researcher", items_ar: ["وصول إلى خبرات متخصصة في التحكيم والمنهجية والإحصاء والتحرير والترجمة والنشر", "دعم بشري في المراحل التي تحتاج حكماً أكاديمياً أو مهنياً متخصصاً"], items_en: ["Review, editing and translation from accredited experts in their field", "A publication advisor accompanying them to acceptance"] },
      { key: "university", items_ar: ["إمكانية الاستفادة من خبرات متخصصة لدعم الأبحاث والكليات بحسب الحاجة", "قناة منظمة لطلب الخبرة ومتابعة الخدمات المرتبطة بها من داخل المنصة"], items_en: ["Methodologists and statisticians supporting college research", "Expert requests for the whole university tracked in one place"] },
      { key: "ministry", items_ar: ["إتاحة خبرات متخصصة يمكن الاستفادة منها في الأولويات والبرامج البحثية الوطنية", "دعم في مجالات الابتكار والملكية الفكرية ونقل المعرفة عند الحاجة"], items_en: ["A national expert network with documented performance", "Innovation and IP experts turning outputs into value"] },
    ],
  },
};

export const PILLAR_AUDIENCE_LABELS = {
  researcher: { ar: "الباحث", en: "Researcher" },
  university: { ar: "الجامعة", en: "University" },
  ministry: { ar: "الوزارة", en: "Ministry" },
};
