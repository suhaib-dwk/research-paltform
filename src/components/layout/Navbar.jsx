// src\components\layout\Navbar.jsx
import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ShieldCheck, LogOut, Globe } from 'lucide-react';
import { SiteContext } from '../../SiteContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  // ✅ مقارنة بادئة اللغة لا تطابقًا حرفيًا — كاشف اللغة (LanguageDetector) قد
  // يُرجع كودًا كاملاً مثل "ar-IQ" بدل "ar" فقط، فتفشل المقارنة الصارمة القديمة.
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false;
  const currentLang = i18n.language;
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { siteInfo, siteSettings } = useContext(SiteContext);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setIsAdmin(user.role === 'super_admin');
      } catch { setIsAdmin(false); }
    };
    checkAdminStatus();
    window.addEventListener('storage', checkAdminStatus);
    window.addEventListener('authChange', checkAdminStatus);
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
      window.removeEventListener('authChange', checkAdminStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAdmin(false);
    window.location.href = '/';
  };

  const siteName = siteSettings[`site_name_${currentLang}`] || 'IR SOURCE';
  // تم تحديد مسار اللوجو الثابت مباشرة
  const staticLogoUrl = '/logo/logo1.png'; 

  const mainLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about-us', label: t('nav.about_us') },
    { path: '/target-audience', label: t('nav.target_audience') },
    { path: '/help', label: t('nav.help') },
    { path: '/contact-us', label: t('nav.contact_us') },
  ];

  return (
    // تم التعديل هنا: إضافة sticky top-0 z-50 لتثبيت القائمة
    // ✅ الهيدر على كامل عرض الشاشة الآن — لا max-w-7xl/mx-auto يحصر الشريط
    // بعرض جزئي، ولا py/px خارجي يترك هامشاً حول حافته، ولا rounded-full
    // (زوايا قائمة الآن) — بطلب صريح.
    <header className="sticky top-0 z-50 w-full bg-white transition-all duration-300">
      <div className="w-full bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        {/* اللوجو */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <img
            src={staticLogoUrl}
            alt={siteName}
            className="h-32 w-auto object-contain -my-12"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
          {/* البديل */}
          <div style={{ display: 'none' }} className="flex items-center gap-2.5">
             <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white text-xs font-black shadow-sm group-hover:shadow-md transition-shadow">
              IR
            </div>
            <span className="text-lg font-black tracking-wide hidden sm:block text-brand-ink">
              SOURCE
            </span>
          </div>
        </Link>

        {/* التنقل - ديسكتوب */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-brand-orange font-bold underline underline-offset-4'
                    : 'text-brand-muted font-medium hover:text-brand-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ✅ أزرار - ديسكتوب — زر "إنشاء حساب" محذوف بطلب صريح (يبقى "تسجيل
            الدخول" فقط)، وزر اللغة انتقل ليصير بعد أزرار الدخول/لوحة التحكم
            بدل قبلها. */}
        <div className="hidden lg:flex items-center gap-2.5">
          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className="flex items-center gap-1.5 bg-brand-orange text-white px-4 py-2 text-sm font-semibold rounded-full hover:bg-brand-orange-dark transition-all duration-300"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                لوحة التحكم
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-muted/70 hover:text-brand-ink rounded-full transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                خروج
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium text-brand-ink bg-white border border-brand-ink/15 rounded-full hover:border-brand-ink/30 transition-all duration-200"
            >
              {t('nav.login')}
            </Link>
          )}

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-muted hover:text-brand-ink rounded-full transition-all duration-200"
          >
            <Globe className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* زر القائمة - موبايل */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-full text-brand-ink hover:bg-brand-ink/5 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* قائمة الموبايل */}
      {isMobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 rounded-3xl bg-white shadow-sm border border-gray-100 z-40 relative">
          <div className="px-6 py-6 space-y-5">
            {/* لوجو موبايل */}
            <div className="flex items-center gap-3 pb-4 border-b border-brand-ink/10">
              <img
                src={staticLogoUrl}
                alt={siteName}
                className="h-28 w-auto object-contain -my-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              {/* البديل للموبايل */}
              <div style={{ display: 'none' }} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white text-xs font-black">
                  IR
                </div>
                <span className="text-base font-black text-brand-ink">SOURCE</span>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {mainLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={`py-3 px-3 rounded-lg text-[15px] transition-colors ${
                      isActive
                        ? 'text-brand-orange font-bold'
                        : 'text-brand-muted font-medium hover:bg-white/60 hover:text-brand-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2.5 pt-4 border-t border-brand-ink/10">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 bg-brand-orange text-white px-4 py-3 text-sm font-semibold rounded-xl hover:bg-brand-orange-dark transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" /> لوحة التحكم
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 border border-brand-ink/15 text-brand-muted px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/60 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> تسجيل الخروج
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="text-center border border-brand-ink/15 text-brand-ink bg-white px-4 py-3 text-sm font-medium rounded-xl hover:border-brand-ink/30 transition-colors"
                >
                  {t('nav.login')}
                </Link>
              )}
              <button
                onClick={() => { toggleLanguage(); closeMobileMenu(); }}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-brand-muted bg-white/60 rounded-xl hover:bg-white transition-colors"
              >
                <Globe className="w-4 h-4" /> {t('btn.switchLang')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
