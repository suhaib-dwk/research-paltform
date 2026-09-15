import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, FileText, Users, BookOpen,
  BarChart3, MessageSquare, HelpCircle,
  X, GraduationCap, ShieldCheck, Building2, UserCog,
  ListChecks, User,
  Award, Briefcase,
  // أيقونات الخدمات
  Languages, BookMarked, Sparkles,
  Mail, Send, LayoutTemplate, Shield
} from 'lucide-react';
import { useSite } from '../../SiteContext';

// =========================================================
// تعريف الخدمات مع الأدوار المستهدفة
// =========================================================
const UNDERGRAD_ROLE = 'undergrad';
export const ADVANCED_ROLES = ['grad', 'phd', 'researcher', 'faculty'];
const SERVICE_ROLES = [UNDERGRAD_ROLE, ...ADVANCED_ROLES];

export const SIDEBAR_SERVICES = [
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

export const getVisibleServices = (role) => {
  if (!role || !SERVICE_ROLES.includes(role)) return [];
  return SIDEBAR_SERVICES.filter(svc => svc.roles.includes(role));
};

// =========================================================
// عناصر القائمة حسب الدور — مقسّمة لمجموعات (عام / الخدمات / أخرى)
// كل مجموعة { id, title_ar, title_en, items: [...] } — عنصر "الخدمات"
// (رابط فهرس /dashboard/services) يُدرَج داخل مجموعة "الخدمات" بواسطة
// المكوّن الرئيسي أدناه (getGroupedMenu) وليس هنا، لأنه مشترك بين كل الأدوار.
// =========================================================
const getMenuGroups = (role, t, isAr) => {
  const groups = {
    undergrad: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
        { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [] },
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    grad: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
        { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [] },
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    phd: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
        { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [] },
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    faculty: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
        { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [
        { id: 'collaborations', icon: Users, label: t('collabs.title'), to: '/dashboard/collaborations' },
        { id: 'reviews', icon: ShieldCheck, label: t('reviews.title'), to: '/dashboard/reviews' },
      ]},
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    researcher: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
        { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [
        { id: 'collaborations', icon: Users, label: t('collabs.title'), to: '/dashboard/collaborations' },
      ]},
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    reviewer: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
        { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [
        { id: 'reviews', icon: ShieldCheck, label: t('reviews.title'), to: '/dashboard/reviews' },
        { id: 'reviews-history', icon: BookOpen, label: t('reviews_history.title'), to: '/dashboard/reviews/history' },
      ]},
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    university: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
        { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [
        { id: 'university-profile', icon: Building2, label: isAr ? 'ملف الجامعة' : 'University Profile', to: '/dashboard/university-profile' },
        { id: 'academic-quality', icon: Award, label: t('academic_quality.title'), to: '/dashboard/academic-quality' },
        { id: 'collaborations', icon: Users, label: t('collabs.title'), to: '/dashboard/collaborations' },
      ]},
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    college: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
        { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [
        { id: 'academic-quality', icon: Award, label: t('academic_quality.title'), to: '/dashboard/academic-quality' },
      ]},
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    research_center: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
        { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [
        { id: 'academic-quality', icon: Award, label: t('academic_quality.title'), to: '/dashboard/academic-quality' },
        { id: 'collaborations', icon: Users, label: t('collabs.title'), to: '/dashboard/collaborations' },
      ]},
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    ministry: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
        { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [] },
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    employee: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [
        { id: 'universities', icon: Building2, label: t('employee.universities.title'), to: '/dashboard/universities' },
        { id: 'colleges', icon: GraduationCap, label: t('employee.colleges.title'), to: '/dashboard/colleges' },
        { id: 'users', icon: UserCog, label: t('employee.users.title'), to: '/dashboard/users' },
      ]},
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    service_provider: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [
        { id: 'provider-requests', icon: Briefcase, label: isAr ? 'طلبات الخدمة' : 'Service Requests', to: '/dashboard/provider-requests' },
      ]},
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'account', icon: User, label: t('account.title'), to: '/dashboard/account' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
    super_admin: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: t('nav.dashboard'), to: '/dashboard' },
      ]},
      { id: 'services', title_ar: 'الخدمات', title_en: 'Services', items: [
        { id: 'users', icon: UserCog, label: t('employee.users.title'), to: '/dashboard/users' },
        { id: 'researches', icon: FileText, label: t('researches.title'), to: '/dashboard/researches' },
        { id: 'reviews', icon: ShieldCheck, label: t('reviews.title'), to: '/dashboard/reviews' },
      ]},
      { id: 'other', title_ar: 'أخرى', title_en: 'Other', items: [
        { id: 'messages', icon: MessageSquare, label: t('messages.title'), to: '/dashboard/messages' },
        { id: 'help', icon: HelpCircle, label: t('help.title'), to: '/dashboard/help' },
      ]},
    ],
  };
  return groups[role] || groups.employee;
};

// =========================================================
// المكون الرئيسي
// =========================================================
const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const { user: userData, currentLang, isRTL } = useSite();
  const location = useLocation();

  const isAr = currentLang === 'ar';
  const visibleServices = getVisibleServices(userData?.role);

  const isActive = (to) => {
    if (to === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(to);
  };

  // ✅ "الخدمات" نشطة عند فتح فهرسها (/dashboard/services) أو أي خدمة فرعية
  // منه، باستثناء المساعد الذكي — له رابط مستقل بنفس المجموعة فيتولى تنشيط
  // نفسه عبر isActive العادية بدل ما يُحسب ضمن نشاط "الخدمات".
  const isServicesActive = location.pathname.startsWith('/dashboard/services')
    && !location.pathname.startsWith('/dashboard/services/ai-assistant');

  // ✅ حقن رابط فهرس الخدمات + رابط "المساعد الذكي" كأول عنصرين داخل مجموعة
  // "الخدمات" (مشتركان بين كل الأدوار، فلا يُكرَّر تعريفهما بكل دور جوا
  // getMenuGroups). المساعد الذكي يظهر فقط للأدوار الخمسة المؤهَّلة لخدمة
  // svc_ai_assistant أصلاً (نتحقق عبر visibleServices بدل تكرار قائمة أدوار).
  const aiAssistantService = visibleServices.find((svc) => svc.slug === 'ai-assistant');
  const menuGroups = getMenuGroups(userData?.role, t, isAr).map((group) => {
    if (group.id !== 'services' || visibleServices.length === 0) return group;
    const servicesLink = {
      id: 'services-index', icon: BookOpen, to: '/dashboard/services',
      label: isAr ? 'الخدمات' : 'Services', badge: visibleServices.length, isServicesLink: true,
    };
    const injected = aiAssistantService
      ? [servicesLink, {
          id: 'ai-assistant-link', icon: aiAssistantService.icon, to: '/dashboard/services/ai-assistant',
          label: isAr ? aiAssistantService.label_ar : aiAssistantService.label_en,
        }]
      : [servicesLink];
    return { ...group, items: [...injected, ...group.items] };
  }).filter((group) => group.items.length > 0);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* رأس القائمة (موبايل فقط) */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3a322c]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-orange to-[#f0916d] rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-gray-900 dark:text-white text-sm font-bold">{t('admin_menu.sidebar')}</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2a231e] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* القائمة الرئيسية — مقسّمة لمجموعات بعناوين */}
      <nav className="flex-1 overflow-y-auto p-3">
        {menuGroups.map((group, groupIdx) => (
          <div key={group.id} className={groupIdx > 0 ? 'mt-4' : ''}>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-1.5">
              {isAr ? group.title_ar : group.title_en}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = item.isServicesLink ? isServicesActive : isActive(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                      active
                        ? 'bg-orange-50 dark:bg-brand-orange/10 text-brand-orange'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a231e]/60 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                      active ? 'text-brand-orange' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    }`} />
                    <span className="flex-1 min-w-0 truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full ${
                        active ? 'bg-brand-orange/20 text-brand-orange' : 'bg-gray-200 dark:bg-[#3a322c] text-gray-600 dark:text-gray-400 group-hover:bg-gray-300 dark:group-hover:bg-[#4a4038]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex fixed top-20 bottom-0 z-20 w-72 bg-white dark:bg-[#1f1a17]/95 backdrop-blur-xl border-e border-gray-200 dark:border-[#3a322c]/40 flex-col transition-colors duration-300">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: isRTL ? -300 : 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRTL ? -300 : 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-white dark:bg-[#1f1a17] border-e border-gray-200 dark:border-[#3a322c]/40 flex flex-col lg:hidden shadow-2xl shadow-black/10 dark:shadow-black/50 transition-colors duration-300"
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