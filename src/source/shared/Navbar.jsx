// src\components\layout\Navbar.jsx
import { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ShieldCheck, LogOut, Globe, ChevronDown, Landmark, Building2, GraduationCap, Users, Info, HelpCircle, Mail, LayoutGrid, Briefcase, UserCog, FileCheck, Sparkles, Languages, Award, BookMarked, MessageSquare, BarChart3 } from 'lucide-react';
import { SiteContext } from '../../SiteContext';
import { SERVICE_FAMILIES } from '../S02_Services/servicesCatalogue';

// أيقونة لكل عائلة خدمات في القائمة المنسدلة
const FAMILY_NAV_ICONS = {
  assessment: FileCheck, development: Sparkles, editing: Languages, review: Award,
  journal: BookMarked, revision: MessageSquare, post: BarChart3,
};

// =========================================================
// الهيدر العام — بعد إعادة بناء الصفحات الداخلية صارت القائمة:
//   الرئيسية · الفئة المستهدفة ▾ (الوزارة / الجامعات / الباحثون والطلبة)
//   · الخدمات ▾ (عائلات الخدمات السبع) · للموظفين ومقدّمي الخدمة ▾
//   (مقدّم خدمة / موظف المنصة) · عن المنصة ▾ (من نحن / مركز المساعدة /
//   للتواصل معنا) · [تسجيل الدخول]
// "من نحن" و"مركز المساعدة" و"للتواصل معنا" مدمجة في قائمة واحدة بطلب صريح.
// =========================================================

// ✅ التمرير إلى قسم داخل صفحة أخرى: الصفحات تنفّذ window.scrollTo(0,0) عند
// التحميل، فننتظر إطارًا بعد انتقال الراوتر ثم نمرّر إلى العنصر المستهدف.
const scrollToHash = (hash) => {
  if (!hash) return;
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  });
};

// ✅ قائمة منسدلة بسيطة (فتح بالمرور أو النقر، إغلاق بالنقر خارجها أو Esc)
const NavDropdown = ({ label, active, items, isRTL }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const enter = () => { clearTimeout(closeTimer.current); setOpen(true); };
  const leave = () => { closeTimer.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div className="relative" ref={ref} onMouseEnter={enter} onMouseLeave={leave}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`inline-flex items-center gap-1 px-4 py-2 text-sm rounded-full transition-all duration-200 ${
          active ? 'text-brand-orange font-bold' : 'text-brand-muted font-medium hover:text-brand-ink'
        }`}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {/* ✅ بأسلوب شريط التابات في السلايدر: عناصر بيضاء بلا أيقونات، وخط برتقالي على
          حافة العنصر عند المرور/التنشيط مع نص برتقالي (بطلب صريح) */}
      {open && (
        <div className={`absolute top-full ${isRTL ? 'right-0' : 'left-0'} mt-1 w-72 bg-white border border-gray-200 shadow-[0_24px_48px_-24px_rgba(31,26,23,0.35)] z-50 divide-y divide-gray-100`}>
          {items.map((item) => {
            const [path, hash] = item.to.split('#');
            const isCurrent = location.pathname === path && !hash;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  setOpen(false);
                  // نفس الصفحة: الراوتر لا يعيد التحميل، فنمرّر يدويًا
                  if (hash && location.pathname === path) scrollToHash(`#${hash}`);
                }}
                className={`block px-5 py-3.5 border-s-[3px] transition-colors group ${
                  isCurrent ? 'border-brand-orange bg-brand-orange/5' : 'border-transparent hover:border-brand-orange hover:bg-brand-orange/5'
                }`}
              >
                <span className={`block text-sm font-bold transition-colors ${isCurrent ? 'text-brand-orange' : 'text-brand-ink group-hover:text-brand-orange'}`}>{item.label}</span>
                {item.desc && <span className="block text-[11px] text-brand-muted leading-snug mt-0.5">{item.desc}</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { t, i18n } = useTranslation();
  // ✅ مقارنة بادئة اللغة لا تطابقًا حرفيًا — كاشف اللغة (LanguageDetector) قد
  // يُرجع كودًا كاملاً مثل "ar-IQ" بدل "ar" فقط، فتفشل المقارنة الصارمة القديمة.
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false;
  const isAr = isRTL;
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

  // ✅ الانتقال بين الصفحات مع hash (مثل /services#assessment): بعد أن يركّب
  // الراوتر الصفحة الجديدة نمرّر إلى القسم المطلوب.
  useEffect(() => {
    scrollToHash(location.hash);
  }, [location.pathname, location.hash]);

  const siteName = siteSettings[`site_name_${currentLang}`] || 'SOURCE';
  // تم تحديد مسار اللوجو الثابت مباشرة (الهيدر أبيض بالشعار الملوّن — أُعيد كما كان بطلب صريح)
  const staticLogoUrl = '/logo/logo1.png';
  const staticLogoLightUrl = '/logo/logo1.png';

  // ✅ الفئات الثلاث الرئيسية (نفس فئات التسجيل)
  const audienceItems = [
    { to: '/audience/ministry', icon: Landmark, label: isAr ? 'الوزارة' : 'Ministry', desc: isAr ? 'لوحات وطنية، أولويات، شراكات، وتمويل' : 'National dashboards, priorities, partnerships, funding' },
    { to: '/audience/university', icon: Building2, label: isAr ? 'الجامعات والمؤسسات' : 'Universities & institutions', desc: isAr ? 'الجودة والاعتماد والتصنيفات' : 'Quality, accreditation and rankings' },
    { to: '/audience/undergrad', icon: GraduationCap, label: isAr ? 'الباحثون والطلبة' : 'Researchers & students', desc: isAr ? 'من البكالوريوس إلى هيئة التدريس' : 'From undergraduate to faculty' },
    { to: '/target-audience', icon: LayoutGrid, label: isAr ? 'كل الفئات' : 'All audiences', desc: null },
  ];
  // ✅ الخدمات — عائلات الخدمات السبع من دليل الخدمات، كل عنصر يفتح قسم
  // العائلة في صفحة دليل الخدمات (/services#<family.key>)
  const serviceItems = [
    ...SERVICE_FAMILIES.map((f) => ({
      to: `/services#${f.key}`,
      icon: FAMILY_NAV_ICONS[f.key] || FileCheck,
      label: f[`label_${currentLang.toLowerCase().startsWith('ar') ? 'ar' : 'en'}`],
      desc: null,
    })),
    { to: '/services', icon: LayoutGrid, label: isAr ? 'كل الخدمات' : 'All services', desc: null },
  ];
  // ✅ للموظفين ومقدّمي الخدمة — الدوران المتاحان في صفحة /staff
  const staffItems = [
    { to: '/staff#service_provider', icon: Briefcase, label: isAr ? 'مقدّم خدمة' : 'Service provider', desc: isAr ? 'محكّم، مترجم، مدقق، مستشار نشر' : 'Reviewer, translator, editor, advisor' },
    { to: '/staff#employee', icon: UserCog, label: isAr ? 'موظف المنصة' : 'Platform employee', desc: isAr ? 'فريق التشغيل وإدارة الحسابات' : 'Operations team and account management' },
    { to: '/staff', icon: LayoutGrid, label: isAr ? 'عن الدورين' : 'About both roles', desc: null },
  ];
  // ✅ "عن المنصة" — من نحن + مركز المساعدة + للتواصل معنا مدمجة في قائمة واحدة
  const aboutItems = [
    { to: '/about-us', icon: Info, label: t('nav.about_us'), desc: isAr ? 'رسالتنا ورؤيتنا وقيمنا' : 'Mission, vision and values' },
    { to: '/help', icon: HelpCircle, label: t('nav.help'), desc: isAr ? 'الأسئلة الشائعة ودليل الاستخدام' : 'FAQ and usage guide' },
    { to: '/contact-us', icon: Mail, label: t('nav.contact_us'), desc: isAr ? 'تواصل مع فريق المنصة' : 'Reach the platform team' },
  ];

  const isPath = (prefixes) => prefixes.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`));
  const audienceActive = isPath(['/audience', '/target-audience']);
  const aboutActive = isPath(['/about-us', '/help', '/contact-us']);
  const servicesActive = isPath(['/services', '/platform-service']);
  const staffActive = isPath(['/staff']);

  const linkCls = (active) => `px-4 py-2 text-sm rounded-full transition-all duration-200 ${
    active ? 'text-brand-orange font-bold underline underline-offset-4' : 'text-brand-muted font-medium hover:text-brand-ink'
  }`;

  const staffLabel = isAr ? 'للموظفين ومقدّمي الخدمة' : 'Staff & service providers';
  const servicesLabel = isAr ? 'الخدمات' : 'Services';
  const aboutLabel = isAr ? 'عن المنصة' : 'About the platform';

  return (
    // ✅ الهيدر على كامل عرض الشاشة — لا max-w-7xl/mx-auto يحصر الشريط
    // بعرض جزئي، ولا py/px خارجي يترك هامشاً حول حافته، ولا rounded-full
    // (زوايا قائمة الآن) — بطلب صريح.
    <header className="sticky top-0 z-50 w-full bg-white transition-all duration-300">
      {/* ✅ مواضع ثابتة بغضّ النظر عن اللغة (بطلب صريح): الشعار يسارًا وأزرار الدخول/اللغة
          يمينًا كما في الإنجليزية — في العربية نعكس ترتيب الأعمدة الثلاثة فقط (rtl:flex-row-reverse)
          بينما تبقى روابط القائمة نفسها بترتيبها العربي من اليمين إلى اليسار */}
      <div className="w-full bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 md:px-8 h-16 flex rtl:flex-row-reverse items-center justify-between">
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
          <Link to="/" className={linkCls(location.pathname === '/')}>{t('nav.home')}</Link>
          <NavDropdown label={t('nav.target_audience')} active={audienceActive} items={audienceItems} isRTL={isRTL} />
          <NavDropdown label={servicesLabel} active={servicesActive} items={serviceItems} isRTL={isRTL} />
          <NavDropdown label={staffLabel} active={staffActive} items={staffItems} isRTL={isRTL} />
          <NavDropdown label={aboutLabel} active={aboutActive} items={aboutItems} isRTL={isRTL} />
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
              className="px-5 py-2 text-sm font-bold text-white bg-brand-orange rounded-full hover:bg-brand-orange-dark transition-all duration-200"
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
                src={staticLogoLightUrl}
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
              {[
                { to: '/', label: t('nav.home') },
              ].map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
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

              <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] px-3 pt-4 pb-1">{t('nav.target_audience')}</p>
              {audienceItems.map((item) => (
                <Link key={item.to} to={item.to} onClick={closeMobileMenu} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-[15px] text-brand-muted font-medium hover:text-brand-ink">
                  <item.icon className="w-4 h-4 text-brand-orange" />{item.label}
                </Link>
              ))}

              <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] px-3 pt-4 pb-1">{servicesLabel}</p>
              {serviceItems.map((item) => (
                <Link key={item.to} to={item.to} onClick={closeMobileMenu} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-[15px] text-brand-muted font-medium hover:text-brand-ink">
                  <item.icon className="w-4 h-4 text-brand-orange" />{item.label}
                </Link>
              ))}

              <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] px-3 pt-4 pb-1">{staffLabel}</p>
              {staffItems.map((item) => (
                <Link key={item.to} to={item.to} onClick={closeMobileMenu} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-[15px] text-brand-muted font-medium hover:text-brand-ink">
                  <item.icon className="w-4 h-4 text-brand-orange" />{item.label}
                </Link>
              ))}

              <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] px-3 pt-4 pb-1">{aboutLabel}</p>
              {aboutItems.map((item) => (
                <Link key={item.to} to={item.to} onClick={closeMobileMenu} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-[15px] text-brand-muted font-medium hover:text-brand-ink">
                  <item.icon className="w-4 h-4 text-brand-orange" />{item.label}
                </Link>
              ))}
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
