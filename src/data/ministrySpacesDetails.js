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
//  [SCImago] / [UNICEF-NCESD] / [QS-2026] / [LEP] — انظر src/data/homeStats.js
//  ملاحظة: أرقام OpenAlex تشمل كل أنواع الأعمال، لذا تختلف عن سلسلة Scopus (SCImago).
// =========================================================
import { HOME_STATS } from "./homeStats";
import { buildForecast, herfindahl, fmt } from "../utils/forecast";

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
    kicker_ar: "الشراكات والاتفاقيات البحثية", kicker_en: "Research partnerships & agreements",
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
    kicker_ar: "فرص التمويل وذكاء التمويل البحثي", kicker_en: "Funding opportunities & funding intelligence",
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
// عبر src/utils/forecast.js: اتجاه خطي + نطاق ثقة 95% تقريبي، مؤشر تركّز، سيناريوهات.
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
//  • البيانات والذكاء: «مستشار بحثي ذكي» كخدمة محادثة داخل المساحة (advisor)
//  • الأولويات: الذكاء الاصطناعي يقترح الأولويات (ai_stats.suggestions)
//  • الشراكات: لا تُنشئها الوزارة — تنشأ محليًا وتصل للوزارة كبيانات (local_flow)
//  • التمويل: الإحصائيات أولًا، ثم أخبار وإعلانات التمويل المتغيرة للطلبة (news)
// =========================================================

MINISTRY_SPACE_DETAILS["data-intelligence"].advisor = true;
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

// ── سياق «المستشار البحثي الذكي»: كل الأرقام المنشورة والتقديرات كنص مرجعي ──
export const buildAdvisorContext = (lang = "ar") => {
  const L = (o, k) => o[`${k}_${lang}`] ?? o[k] ?? "";
  const lines = [];
  Object.entries(MINISTRY_SPACE_DETAILS).forEach(([slug, d]) => {
    lines.push(`## ${L(d, "kicker")} (${slug})`);
    lines.push(lang === "ar" ? "أرقام منشورة:" : "Published figures:");
    d.stats.tiles.forEach((t) => lines.push(`- ${t.value}: ${L(t, "label")}`));
    d.stats.charts.forEach((c) => lines.push(`- ${L(c, "title")}: ${c.data.map((p) => `${L(p, "name")}=${p.value}${c.unit || ""}`).join("، ")}`));
    if (d.ai_stats) {
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
