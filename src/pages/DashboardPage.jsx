import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink, BookOpen, TrendingUp, HandCoins, FlaskConical,
  User, FileText, BarChart3, CheckCircle, Loader2,
  Shield, Star, BookMarked, Mail, Layout, Send
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { API_BASE_URL } from '../api';

// =========================================================
// 1. الأيقونات المتاحة للخدمات
// =========================================================
const serviceIcons = {
  BookOpen, TrendingUp, HandCoins, FlaskConical,
  CheckCircle, ExternalLink, FileText,
  Shield, Star, BookMarked, Mail, Layout, Send,
};
const getServiceIcon = (name) => serviceIcons[name] || BookOpen;

// =========================================================
// 2. تصنيف الأدوار
// =========================================================
const UNDERGRAD_ROLE = 'undergrad';
const ADVANCED_ROLES = ['grad', 'phd', 'researcher', 'faculty'];

// =========================================================
// 3. الخدمات الإضافية الكاملة
// =========================================================
const EXTRA_SERVICES = [
  // ---- خدمات مشتركة (بكالوريوس + متقدم) ----
  {
    id: 'svc_initial_review',
    slug: 'initial-review',
    icon_name: 'CheckCircle',
    title_ar: 'التحكيم الأولي',
    title_en: 'Initial Review',
    desc_ar: 'خدمة التحكيم الأولي للأبحاث والأوراق العلمية قبل النشر',
    desc_en: 'Initial peer review service for research papers before publication',
    color_class: 'from-emerald-500 to-emerald-700',
    roles: [UNDERGRAD_ROLE, ...ADVANCED_ROLES],
  },
  {
    id: 'svc_translation',
    slug: 'translation',
    icon_name: 'ExternalLink',
    title_ar: 'الترجمة',
    title_en: 'Translation',
    desc_ar: 'ترجمة الأوراق البحثية والمستندات الأكاديمية باحترافية عالية',
    desc_en: 'Professional translation of research papers and academic documents',
    color_class: 'from-blue-500 to-blue-700',
    roles: [UNDERGRAD_ROLE, ...ADVANCED_ROLES],
  },
  {
    id: 'svc_proofreading',
    slug: 'proofreading',
    icon_name: 'FileText',
    title_ar: 'التدقيق اللغوي',
    title_en: 'Language Editing',
    desc_ar: 'تدقيق لغوي شامل للأوراق البحثية وفقاً للمعايير الأكاديمية الدولية',
    desc_en: 'Comprehensive language editing for research papers per international standards',
    color_class: 'from-violet-500 to-violet-700',
    roles: [UNDERGRAD_ROLE, ...ADVANCED_ROLES],
  },
  {
    id: 'svc_consultation',
    slug: 'consultation',
    icon_name: 'HandCoins',
    title_ar: 'الاستشارة',
    title_en: 'Consultation',
    desc_ar: 'استشارات أكاديمية وبحثية متخصصة مع خبراء معتمدين',
    desc_en: 'Specialized academic and research consultations with certified experts',
    color_class: 'from-amber-500 to-amber-700',
    roles: [UNDERGRAD_ROLE, ...ADVANCED_ROLES],
  },
  {
    id: 'svc_ai_assistant',
    slug: 'ai-assistant',
    icon_name: 'TrendingUp',
    title_ar: 'المساعد الذكي',
    title_en: 'AI Assistant',
    desc_ar: 'مساعد ذكي مدعوم بالذكاء الاصطناعي لتحسين الأبحاث والكتابة الأكاديمية',
    desc_en: 'AI-powered assistant to enhance research and academic writing',
    color_class: 'from-cyan-500 to-cyan-700',
    roles: [UNDERGRAD_ROLE, ...ADVANCED_ROLES],
  },

  // ---- خدمات حصرية للأدوار المتقدمة ----
  {
    id: 'svc_expert_review',
    slug: 'expert-review',
    icon_name: 'Shield',
    title_ar: 'تحكيم خبير',
    title_en: 'Expert Review',
    desc_ar: 'تحكيم متعمق من خبير متخصص في مجال البحث لضمان الجودة العلمية',
    desc_en: 'In-depth review by a specialized expert in the research field to ensure scientific quality',
    color_class: 'from-indigo-500 to-indigo-700',
    roles: [...ADVANCED_ROLES],
  },
  {
    id: 'svc_final_review',
    slug: 'final-review',
    icon_name: 'Star',
    title_ar: 'التحكيم النهائي',
    title_en: 'Final Review',
    desc_ar: 'تحكيم نهائي شامل قبل الإرسال للمجلة لضمان جاهزية البحث للنشر',
    desc_en: 'Comprehensive final review before journal submission to ensure publication readiness',
    color_class: 'from-yellow-500 to-yellow-700',
    roles: [...ADVANCED_ROLES],
  },
  {
    id: 'svc_journal_selection',
    slug: 'journal-selection',
    icon_name: 'BookMarked',
    title_ar: 'اختيار مجلة',
    title_en: 'Journal Selection',
    desc_ar: 'مساعدة في اختيار المجلة العلمية الأنسب لنشر بحثك بناءً على معايير دقيقة',
    desc_en: 'Help selecting the most suitable scientific journal for your research based on precise criteria',
    color_class: 'from-pink-500 to-pink-700',
    roles: [...ADVANCED_ROLES],
  },
  {
    id: 'svc_journal_evaluation',
    slug: 'journal-evaluation',
    icon_name: 'BarChart3',
    title_ar: 'تقييم مجلة',
    title_en: 'Journal Evaluation',
    desc_ar: 'تقييم شامل للمجلات العلمية من حيث معامل التأثير ومصداقيتها وسرعة النشر',
    desc_en: 'Comprehensive evaluation of scientific journals regarding impact factor, credibility, and publication speed',
    color_class: 'from-teal-500 to-teal-700',
    roles: [...ADVANCED_ROLES],
  },
  {
    id: 'svc_template',
    slug: 'template',
    icon_name: 'Layout',
    title_ar: 'قوالب البحث',
    title_en: 'Research Templates',
    desc_ar: 'قوالب جاهزة ومنسقة لأشهر المجلات العلمية لتسهيل عملية الكتابة والتنسيق',
    desc_en: 'Ready-formatted templates for top scientific journals to facilitate writing and formatting',
    color_class: 'from-slate-500 to-slate-700',
    roles: [...ADVANCED_ROLES],
  },
  {
    id: 'svc_correspondence',
    slug: 'correspondence',
    icon_name: 'Mail',
    title_ar: 'المراسلات',
    title_en: 'Correspondence',
    desc_ar: 'إعداد وصياغة المراسلات العلمية مع المجلات وردود المحكمين باحترافية',
    desc_en: 'Professional drafting of scientific correspondence with journals and responses to reviewers',
    color_class: 'from-rose-500 to-rose-700',
    roles: [...ADVANCED_ROLES],
  },
  {
    id: 'svc_publication',
    slug: 'publication',
    icon_name: 'Send',
    title_ar: 'النشر',
    title_en: 'Publication',
    desc_ar: 'خدمة متكاملة لنشر الأبحاث في مجلات علمية محكّمة ومعترف بها دولياً',
    desc_en: 'Integrated service for publishing research in peer-reviewed internationally recognized journals',
    color_class: 'from-orange-500 to-orange-700',
    roles: [...ADVANCED_ROLES],
  },
];

// =========================================================
// 4. دمج الخدمات حسب الدور
// =========================================================
const getVisibleServices = (role, baseServices) => {
  // باقي الأدوار: خدمات الوظائف المرتبطة فقط (من الـ API)
  if (!role || (!ADVANCED_ROLES.includes(role) && role !== UNDERGRAD_ROLE)) {
    return baseServices;
  }

  const existingSlugs = new Set(baseServices.map(s => s.slug));
  const roleServices = EXTRA_SERVICES.filter(
    svc => svc.roles.includes(role) && !existingSlugs.has(slug)
  );
  return [...baseServices, ...roleServices];
};

// =========================================================
// 5. بطاقة الخدمة
// =========================================================
const ServiceCard = ({ service, currentLang, index }) => {
  const Icon = getServiceIcon(service.icon_name);
  const title = currentLang === 'ar' ? service.title_ar : service.title_en;
  const desc = currentLang === 'ar' ? service.desc_ar : service.desc_en;

  return (
    <motion.a
      href={`/services/${service.slug}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-[#c8a44e]/30 transition-all duration-300 flex flex-col"
    >
      <div className={`h-3 bg-gradient-to-l ${service.color_class || 'from-[#0a1628] to-[#1a2744]'}`} />
      <div className="p-6 flex-1 flex flex-col">
        <div className="w-12 h-12 bg-[#c8a44e]/10 text-[#c8a44e] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c8a44e] group-hover:text-white transition-colors duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-[#0a1628] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
          {desc}
        </p>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#c8a44e] group-hover:gap-2.5 transition-all">
          <span>{currentLang === 'ar' ? 'استكشف الخدمة' : 'Explore'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.a>
  );
};

// =========================================================
// 6. بطاقة إحصائيات سريعة
// =========================================================
const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
  >
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-black text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </div>
  </motion.div>
);

// =========================================================
// 7. محتوى الصفحات الداخلية (Placeholders) — شاشات مشتركة
// =========================================================
const PlaceholderPage = ({ title, icon: Icon, description }) => (
  <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-20 h-20 bg-[#c8a44e]/10 text-[#c8a44e] rounded-2xl flex items-center justify-center mb-6">
      <Icon className="w-10 h-10" />
    </div>
    <h2 className="text-2xl font-black text-[#0a1628] mb-3">{title}</h2>
    <p className="text-sm text-gray-500 max-w-md">{description}</p>
  </div>
);

// =========================================================
// 8. المكون الرئيسي
// =========================================================
const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/get_services.php`);
        const result = await res.json();
        if (result.status === 'success') {
          setServices(result.data);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // ✅ محتوى الصفحة الرئيسية
  const HomeContent = ({ userData, services: visibleServices }) => {
    const getRoleName = (role) => {
      const names = {
        undergrad: 'طالب بكالوريوس',
        grad: 'طالب ماجستير',
        phd: 'طالب دكتوراه',
        faculty: 'دكتور أكاديمي',
        researcher: 'باحث',
        university: 'جامعة',
        college: 'كلية',
        research_center: 'مركز بحثي',
        ministry: 'وزارة',
        super_admin: 'مدير النظام',
      };
      return names[role] || role;
    };

    return (
      <div className="space-y-8">
        {/* رسالة الترحيب */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-l from-[#0a1628] to-[#1a2744] rounded-2xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 end-0 w-60 h-60 bg-[#c8a44e]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10">
            <p className="text-[#c8a44e] text-sm font-bold mb-1">
              {currentLang === 'ar' ? 'مرحباً بك في' : 'Welcome to'}
            </p>
            <h1 className="text-2xl md:text-3xl font-black mb-2">{userData?.name}</h1>
            <p className="text-gray-400 text-sm flex items-center gap-2 flex-wrap">
              <span className="bg-[#c8a44e]/20 text-[#c8a44e] px-2.5 py-0.5 rounded-full text-xs font-bold">
                {getRoleName(userData?.role)}
              </span>
              <span>•</span>
              <span>{userData?.email}</span>
            </p>
          </div>
        </motion.div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={BookOpen}
            label={currentLang === 'ar' ? 'خدمات المنصة' : 'Platform Services'}
            value={visibleServices.length || 0}
            color="bg-[#c8a44e]/10 text-[#c8a44e]"
          />
          <StatCard
            icon={FileText}
            label={currentLang === 'ar' ? 'تقديماتي' : 'My Submissions'}
            value="0"
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon={BarChart3}
            label={currentLang === 'ar' ? 'الإحصائيات' : 'Statistics'}
            value="--"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={User}
            label={currentLang === 'ar' ? 'إشعارات' : 'Notifications'}
            value="0"
            color="bg-orange-50 text-orange-600"
          />
        </div>

        {/* قسم الخدمات */}
        <div>
          <h2 className="text-xl font-black text-[#0a1628] mb-5 flex items-center gap-2">
            {currentLang === 'ar' ? 'استكشف خدماتنا' : 'Explore Our Services'}
          </h2>

          {isLoadingServices ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : visibleServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  currentLang={currentLang}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-gray-400">{currentLang === 'ar' ? 'لا توجد خدمات حالياً' : 'No services available'}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ✅ محتوى صفحة الخدمات
  const ServicesContent = ({ services: visibleServices }) => (
    <div>
      <h2 className="text-xl font-black text-[#0a1628] mb-5">
        {currentLang === 'ar' ? 'جميع الخدمات' : 'All Services'}
      </h2>
      {isLoadingServices ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
              <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visibleServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} currentLang={currentLang} index={index} />
          ))}
        </div>
      )}
    </div>
  );

  // ✅ توجيه المحتوى حسب الصفحة النشطة (شاشات مشتركة لجميع الأدوار)
  const getPageContent = (activePage, userData) => {
    const visibleServices = getVisibleServices(userData?.role, services);

    switch (activePage) {
      case 'home':
        return <HomeContent userData={userData} services={visibleServices} />;
      case 'services':
        return <ServicesContent services={visibleServices} />;

      case 'profile':
        return <PlaceholderPage
          icon={User}
          title={currentLang === 'ar' ? 'ملفي الشخصي' : 'My Profile'}
          description={currentLang === 'ar' ? 'إدارة بياناتك الشخصية وتفضيلات الحساب' : 'Manage your personal data and account preferences'}
        />;
      case 'submissions':
        return <PlaceholderPage
          icon={FileText}
          title={currentLang === 'ar' ? 'تقديماتي' : 'My Submissions'}
          description={currentLang === 'ar' ? 'تتبع حالة التقديمات والمشاركات الخاصة بك' : 'Track the status of your submissions and contributions'}
        />;
      case 'research':
        return <PlaceholderPage
          icon={FlaskConical}
          title={currentLang === 'ar' ? 'أبحاثي' : 'My Research'}
          description={currentLang === 'ar' ? 'إدارة الأبحاث والمشاريع البحثية' : 'Manage your research and academic contributions'}
        />;
      case 'publications':
        return <PlaceholderPage
          icon={BookOpen}
          title={currentLang === 'ar' ? 'منشوراتي' : 'My Publications'}
          description={currentLang === 'ar' ? 'عرض وإدارة الأوراق البحثية المنشورة' : 'View and manage your published research papers'}
        />;
      case 'reviews':
        return <PlaceholderPage
          icon={ExternalLink}
          title={currentLang === 'ar' ? 'طلبات التحكيم' : 'Review Requests'}
          description={currentLang === 'ar' ? 'عرض طلبات التحكيم الواردة والتعامل معها' : 'View and manage incoming review requests'}
        />;
      case 'my_reviews':
        return <PlaceholderPage
          icon={CheckCircle}
          title={currentLang === 'ar' ? 'تحكيماتي' : 'My Reviews'}
          description={currentLang === 'ar' ? 'سجل التحكيمات التي أجريتها سابقاً' : 'History of reviews you have completed'}
        />;
      case 'members':
        return <PlaceholderPage
          icon={User}
          title={currentLang === 'ar' ? 'الأعضاء' : 'Members'}
          description={currentLang === 'ar' ? 'إدارة أعضاء المؤسسة وصلاحياتهم' : 'Manage institution members and their permissions'}
        />;
      case 'reports':
        return <PlaceholderPage
          icon={BarChart3}
          title={currentLang === 'ar' ? 'التقارير' : 'Reports'}
          description={currentLang === 'ar' ? 'عرض التقارير والإحصائيات التفصيلية' : 'View detailed reports and analytics'}
        />;
      case 'stats':
        return <PlaceholderPage
          icon={BarChart3}
          title={currentLang === 'ar' ? 'الإحصائيات' : 'Statistics'}
          description={currentLang === 'ar' ? 'إحصائيات شاملة عن الأنشطة والأبحاث' : 'Comprehensive statistics on activities and research'}
        />;
      default:
        return <HomeContent userData={userData} services={visibleServices} />;
    }
  };

  return (
    <DashboardLayout>
      {({ activePage, userData }) => getPageContent(activePage, userData)}
    </DashboardLayout>
  );
};

export default DashboardPage;