import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { SiteContext } from '../../SiteContext';
import { resolveUploadUrl } from '../../api';

const DashboardFooter = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const { siteSettings } = useContext(SiteContext);

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-[#3a322c]/30 bg-white dark:bg-[#1a1613]/30 backdrop-blur-sm transition-colors duration-300">
      <div className="px-6 py-5">
        <div className="max-w-6xl mx-auto">
          {/* روابط سريعة */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-5">
            {[
              { to: '/dashboard', label: currentLang === 'ar' ? 'الرئيسية' : 'Home' },
              { to: '/dashboard/help', label: currentLang === 'ar' ? 'مركز المساعدة' : 'Help Center' },
              { to: '/dashboard/contact-us', label: currentLang === 'ar' ? 'تواصل معنا' : 'Contact Us' },
              { to: '/dashboard/terms', label: currentLang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions' },
              { to: '/dashboard/privacy', label: currentLang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy' },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="text-[11px] text-gray-500 dark:text-gray-500 hover:text-brand-orange transition-colors duration-200">
                {link.label}
              </Link>
            ))}
          </div>

          {/* فاصل */}
          <div className="border-t border-gray-200 dark:border-[#3a322c]/30 pt-4 mb-4" />

          {/* معلومات التواصل */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-5 text-gray-500 dark:text-gray-500">
            {siteSettings?.phone && (
              <a href={`tel:${siteSettings.phone}`} className="flex items-center gap-1.5 text-[11px] hover:text-brand-orange transition-colors" dir="ltr">
                <Phone className="w-3 h-3" />{siteSettings.phone}
              </a>
            )}
            {siteSettings?.email && (
              <a href={`mailto:${siteSettings.email}`} className="flex items-center gap-1.5 text-[11px] hover:text-brand-orange transition-colors" dir="ltr">
                <Mail className="w-3 h-3" />{siteSettings.email}
              </a>
            )}
            {siteSettings?.address_ar && (
              <span className="flex items-center gap-1.5 text-[11px]">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {currentLang === 'ar' ? siteSettings.address_ar : (siteSettings.address_en || siteSettings.address_ar)}
              </span>
            )}
          </div>

          {/* فاصل + حقوق */}
          <div className="border-t border-gray-200 dark:border-[#3a322c]/30 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {siteSettings?.site_logo ? (
                <img src={resolveUploadUrl(siteSettings.site_logo)} alt="Logo" className="h-5 w-auto max-w-[20px] object-contain rounded opacity-40" />
              ) : (
                <div className="w-5 h-5 bg-brand-orange/20 dark:bg-brand-orange/30 rounded flex items-center justify-center">
                  <GraduationCap className="w-3 h-3 text-brand-orange/50" />
                </div>
              )}
              <span className="text-[11px] text-gray-400 dark:text-gray-600 transition-colors duration-300">
                {currentLang === 'ar'
                  ? `© ${new Date().getFullYear()} ${siteSettings?.site_name_ar || 'المنصة'}. جميع الحقوق محفوظة.`
                  : `© ${new Date().getFullYear()} ${siteSettings?.site_name_en || 'Platform'}. All rights reserved.`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-600">
              <ShieldCheck className="w-3 h-3 text-brand-orange/50" />
              <span>{currentLang === 'ar' ? 'محمي بتشفير SSL' : 'Secured by SSL'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;