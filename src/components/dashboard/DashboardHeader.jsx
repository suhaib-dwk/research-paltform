import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Bell, Menu, ChevronDown,
  User, LogOut, Languages, Sun, Moon, Settings
} from 'lucide-react';
import { useSite } from '../../SiteContext';

// اللوجو الثابت نفسه المستخدم بالـ Navbar/Footer بالصفحة الرئيسية (بدل site_logo الديناميكي)
const staticLogoUrl = '/logo/logo1.png';

const DashboardHeader = ({ onMenuToggle, onLogout }) => {
  const { t, i18n } = useTranslation();
  const { user: userData, currentLang, isRTL, siteSettings, theme, toggleTheme } = useSite();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const firstItemRef = useRef(null);

  useEffect(() => {
    if (!showUserMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    const timer = setTimeout(() => firstItemRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      clearTimeout(timer);
    };
  }, [showUserMenu]);

  const siteName = currentLang === 'ar' ? (siteSettings?.site_name_ar || 'المنصة') : (siteSettings?.site_name_en || 'Platform');
  const userInitial = userData?.name?.charAt(0)?.toUpperCase() || 'U';
  const roleName = currentLang === 'ar'
  ? (userData?.role_name_ar || t(`account.role_${userData?.role || 'default'}`))
  : (userData?.role_name_en || t(`account.role_${userData?.role || 'default'}`));

  const handleToggleLang = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    document.documentElement.style.fontFamily = newLang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-20 bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-xl border-b border-gray-200 dark:border-[#3a322c]/60 flex items-center justify-between px-4 lg:px-6 transition-colors duration-300">

      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          aria-label={t('admin_menu.sidebar')}
          className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-[#2a231e] rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-3 group">
          <img
            src={staticLogoUrl}
            alt={siteName}
            className="h-28 w-auto -my-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
          {/* البديل (يظهر عند فشل تحميل الصورة) */}
          <div style={{ display: 'none' }} className="items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-[#e8623a] to-[#f0916d] rounded-lg flex items-center justify-center shadow-md shadow-[#e8623a]/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block text-gray-900 dark:text-white font-bold text-sm group-hover:text-[#e8623a] transition-colors">
              {siteName}
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">

        <button
          onClick={handleToggleLang}
          className="flex items-center gap-1.5 p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2a231e] rounded-xl transition-colors"
          aria-label="Toggle Language"
        >
          <Languages className="w-5 h-5" />
          <span className="hidden sm:inline text-[10px] font-black tracking-wide">{currentLang === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        <button
          onClick={() => toggleTheme?.()}
          className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2a231e] rounded-xl transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <button
          aria-label={t('admin_menu.messages')}
          className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2a231e] rounded-xl transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 end-2 w-2 h-2 bg-[#e8623a] rounded-full ring-2 ring-white dark:ring-[#1a1613]" />
        </button>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#3a322c] hidden sm:block" />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            aria-expanded={showUserMenu}
            aria-haspopup="true"
            className={`flex items-center gap-2.5 p-1.5 pe-2.5 rounded-2xl transition-all duration-200 ${showUserMenu ? 'bg-gray-100 dark:bg-[#2a231e] shadow-xl shadow-black/10 dark:shadow-black/30' : 'hover:bg-gray-100 dark:hover:bg-[#2a231e]/50'}`}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-[#e8623a] to-[#f0916d] text-white rounded-xl flex items-center justify-center text-sm font-black shadow-sm">
              {userInitial}
            </div>
            <div className="hidden sm:block text-start">
              <p className="text-gray-900 dark:text-white text-xs font-bold leading-tight max-w-[130px] truncate">{userData?.name || 'User'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e8623a]" />
                <p className="text-[10px] text-[#e8623a] font-semibold leading-tight">{roleName}</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 hidden sm:block transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-2.5 w-72 bg-white dark:bg-[#211c18] border border-gray-200 dark:border-[#4a4038] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-2xl dark:shadow-black/40 overflow-hidden z-50 transition-colors duration-300`}
              >
                <div className="p-4 border-b border-gray-100 dark:border-[#3a322c]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-[#e8623a] to-[#f0916d] text-white rounded-xl flex items-center justify-center text-base font-black">{userInitial}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white text-sm font-bold truncate">{userData?.name || 'User'}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs truncate" dir="ltr">{userData?.email || ''}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Link ref={firstItemRef} to="/dashboard/account" role="menuitem" tabIndex={0} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a231e] hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#e8623a]">
                    <User className="w-4 h-4 text-[#e8623a]" />
                    {t('account.title')}
                  </Link>
                  <Link to="/dashboard/settings" role="menuitem" tabIndex={-1} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a231e] hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#e8623a]">
                    <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    {t('settings.title')}
                  </Link>
                </div>

                <div className="border-t border-gray-100 dark:border-[#3a322c] p-2">
                  <button role="menuitem" tabIndex={-1} onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                    <LogOut className="w-4 h-4" />
                    {t('admin_menu.logout')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;