import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Phone, Mail, MapPin, Loader2, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { SiteContext } from '../SiteContext';
import { API_BASE_URL } from '../api';
import { getValidationMessages, validateField as validateFieldValue } from '../utils/formValidation';
import ErrorMessage from '../components/shared/ErrorMessage';

const HelpPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false; // مقارنة بادئة اللغة (يدعم ar-IQ ونحوها)
  const currentLang = i18n.language;
  const [openIndex, setOpenIndex] = useState(null);

  const { siteInfo } = useContext(SiteContext);

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
    window.scrollTo(0, 0);
  }, []);

  // ✅ حالة نموذج التواصل
  const validationMessages = getValidationMessages(currentLang);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isFormSuccess, setIsFormSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const validateField = (name, value) => validateFieldValue(name, value, validationMessages);

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

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

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
              className="space-y-4"
            >
              <p className="text-brand-muted italic leading-relaxed">
                {t('help.hero_quote')}
              </p>
              <p className="text-brand-muted leading-relaxed">
                {t('help.hero_desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ✅ قسم الأسئلة الشائعة */}
      <section className="py-16 md:py-20 bg-[#faf7f4]">
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

      {/* ✅ قسم تواصل معنا */}
      <section className="py-16 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-brand-orange rounded-2xl p-8 md:p-14 grid lg:grid-cols-2 gap-10"
        >
          {/* بيانات التواصل */}
          <div>
            <h2 className="text-white font-black text-3xl mb-3">{t('help.cta_title')}</h2>
            <p className="text-white/80 mb-6">{t('help.cta_subtitle')}</p>
            <div className="w-12 h-0.5 bg-white/40 mb-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
                <span dir="ltr" className="text-white/90 text-sm">{siteInfo?.phone || '...'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white flex-shrink-0" />
                <span className="text-white/90 text-sm">{siteInfo?.email || '...'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white flex-shrink-0" />
                <span className="text-white/90 text-sm">
                  {currentLang === 'ar' ? (siteInfo?.address_ar || '...') : (siteInfo?.address_en || '...')}
                </span>
              </div>
            </div>
          </div>

          {/* نموذج التواصل */}
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
                <label className="text-sm font-bold text-brand-ink mb-1.5 block">
                  {t('help.form_full_name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t('help.form_full_name')}
                  className={getInputClass('name')}
                />
                <ErrorMessage message={touched.name ? errors.name : ''} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink mb-1.5 block">
                  {t('help.form_email')}
                </label>
                <input
                  type="email"
                  name="email"
                  dir="ltr"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t('help.form_email')}
                  className={getInputClass('email')}
                />
                <ErrorMessage message={touched.email ? errors.email : ''} />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-bold text-brand-ink mb-1.5 block">
                {t('help.form_subject')}
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t('help.form_subject')}
                className={getInputClass('subject')}
              />
              <ErrorMessage message={touched.subject ? errors.subject : ''} />
            </div>

            <div className="mb-6">
              <label className="text-sm font-bold text-brand-ink mb-1.5 block">
                {t('help.form_message')}
              </label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t('help.form_message')}
                className={getInputClass('message')}
              ></textarea>
              <ErrorMessage message={touched.message ? errors.message : ''} />
            </div>

            <button
              type="submit"
              disabled={isFormLoading}
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-full font-bold hover:bg-brand-orange-dark transition-all duration-300 disabled:opacity-70"
            >
              {isFormLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('help.form_submit')}
              {!isFormLoading && <ArrowIcon className="w-4 h-4" />}
            </button>
          </form>
        </motion.div>
      </section>
    </>
  );
};

export default HelpPage;
