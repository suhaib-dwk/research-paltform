import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, Globe, Menu, X, UserCog, KeyRound, 
  LogOut, ChevronDown, Settings 
} from 'lucide-react';
import { SiteContext } from '../../../SiteContext';

const AdminNavbar = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false; // مقارنة بادئة اللغة (يدعم ar-IQ ونحوها)
  const currentLang = i18n.language;
  const navigate = useNavigate();
  const { siteSettings } = useContext(SiteContext);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserData({ name: user.name || 'مدير النظام', email: user.email || 'admin@site.com' });
  }, []);

  // إغلاق القائمة المنسدلة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const siteName = siteSettings?.[`site_name_${currentLang}`] || 'RIS';

  return (
    <header className="bg-slate-900 border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* اللوجو */}
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-bold text-white block leading-tight">{siteName}</span>
            <span className="text-[10px] text-slate-400 font-medium leading-tight">System Dashboard</span>
          </div>
        </Link>

        {/* أزرار الكمبيوتر */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <Globe className="w-4 h-4" /> {currentLang === 'ar' ? 'EN' : 'عربي'}
          </button>

          <div className="w-px h-6 bg-slate-700"></div>

          {/* قائمة الملف الشخصي المنسدلة */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userData.name.charAt(0)}
              </div>
              <div className="text-start hidden lg:block">
                <p className="text-sm font-semibold text-white leading-tight">{userData.name}</p>
                <p className="text-[11px] text-slate-400 leading-tight" dir="ltr">{userData.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-64 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl py-2 z-50`}>
                <div className="px-4 py-3 border-b border-slate-700 mb-2">
                  <p className="text-sm font-bold text-white">{userData.name}</p>
                  <p className="text-xs text-slate-400" dir="ltr">{userData.email}</p>
                </div>
                
                <Link to="/admin/account" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <UserCog className="w-4 h-4" /> {currentLang === 'ar' ? 'تحديث الحساب' : 'Update Account'}
                </Link>
                <Link to="/admin/password" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <KeyRound className="w-4 h-4" /> {currentLang === 'ar' ? 'تعديل كلمة المرور' : 'Change Password'}
                </Link>
                
                <div className="border-t border-slate-700 mt-2 pt-2">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors">
                    <LogOut className="w-4 h-4" /> {currentLang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* زر القائمة للهاتف */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-300 p-2 hover:bg-slate-800 rounded-lg">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* قائمة الهاتف المنسدلة */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {userData.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{userData.name}</p>
                <p className="text-[11px] text-slate-400" dir="ltr">{userData.email}</p>
              </div>
            </div>

            <Link to="/admin/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 rounded-lg">
              <UserCog className="w-5 h-5 text-blue-400" /> {currentLang === 'ar' ? 'تحديث الحساب' : 'Update Account'}
            </Link>
            <Link to="/admin/password" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 rounded-lg">
              <KeyRound className="w-5 h-5 text-amber-400" /> {currentLang === 'ar' ? 'تعديل كلمة المرور' : 'Change Password'}
            </Link>
            
            <div className="border-t border-slate-700 pt-3 flex gap-3">
              <button onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-slate-300 bg-slate-900 rounded-lg">
                <Globe className="w-4 h-4" /> {currentLang === 'ar' ? 'English' : 'عربي'}
              </button>
              <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-red-400 bg-red-900/20 rounded-lg">
                <LogOut className="w-4 h-4" /> خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;