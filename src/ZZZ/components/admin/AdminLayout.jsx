import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Settings, Image, LayoutDashboard, LogOut, Menu, X,
  ShieldCheck, UserCog, KeyRound, Users, Bell,
  Mail, HelpCircle, FileText, Globe, Home, Puzzle,
  Monitor, Lock
} from 'lucide-react';
import { API_BASE_URL } from '../../../api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false; // مقارنة بادئة اللغة (يدعم ar-IQ ونحوها)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // ✅ Stage A.5: الحارس الفعلي أصبح على الخادم (admin_crud.php يتحقق من
  // الجلسة عبر require_platform_permission قبل أي عملية) — هذا الفحص هنا
  // بقي فقط لتجنّب عرض واجهة الإدارة لحظياً لمستخدم لديه قيمة localStorage
  // قديمة/مزوَّرة قبل أن تفشل أول استدعاء API فعلي؛ لم يعد وحده كافياً أو
  // معتمَداً عليه أمنياً (كان قابلاً للتجاوز بالكامل من أدوات المطوّر).
  useEffect(() => {
    let cancelled = false;
    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me.php`, { credentials: 'include' });
        const result = await res.json();
        if (cancelled) return;
        if (result.status !== 'success' || result.data?.role !== 'super_admin') {
          navigate('/login');
          return;
        }
        setIsVerifying(false);
      } catch {
        if (!cancelled) navigate('/login');
      }
    };
    verify();
    return () => { cancelled = true; };
  }, [navigate]);

  const handleLogout = () => {
    fetch(`${API_BASE_URL}/logout.php`, { method: 'POST', credentials: 'include' }).catch(() => {});
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-brand-dark flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = (path, end) => end ? location.pathname === path : location.pathname.startsWith(path);

  // ✅ قوائم مقسمة حسب الأقسام
  const menuSections = [
    {
      title: 'admin_menu.section_content',
      items: [
        { path: '/admin',                     label: t('admin_menu.general'),       icon: LayoutDashboard, end: true },
        { path: '/admin/table/pages',         label: t('admin_menu.pages'),         icon: FileText },
        { path: '/admin/table/news',          label: t('admin_menu.news'),          icon: FileText },
        { path: '/admin/table/home_slides',   label: t('admin_menu.slides'),        icon: Image },
      ]
    },
    {
      title: 'admin_menu.section_interaction',
      items: [
        { path: '/admin/table/contact_messages', label: t('admin_menu.messages'),   icon: Mail },
        { path: '/admin/table/faqs',             label: t('admin_menu.faqs'),       icon: HelpCircle },
      ]
    },
    {
      title: 'admin_menu.section_platform',
      items: [
        { path: '/admin/table/platform_services', label: t('admin_menu.services'), icon: Puzzle },
        { path: '/admin/table/users',              label: t('admin_menu.users'),    icon: Users },
      ]
    },
    {
      title: 'admin_menu.section_settings',
      items: [
        { path: '/admin/table/site_info',     label: t('admin_menu.site_info'),     icon: Globe },
        { path: '/admin/table/site_settings', label: t('admin_menu.site_settings'), icon: Settings },
      ]
    },
    {
      title: 'admin_menu.section_account',
      items: [
        { path: '/admin/account',  label: t('admin_menu.account'),  icon: UserCog },
        { path: '/admin/password', label: t('admin_menu.password'), icon: Lock },
      ]
    },
  ];

  // ✅ تسطيح القوائم للقائمة المتنقلة (بدون عناوين الأقسام)
  const flatMenuItems = menuSections.flatMap((section, sIdx) => [
    ...(sIdx > 0 ? [{ type: 'divider', key: `div-${sIdx}` }] : []),
    ...section.items
  ]);

  // ✅ مكون عنوان القسم
  const SectionTitle = ({ title }) => (
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mt-5 mb-2 first:mt-0">
      {t(title)}
    </p>
  );

  // ✅ مكون عنصر القائمة
  const MenuItem = ({ item, onClose }) => {
    if (item.type === 'divider') return <div key={item.key} className="my-4 border-t border-slate-700/50" />;

    return (
      <button
        key={item.path}
        onClick={() => { if (!item.disabled) { navigate(item.path); onClose?.(); } }}
        disabled={item.disabled}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          item.disabled
            ? 'text-slate-600 cursor-not-allowed'
            : isActive(item.path, item.end)
              ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
              : 'text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
        <span className="truncate">{item.label}</span>
        {item.disabled && (
          <span className="text-[9px] bg-white/10 text-slate-400 px-2 py-0.5 rounded-full ms-auto">
            {t('admin_menu.coming_soon')}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark flex transition-colors duration-300">

      {/* ==================== الشريط الجانبي للكمبيوتر ==================== */}
      <aside className={`hidden lg:flex w-72 bg-brand-dark-soft text-white flex-col fixed inset-y-0 z-20 ${isRTL ? 'right-0' : 'left-0'}`}>
        {/* الهيدر */}
        <div className="p-6 border-b border-brand-dark-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-brand-orange-light rounded-xl flex items-center justify-center shadow-md shadow-brand-orange/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">{t('admin_menu.dashboard_title')}</h1>
              <p className="text-[11px] text-slate-400">{t('admin_menu.dashboard_subtitle')}</p>
            </div>
          </div>
        </div>

        {/* القوائم مع عناوين الأقسام */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title}>
              <SectionTitle title={section.title} />
              {section.items.map(item => <MenuItem key={item.path} item={item} />)}
            </div>
          ))}
        </nav>

        {/* زر تسجيل الخروج */}
        <div className="p-4 border-t border-brand-dark-border/50 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 transition-all">
            <LogOut className="w-5 h-5" /> {t('admin_menu.logout')}
          </button>
        </div>
      </aside>

      {/* ==================== الهيدر العلوي للهاتف ==================== */}
      <div className="lg:hidden fixed top-14 inset-x-0 z-10 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-brand-dark-border/60 flex items-center px-4 h-12">
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 dark:text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-brand-dark-hover rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 ms-3">{t('admin_menu.sidebar')}</p>
      </div>

      {/* ==================== القائمة الجانبية للهاتف ==================== */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex pt-[104px]">
          <div className="bg-black/60 flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className={`w-72 bg-brand-dark-soft text-white flex flex-col ${isRTL ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
            <div className="p-4 flex items-center justify-between border-b border-brand-dark-border/50">
              <h1 className="text-lg font-bold">{t('admin_menu.menu')}</h1>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {flatMenuItems.map(item => <MenuItem key={item.path || item.key} item={item} onClose={() => setIsMobileMenuOpen(false)} />)}
            </nav>
          </div>
        </div>
      )}

      {/* ==================== المحتوى الرئيسي ==================== */}
      <main className="flex-1 lg:ms-72 p-6 pt-8 min-h-screen">
        <Outlet />
      </main>

      <style>{`
        @keyframes slide-in-left  { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes slide-in-right { from { transform: translateX(100%); }  to { transform: translateX(0); } }
        .animate-slide-in-left  { animation: slide-in-left  0.3s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AdminLayout;