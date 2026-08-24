import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { SiteContext } from '../SiteContext';
import { API_BASE_URL } from '../api';

// ✅ مكون أيقونة السوشيال ميديا
const SocialIcon = ({ href, children, hoverColor }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:${hoverColor} hover:bg-gray-200 transition-all cursor-pointer`}
    >
      {children}
    </a>
  );
};

// ✅ رسائل التحقق حسب اللغة
const getValidationMessages = (lang) => ({
  name: {
    required: lang === 'ar' ? 'الاسم مطلوب' : 'Name is required',
    minLength: lang === 'ar' ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters',
    maxLength: lang === 'ar' ? 'الاسم يجب ألا يتجاوز 50 حرفاً' : 'Name must not exceed 50 characters',
    invalidChars: lang === 'ar' ? 'الاسم يجب أن يحتوي على أحرف ومسافات فقط' : 'Name must contain only letters and spaces',
  },
  email: {
    required: lang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required',
    invalid: lang === 'ar' ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format',
  },
  subject: {
    required: lang === 'ar' ? 'الموضوع مطلوب' : 'Subject is required',
    minLength: lang === 'ar' ? 'الموضوع يجب أن يكون 3 أحرف على الأقل' : 'Subject must be at least 3 characters',
    maxLength: lang === 'ar' ? 'الموضوع يجب ألا يتجاوز 100 حرف' : 'Subject must not exceed 100 characters',
  },
  message: {
    required: lang === 'ar' ? 'الرسالة مطلوبة' : 'Message is required',
    minLength: lang === 'ar' ? 'الرسالة يجب أن تكون 10 أحرف على الأقل' : 'Message must be at least 10 characters',
    maxLength: lang === 'ar' ? 'الرسالة يجب ألا تتجاوز 2000 حرف' : 'Message must not exceed 2000 characters',
  },
});

// ✅ دالة التحقق من صحة البريد الإلكتروني
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// ✅ دالة التحقق من صحة الاسم (أحرف ومسافات فقط، يدعم العربي والإنجليزي)
const isValidName = (name) => {
  const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;
  return nameRegex.test(name);
};

// ✅ مكون رسالة الخطأ
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </motion.p>
  );
};

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentLang = i18n.language;

  const { siteInfo } = useContext(SiteContext);
  const validationMessages = getValidationMessages(currentLang);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // ✅ دالة التحقق من حقل واحد
  const validateField = (name, value) => {
    const msgs = validationMessages[name];
    if (!msgs) return '';

    switch (name) {
      case 'name':
        if (!value.trim()) return msgs.required;
        if (value.trim().length < 2) return msgs.minLength;
        if (value.trim().length > 50) return msgs.maxLength;
        if (!isValidName(value.trim())) return msgs.invalidChars;
        return '';

      case 'email':
        if (!value.trim()) return msgs.required;
        if (!isValidEmail(value.trim())) return msgs.invalid;
        return '';

      case 'subject':
        if (!value.trim()) return msgs.required;
        if (value.trim().length < 3) return msgs.minLength;
        if (value.trim().length > 100) return msgs.maxLength;
        return '';

      case 'message':
        if (!value.trim()) return msgs.required;
        if (value.trim().length < 10) return msgs.minLength;
        if (value.trim().length > 2000) return msgs.maxLength;
        return '';

      default:
        return '';
    }
  };

  // ✅ دالة التحقق من كل الحقول
  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
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
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
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

  // ✅ عداد الأحرف للرسالة
  const messageCharCount = formData.message.length;
  const messageMaxChars = 2000;
  const isMessageNearLimit = messageCharCount > messageMaxChars * 0.9;
  const isMessageOverLimit = messageCharCount > messageMaxChars;

  const contactInfo = [
    {
      icon: Phone,
      label: currentLang === 'ar' ? 'الهاتف' : 'Phone',
      value: siteInfo?.phone || '...',
      color: 'bg-[#c8a44e]/10 text-[#c8a44e]'
    },
    {
      icon: Mail,
      label: currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email',
      value: siteInfo?.email || '...',
      color: 'bg-[#c8a44e]/10 text-[#c8a44e]'
    },
    {
      icon: MapPin,
      label: currentLang === 'ar' ? 'العنوان' : 'Address',
      value: currentLang === 'ar'
        ? (siteInfo?.address_ar || '...')
        : (siteInfo?.address_en || '...'),
      color: 'bg-[#c8a44e]/10 text-[#c8a44e]'
    },
  ];

  // ✅ دالة مساعدة لتعيين كلاس الحقل
  const getInputClass = (fieldName) => {
    const base = 'w-full px-4 py-3 rounded-xl border outline-none transition-all placeholder:text-gray-300';
    const hasError = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && formData[fieldName].trim();

    if (hasError) {
      return `${base} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30`;
    }
    if (isValid) {
      return `${base} border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-emerald-50/30`;
    }
    return `${base} border-gray-200 focus:border-[#c8a44e] focus:ring-2 focus:ring-[#c8a44e]/20`;
  };

  return (
    <>
      {/* ✅ الهيدر */}
      <section className="relative bg-gradient-to-br from-[#0a1628] to-[#1a2744] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#c8a44e] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#c8a44e] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            {t('nav.contact_us')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-xl mx-auto"
          >
            {currentLang === 'ar'
              ? 'نسعد بتواصلك معنا وسنرد عليك في أقرب وقت'
              : 'We are happy to hear from you and will get back to you as soon as possible'}
          </motion.p>
        </div>
      </section>

      {/* ✅ المحتوى الرئيسي */}
      <section className="py-20 bg-[#f4f6fb]">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* العمود الأيسر: معلومات التواصل + السوشيال ميديا */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center flex-shrink-0`}>
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">{info.label}</p>
                    <p className="text-gray-800 font-bold mt-1" dir="ltr">
                      {info.value}
                    </p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
              >
                <p className="text-sm text-gray-400 font-medium mb-4">
                  {currentLang === 'ar' ? 'تابعنا على' : 'Follow us on'}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <SocialIcon href={siteInfo?.x_link} hoverColor="text-black">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon href={siteInfo?.linkedin_link} hoverColor="text-blue-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon href={siteInfo?.youtube_link} hoverColor="text-red-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon href={siteInfo?.instagram_link} hoverColor="text-pink-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </SocialIcon>
                </div>
              </motion.div>
            </motion.div>

            {/* العمود الأيمن: نموذج التواصل */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm"
              noValidate
            >
              {/* رسالة الخطأ من الـ API */}
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium border border-red-100"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {apiError}
                </motion.div>
              )}

              {/* رسالة النجاح */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2 text-sm font-medium border border-emerald-100"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  {currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message sent successfully!'}
                </motion.div>
              )}

              {/* ✅ حقل الاسم */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                    {currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={currentLang === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                      className={getInputClass('name')}
                    />
                    {/* ✅ أيقونة الحالة */}
                    {touched.name && formData.name.trim() && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        {errors.name ? (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        )}
                      </span>
                    )}
                  </div>
                  <ErrorMessage message={touched.name ? errors.name : ''} />
                </div>

                {/* ✅ حقل البريد الإلكتروني */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                    {currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={currentLang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                      dir="ltr"
                      className={getInputClass('email')}
                    />
                    {touched.email && formData.email.trim() && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        {errors.email ? (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        )}
                      </span>
                    )}
                  </div>
                  <ErrorMessage message={touched.email ? errors.email : ''} />
                </div>
              </div>

              {/* ✅ حقل الموضوع */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  {currentLang === 'ar' ? 'الموضوع' : 'Subject'}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={currentLang === 'ar' ? 'موضوع الرسالة' : 'Message subject'}
                    className={getInputClass('subject')}
                  />
                  {touched.subject && formData.subject.trim() && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      {errors.subject ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      )}
                    </span>
                  )}
                </div>
                <ErrorMessage message={touched.subject ? errors.subject : ''} />
              </div>

              {/* ✅ حقل الرسالة مع عداد الأحرف */}
              <div className="space-y-2 mb-8">
                <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    {currentLang === 'ar' ? 'الرسالة' : 'Message'}
                    <span className="text-red-400">*</span>
                  </span>
                  <span className={`text-xs font-normal ${
                    isMessageOverLimit 
                      ? 'text-red-500 font-bold' 
                      : isMessageNearLimit 
                        ? 'text-amber-500' 
                        : 'text-gray-400'
                  }`}>
                    {messageCharCount} / {messageMaxChars}
                  </span>
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={currentLang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  className={getInputClass('message')}
                ></textarea>
                <ErrorMessage message={touched.message ? errors.message : ''} />
              </div>

              {/* ✅ زر الإرسال مع التحقق النهائي */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-10 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isLoading
                  ? (currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                  : (currentLang === 'ar' ? 'إرسال الرسالة' : 'Send Message')}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;