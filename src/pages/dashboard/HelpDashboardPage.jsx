import { useTranslation } from 'react-i18next';
import { HelpCircle, MessageCircle, BookOpen, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqItems = [
  { q_en: 'How to submit a research?', q_ar: 'كيف أقدم بحثاً؟', a_en: 'Go to Researches > New Research and fill the form.', a_ar: 'اذهب إلى الأبحاث > بحث جديد واملأ النموذج.' },
  { q_en: 'How to reset my password?', q_ar: 'كيف أعيد تعيين كلمة المرور؟', a_en: 'Click "Forgot Password" on the login page.', a_ar: 'اضغط "نسيت كلمة المرور" في صفحة تسجيل الدخول.' },
  { q_en: 'How to contact support?', q_ar: 'كيف أتواصل مع الدعم؟', a_en: 'Use the contact page or send a message from the dashboard.', a_ar: 'استخدم صفحة اتصل بنا أو أرسل رسالة من لوحة التحكم.' },
];

const HelpDashboardPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false; // مقارنة بادئة اللغة (يدعم ar-IQ ونحوها)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#e8623a]" />
          {t('help.title')}
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('help.desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/60 p-5 flex items-start gap-4 hover:border-[#e8623a]/40 dark:hover:border-[#e8623a]/30 hover:shadow-lg hover:shadow-[#e8623a]/5 transition-all duration-200">
          <div className="w-11 h-11 bg-gradient-to-br from-[#e8623a] to-[#f0916d] rounded-xl flex items-center justify-center shadow-md shadow-[#e8623a]/20 flex-shrink-0"><BookOpen className="w-5 h-5 text-white" /></div>
          <div><h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('help.guide')}</h3><p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('help.guide_desc')}</p></div>
        </div>
        <Link to="/contact-us" className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/60 p-5 flex items-start gap-4 hover:border-[#e8623a]/40 dark:hover:border-[#e8623a]/30 hover:shadow-lg hover:shadow-[#e8623a]/5 transition-all duration-200">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0"><MessageCircle className="w-5 h-5" /></div>
          <div><h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('help.contact')}</h3><p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('help.contact_desc')}</p></div>
        </Link>
        <Link to="/help" className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/60 p-5 flex items-start gap-4 hover:border-[#e8623a]/40 dark:hover:border-[#e8623a]/30 hover:shadow-lg hover:shadow-[#e8623a]/5 transition-all duration-200">
          <div className="w-11 h-11 rounded-xl bg-[#e8623a]/10 text-[#e8623a] flex items-center justify-center flex-shrink-0"><ExternalLink className="w-5 h-5" /></div>
          <div><h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('help.faq_page')}</h3><p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('help.faq_page_desc')}</p></div>
        </Link>
      </div>

      <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/60 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{t('help.faq_title')}</h2>
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <details key={i} className="group border border-gray-100 dark:border-[#3a322c] rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer bg-white dark:bg-[#211c18] hover:bg-gray-50 dark:hover:bg-[#2a231e] transition-colors text-sm font-semibold text-gray-900 dark:text-white">
                {isRTL ? item.q_ar : item.q_en}
                <span className="text-[#e8623a] text-lg group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-[#211c18]">{isRTL ? item.a_ar : item.a_en}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpDashboardPage;