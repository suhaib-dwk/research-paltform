import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowUpRight, BookOpen, FileText } from 'lucide-react';
import { useSite } from '../../SiteContext';
import { getVisibleServices, ADVANCED_ROLES } from '../../components/dashboard/DashboardSidebar';
import { SERVICES_INDEX_DETAILS } from '../../data/servicesIndexData';

// =========================================================
// فهرس الخدمات (/dashboard/services)
// صفحة مستقلة تعرض كل الخدمات المتاحة لدور المستخدم كبطاقات،
// وتفتح نافذة تفاصيل عند النقر على أي خدمة — بدل القائمة المنسدلة
// السابقة داخل الشريط الجانبي (DashboardSidebar).
// =========================================================

const ServiceDetailModal = ({ service, onClose, onBegin, isAr }) => {
  const details = SERVICES_INDEX_DETAILS[service.slug];
  const Icon = service.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-[#211c18] rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-[#211c18] p-6 pb-4 flex items-start justify-between border-b border-gray-100 dark:border-[#3a322c]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-brand-orange to-[#f0916d] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-orange/20">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              {isAr ? service.label_ar : service.label_en}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2a231e] rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              {isAr ? 'ما هذه الخدمة' : 'What this service is for'}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {isAr ? details.what_ar : details.what_en}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-gray-50 dark:bg-[#1a1613] rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                {isAr ? 'الصيغة' : 'Format'}
              </p>
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                {isAr ? details.format_ar : details.format_en}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-[#1a1613] rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                {isAr ? 'التركيز' : 'Focus'}
              </p>
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                {isAr ? details.focus_ar : details.focus_en}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-[#1a1613] rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                {isAr ? 'الخطوة التالية' : 'Next'}
              </p>
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                {isAr ? details.next_ar : details.next_en}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              {isAr ? 'قبل أن تبدأ' : 'Before you begin'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {isAr ? details.before_ar : details.before_en}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1a1613] rounded-xl hover:bg-gray-200 dark:hover:bg-[#2a231e] transition-colors"
            >
              {isAr ? 'العودة للفهرس' : 'Back to catalogue'}
            </button>
            <button
              onClick={onBegin}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-brand-orange rounded-xl hover:bg-[#d4502a] transition-colors"
            >
              {isAr ? 'ابدأ الخدمة' : 'Begin this service'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesIndexPage = () => {
  const { user: userData, currentLang } = useSite();
  const isAr = currentLang === 'ar';
  const navigate = useNavigate();

  const visibleServices = getVisibleServices(userData?.role);
  const [activeService, setActiveService] = useState(null);
  // ✅ "الأبحاث" ليست خدمة تُطلب من مزوّد (بلا modal/تفاصيل) بل صفحة إدارة
  // أبحاث المستخدم نفسه — تظهر هنا كرابط مباشر بنفس شكل بطاقة الخدمة،
  // فقط للأدوار الأكاديمية المتقدمة (grad/phd/researcher/faculty).
  const showResearchesCard = ADVANCED_ROLES.includes(userData?.role);

  const handleBegin = (slug) => {
    setActiveService(null);
    navigate(`/dashboard/services/${slug}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-brand-orange" />
          {isAr ? 'الخدمات' : 'Services'}
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {isAr
            ? `${visibleServices.length + (showResearchesCard ? 1 : 0)} خدمات متاحة لدورك — اضغط على أي خدمة لعرض تفاصيلها`
            : `${visibleServices.length + (showResearchesCard ? 1 : 0)} services available for your role — click any service to view its details`}
        </p>
      </div>

      {visibleServices.length === 0 && !showResearchesCard ? (
        <div className="bg-white dark:bg-[#211c18] rounded-2xl border-2 border-dashed border-gray-200 dark:border-[#3a322c] p-16 text-center text-gray-400 dark:text-gray-500">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-bold text-lg">{isAr ? 'لا توجد خدمات متاحة لدورك حالياً' : 'No services available for your role yet'}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400">
              {isAr ? 'الخدمات المتاحة' : 'Available Services'}
            </h2>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
              {visibleServices.length + (showResearchesCard ? 1 : 0)} {isAr ? 'خدمة' : 'services'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {showResearchesCard && (
              <button
                onClick={() => navigate('/dashboard/researches')}
                className="text-start bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/60 p-5 hover:border-brand-orange/40 dark:hover:border-brand-orange/30 hover:shadow-lg hover:shadow-brand-orange/5 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-brand-orange to-[#f0916d] rounded-xl flex items-center justify-center shadow-md shadow-brand-orange/20 flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-brand-orange transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                  {isAr ? 'الأبحاث' : 'Researches'}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">
                  {isAr ? 'إدارة أبحاثك المسجّلة وتقديم بحث جديد' : 'Manage your registered research and submit a new one'}
                </p>
              </button>
            )}
            {visibleServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <button
                  key={svc.id}
                  onClick={() => setActiveService(svc)}
                  className="text-start bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/60 p-5 hover:border-brand-orange/40 dark:hover:border-brand-orange/30 hover:shadow-lg hover:shadow-brand-orange/5 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-brand-orange to-[#f0916d] rounded-xl flex items-center justify-center shadow-md shadow-brand-orange/20 flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-brand-orange transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                    {isAr ? svc.label_ar : svc.label_en}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">
                    {isAr ? SERVICES_INDEX_DETAILS[svc.slug]?.what_ar : SERVICES_INDEX_DETAILS[svc.slug]?.what_en}
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
