import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  FileText,
  Users,
  BookOpen,
  BarChart3,
  MessageSquare,
  HelpCircle,
  X,
  GraduationCap,
  ShieldCheck,
  Building2,
  UserCog,
  ListChecks,
  User,
  Award,
  Briefcase,
  Languages,
  BookMarked,
  Sparkles,
  Mail,
  Send,
  LayoutTemplate,
  Shield,
  Map,
  Target,
  Handshake,
  FileSignature,
  Coins,
  Globe,
  Database,
  Network,
  PieChart,
  Settings,
  Layers,
} from "lucide-react";
import { useSite } from "../SiteContext";

// =========================================================
// تعريف الخدمات مع الأدوار المستهدفة
// =========================================================
const UNDERGRAD_ROLE = "bachelor_student";
export const ADVANCED_ROLES = [
  "master_student",
  "phd_student",
  "lecturer",
  "researcher",
];
const SERVICE_ROLES = [UNDERGRAD_ROLE, ...ADVANCED_ROLES];

export const SIDEBAR_SERVICES = [
  {
    id: "svc_review",
    slug: "review",
    icon: Shield,
    label_ar: "تحكيم",
    label_en: "Review",
    roles: [
      "bachelor_student",
      "master_student",
      "phd_student",
      "lecturer",
      "researcher",
    ],
  },
  {
    id: "svc_translation",
    slug: "translation",
    icon: Languages,
    label_ar: "الترجمة",
    label_en: "Translation",
    roles: SERVICE_ROLES,
  },
  {
    id: "svc_proofreading",
    slug: "proofreading",
    icon: FileText,
    label_ar: "التدقيق اللغوي",
    label_en: "Language Editing",
    roles: SERVICE_ROLES,
  },
  {
    id: "svc_consultation",
    slug: "consultation",
    icon: MessageSquare,
    label_ar: "الاستشارة",
    label_en: "Consultation",
    roles: SERVICE_ROLES,
  },
  {
    id: "svc_ai_assistant",
    slug: "ai-assistant",
    icon: Sparkles,
    label_ar: "المساعد الذكي",
    label_en: "AI Assistant",
    roles: SERVICE_ROLES,
  },
  {
    id: "svc_journal_selection",
    slug: "journal-selection",
    icon: BookMarked,
    label_ar: "اختيار مجلة",
    label_en: "Journal Selection",
    roles: ADVANCED_ROLES,
  },
  {
    id: "svc_journal_evaluation",
    slug: "journal-evaluation",
    icon: BarChart3,
    label_ar: "تقييم مجلة",
    label_en: "Journal Evaluation",
    roles: ADVANCED_ROLES,
  },
  {
    id: "svc_template",
    slug: "template",
    icon: LayoutTemplate,
    label_ar: "قوالب البحث",
    label_en: "Research Templates",
    roles: ADVANCED_ROLES,
  },
  {
    id: "svc_correspondence",
    slug: "order-correspondence",
    icon: Mail,
    label_ar: "المراسلات",
    label_en: "Correspondence",
    roles: ADVANCED_ROLES,
  },
  {
    id: "svc_publication",
    slug: "publication",
    icon: Send,
    label_ar: "النشر",
    label_en: "Publication",
    roles: ADVANCED_ROLES,
  },
];

export const getVisibleServices = (role) => {
  if (!role || !SERVICE_ROLES.includes(role)) return [];
  return SIDEBAR_SERVICES.filter((svc) => svc.roles.includes(role));
};

// =========================================================
// عناصر القائمة حسب الدور
// =========================================================
const getMenuGroups = (role, t, isAr) => {
  const groups = {
    // 1. Bachelor Student
    bachelor_student: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
          {
            id: "tasks",
            icon: ListChecks,
            label: t("tasks.title"),
            to: "tasks",
          },
        ],
      },
      { id: "services", title_ar: "الخدمات", title_en: "Services", items: [] },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "Help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    // 2. Master Student
    master_student: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
          {
            id: "tasks",
            icon: ListChecks,
            label: t("tasks.title"),
            to: "tasks",
          },
        ],
      },
      { id: "services", title_ar: "الخدمات", title_en: "Services", items: [] },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    // 3. PhD Student
    phd_student: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
          {
            id: "tasks",
            icon: ListChecks,
            label: t("tasks.title"),
            to: "tasks",
          },
        ],
      },
      { id: "services", title_ar: "الخدمات", title_en: "Services", items: [] },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    // 4. Lecturer
    lecturer: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
          {
            id: "tasks",
            icon: ListChecks,
            label: t("tasks.title"),
            to: "tasks",
          },
        ],
      },
      {
        id: "services",
        title_ar: "الخدمات",
        title_en: "Services",
        items: [
          {
            id: "collaborations",
            icon: Users,
            label: t("collabs.title"),
            to: "collaborations",
          },
          {
            id: "reviews",
            icon: ShieldCheck,
            label: t("reviews.title"),
            to: "reviews",
          },
        ],
      },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    // 5. Researcher
    researcher: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
          {
            id: "tasks",
            icon: ListChecks,
            label: t("tasks.title"),
            to: "tasks",
          },
        ],
      },
      {
        id: "services",
        title_ar: "خدمات الباحث",
        title_en: "Research Services",
        items: [
          {
            id: "collaborations",
            icon: Users,
            label: t("collabs.title"),
            to: "collaborations",
          },
        ],
      },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    // 6. University
    university: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
          {
            id: "tasks",
            icon: ListChecks,
            label: t("tasks.title"),
            to: "tasks",
          },
        ],
      },
      {
        id: "services",
        title_ar: "خدمات الجودة",
        title_en: "Quality",
        items: [
          {
            id: "university-profile",
            icon: Building2,
            label: isAr ? "ملف الجامعة" : "Profile",
            to: "profile",
          },
          {
            id: "academic-quality",
            icon: Award,
            label: t("academic_quality.title"),
            to: "quality",
          },
        ],
      },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    // 7. College
    college: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
          {
            id: "tasks",
            icon: ListChecks,
            label: t("tasks.title"),
            to: "tasks",
          },
        ],
      },
      {
        id: "services",
        title_ar: "الخدمات",
        title_en: "Services",
        items: [
          {
            id: "academic-quality",
            icon: Award,
            label: t("academic_quality.title"),
            to: "quality",
          },
        ],
      },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    // 8. Research Center
    research_center: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
          {
            id: "tasks",
            icon: ListChecks,
            label: t("tasks.title"),
            to: "tasks",
          },
        ],
      },
      {
        id: "services",
        title_ar: "خدمات البحث",
        title_en: "Research Services",
        items: [
          {
            id: "academic-quality",
            icon: Award,
            label: t("academic_quality.title"),
            to: "quality",
          },
          {
            id: "collaborations",
            icon: Users,
            label: t("collabs.title"),
            to: "collaborations",
          },
        ],
      },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    // 9. Ministry
    ministry: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: isAr ? "لوحة الوزارة" : "Dashboard",
            to: "./",
          },
          {
            id: "tasks",
            icon: ListChecks,
            label: t("tasks.title"),
            to: "tasks",
          },
        ],
      },
      {
        id: "intelligence",
        title_ar: "الذكاء البحثي",
        title_en: "Intelligence",
        items: [
          {
            id: "national-dashboard",
            icon: BarChart3,
            label: isAr ? "اللوحة الوطنية" : "National",
            to: "national-dashboard",
          },
          {
            id: "university-comparison",
            icon: PieChart,
            label: isAr ? "المقارنة" : "Comparison",
            to: "university-comparison",
          },
        ],
      },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    // 10. Employee
    employee: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
        ],
      },
      {
        id: "services",
        title_ar: "الخدمات",
        title_en: "Services",
        items: [
          {
            id: "universities",
            icon: Building2,
            label: t("employee.universities.title"),
            to: "universities",
          },
          {
            id: "users",
            icon: UserCog,
            label: t("employee.users.title"),
            to: "users",
          },
        ],
      },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    // 11. Service Provider
    service_provider: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
        ],
      },
      {
        id: "services",
        title_ar: "الخدمات",
        title_en: "Services",
        items: [
          {
            id: "provider-requests",
            icon: Briefcase,
            label: isAr ? "الطلبات" : "Requests",
            to: "requests",
          },
        ],
      },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    // 12. System Admin
    system_admin: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
        ],
      },
      {
        id: "services",
        title_ar: "الخدمات",
        title_en: "Services",
        items: [
          {
            id: "users",
            icon: UserCog,
            label: t("employee.users.title"),
            to: "users",
          },
          {
            id: "reviews",
            icon: ShieldCheck,
            label: t("reviews.title"),
            to: "reviews",
          },
        ],
      },
      {
        id: "other",
        title_ar: "أخرى",
        title_en: "Other",
        items: [
          {
            id: "messages",
            icon: MessageSquare,
            label: t("messages.title"),
            to: "messages",
          },
          { id: "help", icon: HelpCircle, label: t("help.title"), to: "help" },
        ],
      },
    ],
    super_admin: [
      {
        id: "general",
        title_ar: "عام",
        title_en: "General",
        items: [
          {
            id: "home",
            icon: LayoutDashboard,
            label: t("nav.dashboard"),
            to: "./",
          },
        ],
      },
      {
        id: "services",
        title_ar: "الخدمات",
        title_en: "Services",
        items: [
          {
            id: "users",
            icon: UserCog,
            label: t("employee.users.title"),
            to: "users",
          },
        ],
      },
    ],
  };
  return groups[role] || groups.employee;
};

// =========================================================
// المكون الرئيسي
// =========================================================
const staticLogoUrl = "/logo/logo1.png";
const staticLogoDarkUrl = "/logo/logo-white-orange.png";

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const { user: userData, currentLang, isRTL, theme } = useSite();
  const location = useLocation();

  const isAr = currentLang === "ar";
  const visibleServices = getVisibleServices(userData?.role);

  // منطق التحقق من النشاط (تم إصلاحه لمنع التضارب)
  const isActive = (to) => {
    // الحالة الخاصة للرئيسية
    if (to === "./") {
      return (
        location.pathname === location.pathname.replace(/\/$/, "") ||
        location.pathname.endsWith("/academic") ||
        location.pathname.endsWith("/university") ||
        location.pathname.endsWith("/admin") ||
        location.pathname.endsWith("/employee") ||
        location.pathname.endsWith("/provider") ||
        location.pathname.endsWith("/ministry") ||
        location.pathname.endsWith("/college") ||
        location.pathname.endsWith("/research-center")
      );
    }

    // الإصلاح:
    // 1. إذا كان الرابط يحتوي على شرطة مائلة (مثل services/ai-assistant)، نتحقق من نهاية المسار الكامل
    // 2. إذا كان الرابط بسيطاً (مثل tasks)، نتحقق من تطابق الجزء الأخير فقط (Exact Match)
    // هذا يمنع تفعيل "tasks" عندما يكون الرابط "tasks/something" أو تفعيل روابط جزئية
    if (to.includes("/")) {
      return location.pathname.endsWith(to);
    } else {
      const pathSegments = location.pathname.split("/");
      const relativePath = pathSegments[pathSegments.length - 1];
      return relativePath === to;
    }
  };

  const aiAssistantService = visibleServices.find(
    (svc) => svc.slug === "ai-assistant",
  );

  const menuGroups = getMenuGroups(userData?.role, t, isAr)
    .map((group) => {
      if (group.id !== "services" || visibleServices.length === 0) return group;

      const servicesLink = {
        id: "services-index",
        icon: BookOpen,
        to: "services",
        label: isAr ? "الخدمات" : "Services",
        badge: visibleServices.length,
        isServicesLink: true,
      };

      const injected = aiAssistantService
        ? [
            servicesLink,
            {
              id: "ai-assistant-link",
              icon: aiAssistantService.icon,
              to: "ai-assistant",
              label: isAr
                ? aiAssistantService.label_ar
                : aiAssistantService.label_en,
            },
          ]
        : [servicesLink];

      return { ...group, items: [...injected, ...group.items] };
    })
    .filter((group) => group.items.length > 0);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const NavItem = ({ item, active }) => {
    const Icon = item.icon;
    return (
      <Link
        to={item.to}
        onClick={handleLinkClick}
        className={`relative flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-300 ease-out group ${
          active
            ? // Active State
              "bg-orange-600 text-white shadow-lg shadow-orange-500/40 scale-[1.02]"
            : // Hover State
              "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 hover:shadow-md hover:scale-[1.02]"
        }`}
      >
        {active && (
          <div className="absolute inset-0 bg-orange-600 rounded-xl blur-md opacity-30 -z-10"></div>
        )}

        <Icon
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
            active
              ? "text-white"
              : "text-gray-500 group-hover:text-orange-600 dark:group-hover:text-orange-400"
          }`}
          strokeWidth={2}
        />

        <span className="flex-1 text-sm font-medium truncate">
          {item.label}
        </span>

        {item.badge && (
          <span
            className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full ${
              active
                ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30 scale-[1.02]"
                : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 hover:shadow-md hover:scale-[1.02]"
            }`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-200 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-800 transition-colors duration-300">
      {/* Logo Header */}
      <div className="flex items-center justify-between px-6 h-20 flex-shrink-0 border-b border-gray-200 dark:border-gray-800">
        <Link
          to="./"
          className="flex items-center gap-2 group"
          onClick={handleLinkClick}
        >
          <img
            src={theme === "dark" ? staticLogoDarkUrl : staticLogoUrl}
            alt="SOURCE"
            className="h-25 w-auto transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />
          <div style={{ display: "none" }} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              SOURCE
            </span>
          </div>
        </Link>

        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-8 custom-scrollbar">
        {menuGroups.map((group) => (
          <div key={group.id}>
            {menuGroups.length > 1 && (
              <h3
                className={`px-6 mb-3 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 ${isRTL ? "text-right" : "text-left"}`}
              >
                {isAr ? group.title_ar : group.title_en}
              </h3>
            )}
            <div className="space-y-2">
              {group.items.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  active={
                    item.isServicesLink
                      ? location.pathname.includes("services") &&
                        !location.pathname.includes("ai-assistant")
                      : isActive(item.to)
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Optional Footer in Sidebar */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-800 bg-gray-300/60 dark:bg-gray-800/50">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
            {userData?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
              {userData?.name || "User Name"}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize truncate">
              {userData?.role?.replace("_", " ") || "Role"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 bottom-0 start-0 z-30 w-[280px] transition-colors duration-300">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 start-0 z-50 w-[280px] max-w-[85vw] shadow-2xl lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(34, 34, 36, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </>
  );
};

export default DashboardSidebar;
