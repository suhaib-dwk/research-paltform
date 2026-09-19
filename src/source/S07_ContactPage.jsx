import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { SiteContext } from '../SiteContext';
import { API_BASE_URL } from '../api';
import { getValidationMessages, validateField as validateFieldValue } from './shared/formValidation';
import ErrorMessage from './shared/ErrorMessage';
import { cleanHeroText } from "./S01_Home/InnerBlocks";

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { siteInfo } = useContext(SiteContext);

  const validationMessages = getValidationMessages(currentLang);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/send_message.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.status === 'success') {
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setTouched({});
        setTimeout(() => setIsSuccess(false), 4000);
      } else {
        setApiError(result.message);
      }
    } catch (err) {
      setApiError(currentLang === 'ar' ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const base = 'w-full px-4 py-3 rounded-xl border outline-none transition-all placeholder:text-gray-300 bg-white';
    const hasError = touched[fieldName] && errors[fieldName];
    if (hasError) {
      return `${base} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100`;
    }
    return `${base} border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20`;
  };

  const contactInfo = [
    { icon: Phone, label: t('contact.phone_label'), value: siteInfo?.phone || '...', dir: 'ltr' },
    { icon: Mail, label: t('contact.email_label'), value: siteInfo?.email || '...', dir: 'ltr' },
    {
      icon: MapPin,
      label: t('contact.location_label'),
      value: currentLang === 'ar' ? (siteInfo?.address_ar || '...') : (siteInfo?.address_en || '...'),
    },
  ];

  return (
    <>
      {/* ✅ قسم الهيرو */}
      {/* ✅ الصفحة بلون الموقع (البرتقالي) — بطلب صريح: هيرو برتقالي بنص داكن، ثم النموذج
          في بطاقة بيضاء فوق الخلفية البرتقالية نفسها */}
      <section className="bg-brand-orange py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-brand-ink leading-tight mb-4">
                {cleanHeroText(t('contact.hero_title_main'))}{' '}
                <span className="text-white block">{cleanHeroText(t('contact.hero_title_highlight'))}</span>
              </h1>
              <div className="w-16 h-1 bg-brand-ink" />
            </div>

            <div className="space-y-4">
              <p className="text-brand-ink/85 leading-relaxed text-lg">{t('contact.hero_desc')}</p>
              <p className="text-brand-ink/70 leading-relaxed">{t('contact.hero_note')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ نموذج التواصل — الجسم أبيض (بطلب صريح) والهيرو فقط برتقالي */}
      <section className="relative bg-white">
        <div className="relative container mx-auto px-6 py-20 md:py-24">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-brand-ink leading-relaxed">
              {t('contact.form_intro')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto space-y-5 bg-white rounded-3xl p-6 md:p-10 border border-gray-200 shadow-[0_24px_50px_-30px_rgba(36,27,20,0.25)]">
            {apiError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium border border-red-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {apiError}
              </div>
            )}
            {isSuccess && (
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2 text-sm font-medium border border-emerald-100">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                {currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message sent successfully!'}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

            <div>
              <label className="text-sm font-bold text-brand-ink mb-1.5 block">{t('help.form_subject')}</label>
              <input
                type="text" name="subject" value={formData.subject}
                onChange={handleChange} onBlur={handleBlur}
                placeholder={t('help.form_subject')} className={getInputClass('subject')}
              />
              <ErrorMessage message={touched.subject ? errors.subject : ''} />
            </div>

            <div>
              <label className="text-sm font-bold text-brand-ink mb-1.5 block">{t('help.form_message')}</label>
              <textarea
                name="message" rows="5" value={formData.message}
                onChange={handleChange} onBlur={handleBlur}
                placeholder={t('help.form_message')} className={getInputClass('message')}
              ></textarea>
              <ErrorMessage message={touched.message ? errors.message : ''} />
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-orange text-white px-10 py-3.5 rounded-full font-bold hover:bg-brand-orange-dark transition-all duration-300 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {t('help.form_submit')}
            </button>
          </form>

          {/* بطاقات معلومات التواصل */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <info.icon className="w-5 h-5 text-brand-orange mx-auto mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-wide text-brand-muted mb-1">{info.label}</p>
                <p dir={info.dir} className="text-brand-ink text-sm font-bold break-words">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
