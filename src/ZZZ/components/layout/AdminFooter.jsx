import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Settings, Image, FileText, Mail, Phone } from 'lucide-react';
import { SiteContext } from '../../SiteContext';

const AdminFooter = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const { siteInfo, siteSettings } = useContext(SiteContext);

  const systemLinks = [
    { path: '/admin', icon: Settings, label_ar: 'الإعدادات العامة', label_en: 'General Settings' },
    { path: '/admin/slides', icon: Image, label_ar: 'إدارة البانر', label_en: 'Manage Slides' },
    { path: '/admin/account', icon: ShieldCheck, label_ar: 'إعدادات الحساب', label_en: 'Account Settings' },
  ];

  const legalLinks = [
    { path: '/page/publishing-terms', label_ar: 'شروط النشر', label_en: 'Publishing Terms' },
    { path: '/terms', label_ar: 'الشروط والأحكام', label_en: 'Terms & Conditions' },
    { path: '/policy', label_ar: 'سياسة الخصوصية', label_en: 'Privacy Policy' },
  ];

  return (
    // ✅ تمت إضافة lg:ms-72 لمطابقة إزاحة الـ Sidebar تماماً
    <footer className="bg-slate-950 text-slate-400 pt-12 pb-6 border-t border-slate-800 lg:ms-72">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          
          {/* روابط النظام */}
          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-400" />
              {currentLang === 'ar' ? 'إعدادات النظام' : 'System Settings'}
            </h4>
            <ul className="space-y-3">
              {systemLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="flex items-center gap-2 hover:text-blue-400 transition-colors text-sm">
                    <link.icon className="w-4 h-4" /> {currentLang === 'ar' ? link.label_ar : link.label_en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* روابط قانونية */}
          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              {currentLang === 'ar' ? 'قانوني' : 'Legal'}
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="hover:text-white transition-colors text-sm">
                    {currentLang === 'ar' ? link.label_ar : link.label_en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* بيانات التواصل */}
          <div>
            <h4 className="text-white font-bold mb-4">{currentLang === 'ar' ? 'تواصل معنا' : 'Contact Us'}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="truncate" dir="ltr">{siteInfo?.email || '...'}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span dir="ltr">{siteInfo?.phone || '...'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} {siteSettings?.[`site_name_${currentLang}`] || 'RIS'}. {currentLang === 'ar' ? 'لوحة تحكم النظام' : 'System Dashboard'}.</p>
          <p className="text-slate-600">{currentLang === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}</p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;