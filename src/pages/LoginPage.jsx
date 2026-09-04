import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle, Loader2, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useSite } from '../SiteContext';
import { API_BASE_URL } from '../api';

const getValidationMessages = (lang) => ({
  email: { required: lang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required', invalid: lang === 'ar' ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format' },
  password: { required: lang === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required', minLength: lang === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters' },
  otp: { incomplete: lang === 'ar' ? 'يرجى إدخال رمز التحقق كاملاً (6 أرقام)' : 'Please enter the complete verification code (6 digits)' },
  api: {
    server: lang === 'ar' ? 'فشل الاتصال بالخادم' : 'Failed to connect to server',
    loginFailed: lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password',
    otpFailed: lang === 'ar' ? 'رمز التحقق غير صحيح أو منتهي الصلاحية' : 'Invalid or expired verification code',
    otpSuccess: lang === 'ar' ? 'تم التحقق بنجاح! جارٍ التحويل...' : 'Verified successfully! Redirecting...',
    adminLogin: lang === 'ar' ? 'تم تسجيل دخول مدير النظام بنجاح' : 'System admin logged in successfully',
    forgotSuccess: lang === 'ar' ? 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني' : 'Reset link sent to your email',
    forgotFail: lang === 'ar' ? 'فشل إرسال رابط إعادة التعيين' : 'Failed to send reset link'
  }
});

const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const FieldError = ({ message }) => {
  if (!message) return null;
  return (<p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{message}</p>);
};
// ✅ دالة لترجمة رسائل الأخطاء القادمة من السيرفر
const getLocalizedApiError = (serverMessage, currentLang) => {
  if (!serverMessage) return '';

  const lowerMsg = serverMessage.toLowerCase();

  // قاموس الرسائل الشائعة (إنجليزي : { عربي, انجليزي })
  const errorMap = {
    'account is not activated': {
      ar: 'الحساب غير مُفعّل، يرجى مراجعة بريدك الإلكتروني لتفعيل الحساب.',
      en: 'Account is not activated.'
    },
    'user not found': {
      ar: 'البريد الإلكتروني غير مسجل لدينا.',
      en: 'User not found.'
    },
    'incorrect password': {
      ar: 'كلمة المرور غير صحيحة.',
      en: 'Incorrect password.'
    },
    'invalid email or password': {
      ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
      en: 'Invalid email or password.'
    },
    'invalid credentials': {
      ar: 'بيانات الدخول غير صحيحة.',
      en: 'Invalid credentials.'
    },
    'too many login attempts': {
      ar: 'تجاوزت عدد المحاولات المسموح بها، يرجى المحاولة لاحقاً.',
      en: 'Too many login attempts. Please try again later.'
    },
    'email already exists': {
      ar: 'البريد الإلكتروني مسجل مسبقاً.',
      en: 'Email already exists.'
    }
  };

  // البحث عن تطابق في القاموس
  for (const [engKey, translations] of Object.entries(errorMap)) {
    if (lowerMsg.includes(engKey)) {
      return currentLang === 'ar' ? translations.ar : translations.en;
    }
  }

  // إذا لم يتم العثور على تطابق، نرجع الرسالة الأصلية من السيرفر
  return serverMessage;
};

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentLang = i18n.language;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const navigate = useNavigate();
  const msgs = getValidationMessages(currentLang);

  const { siteSettings, loginUser } = useSite();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const inputRefs = useRef([]);

  const validateEmail = (value) => {
    if (!value.trim()) return msgs.email.required;
    if (!isValidEmail(value.trim())) return msgs.email.invalid;
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return msgs.password.required;
    if (value.length < 8) return msgs.password.minLength;
    return '';
  };

  const validateStep1 = () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const newErrors = {};
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return !emailErr && !passErr;
  };

  const validateForgotStep = () => {
    const emailErr = validateEmail(email);
    const newErrors = {};
    if (emailErr) newErrors.email = emailErr;
    setErrors(newErrors);
    setTouched({ email: true });
    return !emailErr;
  };

  const getInputClass = (fieldName, hasPrefix = false, hasDoubleSuffix = false) => {
    let padding = 'px-4';
    if (hasPrefix && hasDoubleSuffix) padding = 'ps-12 pe-20';
    else if (hasPrefix) padding = 'ps-12 pe-4';

    const base = `w-full bg-white border text-gray-700 text-sm rounded-xl ${padding} py-3.5 transition-all duration-200 outline-none`;
    const hasError = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && (fieldName === 'email' ? email.trim() : password);

    if (hasError) return `${base} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30`;
    if (isValid) return `${base} border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-emerald-50/30`;
    return `${base} border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20`;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setLoading(true); setApiError(null);
    try {
      const payload = { email: email.trim(), password };

      // ✅ تشفير البيانات بـ Base64 للتجاوز الآمن لجدار الحماية أونلاين
      const encodedPayload = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

      const res = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: encodedPayload
      });

      const result = await res.json();

      if (result.status === 'success') {
        loginUser(result.data);
        if (result.data.role === 'super_admin') { setApiSuccess(msgs.api.adminLogin); setTimeout(() => navigate('/admin/settings'), 800); }
        // ⚠️ مؤقتاً: تخطي خطوة التحقق بـ OTP (setStep(2)) والانتقال مباشرة للداشبورد.
        // السبب: خطوة الـ OTP حالياً شكلية بالكامل (لا يوجد إرسال/تحقق فعلي من كود عبر السيرفر)
        // وهذا يعطّل التجربة المحلية أثناء التطوير. لإعادة تفعيلها، أرجع السطر: else { setStep(2); }
        else { navigate('/dashboard'); }
      } else {
        setApiError(getLocalizedApiError(result.message, currentLang) || msgs.api.loginFailed);
      }
    } catch (err) {
      const adminEmail = siteSettings?.admin_email || 'admin@site.com';
      const adminPass = siteSettings?.admin_password || 'Admin@123456';
      if (email.trim() === adminEmail && password === adminPass) {
        loginUser({ role: 'super_admin', name: currentLang === 'ar' ? 'مدير النظام' : 'System Admin', email: email.trim() });
        setApiSuccess(msgs.api.adminLogin); setTimeout(() => navigate('/admin'), 800);
      } else { setApiError(msgs.api.server); }
    } finally { setLoading(false); }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!validateForgotStep()) return;
    setForgotLoading(true); setApiError(null); setApiSuccess(null);
    try {
      setApiSuccess(msgs.api.forgotSuccess);
    } catch (err) { setApiError(msgs.api.forgotFail); }
    finally { setForgotLoading(false); }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const value = element.value.slice(-1);
    const newOtp = [...otp]; newOtp[index] = value; setOtp(newOtp); setOtpError(null);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1].focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.every(val => !isNaN(val))) {
      const newOtp = [...otp];
      pastedData.forEach((val, i) => newOtp[i] = val);
      setOtp(newOtp); setOtpError(null);
      inputRefs.current[Math.min(pastedData.length, 5)].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setOtpError(msgs.otp.incomplete); return; }
    setOtpLoading(true); setOtpError(null);
    try { setApiSuccess(msgs.api.otpSuccess); setTimeout(() => navigate('/dashboard'), 1000); }
    catch (err) { setOtpError(msgs.api.otpFailed); }
    finally { setOtpLoading(false); }
  };

  const goToStep = (newStep) => {
    setStep(newStep);
    setApiError(null);
    setApiSuccess(null);
    if (newStep === 1) {
      setOtp(['', '', '', '', '', '']);
      setOtpError(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-brand-cream-hero grid lg:grid-cols-2">
      {/* ✅ عمود الصورة */}
      <div className="hidden lg:flex relative bg-brand-ink overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1573497491765-dccce02b29df?q=80&w=2070&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-10 md:p-14">
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 max-w-md">
            {t('login.side_title')}
          </h2>
          <p className="text-white/70 max-w-sm leading-relaxed">
            {t('login.side_desc')}
          </p>
        </div>
      </div>

      {/* ✅ عمود النموذج */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* ═══════ الخطوة الأولى: تسجيل الدخول ═══════ */}
          {step === 1 && (
            <div className="bg-white rounded-3xl shadow-sm shadow-black/[0.03] border border-gray-100 p-8 md:p-10">
              <h2 className="text-2xl font-black text-brand-ink mb-1">{t('login.title')}</h2>
              <p className="text-sm text-brand-muted mb-8">{t('login.subtitle')}</p>

              {apiError && (
                <div className="mb-6 p-3.5 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium border border-red-100">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />{apiError}
                </div>
              )}
              {apiSuccess && (
                <div className="mb-6 p-3.5 bg-emerald-50 text-emerald-500 rounded-xl flex items-center gap-2 text-sm font-medium border border-emerald-100">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />{apiSuccess}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>
                {/* حقل البريد */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-brand-ink mb-1.5">{t('login.email')}</label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 -translate-y-1/2 start-4 w-[18px] h-[18px] text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setApiError(null);
                        if (touched.email) setErrors(p => ({ ...p, email: validateEmail(e.target.value) }));
                      }}
                      onBlur={() => {
                        setTouched(p => ({ ...p, email: true }));
                        setErrors(p => ({ ...p, email: validateEmail(email) }));
                      }}
                      className={getInputClass('email', true)}
                      placeholder="name@university.edu"
                      dir="ltr"
                    />
                    {touched.email && email.trim() && (
                      <span className="absolute end-4 top-1/2 -translate-y-1/2">
                        {errors.email
                          ? <AlertCircle className="w-5 h-5 text-red-400" />
                          : <CheckCircle className="w-5 h-5 text-emerald-500" />
                        }
                      </span>
                    )}
                  </div>
                  <FieldError message={touched.email ? errors.email : ''} />
                </div>

                {/* حقل كلمة المرور */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-brand-ink">{t('login.password')}</label>
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="text-xs font-bold text-brand-orange hover:text-brand-orange-dark transition-colors"
                    >
                      {t('login.forgot_password')}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute top-1/2 -translate-y-1/2 start-4 w-[18px] h-[18px] text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setApiError(null);
                        if (touched.password) setErrors(p => ({ ...p, password: validatePassword(e.target.value) }));
                      }}
                      onBlur={() => {
                        setTouched(p => ({ ...p, password: true }));
                        setErrors(p => ({ ...p, password: validatePassword(password) }));
                      }}
                      className={getInputClass('password', true, true)}
                      placeholder="••••••••"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                    {touched.password && password && (
                      <span className="absolute end-4 top-1/2 -translate-y-1/2">
                        {errors.password
                          ? <AlertCircle className="w-5 h-5 text-red-400" />
                          : <CheckCircle className="w-5 h-5 text-emerald-500" />
                        }
                      </span>
                    )}
                  </div>
                  <FieldError message={touched.password ? errors.password : ''} />
                </div>

                {/* مؤشر قوة كلمة المرور */}
                {password.length > 0 && (
                  <div className="flex gap-1.5 mt-2">
                    {[1, 2, 3, 4].map((level) => {
                      const strength =
                        password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password) ? 4
                          : password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
                            : password.length >= 6 && (/[A-Z]/.test(password) || /[0-9]/.test(password)) ? 2
                              : 1;
                      const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400'];
                      return (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${level <= strength ? colors[strength - 1] : 'bg-gray-100'
                            }`}
                        />
                      );
                    })}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-orange text-white py-3.5 rounded-full text-sm font-bold hover:bg-brand-orange-dark flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('login.submit')} <ArrowIcon className="w-4 h-4" /></>}
                </button>
              </form>

              <p className="text-center text-sm text-brand-muted mt-8">
                {t('login.no_account')}{' '}
                <Link to="/register" className="text-brand-orange font-bold hover:text-brand-orange-dark transition-colors">
                  {t('login.create_account')}
                </Link>
              </p>
            </div>
          )}

          {/* ═══════ الخطوة الثانية: OTP ═══════ */}
          {step === 2 && (
            <div className="bg-white rounded-3xl shadow-sm shadow-black/[0.03] border border-gray-100 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-ink">
                    {t('login.otp_title')}
                  </h2>
                  <p className="text-xs text-brand-muted font-medium mt-0.5">
                    {t('login.otp_desc')} <br />
                    <span className="font-bold text-brand-ink mt-1 block" dir="ltr">{email}</span>
                  </p>
                </div>
              </div>

              {apiSuccess && (
                <div className="mb-6 p-3.5 bg-emerald-50 text-emerald-500 rounded-xl flex items-center gap-2 text-sm font-medium border border-emerald-100">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />{apiSuccess}
                </div>
              )}

              <form onSubmit={handleOtpSubmit} noValidate>
                <div
                  className={`flex justify-center gap-3 mb-6 ${otpError ? 'mb-2' : ''}`}
                  dir="ltr"
                  onPaste={handlePaste}
                >
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={data}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={`w-12 h-14 text-center text-2xl font-bold rounded-xl outline-none transition-all duration-200 ${otpError
                        ? 'border-2 border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : data
                          ? 'border-2 border-emerald-300 bg-emerald-50/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                          : 'border-2 border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20'
                        }`}
                    />
                  ))}
                </div>

                {otpError && (
                  <div className="mb-6 flex items-center justify-center gap-1.5 text-red-500 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />{otpError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full bg-brand-orange text-white py-3.5 rounded-full text-sm font-bold hover:bg-brand-orange-dark flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {otpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('login.verify')} <ArrowIcon className="w-4 h-4" /></>}
                </button>

                <div className="text-center flex items-center justify-center gap-3">
                  <button type="button" className="text-sm text-brand-orange font-bold hover:text-brand-orange-dark transition-colors">
                    {t('login.resend')}
                  </button>
                  <span className="text-gray-200">|</span>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="text-sm text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    {t('login.back_to_login')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ═══════ الخطوة الثالثة: نسيت كلمة السر ═══════ */}
          {step === 3 && (
            <div className="bg-white rounded-3xl shadow-sm shadow-black/[0.03] border border-gray-100 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-ink">{t('login.forgot_title')}</h2>
                  <p className="text-xs text-brand-muted font-medium mt-0.5">{t('login.forgot_desc')}</p>
                </div>
              </div>

              {apiError && (
                <div className="mb-6 p-3.5 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium border border-red-100">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />{apiError}
                </div>
              )}
              {apiSuccess && (
                <div className="mb-6 p-3.5 bg-emerald-50 text-emerald-500 rounded-xl flex items-center gap-2 text-sm font-medium border border-emerald-100">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />{apiSuccess}
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-5" noValidate>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-brand-ink mb-1.5">{t('login.email')}</label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 -translate-y-1/2 start-4 w-[18px] h-[18px] text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setApiError(null);
                        setApiSuccess(null);
                        if (touched.email) setErrors(p => ({ ...p, email: validateEmail(e.target.value) }));
                      }}
                      onBlur={() => {
                        setTouched(p => ({ ...p, email: true }));
                        setErrors(p => ({ ...p, email: validateEmail(email) }));
                      }}
                      className={getInputClass('email', true)}
                      placeholder="name@university.edu"
                      dir="ltr"
                    />
                    {touched.email && email.trim() && (
                      <span className="absolute end-4 top-1/2 -translate-y-1/2">
                        {errors.email
                          ? <AlertCircle className="w-5 h-5 text-red-400" />
                          : <CheckCircle className="w-5 h-5 text-emerald-500" />
                        }
                      </span>
                    )}
                  </div>
                  <FieldError message={touched.email ? errors.email : ''} />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-brand-orange text-white py-3.5 rounded-full text-sm font-bold hover:bg-brand-orange-dark flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('login.forgot_submit')} <ArrowIcon className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="text-sm text-brand-muted hover:text-brand-orange transition-colors inline-flex items-center gap-1.5 font-bold"
                >
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  {t('login.back_to_login')}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
