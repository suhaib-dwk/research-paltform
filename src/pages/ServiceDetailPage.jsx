import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, BookOpen, TrendingUp, HandCoins, FlaskConical, Loader2 } from 'lucide-react';
import Footer from '../components/layout/Footer';
import { API_BASE_URL } from '../api';

const ServiceDetailPage = () => {
  const { slug } = useParams(); // استقبال slug من الرابط
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const currentLang = i18n.language;

  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // خريطة الأيقونات
  const iconMap = {
    BookOpen: BookOpen,
    TrendingUp: TrendingUp,
    HandCoins: HandCoins,
    FlaskConical: FlaskConical
  };

  // جلب بيانات الخدمة المحددة
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get_service_details.php?slug=${slug}`);
        const result = await response.json();
        
        if (result.status === 'success') {
          setService(result.data);
        } else {
          setError(result.message || 'Service not found');
        }
      } catch (err) {
        setError('Failed to load service details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  // حالة التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#c8a44e] animate-spin" />
      </div>
    );
  }

  // حالة الخطأ
  if (error || !service) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">{error || 'الصفحة غير موجودة'}</h2>
        <Link to="/" className="text-[#c8a44e] hover:text-[#a8872e] flex items-center gap-2 font-medium transition-colors">
          <BackArrow className="w-4 h-4" /> {t('nav.home')}
        </Link>
      </div>
    );
  }

  const DynamicIcon = iconMap[service.icon_name] || BookOpen;
  const gradientColor = service.color_class || 'from-[#0a1628] to-[#1a2744]';

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col">
      <div className="flex-grow py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          
          {/* زر العودة للرئيسية */}
          <Link to="/" className="inline-flex items-center gap-2 text-[#c8a44e] hover:text-[#a8872e] font-medium mb-8 transition-colors">
            <BackArrow className="w-5 h-5" />
            {t('nav.home')}
          </Link>

          {/* بطاقة تفاصيل الخدمة */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* الهيدر الملون للخدمة */}
            <div className={`bg-gradient-to-r ${gradientColor} p-10 text-white relative overflow-hidden`}>
              {/* تأثير ضبابي خلفي للهيدر */}
              <div className="absolute -top-10 -end-10 w-40 h-40 bg-[#c8a44e]/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 bg-[#c8a44e]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#c8a44e]/30">
                  <DynamicIcon className="w-10 h-10 text-[#c8a44e]" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold">
                    {currentLang === 'ar' ? service.title_ar : service.title_en}
                  </h1>
                  <p className="mt-2 text-gray-300 text-lg">
                    {currentLang === 'ar' ? service.desc_ar : service.desc_en}
                  </p>
                </div>
              </div>
            </div>

            {/* محتوى التفاصيل (يدعم أكواد HTML القادمة من الداتا بيس)} */}
            <div className="p-10">
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: currentLang === 'ar' ? service.details_ar : service.details_en 
                }} 
              />
              
              {/* زر الإجراء */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <button className="bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all duration-300">
                  {t('services.explore')}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;