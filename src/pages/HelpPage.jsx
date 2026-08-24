import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, AlertCircle } from 'lucide-react';
// import Footer from '../components/layout/Footer';
import { API_BASE_URL } from '../api';

const HelpPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentLang = i18n.language;
  const [openIndex, setOpenIndex] = useState(null);

  // حالات البيانات
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب البيانات من قاعدة البيانات
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/get_faqs.php`);
        const result = await res.json();

        if (result.status === 'success') {
          setFaqs(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("فشل الاتصال بالخادم");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* هيدر الصفحة */}
      <section className="relative bg-gradient-to-br from-[#0a1628] to-[#1a2744] py-24 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#c8a44e]/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-[#c8a44e]/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <HelpCircle className="w-10 h-10 text-[#c8a44e]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            {t('nav.help')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-xl mx-auto"
          >
            {currentLang === 'ar' ? 'اكتشف إجابات لأكثر الأسئلة شيوعاً حول المنصة' : 'Find answers to the most common questions about the platform'}
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-[#f4f6fb]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-4">

            {/* حالة التحميل (Skeleton) */}
            {isLoading && (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="mt-4 h-20 bg-gray-100 rounded"></div>
                </div>
              ))
            )}

            {/* حالة الخطأ */}
            {error && !isLoading && (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="font-bold">حدث خطأ أثناء تحميل الأسئلة</p>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              </div>
            )}

            {/* عرض الأسئلة الشائعة ديناميكياً */}
            {!isLoading && !error && faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <span className="font-bold text-gray-800 text-lg pe-4">
                    {currentLang === 'ar' ? faq.question_ar : faq.question_en}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#c8a44e]/10 rounded-full p-1 flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[#c8a44e]" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                        {currentLang === 'ar' ? faq.answer_ar : faq.answer_en}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* كرت الدعم المباشر */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mt-16 bg-[#0a1628] p-10 rounded-3xl text-center text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#c8a44e]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-[#c8a44e]" />
              <h3 className="text-2xl font-bold mb-2">
                {currentLang === 'ar' ? 'لم تجد إجابتك؟' : "Didn't find your answer?"}
              </h3>
              <p className="text-gray-400 mb-8">
                {currentLang === 'ar' ? 'فريق الدعم الفني جاهز لمساعدتك على مدار الساعة' : 'Our technical support team is ready to help you 24/7'}
              </p>
              <Link
                to="/contact-us"
                className="inline-block bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all duration-300"
              >
                {currentLang === 'ar' ? 'تواصل معنا الآن' : 'Contact us now'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* <Footer /> */}
    </>
  );
};

export default HelpPage;