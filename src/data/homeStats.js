// =========================================================
// إحصائيات ليبيا الحقيقية المعروضة في الصفحة الرئيسية بجانب بطاقة مكوّن
// "الجامعات" (تاب الجامعات فقط — تاب الوزارة يعرض المساحات الأربع، وتاب
// الباحثين بطاقات المراحل). المصادر لا تُعرض على الموقع (بطلب صريح):
//  [UNICEF-NCESD] موجز ميزانية التعليم في ليبيا 2021–2023 (يونيسف / المجلس الوطني
//                 للتطوير الاقتصادي والاجتماعي): 27 جامعة حكومية + أكاديمية الدراسات
//                 العليا، 376,060 طالبًا جامعيًا (2022/2023، نسبة التحاق 47%)، 30,435 طالب
//                 دراسات عليا (27,488 ماجستير، 2,923 دكتوراه)، 25,587 عضو هيئة تدريس.
//                 https://www.unicef.org/mena/media/29026/file/Libya%20Education%20Budget%20Brief.pdf
//  [SCImago]      SCImago Journal & Country Rank — Libya (بيانات Scopus حتى مارس 2026):
//                 الوثائق سنويًا 2015→2025: 457، 397، 484، 513، 586، 740، 1,124، 1,088، 1,166،
//                 1,283، 1,343؛ التعاون الدولي 2025: 83.69%.
//                 https://www.scimagojr.com/countrysearch.php?country=LY
//  [QS-2026]      11 جامعة ليبية في تصنيف QS للمنطقة العربية 2026 (رقم قياسي).
//                 https://libyaobserver.ly/education/university-tripoli-tops-libyan-universities-qs-2026-ranking
//  [LEP]          19 مركزًا وهيئة بحثية تابعة للهيئة الليبية للبحث العلمي:
//                 https://lep.edu.ly/en/scientific-bodies-and-research-centers/
//  [OpenAlex]     الإنتاج البحثي التراكمي المفهرس لأكبر الجامعات الليبية (works_count):
//                 https://api.openalex.org/institutions?filter=country_code:LY&sort=works_count:desc
// =========================================================

export const HOME_STATS = {
  university: {
    tiles: [
      { value: "376,060", label_ar: "طالبًا جامعيًا في ليبيا (2022/2023) — بنسبة التحاق 47%", label_en: "University students in Libya (2022/2023) — 47% enrolment rate" },
      { value: "25,587", label_ar: "عضو هيئة تدريس في الجامعات الحكومية وأكاديمية الدراسات العليا", label_en: "Faculty members in public universities and the Academy of Graduate Studies" },
      { value: "30,435", label_ar: "طالب دراسات عليا داخل ليبيا (27,488 ماجستير و2,923 دكتوراه)", label_en: "Postgraduate students in Libya (27,488 master's and 2,923 PhD)" },
      { value: "11", label_ar: "جامعة ليبية في تصنيف QS للمنطقة العربية 2026 — رقم قياسي", label_en: "Libyan universities in QS Arab Region Rankings 2026 — a record" },
      { value: "27", label_ar: "جامعة حكومية في ليبيا إلى جانب أكاديمية الدراسات العليا", label_en: "Public universities in Libya alongside the Academy of Graduate Studies" },
      { value: "19", label_ar: "مركزًا وهيئة بحثية تحت مظلة الهيئة الليبية للبحث العلمي", label_en: "Research centres and bodies under the Libyan Authority for Scientific Research" },
      { value: "1,343", label_ar: "وثيقة علمية ليبية مفهرسة في Scopus خلال عام 2025", label_en: "Libyan scientific documents indexed in Scopus in 2025" },
      { value: "83.7%", label_ar: "من الأبحاث الليبية المنشورة عام 2025 بتعاون دولي", label_en: "Of Libyan research published in 2025 with international co-authorship" },
    ],
    charts: [
      {
        type: "bar",
        title_ar: "الإنتاج البحثي التراكمي لأكبر الجامعات الليبية (عدد الأعمال المفهرسة)",
        title_en: "Cumulative research output of Libya's largest universities (indexed works)",
        unit: "",
        data: [
          { name_ar: "طرابلس", name_en: "Tripoli", value: 7970, highlight: true },
          { name_ar: "بنغازي", name_en: "Benghazi", value: 6851 },
          { name_ar: "عمر المختار", name_en: "Omar Al-Mukhtar", value: 3258 },
          { name_ar: "الزاوية", name_en: "Zawiya", value: 2511 },
          { name_ar: "مصراتة", name_en: "Misurata", value: 2363 },
          { name_ar: "سبها", name_en: "Sebha", value: 2356 },
        ],
      },
      {
        type: "bar",
        title_ar: "الإنتاج العلمي الليبي المفهرس في Scopus — وثائق سنويًا (2015–2025)",
        title_en: "Libya's Scopus-indexed scientific output — documents per year (2015–2025)",
        unit: "",
        data: [
          { name_ar: "2015", name_en: "2015", value: 457 },
          { name_ar: "2016", name_en: "2016", value: 397 },
          { name_ar: "2017", name_en: "2017", value: 484 },
          { name_ar: "2018", name_en: "2018", value: 513 },
          { name_ar: "2019", name_en: "2019", value: 586 },
          { name_ar: "2020", name_en: "2020", value: 740 },
          { name_ar: "2021", name_en: "2021", value: 1124 },
          { name_ar: "2022", name_en: "2022", value: 1088 },
          { name_ar: "2023", name_en: "2023", value: 1166 },
          { name_ar: "2024", name_en: "2024", value: 1283 },
          { name_ar: "2025", name_en: "2025", value: 1343, highlight: true },
        ],
      },
    ],
  },
};
