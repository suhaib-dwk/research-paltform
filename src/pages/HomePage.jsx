import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, ArrowRight, Users, Building2, FileText, FlaskConical, 
  BookOpen, TrendingUp, HandCoins, Scale, Shield,
  GraduationCap, Award, Globe, Lightbulb, Microscope,
  Database, Settings, HelpCircle, ChevronRight, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { API_BASE_URL } from '../api';
import { SiteContext } from '../SiteContext';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const currentLang = i18n.language;

  const { siteSettings, homeSlides } = useContext(SiteContext);

  const [servicesData, setServicesData] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);

  const heroBadge = siteSettings[`hero_badge_${currentLang}`] || 'Ministry of Higher Education';
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

  const getGradientClass = (colorClass) => {
    const validGradients = [
      'from-blue-500 to-blue-600', 'from-green-500 to-green-600',
      'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600',
      'from-red-500 to-red-600', 'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600', 'from-teal-500 to-teal-600',
      'from-cyan-500 to-cyan-600',
    ];
    if (colorClass && validGradients.some(g => colorClass.includes(g.split(' ')[0].replace('from-', '')))) {
      return `bg-gradient-to-br ${colorClass}`;
    }
    return 'bg-gradient-to-br from-[#c8a44e] to-[#a8872e]';
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
    { icon: Users, count: "12,500+", label: t('stats.researchers'), border: "border-t-[#c8a44e]" },
    { icon: Building2, count: "85+", label: t('stats.universities'), border: "border-t-emerald-500" },
    { icon: FileText, count: "45,000+", label: t('stats.publications'), border: "border-t-[#0a1628]" },
    { icon: FlaskConical, count: "3,200+", label: t('stats.projects'), border: "border-t-[#e6c96e]" },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const translateCategory = (cat) => {
    const categories = {
      'updates': currentLang === 'ar' ? 'تحديثات' : 'Updates',
      'grants': currentLang === 'ar' ? 'منح' : 'Grants',
      'events': currentLang === 'ar' ? 'فعاليات' : 'Events',
      'announcements': currentLang === 'ar' ? 'إعلانات' : 'Announcements'
    };
    return categories[cat] || cat;
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
      <section className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-[#0a1628]">
        <div className={`flex h-full w-[300%] ${isRTL ? 'banner-track-rtl' : 'banner-track-ltr'}`}>
          {[...bannerSlides, ...bannerSlides, ...bannerSlides].map((slide, index) => (
            <div key={index} className="relative w-1/3 h-full flex-shrink-0">
              <img 
                src={slide.image_url} 
                alt="Research" 
                className="w-full h-full object-cover"
                loading={index < 3 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/50 to-transparent"></div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
          <span className="inline-block px-5 py-2 mb-6 text-sm font-bold tracking-widest text-[#e6c96e] uppercase bg-[#c8a44e]/10 backdrop-blur-md rounded-full border border-[#c8a44e]/30">
            {heroBadge}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg max-w-5xl">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl drop-shadow-md">
            {heroDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="group flex items-center gap-3 bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-[#c8a44e]/30 transition-all duration-300 hover:scale-105"
            >
              {t('hero.btn_register')} <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-4 rounded-2xl font-bold text-lg text-white bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 hover:border-[#c8a44e]/40 transition-all duration-300"
            >
              {t('hero.btn_login')}
            </Link>
          </div>
        </div>
        {/* تدرج سفلي للدمج مع القسم التالي */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f4f6fb] to-transparent z-10"></div>
      </section>

      {/* ═══════ الخدمات ═══════ */}
      <section className="py-20 bg-[#f4f6fb] relative overflow-hidden">
        <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-[#c8a44e]/[0.04] rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 end-0 w-[400px] h-[400px] bg-[#0a1628]/[0.03] rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-wider text-[#c8a44e] uppercase bg-[#c8a44e]/10 rounded-full mb-4">
              {t('services.title_badge') || t('services.title')}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0a1628] mb-4">{t('services.title')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t('services.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoadingServices ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm shadow-black/[0.03] border border-gray-100 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-2xl mb-5"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                </div>
              ))
            ) : (
              servicesData.map((service) => {
                const DynamicIcon = getIconComponent(service.icon_name);
                const gradientClass = getGradientClass(service.color_class);
                return (
                  <Link 
                    to={`/service/${service.slug}`} 
                    key={service.id} 
                    className="group bg-white p-8 rounded-3xl shadow-sm shadow-black/[0.03] border border-gray-100 hover:shadow-xl hover:shadow-[#c8a44e]/10 hover:-translate-y-2 transition-all duration-300 flex flex-col"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${gradientClass} flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <DynamicIcon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0a1628] mb-2">
                      {currentLang === 'ar' ? service.title_ar : service.title_en}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                      {currentLang === 'ar' ? service.desc_ar : service.desc_en}
                    </p>
                    <div className="mt-5 text-[#c8a44e] font-bold text-sm flex items-center gap-1 group-hover:gap-2.5 transition-all">
                      {t('services.explore')} <ArrowIcon className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ═══════ الإحصائيات ═══════ */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 start-0 w-96 h-96 bg-[#c8a44e]/[0.04] rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 end-0 w-80 h-80 bg-[#0a1628]/[0.03] rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-wider text-[#c8a44e] uppercase bg-[#c8a44e]/10 rounded-full mb-4">
              {t('stats.title_badge') || t('stats.title')}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0a1628]">{t('stats.title')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className={`relative bg-[#f4f6fb]/60 backdrop-blur-sm p-8 rounded-3xl shadow-sm shadow-black/[0.02] border border-gray-100 text-center hover:shadow-lg hover:shadow-[#c8a44e]/10 transition-shadow duration-300 border-t-4 ${stat.border}`}>
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-[#c8a44e]/60" />
                <h3 className="text-4xl font-black text-[#0a1628] mb-2">{stat.count}</h3>
                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ الأخبار ═══════ */}
      <section className="py-20 bg-[#f4f6fb] relative overflow-hidden">
        <div className="absolute top-1/2 start-0 w-[400px] h-[400px] bg-[#c8a44e]/[0.03] rounded-full -translate-y-1/2 -translate-x-1/2 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14 gap-4">
            <div>
              <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-wider text-[#c8a44e] uppercase bg-[#c8a44e]/10 rounded-full mb-4">
                {t('news.title_badge') || t('news.title')}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0a1628] mb-2">{t('news.title')}</h2>
              <p className="text-gray-400">{t('news.subtitle')}</p>
            </div>
            <Link to="/all-news" className="flex items-center gap-2 text-[#c8a44e] font-bold hover:text-[#a8872e] hover:gap-3 transition-all">
              {t('news.view_all')} <ArrowIcon className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingNews ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm shadow-black/[0.03] border border-gray-100 animate-pulse">
                  <div className="h-52 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                </div>
              ))
            ) : newsError ? (
              <div className="md:col-span-3 bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
                <p className="font-bold mb-1">{currentLang === 'ar' ? 'حدث خطأ أثناء تحميل الأخبار' : 'Error loading news'}</p>
                <p className="text-sm">{newsError}</p>
              </div>
            ) : (
              newsData.map((item) => (
                <Link to={`/news/${item.slug}`} key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm shadow-black/[0.03] border border-gray-100 hover:shadow-xl hover:shadow-[#c8a44e]/10 transition-all duration-300 flex flex-col">
                  <div className="h-52 overflow-hidden relative">
                    <img src={item.image_url} alt={item.title_ar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-bold text-[#c8a44e] px-3 py-1.5 rounded-full border border-[#c8a44e]/20">
                      {translateCategory(item.category)}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-gray-400 mb-3 font-medium">{formatDate(item.created_at)}</p>
                    <h3 className="text-lg font-bold text-[#0a1628] group-hover:text-[#c8a44e] transition-colors leading-relaxed flex-grow">
                      {currentLang === 'ar' ? item.title_ar : item.title_en}
                    </h3>
                    <div className="mt-4 text-[#c8a44e] font-bold text-sm flex items-center gap-1 group-hover:gap-2.5 transition-all">
                      {t('news.read_more')} <ArrowIcon className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════ الشروط والأحكام ═══════ */}
      <section className="py-16 bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="absolute bottom-0 end-0 w-[350px] h-[350px] bg-[#c8a44e]/[0.03] rounded-full translate-x-1/2 translate-y-1/2 blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-wider text-[#c8a44e] uppercase bg-[#c8a44e]/10 rounded-full mb-4">
              {t('policies.title_badge') || t('policies.title')}
            </span>
            <h2 className="text-3xl font-black text-[#0a1628]">{t('policies.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/page/terms" className="group flex items-start gap-5 p-8 bg-[#f4f6fb] rounded-2xl border border-gray-100 hover:border-[#c8a44e]/30 hover:shadow-lg hover:shadow-[#c8a44e]/10 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-[#c8a44e]/10 text-[#c8a44e] flex items-center justify-center flex-shrink-0 group-hover:bg-[#c8a44e] group-hover:text-white transition-colors duration-300">
                <Scale className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0a1628] mb-2 group-hover:text-[#c8a44e] transition-colors">{t('policies.terms_title')}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t('policies.terms_desc')}</p>
              </div>
            </Link>
            <Link to="/page/policy" className="group flex items-start gap-5 p-8 bg-[#f4f6fb] rounded-2xl border border-gray-100 hover:border-[#0a1628]/20 hover:shadow-lg hover:shadow-[#0a1628]/10 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-[#0a1628]/10 text-[#0a1628] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0a1628] group-hover:text-white transition-colors duration-300">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0a1628] mb-2 group-hover:text-[#0a1628] transition-colors">{t('policies.policy_title')}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t('policies.policy_desc')}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
};

export default HomePage;