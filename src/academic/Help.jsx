import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HelpCircle,
  MessageCircle,
  BookOpen,
  ExternalLink,
  Mail,
  Send,
  Check,
  AlertCircle,
} from "lucide-react";

const faqItems = [
  {
    q_en: "How to submit a research?",
    q_ar: "كيف أقدم بحثاً؟",
    a_en: "Go to Researches > New Research and fill the form with your research details.",
    a_ar: "اذهب إلى الأبحاث > بحث جديد واملأ النموذج بتفاصيل بحثك.",
  },
  {
    q_en: "How to reset my password?",
    q_ar: "كيف أعيد تعيين كلمة المرور؟",
    a_en: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.',
    a_ar: 'اضغط "نسيت كلمة المرور" في صفحة تسجيل الدخول واتبع التعليمات المرسلة إلى بريدك الإلكتروني.',
  },
  {
    q_en: "How to contact support?",
    q_ar: "كيف أتواصل مع الدعم؟",
    a_en: "Use the Contact Support tab on this page or send an email to support@source.com.",
    a_ar: "استخدم تبويب تواصل معنا في هذه الصفحة أو أرسل بريداً إلى support@source.com.",
  },
  {
    q_en: "What payment methods are accepted?",
    q_ar: "ما هي طرق الدفع المتاحة؟",
    a_en: "We accept Visa, MasterCard, and PayPal for service fees.",
    a_ar: "نحن نقبل Visa و MasterCard و PayPal لرسوم الخدمات.",
  },
];

// محتوى الدليل (نص ثابت يمكن استبداله بمكون آخر)
const GuideContent = ({ isAr }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
      {isAr ? "بداية الاستخدام" : "Getting Started"}
    </h3>
    <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl p-5">
      <h4 className="font-bold text-brand-orange mb-2 flex items-center gap-2">
        <BookOpen className="w-5 h-5" /> {isAr ? "الخطوة 1: إكمال الملف الشخصي" : "Step 1: Complete your Profile"}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {isAr
          ? "تأكد من إضافة صورتك الشخصية، الوصف الأكاديمي، ومعلومات الاتصال في صفحة الحساب."
          : "Ensure you add your profile picture, academic bio, and contact information in the Account page."}
      </p>
    </div>
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
        {isAr ? "الخطوة 2: تصفح الخدمات" : "Step 2: Browse Services"}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {isAr
          ? "استكشف قائمة الخدمات المتاحة مثل الترجمة، التحكيم، والمساعد الذكي من القائمة الجانبية."
          : "Explore available services such as Translation, Review, and AI Assistant from the sidebar."}
      </p>
    </div>
  </div>
);

const Help = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('faq'); // الحالة الافتراضية
  const [formSent, setFormSent] = useState(false);
  const isRTL = i18n.language?.toLowerCase().startsWith("ar");

  // معالجة إرسال النموذج
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // هنا يتم إضافة كود إرسال البيانات إلى API
    console.log("Form submitted");
    setFormSent(true);
    setTimeout(() => setFormSent(false), 5000); // إخفاء رسالة النجاح بعد 5 ثواني
  };

  return (
    <div className="w-full space-y-6 animate-[fade-in_0.4s_ease-out]">
      
      {/* العنوان */}
      <div className="mb-2">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-brand-orange" />
          {t("help.title")}
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {t("help.desc")}
        </p>
      </div>

      {/* شريط التبويب (Tabs) - البطاقات تتصرف كأزرار تبويب */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* تبويب الدليل */}
        <button
          onClick={() => setActiveTab('guide')}
          className={`group text-start p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 ${
            activeTab === 'guide'
              ? "border-brand-orange bg-brand-orange/5 shadow-lg shadow-brand-orange/10"
              : "border-transparent bg-white dark:bg-brand-dark-card hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md"
          }`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
            activeTab === 'guide' 
              ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20" 
              : "bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white"
          }`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              {t("help.guide")}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {t("help.guide_desc")}
            </p>
          </div>
        </button>

        {/* تبويب الدعم الفني (يحتوي النموذج) */}
        <button
          onClick={() => setActiveTab('contact')}
          className={`group text-start p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 ${
            activeTab === 'contact'
              ? "border-brand-orange bg-brand-orange/5 shadow-lg shadow-brand-orange/10"
              : "border-transparent bg-white dark:bg-brand-dark-card hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md"
          }`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
            activeTab === 'contact' 
              ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20" 
              : "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white"
          }`}>
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              {t("help.contact")}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {t("help.contact_desc")}
            </p>
          </div>
        </button>

        {/* تبويب الأسئلة الشائعة */}
        <button
          onClick={() => setActiveTab('faq')}
          className={`group text-start p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 ${
            activeTab === 'faq'
              ? "border-brand-orange bg-brand-orange/5 shadow-lg shadow-brand-orange/10"
              : "border-transparent bg-white dark:bg-brand-dark-card hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md"
          }`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
            activeTab === 'faq' 
              ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20" 
              : "bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white"
          }`}>
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              {t("help.faq_page")}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {t("help.faq_page_desc")}
            </p>
          </div>
        </button>
      </div>

      {/* منطقة المحتوى المتغيرة */}
      <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-200 dark:border-brand-dark-border/60 p-6 min-h-[400px]">
        
        {/* محتوى الدليل */}
        {activeTab === 'guide' && <GuideContent isAr={isRTL} />}

        {/* محتوى نموذج الدعم الفني */}
        {activeTab === 'contact' && (
          <div className="max-w-3xl mx-auto animate-[fade-in_0.3s_ease-out]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-orange" />
              {isRTL ? "إرسال رسالة للدعم الفني" : "Send a message to Support"}
            </h2>
            
            {formSent ? (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl flex items-center gap-3 mb-6">
                <Check className="w-6 h-6" />
                <span className="font-semibold">
                  {isRTL ? "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً." : "Your message has been sent! We will contact you shortly."}
                </span>
              </div>
            ) : null}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? "الاسم الكامل" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-brand-dark-hover border border-transparent focus:border-brand-orange/50 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white"
                    placeholder={isRTL ? "محمد أحمد" : "John Doe"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {isRTL ? "البريد الإلكتروني" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-brand-dark-hover border border-transparent focus:border-brand-orange/50 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {isRTL ? "الموضوع" : "Subject"}
                </label>
                <select
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-brand-dark-hover border border-transparent focus:border-brand-orange/50 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white"
                >
                  <option value="">{isRTL ? "-- اختر الموضوع --" : "-- Select Subject --"}</option>
                  <option value="technical">{isRTL ? "مشكلة تقنية" : "Technical Issue"}</option>
                  <option value="billing">{isRTL ? "مشكلة في الخدمات" : "Services Issue"}</option>
                  <option value="account">{isRTL ? "مشكلة في الحساب" : "Account Issue"}</option>
                  <option value="suggestion">{isRTL ? "اقتراح" : "Suggestion"}</option>
                  <option value="other">{isRTL ? "أخرى" : "Other"}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {isRTL ? "الرسالة" : "Message"}
                </label>
                <textarea
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-brand-dark-hover border border-transparent focus:border-brand-orange/50 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white resize-none"
                  placeholder={isRTL ? "اكتب تفاصيل مشكلتك هنا..." : "Describe your issue here..."}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange-dark transition-colors shadow-lg shadow-brand-orange/30 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isRTL ? "إرسال الرسالة" : "Send Message"}
              </button>
            </form>
          </div>
        )}

        {/* محتوى الأسئلة الشائعة */}
        {activeTab === 'faq' && (
          <div className="max-w-4xl mx-auto animate-[fade-in_0.3s_ease-out]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-orange" />
              {t("help.faq_title")}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group border border-gray-100 dark:border-brand-dark-border rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer bg-white dark:bg-brand-dark-card hover:bg-gray-50 dark:hover:bg-brand-dark-hover transition-colors text-sm font-semibold text-gray-900 dark:text-white select-none">
                    <span>{isRTL ? item.q_ar : item.q_en}</span>
                    <span className="text-brand-orange text-xl font-light group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="px-4 pb-4 pt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-brand-dark-card">
                    {isRTL ? item.a_ar : item.a_en}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Help;