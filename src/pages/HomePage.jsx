import { useState, useEffect, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, ArrowRight, Building2, GraduationCap, Award, FlaskConical,
  Landmark, Layers, Sparkles, Users, Search, FileCheck,
  CheckCircle, RefreshCw, AlertCircle, ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE_URL, resolveUploadUrl } from "../api";
import { SiteContext } from "../SiteContext";
import {
  SERVICE_FAMILIES,
  SERVICES_CATALOGUE,
  EXEC_TYPES,
  getServicesByFamily,
} from "../data/servicesCatalogue";

// مكون مساعد لظهور العناصر عند التمرير (مع تحسين الحركة)
const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const currentElement = domRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`reveal-on-scroll ${isVisible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ✅ زر السهم الدائري الموحَّد بآخر كل بطاقة (نفس النمط بكل بطاقات الصفحة)
const CardArrow = ({ Icon }) => (
  <div className="w-9 h-9 rounded-full border border-brand-orange/40 flex items-center justify-center self-end mt-6 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300">
    <Icon className="w-3.5 h-3.5 text-brand-orange group-hover:text-white transition-colors" />
  </div>
);

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith("ar") ?? false;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const currentLang = i18n.language;
  const lang = isRTL ? "ar" : "en";
  // ✅ خط نسخ عربي أنيق لعنوان الهيرو والعبارات الكبيرة (أسلوب Elsevier) —
  // بالإنجليزية يسقط إلى serif قياسي بمقاييس قريبة.
  const serifFont = isRTL
    ? "'Noto Naskh Arabic', 'Cairo', serif"
    : "Georgia, 'Times New Roman', serif";

  const { siteSettings, homeSlides } = useContext(SiteContext);

  const [newsData, setNewsData] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);

  // ✅ فهرس الصورة الحالية بسلايدر الهيرو (انتقال fade)
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  // ✅ التاب النشط بشريط الفئات العائم (الوزارة / الجامعات / الباحثون والطلبة)
  const [activeLevel, setActiveLevel] = useState(2);

  // ✅ عائلة الخدمات النشطة بقسم "الخدمات" — مفاتيح SERVICE_FAMILIES
  const [activeFamily, setActiveFamily] = useState("journal");

  // ✅ نص الهيرو من الترجمة (home.hero_*) — النص المصحَّح من ملفات المنصة.
  // تجاوُز الأدمن القديم (site_settings.hero_desc_*) كان يحمل الوصف العام
  // للنسخة السابقة فيُظهر نصًا غير مطابق للتصميم الجديد؛ يُستخدم الآن فقط
  // عند تفعيله صراحةً بمفتاح hero_desc_override_* من لوحة الأدمن.
  const heroDesc =
    siteSettings[`hero_desc_override_${currentLang}`] || t("home.hero_desc");

  const defaultSlides = [
    { id: 1, image_url: "/Home/home03.jpg" },
    { id: 2, image_url: "/Home/home05.jpg" },
    { id: 3, image_url: "/Home/home04.png" },
    { id: 4, image_url: "/Home/04.jpg" },
  ];
  const bannerSlides = homeSlides.length > 0 ? homeSlides : defaultSlides;

  useEffect(() => {
    if (heroSlideIndex >= bannerSlides.length) setHeroSlideIndex(0);
  }, [bannerSlides.length, heroSlideIndex]);

  useEffect(() => {
    if (bannerSlides.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/get_news.php`);
        const result = await res.json();
        if (result.status === "success") {
          setNewsData(result.data);
        } else {
          setNewsError(result.message);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setNewsError(
          currentLang === "ar"
            ? "فشل الاتصال بخادم البيانات"
            : "Failed to connect to data server",
        );
      } finally {
        setIsLoadingNews(false);
      }
    };
    fetchNews();
  }, [currentLang]);

  // ✅ الفئات المستفيدة — ثلاثة مستويات بترتيب صاحب القرار (المقترح: الوزارة
  // → الجامعات → الباحثون والطلبة). بطاقات الوزارة والجامعات هي أدوار
  // التسجيل الحقيقية (roles.* + audiences.types.*)، وبطاقات الباحثين هي
  // المراحل البحثية الثلاث من دليل الخدمات (بكالوريوس / دراسات عليا / هيئة
  // تدريس) — كل بطاقة تفتح /audience/:key.
  const levelTabs = [
    {
      key: "ministry",
      icon: Landmark,
      label: t("home.tab_ministry"),
      cards: [
        {
          key: "ministry",
          kicker: t("home.card_kicker_decision"),
          title: t("roles.ministry"),
          desc: t("audiences.types.ministry.tagline"),
        },
      ],
    },
    {
      key: "university",
      icon: Building2,
      label: t("home.tab_university"),
      cards: ["university", "college", "research_center"].map((key) => ({
        key,
        kicker: t("home.card_kicker_institution"),
        title: t(`roles.${key}`),
        desc: t(`audiences.types.${key}.tagline`),
      })),
    },
    {
      key: "researchers",
      icon: GraduationCap,
      label: t("home.tab_researchers"),
      cards: [
        { key: "undergrad", kicker: t("home.stage1_label"), title: t("home.stage_undergrad_title"), desc: t("home.stage_undergrad_desc") },
        { key: "grad", kicker: t("home.stage2_label"), title: t("home.stage_grad_title"), desc: t("home.stage_grad_desc") },
        { key: "faculty", kicker: t("home.stage3_label"), title: t("home.stage_faculty_title"), desc: t("home.stage_faculty_desc") },
      ],
    },
  ];

  // ✅ حقائق من ملفات المنصة بدل الأرقام الوهمية السابقة
  const facts = [
    { value: "3", label: t("home.fact1_label") },
    { value: "4", label: t("home.fact2_label") },
    { value: String(SERVICES_CATALOGUE.length), label: t("home.fact3_label") },
    { value: "2025–2035", label: t("home.fact4_label"), accent: true, ltr: true },
  ];

  // ✅ المكونات الثلاثة للمنصة بترتيب الاحتياج (المقترح، القسم 2)
  const components = [
    {
      number: "01",
      image: "/Home/home01.jpg",
      to: "/audience/ministry",
      title: t("home.comp1_title"),
      desc: t("home.comp1_desc"),
      listLabel: t("home.comp1_list_label"),
      items: [1, 2, 3, 4].map((n) => t(`home.comp1_item${n}`)),
    },
    {
      number: "02",
      image: "/Home/home04.png",
      to: "/audience/university",
      title: t("home.comp2_title"),
      desc: t("home.comp2_desc"),
      listLabel: t("home.comp2_list_label"),
      items: [1, 2, 3, 4].map((n) => t(`home.comp2_item${n}`)),
    },
    {
      number: "03",
      image: "/Home/04.jpg",
      to: "/services",
      title: t("home.comp3_title"),
      desc: t("home.comp3_desc"),
      listLabel: t("home.comp3_list_label"),
      items: [1, 2, 3, 4].map((n) => t(`home.comp3_item${n}`)),
    },
  ];

  // ✅ الركائز التقنية الأربع — صف مضغوط تحت المكونات (تفتح صفحة "من نحن"
  // إلى حين اعتماد صفحة الركيزة المستقلة)
  const pillars = [1, 2, 3, 4].map((n) => ({
    number: `0${n}`,
    title: t(`home.tile${n}_title`),
    desc: t(`home.tile${n}_desc`),
  }));

  // ✅ الطبقات التشغيلية الثلاث (المقترح: المنصة الرقمية / خدمات الذكاء
  // الاصطناعي / شبكة الخبراء)
  const layers = [
    { icon: Layers, title: t("home.layer1_title"), desc: t("home.layer1_desc") },
    { icon: Sparkles, title: t("home.layer2_title"), desc: t("home.layer2_desc") },
    { icon: Users, title: t("home.layer3_title"), desc: t("home.layer3_desc") },
  ];

  // ✅ الرحلة البحثية المتكاملة — 9 مراحل من ذكاء الوزارة إلى سجل الباحث وبالعكس
  const journeySteps = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
    number: `0${n}`,
    label: t(`home.journey_step${n}`),
    highlight: n === 1 || n === 9,
  }));

  // ✅ المساحات الأربع لطبقة الوزارة (مواصفة الجزء الثالث، القسم 3)
  const ministrySpaces = [1, 2, 3, 4].map((n) => ({
    number: `0${n}`,
    title: t(`home.ministry_q${n}_title`),
    question: t(`home.ministry_q${n}_question`),
  }));

  const visibleServices = getServicesByFamily(activeFamily).slice(0, 4);

  const SERVICE_ICONS = {
    assessment: FileCheck,
    development: Search,
    editing: FileCheck,
    review: Users,
    journal: Search,
    revision: RefreshCw,
    post: Award,
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      currentLang === "ar" ? "ar-SA" : "en-US",
      { year: "numeric", month: "long", day: "numeric" },
    );
  };

  return (
    <>
      <style>{`
        @keyframes kenBurns { 0% { transform: scale(1); } 100% { transform: scale(1.12); } }
        .ken-burns-effect { animation: kenBurns 18s ease-in-out alternate infinite; }
        .reveal-on-scroll { opacity: 0; transform: translateY(40px); transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* ═══════ 1) الهيرو — صورة داكنة + عنوان نسخ بمائل برتقالي واحد (أسلوب
           Elsevier) بدل النص المتدرّج السابق، مع مربعات برتقالية شفافة من
           هوية الصفحة، وزر أساسي واحد + دخول شبحي. ═══════ */}
      <section className="relative z-30 h-[78vh] md:h-[680px] w-full overflow-hidden bg-brand-ink">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id ?? index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: index === heroSlideIndex ? 1 : 0 }}
            aria-hidden={index !== heroSlideIndex}
          >
            <img
              src={resolveUploadUrl(slide.image_url)}
              alt=""
              className="w-full h-full object-cover ken-burns-effect brightness-[0.38]"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/55 to-brand-ink/15 pointer-events-none"></div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 end-10 h-24 w-24 bg-brand-orange/20" />
          <div className="absolute top-1/3 end-1/4 h-16 w-40 bg-white/5" />
          <div className="absolute bottom-28 end-16 h-32 w-32 bg-brand-orange/10" />
          <div className="absolute top-1/4 end-[8%] h-10 w-10 bg-brand-orange/20" />
          <div className="absolute top-1/2 end-[5%] h-14 w-56 bg-brand-orange/10" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-24 z-10">
          <div className="container mx-auto px-6 w-full">
            <ScrollReveal className="flex flex-col items-start">
              <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-5 block">
                {t("home.hero_kicker")}
              </span>
              <h1
                className="text-4xl sm:text-5xl md:text-[68px] font-normal leading-[1.3] text-white max-w-4xl mb-5"
                style={{ fontFamily: serifFont }}
              >
                {t("home.hero_title_pre")}
                <span className="italic text-brand-orange">{t("home.hero_title_em")}</span>
                {t("home.hero_title_post") ? ` ${t("home.hero_title_post")}` : ""}
              </h1>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl mb-8">
                {heroDesc}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm md:text-[15px] font-bold text-white hover:bg-brand-orange-dark transition-colors"
                >
                  {t("nav.register")}
                  <ArrowIcon className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm md:text-[15px] font-bold text-white hover:bg-white hover:text-brand-ink transition-colors"
                >
                  {t("nav.login")}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* نقاط السلايدر — أسفل الهيرو جهة النهاية، محاذاة لحافة الحاوية، فوق
            شريط التابات مباشرة (تظهر فقط مع أكثر من صورة) */}
        {bannerSlides.length > 1 && (
          <div className="absolute inset-x-0 bottom-12 z-10 pointer-events-none">
            <div className="container mx-auto px-6 flex justify-end">
              <div className="flex items-center gap-2.5 pointer-events-auto">
                {bannerSlides.map((slide, index) => (
                  <button
                    key={slide.id ?? index}
                    onClick={() => setHeroSlideIndex(index)}
                    aria-label={`${t("home.hero_title_em")} ${index + 1}`}
                    aria-current={index === heroSlideIndex}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === heroSlideIndex ? "w-8 bg-brand-orange" : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══════ 2) شريط التابات العائم على حافة الهيرو (الوزارة / الجامعات /
           الباحثون والطلبة) + بطاقات المستوى النشط — نفس منطق Elsevier
           بالضبط (شريط أفقي على خط التقاء الهيرو بالقسم التالي). ═══════ */}
      {/* ✅ flow-root يمنع انهيار الهامش السالب للشريط مع القسم (margin
          collapsing): بدونه كان القسم كله بخلفيته الرمادية ينسحب 32px فوق
          الهيرو فيبدو الشريط ملتصقًا بحافة الهيرو بدل أن يطفو عليها. */}
      <section className="flow-root bg-gray-50 pb-16 md:pb-20 relative z-30">
        <div className="container mx-auto px-6">
          <div className="relative -mt-9 bg-white border border-gray-200 shadow-[0_16px_40px_-24px_rgba(31,26,23,0.35)] grid grid-cols-3">
            {levelTabs.map((level, index) => {
              const isActive = index === activeLevel;
              return (
                <button
                  key={level.key}
                  type="button"
                  onClick={() => setActiveLevel(index)}
                  aria-pressed={isActive}
                  className={`flex items-center justify-center gap-2 md:gap-3 px-3 md:px-6 py-4 md:py-5 text-xs sm:text-sm md:text-[15px] font-bold border-t-[3px] transition-colors duration-300 ${
                    index < levelTabs.length - 1 ? "border-e border-e-gray-200" : ""
                  } ${
                    isActive
                      ? "border-t-brand-orange text-brand-ink"
                      : "border-t-transparent text-brand-muted hover:text-brand-ink"
                  }`}
                >
                  <level.icon
                    className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${isActive ? "text-brand-orange" : ""}`}
                    strokeWidth={1.75}
                  />
                  {level.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {levelTabs[activeLevel].cards.map((card, index) => (
              <ScrollReveal
                key={`${levelTabs[activeLevel].key}-${card.key}`}
                delay={index * 80}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]"
              >
                <Link
                  to={`/audience/${card.key}`}
                  className="group w-full h-full min-h-[250px] text-start bg-white rounded-none p-8 flex flex-col border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300"
                >
                  <span className="text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-2.5 block">
                    {card.kicker}
                  </span>
                  <h3 className="text-lg font-bold text-brand-ink mb-2.5">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-brand-muted flex-1">{card.desc}</p>
                  <CardArrow Icon={ArrowIcon} />
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 3) شريط الحقائق — من ملفات المنصة (المقترح ودليل الخدمات)
           بدل الأرقام الوهمية السابقة (12,500 باحث...). ═══════ */}
      <section className="bg-white border-y border-gray-200 py-7">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
            {facts.map((fact, index) => (
              <div
                key={index}
                className={`flex items-baseline gap-3 ${
                  index < facts.length - 1 ? "lg:border-e lg:border-gray-200 lg:pe-6" : ""
                }`}
              >
                <span
                  dir={fact.ltr ? "ltr" : undefined}
                  className={`font-black leading-none whitespace-nowrap ${
                    fact.ltr ? "text-2xl" : "text-4xl"
                  } ${fact.accent ? "text-brand-orange" : "text-brand-ink"}`}
                >
                  {fact.value}
                </span>
                <span className="text-sm font-semibold text-brand-muted leading-snug">{fact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 4) المكونات الثلاثة (نمط "Innovative solutions" — بطاقات مصوّرة
           بقائمة تحت كل بطاقة) بترتيب الاحتياج من المقترح. ═══════ */}
      <section className="bg-white pt-20 md:pt-24 pb-16 md:pb-18">
        <div className="container mx-auto px-6">
          <ScrollReveal className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end mb-12">
            <h2 className="text-3xl md:text-[44px] md:leading-[1.2] font-bold text-brand-ink">
              {t("home.components_title")}
            </h2>
            <p className="text-base leading-relaxed text-brand-muted">{t("home.components_desc")}</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {components.map((comp, index) => (
              <ScrollReveal key={comp.number} delay={index * 100} className="h-full">
                <Link
                  to={comp.to}
                  className="group h-full bg-white border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-[200px] overflow-hidden">
                    <img
                      src={comp.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute bottom-0 start-0 w-14 h-14 bg-brand-orange"></span>
                    <span className="absolute bottom-3.5 start-3.5 text-lg font-black text-brand-ink leading-none">
                      {comp.number}
                    </span>
                  </div>
                  <div className="p-8 pt-7 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-brand-ink mb-2.5">{comp.title}</h3>
                    <p className="text-sm leading-relaxed text-brand-muted mb-5">{comp.desc}</p>
                    <div className="border-t border-gray-200 pt-4 flex flex-col gap-2 flex-1">
                      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-muted mb-1">
                        {comp.listLabel}
                      </span>
                      {comp.items.map((item) => (
                        <span key={item} className="text-sm font-semibold text-brand-ink">
                          {item}
                        </span>
                      ))}
                    </div>
                    <CardArrow Icon={ArrowIcon} />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 4ب) الركائز التقنية الأربع — صف مضغوط تحت المكونات ═══════ */}
      <section className="bg-white pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <ScrollReveal className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-5">
            <h3 className="text-xl font-bold text-brand-ink">{t("home.pillars_title")}</h3>
            <Link
              to="/about-us"
              className="inline-flex items-center gap-3 text-brand-ink font-bold text-sm group hover:text-brand-orange transition-colors"
            >
              {t("home.explore_features")}
              <span className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <ArrowIcon className="w-3.5 h-3.5" />
              </span>
            </Link>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, index) => (
              <ScrollReveal key={pillar.number} delay={index * 80}>
                <Link
                  to="/about-us"
                  className="group block h-full bg-gray-50 border border-gray-200 hover:border-brand-orange/40 hover:bg-white hover:shadow-lg transition-all duration-300 p-6 flex flex-col gap-2"
                >
                  <span className="flex items-center justify-between">
                    <span className="text-xs font-extrabold tracking-[0.1em] text-brand-orange">{pillar.number}</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-brand-orange" />
                  </span>
                  <span className="text-base font-bold text-brand-ink">{pillar.title}</span>
                  <span className="text-[13px] leading-relaxed text-brand-muted">{pillar.desc}</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 5) شريط برتقالي كامل العرض (نمط بانر Elsevier) — الذكاء
           الاصطناعي المحكوم + الطبقات التشغيلية الثلاث ═══════ */}
      <section className="bg-brand-orange py-16 md:py-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <ScrollReveal className="lg:col-span-7 flex flex-col items-start">
            <span className="text-brand-ink/70 text-xs font-bold tracking-[0.3em] uppercase mb-5 block">
              {t("home.ai_kicker")}
            </span>
            <h2
              className="text-3xl md:text-[44px] md:leading-[1.4] font-normal text-brand-ink mb-5"
              style={{ fontFamily: serifFont }}
            >
              {t("home.ai_title_pre")}
              <span className="italic text-white">{t("home.ai_title_em")}</span>
            </h2>
            <p className="text-base leading-relaxed text-brand-ink/80 max-w-xl mb-8">{t("home.ai_desc")}</p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-[15px] font-bold text-white hover:bg-brand-dark transition-colors"
            >
              {t("home.ai_cta")}
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </ScrollReveal>
          <ScrollReveal className="lg:col-span-5 flex flex-col gap-3" delay={150}>
            <span className="text-brand-ink/70 text-xs font-bold tracking-[0.2em] uppercase mb-1 block">
              {t("home.layers_label")}
            </span>
            {layers.map((layer) => (
              <div
                key={layer.title}
                className="bg-white/[0.18] border border-white/35 px-5 py-4 flex items-center gap-4"
              >
                <span className="w-10 h-10 bg-brand-ink flex items-center justify-center text-brand-orange flex-shrink-0">
                  <layer.icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-base font-bold text-brand-ink">{layer.title}</span>
                  <span className="text-[13px] text-brand-ink/75 leading-snug">{layer.desc}</span>
                </span>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ 6) الرحلة البحثية المتكاملة (بدل "كيف تعمل" الوهمية) —
           9 مراحل من ذكاء الوزارة إلى سجل الباحث وبالعكس ═══════ */}
      <section className="bg-brand-ink py-20 md:py-24">
        <div className="container mx-auto px-6">
          <ScrollReveal className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-end mb-14">
            <div className="lg:col-span-7">
              <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
                {t("home.journey_kicker")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {t("home.journey_title")}
              </h2>
            </div>
            <p className="lg:col-span-5 text-[15px] leading-relaxed text-white/65">
              {t("home.journey_desc")}
            </p>
          </ScrollReveal>

          <ScrollReveal className="relative">
            <span className="hidden lg:block absolute top-6 start-6 end-6 h-px bg-brand-orange/50"></span>
            <div className="relative grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-x-4 gap-y-8">
              {journeySteps.map((step) => (
                <div key={step.number} className="flex flex-col items-start gap-4">
                  <span
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-extrabold ${
                      step.highlight
                        ? "bg-brand-orange text-white"
                        : "bg-brand-ink border border-brand-orange/60 text-brand-orange"
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="text-[13px] font-bold text-white leading-snug">{step.label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal className="mt-12 flex items-start sm:items-center gap-3.5 px-6 py-4 border border-white/10 bg-brand-dark-card">
            <RefreshCw className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5 sm:mt-0" strokeWidth={2} />
            <span className="text-sm font-semibold text-white/80 leading-relaxed">{t("home.journey_loop")}</span>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ 7) الخدمات — عائلات الخدمات السبع من دليل الخدمات (تاب لكل
           عائلة)، مع شارة "نوع التنفيذ" لكل خدمة كما يشترط الدليل، وكل
           بطاقة تفتح /platform-service/:id. ═══════ */}
      <section id="services" className="py-20 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollReveal className="mb-8 text-start">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-ink mb-2">
              {t("services.section_heading")}
            </h2>
            <p className="text-[15px] leading-relaxed text-brand-muted max-w-3xl">{t("home.services_desc")}</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-8">
              {SERVICE_FAMILIES.map((family) => {
                const isActive = family.key === activeFamily;
                return (
                  <button
                    key={family.key}
                    type="button"
                    onClick={() => setActiveFamily(family.key)}
                    className={`relative px-4 md:px-[18px] py-4 text-sm font-bold transition-colors duration-300 ${
                      isActive ? "text-brand-orange" : "text-brand-muted hover:text-brand-ink"
                    }`}
                  >
                    {family[`label_${lang}`]}
                    <span
                      className={`absolute -bottom-px inset-x-0 h-0.5 bg-brand-orange transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleServices.map((service, index) => {
              const Icon = SERVICE_ICONS[service.family] || FileCheck;
              return (
                <ScrollReveal key={service.id} delay={index * 100}>
                  <Link
                    to={`/platform-service/${service.id}`}
                    className="group w-full h-full min-h-[270px] text-start bg-white rounded-none p-7 flex flex-col border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <span className="w-11 h-11 bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-[22px] h-[22px] text-brand-orange" strokeWidth={1.75} />
                      </span>
                      <span className="text-[11px] font-bold text-brand-ink bg-brand-cream-hero px-2.5 py-1 leading-tight text-end">
                        {EXEC_TYPES[service.exec][`label_${lang}`]}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.15em] text-brand-muted mb-1.5 block" dir="ltr">
                      <span className="block text-start">{service.id}</span>
                    </span>
                    <h3 className="text-[17px] font-bold text-brand-ink mb-2">{service[`name_${lang}`]}</h3>
                    <p className="text-[13px] leading-relaxed text-brand-muted flex-1">{service[`desc_${lang}`]}</p>
                    <CardArrow Icon={ArrowIcon} />
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-brand-muted leading-relaxed max-w-3xl">{t("home.services_note")}</p>
            <Link
              to="/services"
              className="inline-flex items-center gap-3 text-brand-ink font-bold text-sm group hover:text-brand-orange transition-colors flex-shrink-0"
            >
              {t("home.services_all", { total: SERVICES_CATALOGUE.length })}
              <span className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <ArrowIcon className="w-3.5 h-3.5" />
              </span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ 8) ذكاء الوزارة (المكون الأول) — الأسئلة الأربع للمساحات
           الأربع + لوحة توضيحية بلا أرقام مختلقة ═══════ */}
      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <ScrollReveal className="lg:col-span-5 flex flex-col items-start">
            <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              {t("home.ministry_kicker")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-ink leading-tight mb-4">
              {t("home.ministry_title")}
            </h2>
            <p className="text-[15px] leading-relaxed text-brand-muted mb-7">{t("home.ministry_desc")}</p>
            <div className="w-full flex flex-col">
              {ministrySpaces.map((space, index) => (
                <div
                  key={space.number}
                  className={`grid grid-cols-[32px,1fr] gap-4 py-4 border-t border-gray-200 ${
                    index === ministrySpaces.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span className="text-xs font-extrabold text-brand-orange pt-1">{space.number}</span>
                  <span>
                    <span className="block text-[15px] font-bold text-brand-ink">{space.title}</span>
                    <span className="text-[13px] text-brand-muted">{space.question}</span>
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/audience/ministry"
              className="mt-7 inline-flex items-center gap-3 text-brand-ink font-bold text-sm group hover:text-brand-orange transition-colors"
            >
              {t("home.ministry_cta")}
              <span className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <ArrowIcon className="w-3.5 h-3.5" />
              </span>
            </Link>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7" delay={150}>
            <div className="bg-brand-ink p-6 md:p-7 shadow-[0_40px_64px_-32px_rgba(31,26,23,0.45)]">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <span className="text-[13px] font-bold text-white tracking-[0.1em]">{t("home.dash_title")}</span>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-1 text-[11px] text-white/70 border border-white/20 px-2.5 py-1"
                    >
                      {t(`home.dash_filter${n}`)}
                      <ChevronDown className="w-3 h-3" />
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { n: 1, w: "70%", strong: true },
                  { n: 2, w: "55%" },
                  { n: 3, w: "40%" },
                  { n: 4, w: "62%" },
                ].map((kpi) => (
                  <div
                    key={kpi.n}
                    className="bg-brand-dark-card border border-brand-dark-border px-4 py-3.5 flex flex-col gap-2.5"
                  >
                    <span className="text-[11px] text-white/60">{t(`home.dash_kpi${kpi.n}`)}</span>
                    <span
                      className={`h-2 ${kpi.strong ? "bg-brand-orange" : "bg-brand-orange/60"}`}
                      style={{ width: kpi.w }}
                    ></span>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-12 gap-3">
                <div className="md:col-span-7 bg-brand-dark-card border border-brand-dark-border p-4 flex flex-col gap-3">
                  <span className="text-[11px] text-white/60">{t("home.dash_trend")}</span>
                  <div className="flex items-end gap-2 h-[110px]">
                    {[45, 62, 38, 80, 55, 70, 48, 66].map((h, i) => (
                      <span
                        key={i}
                        className={`flex-1 ${h === 80 ? "bg-brand-orange" : "bg-white/[0.14]"}`}
                        style={{ height: `${h}%` }}
                      ></span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-5 bg-brand-dark-card border border-brand-dark-border p-4 flex flex-col gap-2.5">
                  <span className="text-[11px] text-white/60 mb-0.5">{t("home.dash_alerts")}</span>
                  {[1, 2, 3, 4].map((n) => (
                    <span key={n} className="flex items-center gap-2 text-xs text-white">
                      <span className="w-1.5 h-1.5 bg-brand-orange flex-shrink-0"></span>
                      {t(`home.dash_alert${n}`)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                <CheckCircle className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" strokeWidth={2} />
                {t("home.dash_source")}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ 9) آخر الأخبار — نفس التخطيط غير المتماثل، بزوايا قائمة
           موحّدة مع بقية بطاقات الصفحة ═══════ */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollReveal className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-3 block">
                {t("news.title_badge_small")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-ink">{t("home.news_title")}</h2>
            </div>
            <Link
              to="/all-news"
              className="inline-flex items-center gap-3 text-brand-ink font-bold text-[15px] group hover:text-brand-orange transition-colors"
            >
              {t("news.view_all")}
              <span className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <ArrowIcon className="w-4 h-4" />
              </span>
            </Link>
          </ScrollReveal>

          {isLoadingNews ? (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-gray-200 h-[440px] animate-pulse"></div>
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 flex-1 min-h-[120px] animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : newsError ? (
            <div className="bg-red-50 text-red-600 p-10 border border-red-100 text-center max-w-lg mx-auto">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <p className="font-bold text-lg">{currentLang === "ar" ? "حدث خطأ" : "Error"}</p>
              <p className="text-sm opacity-80">{newsError}</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {newsData[0] && (
                <ScrollReveal delay={100}>
                  <Link
                    to={`/news/${newsData[0].slug}`}
                    className="group relative block h-full min-h-[380px] lg:min-h-[440px] overflow-hidden bg-brand-ink"
                  >
                    <img
                      src={newsData[0].image_url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.7] transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/40 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-9 flex flex-col items-start gap-3.5">
                      <span className="bg-brand-orange px-3 py-1 text-white text-xs font-bold">
                        {formatDate(newsData[0].created_at)}
                      </span>
                      <h3 className="text-white text-2xl md:text-[28px] font-bold leading-snug max-w-lg">
                        {currentLang === "ar" ? newsData[0].title_ar : newsData[0].title_en}
                      </h3>
                      <span className="text-white font-bold text-[15px] inline-flex items-center gap-2.5 group-hover:gap-4 transition-all">
                        {t("news.read_more")} <ArrowIcon className="w-[18px] h-[18px]" />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              )}

              <div className="flex flex-col gap-4">
                {newsData.slice(1, 4).map((item) => (
                  <ScrollReveal key={item.id} className="flex-1">
                    <Link to={`/news/${item.slug}`} className="group block h-full">
                      <div className="bg-white border border-gray-200 px-7 py-6 h-full flex flex-col justify-center gap-3 transition-all duration-300 hover:border-brand-orange/40 hover:shadow-lg">
                        <h3 className="font-bold text-brand-ink text-[17px] leading-snug group-hover:text-brand-orange transition-colors">
                          {currentLang === "ar" ? item.title_ar : item.title_en}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-brand-muted text-[13px]">{formatDate(item.created_at)}</span>
                          <span className="text-brand-orange font-bold text-[13px] inline-flex items-center gap-2 border-b border-brand-orange pb-0.5 group-hover:gap-3 transition-all">
                            {t("news.read_more")}
                            <ArrowIcon className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ 10) CTA ختامي كريمي — بدل قسم التواصل البرتقالي الثقيل
           (النموذج الكامل باقٍ في صفحة "للتواصل معنا") ═══════ */}
      <section className="bg-brand-cream-hero py-16 md:py-20">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-ink leading-tight mb-2.5">
              {t("home.cta_title")}
            </h2>
            <p className="text-base text-brand-muted">{t("home.cta_desc")}</p>
          </ScrollReveal>
          <ScrollReveal className="flex flex-wrap items-center gap-4 flex-shrink-0" delay={100}>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-brand-orange-dark transition-all duration-300"
            >
              {t("nav.register")}
            </Link>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 bg-white text-brand-ink border border-brand-ink/15 px-7 py-3.5 rounded-full font-medium text-sm hover:border-brand-ink/30 transition-all duration-300"
            >
              {t("nav.contact_us")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default HomePage;
