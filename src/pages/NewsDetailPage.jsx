import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Calendar, Tag, Loader2 } from 'lucide-react';
// import Footer from '../components/layout/Footer';
import { API_BASE_URL } from '../api';

const NewsDetailPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false; // مقارنة بادئة اللغة (يدعم ar-IQ ونحوها)
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const currentLang = i18n.language;

  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get_news_details.php?slug=${slug}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 'success') {
          setNews(result.data);
        } else {
          setError(result.message || 'لم يتم العثور على الخبر');
        }
      } catch (err) {
        console.error("Full Error Details:", err);
        setError(`فشل تحميل الخبر: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const translateCategory = (cat) => {
    const categories = { 
      'updates': currentLang === 'ar' ? 'تحديثات' : 'Updates', 
      'grants': currentLang === 'ar' ? 'منح' : 'Grants', 
      'events': currentLang === 'ar' ? 'فعاليات' : 'Events' 
    };
    return categories[cat] || cat;
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
    </div>
  );

  if (error || !news) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 px-6">
      <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl max-w-lg text-center">
        <h2 className="text-xl font-bold mb-2">حدث خطأ!</h2>
        <p className="text-sm mb-4">{error}</p>
        <p className="text-xs text-red-500">(افتح Console في المتصفح F12 لمعرفة التفاصيل التقنية)</p>
      </div>
      <Link to="/" className="text-brand-orange hover:text-brand-orange-dark flex items-center gap-2 font-medium transition-colors">
        <BackArrow className="w-4 h-4" /> {t('nav.home')}
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          
          <Link to="/" className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-orange-dark font-medium mb-8 transition-colors">
            <BackArrow className="w-5 h-5" /> {t('nav.home')}
          </Link>

          <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* الصورة الرئيسية */}
            <div className="h-[400px] w-full overflow-hidden">
              <img src={news.image_url} alt={news.title_ar} className="w-full h-full object-cover" />
            </div>

            {/* محتوى الخبر */}
            <div className="p-10">
              {/* التصنيف والتاريخ */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange px-3 py-1.5 rounded-full font-semibold">
                  <Tag className="w-4 h-4" />
                  {translateCategory(news.category)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(news.created_at)}
                </div>
              </div>

              {/* العنوان */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
                {currentLang === 'ar' ? news.title_ar : news.title_en}
              </h1>

              {/* التفاصيل (يدعم HTML من الداتا بيس) */}
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: currentLang === 'ar' ? news.content_ar : news.content_en 
                }} 
              />
            </div>
          </article>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default NewsDetailPage;