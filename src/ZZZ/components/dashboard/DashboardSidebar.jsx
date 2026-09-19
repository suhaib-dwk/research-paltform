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
  Mail, Send, LayoutTemplate, Shield,
  // أيقونات الوزارة والجزء الثالث (Ministry & Part 3)
  Map, Target, Handshake, FileSignature, Coins, Globe, Database,
  Network, PieChart, Settings, Layers
} from 'lucide-react';
import { useSite } from '../../../SiteContext';

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
// تم تحديث مجموعة ministry لتعكس متطلبات الجزء الثالث (Part 3)
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
    // =========================================================
    // تعديل القائمة الخاصة بالوزارة (Ministry) بناءً على Part 3
    // =========================================================
    ministry: [
      { id: 'general', title_ar: 'عام', title_en: 'General', items: [
        { id: 'home', icon: LayoutDashboard, label: isAr ? 'لوحة الوزارة' : 'Ministry Dashboard', to: '/dashboard' },
        { id: 'tasks', icon: ListChecks, label: t('tasks.title'), to: '/dashboard/tasks' },
      ]},
      { id: 'intelligence', title_ar: 'الذكاء البحثي الوطني', title_en: 'Nat. Research Intelligence', items: [
        { id: 'national-dashboard', icon: BarChart3, label: isAr ? 'اللوحة الوطنية' : 'National Dashboard', to: '/dashboard/ministry/national-dashboard' },
        { id: 'university-comparison', icon: PieChart, label: isAr ? 'مقارنة الجامعات' : 'University Comparison', to: '/dashboard/ministry/university-comparison' },
        { id: 'geo-intelligence', icon: Map, label: isAr ? 'الخريطة البحثية' : 'Geographic Map', to: '/dashboard/ministry/geographic-intelligence' },
        { id: 'research-fields', icon: Layers, label: isAr ? 'المجالات البحثية' : 'Research Fields', to: '/dashboard/ministry/research-fields' },
        { id: 'policy-intelligence', icon: FileText, label: isAr ? 'الذكاء السياسي' : 'Policy Intelligence', to: '/dashboard/ministry/policy-intelligence' },
      ]},
      { id: 'priorities', title_ar: 'الأولويات الوطنية', title_en: 'Nat. Research Priorities', items: [
        { id: 'sectors', icon: Target, label: isAr ? 'القطاعات والأولويات' : 'Sectors & Priorities', to: '/dashboard/ministry/sectors' },
        { id: 'gap-analysis', icon: Award, label: isAr ? 'تحليل الفجوات' : 'Gap Analysis', to: '/dashboard/ministry/gap-analysis' },
        { id: 'coverage-map', icon: Globe, label: isAr ? 'خريطة التغطية' : 'Coverage Map', to: '/dashboard/ministry/coverage-map' },
      ]},
      { id: 'partnerships', title_ar: 'الشراكات والاتفاقيات', title_en: 'Partnerships', items: [
        { id: 'partners-network', icon: Network, label: isAr ? 'شبكة الشركاء' : 'Partners Network', to: '/dashboard/ministry/partners-network' },
        { id: 'agreements', icon: FileSignature, label: isAr ? 'إدارة الاتفاقيات' : 'Agreements', to: '/dashboard/ministry/agreements' },
        { id: 'partnership-matching', icon: Handshake, label: isAr ? 'مطابقة الشراكات' : 'Matching Engine', to: '/dashboard/ministry/partnership-matching' },
      ]},
      { id: 'funding', title_ar: 'التمويل والفرص', title_en: 'Funding', items: [
        { id: 'funding-opportunities', icon: Coins, label: isAr ? 'فرص التمويل' : 'Funding Opportunities', to: '/dashboard/ministry/funding-opportunities' },
        { id: 'funding-matching', icon: Briefcase, label: isAr ? 'توجيه التمويل' : 'Funding Matching', to: '/dashboard/ministry/funding-matching' },
        { id: 'calls-budget', icon: BarChart3, label: isAr ? 'الدعوات والميزانيات' : 'Calls & Budget', to: '/dashboard/ministry/calls-budget' },
      ]},
      { id: 'system', title_ar: 'النظام', title_en: 'System', items: [
        { id: 'data-governance', icon: Database, label: isAr ? 'حوكمة البيانات' : 'Data Governance', to: '/dashboard/ministry/data-governance' },
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
// المكون الرئيسي — التصميم المرجعي الجديد: سايدبار أبيض بكامل الارتفاع
// (اللوجو أعلى ثم القائمة بمجموعاتها). الحساب/الإعدادات/الخروج في قائمة
// المستخدم بالهيدر (لا تكرار هنا بطلب صريح). العنصر النشط: خلفية خوخية +
// نص برتقالي + شريط برتقالي على الحافة الخارجية (start). بيانات القوائم
// (getMenuGroups) كما هي.
// =========================================================
// ✅ اللوجو الملوّن للوضع الفاتح، ونسخة "أبيض + شمس برتقالية" (البراند بوك) للوضع الداكن
const staticLogoUrl = '/logo/logo1.png';
const staticLogoDarkUrl = '/logo/logo-white-orange.png';

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const { user: userData, currentLang, isRTL, theme } = useSite();
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

  const groupsWithoutBottom = menuGroups;

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const NavItem = ({ item, active }) => {
    const Icon = item.icon;
    return (
      <Link
        to={item.to}
        onClick={handleLinkClick}
        className={`relative flex items-center gap-4 ps-7 pe-5 py-3 text-[15px] transition-colors duration-200 group ${
          active
            ? 'bg-[#fff1ea] dark:bg-brand-orange/10 text-brand-orange font-bold'
            : 'text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-brand-dark-hover/60 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        {active && <span className="absolute inset-y-0 start-0 w-1 bg-brand-orange" />}
        <Icon
          className={`w-[22px] h-[22px] flex-shrink-0 transition-colors ${
            active ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-200'
          }`}
          strokeWidth={1.75}
        />
        <span className="flex-1 min-w-0 truncate">{item.label}</span>
        {item.badge && (
          <span className={`min-w-[22px] h-[22px] px-1.5 flex items-center justify-center text-[11px] font-bold rounded-full ${
            active ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-brand-dark-border text-gray-600 dark:text-gray-300'
          }`}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* اللوجو */}
      <div className="flex items-center justify-between ps-7 pe-5 h-20 flex-shrink-0">
        <Link to="/dashboard" className="flex items-center" onClick={handleLinkClick}>
          <img
            src={theme === 'dark' ? staticLogoDarkUrl : staticLogoUrl}
            alt="SOURCE"
            className="h-24 w-auto -my-8 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
          <div style={{ display: 'none' }} className="items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-orange rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 dark:text-white text-lg font-black">SOURCE</span>
          </div>
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
          className="lg:hidden p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-brand-dark-hover rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* القائمة الرئيسية — مجموعات بعناوين صغيرة */}
      <nav className="flex-1 overflow-y-auto py-3 border-t border-gray-100 dark:border-brand-dark-border/50">
        {groupsWithoutBottom.map((group, groupIdx) => (
          <div key={group.id} className={groupIdx > 0 ? 'mt-4' : ''}>
            {groupsWithoutBottom.length > 1 && (
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.18em] ps-7 pe-5 mb-1.5">
                {isAr ? group.title_ar : group.title_en}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavItem key={item.id} item={item} active={item.isServicesLink ? isServicesActive : isActive(item.to)} />
              ))}
            </div>
          </div>
        ))}
      </nav>

    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex fixed top-0 bottom-0 start-0 z-40 w-[280px] bg-white dark:bg-brand-dark-soft border-e border-gray-100 dark:border-brand-dark-border/40 flex-col transition-colors duration-300">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: isRTL ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRTL ? 300 : -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 bottom-0 start-0 z-50 w-[280px] max-w-[85vw] bg-white dark:bg-brand-dark-soft border-e border-gray-100 dark:border-brand-dark-border/40 flex flex-col lg:hidden shadow-2xl shadow-black/10 dark:shadow-black/50 transition-colors duration-300"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
