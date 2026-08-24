import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, Filter } from 'lucide-react';
import { API_BASE_URL } from '../api'; // ✅ أضف هذا السطر

const AllNewsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const currentLang = i18n.language;

  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // حالات البحث والفلترة
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/get_news.php`);

        const result = await res.json();
        if (result.status === 'success') {
          setNewsData(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("فشل الاتصال بالخادم");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
    window.scrollTo(0, 0);
  }, []);

  // استخراج التصنيفات الفريدة من الأخبار
  const categories = ['all', ...new Set(newsData.map(item => item.category))];

  // فلترة الأخبار بناءً على البحث والتصنيف
  const filteredNews = newsData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const title = currentLang === 'ar' ? item.title_ar : item.title_en;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const translateCategory = (cat) => {
    const categoriesMap = {
      'all': currentLang === 'ar' ? 'الكل' : 'All',
      'updates': currentLang === 'ar' ? 'تحديثات' : 'Updates',
      'grants': currentLang === 'ar' ? 'منح' : 'Grants',
      'events': currentLang === 'ar' ? 'فعاليات' : 'Events',
      'announcements': currentLang === 'ar' ? 'إعلانات' : 'Announcements'
    };
    return categoriesMap[cat] || cat;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <>
      {/* هيدر الصفحة */}
      <section className="relative bg-gradient-to-br from-gray-800 to-gray-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            {t('news.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }} 
            className="text-gray-300 max-w-xl mx-auto"
          >
            {t('news.subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6">
          
          {/* شريط البحث والفلترة */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            {/* حقل البحث */}
            <div className="relative w-full md:w-1/3">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
              <input 
                type="text" 
                placeholder={currentLang === 'ar' ? 'ابحث في الأخبار...' : 'Search news...'} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? 'pr-12' : 'pl-12'} pe-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50`}
              />
            </div>

            {/* أزرار التصنيفات */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400 hidden md:block" />
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {translateCategory(cat)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* شبكة الأخبار */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-52 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 text-center">
              <p className="font-bold text-lg mb-2">حدث خطأ أثناء تحميل الأخبار</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl font-bold">لا توجد أخبار مطابقة لبحثك</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link 
                    to={`/news/${item.slug}`} 
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="h-52 overflow-hidden relative">
                      <img 
                        src={item.image_url} 
                        alt={currentLang === 'ar' ? item.title_ar : item.title_en} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-bold text-blue-600 px-3 py-1.5 rounded-full">
                        {translateCategory(item.category)}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-sm text-gray-400 mb-3 font-medium">{formatDate(item.created_at)}</p>
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-relaxed flex-grow">
                        {currentLang === 'ar' ? item.title_ar : item.title_en}
                      </h3>
                      <div className="mt-4 text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t('news.read_more')} <ArrowIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* <Footer /> */}
    </>
  );
};

export default AllNewsPage;