import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, ArrowRight, Users, Building2, FileText, FlaskConical,
  BookOpen, TrendingUp, HandCoins, Scale, Shield,
  GraduationCap, Award, Globe, Lightbulb, Microscope,
  Database, Settings, HelpCircle, ChevronRight, Star,
  Upload, Search, Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api';
import { SiteContext } from '../SiteContext';
import { getValidationMessages, validateField as validateFieldValue } from '../utils/formValidation';
import ErrorMessage from '../components/shared/ErrorMessage';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const currentLang = i18n.language;

  const { siteSettings, homeSlides, siteInfo } = useContext(SiteContext);

  const [servicesData, setServicesData] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);

  const heroBadge = siteSettings[`hero_badge_${currentLang}`] || t('hero.badge');
  const heroTitle = siteSettings[`hero_title_${currentLang}`] || t('hero.title');
  const heroDesc = siteSettings[`hero_desc_${currentLang}`] || t('hero.desc');

  const defaultSlides = [
    { id: 1, image_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2072&auto=format&fit=crop" },
    { id: 2, image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop" },
    { id: 3, image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2070&auto=format&fit=crop" },
  ];
  const bannerSlides = homeSlides.length > 0 ? homeSlides : defaultSlides;

  const getIconComponent = (iconName) => {
    const iconsMap = {
      'BookOpen': BookOpen, 'TrendingUp': TrendingUp, 'HandCoins': HandCoins,
      'FlaskConical': FlaskConical, 'FileText': FileText, 'Users': Users,
      'Building2': Building2, 'Scale': Scale, 'Shield': Shield,
      'GraduationCap': GraduationCap, 'Award': Award, 'Globe': Globe,
      'Lightbulb': Lightbulb, 'Microscope': Microscope, 'Database': Database,
      'Settings': Settings, 'HelpCircle': HelpCircle, 'ChevronRight': ChevronRight,
      'Star': Star, 'book-open': BookOpen, 'trending-up': TrendingUp,
      'hand-coins': HandCoins, 'flask-conical': FlaskConical, 'file-text': FileText,
      'graduation-cap': GraduationCap,
    };
    return iconsMap[iconName] || BookOpen;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, newsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/get_services.php`),
          fetch(`${API_BASE_URL}/get_news.php`)
        ]);

        const servicesResult = await servicesRes.json();
        if (servicesResult.status === 'success') {
          setServicesData(servicesResult.data);
        }

        const newsResult = await newsRes.json();
        if (newsResult.status === 'success') {
          setNewsData(newsResult.data);
        } else {
          setNewsError(newsResult.message);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setNewsError(currentLang === 'ar' ? "فشل الاتصال بخادم البيانات" : "Failed to connect to data server");
      } finally {
        setIsLoadingServices(false);
        setIsLoadingNews(false);
      }
    };

    fetchData();
  }, [currentLang]);

  const statsData = [
    { count: "12,500+", label: t('stats.researchers') },
    { count: "85+", label: t('stats.universities') },
    { count: "45,000+", label: t('stats.publications') },
    { count: "3,200+", label: t('stats.projects') },
  ];

  const infoTiles = [
    { key: 'research_system', title: t('home.tile1_title'), desc: t('home.tile1_desc'), dark: true },
    { key: 'classification', title: t('home.tile2_title'), desc: t('home.tile2_desc'), orange: true },
    { key: 'transparency', title: t('home.tile3_title'), desc: t('home.tile3_desc') },
    { key: 'integration', title: t('home.tile4_title'), desc: t('home.tile4_desc') },
  ];

  const howItWorks = [
    { number: '01', title: t('home.step1_title'), desc: t('home.step1_desc') },
    { number: '02', title: t('home.step2_title'), desc: t('home.step2_desc') },
    { number: '03', title: t('home.step3_title'), desc: t('home.step3_desc') },
    { number: '04', title: t('home.step4_title'), desc: t('home.step4_desc') },
  ];

  const platformServices = [
    { icon: Upload, title: t('services.submit_research'), desc: t('services.submit_research_desc'), highlight: true },
    { icon: TrendingUp, title: t('services.track_status'), desc: t('services.track_status_desc') },
    { icon: HandCoins, title: t('services.funding'), desc: t('services.funding_desc') },
    { icon: Search, title: t('services.collaboration'), desc: t('services.collaboration_desc') },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // ✅ نموذج التواصل (مطابق لصفحة Help Center)
  const validationMessages = getValidationMessages(currentLang);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isFormSuccess, setIsFormSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const validateField = (name, value) => validateFieldValue(name, value, validationMessages);

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) { newErrors[key] = err; isValid = false; }
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.status === 'success') {
        setIsFormSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setTouched({});
        setTimeout(() => setIsFormSuccess(false), 4000);
      } else {
        setApiError(result.message);
      }
    } catch (err) {
      setApiError(currentLang === 'ar' ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
    } finally {
      setIsFormLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const base = 'w-full px-4 py-3 rounded-xl border outline-none transition-all placeholder:text-gray-300';
    const hasError = touched[fieldName] && errors[fieldName];
    if (hasError) {
      return `${base} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30`;
    }
    return `${base} border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20`;
  };

  return (
    <>
      <style>{`
        @keyframes scrollLtr { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        @keyframes scrollRtl { 0% { transform: translateX(-33.333%); } 100% { transform: translateX(0); } }
        .banner-track-ltr { animation: scrollLtr 20s linear infinite; }
        .banner-track-rtl { animation: scrollRtl 20s linear infinite; }
        .banner-track-ltr:hover, .banner-track-rtl:hover { animation-play-state: paused; }
      `}</style>

      {/* ═══════ البانر الديناميكي ═══════ */}
      <section className="relative h-[80vh] md:h-[85vh] w-full overflow-hidden bg-brand-ink">
        <div className={`flex h-full w-[300%] ${isRTL ? 'banner-track-rtl' : 'banner-track-ltr'}`}>
          {[...bannerSlides, ...bannerSlides, ...bannerSlides].map((slide, index) => (
            <div key={index} className="relative w-1/3 h-full flex-shrink-0">
              <img
                src={slide.image_url}
                alt="Research"
                className="w-full h-full object-cover"
                loading={index < 3 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/50 to-transparent"></div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg max-w-4xl">
            {t('home.hero_title_line1')}{' '}
            <span className="text-brand-orange">{t('home.hero_title_line2')}</span>
          </h1>
          <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl drop-shadow-md">
            {heroDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group flex items-center gap-3 bg-brand-orange text-white px-8 py-3.5 rounded-full font-bold hover:bg-brand-orange-dark transition-all duration-300"
            >
              {t('hero.btn_register')} <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-full font-bold text-white bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              {t('hero.btn_login')}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ شريط الإحصائيات ═══════ */}
      <section className="bg-brand-ink py-10 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {statsData.map((stat, index) => (
              <div key={index}>
                <p className="text-3xl md:text-4xl font-black text-white mb-1">{stat.count}</p>
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-wide text-brand-orange">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ نبذة عن المنصة ═══════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                {t('home.about_label')}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-brand-ink leading-tight mb-4">
                {t('home.about_title')}
              </h2>
              <div className="w-16 h-1 bg-brand-ink mb-6" />
              <p className="text-brand-muted leading-relaxed mb-6">
                {t('home.about_desc')}
              </p>
              <Link
                to="/about-us"
                className="text-brand-orange font-bold text-sm hover:underline"
              >
                {t('home.explore_features')} →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {infoTiles.map((tile, index) => (
                <div
                  key={tile.key}
                  className={`p-6 rounded-2xl ${
                    tile.dark ? 'bg-brand-ink text-white' :
                    tile.orange ? 'bg-brand-orange text-white' :
                    'bg-brand-cream-hero text-brand-ink'
                  }`}
                >
                  <h3 className={`text-xs font-bold uppercase tracking-wide mb-2 ${tile.dark || tile.orange ? 'text-white/70' : 'text-brand-orange'}`}>
                    {tile.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${tile.dark || tile.orange ? 'text-white/90' : 'text-brand-muted'}`}>
                    {tile.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ كيف تعمل المنصة ═══════ */}
      <section className="bg-brand-ink py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-start mb-12">
            <div>
              <span className="text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                {t('home.how_label')}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {t('home.how_title')}
              </h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              {t('home.how_desc')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/10 pt-10">
            {howItWorks.map((step, index) => (
              <div key={index}>
                <span className="text-3xl font-black text-brand-orange/50 block mb-3">{step.number}</span>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ خدمات المنصة ═══════ */}
      <section className="py-16 md:py-20 bg-brand-cream-hero">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <span className="text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
              {t('services.title_badge_small')}
            </span>
            <p className="text-brand-muted max-w-xl">{t('services.subtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {platformServices.map((service, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl flex items-start gap-4 ${
                  service.highlight ? 'bg-brand-orange/10 border border-brand-orange/20' : 'bg-white'
                }`}
              >
                <service.icon className={`w-6 h-6 flex-shrink-0 ${service.highlight ? 'text-brand-orange' : 'text-brand-ink'}`} />
                <div>
                  <h3 className="font-bold text-brand-ink mb-1">{service.title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ آخر الأخبار ═══════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                {t('news.title_badge_small')}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-brand-ink">{t('news.subtitle')}</h2>
            </div>
            <Link to="/all-news" className="text-brand-orange font-bold text-sm hover:underline">
              {t('home.explore_features')}
            </Link>
          </div>

          {isLoadingNews ? (
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-brand-cream-hero rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-brand-cream"></div>
                  <div className="p-5">
                    <div className="h-4 bg-brand-cream rounded w-1/3 mb-3"></div>
                    <div className="h-5 bg-brand-cream rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : newsError ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
              <p className="font-bold">{currentLang === 'ar' ? 'حدث خطأ أثناء تحميل الأخبار' : 'Error loading news'}</p>
            </div>
          ) : (
            <>
              {newsData[0] && (
                <Link
                  to={`/news/${newsData[0].slug}`}
                  className="group relative block h-72 rounded-2xl overflow-hidden mb-6"
                >
                  <img src={newsData[0].image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/30 to-transparent" />
                  <div className="absolute bottom-0 start-0 p-8">
                    <h3 className="text-white text-2xl font-black mb-3 max-w-lg">
                      {currentLang === 'ar' ? newsData[0].title_ar : newsData[0].title_en}
                    </h3>
                    <p className="text-white/70 text-sm mb-2">{formatDate(newsData[0].created_at)}</p>
                    <span className="text-brand-orange font-bold text-sm">{t('news.read_more')} →</span>
                  </div>
                </Link>
              )}
              <div className="grid md:grid-cols-3 gap-6">
                {newsData.slice(1, 4).map((item) => (
                  <Link to={`/news/${item.slug}`} key={item.id} className="group bg-brand-cream-hero rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <h3 className="font-bold text-brand-ink mb-2 group-hover:text-brand-orange transition-colors leading-relaxed">
                        {currentLang === 'ar' ? item.title_ar : item.title_en}
                      </h3>
                      <p className="text-sm text-brand-muted mb-3">{formatDate(item.created_at)}</p>
                      <span className="text-brand-orange font-bold text-sm flex items-center gap-1">
                        {t('news.read_more')} <ArrowIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ✅ قسم تواصل معنا */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto bg-brand-orange rounded-2xl p-8 md:p-14 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-white font-black text-3xl mb-3">{t('help.cta_title')}</h2>
            <p className="text-white/80 mb-6">{t('help.cta_subtitle')}</p>
            <div className="w-12 h-0.5 bg-white/40 mb-6" />

            <div className="space-y-4">
              <span dir="ltr" className="text-white/90 text-sm block">{siteInfo?.phone || '...'}</span>
              <span className="text-white/90 text-sm block">{siteInfo?.email || '...'}</span>
              <span className="text-white/90 text-sm block">
                {currentLang === 'ar' ? (siteInfo?.address_ar || '...') : (siteInfo?.address_en || '...')}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl p-6 md:p-8">
            {apiError && (
              <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {apiError}
              </div>
            )}
            {isFormSuccess && (
              <div className="mb-5 p-3 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2 text-sm font-medium border border-emerald-100">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message sent successfully!'}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-bold text-brand-ink mb-1.5 block">{t('help.form_full_name')}</label>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder={t('help.form_full_name')} className={getInputClass('name')}
                />
                <ErrorMessage message={touched.name ? errors.name : ''} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink mb-1.5 block">{t('help.form_email')}</label>
                <input
                  type="email" name="email" dir="ltr" value={formData.email}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder={t('help.form_email')} className={getInputClass('email')}
                />
                <ErrorMessage message={touched.email ? errors.email : ''} />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-bold text-brand-ink mb-1.5 block">{t('help.form_subject')}</label>
              <input
                type="text" name="subject" value={formData.subject}
                onChange={handleChange} onBlur={handleBlur}
                placeholder={t('help.form_subject')} className={getInputClass('subject')}
              />
              <ErrorMessage message={touched.subject ? errors.subject : ''} />
            </div>

            <div className="mb-6">
              <label className="text-sm font-bold text-brand-ink mb-1.5 block">{t('help.form_message')}</label>
              <textarea
                name="message" rows="4" value={formData.message}
                onChange={handleChange} onBlur={handleBlur}
                placeholder={t('help.form_message')} className={getInputClass('message')}
              ></textarea>
              <ErrorMessage message={touched.message ? errors.message : ''} />
            </div>

            <button
              type="submit" disabled={isFormLoading}
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-full font-bold hover:bg-brand-orange-dark transition-all duration-300 disabled:opacity-70"
            >
              {isFormLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('help.form_submit')}
              {!isFormLoading && <ArrowIcon className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default HomePage;
