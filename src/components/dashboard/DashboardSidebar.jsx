import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, FileText, Users, BookOpen,
  BarChart3, MessageSquare, Settings, HelpCircle,
  X, GraduationCap, ShieldCheck, Building2, UserCog,
  ListChecks, Clock, User,
  ChevronDown,
  // أيقونات الخدمات
  Languages, Sparkles, BookMarked,
  Mail, Send, LayoutTemplate, Shield
} from 'lucide-react';
import { useSite } from '../../SiteContext';

// =========================================================
// تعريف الخدمات مع الأدوار المستهدفة
// =========================================================
const UNDERGRAD_ROLE = 'undergrad';
const ADVANCED_ROLES = ['grad', 'phd', 'researcher', 'faculty'];
const SERVICE_ROLES = [UNDERGRAD_ROLE, ...ADVANCED_ROLES];

const SIDEBAR_SERVICES = [
  // خدمات مشتركة (بما فيها التحكيم للطلاب)
  { id: 'svc_review', slug: 'review', icon: Shield, label_ar: 'تحكيم', label_en: 'Review', roles: ['undergrad', 'grad', 'phd', 'faculty', 'researcher'] },
  { id: 'svc_translation', slug: 'translation', icon: Languages, label_ar: 'الترجمة', label_en: 'Translation', roles: SERVICE_ROLES },
  { id: 'svc_proofreading', slug: 'proofreading', icon: FileText, label_ar: 'التدقيق اللغوي', label_en: 'Language Editing', roles: SERVICE_ROLES },
  { id: 'svc_consultation', slug: 'consultation', icon: MessageSquare, label_ar: 'الاستشارة', label_en: 'Consultation', roles: SERVICE_ROLES },
  { id: 'svc_ai_assistant', slug: 'ai-assistant', icon: Sparkles, label_ar: 'المساعد الذكي', label_en: 'AI Assistant', roles: SERVICE_ROLES },
  // خدمات الأدوار المتقدمة
  { id: 'svc_journal_selection', slug: 'journal-selection', icon: BookMarked, label_ar: 'اختيار مجلة', label_en: 'Journal Selection', roles: ADVANCED_ROLES },
  { id: 'svc_journal_evaluation', slug: 'journal-evaluation', icon: BarChart3, label_ar: 'تقييم مجلة', label_en: 'Journal Evaluation', roles: ADVANCED_ROLES },
  { id: 'svc_template', slug: 'template', icon: LayoutTemplate, label_ar: 'قوالب البحث', label_en: 'Research Templates', roles: ADVANCED_ROLES },
  { id: 'svc_correspondence', slug: 'correspondence', icon: Mail, label_ar: 'المراسلات', label_en: 'Correspondence', roles: ADVANCED_ROLES },
  { id: 'svc_publication', slug: 'publication', icon: Send, label_ar: 'النشر', label_en: 'Publication', roles: ADVANCED_ROLES },
];

const getVisibleServices = (role) => {
  if (!role || !SERVICE_ROLES.includes(role)) return [];
  return SIDEBAR_SERVICES.filter(svc => svc.roles.includes(role));
};

// =========================================================
// عناصر القائمة حسب الدور
// =========================================================
const getMenuItems = (role, t) => {
  const items = {
    undergrad: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages', badge: 3 },
      { id: 'stats', icon: BarChart3, label: t('stats.title'), to: '/dashboard/stats' },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
    grad: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      { id: 'researches', icon: FileText, label: t('researches.title'), to: '/dashboard/researches' },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages', badge: 2 },
      { id: 'stats', icon: BarChart3, label: t('stats.title'), to: '/dashboard/stats' },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
    phd: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      { id: 'researches', icon: FileText, label: t('researches.title'), to: '/dashboard/researches' },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages', badge: 2 },
      { id: 'stats', icon: BarChart3, label: t('stats.title'), to: '/dashboard/stats' },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
    faculty: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      { id: 'researches', icon: FileText, label: t('researches.title'), to: '/dashboard/researches' },
      { id: 'collaborations', icon: Users, label: t('collabs.title'), to: '/dashboard/collaborations' },
      { id: 'reviews', icon: ShieldCheck, label: t('reviews.title'), to: '/dashboard/reviews', badge: 2 },
      { id: 'stats', icon: BarChart3, label: t('stats.title'), to: '/dashboard/stats' },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages', badge: 5 },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
    researcher: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      { id: 'researches', icon: FileText, label: t('researches.title'), to: '/dashboard/researches' },
      { id: 'collaborations', icon: Users, label: t('collabs.title'), to: '/dashboard/collaborations' },
      { id: 'stats', icon: BarChart3, label: t('stats.title'), to: '/dashboard/stats' },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages', badge: 1 },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
    reviewer: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      { id: 'reviews', icon: ShieldCheck, label: t('reviews.title'), to: '/dashboard/reviews', badge: 4 },
      { id: 'reviews-history', icon: BookOpen, label: t('reviews_history.title'), to: '/dashboard/reviews/history' },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages', badge: 1 },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
    university: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      { id: 'collaborations', icon: Users, label: t('collabs.title'), to: '/dashboard/collaborations' },
      { id: 'stats', icon: BarChart3, label: t('stats.title'), to: '/dashboard/stats' },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
    college: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      { id: 'stats', icon: BarChart3, label: t('stats.title'), to: '/dashboard/stats' },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
    research_center: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      { id: 'collaborations', icon: Users, label: t('collabs.title'), to: '/dashboard/collaborations' },
      { id: 'stats', icon: BarChart3, label: t('stats.title'), to: '/dashboard/stats' },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
    ministry: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      { id: 'stats', icon: BarChart3, label: t('stats.title'), to: '/dashboard/stats' },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
    employee: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'universities', icon: Building2, label: t('employee.universities.title'), to: '/dashboard/universities' },
      { id: 'colleges', icon: GraduationCap, label: t('employee.colleges.title'), to: '/dashboard/colleges' },
      { id: 'users', icon: UserCog, label: t('employee.users.title'), to: '/dashboard/users', badge: 3 },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages', badge: 2 },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
    super_admin: [
      { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      { id: 'users', icon: UserCog, label: t('employee.users.title'), to: '/dashboard/users' },
      { id: 'researches', icon: FileText, label: t('researches.title'), to: '/dashboard/researches' },
      { id: 'reviews', icon: ShieldCheck, label: t('reviews.title'), to: '/dashboard/reviews' },
      { id: 'stats', icon: BarChart3, label: t('stats.title'), to: '/dashboard/stats' },
      { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
      { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
    ],
  };
  return items[role] || items.employee;
};

// =========================================================
// المكون الرئيسي
// =========================================================
const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const { user: userData, currentLang, isRTL } = useSite();
  const location = useLocation();

  const menuItems = getMenuItems(userData?.role, t);
  const visibleServices = getVisibleServices(userData?.role);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const isActive = (to) => {
    if (to === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(to);
  };

  const isServiceActive = (slug) => location.pathname.startsWith(`/dashboard/services/${slug}`);
  const isAnyServiceActive = visibleServices.some(svc => isServiceActive(svc.slug));

  const handleToggleServices = () => {
    if (!isServicesOpen && !isAnyServiceActive) {
      setIsServicesOpen(true);
    } else {
      setIsServicesOpen(!isServicesOpen);
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* رأس القائمة (موبايل فقط) */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#1e3050]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-[#c8a44e] to-[#e6c96e] rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#0a1628]" />
          </div>
          <span className="text-gray-900 dark:text-white text-sm font-bold">{t('admin_menu.sidebar')}</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a2744] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* معلومات المستخدم (ديسكتوب فقط) */}
      <div className="hidden lg:block p-5 border-b border-gray-200 dark:border-[#1e3050]/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#c8a44e] to-[#e6c96e] text-[#0a1628] rounded-xl flex items-center justify-center text-sm font-black shadow-sm">
            {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 dark:text-white text-sm font-bold truncate">{userData?.name || 'User'}</p>
            <p className="text-[#c8a44e] text-[10px] font-semibold truncate">{t(`account.role_${userData?.role || 'default'}`)}</p>
          </div>
        </div>
      </div>

      {/* القائمة الرئيسية */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.to}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? 'bg-amber-50 dark:bg-[#c8a44e]/10 text-[#c8a44e]'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a2744]/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#c8a44e] rounded-full`}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                active ? 'text-[#c8a44e]' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
              }`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full ${
                  active ? 'bg-[#c8a44e]/20 text-[#c8a44e]' : 'bg-gray-200 dark:bg-[#1e3050] text-gray-600 dark:text-gray-400 group-hover:bg-gray-300 dark:group-hover:bg-[#2a3a5c]'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* ---- قسم الخدمات (قابل للطي) ---- */}
        {visibleServices.length > 0 && (
          <div className="pt-2 mt-2 border-t border-gray-100 dark:border-[#1e3050]/30">
            <button
              onClick={handleToggleServices}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isAnyServiceActive
                  ? 'bg-amber-50 dark:bg-[#c8a44e]/10 text-[#c8a44e]'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a2744]/60 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {isAnyServiceActive && (
                <motion.div
                  layoutId="sidebar-active-services"
                  className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#c8a44e] rounded-full`}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <BookOpen className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                isAnyServiceActive
                  ? 'text-[#c8a44e]'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
              }`} />
              <span className="flex-1 truncate text-start">
                {currentLang === 'ar' ? 'الخدمات' : 'Services'}
              </span>
              <span className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full ${
                isAnyServiceActive
                  ? 'bg-[#c8a44e]/20 text-[#c8a44e]'
                  : 'bg-gray-200 dark:bg-[#1e3050] text-gray-600 dark:text-gray-400'
              }`}>
                {visibleServices.length}
              </span>
              <motion.span
                animate={{ rotate: (isServicesOpen || isAnyServiceActive) ? (isRTL ? -90 : 90) : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {(isServicesOpen || isAnyServiceActive) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className={`${isRTL ? 'pr-3' : 'pl-3'} pt-1 space-y-0.5`}>
                    {visibleServices.map((svc) => {
                      const active = isServiceActive(svc.slug);
                      const Icon = svc.icon;
                      return (
                        <Link
                          key={svc.id}
                          to={`/dashboard/services/${svc.slug}`}
                          onClick={handleLinkClick}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 group ${
                            active
                              ? 'bg-[#c8a44e]/10 text-[#c8a44e]'
                              : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-[#1a2744]/40 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                        >
                          <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                            active ? 'text-[#c8a44e]' : 'text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                          }`} />
                          <span className="truncate">
                            {currentLang === 'ar' ? svc.label_ar : svc.label_en}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>

      {/* تذييل القائمة */}
      <div className="p-3 border-t border-gray-200 dark:border-[#1e3050]/40 space-y-1">
        <Link
          to="/dashboard/account"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
            isActive('/dashboard/account') ? 'bg-amber-50 dark:bg-[#c8a44e]/10 text-[#c8a44e]' : 'text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#1a2744]/60 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <User className="w-[18px] h-[18px]" />
          <span>{t('account.title')}</span>
        </Link>
        <Link
          to="/dashboard/activity"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
            isActive('/dashboard/activity') ? 'bg-amber-50 dark:bg-[#c8a44e]/10 text-[#c8a44e]' : 'text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#1a2744]/60 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-[18px] h-[18px]" />
          <span>{t('activity.title')}</span>
        </Link>
        <Link
          to="/dashboard/settings"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
            isActive('/dashboard/settings') ? 'bg-amber-50 dark:bg-[#c8a44e]/10 text-[#c8a44e]' : 'text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#1a2744]/60 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-[18px] h-[18px]" />
          <span>{t('settings.title')}</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex fixed top-20 bottom-0 z-20 w-72 bg-white dark:bg-[#080f1e]/95 backdrop-blur-xl border-e border-gray-200 dark:border-[#1e3050]/40 flex-col transition-colors duration-300">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: isRTL ? -300 : 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRTL ? -300 : 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-white dark:bg-[#080f1e] border-e border-gray-200 dark:border-[#1e3050]/40 flex flex-col lg:hidden shadow-2xl shadow-black/10 dark:shadow-black/50 transition-colors duration-300"
            style={{ [isRTL ? 'right' : 'left']: 0 }}
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;