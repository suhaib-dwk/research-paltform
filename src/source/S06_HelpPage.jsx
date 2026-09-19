import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../api';

const HelpPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false; // مقارنة بادئة اللغة (يدعم ar-IQ ونحوها)
  const currentLang = i18n.language;
  const [openIndex, setOpenIndex] = useState(null);

  // حالات الأسئلة الشائعة
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
  }, []);

  return (
    <>
      {/* ✅ قسم الهيرو */}
      <section className="bg-brand-cream-hero py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-4"
              >
                {t('help.hero_label')}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-brand-ink leading-tight mb-4"
              >
                {t('help.hero_title_line1')}{' '}
                <span className="text-brand-orange block">{t('help.hero_title_line2')}</span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '4rem' }}
                transition={{ delay: 0.3 }}
                className="h-1 bg-brand-ink"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-5"
            >
              <p className="text-brand-muted leading-relaxed">
                {t('help.hero_desc')}
              </p>
              {/* ✅ روابط سريعة لأقسام الصفحة — بدل اقتباس صفحة "من نحن" المكرر */}
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { href: '#faq', title: t('help.faq_page'), desc: t('help.faq_page_desc') },
                  { href: '/target-audience', title: t('help.guide'), desc: t('help.guide_desc'), route: true },
                ].map((q) => (
                  q.route ? (
                    <Link key={q.href} to={q.href} className="group bg-white border border-gray-200 hover:border-brand-orange/50 p-4 transition-colors">
                      <span className="block text-sm font-bold text-brand-ink mb-1 group-hover:text-brand-orange transition-colors">{q.title}</span>
                      <span className="block text-xs text-brand-muted leading-relaxed">{q.desc}</span>
                    </Link>
                  ) : (
                    <a key={q.href} href={q.href} className="group bg-white border border-gray-200 hover:border-brand-orange/50 p-4 transition-colors">
                      <span className="block text-sm font-bold text-brand-ink mb-1 group-hover:text-brand-orange transition-colors">{q.title}</span>
                      <span className="block text-xs text-brand-muted leading-relaxed">{q.desc}</span>
                    </a>
                  )
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ✅ قسم الأسئلة الشائعة */}
      <section id="faq" className="py-16 md:py-20 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* صورة توضيحية */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-square bg-gradient-to-br from-brand-cream to-brand-cream-hero rounded-2xl"
            >
              {/* TODO: استبدال هذا المكان بصورة حقيقية من تصميم Figma */}
            </motion.div>

            {/* قائمة الأسئلة */}
            <div>
              {isLoading && (
                <div className="space-y-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border-b border-brand-ink/10 py-6 animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-brand-cream rounded"></div>
                        <div className="h-5 bg-brand-cream rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && !isLoading && (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <p className="font-bold">حدث خطأ أثناء تحميل الأسئلة</p>
                    <p className="text-sm opacity-80">{error}</p>
                  </div>
                </div>
              )}

              {!isLoading && !error && faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="border-b border-brand-ink/10"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center gap-4 py-6 text-start hover:opacity-80 transition-opacity"
                  >
                    <span className="text-3xl font-black text-brand-orange w-10 flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-bold text-brand-ink text-lg flex-1">
                      {currentLang === 'ar' ? faq.question_ar : faq.question_en}
                    </span>
                    <motion.span
                      animate={{ rotate: openIndex === index ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex-shrink-0 text-brand-orange"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="ps-14 pb-6 text-brand-muted leading-relaxed">
                          {currentLang === 'ar' ? faq.answer_ar : faq.answer_en}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default HelpPage;
