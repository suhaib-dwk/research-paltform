import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, ArrowUpRight, BookOpen, FileText, Grid } from "lucide-react";
import { useSite } from "../SiteContext";
import {
  getVisibleServices,
  ADVANCED_ROLES,
} from "../shared-academic/DashboardSidebar";
import { SERVICES_INDEX_DETAILS } from "../sharedServices/servicesIndexData";

// =========================================================
// ServiceDetailModal (محسنة العرض والنصوص)
// =========================================================
const ServiceDetailModal = ({ service, onClose, onBegin, isAr }) => {
  const details = SERVICES_INDEX_DETAILS[service.slug];
  const Icon = service.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* تم توسيع النافذة لتكون max-w-2xl لتستوعب النصوص بشكل أفضل */}
      <div className="relative bg-white dark:bg-brand-dark-card rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-brand-dark-card p-8 pb-6 flex items-start justify-between border-b border-gray-100 dark:border-brand-dark-border z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-orange-light rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-orange/30 ring-4 ring-white dark:ring-brand-dark-card">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                {isAr ? service.label_ar : service.label_en}
              </h3>
              <p className="text-sm text-brand-orange font-semibold mt-1">
                {isAr ? "تفاصيل الخدمة" : "Service Details"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-brand-dark-hover rounded-xl transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* What this service is for */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-orange mb-3">
              {isAr ? "ما هذه الخدمة؟" : "What this service is for"}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              {isAr ? details.what_ar : details.what_en}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-brand-dark rounded-2xl p-5 border border-gray-100 dark:border-brand-dark-border text-center hover:border-brand-orange/30 dark:hover:border-brand-orange/20 transition-colors">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                {isAr ? "الصيغة" : "Format"}
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                {isAr ? details.format_ar : details.format_en}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-brand-dark rounded-2xl p-5 border border-gray-100 dark:border-brand-dark-border text-center hover:border-brand-orange/30 dark:hover:border-brand-orange/20 transition-colors">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                {isAr ? "التركيز" : "Focus"}
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                {isAr ? details.focus_ar : details.focus_en}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-brand-dark rounded-2xl p-5 border border-gray-100 dark:border-brand-dark-border text-center hover:border-brand-orange/30 dark:hover:border-brand-orange/20 transition-colors">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                {isAr ? "الخطوة التالية" : "Next"}
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                {isAr ? details.next_ar : details.next_en}
              </p>
            </div>
          </div>

          {/* Before you begin */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              {isAr ? "قبل أن تبدأ" : "Before you begin"}
            </p>
            <div className="bg-brand-orange/5 dark:bg-brand-orange/5 p-6 rounded-2xl border border-brand-orange/10 dark:border-brand-orange/10">
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {isAr ? details.before_ar : details.before_en}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 text-base font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-brand-dark rounded-2xl hover:bg-gray-200 dark:hover:bg-brand-dark-hover transition-colors"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button
              onClick={onBegin}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-white bg-brand-orange rounded-2xl hover:bg-brand-orange-dark transition-colors shadow-lg shadow-brand-orange/30 transform active:scale-[0.98]"
            >
              {isAr ? "ابدأ الخدمة الآن" : "Begin this service"}
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// ServicesIndexPage (محسنة التنسيق والمساحة)
// =========================================================
const ServicesIndexPage = () => {
  const { user: userData, currentLang } = useSite();
  const isAr = currentLang === "ar";
  const navigate = useNavigate();

  // ✅ جلب الـ slug من الرابط
  const { slug } = useParams();

  const visibleServices = getVisibleServices(userData?.role);
  const [activeService, setActiveService] = useState(null);
  const showResearchesCard = ADVANCED_ROLES.includes(userData?.role);

  // ✅ useEffect للتعامل مع فتح المودال إذا كان هناك slug في الرابط
  useEffect(() => {
    if (slug) {
      // ابحث عن الخدمة المطابقة للـ slug
      const service = visibleServices.find((s) => s.slug === slug);
      if (service) {
        setActiveService(service); // فتح المودال تلقائياً
      }
    }
  }, [slug, visibleServices]);

  const handleBegin = (slug) => {
    setActiveService(null);
    navigate(`/academic/services/${slug}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-4 tracking-tight">
          <div className="p-3 bg-brand-orange/10 rounded-2xl ring-4 ring-brand-orange/5">
            <BookOpen className="w-10 h-10 text-brand-orange" />
          </div>
          {isAr ? "مركز الخدمات" : "Services Hub"}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-4 max-w-3xl leading-relaxed">
          {isAr
            ? `تصفح واستكشف الخدمات المتاحة لدورك الأكاديمي. لديك ${visibleServices.length + (showResearchesCard ? 1 : 0)} خدمة جاهزة للاستخدام.`
            : `Browse and explore services available for your academic role. You have ${visibleServices.length + (showResearchesCard ? 1 : 0)} services ready to use.`}
        </p>
      </div>

      {visibleServices.length === 0 && !showResearchesCard ? (
        <div className="bg-white dark:bg-brand-dark-card rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-brand-dark-border p-24 text-center text-gray-400 dark:text-gray-500">
          <div className="w-24 h-24 bg-gray-50 dark:bg-brand-dark rounded-full flex items-center justify-center mx-auto mb-6">
             <BookOpen className="w-12 h-12 opacity-30" />
          </div>
          <p className="font-bold text-2xl text-gray-600 dark:text-gray-300 mb-2">
            {isAr ? "لا توجد خدمات متاحة" : "No services available"}
          </p>
          <p className="text-base">
            {isAr
              ? "يرجى التواصل مع الإدارة لتفعيل الخدمات"
              : "Please contact administration to activate services"}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              {isAr ? "الخدمات المتاحة" : "Available Services"}
            </h2>
            <span className="text-sm font-bold px-4 py-1.5 bg-gray-100 dark:bg-brand-dark text-gray-500 dark:text-gray-400 rounded-full border border-gray-200 dark:border-brand-dark-border">
              {visibleServices.length + (showResearchesCard ? 1 : 0)}{" "}
              {isAr ? "خدمة" : "Services"}
            </span>
          </div>

          {/* تحسين الشبكة: مسافات أكبر (gap-8) وبطاقات أكثر ضخامة */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* بطاقة الأبحاث الخاصة */}
            {showResearchesCard && (
              <button
                onClick={() => navigate("/academic/researches")}
                className="group relative text-start bg-white dark:bg-brand-dark-card rounded-[2rem] border border-gray-200 dark:border-brand-dark-border/60 p-8 hover:border-blue-500/50 dark:hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0 ring-4 ring-white dark:ring-brand-dark-card">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/10 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors">
                    <ArrowUpRight className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {isAr ? "إدارة الأبحاث" : "Research Management"}
                </h3>
                <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {isAr
                    ? "الوصول إلى سجل أبحاثك، متابعة حالة النشر، وتقديم طلبات بحث جديدة بكفاءة عالية."
                    : "Access your research records, track publication status, and submit new research requests with high efficiency."}
                </p>
              </button>
            )}

            {/* بطاقات الخدمات */}
            {visibleServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <button
                  key={svc.id}
                  onClick={() => setActiveService(svc)}
                  className="group relative text-start bg-white dark:bg-brand-dark-card rounded-[2rem] border border-gray-200 dark:border-brand-dark-border/60 p-8 hover:border-brand-orange/50 dark:hover:border-brand-orange/40 hover:shadow-2xl hover:shadow-brand-orange/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-orange-light rounded-2xl flex items-center justify-center shadow-lg shadow-brand-orange/25 flex-shrink-0 ring-4 ring-white dark:ring-brand-dark-card">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="p-3 rounded-full bg-orange-50 dark:bg-orange-900/10 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20 transition-colors">
                      <ArrowUpRight className="w-6 h-6 text-brand-orange group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {isAr ? svc.label_ar : svc.label_en}
                  </h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {isAr
                      ? SERVICES_INDEX_DETAILS[svc.slug]?.what_ar
                      : SERVICES_INDEX_DETAILS[svc.slug]?.what_en}
                  </p>
                </button>
              );
            })}
          </div>
        </>
      )}

      {activeService && (
        <ServiceDetailModal
          service={activeService}
          isAr={isAr}
          onClose={() => setActiveService(null)}
          onBegin={() => handleBegin(activeService.slug)}
        />
      )}
    </div>
  );
};

export default ServicesIndexPage;