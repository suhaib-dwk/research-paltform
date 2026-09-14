import { useState, useEffect, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, ArrowRight, Users, Building2, FileText, FlaskConical,
  BookOpen, TrendingUp, HandCoins, Scale, Shield,
  GraduationCap, Award, Globe, Lightbulb, Microscope,
  Database, Settings, HelpCircle, ChevronRight, Star,
  Upload, Search, Loader2, CheckCircle, AlertCircle,
  Phone, Mail, MapPin
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

  const infoTiles = [
    {
      key: "research_system",
      title: t("home.tile1_title"),
      desc: t("home.tile1_desc"),
    },
    {
      key: "classification",
      title: t("home.tile2_title"),
      desc: t("home.tile2_desc"),
    },
    {
      key: "transparency",
      title: t("home.tile3_title"),
      desc: t("home.tile3_desc"),
    },
    {
      key: "integration",
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

  const platformServices = [
    {
      icon: Upload,
      title: t("services.submit_research"),
      desc: t("services.submit_research_desc"),
      highlight: true,
    },
    {
      icon: TrendingUp,
      title: t("services.track_status"),
      desc: t("services.track_status_desc"),
    },
    {
      icon: HandCoins,
      title: t("services.funding"),
      desc: t("services.funding_desc"),
    },
    {
      icon: Search,
      title: t("services.collaboration"),
      desc: t("services.collaboration_desc"),
    },
  ];

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
      <section className="relative z-30 h-[85vh] md:h-[90vh] w-full overflow-hidden bg-brand-ink group">
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

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
          <ScrollReveal className="flex flex-col items-center w-full">
            {/* ⏸️ إخفاء البادج الصغير ("المنصة الوطنية للبحث الأكاديمي") فوق العنوان بطلب صريح */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight drop-shadow-2xl max-w-5xl mx-auto tracking-tight">
              {t("home.hero_title_line1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-400 drop-shadow-lg">
                {t("home.hero_title_line2")}
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-md font-light backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-white/10 text-center">
              {heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/register"
                className="group relative px-10 py-4 rounded-full font-bold text-white bg-brand-orange overflow-hidden shadow-[0_0_30px_rgba(241,90,40,0.4)] hover:shadow-[0_0_50px_rgba(241,90,40,0.6)] transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-3 z-10">
                  {t("hero.btn_register")} <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/login"
                className="px-10 py-4 rounded-full font-bold text-white bg-white/5 backdrop-blur-lg border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105"
              >
                {t("hero.btn_login")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ شريط الإحصائيات (شريط غامق متصل بخطوط فاصلة رأسية، ملتصق مباشرة
           تحت البانر مع خط علوي بلون البراند يفصلهما — بديل تصميم "البطاقات
           الطافية" السابق، بطلب صريح لمطابقة نمط مرجعي محدد) ═══════ */}
      <section className="relative z-20 bg-brand-ink border-t-2 border-brand-orange py-10 md:py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 rtl:divide-x-reverse">
            {statsData.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="text-center px-4">
                  <p className="text-3xl md:text-4xl font-black text-white mb-1.5">
                    {stat.count}
                  </p>
                  <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-brand-orange">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ نبذة عن المنصة (تصميم مسطّح موحّد: عنوان أعلى بعرض كامل + 4 بطاقات
           متساوية بصف واحد بنفس الستايل، بدل التقسيم عمودين/بطاقات متفاوتة الألوان) ═══════ */}
      <section className="py-24 md:py-32 bg-brand-cream-hero relative">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <span className="text-brand-orange text-sm font-bold tracking-[0.3em] uppercase mb-6 block flex items-center gap-2">
              <span className="w-8 h-[2px] bg-brand-orange rounded-full"></span>
              {t("home.about_label")}
            </span>
            {/* ✅ mb-4 بدل mb-8 — لا يوجد نص وصفي بين العنوان والبطاقات (حُذف بتصميم
                سابق)، فمسافة أكبر كانت تترك فراغًا غير منطقي هنا لا يخدم أي محتوى. */}
            <h2 className="text-4xl md:text-5xl font-black text-brand-ink leading-tight mb-4 max-w-3xl">
              {t("home.about_title")}
            </h2>
          </ScrollReveal>

          {/* ✅ بطاقات أكبر (padding أعلى + ارتفاع أدنى موحّد) لتطابق الحجم "الممتلئ"
              بالتصميم المرجعي، بدل بطاقات مضغوطة الارتفاع بفراغ سفلي غير متسق. */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {infoTiles.map((tile, index) => (
              <ScrollReveal key={tile.key} delay={index * 100 + 100}>
                <div className="h-full min-h-[168px] p-8 rounded-[1.75rem] bg-white text-brand-ink border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-default flex flex-col">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-brand-orange">
                    {tile.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-medium text-gray-600">
                    {tile.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* ✅ text-right صريحة (لا text-end المنطقية) — الصورة المرجعية وضعت الرابط
              يمين الصفحة بصريًا؛ text-end كانت تضعه يسارًا لأن "end" بالعربي (RTL)
              هو اليسار منطقيًا، فتُخالف المرجع رغم صحتها التقنية. */}
          <ScrollReveal className="text-right">
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
      <section className="bg-brand-ink py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal className="text-center mb-20">
            <span className="text-brand-orange text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
              {t("home.how_label")}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight max-w-3xl mx-auto">
              {t("home.how_title")}
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* خط ربط متقطع بين الخطوات */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent border-t-2 border-dashed border-white/30 -z-10"></div>

            {howItWorks.map((step, index) => (
              <ScrollReveal key={index} delay={index * 150}>
                <div className="relative text-center group">
                  <div className="w-24 h-24 mx-auto bg-brand-ink border-2 border-white/10 rounded-full flex items-center justify-center mb-6 relative z-10 transition-all duration-500 group-hover:border-brand-orange group-hover:scale-110 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <span className="text-3xl font-black text-brand-orange/80">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3 group-hover:text-brand-orange transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed px-4">
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ خدمات المنصة (تصميم Bento Grid) ═══════ */}
      <section className="py-24 bg-brand-cream-hero relative">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal className="mb-16 text-center max-w-2xl mx-auto">
            <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-4 inline-block bg-white px-3 py-1 rounded-full shadow-sm">
              {t("services.title_badge_small")}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-ink">
              {t("services.subtitle")}
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {platformServices.map((service, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div
                  className={`p-10 rounded-[2.5rem] flex items-start gap-6 transition-all duration-500 hover:-translate-y-2 cursor-pointer border-2 group relative overflow-hidden ${
                    service.highlight
                      ? "bg-white border-brand-orange shadow-[0_20px_40px_-15px_rgba(241,90,40,0.15)]"
                      : "bg-white border-transparent hover:border-brand-orange/20 hover:shadow-xl"
                  }`}
                >
                  {/* أيقونة متوهجة للخدمة المميزة */}
                  {service.highlight && (
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  )}

                  <div
                    className={`p-5 rounded-2xl transition-all duration-300 group-hover:rotate-6 flex-shrink-0 ${
                      service.highlight
                        ? "bg-brand-orange text-white shadow-lg"
                        : "bg-brand-ink/5 text-brand-ink"
                    }`}
                  >
                    <service.icon
                      className={`w-8 h-8 ${service.highlight ? "text-white" : "text-brand-ink"}`}
                    />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-black text-brand-ink text-xl mb-3 group-hover:text-brand-orange transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-base text-brand-muted leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ آخر الأخبار (بطاقات مع ظلال) ═══════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <ScrollReveal className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-4">
            <div>
              <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-2 block">
                {t("news.title_badge_small")}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-brand-ink">
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
            <>
              {newsData[0] && (
                <ScrollReveal delay={200}>
                  <Link
                    to={`/news/${newsData[0].slug}`}
                    className="group relative block h-[600px] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl"
                  >
                    <img
                      src={newsData[0].image_url}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/40 to-transparent"></div>
                    <div className="absolute bottom-0 start-0 p-10 w-full">
                      <div className="inline-block bg-brand-orange px-3 py-1 rounded text-white text-xs font-bold mb-4">
                        {formatDate(newsData[0].created_at)}
                      </div>
                      <h3 className="text-white text-3xl md:text-4xl font-black mb-6 leading-tight group-hover:translate-x-2 transition-transform duration-500">
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
              <div className="grid md:grid-cols-3 gap-8">
                {newsData.slice(1, 4).map((item) => (
                  <ScrollReveal key={item.id}>
                    <Link to={`/news/${item.slug}`} className="group block">
                      <div className="bg-brand-cream-hero rounded-3xl p-8 h-full transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl border border-transparent hover:border-brand-orange/10">
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-brand-orange text-xs font-bold bg-orange-50 px-2 py-1 rounded">
                              {formatDate(item.created_at)}
                           </span>
                        </div>
                        <h3 className="font-black text-brand-ink text-xl mb-4 group-hover:text-brand-orange transition-colors leading-snug min-h-[3.5rem]">
                          {currentLang === "ar" ? item.title_ar : item.title_en}
                        </h3>
                        <div className="w-12 h-1 bg-brand-orange/20 rounded-full mb-6 group-hover:w-full group-hover:bg-brand-orange transition-all duration-500"></div>
                        <span className="text-brand-ink font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                          {t("news.read_more")}{" "}
                          <ArrowIcon className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ✅ قسم تواصل معنا (تصميم مشترك) ═══════ */}
      <section className="py-24 px-4 md:px-8 bg-brand-cream-hero">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-0 rounded-[3rem] overflow-hidden shadow-2xl bg-white">
          
          {/* القسم الأيسر: المعلومات */}
          <div className="bg-brand-ink p-10 md:p-16 relative overflow-hidden text-white">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 leading-tight">
                {t("help.cta_title")}
              </h2>
              <p className="text-white/70 mb-12 text-lg leading-relaxed">
                {t("help.cta_subtitle")}
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-lg">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-white/40 uppercase tracking-wider mb-1">Phone</span>
                    <span dir="ltr" className="text-xl font-medium">
                      {siteInfo?.phone || "..."}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-lg">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-white/40 uppercase tracking-wider mb-1">Email</span>
                    <span className="text-xl font-medium">
                      {siteInfo?.email || "..."}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-lg flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-white/40 uppercase tracking-wider mb-1">Address</span>
                    <span className="text-lg font-medium leading-relaxed">
                      {currentLang === "ar"
                        ? siteInfo?.address_ar || "..."
                        : siteInfo?.address_en || "..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* القسم الأيمن: النموذج */}
          <div className="bg-white p-10 md:p-16">
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
