import { useState, useEffect, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, ArrowRight, Users, Building2, FileText, FlaskConical,
  BookOpen, TrendingUp, HandCoins, Scale, Shield,
  GraduationCap, Award, Globe, Lightbulb, Microscope,
  Database, Settings, HelpCircle, ChevronRight, Star,
  Upload, Search, Loader2, CheckCircle, AlertCircle,
  Phone, Mail, MapPin, Sparkles, FileCheck, PenTool, BarChart3
} from 'lucide-react';
import { Link } from "react-router-dom";
import { API_BASE_URL, resolveUploadUrl } from "../api";
import { SiteContext } from "../SiteContext";
import {
  getValidationMessages,
  validateField as validateFieldValue,
} from "../utils/formValidation";
import ErrorMessage from "../components/shared/ErrorMessage";

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

// مكون العدّاد المتحرك للأرقام في شريط الإحصائيات: يبدأ العد من 0 عند ظهور
// العنصر بالشاشة (IntersectionObserver) ويتوقف عند الرقم الفعلي المطلوب،
// مع الحفاظ على أي بادئة/لاحقة نصية بالقيمة الأصلية (مثل "+" أو الفواصل).
const CountUpValue = ({ value, duration = 1800 }) => {
  const [displayValue, setDisplayValue] = useState(null);
  const domRef = useRef();
  const hasAnimated = useRef(false);

  // نفصل الرقم الأساسي عن أي رموز محيطة به (فواصل الآلاف، +، إلخ) عشان
  // نقدر نحسب قيم وسيطة أثناء العد، ونعيد تنسيقه بنفس شكل النص الأصلي بالنهاية.
  const numericMatch = String(value).match(/[\d,]+/);
  const numericValue = numericMatch
    ? parseInt(numericMatch[0].replace(/,/g, ""), 10)
    : null;

  useEffect(() => {
    if (numericValue === null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const startTime = performance.now();
            const step = (now) => {
              const progress = Math.min((now - startTime) / duration, 1);
              // easeOutExpo لحركة تبدأ سريعة وتتباطأ قرب النهاية (إحساس أكثر حيوية)
              const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              const current = Math.round(numericValue * eased);
              setDisplayValue(current.toLocaleString("en-US"));
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    const currentElement = domRef.current;
    if (currentElement) observer.observe(currentElement);
    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [numericValue, duration]);

  if (numericValue === null) {
    return <span ref={domRef}>{value}</span>;
  }

  // نستبدل الرقم الأساسي بالقيمة المتحركة ونُبقي على أي بادئة/لاحقة (مثل "+")
  const prefix = String(value).slice(0, numericMatch.index);
  const suffix = String(value).slice(numericMatch.index + numericMatch[0].length);
  return (
    <span ref={domRef}>
      {prefix}
      {displayValue === null ? "0" : displayValue}
      {suffix}
    </span>
  );
};

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const currentLang = i18n.language;

  const { siteSettings, homeSlides, siteInfo } = useContext(SiteContext);

  const [servicesData, setServicesData] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);

  // ✅ فهرس الصورة الحالية بسلايدر الهيرو (انتقال fade تقليدي: صورة ثابتة بمكانها
  // تختفي تدريجياً لتظهر التالية، بدل الزحف الأفقي المستمر القديم البطيء جداً)
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  // ✅ فهرس اللوحة النشطة بقسم "كيف تعمل المنصة" (أكورديون صور أفقي مطابق لفيجما):
  // اللوحة النشطة تتمدد وتعرض العنوان والوصف، والبقية تُظهر رقم الخطوة فقط.
  const [activeStep, setActiveStep] = useState(0);
  const howItWorksImages = [
    "/Home/home01.jpg",
    "/Home/04.jpg",
    "/Home/Woman-taking-water-sample-portrait.jpg",
    "/Home/imagesClippedCard_Ind.png",
  ];

  // ✅ حالة قسم "الفئات المستفيدة": التاب النشط (المستوى) فقط الآن — النوع
  // الفرعي لم يعد يُفتح كلوحة موسّعة بنفس الصفحة (كان activeSubtype)، بل
  // ينتقل لصفحة تفصيلية مستقلة (/audience/:key) عبر AudienceDetailPage.jsx.
  const [activeLevel, setActiveLevel] = useState(0);

  // ✅ حالة تاب "خدمات المنصة/الذكاء الاصطناعي" الموحَّد — نفس فكرة activeLevel
  // أعلاه بالضبط (0 = الخدمات، 1 = الذكاء الاصطناعي)، بطلب صريح لدمج القسمين
  // السابقين (خدمات المنصة، وخدمات الذكاء الاصطناعي) بقسم واحد بتاب أفقي.
  const [activeServiceTab, setActiveServiceTab] = useState(0);

  const heroBadge =
    siteSettings[`hero_badge_${currentLang}`] || t("hero.badge");
  const heroTitle =
    siteSettings[`hero_title_${currentLang}`] || t("hero.title");
  const heroDesc = siteSettings[`hero_desc_${currentLang}`] || t("hero.desc");

  const defaultSlides = [
    { id: 1, image_url: "/Home/home05.jpg" },
    { id: 2, image_url: "/Home/home03.jpg" },
    { id: 3, image_url: "/Home/home02.jpg" },
    { id: 4, image_url: "/Home/home04.png" },
    { id: 5, image_url: "/Home/home05.jpg" },
  ];
  const bannerSlides = homeSlides.length > 0 ? homeSlides : defaultSlides;

  // ✅ تبديل الصورة الظاهرة كل 5 ثوانٍ (fade)، مع إعادة الفهرس لأول صورة تلقائياً
  // لو تغيّر عدد الصور (مثلاً الأدمن حذف صورة) حتى لا يبقى الفهرس خارج الحدود.
  useEffect(() => {
    if (heroSlideIndex >= bannerSlides.length) setHeroSlideIndex(0);
  }, [bannerSlides.length, heroSlideIndex]);

  useEffect(() => {
    if (bannerSlides.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const getIconComponent = (iconName) => {
    const iconsMap = {
      BookOpen: BookOpen,
      TrendingUp: TrendingUp,
      HandCoins: HandCoins,
      FlaskConical: FlaskConical,
      FileText: FileText,
      Users: Users,
      Building2: Building2,
      Scale: Scale,
      Shield: Shield,
      GraduationCap: GraduationCap,
      Award: Award,
      Globe: Globe,
      Lightbulb: Lightbulb,
      Microscope: Microscope,
      Database: Database,
      Settings: Settings,
      HelpCircle: HelpCircle,
      ChevronRight: ChevronRight,
      Star: Star,
      "book-open": BookOpen,
      "trending-up": TrendingUp,
      "hand-coins": HandCoins,
      "flask-conical": FlaskConical,
      "file-text": FileText,
      "graduation-cap": GraduationCap,
    };
    return iconsMap[iconName] || BookOpen;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, newsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/get_services.php`),
          fetch(`${API_BASE_URL}/get_news.php`),
        ]);

        const servicesResult = await servicesRes.json();
        if (servicesResult.status === "success") {
          setServicesData(servicesResult.data);
        }

        const newsResult = await newsRes.json();
        if (newsResult.status === "success") {
          setNewsData(newsResult.data);
        } else {
          setNewsError(newsResult.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setNewsError(
          currentLang === "ar"
            ? "فشل الاتصال بخادم البيانات"
            : "Failed to connect to data server",
        );
      } finally {
        setIsLoadingServices(false);
        setIsLoadingNews(false);
      }
    };

    fetchData();
  }, [currentLang]);

  // ⚠️ أرقام توضيحية مؤقتة (placeholder) بطلب صريح من المستخدم لإرجاع القسم بصريًا
  // بنفس الشكل المرجعي — ليست مربوطة بمصدر بيانات حقيقي من قاعدة البيانات بعد.
  // عند توفر endpoint حقيقي (عدد الباحثين المسجَّلين، عدد الجامعات...) استبدل
  // هذه القيم الثابتة بالنتيجة الفعلية بدل تعديلها يدويًا هنا.
  const statsData = [
    { count: "12,500+", label: isRTL ? "باحث مسجل" : "Registered Researchers" },
    { count: "85+", label: isRTL ? "جامعة ومؤسسة" : "Universities & Institutes" },
    { count: "45,000+", label: isRTL ? "بحث علمي منشور" : "Published Researches" },
    { count: "3,200+", label: isRTL ? "مشروع بحثي نشط" : "Active Research Projects" },
  ];

  // ✅ بطاقات "نبذة عن المنصة" — استُبدل المحتوى بطلب صريح ليعكس الركائز
  // التقنية الأربع لسورس بدل الأوصاف العامة السابقة (نظام البحث/التصنيف/
  // الشفافية/التكامل): التحول الرقمي، الذكاء الاصطناعي، الأتمتة، والأمن
  // والخصوصية.
  const infoTiles = [
    {
      key: "digital",
      title: t("home.tile1_title"),
      desc: t("home.tile1_desc"),
    },
    {
      key: "ai",
      title: t("home.tile2_title"),
      desc: t("home.tile2_desc"),
    },
    {
      key: "automation",
      title: t("home.tile3_title"),
      desc: t("home.tile3_desc"),
    },
    {
      key: "security",
      title: t("home.tile4_title"),
      desc: t("home.tile4_desc"),
    },
  ];

  const howItWorks = [
    { number: "01", title: t("home.step1_title"), desc: t("home.step1_desc") },
    { number: "02", title: t("home.step2_title"), desc: t("home.step2_desc") },
    { number: "03", title: t("home.step3_title"), desc: t("home.step3_desc") },
    { number: "04", title: t("home.step4_title"), desc: t("home.step4_desc") },
  ];

  // ✅ الفئات المستفيدة — تبويب أفقي (الوزارة/الجامعة/الطالب والباحثون/
  // الموظفون) مطابق لأسلوب Elsevier بالضبط: تابات بالأعلى، وتحت كل تاب
  // بطاقات "أنواع" فرعية (نفس أدوار التسجيل الحقيقية بـ RegisterPage —
  // undergrad/grad/phd/faculty/researcher تحت الطالب، مثلاً)، والضغط على
  // نوع فرعي معيّن يفتح لوحة تفاصيل أوسع تحته (وصف + نقاط + زر تسجيل) —
  // بدل البطاقة العامة الواحدة السابقة لكل مستوى.
  const levelTabs = [
    {
      key: "ministry",
      icon: Building2,
      tabLabel: t("audiences.tab_ministry"),
      desc: t("audiences.ministry_desc"),
      subtypes: [{ key: "ministry", icon: Building2 }],
    },
    {
      key: "university",
      icon: GraduationCap,
      tabLabel: t("audiences.tab_university"),
      desc: t("audiences.university_desc"),
      subtypes: [
        { key: "university", icon: Building2 },
        { key: "college", icon: Award },
        { key: "research_center", icon: FlaskConical },
      ],
    },
    {
      key: "student",
      icon: Users,
      tabLabel: t("audiences.tab_student"),
      desc: t("audiences.student_desc"),
      subtypes: [
        { key: "undergrad", icon: GraduationCap },
        { key: "grad", icon: BookOpen },
        { key: "phd", icon: Award },
        { key: "faculty", icon: Users },
        { key: "researcher", icon: Microscope },
      ],
    },
    {
      key: "employee",
      icon: Settings,
      tabLabel: t("audiences.tab_employee"),
      desc: t("audiences.employee_desc"),
      subtypes: [
        { key: "employee", icon: Settings },
        { key: "service_provider", icon: Globe },
      ],
    },
  ];

  // ✅ عنوان/وصف/تفاصيل كل "نوع فرعي" — نفس أسماء الأدوار الحقيقية الموجودة
  // بصفحة التسجيل (roles.*)، مع tagline و4 نقاط تفصيلية من مساحة i18n
  // audiences.types.* الجديدة.
  const getSubtypeContent = (key) => ({
    title: t(`roles.${key}`),
    tagline: t(`audiences.types.${key}.tagline`),
    details: [
      t(`audiences.types.${key}.detail1`),
      t(`audiences.types.${key}.detail2`),
      t(`audiences.types.${key}.detail3`),
      t(`audiences.types.${key}.detail4`),
    ],
  });

  // ✅ key مضافة لكل خدمة — تُستخدم لبناء رابط الصفحة التفصيلية (/platform-service/:key)
  // بنفس نمط levelTabs/audience أعلاه، بطلب صريح: كل بطاقة تفتح صفحة مستقلة.
  const platformServices = [
    {
      key: "submit_research",
      icon: Upload,
      title: t("services.submit_research"),
      desc: t("services.submit_research_desc"),
    },
    {
      key: "track_status",
      icon: TrendingUp,
      title: t("services.track_status"),
      desc: t("services.track_status_desc"),
    },
    {
      key: "funding",
      icon: HandCoins,
      title: t("services.funding"),
      desc: t("services.funding_desc"),
    },
    {
      key: "collaboration",
      icon: Search,
      title: t("services.collaboration"),
      desc: t("services.collaboration_desc"),
    },
  ];

  // ✅ خدمات الذكاء الاصطناعي — بنفس بنية platformServices تماماً (title/desc/key)
  // لتُعرض بنفس نمط البطاقات تحت تاب "الذكاء الاصطناعي"، بطلب صريح بدل قسم
  // منفصل بتصميم مختلف كان موجوداً سابقاً.
  const aiServices = [
    {
      key: "ai_evidence_match",
      icon: FileCheck,
      title: t("services.types.ai_evidence_match.title"),
      desc: t("services.types.ai_evidence_match.desc"),
    },
    {
      key: "ai_writing_assistant",
      icon: PenTool,
      title: t("services.types.ai_writing_assistant.title"),
      desc: t("services.types.ai_writing_assistant.desc"),
    },
    {
      key: "ai_gap_insights",
      icon: BarChart3,
      title: t("services.types.ai_gap_insights.title"),
      desc: t("services.types.ai_gap_insights.desc"),
    },
  ];

  // ✅ محتوى الصفحة التفصيلية لأي خدمة (منصة أو ذكاء اصطناعي) — للخدمات
  // الأربع الأولى العنوان/الوصف من services.* مباشرة (متوافقة مع النصوص
  // المعروضة بالبطاقة نفسها)، ولخدمات الذكاء الاصطناعي الثلاث من
  // services.types.<key> (title/desc خاصة بها لأنها غير موجودة كمفاتيح
  // منفصلة قديمة). نفس فكرة getSubtypeContent أعلاه بالضبط.
  const getServiceContent = (key) => {
    const isAiKey = key.startsWith("ai_");
    return {
      title: isAiKey ? t(`services.types.${key}.title`) : t(`services.${key}`),
      desc: isAiKey ? t(`services.types.${key}.desc`) : t(`services.${key}_desc`),
      tagline: t(`services.types.${key}.tagline`),
      details: [
        t(`services.types.${key}.detail1`),
        t(`services.types.${key}.detail2`),
        t(`services.types.${key}.detail3`),
        t(`services.types.${key}.detail4`),
      ],
    };
  };

  // ⛔ aiLiveFeatures/aiRoadmapFeatures حُذفتا — كانتا تغذّيان قسم "خدمات
  // الذكاء الاصطناعي" القديم (رؤية وطنية موسّعة بتصميم منفصل)، الذي دُمج
  // الآن بقسم "خدمات المنصة" الموحَّد (تاب + بطاقات، تعتمد aiServices بدلاً
  // من هذين المصفوفتين) — بطلب صريح.

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      currentLang === "ar" ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  // Form Logic (Unchanged)
  const validationMessages = getValidationMessages(currentLang);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isFormSuccess, setIsFormSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const validateField = (name, value) =>
    validateFieldValue(name, value, validationMessages);

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) {
        newErrors[key] = err;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setApiError(null);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsFormLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/send_message.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.status === "success") {
        setIsFormSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
        setTouched({});
        setTimeout(() => setIsFormSuccess(false), 4000);
      } else {
        setApiError(result.message);
      }
    } catch (err) {
      setApiError(
        currentLang === "ar"
          ? "فشل الاتصال بالخادم"
          : "Failed to connect to server",
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const base =
      "w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 placeholder:text-gray-400 focus:shadow-lg focus:bg-white";
    const hasError = touched[fieldName] && errors[fieldName];
    if (hasError) {
      return `${base} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/50`;
    }
    return `${base} border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 bg-gray-50/50`;
  };

  return (
    <>
      <style>{`
        @keyframes scrollLtr { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        @keyframes scrollRtl { 0% { transform: translateX(-33.333%); } 100% { transform: translateX(0); } }
        @keyframes kenBurns { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 15px rgba(241,90,40,0.2); } 50% { box-shadow: 0 0 25px rgba(241,90,40,0.5); } }
        
        .banner-track-ltr { animation: scrollLtr 30s linear infinite; }
        .banner-track-rtl { animation: scrollRtl 30s linear infinite; }
        .banner-track-ltr:hover, .banner-track-rtl:hover { animation-play-state: paused; }
        .ken-burns-effect { animation: kenBurns 15s ease-in-out alternate infinite; }
        
        /* Scroll Reveal CSS - تحسين الحركة */
        .reveal-on-scroll { opacity: 0; transform: translateY(50px) scale(0.95); transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0) scale(1); }
      `}</style>

      {/* ═══════ البانر الديناميكي (سلايدر fade تقليدي: صورة ثابتة بمكانها تختفي
           تدريجياً لتظهر التالية، بدل الزحف الأفقي المستمر البطيء جداً سابقاً) ═══════ */}
      {/* ✅ z-30 صريحة: بدونها كان قسم الإحصائيات تحتها (z-20 مع -mt-16) يتراكب فوق
          آخر 64px من البانر فعلياً (رغم عدم ظهور ذلك بصرياً) ويبلع نقرات نقاط التنقل. */}
      {/* ✅ h-[70vh] على الموبايل بدل h-[50vh] ثابتة — بارتفاع 50vh فقط، العنوان
          (4 أسطر عربية بحجم text-5xl) كان يفيض فعلياً فوق وتحت مساحة الهيرو على
          الشاشات الصغيرة (يُقصّ تحت الـNavbar، والزر يتزاحم مع الشريط اللي بعده)
          — bug حقيقي اتأكد بالقياس، مش تفضيل تصميم. md:h-[50vh] تبقى كما طُلب. */}
      <section className="relative z-30 h-[70vh] md:h-[50vh] w-full overflow-hidden bg-brand-ink group">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id ?? index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: index === heroSlideIndex ? 1 : 0 }}
            aria-hidden={index !== heroSlideIndex}
          >
            <img
              src={resolveUploadUrl(slide.image_url)}
              alt="Research"
              className="w-full h-full object-cover ken-burns-effect brightness-75 group-hover:brightness-90 transition-all duration-1000"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* تحسين التدرج اللوني فوق الصورة */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/60 to-brand-ink/30"></div>
          </div>
        ))}

        {/* تأثير Vignette لتركيز الانتباه للمنتصف */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>

        {/* نقاط التنقل بين الصور (تظهر فقط لو في أكثر من صورة واحدة) */}
        {bannerSlides.length > 1 && (
          <div className="absolute bottom-8 inset-x-0 flex items-center justify-center gap-2.5 z-20">
            {bannerSlides.map((slide, index) => (
              <button
                key={slide.id ?? index}
                onClick={() => setHeroSlideIndex(index)}
                aria-label={`${t("home.hero_title_line1")} ${index + 1}`}
                aria-current={index === heroSlideIndex}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === heroSlideIndex ? "w-8 bg-brand-orange" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* ✅ items-start/text-start بدل items-center/text-center — بطلب صريح:
            النص يبدأ من جهة "بداية" اتجاه اللغة (يمين بالعربي RTL، يسار
            بالإنجليزي LTR) بدل التمركز بمنتصف الهيرو. start/end منطقية
            (لا left/right ثابتة) فتنعكس تلقائيًا مع اتجاه الصفحة.
            ✅ container mx-auto px-6 بدل px-6 md:px-16 — بطلب صريح: النص كان
            محاذى لحافة الشاشة مباشرة، بلا علاقة بمحاذاة أي عنصر آخر بالصفحة.
            الآن نفس حاوية شريط الإحصائيات (container mx-auto px-6) بالضبط،
            فيتحاذى النص عمودياً مع أول رقم بالإحصائيات تحته تمامًا. */}
        <div className="absolute inset-0 flex flex-col items-start justify-center text-start z-10">
          <div className="container mx-auto px-6 w-full">
          <ScrollReveal className="flex flex-col items-start w-full">
            {/* ⏸️ إخفاء البادج الصغير ("المنصة الوطنية للبحث الأكاديمي") فوق العنوان بطلب صريح */}
            {/* ✅ font-bold بدل font-black — بطلب صريح: وزن 900 (font-black) بخط Cairo
                يصعب قراءته بالعربي بهذا الحجم الكبير؛ font-bold (700) أخف وأوضح. */}
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white mb-4 md:mb-8 leading-tight drop-shadow-2xl max-w-5xl tracking-tight">
              {t("home.hero_title_line1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-400 drop-shadow-lg">
                {t("home.hero_title_line2")}
              </span>
            </h1>
            {/* ✅ نص عادي فوق الصورة بدرجة ظل قوية بدل الصندوق الداكن شبه الشفاف
                السابق — لمسة "بوكس فوق بوكس" كانت تبدو مزدحمة، والمرجع
                (Elsevier) يضع النص مباشرة فوق الصورة بلا إطار. */}
            <p className="text-lg md:text-xl text-white/90 mb-12 leading-relaxed max-w-2xl font-light [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]">
              {heroDesc}
            </p>

            {/* ✅ زر "تسجيل الدخول" فقط الآن — زر "إنشاء حساب" حُذف من الهيرو
                بطلب صريح (يبقى متاحاً بالـ Navbar العلوي كالمعتاد). */}
            <div className="flex flex-wrap items-center justify-start gap-4">
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-sm text-white font-bold text-sm border border-white/30 hover:bg-white hover:text-brand-ink transition-all duration-300"
              >
                {t("nav.login")}
              </Link>
            </div>
          </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════ شريط الإحصائيات + لوحة تابات الفئات المستفيدة العائمة —
           بعد تشخيص دقيق بالقياس: كانت التابات صفاً مسطحاً بعرض الحاوية
           الكاملة (justify-center داخل 1232px) بلا أي هوية بصرية مستقلة
           (بلا ظل/زوايا/تموضع خاص)، فبدت "عائمة بمنتصف شريط لوني" لا
           "لوحة متصلة" — بعكس مرجع Elsevier حيث تطفو اللوحة كعنصر محدود
           العرض على حد الصورة/الشريط مباشرة، بظل يرفعها عن الخلفية.
           ✅ التابات الآن -mb (سالب) تسحبها لتتمركز فعلياً على خط التقاء
           الشريط الغامق والقسم الأبيض (نص فوق الخط، نص تحته)، بلوحة بيضاء
           محدودة العرض (لا تمتد لعرض الحاوية)، بظل وزوايا تمنحها هوية
           "بطاقة عائمة" حقيقية، والتاب النشط بخلفية برتقالية (لون البراند
           بدل الأبيض العادي) ليبرز فعلياً كعنصر مُختار لا مجرد تبديل لون. */}
      <section className="relative z-20 bg-brand-ink border-t-2 border-brand-orange pt-10 md:pt-12 pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 rtl:divide-x-reverse">
            {statsData.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="text-center px-4">
                  <p className="text-3xl md:text-4xl font-black text-white mb-1.5">
                    <CountUpValue value={stat.count} />
                  </p>
                  <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-brand-orange">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* لوحة التابات العائمة — تُسحب لأسفل بـ margin سالبة (-mb) تساوي
              تقريباً نصف ارتفاعها، فتطفو فعلياً على خط التقاء الشريط الغامق
              والقسم الأبيض التالي (z-30 لتبقى فوق الاثنين).
              ✅ shadow-2xl محذوفة بطلب صريح — لوحة بلا ظل، فقط اللون الأبيض
              وحده يفصلها بصرياً عن الشريط الغامق خلفها. */}
          <div className="relative z-30 -mb-32 md:-mb-28 mt-10 md:mt-12 flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-1 bg-white rounded-2xl p-1.5">
              {levelTabs.map((level, index) => {
                const isActive = index === activeLevel;
                return (
                  <button
                    key={level.key}
                    type="button"
                    onClick={() => setActiveLevel(index)}
                    className={`inline-flex items-center gap-2 px-5 md:px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-brand-orange text-white shadow-md"
                        : "text-brand-muted hover:text-brand-ink hover:bg-gray-50"
                    }`}
                  >
                    <level.icon className="w-4 h-4" strokeWidth={1.75} />
                    {level.tabLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ الفئات المستفيدة — بطاقات "أنواع" فرعية للمستوى النشط
           بالتابات أعلاه (المدموجة الآن بشريط الإحصائيات الغامق)، والضغط
           على نوع فرعي يفتح لوحة تفاصيل أوسع تحته (نفس فكرة "بكالوريوس تحت
           الطالب" التي طلبها المستخدم بالتحديد). الأنواع الفرعية هي أدوار
           التسجيل الحقيقية بالمنصة (roles.* — نفس القائمة المستخدمة بصفحة
           إنشاء الحساب).
           ✅ لا badge/عنوان/وصف — حُذفوا بالكامل بطلب صريح؛ القسم يبدأ
           مباشرة ببطاقات الأنواع الفرعية.
           ✅ bg-gray-50 بدل bg-white — بطلب صريح: بطاقات الأنواع الفرعية
           (bg-white بحد رمادي رفيع) كانت تندمج بصريًا مع خلفية القسم البيضاء
           المطابقة تمامًا، فصارت تبان "ذائبة" لا بارزة. gray-50 قريب جدًا
           من الأبيض (بطلب صريح: "أقرب للأبيض") لكنه يكفي للتمييز — البطاقات
           البيضاء تبرز عنه دون تغيير لون البطاقات نفسها.
           ✅ pt أكبر (20/28 بدل 12/14) لإرجاع مسافة معقولة بين لوحة التابات
           العائمة والبطاقة الأولى تحتها — بطلب صريح. ═══════ */}
      {/* ═══════ الفئات المستفيدة + نبذة عن المنصة — قسم واحد متصل (بدل
           قسمين منفصلين بنفس الخلفية يخلقان مسافة فارغة مضاعفة بينهما بلا
           مبرر لوني) — بطلب صريح لإزالة الفراغ الكبير قبل "عن سورس" ودمج
           التدفق البصري. ═══════ */}
      <section id="levels" className="pt-20 md:pt-28 pb-20 md:pb-28 bg-gray-50 relative">
        <div className="container mx-auto px-6">
          {/* بطاقات الأنواع الفرعية للمستوى النشط — نفس شبكة وتصميم بطاقات
              "نبذة عن المنصة" بالضبط (sm:grid-cols-2 lg:grid-cols-4 ثابتة،
              min-h-[260px] p-8، عنوان uppercase، سهم دائري بالأسفل) بدل شبكة
              متغيرة الأعمدة (كانت تصل حتى 5 أعمدة فتُنتج بطاقات ضيقة متطاولة
              غير مرتبة) — بطلب صريح لتوحيد شكل كل بطاقات الصفحة.
              ✅ grid-cols بعرض ثابت (minmax(0,280px)) + justify-center بدل
              الأعمدة المرنة (1fr): لما يكون عدد البطاقات أقل من 4 (مثال
              "الجامعة" بـ3 بطاقات)، كانت الأعمدة المرنة الثابتة العدد تترك
              الفراغ يمين الصفحة فتبدو البطاقات متكدّسة يسارًا بدل متمركزة —
              بطلب صريح. هذا النمط يتمركز تلقائيًا بأي عدد بطاقات (1 إلى 5+). */}
          {/* ✅ كل بطاقة الآن <Link> حقيقي لصفحة تفصيلية مستقلة (/audience/:key)
              بدل زر يفتح لوحة موسّعة بنفس الصفحة — بطلب صريح: الضغط على
              البطاقة يفتح صفحة كاملة منفصلة، لا يوسّع محتوى بمكانه. */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(0,280px))] justify-center gap-6 mb-2">
            {levelTabs[activeLevel].subtypes.map((sub, index) => {
              const content = getSubtypeContent(sub.key);
              return (
                <ScrollReveal key={`${levelTabs[activeLevel].key}-${sub.key}`} delay={index * 80}>
                  <Link
                    to={`/audience/${sub.key}`}
                    className="group w-full h-full min-h-[260px] text-start bg-white rounded-none p-8 flex flex-col transition-all duration-300 border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg"
                  >
                    <h3 className="text-base font-bold uppercase tracking-wide mb-4 text-brand-ink">
                      {content.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-brand-muted flex-1">
                      {content.tagline}
                    </p>
                    <div className="w-9 h-9 rounded-full border border-brand-orange/40 flex items-center justify-center self-end mt-6 transition-all duration-300 group-hover:bg-brand-orange group-hover:border-brand-orange">
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-brand-orange group-hover:text-white transition-all duration-300 ${
                          isRTL ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          {/* ═══════ نبذة عن المنصة — يتابع بنفس القسم الأبيض مباشرة (بلا
               <section> منفصل كان يضيف padding مضاعفًا فيخلق فراغًا كبيرًا
               غير مبرَّر بين البطاقات وهذا العنوان) — بطلب صريح لدمج التدفق
               البصري. mt-20 md:mt-28 يفصل بمسافة واحدة معقولة بدل مسافتين
               متراكمتين. ═══════ */}
          {/* ✅ badge "عن SOURCE" محذوف بطلب صريح — لا eyebrow label قبل العنوان.
              ✅ max-w-3xl/max-w-2xl محذوفتان من العنوان والوصف — بطلب صريح
              يمتدان الآن على كامل عرض الحاوية بدل الانحصار بعرض جزئي. */}
          <ScrollReveal className="mt-20 md:mt-28">
            {/* ✅ mb-4 بدل mb-8 — لا يوجد نص وصفي بين العنوان والبطاقات (حُذف بتصميم
                سابق)، فمسافة أكبر كانت تترك فراغًا غير منطقي هنا لا يخدم أي محتوى.
                ✅ font-bold (700) بكل عناوين الصفحة الآن — بطلب صريح لتخفيف الوزن
                العام؛ font-black/font-extrabold (900/800) بخط Cairo كانت تصعّب
                القراءة بالعربي بالأحجام الكبيرة. */}
            {/* ⛔ text-justify أُزيلت — تحقق فعلي بالمتصفح أثبت أنها no-op تمامًا:
                كل عنصر هنا سطر واحد فقط (لا التفاف)، وتبرير CSS لا يمدّ "آخر
                سطر بالفقرة" أبدًا حسب المواصفة، وبما أن كل سطر هو آخر سطر
                فعليًا هنا، لم يتغيّر شيء بصريًا رغم الكود. لم تُستبدل بحل آخر
                بعد — القرار النهائي (تصميم مختلف، أو text-align-last صراحة
                رغم مخاطر تباعد كلمات مبالغ فيه بجمل قصيرة) بانتظار توجيه. */}
            <h2 className="text-4xl md:text-5xl font-bold text-brand-ink leading-tight mb-6">
              {t("home.about_title")}
            </h2>
            {/* ✅ خمس أسطر تشرح فكرة سورس تحت العنوان مباشرة — بطلب صريح، كل
                سطر جملة قائمة بذاتها (لا فقرة متصلة) بنفس منطق الفقرات
                القصيرة المعتمد في باقي الصفحة. */}
            <div className="space-y-2 mb-10">
              {[1, 2, 3, 4, 5].map((n) => (
                <p key={n} className="text-base text-brand-muted leading-relaxed">
                  {t(`home.about_lines${n}`)}
                </p>
              ))}
            </div>
          </ScrollReveal>

          {/* ✅ بطاقات بزوايا قائمة (بلا استدارة) بحد رفيع — بطلب صريح لمطابقة
              أسلوب أكثر "مؤسساتي/تحريري" (زوايا حادة بدل الاستدارة الناعمة).
              زر سهم دائري بآخر كل بطاقة (self-end: يمين بالإنجليزي، يسار
              بالعربي تلقائيًا حسب اتجاه الصفحة) — نفس نمط الزر بباقي بطاقات
              الصفحة، بدل ترك البطاقة تنتهي بفراغ بعد الوصف مباشرة. */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {infoTiles.map((tile, index) => (
              <ScrollReveal key={tile.key} delay={index * 100 + 100}>
                <Link
                  to="/about-us"
                  className="group h-full min-h-[260px] p-8 rounded-none bg-white text-brand-ink border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-500 flex flex-col"
                >
                  <h3 className="text-base font-bold uppercase tracking-wide mb-4 text-brand-ink">
                    {tile.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-brand-muted flex-1">
                    {tile.desc}
                  </p>
                  <div className="w-9 h-9 rounded-full border border-brand-orange/40 flex items-center justify-center self-end mt-6 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300">
                    <ArrowIcon className="w-3.5 h-3.5 text-brand-orange group-hover:text-white transition-colors" />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {/* ✅ text-end المنطقية (لا text-right الثابتة) — بطلب صريح: الزر
              بزاوية "النهاية" حسب اتجاه اللغة — يسار الصفحة بالعربي (RTL)،
              ويمين الصفحة بالإنجليزي (LTR) تلقائيًا دون أي شرط إضافي. */}
          <ScrollReveal className="text-end">
            <Link
              to="/about-us"
              className="inline-flex items-center gap-3 text-brand-ink font-bold text-lg group hover:text-brand-orange transition-colors"
            >
              {t("home.explore_features")}{" "}
              <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <ArrowIcon className="w-4 h-4" />
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>


      {/* ═══════ كيف تعمل المنصة (تصميم Timeline) ═══════ */}
      <section className="bg-brand-ink py-20 md:py-28 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <span className="text-brand-orange text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
              {t("home.how_label")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-3xl mx-auto">
              {t("home.how_title")}
            </h2>
          </ScrollReveal>

          {/* ✅ أكورديون صور أفقي (مطابق لتصميم فيجما): اللوحة النشطة تتمدد وتعرض
              العنوان والوصف فوق الصورة، وبقية اللوحات تُظهر رقم الخطوة فقط وتتمدد
              قليلاً عند المرور — بدل دوائر الأرقام الثابتة السابقة.
              ✅ rounded-3xl بدل rounded-[2rem] — توحيد كل الأنصاف/اللوحات الكبيرة
              بالصفحة على نفس قيمة الاستدارة القياسية من Tailwind. */}
          <ScrollReveal>
            <div className="flex gap-3 md:gap-4 h-[420px] md:h-[560px] rounded-3xl overflow-hidden">
              {howItWorks.map((step, index) => {
                const isActive = index === activeStep;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    aria-pressed={isActive}
                    className={`relative h-full flex-shrink-0 overflow-hidden text-start transition-all duration-700 ease-out focus:outline-none ${
                      isActive ? "flex-[3.4]" : "flex-1 hover:flex-[1.35]"
                    }`}
                    style={{ minWidth: isActive ? undefined : "84px" }}
                  >
                    <img
                      src={howItWorksImages[index % howItWorksImages.length]}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${
                        isActive
                          ? "from-brand-ink via-brand-ink/50 to-transparent"
                          : "from-brand-ink/95 via-brand-ink/50 to-brand-ink/20"
                      }`}
                    ></div>

                    <span
                      className={`absolute font-black text-white/70 transition-all duration-500 ${
                        isActive
                          ? "top-6 start-6 text-2xl"
                          : "top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-6xl"
                      }`}
                    >
                      0{index + 1}
                    </span>

                    {isActive && (
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
                        <h3 className="text-white font-bold text-xl md:text-2xl mb-2 leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed max-w-md">
                          {step.desc}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ خدمات المنصة + الذكاء الاصطناعي — قسم واحد موحَّد (بدل قسمين
           منفصلين: "خدمات المنصة" ببطاقات، و"خدمات الذكاء الاصطناعي" بعرض
           رؤية وطنية موسّعة) — بطلب صريح: عنوان بسيط محاذى لبداية اتجاه اللغة
           (لا وسط)، تحته تاب أفقي (الخدمات / الذكاء الاصطناعي)، وتحت كل تاب
           بطاقات — الضغط على بطاقة يفتح صفحة تفصيلية مستقلة (/platform-service/:key)
           بنفس نمط قسم "الفئات المستفيدة" أعلاه بالضبط. bg-gray-50 مطابقة
           لخلفية قسم "عن سورس" (بطلب صريح: نفس الخلفية). ═══════ */}
      <section id="services" className="py-20 md:py-28 bg-gray-50 relative">
        <div className="container mx-auto px-6 relative z-10">
          {/* ✅ عنوان بسيط محاذى للبداية (يمين بالعربي RTL، يسار بالإنجليزي
              LTR) — لا badge، لا وسط، بنفس منطق عنوان "عن سورس". */}
          <ScrollReveal className="mb-10 text-start">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-ink">
              {t("services.section_heading")}
            </h2>
          </ScrollReveal>

          {/* شريط التاب — نفس نمط تابات "الفئات المستفيدة" أعلاه بالضبط
              (خلفية برتقالية للنشط، فاصل سفلي بسيط). */}
          <ScrollReveal>
            <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-10">
              {[
                { label: t("services.tab_services"), icon: Upload },
                { label: t("services.tab_ai"), icon: Sparkles },
              ].map((tab, index) => {
                const isActive = index === activeServiceTab;
                return (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveServiceTab(index)}
                    className={`relative inline-flex items-center gap-2 px-5 py-4 text-sm font-bold transition-colors duration-300 ${
                      isActive
                        ? "text-brand-orange"
                        : "text-brand-muted hover:text-brand-ink"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" strokeWidth={1.75} />
                    {tab.label}
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

          {/* بطاقات الخدمات — نفس تصميم بطاقات "الفئات المستفيدة" بالضبط
              (grid ثابت، min-h موحّد، عنوان uppercase، سهم دائري بالأسفل)،
              والضغط على أي بطاقة ينقل لصفحة تفصيلية مستقلة. */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeServiceTab === 0 ? platformServices : aiServices).map((service, index) => (
              <ScrollReveal key={service.key} delay={index * 100}>
                <Link
                  to={`/platform-service/${service.key}`}
                  className="group w-full h-full min-h-[260px] text-start bg-white rounded-none p-8 flex flex-col transition-all duration-300 border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-5">
                    <service.icon className="w-5 h-5 text-brand-orange" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-wide mb-3 text-brand-ink">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-brand-muted flex-1">
                    {service.desc}
                  </p>
                  <div className="w-9 h-9 rounded-full border border-brand-orange/40 flex items-center justify-center self-end mt-6 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300">
                    <ArrowIcon className="w-3.5 h-3.5 text-brand-orange group-hover:text-white transition-colors" />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ آخر الأخبار (بطاقات مع ظلال) ═══════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <ScrollReveal className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-4">
            <div>
              <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-2 block">
                {t("news.title_badge_small")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-ink">
                {t("news.subtitle")}
              </h2>
            </div>
            <Link
              to="/all-news"
              className="px-6 py-3 rounded-full border-2 border-brand-orange text-brand-orange font-bold text-sm hover:bg-brand-orange hover:text-white transition-all duration-300 flex items-center gap-2 group"
            >
              {t("home.explore_features")}{" "}
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>

          {isLoadingNews ? (
            <div className="grid md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-3xl overflow-hidden h-[450px] animate-pulse"
                ></div>
              ))}
            </div>
          ) : newsError ? (
            <div className="bg-red-50 text-red-600 p-10 rounded-3xl border border-red-100 text-center max-w-lg mx-auto">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <p className="font-bold text-lg">
                {currentLang === "ar" ? "حدث خطأ" : "Error"}
              </p>
              <p className="text-sm opacity-80">{newsError}</p>
            </div>
          ) : (
            /* ✅ تخطيط غير متماثل (بطاقة كبرى بصورة على اليسار + 3 بطاقات نصية
                مكدّسة على اليمين) — مطابق لتصميم فيجما، بدل بطاقة علوية كبيرة
                + صف ثلاثي أسفلها. */
            <div className="grid lg:grid-cols-2 gap-6">
              {newsData[0] && (
                <ScrollReveal delay={200}>
                  <Link
                    to={`/news/${newsData[0].slug}`}
                    className="group relative block h-full min-h-[420px] lg:min-h-[560px] rounded-3xl overflow-hidden shadow-xl"
                  >
                    <img
                      src={newsData[0].image_url}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/40 to-transparent"></div>
                    <div className="absolute bottom-0 start-0 p-8 md:p-10 w-full">
                      <div className="inline-block bg-brand-orange px-3 py-1 rounded-full text-white text-xs font-bold mb-4">
                        {formatDate(newsData[0].created_at)}
                      </div>
                      <h3 className="text-white text-2xl md:text-3xl font-bold mb-6 leading-tight group-hover:translate-x-2 transition-transform duration-500">
                        {currentLang === "ar"
                          ? newsData[0].title_ar
                          : newsData[0].title_en}
                      </h3>
                      <span className="text-white font-bold text-lg flex items-center gap-3 group-hover:gap-5 transition-all">
                        {t("news.read_more")} <ArrowIcon className="w-6 h-6" />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              )}

              <div className="flex flex-col gap-5">
                {newsData.slice(1, 4).map((item) => (
                  <ScrollReveal key={item.id} className="flex-1">
                    <Link to={`/news/${item.slug}`} className="group block h-full">
                      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 h-full flex flex-col justify-center gap-3 transition-all duration-500 hover:border-brand-orange/40 hover:shadow-lg">
                        <h3 className="font-bold text-brand-ink text-base md:text-lg group-hover:text-brand-orange transition-colors leading-snug">
                          {currentLang === "ar" ? item.title_ar : item.title_en}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-brand-muted text-sm">
                            {formatDate(item.created_at)}
                          </span>
                          <span className="text-brand-orange font-bold text-sm flex items-center gap-2 border-b border-brand-orange pb-0.5 group-hover:gap-3 transition-all">
                            {t("news.read_more")}
                            <ArrowIcon className="w-4 h-4" />
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

      {/* ✅ قسم تواصل معنا — خلفية برتقالية كاملة للقسم + بطاقة نموذج بيضاء عائمة،
          مطابق لتصميم فيجما، بدل تقسيم لوحتين (داكنة/بيضاء) متساويتي الارتفاع. */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-brand-orange">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">

          {/* القسم الأيسر: المعلومات */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {t("help.cta_title")}
            </h2>
            <p className="text-white/85 mb-10 text-lg leading-relaxed">
              {t("help.cta_subtitle")}
            </p>
            <div className="h-px w-full bg-white/25 mb-10"></div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span dir="ltr" className="text-base font-medium">
                  {siteInfo?.phone || "..."}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-base font-medium">
                  {siteInfo?.email || "..."}
                </span>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-base font-medium leading-relaxed">
                  {currentLang === "ar"
                    ? siteInfo?.address_ar || "..."
                    : siteInfo?.address_en || "..."}
                </span>
              </div>
            </div>
          </div>

          {/* القسم الأيمن: النموذج (بطاقة بيضاء عائمة) */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl">
            <form onSubmit={handleSubmit} noValidate>
              {apiError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 font-medium border border-red-100">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {apiError}
                </div>
              )}
              {isFormSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-3 font-medium border border-emerald-100">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  {currentLang === "ar"
                    ? "تم الإرسال بنجاح!"
                    : "Sent Successfully!"}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-sm font-bold text-brand-ink mb-2 block">
                    {t("help.form_full_name")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t("help.form_full_name")}
                    className={getInputClass("name")}
                  />
                  <ErrorMessage message={touched.name ? errors.name : ""} />
                </div>
                <div>
                  <label className="text-sm font-bold text-brand-ink mb-2 block">
                    {t("help.form_email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    dir="ltr"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t("help.form_email")}
                    className={getInputClass("email")}
                  />
                  <ErrorMessage message={touched.email ? errors.email : ""} />
                </div>
              </div>

              <div className="mb-5">
                <label className="text-sm font-bold text-brand-ink mb-2 block">
                  {t("help.form_subject")}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("help.form_subject")}
                  className={getInputClass("subject")}
                />
                <ErrorMessage message={touched.subject ? errors.subject : ""} />
              </div>

              <div className="mb-8">
                <label className="text-sm font-bold text-brand-ink mb-2 block">
                  {t("help.form_message")}
                </label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("help.form_message")}
                  className={getInputClass("message")}
                ></textarea>
                <ErrorMessage message={touched.message ? errors.message : ""} />
              </div>

              <button
                type="submit"
                disabled={isFormLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
              >
                {isFormLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t("help.form_submit")
                )}
                {!isFormLoading && <ArrowIcon className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
