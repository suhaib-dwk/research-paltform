// =========================================================
// تفاصيل مساحات الوزارة الأربع: أرقام حقيقية منشورة + المؤشرات + دور الذكاء الاصطناعي.
// - summary: 4 أرقام + رسم واحد تظهر بجانب كل مساحة في /audience/ministry
// - stats:   الأرقام الكاملة + الرسوم في الصفحة التفصيلية /ministry-space/:slug
// المصادر لا تُعرض على الموقع (نفس نهج homeStats.js):
//  [OpenAlex] الأعمال المنتسبة لمؤسسات ليبية 2020–2025 (استُعلم في 2026-09):
//    المجموع:   https://api.openalex.org/works?filter=institutions.country_code:LY,publication_year:2020-2025
//    بالسنة:    …&group_by=publication_year
//    بالمجال:   …&group_by=primary_topic.field.id
//    بالدول:    …&group_by=authorships.countries
//    متعدد الدول: …,countries_distinct_count:>1   (النِّسب محسوبة: متعدد الدول ÷ المجموع)
//    بالممول:   …&group_by=funders.id  ،  وجود ممول: …,funders.id:!null
//    المؤسسات:  https://api.openalex.org/institutions?filter=country_code:LY  (57)
//  [SCImago] / [UNICEF-NCESD] / [QS-2026] / [LEP] — انظر src/source/S01_Home/homeStats.js
//  ملاحظة: أرقام OpenAlex تشمل كل أنواع الأعمال، لذا تختلف عن سلسلة Scopus (SCImago).
// =========================================================
import { HOME_STATS } from "../S01_Home/homeStats";
import { buildForecast, herfindahl, fmt } from "./forecast";

const uni = HOME_STATS.university;
const tile = (value, label_ar, label_en) => ({ value, label_ar, label_en });

// ── 01 البيانات والذكاء البحثي الوطني ──
const OUTPUT_BY_YEAR = {
  type: "bar",
  title_ar: "الأعمال البحثية المنتسبة لمؤسسات ليبية سنويًا — كل أنواع الأعمال (2020–2025)",
  title_en: "Research works affiliated with Libyan institutions per year — all work types (2020–2025)",
  unit: "",
  data: [
    { name_ar: "2020", name_en: "2020", value: 1703 },
    { name_ar: "2021", name_en: "2021", value: 2168 },
    { name_ar: "2022", name_en: "2022", value: 2015 },
    { name_ar: "2023", name_en: "2023", value: 2297 },
    { name_ar: "2024", name_en: "2024", value: 2772 },
    { name_ar: "2025", name_en: "2025", value: 4324, highlight: true },
  ],
};
const [UNI_OUTPUT, SCOPUS_BY_YEAR] = uni.charts;

// ── 02 الأولويات ──
const OUTPUT_BY_FIELD = {
  type: "bar",
  title_ar: "الإنتاج البحثي الليبي حسب المجال (2020–2025) — أكبر 8 مجالات",
  title_en: "Libyan research output by field (2020–2025) — top 8 fields",
  unit: "",
  data: [
    { name_ar: "الطب", name_en: "Medicine", value: 3603, highlight: true },
    { name_ar: "الهندسة", name_en: "Engineering", value: 2643 },
    { name_ar: "الزراعة والأحياء", name_en: "Agri & Bio", value: 1140 },
    { name_ar: "الحاسوب", name_en: "Computing", value: 1101 },
    { name_ar: "الاجتماعية", name_en: "Social sci.", value: 921 },
    { name_ar: "البيئة", name_en: "Environment", value: 818 },
    { name_ar: "الوراثة والجزيئية", name_en: "Biochem", value: 579 },
    { name_ar: "الإدارة", name_en: "Business", value: 446 },
  ],
};
const STRATEGIC_FIELDS = {
  type: "bar",
  title_ar: "مجالات مرتبطة بالمياه والغذاء والطاقة والموارد — حجم الإنتاج (2020–2025)",
  title_en: "Fields linked to water, food, energy and resources — output volume (2020–2025)",
  unit: "",
  data: [
    { name_ar: "الزراعة والأحياء", name_en: "Agri & Bio", value: 1140 },
    { name_ar: "البيئة", name_en: "Environment", value: 818 },
    { name_ar: "الطاقة", name_en: "Energy", value: 234, highlight: true },
    { name_ar: "علوم الأرض", name_en: "Earth sci.", value: 231 },
    { name_ar: "الاقتصاد", name_en: "Economics", value: 222 },
    { name_ar: "البيطرة", name_en: "Veterinary", value: 42 },
    { name_ar: "الهندسة الكيميائية", name_en: "Chem. eng.", value: 35 },
  ],
};

// ── 03 الشراكات ──
const TOP_PARTNERS = {
  type: "bar",
  title_ar: "أكثر الدول مشاركةً في تأليف الأبحاث الليبية (2020–2025، عدد الأعمال)",
  title_en: "Top co-authoring countries of Libyan research (2020–2025, works)",
  unit: "",
  data: [
    { name_ar: "مصر", name_en: "Egypt", value: 1861, highlight: true },
    { name_ar: "أمريكا", name_en: "USA", value: 1433 },
    { name_ar: "بريطانيا", name_en: "UK", value: 1116 },
    { name_ar: "السعودية", name_en: "Saudi", value: 1023 },
    { name_ar: "ماليزيا", name_en: "Malaysia", value: 911 },
    { name_ar: "الهند", name_en: "India", value: 517 },
    { name_ar: "إندونيسيا", name_en: "Indonesia", value: 507 },
    { name_ar: "الأردن", name_en: "Jordan", value: 472 },
  ],
};
const COLLAB_SHARE = {
  type: "bar",
  title_ar: "نسبة الأبحاث الليبية المشتركة مع دولة أخرى على الأقل — سنويًا (%)",
  title_en: "Share of Libyan works co-authored with at least one other country — per year (%)",
  unit: "%",
  data: [
    { name_ar: "2020", name_en: "2020", value: 52.4 },
    { name_ar: "2021", name_en: "2021", value: 51.2 },
    { name_ar: "2022", name_en: "2022", value: 51.2 },
    { name_ar: "2023", name_en: "2023", value: 54.8, highlight: true },
    { name_ar: "2024", name_en: "2024", value: 49.1 },
    { name_ar: "2025", name_en: "2025", value: 47.0 },
  ],
};

// ── 04 التمويل ──
const TOP_FUNDERS = {
  type: "bar",
  title_ar: "أكثر الجهات الممولة ظهورًا في الأبحاث الليبية (2020–2025، عدد الأعمال)",
  title_en: "Funders most often acknowledged in Libyan research (2020–2025, works)",
  unit: "",
  data: [
    { name_ar: "جامعة الملك سعود", name_en: "King Saud Univ.", value: 83, highlight: true },
    { name_ar: "UKM ماليزيا", name_en: "UKM Malaysia", value: 62 },
    { name_ar: "Horizon 2020", name_en: "Horizon 2020", value: 54 },
    { name_ar: "المفوضية الأوروبية", name_en: "European Comm.", value: 53 },
    { name_ar: "جامعة الملك خالد", name_en: "King Khalid Univ.", value: 51 },
    { name_ar: "STDF", name_en: "STDF", value: 49 },
    { name_ar: "تعليم عالٍ ماليزيا", name_en: "MoHE Malaysia", value: 43 },
    { name_ar: "UPM ماليزيا", name_en: "UPM Malaysia", value: 41 },
  ],
};
const FUNDED_VS_NOT = {
  type: "bar",
  title_ar: "الأبحاث الليبية حسب وجود جهة ممولة مسجّلة (2020–2025)",
  title_en: "Libyan works by whether a funder is recorded (2020–2025)",
  unit: "",
  data: [
    { name_ar: "بجهة ممولة", name_en: "Funder recorded", value: 1561, highlight: true },
    { name_ar: "بلا جهة ممولة", name_en: "No funder recorded", value: 13718 },
  ],
};

export const MINISTRY_SPACE_DETAILS = {
  "data-intelligence": {
    image: "/Home/home01.jpg",
    kicker_ar: "البيانات والذكاء البحثي الوطني", kicker_en: "National research data & intelligence",
    hero_pre_ar: "صورة وطنية واحدة ", hero_pre_en: "One national picture ",
    hero_em_ar: "للبحث العلمي", hero_em_en: "of scientific research",
    hero_post_ar: " — من مصدر معروف.", hero_post_en: " — from a known source.",
    headline: [
      tile("15,279", "عملًا بحثيًا منتسبًا لمؤسسات ليبية (2020–2025)", "Works affiliated with Libyan institutions (2020–2025)"),
      tile("57", "مؤسسة ليبية مفهرسة في قواعد البيانات المفتوحة", "Libyan institutions indexed in open databases"),
      tile("25,587", "عضو هيئة تدريس", "Faculty members"),
    ],
    summary: {
      tiles: [
        tile("15,279", "عملًا بحثيًا منتسبًا لمؤسسات ليبية بين 2020 و2025", "Works affiliated with Libyan institutions, 2020–2025"),
        tile("4,324", "عملًا في 2025 وحده — الأعلى في السلسلة", "Works in 2025 alone — the highest in the series"),
        tile("1,343", "وثيقة ليبية مفهرسة في Scopus خلال 2025", "Libyan documents indexed in Scopus in 2025"),
        tile("57", "مؤسسة ليبية مفهرسة في قواعد البيانات المفتوحة", "Libyan institutions indexed in open databases"),
      ],
      charts: [OUTPUT_BY_YEAR],
    },
    stats_title_ar: "حجم المنظومة البحثية الليبية وإنتاجها.", stats_title_en: "The size and output of Libya's research system.",
    stats: {
      tiles: [
        tile("15,279", "عملًا بحثيًا منتسبًا لمؤسسات ليبية بين 2020 و2025", "Works affiliated with Libyan institutions, 2020–2025"),
        tile("4,324", "عملًا في 2025 — ارتفاع 56% عن 2024", "Works in 2025 — up 56% on 2024"),
        tile("1,343", "وثيقة ليبية مفهرسة في Scopus خلال 2025", "Libyan documents indexed in Scopus in 2025"),
        tile("57", "مؤسسة ليبية مفهرسة في قواعد البيانات المفتوحة", "Libyan institutions indexed in open databases"),
        ...uni.tiles.slice(0, 2),
        uni.tiles[4],
        uni.tiles[5],
      ],
      charts: [OUTPUT_BY_YEAR, SCOPUS_BY_YEAR, UNI_OUTPUT],
    },
    indicators: [
      { code: "D-01", name_ar: "الإنتاج البحثي الوطني", name_en: "National research output", desc_ar: "عدد المخرجات البحثية المعتمدة في فترة محددة، مصنفة حسب النوع والجامعة والمجال.", desc_en: "Approved research outputs in a period, by type, university and field.", formula_ar: "مجموع المخرجات المتحقق منها ÷ الفترة", formula_en: "Sum of verified outputs ÷ period", source_ar: "ملفات الجامعات + قواعد الفهرسة", source_en: "University profiles + indexes", freq_ar: "ربع سنوي", freq_en: "Quarterly" },
      { code: "D-02", name_ar: "إنتاجية الباحث", name_en: "Researcher productivity", desc_ar: "متوسط المخرجات لكل باحث نشط، لمقارنة عادلة بين جامعات مختلفة الحجم.", desc_en: "Average outputs per active researcher, for fair comparison across universities of different size.", formula_ar: "المخرجات ÷ الباحثون النشطون", formula_en: "Outputs ÷ active researchers", source_ar: "ملفات الباحثين", source_en: "Researcher profiles", freq_ar: "سنوي", freq_en: "Annual" },
      { code: "D-03", name_ar: "الأداء مقابل المتوسط الوطني", name_en: "Performance vs national average", desc_ar: "موقع كل جامعة أو منطقة أو تخصص مقارنة بالمتوسط الوطني للمؤشر نفسه.", desc_en: "Where each university, region or field sits against the national average of the same indicator.", formula_ar: "قيمة الجهة ÷ المتوسط الوطني × 100", formula_en: "Entity value ÷ national average × 100", source_ar: "مشتق من D-01 وD-02", source_en: "Derived from D-01 and D-02", freq_ar: "ربع سنوي", freq_en: "Quarterly" },
      { code: "D-04", name_ar: "نسبة النمو السنوي", name_en: "Annual growth rate", desc_ar: "اتجاه الإنتاج البحثي عبر السنوات لرصد المجالات الصاعدة والمتراجعة.", desc_en: "The trend of research output across years to spot rising and declining fields.", formula_ar: "(السنة الحالية − السابقة) ÷ السابقة", formula_en: "(current year − previous) ÷ previous", source_ar: "السلاسل الزمنية في القاعدة", source_en: "Time series in the database", freq_ar: "سنوي", freq_en: "Annual" },
      { code: "D-05", name_ar: "اكتمال البيانات وجودتها", name_en: "Data completeness & quality", desc_ar: "نسبة السجلات المتحقق منها والمكتملة الحقول لكل جامعة — شرط قبل أي مقارنة.", desc_en: "Share of verified, complete records per university — a precondition for any comparison.", formula_ar: "السجلات المتحقق منها ÷ كل السجلات", formula_en: "Verified records ÷ all records", source_ar: "طبقة حوكمة البيانات", source_en: "Data governance layer", freq_ar: "شهري", freq_en: "Monthly" },
      { code: "D-06", name_ar: "الوصول والظهور الدولي", name_en: "International visibility", desc_ar: "حصة المخرجات المفهرسة دوليًا ومعدلات الاستشهاد المطبّعة حسب المجال.", desc_en: "Share of internationally indexed outputs and field-normalised citation rates.", formula_ar: "المفهرس دوليًا ÷ كل المخرجات", formula_en: "Internationally indexed ÷ all outputs", source_ar: "Scopus / OpenAlex", source_en: "Scopus / OpenAlex", freq_ar: "نصف سنوي", freq_en: "Semi-annual" },
    ],
    ai_intro_ar: "يعمل الذكاء الاصطناعي فوق البيانات الموحّدة: يوحّد الأسماء، يكتشف الشذوذ، ويحوّل اللوحة إلى أسئلة وإجابات مفهومة.", ai_intro_en: "AI works on top of the unified data: it reconciles names, detects anomalies and turns the dashboard into understandable questions and answers.",
    ai: [
      { title_ar: "توحيد الكيانات", title_en: "Entity resolution", desc_ar: "مطابقة أسماء الباحثين والجامعات والمجلات المكتوبة بصيغ مختلفة بالعربية والإنجليزية.", desc_en: "Matching researcher, university and journal names written differently in Arabic and English.", output_ar: "سجل واحد لكل باحث ومؤسسة", output_en: "One record per researcher and institution" },
      { title_ar: "كشف الشذوذ", title_en: "Anomaly detection", desc_ar: "رصد القفزات غير المبررة والبيانات الناقصة أو المكررة قبل وصولها إلى اللوحة.", desc_en: "Flagging unexplained jumps and missing or duplicated data before it reaches the dashboard.", output_ar: "تنبيه جودة مع السجلات المعنية", output_en: "A quality alert with the records concerned" },
      { title_ar: "التصنيف الموضوعي", title_en: "Topic classification", desc_ar: "تصنيف الأبحاث آليًا إلى مجالات وموضوعات وقطاعات لقياس التغطية.", desc_en: "Automatically classifying research into fields, topics and sectors to measure coverage.", output_ar: "خريطة موضوعات قابلة للتدقيق", output_en: "An auditable topic map" },
      { title_ar: "سؤال بلغة طبيعية", title_en: "Natural-language questions", desc_ar: "يسأل المسؤول «ما أسرع المجالات نموًا في الجنوب؟» فيحصل على رسم وإجابة ومصدر.", desc_en: "An official asks “which fields grow fastest in the south?” and gets a chart, an answer and a source.", output_ar: "إجابة مع الرسم والمصدر", output_en: "An answer with chart and source" },
      { title_ar: "التنبؤ بالاتجاه", title_en: "Trend forecasting", desc_ar: "إسقاط مسار الإنتاج والقدرات للسنوات القادمة بنطاق ثقة واضح.", desc_en: "Projecting output and capacity for coming years with a clear confidence range.", output_ar: "توقع بنطاق ثقة", output_en: "A forecast with confidence range" },
      { title_ar: "موجز تلقائي", title_en: "Automatic briefs", desc_ar: "توليد ملخص دوري لحالة البحث العلمي يستند إلى أرقام اللوحة نفسها.", desc_en: "Generating a periodic state-of-research summary built from the dashboard's own figures.", output_ar: "مسودة تقرير للمراجعة", output_en: "A draft report for review" },
    ],
    quote_ar: "كل رقم في اللوحة يعود إلى مصدره: جامعة، سنة، وحدة، أو سجل رسمي.", quote_en: "Every figure on the dashboard traces back to its source: university, year, unit or official record.",
  },

  priorities: {
    image: "/Home/home05.jpg",
    kicker_ar: "الأولويات البحثية الوطنية", kicker_en: "National research priorities",
    hero_pre_ar: "من احتياجات الدولة ", hero_pre_en: "From national needs ",
    hero_em_ar: "إلى أسئلة بحثية", hero_em_en: "to research questions",
    hero_post_ar: " — وقياس الفجوة بينهما.", hero_post_en: " — and measuring the gap between them.",
    headline: [
      tile("23.6%", "من الإنتاج البحثي الليبي في الطب", "Of Libyan research output is in medicine"),
      tile("1.5%", "فقط في مجال الطاقة", "Only in energy"),
      tile("26", "مجالًا علميًا يغطيها الإنتاج الليبي", "Scientific fields covered by Libyan output"),
    ],
    summary: {
      tiles: [
        tile("3,603", "عملًا في الطب — 23.6% من الإنتاج (2020–2025)", "Works in medicine — 23.6% of output (2020–2025)"),
        tile("2,643", "عملًا في الهندسة — ثاني أكبر مجال", "Works in engineering — the second-largest field"),
        tile("818", "عملًا في العلوم البيئية — 5.4% من الإنتاج", "Works in environmental science — 5.4% of output"),
        tile("234", "عملًا فقط في الطاقة — 1.5% من الإنتاج", "Works in energy only — 1.5% of output"),
      ],
      charts: [OUTPUT_BY_FIELD],
    },
    stats_title_ar: "أين يتركز البحث الليبي — وأين تظهر الفجوات.", stats_title_en: "Where Libyan research concentrates — and where the gaps show.",
    stats: {
      tiles: [
        tile("3,603", "عملًا في الطب — 23.6% من الإنتاج (2020–2025)", "Works in medicine — 23.6% of output (2020–2025)"),
        tile("2,643", "عملًا في الهندسة — 17.3% من الإنتاج", "Works in engineering — 17.3% of output"),
        tile("1,140", "عملًا في العلوم الزراعية والبيولوجية — 7.5%", "Works in agricultural & biological sciences — 7.5%"),
        tile("1,101", "عملًا في علوم الحاسوب — 7.2%", "Works in computer science — 7.2%"),
        tile("818", "عملًا في العلوم البيئية — 5.4%", "Works in environmental science — 5.4%"),
        tile("234", "عملًا في الطاقة — 1.5% فقط", "Works in energy — only 1.5%"),
        tile("231", "عملًا في علوم الأرض — 1.5%", "Works in earth sciences — 1.5%"),
        tile("26", "مجالًا علميًا يغطيها الإنتاج الليبي", "Scientific fields covered by Libyan output"),
      ],
      charts: [OUTPUT_BY_FIELD, STRATEGIC_FIELDS],
    },
    indicators: [
      { code: "P-01", name_ar: "مؤشر الأولوية", name_en: "Priority index", desc_ar: "درجة مركبة تحدد أهمية كل موضوع وطنيًا وفق أوزان تعتمدها الوزارة.", desc_en: "A composite score ranking each topic nationally, with weights approved by the Ministry.", formula_ar: "الحاجة×و1 + الفجوة×و2 + المواءمة×و3 + القدرة×و4 + الاتجاه×و5", formula_en: "Need×w1 + Gap×w2 + Alignment×w3 + Capacity×w4 + Trend×w5", source_ar: "القطاعات + الخبراء + القاعدة", source_en: "Sectors + experts + database", freq_ar: "سنوي", freq_en: "Annual" },
      { code: "P-02", name_ar: "تغطية الأولوية", name_en: "Priority coverage", desc_ar: "النشاط البحثي الفعلي في موضوع الأولوية مقارنة بالمستهدف.", desc_en: "Actual research activity on a priority topic compared with the target.", formula_ar: "النشاط الفعلي ÷ المستهدف × 100", formula_en: "Actual activity ÷ target × 100", source_ar: "مخرجات ومشاريع مصنفة", source_en: "Classified outputs and projects", freq_ar: "ربع سنوي", freq_en: "Quarterly" },
      { code: "P-03", name_ar: "حصة المجال من الإنتاج", name_en: "Field share of output", desc_ar: "وزن كل مجال في الإنتاج الوطني — يكشف التركّز والمجالات المهمَلة.", desc_en: "Each field's weight in national output — reveals concentration and neglected fields.", formula_ar: "مخرجات المجال ÷ المخرجات الوطنية", formula_en: "Field outputs ÷ national outputs", source_ar: "التصنيف الموضوعي", source_en: "Topic classification", freq_ar: "سنوي", freq_en: "Annual" },
      { code: "P-04", name_ar: "الفجوة القدراتية", name_en: "Capacity gap", desc_ar: "عدد الباحثين والمختبرات المتاحة لكل أولوية مقارنة بما تحتاجه.", desc_en: "Researchers and labs available for each priority compared with what it needs.", formula_ar: "القدرة المطلوبة − القدرة المتاحة", formula_en: "Required capacity − available capacity", source_ar: "ملفات الباحثين والبنية التحتية", source_en: "Researcher and infrastructure profiles", freq_ar: "سنوي", freq_en: "Annual" },
      { code: "P-05", name_ar: "التوزيع الجغرافي للتغطية", name_en: "Geographic coverage", desc_ar: "أين تُعالج الأولوية جغرافيًا، وأين تغيب رغم وجود الحاجة.", desc_en: "Where a priority is addressed geographically, and where it is absent despite need.", formula_ar: "التغطية لكل منطقة ÷ الحاجة في المنطقة", formula_en: "Coverage per region ÷ need in region", source_ar: "الجغرافيا المهيّأة من الوزارة", source_en: "Ministry-configured geography", freq_ar: "سنوي", freq_en: "Annual" },
    ],
    ai_intro_ar: "يربط الذكاء الاصطناعي بين نصوص السياسات واحتياجات القطاعات والأبحاث الفعلية، ليقيس المسافة بين ما تحتاجه الدولة وما يُبحث فعلًا.", ai_intro_en: "AI links policy texts, sector needs and actual research to measure the distance between what the country needs and what is actually researched.",
    ai: [
      { title_ar: "استخراج الاحتياجات", title_en: "Needs extraction", desc_ar: "قراءة الخطط والاستراتيجيات الوطنية وتقارير القطاعات واستخراج التحديات منها.", desc_en: "Reading national plans, strategies and sector reports and extracting their challenges.", output_ar: "قائمة تحديات بمصادرها", output_en: "A list of challenges with sources" },
      { title_ar: "مطابقة الأبحاث بالأولويات", title_en: "Research-to-priority matching", desc_ar: "ربط كل بحث ومشروع بالأولوية التي يخدمها دلاليًا، لا بالكلمات المفتاحية فقط.", desc_en: "Linking each paper and project to the priority it serves semantically, not by keywords alone.", output_ar: "نسبة تغطية لكل أولوية", output_en: "A coverage rate per priority" },
      { title_ar: "كشف الفجوات", title_en: "Gap detection", desc_ar: "رصد الأولويات عالية الحاجة منخفضة النشاط، وترتيبها حسب الإلحاح.", desc_en: "Spotting high-need, low-activity priorities and ranking them by urgency.", output_ar: "تنبيه «فجوة حرجة»", output_en: "A “critical gap” alert" },
      { title_ar: "رصد المجالات الصاعدة", title_en: "Emerging-field radar", desc_ar: "تحديد الموضوعات التي يتسارع نموها عالميًا ولا تظهر بعد في الإنتاج الليبي.", desc_en: "Identifying topics growing fast globally that don't yet appear in Libyan output.", output_ar: "قائمة موضوعات ناشئة", output_en: "A list of emerging topics" },
      { title_ar: "محاكاة السيناريوهات", title_en: "Scenario simulation", desc_ar: "«ماذا لو ضاعفنا التمويل في المياه؟» — أثر متوقع على التغطية والقدرات.", desc_en: "“What if we double water funding?” — expected effect on coverage and capacity.", output_ar: "مقارنة سيناريوهات", output_en: "A scenario comparison" },
      { title_ar: "صياغة الدعوات", title_en: "Call drafting", desc_ar: "تحويل الفجوة المعتمدة إلى مسودة دعوة بحثية بأسئلة ومخرجات ومؤشرات.", desc_en: "Turning an approved gap into a draft research call with questions, outputs and indicators.", output_ar: "مسودة دعوة للمراجعة", output_en: "A draft call for review" },
    ],
    quote_ar: "الأولوية لا تُقاس بعدد الأبحاث فيها، بل بالمسافة بين ما تحتاجه الدولة وما يُبحث فعلًا.", quote_en: "A priority is not measured by its paper count, but by the distance between what the country needs and what is researched.",
  },

  partnerships: {
    image: "/Home/home03.jpg",
    kicker_ar: "الشراكات البحثية", kicker_en: "Research partnerships",
    hero_pre_ar: "من يتعاون مع من، ", hero_pre_en: "Who works with whom, ",
    hero_em_ar: "وأين الشراكة التالية", hero_em_en: "and where the next partnership is",
    hero_post_ar: " — بأدلة.", hero_post_en: " — with evidence.",
    headline: [
      tile("50.3%", "من الأبحاث الليبية بتأليف مشترك مع دولة أخرى", "Of Libyan works co-authored with another country"),
      tile("1,861", "عملًا مشتركًا مع مصر — الشريك الأول", "Works with Egypt — the top partner"),
      tile("83.7%", "تعاون دولي في وثائق Scopus لعام 2025", "International collaboration in 2025 Scopus documents"),
    ],
    summary: {
      tiles: [
        tile("50.3%", "من الأبحاث الليبية بتأليف مشترك مع دولة أخرى (2020–2025)", "Of Libyan works co-authored with another country (2020–2025)"),
        tile("7,687", "عملًا بحثيًا دوليًا مشتركًا بين 2020 و2025", "Internationally co-authored works, 2020–2025"),
        tile("1,861", "عملًا مع مصر — الشريك البحثي الأول", "Works with Egypt — the top research partner"),
        tile("1,433", "عملًا مع الولايات المتحدة — الشريك الثاني", "Works with the United States — the second partner"),
      ],
      charts: [TOP_PARTNERS],
    },
    stats_title_ar: "خريطة التعاون البحثي الليبي مع العالم.", stats_title_en: "The map of Libya's research collaboration with the world.",
    stats: {
      tiles: [
        tile("50.3%", "من الأبحاث الليبية بتأليف مشترك مع دولة أخرى (2020–2025)", "Of Libyan works co-authored with another country (2020–2025)"),
        tile("7,687", "عملًا بحثيًا دوليًا مشتركًا بين 2020 و2025", "Internationally co-authored works, 2020–2025"),
        tile("83.7%", "تعاون دولي في وثائق Scopus الليبية لعام 2025", "International collaboration in Libyan 2025 Scopus documents"),
        tile("1,861", "عملًا مع مصر — الشريك البحثي الأول", "Works with Egypt — the top research partner"),
        tile("1,023", "عملًا مع السعودية — الشريك العربي الثاني", "Works with Saudi Arabia — the second Arab partner"),
        tile("1,116", "عملًا مع المملكة المتحدة — الشريك الأوروبي الأول", "Works with the UK — the top European partner"),
        tile("340", "عملًا مع تونس — شريك من دول الجوار", "Works with Tunisia — a neighbouring partner"),
        tile("57", "مؤسسة ليبية قابلة للربط في شبكة الشراكات", "Libyan institutions that can be linked in the network"),
      ],
      charts: [TOP_PARTNERS, COLLAB_SHARE],
    },
    indicators: [
      { code: "C-01", name_ar: "نسبة التعاون الدولي", name_en: "International collaboration rate", desc_ar: "حصة المخرجات التي يشارك فيها مؤلف من دولة أخرى على الأقل.", desc_en: "Share of outputs with at least one co-author from another country.", formula_ar: "المخرجات متعددة الدول ÷ كل المخرجات", formula_en: "Multi-country outputs ÷ all outputs", source_ar: "بيانات التأليف", source_en: "Authorship data", freq_ar: "سنوي", freq_en: "Annual" },
      { code: "C-02", name_ar: "التعاون الوطني البيني", name_en: "Inter-university collaboration", desc_ar: "عدد المخرجات المشتركة بين جامعتين ليبيتين أو أكثر — مقياس تكامل المنظومة.", desc_en: "Outputs shared by two or more Libyan universities — a measure of system integration.", formula_ar: "مخرجات بأكثر من جامعة ليبية ÷ كل المخرجات", formula_en: "Outputs with 2+ Libyan universities ÷ all outputs", source_ar: "ملفات الجامعات", source_en: "University profiles", freq_ar: "سنوي", freq_en: "Annual" },
      { code: "C-03", name_ar: "أثر الشراكة", name_en: "Partnership impact", desc_ar: "مخرجات الشراكة ومشاريعها وتمويلها مقارنة بالتزامات الاتفاقية.", desc_en: "A partnership's outputs, projects and funding compared with the agreement's commitments.", formula_ar: "المخرجات المتحققة ÷ الالتزامات", formula_en: "Delivered outputs ÷ commitments", source_ar: "سجل الاتفاقيات", source_en: "Agreements registry", freq_ar: "نصف سنوي", freq_en: "Semi-annual" },
      { code: "C-04", name_ar: "تنوع الشركاء", name_en: "Partner diversity", desc_ar: "هل يعتمد التعاون على شريك واحد أم يتوزع على دول وقطاعات متعددة.", desc_en: "Whether collaboration relies on one partner or spreads across countries and sectors.", formula_ar: "1 − مجموع مربعات حصص الشركاء", formula_en: "1 − sum of squared partner shares", source_ar: "بيانات التأليف", source_en: "Authorship data", freq_ar: "سنوي", freq_en: "Annual" },
      { code: "C-05", name_ar: "حالة الاتفاقيات", name_en: "Agreement status", desc_ar: "الاتفاقيات النشطة والمنتهية والقريبة من الانتهاء، مع تنبيه قبل موعد التجديد.", desc_en: "Active, expired and expiring agreements, with an alert before renewal.", formula_ar: "عدّ حسب الحالة وتاريخ الانتهاء", formula_en: "Count by status and end date", source_ar: "سجل الاتفاقيات", source_en: "Agreements registry", freq_ar: "شهري", freq_en: "Monthly" },
    ],
    ai_intro_ar: "يبني الذكاء الاصطناعي شبكة تعاون من بيانات التأليف والمشاريع والاتفاقيات، ويقترح شراكات تعالج فجوات وطنية — مع شرح سبب كل اقتراح.", ai_intro_en: "AI builds a collaboration network from authorship, project and agreement data, and proposes partnerships that close national gaps — explaining every suggestion.",
    ai: [
      { title_ar: "بناء شبكة التعاون", title_en: "Network building", desc_ar: "رسم من يتعاون مع من داخليًا وإقليميًا وعالميًا، وقوة كل رابط.", desc_en: "Mapping who collaborates with whom nationally, regionally and globally, and each link's strength.", output_ar: "شبكة تفاعلية", output_en: "An interactive network" },
      { title_ar: "مطابقة الشركاء", title_en: "Partner matching", desc_ar: "اقتراح شركاء بحسب تقارب الموضوع والخبرة المكمّلة والبنية التحتية وخدمة الأولوية.", desc_en: "Proposing partners by topic similarity, complementary expertise, infrastructure and priority fit.", output_ar: "قائمة مرتبة مع السبب", output_en: "A ranked list with reasons" },
      { title_ar: "اكتشاف الخبراء", title_en: "Expert discovery", desc_ar: "إيجاد الباحثين الليبيين في الخارج والخبراء الدوليين في موضوع محدد.", desc_en: "Finding Libyan researchers abroad and international experts on a specific topic.", output_ar: "ملفات خبراء", output_en: "Expert profiles" },
      { title_ar: "تحليل الاتفاقيات", title_en: "Agreement analysis", desc_ar: "قراءة نصوص الاتفاقيات واستخراج الالتزامات والمواعيد والمؤشرات آليًا.", desc_en: "Reading agreement texts and extracting commitments, dates and KPIs automatically.", output_ar: "بطاقة اتفاقية منظمة", output_en: "A structured agreement card" },
      { title_ar: "رصد الشراكات الخاملة", title_en: "Dormant-partnership detection", desc_ar: "تنبيه عند اتفاقية بلا مخرجات أو شراكة تراجع نشاطها.", desc_en: "Alerting on an agreement with no outputs or a partnership losing activity.", output_ar: "تنبيه متابعة", output_en: "A follow-up alert" },
      { title_ar: "تقرير الشراكات", title_en: "Partnership report", desc_ar: "ملخص دوري لأداء الشراكات وأثرها يُبنى من أرقام الشبكة نفسها.", desc_en: "A periodic summary of partnership performance and impact built from the network's figures.", output_ar: "مسودة تقرير للمراجعة", output_en: "A draft report for review" },
    ],
    quote_ar: "كل مطابقة شراكة تشرح سببها — ثم مراجعة بشرية وتواصل.", quote_en: "Every partnership match explains its reason — followed by human review and outreach.",
  },

  funding: {
    image: "/Home/home04.png",
    kicker_ar: "فرص التمويل البحثي", kicker_en: "Research funding opportunities",
    hero_pre_ar: "المال المناسب ", hero_pre_en: "The right money ",
    hero_em_ar: "للباحث المناسب", hero_em_en: "for the right researcher",
    hero_post_ar: " — في الوقت المناسب.", hero_post_en: " — at the right time.",
    headline: [
      tile("10.2%", "فقط من الأبحاث الليبية تذكر جهة ممولة", "Only of Libyan works acknowledge a funder"),
      tile("13,718", "عملًا بلا جهة ممولة مسجّلة (2020–2025)", "Works with no recorded funder (2020–2025)"),
      tile("83", "عملًا ممولًا من جامعة الملك سعود — الممول الأول", "Works funded by King Saud University — the top funder"),
    ],
    summary: {
      tiles: [
        tile("10.2%", "فقط من الأبحاث الليبية تذكر جهة ممولة (2020–2025)", "Only of Libyan works acknowledge a funder (2020–2025)"),
        tile("1,561", "عملًا بحثيًا ليبيًا بجهة ممولة مسجّلة", "Libyan works with a recorded funder"),
        tile("13,718", "عملًا بلا جهة ممولة مسجّلة", "Works with no recorded funder"),
        tile("83", "عملًا ممولًا من جامعة الملك سعود — الممول الأول", "Works funded by King Saud University — the top funder"),
      ],
      charts: [TOP_FUNDERS],
    },
    stats_title_ar: "من يموّل البحث الليبي اليوم — ومن لا يموّله.", stats_title_en: "Who funds Libyan research today — and who doesn't.",
    stats: {
      tiles: [
        tile("10.2%", "فقط من الأبحاث الليبية تذكر جهة ممولة (2020–2025)", "Only of Libyan works acknowledge a funder (2020–2025)"),
        tile("1,561", "عملًا بحثيًا ليبيًا بجهة ممولة مسجّلة", "Libyan works with a recorded funder"),
        tile("13,718", "عملًا بلا جهة ممولة مسجّلة", "Works with no recorded funder"),
        tile("83", "عملًا ممولًا من جامعة الملك سعود — الممول الأول", "Works funded by King Saud University — the top funder"),
        tile("54", "عملًا ممولًا من برنامج Horizon 2020 الأوروبي", "Works funded by the EU Horizon 2020 programme"),
        tile("53", "عملًا ممولًا من المفوضية الأوروبية", "Works funded by the European Commission"),
        tile("62", "عملًا ممولًا من الجامعة الوطنية الماليزية", "Works funded by the National University of Malaysia"),
        tile("30", "عملًا ممولًا من مجلس NSERC الكندي", "Works funded by Canada's NSERC"),
      ],
      charts: [TOP_FUNDERS, FUNDED_VS_NOT],
    },
    indicators: [
      { code: "F-01", name_ar: "نسبة الأبحاث الممولة", name_en: "Funded research rate", desc_ar: "حصة المخرجات التي تذكر جهة ممولة — مؤشر مباشر على نضج منظومة التمويل.", desc_en: "Share of outputs acknowledging a funder — a direct signal of funding-system maturity.", formula_ar: "مخرجات بجهة ممولة ÷ كل المخرجات", formula_en: "Outputs with a funder ÷ all outputs", source_ar: "بيانات الشكر والتمويل", source_en: "Funding acknowledgements", freq_ar: "سنوي", freq_en: "Annual" },
      { code: "F-02", name_ar: "التمويل مقابل المخرجات", name_en: "Funding vs output", desc_ar: "ما الذي أنتجه كل دينار تمويل: منشورات، براءات، مشاريع، أثر.", desc_en: "What each dinar of funding produced: publications, patents, projects, impact.", formula_ar: "المخرجات ÷ قيمة التمويل", formula_en: "Outputs ÷ funding amount", source_ar: "سجل المشاريع الممولة", source_en: "Funded-projects registry", freq_ar: "سنوي", freq_en: "Annual" },
      { code: "F-03", name_ar: "التمويل حسب الأولوية", name_en: "Funding by priority", desc_ar: "توزيع التمويل على الأولويات الوطنية — يكشف الأولويات ناقصة التمويل.", desc_en: "How funding is spread across national priorities — reveals underfunded ones.", formula_ar: "تمويل الأولوية ÷ إجمالي التمويل", formula_en: "Priority funding ÷ total funding", source_ar: "المشاريع + الأولويات", source_en: "Projects + priorities", freq_ar: "سنوي", freq_en: "Annual" },
      { code: "F-04", name_ar: "معدل نجاح التقديم", name_en: "Application success rate", desc_ar: "نسبة الطلبات المقبولة من المقدمة لكل جهة ممولة ولكل جامعة.", desc_en: "Accepted applications out of those submitted, per funder and per university.", formula_ar: "الطلبات المقبولة ÷ المقدمة", formula_en: "Accepted ÷ submitted applications", source_ar: "سير عمل التقديم", source_en: "Application workflow", freq_ar: "ربع سنوي", freq_en: "Quarterly" },
      { code: "F-05", name_ar: "تنوع مصادر التمويل", name_en: "Funding-source diversity", desc_ar: "توزع التمويل بين محلي وعربي ودولي وصناعي — لتقليل الاعتماد على مصدر واحد.", desc_en: "The split between local, Arab, international and industry funding — to reduce single-source reliance.", formula_ar: "حصة كل فئة من إجمالي التمويل", formula_en: "Each category's share of total funding", source_ar: "سجل الفرص والمشاريع", source_en: "Opportunities and projects registry", freq_ar: "سنوي", freq_en: "Annual" },
    ],
    ai_intro_ar: "يجمع الذكاء الاصطناعي فرص التمويل من مصادرها الرسمية ويطابقها مع ملفات الباحثين والفرق — ودرجة الملاءمة ترتيب داخلي لا قرار قبول.", ai_intro_en: "AI gathers funding opportunities from their official sources and matches them to researcher and team profiles — the fit score is an internal ranking, not an acceptance decision.",
    ai: [
      { title_ar: "رصد الفرص", title_en: "Opportunity monitoring", desc_ar: "متابعة مواقع الجهات الممولة واستخراج الشروط والمواعيد والنطاق آليًا.", desc_en: "Monitoring funder websites and extracting conditions, deadlines and scope automatically.", output_ar: "بطاقة فرصة بمصدر رسمي", output_en: "An opportunity card with official source" },
      { title_ar: "فحص الأهلية", title_en: "Eligibility check", desc_ar: "التحقق المبدئي من أهلية الباحث أو الجامعة لكل فرصة قبل التقديم.", desc_en: "A first check of researcher or university eligibility for each opportunity before applying.", output_ar: "مؤهل / غير مؤهل مع السبب", output_en: "Eligible / not, with reason" },
      { title_ar: "مطابقة الملاءمة", title_en: "Fit matching", desc_ar: "مطابقة الموضوع والسجل البحثي والميزانية مع كل فرصة وترتيبها.", desc_en: "Matching topic, track record and budget to each opportunity and ranking them.", output_ar: "درجة ملاءمة مشروحة", output_en: "An explained fit score" },
      { title_ar: "تشكيل الفرق", title_en: "Team building", desc_ar: "اقتراح أعضاء فريق يكملون الملف عندما تتطلب الفرصة تحالفًا أو شريكًا دوليًا.", desc_en: "Suggesting team members to complete a profile when a call needs a consortium or foreign partner.", output_ar: "فريق مقترح", output_en: "A proposed team" },
      { title_ar: "مساعد الطلب", title_en: "Proposal assistant", desc_ar: "مراجعة مسودة الطلب مقابل معايير الجهة الممولة واقتراح تحسينات.", desc_en: "Reviewing a proposal draft against the funder's criteria and suggesting improvements.", output_ar: "ملاحظات قبل التقديم", output_en: "Pre-submission feedback" },
      { title_ar: "ذكاء التمويل الوطني", title_en: "National funding intelligence", desc_ar: "كشف الأولويات ناقصة التمويل وقياس عائد التمويل على المخرجات.", desc_en: "Detecting underfunded priorities and measuring funding return on outputs.", output_ar: "تنبيه «أولوية ناقصة التمويل»", output_en: "An “underfunded priority” alert" },
    ],
    quote_ar: "درجة الملاءمة ترتيب داخلي — وليست قرار قبول من الجهة الممولة.", quote_en: "The fit score is an internal ranking — never an acceptance decision by the funder.",
  },
};

// =========================================================
// إحصائيات يولّدها الذكاء الاصطناعي (ai_stats) — محسوبة آليًا من الأرقام أعلاه
// عبر src/source/S03_Audience/forecast.js: اتجاه خطي + نطاق ثقة 95% تقريبي، مؤشر تركّز، سيناريوهات.
// هي تقديرات تحليلية وليست أرقامًا رسمية، ويُشار إلى ذلك على الصفحة.
// =========================================================

// كل المجالات الـ 26 (OpenAlex primary field، 2020–2025)
const ALL_FIELDS = [
  ["الطب", "Medicine", 3603], ["الهندسة", "Engineering", 2643], ["الزراعة والأحياء", "Agri & Bio", 1140], ["الحاسوب", "Computing", 1101],
  ["الاجتماعية", "Social sci.", 921], ["البيئة", "Environment", 818], ["الوراثة والجزيئية", "Biochem", 579], ["الإدارة", "Business", 446],
  ["طب الأسنان", "Dentistry", 445], ["المواد", "Materials", 415], ["المهن الصحية", "Health prof.", 352], ["الكيمياء", "Chemistry", 331],
  ["علم النفس", "Psychology", 310], ["الرياضيات", "Mathematics", 276], ["الآداب", "Arts & hum.", 265], ["الطاقة", "Energy", 234],
  ["علوم الأرض", "Earth sci.", 231], ["الاقتصاد", "Economics", 222], ["المناعة", "Immunology", 202], ["علوم القرار", "Decision sci.", 158],
  ["الفيزياء", "Physics", 142], ["الصيدلة", "Pharmacology", 107], ["التمريض", "Nursing", 104], ["الأعصاب", "Neuroscience", 92],
  ["البيطرة", "Veterinary", 42], ["الهندسة الكيميائية", "Chem. eng.", 35],
];
const TOTAL_WORKS = 15279;

// أكبر 18 دولة شريكة (2020–2025)؛ العربية معلَّمة بـ true
const PARTNERS_18 = [
  ["مصر", 1861, true], ["أمريكا", 1433], ["بريطانيا", 1116], ["السعودية", 1023, true], ["ماليزيا", 911], ["الهند", 517],
  ["إندونيسيا", 507], ["الأردن", 472, true], ["العراق", 468, true], ["تركيا", 440], ["الصين", 355], ["كندا", 351],
  ["الإمارات", 347, true], ["تونس", 340, true], ["أستراليا", 303], ["اليابان", 261], ["فرنسا", 258], ["جنوب أفريقيا", 255],
];

const forecastChart = (title_ar, title_en, series, opts = {}) => {
  const { points, future, fit } = buildForecast(series, 3, opts);
  return { chart: { title_ar, title_en, unit: opts.unit || "", points }, future, fit };
};

// ── 01: توقع الإنتاج المفهرس في Scopus حتى 2028 ──
{
  const scopus = SCOPUS_BY_YEAR.data.map((d) => ({ year: d.name_en, value: d.value }));
  const { chart, future, fit } = forecastChart(
    "توقع الإنتاج العلمي الليبي في Scopus حتى 2028 — فعلي + متوقع بنطاق ثقة 95%",
    "Forecast of Libya's Scopus output to 2028 — actual + projected with a 95% band",
    scopus,
  );
  const [y26, , y28] = future;
  MINISTRY_SPACE_DETAILS["data-intelligence"].ai_stats = {
    title_ar: "إلى أين يتجه الإنتاج البحثي الوطني؟", title_en: "Where is national research output heading?",
    method_ar: "نموذج اتجاه خطي مدرَّب على 11 سنة من بيانات Scopus (2015–2025).", method_en: "A linear trend model trained on 11 years of Scopus data (2015–2025).",
    tiles: [
      tile(fmt(y26.forecast), `وثيقة متوقعة في 2026 (بين ${fmt(y26.band[0])} و${fmt(y26.band[1])})`, `Documents projected for 2026 (${fmt(y26.band[0])}–${fmt(y26.band[1])})`),
      tile(fmt(y28.forecast), "وثيقة متوقعة في 2028 إذا استمر الاتجاه الحالي", "Documents projected for 2028 if the current trend holds"),
      tile(`+${fmt(fit.slope)}`, "وثيقة إضافية سنويًا في المتوسط — معدل النمو المكتشف", "Extra documents per year on average — the detected growth rate"),
      tile(`${fmt(fit.r2 * 100)}%`, "دقة ملاءمة النموذج للبيانات (R²)", "Model fit to the data (R²)"),
    ],
    forecast: chart,
    insights_ar: [
      `الإنتاج تضاعف نحو ثلاث مرات بين 2015 و2025، والنموذج يرجّح نحو ${fmt(y26.forecast)} وثيقة في 2026.`,
      "قفزة 2021 (من 740 إلى 1,124) هي أكبر تغيّر سنوي في السلسلة — تستحق تحليلًا تشخيصيًا لأسبابها.",
      "التوقع يفترض استمرار الظروف الحالية؛ أي تغيير في التمويل أو السياسات يُعاد حسابه كسيناريو.",
    ],
    insights_en: [
      `Output roughly tripled between 2015 and 2025, and the model expects about ${fmt(y26.forecast)} documents in 2026.`,
      "The 2021 jump (740 → 1,124) is the largest yearly change in the series — worth a diagnostic analysis.",
      "The forecast assumes current conditions persist; any funding or policy change is re-run as a scenario.",
    ],
  };
}

// ── 02: التركّز والفجوات بين المجالات ──
{
  const shares = ALL_FIELDS.map(([ar, en, v]) => ({ ar, en, v, share: (v / TOTAL_WORKS) * 100 }));
  const hhi = herfindahl(ALL_FIELDS.map((f) => f[2]));
  const top2 = ((ALL_FIELDS[0][2] + ALL_FIELDS[1][2]) / TOTAL_WORKS) * 100;
  const low = shares.filter((s) => s.share < 2);
  const vital = low.filter((s) => ["Energy", "Earth sci.", "Economics", "Veterinary", "Chem. eng."].includes(s.en));
  const energy = shares.find((s) => s.en === "Energy");
  MINISTRY_SPACE_DETAILS.priorities.ai_stats = {
    title_ar: "أين تتركّز المعرفة — وأين تظهر الفجوات؟", title_en: "Where is knowledge concentrated — and where are the gaps?",
    method_ar: "تحليل توزيع 15,279 عملًا على 26 مجالًا: مؤشر تركّز هيرفندال + رصد المجالات تحت عتبة 2%.", method_en: "Distribution analysis of 15,279 works across 26 fields: Herfindahl concentration + fields below a 2% threshold.",
    tiles: [
      tile(`${fmt(top2, 1)}%`, "من الإنتاج يتركّز في مجالين فقط (الطب والهندسة)", "Of output concentrated in just two fields (medicine & engineering)"),
      tile(fmt(hhi, 3), "مؤشر التركّز (0 = موزّع، 1 = مجال واحد)", "Concentration index (0 = spread, 1 = one field)"),
      tile(String(low.length), "مجالًا تحت عتبة 2% من الإنتاج الوطني — تنبيه فجوة", "Fields below 2% of national output — gap alert"),
      tile(`${fmt(energy.share, 1)}%`, "حصة الطاقة — قطاع حيوي لليبيا بتغطية بحثية منخفضة", "Energy's share — a vital sector for Libya with low research coverage"),
    ],
    charts: [{
      type: "bar",
      title_ar: "تنبيهات فجوة: مجالات مرتبطة بقطاعات حيوية تحت عتبة 2% (% من الإنتاج)",
      title_en: "Gap alerts: fields tied to vital sectors below the 2% threshold (% of output)",
      unit: "%",
      data: vital.map((s) => ({ name_ar: s.ar, name_en: s.en, value: Number(s.share.toFixed(2)), highlight: s.en === "Energy" })),
    }],
    insights_ar: [
      `مجالان يستحوذان على ${fmt(top2, 1)}% من الإنتاج، بينما ${low.length} مجالًا يقع كل منها تحت 2%.`,
      "الطاقة وعلوم الأرض والاقتصاد — المرتبطة مباشرة بالنفط والمياه والتنمية — لا يتجاوز أيٌّ منها نحو 1.5%.",
      "توصية مقترحة للمراجعة: إدراج هذه المجالات كأولويات مرشّحة وقياس تغطيتها سنويًا.",
    ],
    insights_en: [
      `Two fields account for ${fmt(top2, 1)}% of output, while ${low.length} fields each sit below 2%.`,
      "Energy, earth sciences and economics — directly tied to oil, water and development — each sit at about 1.5% or less.",
      "Suggested for review: list these fields as candidate priorities and measure their coverage annually.",
    ],
  };
}

// ── 03: اتجاه التعاون الدولي وتنوع الشركاء ──
{
  const collab = COLLAB_SHARE.data.map((d) => ({ year: d.name_en, value: d.value }));
  const { chart, future, fit } = forecastChart(
    "توقع نسبة التعاون الدولي حتى 2028 (%) — فعلي + متوقع بنطاق ثقة 95%",
    "Forecast of the international collaboration rate to 2028 (%) — actual + projected with a 95% band",
    collab, { decimals: 1, unit: "%" },
  );
  const total18 = PARTNERS_18.reduce((s, p) => s + p[1], 0);
  const arab = PARTNERS_18.filter((p) => p[2]).reduce((s, p) => s + p[1], 0);
  const hhi = herfindahl(PARTNERS_18.map((p) => p[1]));
  MINISTRY_SPACE_DETAILS.partnerships.ai_stats = {
    title_ar: "هل يتوسع التعاون الدولي أم يتراجع؟", title_en: "Is international collaboration growing or shrinking?",
    method_ar: "اتجاه خطي على نسبة التعاون 2020–2025 + تحليل توزيع أكبر 18 دولة شريكة.", method_en: "A linear trend on the 2020–2025 collaboration rate + distribution analysis of the top 18 partner countries.",
    tiles: [
      tile(`${fmt(future[0].forecast, 1)}%`, "نسبة التعاون الدولي المتوقعة في 2026", "Projected international collaboration rate in 2026"),
      tile(`${fit.slope > 0 ? "+" : ""}${fmt(fit.slope, 2)}`, "نقطة مئوية سنويًا — اتجاه التعاون المكتشف", "Percentage points per year — the detected trend"),
      tile(`${fmt((arab / total18) * 100, 1)}%`, "من التعاون مع أكبر 18 شريكًا يذهب لدول عربية", "Of collaboration with the top 18 partners is with Arab countries"),
      tile(fmt(hhi, 3), "مؤشر تركّز الشركاء — المنخفض يعني تنوعًا جيدًا", "Partner concentration — low means healthy diversity"),
    ],
    forecast: chart,
    insights_ar: [
      `النسبة بلغت ذروتها 54.8% في 2023 ثم تراجعت إلى 47.0% في 2025، والنموذج يتوقع ${fmt(future[0].forecast, 1)}% في 2026 إن استمر الاتجاه.`,
      "التراجع نسبي: عدد الأعمال الدولية ارتفع (من 1,361 إلى 2,032)، لكن الإنتاج الكلي نما أسرع.",
      "مصر والسعودية والأردن والعراق والإمارات وتونس تشكّل الكتلة العربية — فرصة لشراكات إقليمية في الأولويات الوطنية.",
    ],
    insights_en: [
      `The rate peaked at 54.8% in 2023 then fell to 47.0% in 2025; the model expects ${fmt(future[0].forecast, 1)}% in 2026 if the trend holds.`,
      "The decline is relative: international works rose (1,361 → 2,032), but total output grew faster.",
      "Egypt, Saudi Arabia, Jordan, Iraq, the UAE and Tunisia form the Arab bloc — an opening for regional partnerships on national priorities.",
    ],
  };
}

// ── 04: سيناريوهات التمويل ──
{
  const out2025 = OUTPUT_BY_YEAR.data[OUTPUT_BY_YEAR.data.length - 1].value;
  const rate = (1561 / TOTAL_WORKS) * 100;
  const scen = [rate, 20, 30, 40].map((r) => Math.round((out2025 * r) / 100));
  MINISTRY_SPACE_DETAILS.funding.ai_stats = {
    title_ar: "ماذا لو ارتفعت نسبة الأبحاث الممولة؟", title_en: "What if the funded share of research rose?",
    method_ar: `محاكاة سيناريوهات على إنتاج 2025 (${fmt(out2025)} عملًا) بنسب تمويل مختلفة، انطلاقًا من النسبة الحالية.`, method_en: `Scenario simulation on 2025 output (${fmt(out2025)} works) at different funding rates, starting from the current rate.`,
    tiles: [
      tile(fmt(scen[0]), `عملًا ممولًا متوقعًا سنويًا بالنسبة الحالية (${fmt(rate, 1)}%)`, `Funded works expected yearly at the current rate (${fmt(rate, 1)}%)`),
      tile(fmt(scen[2]), "عملًا ممولًا لو بلغت النسبة 30%", "Funded works if the rate reached 30%"),
      tile(`×${fmt(scen[2] / scen[0], 1)}`, "حجم الزيادة في الأبحاث الممولة عند سيناريو 30%", "Multiplier of funded research in the 30% scenario"),
      tile(fmt(out2025 - scen[0]), "عملًا في 2025 بلا جهة ممولة مسجّلة (تقدير)", "Works in 2025 with no recorded funder (estimate)"),
    ],
    charts: [{
      type: "bar",
      title_ar: "سيناريوهات: عدد الأبحاث الممولة سنويًا حسب نسبة التمويل",
      title_en: "Scenarios: funded works per year by funding rate",
      unit: "",
      data: [
        { name_ar: `الحالي ${fmt(rate, 1)}%`, name_en: `Current ${fmt(rate, 1)}%`, value: scen[0] },
        { name_ar: "20%", name_en: "20%", value: scen[1] },
        { name_ar: "30%", name_en: "30%", value: scen[2], highlight: true },
        { name_ar: "40%", name_en: "40%", value: scen[3] },
      ],
    }],
    insights_ar: [
      `نحو ${fmt(100 - rate)}% من الأبحاث الليبية لا تذكر جهة ممولة — أكبر فجوة بين المساحات الأربع.`,
      "أكثر الممولين ظهورًا جهات خارجية (سعودية وماليزية وأوروبية) — والتمويل الوطني المسجّل محدود.",
      "المطابقة الذكية بين الباحثين والفرص الدولية المتاحة أسرع طريق لرفع النسبة دون ميزانية إضافية.",
    ],
    insights_en: [
      `About ${fmt(100 - rate)}% of Libyan research acknowledges no funder — the largest gap across the four spaces.`,
      "The most frequent funders are foreign (Saudi, Malaysian, European) — recorded national funding is limited.",
      "Smart matching of researchers to available international opportunities is the fastest way to lift the rate without new budget.",
    ],
  };
}

// =========================================================
// ملاحظات الاجتماع (2026-09):
//  • البيانات والذكاء: «SOURCE Chatbot» شات بوت عائم في صفحات الوزارة (source/S03_Audience/SourceChatbot.jsx)
//  • الأولويات: الذكاء الاصطناعي يقترح الأولويات (ai_stats.suggestions)
//  • الشراكات: لا تُنشئها الوزارة — تنشأ محليًا وتصل للوزارة كبيانات (local_flow)
//  • التمويل: الإحصائيات أولًا، ثم أخبار وإعلانات التمويل المتغيرة للطلبة (news)
// =========================================================

MINISTRY_SPACE_DETAILS.funding.news = ["grants", "announcements"];

// ── الأولويات المقترحة: مؤشر فجوة مبدئي = 1 − (حصة المجال ÷ الحصة المتساوية بين 26 مجالًا) ──
{
  const equalShare = 100 / ALL_FIELDS.length;
  const SECTOR_LINKS = {
    Energy: ["النفط والغاز والطاقة المتجددة", "Oil, gas and renewable energy"],
    "Earth sci.": ["المياه الجوفية والجيولوجيا والتصحر", "Groundwater, geology and desertification"],
    Economics: ["التنويع الاقتصادي والتنمية", "Economic diversification and development"],
    Veterinary: ["الثروة الحيوانية والأمن الغذائي", "Livestock and food security"],
    "Chem. eng.": ["الصناعات البتروكيماوية والتكرير", "Petrochemicals and refining"],
  };
  MINISTRY_SPACE_DETAILS.priorities.ai_stats.suggestions = ALL_FIELDS
    .filter(([, en]) => SECTOR_LINKS[en])
    .map(([ar, en, v]) => {
      const share = (v / TOTAL_WORKS) * 100;
      return {
        field_ar: ar, field_en: en,
        sector_ar: SECTOR_LINKS[en][0], sector_en: SECTOR_LINKS[en][1],
        works: v, share,
        gap: Math.max(0, 1 - share / equalShare) * 100,
      };
    })
    .sort((a, b) => b.gap - a.gap);
  MINISTRY_SPACE_DETAILS.priorities.ai_stats.suggestions_formula_ar = `مؤشر الفجوة = 1 − (حصة المجال ÷ ${fmt(equalShare, 2)}%) — الحصة المتساوية بين ${ALL_FIELDS.length} مجالًا.`;
  MINISTRY_SPACE_DETAILS.priorities.ai_stats.suggestions_formula_en = `Gap index = 1 − (field share ÷ ${fmt(equalShare, 2)}%) — the equal share across ${ALL_FIELDS.length} fields.`;
}

// ── الشراكات على المستوى المحلي: من ينشئها، وكيف تصل إلى الوزارة كبيانات ──
MINISTRY_SPACE_DETAILS.partnerships.local_flow = [
  { title_ar: "الطلبة والباحثون", title_en: "Students & researchers", desc_ar: "مشاريع تخرج وأبحاث مشتركة وإشراف مشترك بين الأقسام والجامعات.", desc_en: "Graduation projects, joint papers and co-supervision across departments and universities." },
  { title_ar: "الجامعات والكليات", title_en: "Universities & colleges", desc_ar: "مذكرات تفاهم وبرامج مشتركة وتبادل أعضاء هيئة التدريس.", desc_en: "MoUs, joint programmes and faculty exchange." },
  { title_ar: "المراكز والجهات المحلية", title_en: "Centres & local bodies", desc_ar: "شراكات مع المراكز البحثية والبلديات والصناعة والمؤسسات العامة.", desc_en: "Partnerships with research centres, municipalities, industry and public bodies." },
  { title_ar: "بيانات: اتفاقيات ومشاريع ومخرجات", title_en: "Data: agreements, projects, outputs", desc_ar: "كل شراكة تُسجَّل كبيانات: أطرافها، مشاريعها، مخرجاتها، ومدتها.", desc_en: "Every partnership is recorded as data: its parties, projects, outputs and term." },
  { title_ar: "الوزارة تقرأ وتحلّل", title_en: "The Ministry reads & analyses", desc_ar: "لا تُنشئ الوزارة الشراكات — تراها كبيانات، تقيس أثرها، وتكشف الفرص.", desc_en: "The Ministry doesn't create partnerships — it sees them as data, measures impact and spots opportunities." },
];

// =========================================================
// ملاحظات 2026-09-19:
//  • نقل إحصائيات المجالات من صفحة الأولويات إلى المساحة الأولى (stats_extra)
//  • صفحة الأولويات تعرض المؤشرات المحسوبة من البيانات بدلها
//  • كل مؤشر في المساحات الأربع يحمل قيمته المحسوبة (value) أو «بانتظار البيانات»
// =========================================================

// ── 1) إحصائيات المجالات تنتقل إلى «البيانات والذكاء البحثي» ──
{
  const pr = MINISTRY_SPACE_DETAILS.priorities;
  MINISTRY_SPACE_DETAILS["data-intelligence"].stats_extra = {
    title_ar: "توزيع الإنتاج البحثي حسب المجال (2020–2025)",
    title_en: "Research output by field (2020–2025)",
    tiles: pr.stats.tiles,
    charts: pr.stats.charts,
  };
}

// ── 2) مؤشرات الأولويات محسوبة من البيانات ──
{
  const equalShare = 100 / ALL_FIELDS.length;
  const share = (en) => (ALL_FIELDS.find((f) => f[1] === en)[2] / TOTAL_WORKS) * 100;
  const coverage = (en) => (share(en) / equalShare) * 100;
  const hhi = herfindahl(ALL_FIELDS.map((f) => f[2]));
  const top2 = ((ALL_FIELDS[0][2] + ALL_FIELDS[1][2]) / TOTAL_WORKS) * 100;
  const low = ALL_FIELDS.filter((f) => (f[2] / TOTAL_WORKS) * 100 < 2).length;
  const pr = MINISTRY_SPACE_DETAILS.priorities;
  const sugg = pr.ai_stats.suggestions;

  const VITAL = [
    ["الزراعة والأحياء", "Agri & Bio"], ["البيئة", "Environment"], ["الطاقة", "Energy"], ["علوم الأرض", "Earth sci."],
    ["الاقتصاد", "Economics"], ["البيطرة", "Veterinary"], ["الهندسة الكيميائية", "Chem. eng."],
  ];
  const COVERAGE_CHART = {
    type: "bar",
    title_ar: "مؤشر تغطية الأولوية (P-02) للقطاعات الحيوية — 100% = الحصة المتساوية بين المجالات",
    title_en: "Priority coverage (P-02) for vital sectors — 100% = the equal share across fields",
    unit: "%",
    data: VITAL.map(([ar, en]) => ({ name_ar: ar, name_en: en, value: Math.round(coverage(en)), highlight: coverage(en) < 50 })),
  };
  const SHARE_CHART = {
    type: "bar",
    title_ar: "مؤشر حصة المجال من الإنتاج (P-03) — أكبر 8 مجالات (%)",
    title_en: "Field share of output (P-03) — top 8 fields (%)",
    unit: "%",
    data: ALL_FIELDS.slice(0, 8).map(([ar, en, v]) => ({ name_ar: ar, name_en: en, value: Number(((v / TOTAL_WORKS) * 100).toFixed(1)), highlight: en === "Medicine" })),
  };
  const tiles = [
    tile(`${fmt(coverage("Energy"))}%`, "تغطية أولوية الطاقة (P-02) — أقل من نصف الحصة المتساوية", "Energy priority coverage (P-02) — under half the equal share"),
    tile(`${fmt(coverage("Earth sci."))}%`, "تغطية المياه الجوفية وعلوم الأرض (P-02)", "Groundwater & earth sciences coverage (P-02)"),
    tile(`${fmt(coverage("Veterinary"))}%`, "تغطية الثروة الحيوانية والبيطرة (P-02)", "Livestock & veterinary coverage (P-02)"),
    tile(`${fmt(share("Medicine"), 1)}%`, "حصة الطب من الإنتاج (P-03) — أعلى مجال", "Medicine's share of output (P-03) — the top field"),
    tile(`${fmt(top2, 1)}%`, "حصة أكبر مجالين معًا (P-03)", "Combined share of the top two fields (P-03)"),
    tile(fmt(hhi, 3), "مؤشر تركّز الإنتاج بين المجالات (هيرفندال)", "Output concentration across fields (Herfindahl)"),
    tile(String(low), "مجالًا تحت عتبة 2% من الإنتاج", "Fields below the 2% output threshold"),
    tile(String(sugg.length), "أولويات مرشّحة بمكوّن الفجوة من مؤشر الأولوية (P-01)", "Candidate priorities from the gap component of the priority index (P-01)"),
  ];
  pr.stats_kicker_ar = "مؤشرات محسوبة من البيانات"; pr.stats_kicker_en = "Indicators computed from the data";
  pr.stats_title_ar = "ما الذي تقوله البيانات عن الأولويات الوطنية."; pr.stats_title_en = "What the data says about national priorities.";
  pr.stats_note_ar = `كل رقم هنا مؤشر محسوب آليًا من ${fmt(TOTAL_WORKS)} عملًا بحثيًا ليبيًا (2020–2025) موزّعة على ${ALL_FIELDS.length} مجالًا — بالصيغ المعتمدة في قسم المؤشرات.`;
  pr.stats_note_en = `Every figure here is an indicator computed automatically from ${fmt(TOTAL_WORKS)} Libyan research works (2020–2025) across ${ALL_FIELDS.length} fields — using the formulas in the indicators section.`;
  pr.stats = { tiles, charts: [COVERAGE_CHART, SHARE_CHART] };
  pr.summary = { tiles: tiles.slice(0, 4), charts: [COVERAGE_CHART] };
  pr.headline = [tiles[0], tiles[4], tiles[7]].map((t) => ({ ...t }));

  // إحصائيات الذكاء الاصطناعي للأولويات تتركّز الآن على المقترحات (بلا تكرار المؤشرات أعلاه)
  const avgCov = VITAL.reduce((s, [, en]) => s + coverage(en), 0) / VITAL.length;
  const under50 = VITAL.filter(([, en]) => coverage(en) < 50).length;
  pr.ai_stats.title_ar = "ما الأولويات التي يقترحها الذكاء الاصطناعي؟"; pr.ai_stats.title_en = "Which priorities does AI suggest?";
  pr.ai_stats.method_ar = "ترتيب القطاعات الحيوية حسب مؤشر الفجوة المشتق من مؤشري التغطية (P-02) والحصة (P-03)."; pr.ai_stats.method_en = "Vital sectors ranked by a gap index derived from the coverage (P-02) and share (P-03) indicators.";
  pr.ai_stats.tiles = [
    tile(String(sugg.length), "أولويات مقترحة بانتظار اعتماد الوزارة", "Suggested priorities pending Ministry approval"),
    tile(`${fmt(sugg[0].gap)}%`, `أعلى فجوة: ${sugg[0].sector_ar}`, `Highest gap: ${sugg[0].sector_en}`),
    tile(`${fmt(avgCov)}%`, "متوسط تغطية القطاعات الحيوية السبعة", "Average coverage of the seven vital sectors"),
    tile(`${under50} / ${VITAL.length}`, "قطاعات حيوية بتغطية أقل من 50%", "Vital sectors with coverage below 50%"),
  ];
  pr.ai_stats.charts = [{
    type: "bar",
    title_ar: "مؤشر الفجوة للأولويات المقترحة (%)",
    title_en: "Gap index of the suggested priorities (%)",
    unit: "%",
    data: sugg.map((s, i) => ({ name_ar: s.field_ar, name_en: s.field_en, value: Math.round(s.gap), highlight: i === 0 })),
  }];
}

// ── 3) قيم المؤشرات في المساحات الأربع (محسوبة، أو «بانتظار البيانات» مع السبب) ──
{
  const val = (value, note_ar, note_en) => ({ value, note_ar, note_en });
  const wait = (note_ar, note_en) => ({ value: null, note_ar, note_en });
  const setVals = (slug, map) => MINISTRY_SPACE_DETAILS[slug].indicators.forEach((ind) => { if (map[ind.code]) Object.assign(ind, { current: map[ind.code] }); });

  const scopus = SCOPUS_BY_YEAR.data;
  const s25 = scopus[scopus.length - 1].value;
  const s24 = scopus[scopus.length - 2].value;
  const oa25 = OUTPUT_BY_YEAR.data[OUTPUT_BY_YEAR.data.length - 1].value;
  const uniAvg = UNI_OUTPUT.data.reduce((s, d) => s + d.value, 0) / UNI_OUTPUT.data.length;
  const faculty = 25587;
  setVals("data-intelligence", {
    "D-01": val(fmt(TOTAL_WORKS), "عملًا بحثيًا 2020–2025", "research works 2020–2025"),
    "D-02": val(fmt(oa25 / faculty, 2), "عمل لكل عضو هيئة تدريس في 2025 (تقريب)", "works per faculty member in 2025 (approx.)"),
    "D-03": val(`${fmt((UNI_OUTPUT.data[0].value / uniAvg) * 100)}%`, "جامعة طرابلس مقابل متوسط أكبر 6 جامعات", "University of Tripoli vs the average of the 6 largest"),
    "D-04": val(`+${fmt(((s25 - s24) / s24) * 100, 1)}%`, "نمو وثائق Scopus بين 2024 و2025", "Scopus document growth 2024→2025"),
    "D-05": wait("بانتظار ربط سجلات الجامعات المتحقق منها", "Awaiting verified university records"),
    "D-06": val(`${fmt((s25 / oa25) * 100)}%`, "من إنتاج 2025 مفهرس في Scopus", "of 2025 output is Scopus-indexed"),
  });

  const pr = MINISTRY_SPACE_DETAILS.priorities;
  const equalShare = 100 / ALL_FIELDS.length;
  const energyCov = (ALL_FIELDS.find((f) => f[1] === "Energy")[2] / TOTAL_WORKS) * 100 / equalShare * 100;
  setVals("priorities", {
    "P-01": val(String(pr.ai_stats.suggestions.length), "أولويات مرشّحة (مكوّن الفجوة) — بقية المكوّنات بانتظار أوزان الوزارة", "candidate priorities (gap component) — other components await Ministry weights"),
    "P-02": val(`${fmt(energyCov)}%`, "تغطية أولوية الطاقة", "Energy priority coverage"),
    "P-03": val(`${fmt((ALL_FIELDS[0][2] / TOTAL_WORKS) * 100, 1)}%`, "حصة الطب — أعلى مجال", "Medicine's share — the top field"),
    "P-04": wait("بانتظار بيانات الباحثين والمختبرات حسب الأولوية", "Awaiting researcher and lab data by priority"),
    "P-05": wait("بانتظار بيانات الجامعات حسب المنطقة", "Awaiting university data by region"),
  });

  const collab25 = COLLAB_SHARE.data[COLLAB_SHARE.data.length - 1].value;
  const partnerHhi = herfindahl(PARTNERS_18.map((p) => p[1]));
  setVals("partnerships", {
    "C-01": val(`${fmt(collab25, 1)}%`, "نسبة التعاون الدولي في 2025", "International collaboration rate in 2025"),
    "C-02": wait("بانتظار بيانات التأليف المشترك بين الجامعات الليبية", "Awaiting co-authorship data between Libyan universities"),
    "C-03": wait("بانتظار تسجيل الاتفاقيات ومخرجاتها", "Awaiting agreements and their outputs"),
    "C-04": val(fmt(1 - partnerHhi, 3), "تنوع الشركاء بين أكبر 18 دولة (1 = أعلى تنوع)", "Partner diversity across the top 18 countries (1 = most diverse)"),
    "C-05": wait("بانتظار سجل الاتفاقيات", "Awaiting the agreements registry"),
  });

  setVals("funding", {
    "F-01": val(`${fmt((1561 / TOTAL_WORKS) * 100, 1)}%`, "من الأبحاث تذكر جهة ممولة (2020–2025)", "of works acknowledge a funder (2020–2025)"),
    "F-02": wait("بانتظار قيم التمويل من سجل المشاريع", "Awaiting funding amounts from the projects registry"),
    "F-03": wait("بانتظار ربط المشاريع الممولة بالأولويات", "Awaiting funded projects linked to priorities"),
    "F-04": wait("بانتظار سير عمل التقديم داخل المنصة", "Awaiting the in-platform application workflow"),
    "F-05": wait("بانتظار تصنيف الجهات الممولة (محلي/عربي/دولي/صناعي)", "Awaiting funder classification (local/Arab/international/industry)"),
  });
}

// =========================================================
// ملاحظة 2026-09-19 (2): المستوى الثاني (الأولويات) بلا إحصائيات إطلاقًا —
// كل الأرقام في المستوى الأول (البيانات والذكاء)، والمستوى الثاني يعرض الشرح
// فقط، مولَّدًا نصيًا من تلك الأرقام نفسها (لا أرقام مكتوبة يدويًا).
// =========================================================
{
  const di = MINISTRY_SPACE_DETAILS["data-intelligence"];
  const pr = MINISTRY_SPACE_DETAILS.priorities;

  // 1) كل إحصائيات الأولويات تنتقل إلى المستوى الأول كمجموعات إضافية
  di.stats_groups = [
    { id: "fields", ...di.stats_extra },
    { id: "priority-indicators", title_ar: "مؤشرات الأولويات المحسوبة من البيانات", title_en: "Priority indicators computed from the data", tiles: pr.stats.tiles, charts: pr.stats.charts },
    { id: "priority-gaps", title_ar: "مؤشر الفجوة للأولويات المقترحة", title_en: "Gap index of the suggested priorities", tiles: pr.ai_stats.tiles, charts: pr.ai_stats.charts },
  ];
  delete di.stats_extra;

  // 2) الشرح المولَّد من الأرقام
  const equalShare = 100 / ALL_FIELDS.length;
  const sh = (en) => (ALL_FIELDS.find((f) => f[1] === en)[2] / TOTAL_WORKS) * 100;
  const cov = (en) => Math.round((sh(en) / equalShare) * 100);
  const top2 = ((ALL_FIELDS[0][2] + ALL_FIELDS[1][2]) / TOTAL_WORKS) * 100;
  const low = ALL_FIELDS.filter((f) => (f[2] / TOTAL_WORKS) * 100 < 2).length;
  const sugg = pr.ai_stats.suggestions;
  const L1 = "/ministry-space/data-intelligence#priority-indicators";
  const L1gap = "/ministry-space/data-intelligence#priority-gaps";
  const L1fields = "/ministry-space/data-intelligence#fields";

  pr.explain_only = true;
  pr.explanation = [
    {
      title_ar: "المعرفة متركّزة في مجالين", title_en: "Knowledge is concentrated in two fields",
      body_ar: `الطب والهندسة وحدهما يشكّلان ${fmt(top2, 1)}% من الإنتاج البحثي الليبي، بينما يقع ${low} مجالًا من أصل ${ALL_FIELDS.length} تحت عتبة 2%. هذا يعني أن القدرة البحثية الوطنية موجّهة نحو عدد محدود من التخصصات، وأن مجالات كثيرة ترتبط باحتياجات الدولة لا تحظى بنشاط كافٍ.`,
      body_en: `Medicine and engineering alone make up ${fmt(top2, 1)}% of Libyan research output, while ${low} of ${ALL_FIELDS.length} fields sit below 2%. National research capacity is directed at a narrow set of disciplines, and many fields tied to national needs lack sufficient activity.`,
      link: L1fields,
    },
    {
      title_ar: "قطاعات حيوية بتغطية منخفضة", title_en: "Vital sectors with low coverage",
      body_ar: `مقارنةً بالحصة المتساوية بين المجالات، تبلغ تغطية الطاقة ${cov("Energy")}% فقط، وعلوم الأرض والمياه الجوفية ${cov("Earth sci.")}%، والاقتصاد ${cov("Economics")}%، والبيطرة ${cov("Veterinary")}%، والهندسة الكيميائية ${cov("Chem. eng.")}%. وهي قطاعات يقوم عليها اقتصاد ليبيا ومواردها: النفط والغاز، المياه، الغذاء، والتنويع الاقتصادي.`,
      body_en: `Against the equal share across fields, energy coverage is only ${cov("Energy")}%, earth sciences and groundwater ${cov("Earth sci.")}%, economics ${cov("Economics")}%, veterinary ${cov("Veterinary")}% and chemical engineering ${cov("Chem. eng.")}%. These are the sectors Libya's economy and resources rest on: oil and gas, water, food and economic diversification.`,
      link: L1,
    },
    {
      title_ar: "نقاط قوة يمكن البناء عليها", title_en: "Strengths to build on",
      body_ar: `في المقابل، تتجاوز الزراعة والعلوم البيولوجية (${cov("Agri & Bio")}%) والعلوم البيئية (${cov("Environment")}%) الحصة المتساوية بوضوح — قاعدة جاهزة يمكن توجيهها نحو أولويات الأمن الغذائي والمياه والتصحر بدل البدء من الصفر.`,
      body_en: `By contrast, agricultural & biological sciences (${cov("Agri & Bio")}%) and environmental science (${cov("Environment")}%) clearly exceed the equal share — a ready base that can be steered toward food security, water and desertification priorities instead of starting from scratch.`,
      link: L1,
    },
  ];
  pr.explanation_suggestions = sugg.map((s) => ({
    sector_ar: s.sector_ar, sector_en: s.sector_en,
    body_ar: `مجال «${s.field_ar}» لا يمثّل إلا ${s.share.toFixed(2)}% من الإنتاج (${fmt(s.works)} عملًا)، أي أقل بكثير من الحصة المتساوية. لذلك يقترح الذكاء الاصطناعي إدراج «${s.sector_ar}» كأولوية مرشّحة تُعرض على المراجعة القطاعية ومراجعة الخبراء قبل اعتماد الوزارة.`,
    body_en: `“${s.field_en}” accounts for only ${s.share.toFixed(2)}% of output (${fmt(s.works)} works), far below the equal share. AI therefore suggests listing “${s.sector_en}” as a candidate priority for sector and expert review before Ministry approval.`,
    link: L1gap,
  }));
  pr.explanation_next = {
    ar: ["تعتمد الوزارة أوزان مؤشر الأولوية (الحاجة، الفجوة، المواءمة، القدرة، الاتجاه) لتكتمل مكوّناته بعد مكوّن الفجوة المحسوب.", "تحوّل الأولويات المعتمدة إلى دعوات بحثية وتمويل وشراكات موجّهة للجامعات والمراكز.", "تُقاس التغطية سنويًا من أرقام المستوى الأول لمتابعة أثر كل قرار."],
    en: ["The Ministry approves the priority-index weights (need, gap, alignment, capacity, trend) to complete it beyond the computed gap component.", "Approved priorities become research calls, funding and partnerships aimed at universities and centres.", "Coverage is measured annually from the level-one figures to track each decision's impact."],
  };
  pr.explanation_summary = {
    ar: [pr.explanation[0].title_ar + ": " + `مجالان = ${fmt(top2, 1)}% من الإنتاج.`, `تغطية الطاقة ${cov("Energy")}% والمياه الجوفية ${cov("Earth sci.")}% من الحصة المتساوية.`, `${sugg.length} أولويات مرشّحة يقترحها الذكاء الاصطناعي بانتظار اعتماد الوزارة.`],
    en: [pr.explanation[0].title_en + ": " + `two fields = ${fmt(top2, 1)}% of output.`, `Energy coverage ${cov("Energy")}% and groundwater ${cov("Earth sci.")}% of the equal share.`, `${sugg.length} candidate priorities suggested by AI, pending Ministry approval.`],
  };

  // 3) المؤشرات في المستوى الثاني: تفسير بدل الرقم
  const interp = {
    "P-01": [`مكوّن الفجوة محسوب ويرشّح ${sugg.length} أولويات؛ بقية المكوّنات تنتظر أوزان الوزارة.`, `The gap component is computed and flags ${sugg.length} priorities; the other components await Ministry weights.`],
    "P-02": [`الطاقة عند ${cov("Energy")}% من الحصة المتساوية — تغطية أقل من النصف لقطاع حيوي.`, `Energy is at ${cov("Energy")}% of the equal share — under half the coverage for a vital sector.`],
    "P-03": [`الطب يستحوذ على ${sh("Medicine").toFixed(1)}% — تركّز يستدعي إعادة توازن نحو القطاعات الحيوية.`, `Medicine holds ${sh("Medicine").toFixed(1)}% — a concentration calling for rebalancing toward vital sectors.`],
    "P-04": ["هل تملك كل أولوية ما يكفي من الباحثين والمختبرات؟ يُقاس بعد ربط ملفات الجامعات.", "Does each priority have enough researchers and labs? Measured once university profiles are connected."],
    "P-05": ["هل تُبحث الأولوية حيث توجد الحاجة جغرافيًا؟ يُقاس بعد ربط بيانات الجامعات حسب المنطقة.", "Is each priority researched where the need is? Measured once university data by region is connected."],
  };
  pr.indicators.forEach((ind) => {
    if (interp[ind.code]) { ind.interpret_ar = interp[ind.code][0]; ind.interpret_en = interp[ind.code][1]; }
  });

  // 3ب) شرح تفصيلي لكل مؤشر (يظهر في نافذة منبثقة عند الضغط): الخطوات، القراءة
  //     الحالية كنص، الترابط مع إحصائيات المستوى الأول والمؤشرات الأخرى، دور الذكاء
  //     الاصطناعي، والقرار الذي يدعمه. القيم مولَّدة من الأرقام — لا شيء مكتوب يدويًا.
  const vitalLow = ["Energy", "Earth sci.", "Economics", "Veterinary", "Chem. eng."];
  const lowList_ar = vitalLow.map((en) => `${ALL_FIELDS.find((f) => f[1] === en)[0]} ${cov(en)}%`).join("، ");
  const lowList_en = vitalLow.map((en) => `${en} ${cov(en)}%`).join(", ");
  const G = {
    fields: { to: L1fields, ar: "توزيع الإنتاج حسب المجال", en: "Output by field" },
    ind: { to: L1, ar: "مؤشرات الأولويات المحسوبة", en: "Computed priority indicators" },
    gap: { to: L1gap, ar: "مؤشر الفجوة للأولويات المقترحة", en: "Gap index of suggested priorities" },
    output: { to: "/ministry-space/data-intelligence#numbers", ar: "الإنتاج البحثي الوطني", en: "National research output" },
  };
  const DETAILS = {
    "P-01": {
      steps_ar: ["نحدد لكل قطاع مؤشرات الحاجة الوطنية من الخطط والاستراتيجيات.", "نحسب مكوّن الفجوة من التغطية (P-02) والحصة (P-03).", "نضيف المواءمة مع السياسات والقدرة المتاحة (P-04) واتجاه النمو.", "نضرب كل مكوّن في وزنه المعتمد من الوزارة ونجمع النتيجة.", "نرتّب القطاعات تنازليًا ونعرض الأعلى كأولويات مرشّحة."],
      steps_en: ["For each sector, set national-need indicators from plans and strategies.", "Compute the gap component from coverage (P-02) and share (P-03).", "Add policy alignment, available capacity (P-04) and growth trend.", "Multiply each component by its Ministry-approved weight and sum.", "Rank sectors descending and show the top as candidate priorities."],
      reading_ar: `حاليًا يُحسب مكوّن الفجوة فقط، وهو يرشّح ${sugg.length} قطاعات: ${sugg.map((s) => s.sector_ar).join("، ")}. أعلاها فجوةً «${sugg[0].sector_ar}». بقية المكوّنات (الحاجة، المواءمة، القدرة، الاتجاه) تنتظر اعتماد الأوزان، لذلك الترتيب مبدئي.`,
      reading_en: `Only the gap component is computed now; it flags ${sugg.length} sectors: ${sugg.map((s) => s.sector_en).join(", ")}. The largest gap is “${sugg[0].sector_en}”. The other components (need, alignment, capacity, trend) await approved weights, so the ranking is preliminary.`,
      links: [G.gap, G.ind], related: ["P-02", "P-03", "P-04"],
      ai_ar: "يقترح الذكاء الاصطناعي الأوزان الأولية ويختبر حساسية الترتيب لتغييرها، ويشرح لكل قطاع أي مكوّن رفعه أو خفّضه.",
      ai_en: "AI proposes initial weights, tests how sensitive the ranking is to them, and explains which component raised or lowered each sector.",
      decision_ar: "اعتماد قائمة الأولويات الوطنية السنوية وتحويلها إلى دعوات بحثية وتمويل.",
      decision_en: "Approving the annual national priority list and turning it into research calls and funding.",
    },
    "P-02": {
      steps_ar: ["نصنّف كل عمل بحثي إلى مجاله الرئيسي.", "نحسب حصة كل مجال من الإنتاج الوطني.", `نقارنها بالحصة المتساوية بين ${ALL_FIELDS.length} مجالًا (${fmt(equalShare, 2)}%).`, "التغطية = حصة المجال ÷ الحصة المتساوية × 100 — أقل من 100% يعني نشاطًا دون المتوقع."],
      steps_en: ["Classify every research work into its primary field.", "Compute each field's share of national output.", `Compare it with the equal share across ${ALL_FIELDS.length} fields (${fmt(equalShare, 2)}%).`, "Coverage = field share ÷ equal share × 100 — below 100% means less activity than expected."],
      reading_ar: `القطاعات الحيوية الأقل تغطية: ${lowList_ar}. في المقابل الزراعة والأحياء ${cov("Agri & Bio")}% والبيئة ${cov("Environment")}% فوق الحصة المتساوية. أي أن الطاقة والمياه والاقتصاد تحصل على أقل من نصف النشاط المتوقع.`,
      reading_en: `The least-covered vital sectors: ${lowList_en}. By contrast agriculture & biology is at ${cov("Agri & Bio")}% and environment at ${cov("Environment")}%, above the equal share. Energy, water and economics get under half the expected activity.`,
      links: [G.ind, G.fields], related: ["P-03", "P-01", "P-05"],
      ai_ar: "يصنّف الذكاء الاصطناعي الأبحاث إلى مجالات وأولويات دلاليًا (لا بالكلمات المفتاحية فقط)، ثم يحدّث التغطية تلقائيًا مع كل عمل جديد.",
      ai_en: "AI classifies research into fields and priorities semantically (not only by keywords), then updates coverage automatically with every new work.",
      decision_ar: "تحديد القطاعات التي تحتاج دعوات بحثية أو حوافز موجّهة لرفع نشاطها.",
      decision_en: "Identifying sectors that need targeted research calls or incentives to raise activity.",
    },
    "P-03": {
      steps_ar: ["نعدّ الأعمال البحثية في كل مجال خلال الفترة.", `نقسمها على مجموع الإنتاج الوطني (${fmt(TOTAL_WORKS)} عملًا).`, "نرتّب المجالات ونرصد التركّز في الأعلى والمجالات تحت عتبة 2%."],
      steps_en: ["Count research works per field over the period.", `Divide by total national output (${fmt(TOTAL_WORKS)} works).`, "Rank fields and watch concentration at the top and fields below the 2% threshold."],
      reading_ar: `الطب يتصدّر بـ${sh("Medicine").toFixed(1)}%، ومع الهندسة يصل المجالان إلى ${fmt(top2, 1)}% من الإنتاج، بينما ${low} مجالًا تحت 2%. الإنتاج الوطني متركّز، وهذا ما يغذّي مكوّن الفجوة في مؤشر الأولوية.`,
      reading_en: `Medicine leads with ${sh("Medicine").toFixed(1)}%; with engineering the two reach ${fmt(top2, 1)}% of output, while ${low} fields are below 2%. National output is concentrated, which feeds the gap component of the priority index.`,
      links: [G.fields, G.ind], related: ["P-02", "P-01"],
      ai_ar: "يرصد الذكاء الاصطناعي تغيّر الحصص عبر السنوات وينبّه عند تراجع مجال مرتبط بأولوية أو صعود مجال جديد.",
      ai_en: "AI tracks share changes over the years and alerts when a priority-linked field declines or a new field rises.",
      decision_ar: "إعادة توازن الدعم البحثي بين المجالات المتركّزة والمجالات الحيوية المهمَلة.",
      decision_en: "Rebalancing research support between concentrated fields and neglected vital ones.",
    },
    "P-04": {
      steps_ar: ["نحدد لكل أولوية القدرة المطلوبة: باحثون، مختبرات، أجهزة.", "نجمع القدرة المتاحة من ملفات الباحثين والبنية التحتية في الجامعات.", "الفجوة القدراتية = المطلوب − المتاح لكل أولوية."],
      steps_en: ["Set the required capacity per priority: researchers, labs, equipment.", "Aggregate available capacity from researcher and infrastructure profiles.", "Capacity gap = required − available per priority."],
      reading_ar: "لا يُحسب بعد: يحتاج بيانات الباحثين والمختبرات مصنّفة حسب الأولوية من الجامعات. سيظهر تلقائيًا بعد ربط ملفاتها بالمنصة.",
      reading_en: "Not computed yet: it needs researcher and lab data classified by priority from universities. It will appear automatically once their profiles are connected.",
      links: [G.output], related: ["P-01", "P-05"],
      ai_ar: "يطابق الذكاء الاصطناعي خبرات الباحثين مع موضوعات الأولوية لتقدير القدرة الفعلية لا العددية فقط.",
      ai_en: "AI matches researchers' expertise to priority topics to estimate real capacity, not just headcount.",
      decision_ar: "توجيه الابتعاث والتوظيف وتجهيز المختبرات نحو الأولويات ناقصة القدرة.",
      decision_en: "Directing scholarships, hiring and lab investment toward capacity-short priorities.",
    },
    "P-05": {
      steps_ar: ["نوزّع النشاط البحثي لكل أولوية على المناطق (حسب الجامعة والمركز).", "نقارنه بحجم الحاجة في كل منطقة.", "التغطية الجغرافية = النشاط في المنطقة ÷ الحاجة فيها."],
      steps_en: ["Distribute each priority's research activity across regions (by university and centre).", "Compare it with the size of need in each region.", "Geographic coverage = activity in the region ÷ need in the region."],
      reading_ar: "لا يُحسب بعد: يحتاج بيانات الجامعات حسب المنطقة. سيكشف مثلًا إن كانت أولوية المياه تُبحث في مناطق لا تعاني منها أكثر من المناطق المتأثرة.",
      reading_en: "Not computed yet: it needs university data by region. It will reveal, for example, whether water is researched more in regions that don't suffer from it than in affected ones.",
      links: [G.output], related: ["P-02", "P-04"],
      ai_ar: "يربط الذكاء الاصطناعي مواقع الجامعات والمراكز بمؤشرات الحاجة المحلية ويقترح شراكات بين مناطق متكاملة.",
      ai_en: "AI links university and centre locations to local need indicators and suggests partnerships between complementary regions.",
      decision_ar: "توزيع الدعوات والتمويل جغرافيًا بعدالة وحسب الحاجة الفعلية.",
      decision_en: "Allocating calls and funding geographically, fairly and by actual need.",
    },
  };
  pr.indicators.forEach((ind) => { if (DETAILS[ind.code]) Object.assign(ind, { detail: DETAILS[ind.code] }); });

  // 4) لا أرقام في المستوى الثاني
  delete pr.stats; delete pr.summary; delete pr.headline;
  pr.ai_stats = { suggestions: sugg };
}

// =========================================================
// كل المؤشرات في المستويات الأربعة: نص (تفسير قصير) + شرح تفصيلي في نافذة منبثقة.
// القراءات مبنية على القيم المحسوبة في كتلة «قيم المؤشرات» أعلاه.
// =========================================================
{
  const V = (slug, code) => MINISTRY_SPACE_DETAILS[slug].indicators.find((i) => i.code === code)?.current?.value;
  const link = (slug, hash, ar, en) => ({ to: `/ministry-space/${slug}#${hash}`, ar, en });
  const scopus = SCOPUS_BY_YEAR.data;
  const oa = OUTPUT_BY_YEAR.data;
  const di = "data-intelligence";

  const DETAILS = {
    // ── 01 البيانات والذكاء البحثي ──
    "D-01": {
      interpret: [`${V(di, "D-01")} عملًا بحثيًا ليبيًا بين 2020 و2025، وارتفع الإنتاج السنوي من ${fmt(oa[0].value)} إلى ${fmt(oa[oa.length - 1].value)}.`, `${V(di, "D-01")} Libyan research works in 2020–2025; yearly output rose from ${fmt(oa[0].value)} to ${fmt(oa[oa.length - 1].value)}.`],
      steps_ar: ["نجمع مخرجات الباحثين والجامعات من ملفاتها وقواعد الفهرسة.", "نزيل التكرار ونوحّد أسماء الباحثين والمؤسسات.", "نعدّ المخرجات المتحقق منها لكل فترة، حسب النوع والجامعة والمجال."],
      steps_en: ["Collect researcher and university outputs from their profiles and indexes.", "Remove duplicates and reconcile researcher and institution names.", "Count verified outputs per period, by type, university and field."],
      reading_ar: `بلغ الإنتاج ${V(di, "D-01")} عملًا خلال 2020–2025. أعلى سنة هي 2025 بـ${fmt(oa[oa.length - 1].value)} عملًا، بعد ${fmt(oa[oa.length - 2].value)} في 2024. هذا هو الأساس الذي تُبنى عليه بقية المؤشرات.`,
      reading_en: `Output reached ${V(di, "D-01")} works in 2020–2025. The peak year is 2025 with ${fmt(oa[oa.length - 1].value)} works, after ${fmt(oa[oa.length - 2].value)} in 2024. Every other indicator is built on this base.`,
      links: [link(di, "numbers", "الإنتاج البحثي الوطني", "National research output"), link(di, "fields", "توزيع الإنتاج حسب المجال", "Output by field")], related: ["D-02", "D-04", "D-06"],
      ai_ar: "يوحّد الذكاء الاصطناعي الكيانات (أسماء الباحثين والجامعات بالعربية والإنجليزية) ويكتشف السجلات المكررة أو الناقصة قبل العدّ.",
      ai_en: "AI reconciles entities (researcher and university names in Arabic and English) and detects duplicate or missing records before counting.",
      decision_ar: "متابعة حجم المنظومة البحثية الوطنية وتقييم أثر السياسات عليها سنة بعد سنة.",
      decision_en: "Tracking the size of the national research system and the effect of policies on it year by year.",
    },
    "D-02": {
      interpret: [`نحو ${V(di, "D-02")} عمل لكل عضو هيئة تدريس في 2025 — إنتاجية منخفضة تستحق التشخيص.`, `About ${V(di, "D-02")} works per faculty member in 2025 — low productivity worth diagnosing.`],
      steps_ar: ["نحدد الباحثين النشطين في كل جامعة (نشر أو مشروع خلال الفترة).", "نقسم مخرجات الجامعة على عدد باحثيها النشطين.", "نقارن الجامعات ببعضها وبالمتوسط الوطني بشكل عادل رغم اختلاف الحجم."],
      steps_en: ["Identify active researchers per university (a publication or project in the period).", "Divide the university's outputs by its active researchers.", "Compare universities with each other and the national average fairly despite size differences."],
      reading_ar: `التقدير الحالي ${V(di, "D-02")} عمل لكل عضو هيئة تدريس في 2025 (${fmt(oa[oa.length - 1].value)} عملًا ÷ 25,587 عضوًا). هو تقريب لأنه يقسم على كل الأعضاء لا الباحثين النشطين فقط؛ القيمة الدقيقة تظهر بعد ربط ملفات الباحثين.`,
      reading_en: `The current estimate is ${V(di, "D-02")} works per faculty member in 2025 (${fmt(oa[oa.length - 1].value)} works ÷ 25,587 members). It is approximate because it divides by all members, not only active researchers; the exact value appears once researcher profiles are connected.`,
      links: [link(di, "numbers", "الإنتاج البحثي الوطني", "National research output")], related: ["D-01", "D-03"],
      ai_ar: "يميّز الذكاء الاصطناعي الباحث النشط من غير النشط، ويكشف أسباب انخفاض الإنتاجية (العبء التدريسي، التمويل، البنية التحتية).",
      ai_en: "AI distinguishes active from inactive researchers and surfaces causes of low productivity (teaching load, funding, infrastructure).",
      decision_ar: "تصميم حوافز البحث وتخفيف العبء التدريسي حيث تنخفض الإنتاجية.",
      decision_en: "Designing research incentives and easing teaching loads where productivity is low.",
    },
    "D-03": {
      interpret: [`جامعة طرابلس عند ${V(di, "D-03")} من متوسط أكبر 6 جامعات — فجوة واضحة بين الجامعات.`, `The University of Tripoli is at ${V(di, "D-03")} of the average of the 6 largest — a clear gap between universities.`],
      steps_ar: ["نحسب قيمة المؤشر لكل جامعة (أو منطقة أو تخصص).", "نحسب المتوسط الوطني للمؤشر نفسه.", "الأداء = قيمة الجهة ÷ المتوسط × 100 — فوق 100% أعلى من المتوسط."],
      steps_en: ["Compute the indicator for each university (or region or field).", "Compute the national average of the same indicator.", "Performance = entity value ÷ average × 100 — above 100% is above average."],
      reading_ar: `جامعة طرابلس تنتج ${V(di, "D-03")} من متوسط أكبر ست جامعات، تليها بنغازي. الإنتاج متركّز في جامعتين كبيرتين بينما تبقى بقية الجامعات دون المتوسط.`,
      reading_en: `The University of Tripoli produces ${V(di, "D-03")} of the average of the six largest, followed by Benghazi. Output is concentrated in two large universities while the others stay below average.`,
      links: [link(di, "numbers", "الإنتاج التراكمي لأكبر الجامعات", "Cumulative output of the largest universities")], related: ["D-01", "D-02"],
      ai_ar: "يطبّع الذكاء الاصطناعي المقارنة حسب الحجم والتخصص ويشرح لماذا تتقدم جامعة أو تتأخر.",
      ai_en: "AI normalises the comparison by size and discipline and explains why a university leads or lags.",
      decision_ar: "توجيه الدعم للجامعات دون المتوسط ونقل الممارسات الناجحة من الجامعات المتقدمة.",
      decision_en: "Directing support to below-average universities and transferring good practice from leading ones.",
    },
    "D-04": {
      interpret: [`نمو ${V(di, "D-04")} في وثائق Scopus بين 2024 و2025، واتجاه صاعد منذ 2015.`, `${V(di, "D-04")} growth in Scopus documents between 2024 and 2025, and a rising trend since 2015.`],
      steps_ar: ["نأخذ السلسلة الزمنية للإنتاج سنة بسنة.", "النمو = (السنة الحالية − السابقة) ÷ السابقة.", "نرصد المجالات الصاعدة والمتراجعة ونبني عليها التنبؤ."],
      steps_en: ["Take the output time series year by year.", "Growth = (current year − previous) ÷ previous.", "Spot rising and declining fields and build the forecast on them."],
      reading_ar: `وثائق Scopus الليبية ارتفعت من ${fmt(scopus[scopus.length - 2].value)} في 2024 إلى ${fmt(scopus[scopus.length - 1].value)} في 2025 (${V(di, "D-04")})، ومن ${fmt(scopus[0].value)} في 2015. أكبر قفزة كانت في 2021.`,
      reading_en: `Libyan Scopus documents rose from ${fmt(scopus[scopus.length - 2].value)} in 2024 to ${fmt(scopus[scopus.length - 1].value)} in 2025 (${V(di, "D-04")}), and from ${fmt(scopus[0].value)} in 2015. The biggest jump was in 2021.`,
      links: [link(di, "numbers", "الإنتاج في Scopus سنويًا", "Scopus output per year"), link(di, "ai-insights", "توقع الإنتاج حتى 2028", "Output forecast to 2028")], related: ["D-01", "D-06"],
      ai_ar: "يبني الذكاء الاصطناعي نموذج اتجاه وتوقعًا بنطاق ثقة، ويكشف القفزات غير المفسَّرة للتحقق منها.",
      ai_en: "AI builds a trend model and a forecast with a confidence band, and flags unexplained jumps for verification.",
      decision_ar: "التخطيط متعدد السنوات للتمويل والقدرات بناءً على المسار المتوقع.",
      decision_en: "Multi-year planning of funding and capacity based on the projected path.",
    },
    "D-05": {
      interpret: ["شرط قبل أي مقارنة — يُقاس بعد ربط سجلات الجامعات المتحقق منها.", "A precondition for any comparison — measured once verified university records are connected."],
      steps_ar: ["نفحص كل سجل: هل الحقول الأساسية مكتملة؟ هل هو متحقق منه مؤسسيًا؟", "نحسب نسبة السجلات المكتملة والمتحقق منها لكل جامعة.", "لا تدخل جامعة في المقارنات الوطنية تحت حد جودة معيّن."],
      steps_en: ["Check each record: are core fields complete? Is it institutionally verified?", "Compute the share of complete, verified records per university.", "A university below a quality threshold is excluded from national comparisons."],
      reading_ar: "لا يُحسب بعد: يعتمد على سجلات الجامعات بعد ربطها بالمنصة. حتى ذلك الحين تعتمد الأرقام على مصادر منشورة (OpenAlex وScopus والتقارير الرسمية).",
      reading_en: "Not computed yet: it depends on university records once connected. Until then figures rely on published sources (OpenAlex, Scopus and official reports).",
      links: [link(di, "numbers", "الإنتاج البحثي الوطني", "National research output")], related: ["D-01", "D-03"],
      ai_ar: "يكتشف الذكاء الاصطناعي الحقول الناقصة والقيم الشاذة ويقترح تصحيحها للجامعة قبل الاعتماد.",
      ai_en: "AI detects missing fields and outliers and suggests corrections to the university before approval.",
      decision_ar: "ضمان أن كل رقم في اللوحة الوطنية موثوق وقابل للتتبع إلى مصدره.",
      decision_en: "Ensuring every figure on the national dashboard is reliable and traceable to its source.",
    },
    "D-06": {
      interpret: [`نحو ${V(di, "D-06")} فقط من إنتاج 2025 مفهرس في Scopus — الظهور الدولي محدود.`, `Only about ${V(di, "D-06")} of 2025 output is Scopus-indexed — limited international visibility.`],
      steps_ar: ["نعدّ المخرجات المفهرسة في قواعد دولية (Scopus وغيرها).", "نقسمها على كل المخرجات في الفترة نفسها.", "نضيف معدلات الاستشهاد المطبّعة حسب المجال لقياس الأثر."],
      steps_en: ["Count outputs indexed in international databases (Scopus and others).", "Divide by all outputs in the same period.", "Add field-normalised citation rates to measure impact."],
      reading_ar: `من ${fmt(oa[oa.length - 1].value)} عملًا في 2025، مفهرس في Scopus ${fmt(scopus[scopus.length - 1].value)} فقط، أي نحو ${V(di, "D-06")}. معظم الإنتاج ينشر في أوعية غير مفهرسة دوليًا.`,
      reading_en: `Of ${fmt(oa[oa.length - 1].value)} works in 2025, only ${fmt(scopus[scopus.length - 1].value)} are Scopus-indexed, about ${V(di, "D-06")}. Most output is published in venues not indexed internationally.`,
      links: [link(di, "numbers", "الإنتاج في Scopus مقابل كل الأعمال", "Scopus vs all works")], related: ["D-01", "D-04", "C-01"],
      ai_ar: "يقترح الذكاء الاصطناعي مجلات مفهرسة مناسبة لكل بحث ويرصد المجلات غير الموثوقة.",
      ai_en: "AI suggests suitable indexed journals for each paper and flags untrustworthy ones.",
      decision_ar: "دعم النشر في أوعية مفهرسة وبرامج التحرير والترجمة لرفع الظهور الدولي.",
      decision_en: "Supporting publication in indexed venues and editing/translation programmes to raise visibility.",
    },
    // ── 03 الشراكات ──
    "C-01": {
      interpret: [`${V("partnerships", "C-01")} من أبحاث 2025 بتأليف دولي، بعد ذروة 54.8% في 2023.`, `${V("partnerships", "C-01")} of 2025 research is internationally co-authored, after a 54.8% peak in 2023.`],
      steps_ar: ["نقرأ دول المؤلفين في كل عمل بحثي.", "العمل دولي إن شارك فيه مؤلف من دولة أخرى على الأقل.", "النسبة = الأعمال الدولية ÷ كل الأعمال، سنويًا."],
      steps_en: ["Read the authors' countries in every work.", "A work is international if at least one author is from another country.", "Rate = international works ÷ all works, per year."],
      reading_ar: `النسبة ${V("partnerships", "C-01")} في 2025، بعد ذروة 54.8% في 2023. التراجع نسبي: الأعمال الدولية زادت، لكن الإنتاج الكلي نما أسرع.`,
      reading_en: `The rate is ${V("partnerships", "C-01")} in 2025, after a 54.8% peak in 2023. The decline is relative: international works grew, but total output grew faster.`,
      links: [link("partnerships", "numbers", "التعاون الدولي سنويًا", "International collaboration per year"), link("partnerships", "ai-insights", "توقع نسبة التعاون", "Collaboration forecast")], related: ["C-04", "D-06"],
      ai_ar: "يتنبأ الذكاء الاصطناعي باتجاه النسبة ويقترح شركاء دوليين في المجالات التي يضعف فيها التعاون.",
      ai_en: "AI forecasts the rate's trend and suggests international partners in fields where collaboration is weak.",
      decision_ar: "برامج تنقّل وشراكات دولية موجّهة للحفاظ على الانفتاح البحثي.",
      decision_en: "Targeted mobility and international partnership programmes to keep research open.",
    },
    "C-02": {
      interpret: ["تكامل الجامعات الليبية فيما بينها — يُقاس بعد ربط بيانات التأليف المشترك.", "Integration between Libyan universities — measured once joint-authorship data is connected."],
      steps_ar: ["نرصد الأعمال التي يشارك فيها باحثون من جامعتين ليبيتين أو أكثر.", "نقسمها على كل الأعمال.", "نرسم شبكة التعاون بين الجامعات والمراكز."],
      steps_en: ["Find works co-authored by researchers from two or more Libyan universities.", "Divide by all works.", "Map the collaboration network between universities and centres."],
      reading_ar: "لا يُحسب بعد: يحتاج بيانات تأليف مشترك موحّدة من الجامعات الليبية. الشراكات هنا تنشأ محليًا بين الطلبة والباحثين والجامعات، وتصل للوزارة كبيانات.",
      reading_en: "Not computed yet: it needs unified co-authorship data from Libyan universities. Partnerships here start locally between students, researchers and universities, and reach the Ministry as data.",
      links: [link("partnerships", "local", "مسار الشراكات المحلية", "Local partnerships flow")], related: ["C-01", "C-03"],
      ai_ar: "يبني الذكاء الاصطناعي شبكة التعاون المحلية ويكشف الجامعات المعزولة والفرص بين جامعات متكاملة.",
      ai_en: "AI builds the local collaboration network and reveals isolated universities and opportunities between complementary ones.",
      decision_ar: "تحفيز المشاريع المشتركة بين الجامعات وتقليل التكرار.",
      decision_en: "Encouraging joint projects between universities and reducing duplication.",
    },
    "C-03": {
      interpret: ["ما الذي تنتجه كل شراكة مقارنة بالتزاماتها — يُقاس بعد تسجيل الاتفاقيات.", "What each partnership delivers against its commitments — measured once agreements are registered."],
      steps_ar: ["نسجّل كل اتفاقية بالتزاماتها: مشاريع، منشورات، تبادل، تمويل.", "نربطها بالمخرجات الفعلية من ملفات الباحثين.", "الأثر = المخرجات المتحققة ÷ الالتزامات."],
      steps_en: ["Register each agreement with its commitments: projects, papers, exchanges, funding.", "Link it to actual outputs from researcher profiles.", "Impact = delivered outputs ÷ commitments."],
      reading_ar: "لا يُحسب بعد: يعتمد على سجل الاتفاقيات الذي تنشئه الجامعات والمراكز محليًا.",
      reading_en: "Not computed yet: it depends on the agreements registry created locally by universities and centres.",
      links: [link("partnerships", "local", "مسار الشراكات المحلية", "Local partnerships flow")], related: ["C-05", "C-02"],
      ai_ar: "يقرأ الذكاء الاصطناعي نصوص الاتفاقيات ويستخرج الالتزامات والمؤشرات، وينبّه للشراكات الخاملة.",
      ai_en: "AI reads agreement texts, extracts commitments and KPIs, and flags dormant partnerships.",
      decision_ar: "تجديد الشراكات المثمرة وإعادة النظر في غير المنتجة.",
      decision_en: "Renewing productive partnerships and reviewing unproductive ones.",
    },
    "C-04": {
      interpret: [`تنوع الشركاء ${V("partnerships", "C-04")} — التعاون موزّع على دول كثيرة لا على شريك واحد.`, `Partner diversity ${V("partnerships", "C-04")} — collaboration is spread across many countries, not one partner.`],
      steps_ar: ["نحسب حصة كل دولة شريكة من الأعمال المشتركة.", "نحسب مؤشر التركّز (مجموع مربعات الحصص).", "التنوع = 1 − التركّز؛ الأقرب إلى 1 يعني تنوعًا أعلى."],
      steps_en: ["Compute each partner country's share of co-authored works.", "Compute the concentration index (sum of squared shares).", "Diversity = 1 − concentration; closer to 1 means more diverse."],
      reading_ar: `القيمة ${V("partnerships", "C-04")} عبر أكبر 18 دولة شريكة: مصر في المقدمة ثم الولايات المتحدة والمملكة المتحدة والسعودية، دون اعتماد مفرط على شريك واحد. الدول العربية نحو 40% من هذا التعاون.`,
      reading_en: `The value is ${V("partnerships", "C-04")} across the top 18 partners: Egypt leads, then the US, UK and Saudi Arabia, with no over-reliance on one partner. Arab countries are about 40% of this collaboration.`,
      links: [link("partnerships", "numbers", "أكثر الدول مشاركة", "Top co-authoring countries")], related: ["C-01"],
      ai_ar: "يرصد الذكاء الاصطناعي تغيّر خريطة الشركاء وينبّه إذا بدأ التعاون يتركّز على دولة واحدة.",
      ai_en: "AI monitors the partner map and alerts if collaboration starts concentrating on one country.",
      decision_ar: "تنويع الشراكات الإقليمية والدولية وتوجيهها نحو الأولويات الوطنية.",
      decision_en: "Diversifying regional and international partnerships and steering them toward national priorities.",
    },
    "C-05": {
      interpret: ["الاتفاقيات النشطة والمنتهية والقريبة من الانتهاء — يُقاس من سجل الاتفاقيات.", "Active, expired and expiring agreements — measured from the agreements registry."],
      steps_ar: ["نسجّل تاريخ بداية ونهاية كل اتفاقية وحالتها.", "نعدّ الاتفاقيات حسب الحالة.", "ننبّه قبل موعد التجديد بفترة كافية."],
      steps_en: ["Record each agreement's start and end dates and status.", "Count agreements by status.", "Alert well before renewal dates."],
      reading_ar: "لا يُحسب بعد: يظهر بعد أن تسجّل الجامعات والمراكز اتفاقياتها في المنصة.",
      reading_en: "Not computed yet: it appears once universities and centres register their agreements on the platform.",
      links: [link("partnerships", "local", "مسار الشراكات المحلية", "Local partnerships flow")], related: ["C-03"],
      ai_ar: "يذكّر الذكاء الاصطناعي بمواعيد التجديد ويلخّص أداء كل اتفاقية قبلها.",
      ai_en: "AI reminds of renewal dates and summarises each agreement's performance beforehand.",
      decision_ar: "عدم خسارة شراكات مهمة بسبب انتهاء غير ملحوظ.",
      decision_en: "Not losing important partnerships to unnoticed expiry.",
    },
    // ── 04 التمويل ──
    "F-01": {
      interpret: [`${V("funding", "F-01")} فقط من الأبحاث الليبية تذكر جهة ممولة — أكبر فجوة بين المساحات.`, `Only ${V("funding", "F-01")} of Libyan research acknowledges a funder — the largest gap across the spaces.`],
      steps_ar: ["نقرأ قسم التمويل والشكر في كل عمل بحثي.", "نعدّ الأعمال التي تذكر جهة ممولة.", "النسبة = الأعمال الممولة ÷ كل الأعمال."],
      steps_en: ["Read the funding/acknowledgement section of every work.", "Count works that name a funder.", "Rate = funded works ÷ all works."],
      reading_ar: `${V("funding", "F-01")} فقط من الأعمال (2020–2025) تذكر جهة ممولة، أي نحو 9 من كل 10 أبحاث بلا تمويل مسجّل. وأكثر الممولين ظهورًا جهات خارجية (سعودية وماليزية وأوروبية).`,
      reading_en: `Only ${V("funding", "F-01")} of works (2020–2025) name a funder — about 9 in 10 papers have no recorded funding. The most frequent funders are foreign (Saudi, Malaysian, European).`,
      links: [link("funding", "numbers", "الجهات الممولة", "Funders"), link("funding", "ai-insights", "سيناريوهات التمويل", "Funding scenarios")], related: ["F-02", "F-05"],
      ai_ar: "يستخرج الذكاء الاصطناعي الجهات الممولة من نصوص الأبحاث، ويحاكي أثر رفع النسبة على عدد الأبحاث الممولة.",
      ai_en: "AI extracts funders from paper texts and simulates the effect of raising the rate on funded research.",
      decision_ar: "وضع هدف وطني لنسبة الأبحاث الممولة وبرامج تمويل محلية لتحقيقه.",
      decision_en: "Setting a national target for the funded-research rate and local programmes to reach it.",
    },
    "F-02": {
      interpret: ["ما الذي أنتجه كل دينار تمويل — يُقاس بعد تسجيل قيم التمويل في المشاريع.", "What each dinar of funding produced — measured once funding amounts are recorded."],
      steps_ar: ["نسجّل قيمة تمويل كل مشروع.", "نربطه بمخرجاته: منشورات، براءات، أثر.", "العائد = المخرجات ÷ قيمة التمويل."],
      steps_en: ["Record each project's funding amount.", "Link it to its outputs: papers, patents, impact.", "Return = outputs ÷ funding amount."],
      reading_ar: "لا يُحسب بعد: يحتاج سجل المشاريع الممولة بقيمها من الجامعات والجهات الممولة.",
      reading_en: "Not computed yet: it needs the funded-projects registry with amounts from universities and funders.",
      links: [link("funding", "numbers", "الجهات الممولة", "Funders")], related: ["F-01", "F-03"],
      ai_ar: "يقارن الذكاء الاصطناعي عائد التمويل بين المجالات والجامعات ويكشف أين يحقق التمويل أثرًا أكبر.",
      ai_en: "AI compares funding return across fields and universities and shows where funding has most impact.",
      decision_ar: "توجيه الميزانية البحثية نحو البرامج الأعلى أثرًا.",
      decision_en: "Steering the research budget toward the highest-impact programmes.",
    },
    "F-03": {
      interpret: ["كيف يتوزع التمويل على الأولويات الوطنية — يُقاس بعد ربط المشاريع بالأولويات.", "How funding spreads across national priorities — measured once projects are linked to priorities."],
      steps_ar: ["نربط كل مشروع ممول بالأولوية التي يخدمها.", "نجمع التمويل لكل أولوية.", "الحصة = تمويل الأولوية ÷ إجمالي التمويل، ونقارنها بمؤشر الأولوية."],
      steps_en: ["Link each funded project to the priority it serves.", "Sum funding per priority.", "Share = priority funding ÷ total funding, compared with the priority index."],
      reading_ar: "لا يُحسب بعد: يحتاج ربط المشاريع الممولة بالأولويات المعتمدة من صفحة الأولويات.",
      reading_en: "Not computed yet: it needs funded projects linked to the priorities approved on the priorities page.",
      links: [{ to: "/ministry-space/priorities#suggested", ar: "الأولويات المقترحة", en: "Suggested priorities" }], related: ["P-01", "F-02"],
      ai_ar: "يكشف الذكاء الاصطناعي «الأولويات ناقصة التمويل» بمقارنة التمويل بمؤشر الأولوية.",
      ai_en: "AI detects “underfunded priorities” by comparing funding with the priority index.",
      decision_ar: "إعادة توزيع التمويل ليتوافق مع الأولويات المعتمدة.",
      decision_en: "Reallocating funding to match approved priorities.",
    },
    "F-04": {
      interpret: ["نسبة الطلبات المقبولة من المقدمة — تُقاس من سير عمل التقديم داخل المنصة.", "Accepted applications out of submitted — measured from the in-platform application workflow."],
      steps_ar: ["نسجّل كل طلب تمويل يُقدَّم عبر المنصة.", "نتابع نتيجته: مقبول، مرفوض، قيد المراجعة.", "النجاح = المقبول ÷ المقدَّم، لكل جهة ممولة ولكل جامعة."],
      steps_en: ["Record every funding application submitted through the platform.", "Track its outcome: accepted, rejected, under review.", "Success = accepted ÷ submitted, per funder and per university."],
      reading_ar: "لا يُحسب بعد: يبدأ مع أول طلبات تُقدَّم عبر المنصة للفرص المعروضة في صفحة التمويل.",
      reading_en: "Not computed yet: it starts with the first applications submitted via the platform for opportunities on the funding page.",
      links: [link("funding", "announcements", "فرص التمويل المتاحة", "Available funding opportunities")], related: ["F-01"],
      ai_ar: "يراجع الذكاء الاصطناعي الطلب مقابل معايير الجهة الممولة قبل التقديم لرفع فرص القبول.",
      ai_en: "AI reviews the application against the funder's criteria before submission to raise acceptance chances.",
      decision_ar: "دعم الجامعات ذات معدل النجاح المنخفض بالتدريب ومراجعة الطلبات.",
      decision_en: "Supporting low-success universities with training and application review.",
    },
    "F-05": {
      interpret: ["توزع التمويل بين محلي وعربي ودولي وصناعي — يُقاس بعد تصنيف الجهات الممولة.", "The split between local, Arab, international and industry funding — measured once funders are classified."],
      steps_ar: ["نصنّف كل جهة ممولة: محلية، عربية، دولية، صناعية.", "نحسب حصة كل فئة من التمويل.", "نراقب الاعتماد على مصدر واحد."],
      steps_en: ["Classify every funder: local, Arab, international, industry.", "Compute each category's share of funding.", "Watch for reliance on a single source."],
      reading_ar: "لا يُحسب بعد بدقة: قائمة الممولين الحالية تُظهر أن أكثرهم ظهورًا جهات خارجية، لكن التصنيف الكامل ينتظر بيانات التمويل المحلي.",
      reading_en: "Not precisely computed yet: the current funder list shows the most frequent are foreign, but full classification awaits local funding data.",
      links: [link("funding", "numbers", "الجهات الممولة", "Funders")], related: ["F-01", "F-02"],
      ai_ar: "يصنّف الذكاء الاصطناعي الجهات الممولة آليًا ويقترح مصادر بديلة لتقليل الاعتماد على مصدر واحد.",
      ai_en: "AI classifies funders automatically and suggests alternative sources to reduce single-source reliance.",
      decision_ar: "بناء منظومة تمويل وطنية متوازنة وأقل اعتمادًا على الخارج.",
      decision_en: "Building a balanced national funding system less dependent on foreign sources.",
    },
  };
  Object.values(MINISTRY_SPACE_DETAILS).forEach((d) => d.indicators.forEach((ind) => {
    const x = DETAILS[ind.code];
    if (!x) return;
    ind.interpret_ar = x.interpret[0]; ind.interpret_en = x.interpret[1];
    const { interpret, ...rest } = x; // eslint-disable-line no-unused-vars
    ind.detail = rest;
  }));
}

// ── سياق «SOURCE Chatbot»: كل الأرقام المنشورة والمؤشرات والتقديرات كنص مرجعي ──
// focus = مفتاح الصفحة الحالية (slug مساحة، أو "ministry"): تُعرض بيانات المساحة
// الحالية أولًا وكاملة، والمساحات الأخرى مختصرة (أرقام فقط) — ليتخصص الرد بالصفحة.
export const buildChatbotContext = (lang = "ar", focus = "ministry") => {
  const L = (o, k) => o[`${k}_${lang}`] ?? o[k] ?? "";
  const lines = [];
  const chartLine = (c) => `- ${L(c, "title")}: ${c.data.map((p) => `${L(p, "name")}=${p.value}${c.unit || ""}`).join("، ")}`;
  const entries = Object.entries(MINISTRY_SPACE_DETAILS);
  const ordered = MINISTRY_SPACE_DETAILS[focus]
    ? [entries.find(([s]) => s === focus), ...entries.filter(([s]) => s !== focus)]
    : entries;
  // صفحة الأولويات تشرح أرقام المستوى الأول — فنرسل المستوى الأول كاملًا معها
  const full = new Set(MINISTRY_SPACE_DETAILS[focus] ? [focus, ...(focus === "priorities" ? ["data-intelligence"] : [])] : entries.map(([s]) => s));
  ordered.forEach(([slug, d]) => {
    const isFocus = slug === focus;
    if (!full.has(slug)) {
      // مساحة أخرى: أرقام مختصرة فقط
      lines.push(`## ${L(d, "kicker")} (${slug}) — ${lang === "ar" ? "مختصر" : "summary"}`);
      (d.stats?.tiles || []).slice(0, 4).forEach((t) => lines.push(`- ${t.value}: ${L(t, "label")}`));
      return;
    }
    lines.push(`## ${L(d, "kicker")} (${slug})${isFocus ? (lang === "ar" ? " — الصفحة الحالية" : " — current page") : ""}`);
    if (isFocus && slug === "funding") {
      lines.push(lang === "ar" ? "برامج تمويل دولية معروضة في الصفحة:" : "International funding programmes shown on the page:");
      FUNDING_FALLBACK.forEach((f) => lines.push(`- ${L(f, "title")} (${L(f, "tag")}) — ${f.url}`));
    }
    if (isFocus && d.local_flow) {
      lines.push(lang === "ar" ? "مسار الشراكات المحلية:" : "Local partnerships flow:");
      d.local_flow.forEach((st) => lines.push(`- ${L(st, "title")}: ${L(st, "desc")}`));
    }
    if (isFocus && d.explanation) {
      lines.push(lang === "ar" ? "الشرح المعروض في الصفحة (مبني على أرقام المستوى الأول):" : "Explanation shown on the page (built from level-one figures):");
      d.explanation.forEach((e) => lines.push(`- ${L(e, "title")}: ${L(e, "body")}`));
      (d.explanation_suggestions || []).forEach((e) => lines.push(`- ${L(e, "sector")}: ${L(e, "body")}`));
    }
    if (d.stats) {
      lines.push(lang === "ar" ? "أرقام ومؤشرات:" : "Figures & indicators:");
      d.stats.tiles.forEach((t) => lines.push(`- ${t.value}: ${L(t, "label")}`));
      d.stats.charts.forEach((c) => lines.push(chartLine(c)));
    }
    (d.stats_groups || []).forEach((g) => {
      lines.push(`### ${L(g, "title")}`);
      g.charts.forEach((c) => lines.push(chartLine(c)));
    });
    d.indicators.filter((i) => i.current?.value).forEach((i) => lines.push(`- ${i.code} ${L(i, "name")} = ${i.current.value} (${L(i.current, "note")})`));
    if (d.ai_stats?.tiles) {
      lines.push(lang === "ar" ? "تقديرات محسوبة (ليست أرقامًا رسمية):" : "Computed estimates (not official figures):");
      d.ai_stats.tiles.forEach((t) => lines.push(`- ${t.value}: ${L(t, "label")}`));
      lines.push(`- ${L(d.ai_stats, "method")}`);
    }
  });
  lines.push(lang === "ar"
    ? "المصادر: Scopus/SCImago، OpenAlex (كل أنواع الأعمال 2020–2025)، يونيسف/المجلس الوطني للتطوير الاقتصادي والاجتماعي، QS 2026، الهيئة الليبية للبحث العلمي."
    : "Sources: Scopus/SCImago, OpenAlex (all work types 2020–2025), UNICEF/NCESD, QS 2026, Libyan Authority for Scientific Research.");
  return lines.join("\n");
};

// ── إعلانات تمويل احتياطية: برامج دولية حقيقية ومفتوحة دوريًا تظهر عندما لا تتوفر
// إعلانات من جدول الأخبار (أو عند تعذّر الاتصال بالخادم). بلا مواعيد أو مبالغ لأنها
// تتغير كل دورة — الرابط يذهب للموقع الرسمي. نفس القائمة مُدرجة في قاعدة البيانات عبر
// api/db_seed_funding_news.sql لتُدار لاحقًا من لوحة التحكم.
export const FUNDING_FALLBACK = [
  { slug: "erasmus-plus-mobility", category: "grants", image_url: "/Home/home03.jpg", url: "https://erasmus-plus.ec.europa.eu/",
    title_ar: "إيراسموس+ — منح تنقّل الطلبة وأعضاء هيئة التدريس مع الجامعات الأوروبية", title_en: "Erasmus+ — mobility grants for students and staff with European universities",
    tag_ar: "طلبة · أعضاء هيئة تدريس", tag_en: "Students · Staff" },
  { slug: "msca-postdoctoral-fellowships", category: "grants", image_url: "/Home/home01.jpg", url: "https://marie-sklodowska-curie-actions.ec.europa.eu/",
    title_ar: "زمالات ماري سكوودوفسكا-كوري (Horizon Europe) — للباحثين من كل الجنسيات", title_en: "Marie Skłodowska-Curie fellowships (Horizon Europe) — open to researchers of any nationality",
    tag_ar: "باحثون · ما بعد الدكتوراه", tag_en: "Researchers · Postdoc" },
  { slug: "daad-scholarships", category: "grants", image_url: "/Home/home05.jpg", url: "https://www.daad.de/en/",
    title_ar: "منح DAAD الألمانية — ماجستير ودكتوراه وزيارات بحثية", title_en: "DAAD scholarships (Germany) — master's, PhD and research stays",
    tag_ar: "دراسات عليا", tag_en: "Postgraduate" },
  { slug: "chevening-scholarships", category: "grants", image_url: "/Home/home04.png", url: "https://www.chevening.org/",
    title_ar: "منح تشيفنينغ البريطانية — ماجستير لمدة عام في المملكة المتحدة", title_en: "Chevening scholarships (UK) — one-year master's in the United Kingdom",
    tag_ar: "طلبة ماجستير", tag_en: "Master's students" },
  { slug: "isdb-scholarships", category: "grants", image_url: "/Home/home03.jpg", url: "https://www.isdb.org/scholarships",
    title_ar: "منح البنك الإسلامي للتنمية — لمواطني الدول الأعضاء ومنها ليبيا", title_en: "Islamic Development Bank scholarships — for citizens of member countries, including Libya",
    tag_ar: "طلبة · باحثون", tag_en: "Students · Researchers" },
  { slug: "twas-fellowships", category: "grants", image_url: "/Home/home01.jpg", url: "https://twas.org/",
    title_ar: "زمالات TWAS — للعلماء والباحثين من الدول النامية", title_en: "TWAS fellowships — for scientists and researchers from developing countries",
    tag_ar: "باحثون · دكتوراه", tag_en: "Researchers · PhD" },
];
