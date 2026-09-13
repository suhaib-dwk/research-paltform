import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from './locales/ar.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

// تحديث اتجاه الصفحة ولغتها عند التبديل (مهم لتطبيق الخطوط بشكل صحيح)
// ✅ مقارنة بادئة اللغة لا تطابقًا حرفيًا — كاشف اللغة (LanguageDetector) قد يُرجع
// كودًا كاملاً مثل "ar-IQ" بدل "ar" فقط، فتفشل المقارنة الصارمة (=== 'ar') وتبقى
// الصفحة LTR رغم أن i18next يعرض بالفعل نصوصًا عربية (fallback داخلي على "ar").
i18n.on('languageChanged', (lng) => {
  const isArabic = lng?.toLowerCase().startsWith('ar');
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  document.documentElement.lang = isArabic ? 'ar' : 'en';
});

export default i18n;