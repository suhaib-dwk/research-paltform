import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, ShieldCheck, LogOut, Globe } from 'lucide-react';
import { SiteContext } from '../../SiteContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentLang = i18n.language;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { siteInfo, navLinks, siteSettings } = useContext(SiteContext);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAdmin(false);
    window.location.href = '/';
  };

  const siteName = siteSettings[`site_name_${currentLang}`] || 'IR SOURCE';
  const siteTagline = siteSettings[`site_tagline_${currentLang}`] || 'Research Platform';
  const siteLogo = siteSettings.site_logo || '';

  const mainLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/help', label: t('nav.help') },
    { path: '/contact-us', label: t('nav.contact_us') },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? 'bg-[#0a1628]/[0.97] backdrop-blur-xl shadow-lg shadow-[#c8a44e]/10 border-[#c8a44e]/20'
          : 'bg-[#0a1628] border-[#c8a44e]/10'
      }`}
    >
      {/* شريط ذهبي علوي رفيع */}
      <div className="h-[2px] bg-gradient-to-l from-[#c8a44e] via-[#e6c96e] to-[#c8a44e]" />

      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* اللوجو */}
        <Link to="/" className="flex items-center gap-3.5 group">
          {siteLogo ? (
            <img
              src={siteLogo}
              alt={siteName}
              className="w-14 h-14 object-contain rounded-xl brightness-0 invert"
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-[#c8a44e] to-[#e6c96e] rounded-xl flex items-center justify-center text-[#0a1628] text-sm font-black tracking-tight shadow-lg shadow-[#c8a44e]/25 group-hover:shadow-[#c8a44e]/40 transition-shadow duration-300">
                IR
              </div>
              <span className="text-xl font-black tracking-wide hidden sm:block text-white">
                SOURCE
              </span>
            </div>
          )}
          {siteLogo && (
            <div className="hidden sm:block">
              <span className="text-lg font-bold block leading-tight text-white">{siteName}</span>
              <span className="text-[11px] font-medium leading-tight text-[#c8a44e]/80">{siteTagline}</span>
            </div>
          )}
        </Link>

        {/* التنقل - ديسكتوب */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-4 py-2.5 text-[13px] font-medium text-[#8a9bbd] hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}

          {navLinks.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="flex items-center gap-1 px-4 py-2.5 text-[13px] font-medium text-[#8a9bbd] hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
              >
                {t('nav.more')}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMoreMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isMoreMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMoreMenuOpen(false)} />
                  <div className="absolute top-full mt-2 start-0 w-52 bg-[#0d1a30] rounded-xl shadow-2xl shadow-black/40 border border-[#c8a44e]/15 py-1.5 z-20">
                    {navLinks.map((link, index) => (
                      <Link
                        key={link.id || index}
                        to={`/page/${link.slug}`}
                        onClick={() => setIsMoreMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-[#8a9bbd] hover:bg-[#c8a44e]/10 hover:text-[#c8a44e] transition-colors"
                      >
                        {currentLang === 'ar' ? link.title_ar : link.title_en}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </nav>

        {/* أزرار - ديسكتوب */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium text-[#8a9bbd] hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
          >
            <Globe className="w-3.5 h-3.5" />
            {t('btn.switchLang')}
          </button>

          <div className="w-px h-5 mx-0.5 bg-[#c8a44e]/20" />

          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className="flex items-center gap-1.5 bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-4 py-2.5 text-[13px] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all duration-300"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                لوحة التحكم
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium text-[#8a9bbd]/60 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                خروج
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2.5 text-[13px] font-medium text-white/80 border border-[#c8a44e]/25 rounded-lg hover:bg-white/[0.06] hover:border-[#c8a44e]/40 transition-all duration-200"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-5 py-2.5 text-[13px] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all duration-300"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>

        {/* زر القائمة - موبايل */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-lg text-white hover:bg-white/[0.06] transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* قائمة الموبايل */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#c8a44e]/15 bg-[#0a1628]">
          <div className="container mx-auto px-6 py-6 space-y-5">
            {/* لوجو موبايل */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#c8a44e]/15">
              {siteLogo ? (
                <img
                  src={siteLogo}
                  alt={siteName}
                  className="w-12 h-12 object-contain rounded-xl brightness-0 invert"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-[#c8a44e] to-[#e6c96e] rounded-xl flex items-center justify-center text-[#0a1628] text-xs font-black">
                  IR
                </div>
              )}
              <div>
                <span className="text-base font-bold text-white block leading-tight">{siteName}</span>
                <span className="text-[10px] font-medium leading-tight text-[#c8a44e]/70">{siteTagline}</span>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {mainLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className="py-3 px-3 rounded-lg text-[15px] font-medium text-[#8a9bbd] hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {navLinks.length > 0 && (
              <div className="pt-3 border-t border-[#c8a44e]/10">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a9bbd]/40 mb-2 px-3">
                  {t('nav.discover')}
                </p>
                <nav className="flex flex-col gap-0.5">
                  {navLinks.map((link, index) => (
                    <Link
                      key={link.id || index}
                      to={`/page/${link.slug}`}
                      onClick={closeMobileMenu}
                      className="py-2.5 px-3 rounded-lg text-sm text-[#8a9bbd]/60 hover:bg-white/[0.06] hover:text-white/90 transition-colors"
                    >
                      {currentLang === 'ar' ? link.title_ar : link.title_en}
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-4 border-t border-[#c8a44e]/10">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-4 py-3 text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" /> لوحة التحكم
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 border border-[#c8a44e]/20 text-[#8a9bbd]/70 px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/[0.06] transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="text-center border border-[#c8a44e]/20 text-white/80 px-4 py-3 text-sm font-medium rounded-xl hover:bg-white/[0.06] transition-colors"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="text-center bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-4 py-3 text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all"
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
              <button
                onClick={() => { toggleLanguage(); closeMobileMenu(); }}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[#8a9bbd]/60 bg-white/[0.04] rounded-xl hover:bg-white/[0.08] transition-colors"
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