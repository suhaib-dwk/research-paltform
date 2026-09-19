// src\components\layout\Footer.jsx
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { SiteContext } from '../../SiteContext';
// import { resolveUploadUrl } from '../../api'; // لم تعد بحاجة لهذا الاستيراد

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { siteInfo, siteSettings } = useContext(SiteContext);

  const siteName = siteSettings[`site_name_${currentLang}`] || t('footer.about_title');
  // تم تحديد مسار اللوجو الثابت مباشرة (مطابق للـ Navbar)
  // ✅ الفوتر بلون الموقع (البرتقالي) — نسخة الشعار البيضاء كما في البراند بوك على الخلفية البرتقالية
  const staticLogoUrl = '/logo/IR-Souce-logo-VO1-2.png';

  // ✅ سياسات المنصة — كل ما يندرج تحت الشروط والسياسات (صفحات /page/:slug
  // تُدار من لوحة الأدمن: جدول "محتوى الصفحات")
  const policyLinks = [
    { path: '/page/terms', label: t('footer.terms_conditions') },
    { path: '/page/privacy', label: t('footer.privacy_policy') },
    { path: '/page/usage-policy', label: t('footer.usage_policy') },
    { path: '/help', label: t('nav.help') },
  ];

  const socials = [
    { href: siteInfo.instagram_link, icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
    { href: siteInfo.facebook_link, icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.324-.593 1.324-1.324V1.325C24 .593 23.407 0 22.675 0z"/></svg> },
    { href: siteInfo.whatsapp_link, icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.98.579 3.826 1.577 5.376L2 22l4.751-1.548A9.953 9.953 0 0012.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.062a8.036 8.036 0 01-4.276-1.221l-.307-.183-3.166 1.031 1.045-3.083-.2-.317A8.024 8.024 0 013.94 12c0-4.44 3.616-8.062 8.061-8.062S20.06 7.56 20.06 12s-3.616 8.062-8.059 8.062z"/></svg> },
  ];

  return (
    <footer className="bg-brand-orange text-black pt-16 pb-8 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">
          {/* عن المنصة */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              {/* تم التعديل هنا لاستخدام اللوجو الثابت مع معالجة الخطأ */}
              <img
                src={staticLogoUrl}
                alt={siteName}
                className="h-40 w-auto object-contain -my-16"
                onError={(e) => {
                  // في حال فشل تحميل الصورة، يتم إخفاؤها وإظهار البديل
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              
              {/* البديل (يظهر عند فشل تحميل الصورة) */}
              <div style={{ display: 'none' }} className="flex items-center gap-3">
                <div className="w-14 h-14 bg-brand-orange rounded-xl flex items-center justify-center text-white text-sm font-black">
                  IR
                </div>
                <span className="text-xl font-black text-white tracking-wide">SOURCE</span>
              </div>
            </div>
            <p className="text-[15px] text-black leading-relaxed mb-8 max-w-sm">
              {t('footer.about_desc')}
            </p>

            {/* أيقونات التواصل */}
            <div className="flex gap-2.5">
              {socials.map((social, i) =>
                social.href ? (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-black/40 flex items-center justify-center text-black hover:bg-black hover:text-white hover:border-transparent transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* عمود سياسات المنصة */}
          <div className="md:col-span-3">
            <h4 className="text-white text-sm font-bold tracking-[0.15em] uppercase mb-6">
              {t('footer.policies_col')}
            </h4>
            <ul className="space-y-3">
              {policyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-base text-black hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* بيانات التواصل */}
          <div className="md:col-span-4">
            <h4 className="text-white text-sm font-bold tracking-[0.15em] uppercase mb-6">
              {t('footer.contact_us')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-black" />
                </div>
                <span dir="ltr" className="text-[15px] text-black">
                  {siteInfo.phone || '...'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-[15px] text-black break-all">
                  {siteInfo.email || '...'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-[15px] text-black leading-relaxed">
                  {currentLang === 'ar' ? siteInfo.address_ar : siteInfo.address_en || '...'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-black/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-black">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-sm text-black/80">
            {t('footer.powered_by')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
