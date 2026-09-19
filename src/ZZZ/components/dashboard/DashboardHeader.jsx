import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Menu, ChevronDown, Search,
  User, LogOut, Languages, Sun, Moon, Settings,
  LayoutDashboard, ListChecks, MessageSquare, HelpCircle, BookOpen, FileText, ShieldCheck, Building2, Users,
} from 'lucide-react';
import { useSite } from '../../SiteContext';

// =========================================================
// هيدر لوحات التحكم (التصميم المرجعي الجديد): شريط أبيض بجانب السايدبار
// يحمل حقل بحث سريع (يبحث في صفحات الداشبورد ويتنقّل إليها)، وتبديل اللغة
// والوضع، وجرس الإشعارات بنقطة حمراء، وقائمة المستخدم. اللوجو انتقل إلى
// أعلى السايدبار كما في المرجع.
// =========================================================

// ✅ صفحات البحث السريع — روابط عامة متاحة لأغلب الأدوار؛ ما لا يخص الدور
// يعيد توجيهه RoleRoute إلى /dashboard تلقائيًا
const QUICK_PAGES = [
  { to: '/dashboard', icon: LayoutDashboard, ar: 'لوحة التحكم', en: 'Dashboard' },
  { to: '/dashboard/tasks', icon: ListChecks, ar: 'المهام', en: 'Tasks' },
  { to: '/dashboard/services', icon: BookOpen, ar: 'الخدمات', en: 'Services' },
  { to: '/dashboard/researches', icon: FileText, ar: 'الأبحاث', en: 'Researches' },
  { to: '/dashboard/reviews', icon: ShieldCheck, ar: 'التحكيم', en: 'Reviews' },
  { to: '/dashboard/collaborations', icon: Users, ar: 'التعاون البحثي', en: 'Collaborations' },
  { to: '/dashboard/university-profile', icon: Building2, ar: 'ملف الجامعة', en: 'University profile' },
  { to: '/dashboard/messages', icon: MessageSquare, ar: 'الرسائل', en: 'Messages' },
  { to: '/dashboard/account', icon: User, ar: 'الحساب', en: 'Account' },
  { to: '/dashboard/settings', icon: Settings, ar: 'الإعدادات', en: 'Settings' },
  { to: '/dashboard/help', icon: HelpCircle, ar: 'المساعدة', en: 'Help' },
];

const DashboardHeader = ({ onMenuToggle, onLogout }) => {
  const { t, i18n } = useTranslation();
  const { user: userData, currentLang, isRTL, theme, toggleTheme } = useSite();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const firstItemRef = useRef(null);

  const isAr = currentLang === 'ar';

  useEffect(() => {
    if (!showUserMenu && !searchOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') { setShowUserMenu(false); setSearchOpen(false); }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    const timer = setTimeout(() => { if (showUserMenu) firstItemRef.current?.focus(); }, 60);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      clearTimeout(timer);
    };
  }, [showUserMenu, searchOpen]);

  const userInitial = userData?.name?.charAt(0)?.toUpperCase() || 'U';
  const roleName = isAr
    ? (userData?.role_name_ar || t(`account.role_${userData?.role || 'default'}`))
    : (userData?.role_name_en || t(`account.role_${userData?.role || 'default'}`));

  const handleToggleLang = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    document.documentElement.style.fontFamily = newLang === 'ar' ? 'var(--font-ar)' : 'var(--font-en)';
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return QUICK_PAGES.filter((p) => p.ar.includes(q) || p.en.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const goTo = (to) => {
    setQuery('');
    setSearchOpen(false);
    navigate(to);
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-xl border-b border-gray-100 dark:border-brand-dark-border/60 flex items-center justify-between gap-4 px-4 lg:px-8 transition-colors duration-300">

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuToggle}
          aria-label={t('admin_menu.sidebar')}
          className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-brand-dark-hover rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* بحث سريع في صفحات الداشبورد */}
        <div className="relative flex-1 max-w-md" ref={searchRef}>
          <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) goTo(results[0].to); }}
            placeholder={isAr ? 'بحث…' : 'Search…'}
            aria-label={isAr ? 'بحث سريع' : 'Quick search'}
            className="w-full h-11 ps-12 pe-4 rounded-full bg-gray-50 dark:bg-brand-dark-card border border-transparent focus:border-brand-orange/40 focus:bg-white dark:focus:bg-brand-dark-hover text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none transition-colors"
          />
          <AnimatePresence>
            {searchOpen && results.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 inset-x-0 bg-white dark:bg-brand-dark-card border border-gray-100 dark:border-brand-dark-border rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-black/40 overflow-hidden z-50"
              >
                {results.map((r) => (
                  <li key={r.to}>
                    <button
                      type="button"
                      onClick={() => goTo(r.to)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-brand-orange/10 hover:text-brand-orange transition-colors text-start"
                    >
                      <r.icon className="w-4 h-4 text-gray-400" />
                      {isAr ? r.ar : r.en}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button
          onClick={handleToggleLang}
          className="flex items-center gap-1.5 p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-brand-dark-hover rounded-full transition-colors"
          aria-label="Toggle Language"
        >
          <Languages className="w-5 h-5" />
          <span className="hidden sm:inline text-[10px] font-black tracking-wide">{isAr ? 'EN' : 'عربي'}</span>
        </button>

        <button
          onClick={() => toggleTheme?.()}
          className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-brand-dark-hover rounded-full transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <Link
          to="/dashboard/messages"
          aria-label={t('admin_menu.messages')}
          className="relative w-11 h-11 rounded-full bg-gray-50 dark:bg-brand-dark-card flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-dark-hover transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 end-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-brand-dark" />
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            aria-expanded={showUserMenu}
            aria-haspopup="true"
            className={`flex items-center gap-2.5 p-1.5 pe-2.5 rounded-2xl transition-all duration-200 ${showUserMenu ? 'bg-gray-100 dark:bg-brand-dark-hover' : 'hover:bg-gray-100 dark:hover:bg-brand-dark-hover/60'}`}
          >
            <span className="w-9 h-9 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-black">
              {userInitial}
            </span>
            <span className="hidden sm:block text-start">
              <span className="block text-gray-900 dark:text-white text-xs font-bold leading-tight max-w-[140px] truncate">{userData?.name || 'User'}</span>
              <span className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-orange" />
                <span className="text-[10px] text-brand-orange font-semibold leading-tight">{roleName}</span>
              </span>
            </span>
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
                className={`absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-2.5 w-72 bg-white dark:bg-brand-dark-card border border-gray-100 dark:border-[#4a4038] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-2xl dark:shadow-black/40 overflow-hidden z-50 transition-colors duration-300`}
              >
                <div className="p-4 border-b border-gray-100 dark:border-brand-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-brand-orange text-white rounded-full flex items-center justify-center text-base font-black">{userInitial}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white text-sm font-bold truncate">{userData?.name || 'User'}</p>
                      <p className="text-brand-orange text-[11px] font-semibold truncate">{roleName}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs truncate" dir="ltr">{userData?.email || ''}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Link ref={firstItemRef} to="/dashboard/account" role="menuitem" tabIndex={0} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-dark-hover hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-orange">
                    <User className="w-4 h-4 text-brand-orange" />
                    {t('account.title')}
                  </Link>
                  <Link to="/dashboard/settings" role="menuitem" tabIndex={-1} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brand-dark-hover hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-orange">
                    <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    {t('settings.title')}
                  </Link>
                </div>

                <div className="border-t border-gray-100 dark:border-brand-dark-border p-2">
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
