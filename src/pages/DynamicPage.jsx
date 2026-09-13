import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, BookOpen, Users, Building2, Scale, Shield, 
  Target, Eye, FileText, AlertCircle, CheckCircle 
} from 'lucide-react';
// import Footer from '../components/layout/Footer';
import { API_BASE_URL } from '../api';

// دالة الأيقونات الشاملة
const getIcon = (name) => {
  const icons = { BookOpen, Users, Building2, Scale, Shield, Target, Eye, FileText, AlertCircle, CheckCircle };
  return icons[name] || BookOpen;
};

const DynamicPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false; // مقارنة بادئة اللغة (يدعم ar-IQ ونحوها)
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;
  const lang = i18n.language;

  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/get_page.php?slug=${slug}`);
        const result = await res.json();
        if (result.status === 'success') setPageData(result.data);
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPage();
    window.scrollTo(0, 0);
  }, [slug]);

  // حالات التحميل والخطأ
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
      <div className="w-16 h-16 border-4 border-[#c8a44e]/20 border-t-[#c8a44e] rounded-full animate-spin"></div>
    </div>
  );

  if (!pageData) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fb] text-center px-6">
      <h1 className="text-5xl font-black text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 mb-8">الصفحة غير موجودة</p>
      <Link to="/" className="text-[#c8a44e] font-bold hover:underline flex items-center gap-2">
        <ArrowIcon className="w-4 h-4" /> العودة للرئيسية
      </Link>
    </div>
  );

  const DynamicIcon = getIcon(pageData.icon_name);
    // قائمة الألوان المسموح بها (لمنع الألوان القديمة من الظهور)
  const allowedGradients = [
    'from-[#0a1628] to-[#1a2744]',
    'from-[#0a1628] to-[#c8a44e]',
    'from-[#c8a44e] to-[#0a1628]',
  ];
  const gradientColor = (pageData.color_class && allowedGradients.includes(pageData.color_class)) 
    ? pageData.color_class 
    : 'from-[#0a1628] to-[#1a2744]';

  return (
    <>
      {/* هيدر الصفحة المتحرك */}
      <section className={`relative bg-gradient-to-br ${gradientColor} py-24 overflow-hidden`}>
        {/* أشكال خلفية متحركة */}
        <motion.div 
          className="absolute -top-20 -end-20 w-80 h-80 bg-[#c8a44e]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-[#c8a44e]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-[#c8a44e]/30">
              <DynamicIcon className="w-10 h-10 text-[#c8a44e]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              {lang === 'ar' ? pageData.title_ar : pageData.title_en}
            </h1>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link>
              <span>/</span>
              <span className="text-white font-medium">{lang === 'ar' ? pageData.title_ar : pageData.title_en}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* محتوى الصفحة */}
      <section className="py-20 bg-[#f4f6fb]">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12"
          >
            {/* استخدام prose لتنسيق الـ HTML القادم من قاعدة البيانات بشكل احترافي */}
            <div 
              className={`prose prose-lg max-w-none ${isRTL ? 'rtl:prose text-right' : 'text-left'}`}
              dangerouslySetInnerHTML={{ __html: lang === 'ar' ? pageData.content_ar : pageData.content_en }}
            />
          </motion.div>

          {/* إذا كانت هناك أقسام إضافية (Cards) في قاعدة البيانات */}
          {pageData.sections && pageData.sections.length > 0 && (
            <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {pageData.sections.map((section, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow group"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <span className="w-8 h-8 bg-[#c8a44e]/10 text-[#c8a44e] rounded-lg flex items-center justify-center text-sm font-black group-hover:bg-[#c8a44e] group-hover:text-[#0a1628] transition-colors">{index + 1}</span>
                    {lang === 'ar' ? section.title_ar : section.title_en}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {lang === 'ar' ? section.content_ar : section.content_en}
                  </p>
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

export default DynamicPage;