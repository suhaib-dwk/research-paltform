import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSite } from '../../SiteContext';
import { resolveUploadUrl } from '../../api';
import {
  ChevronDown, Clock, CheckCircle, AlertCircle,
  FileText, Eye, Info, Lightbulb, HelpCircle,
  ListChecks, Shield, ArrowRight
} from 'lucide-react';

// =========================================================
// حالات الطلبات الافتراضية
// =========================================================
const DEFAULT_STATUSES = {
  pending:          { label_ar: 'قيد الانتظار',           label_en: 'Pending',           cls: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',       icon: Clock },
  in_progress:      { label_ar: 'قيد التنفيذ',           label_en: 'In Progress',       cls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',     icon: Clock },
  needs_info:       { label_ar: 'بحاجة إلى معلومات',    label_en: 'Needs Info',        cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',  icon: AlertCircle },
  revision_needed:  { label_ar: 'بحاجة إلى تعديل',      label_en: 'Revision Needed',   cls: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400', icon: AlertCircle },
  completed:        { label_ar: 'مكتمل',                label_en: 'Completed',         cls: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', icon: CheckCircle },
  cancelled:        { label_ar: 'ملغي',                 label_en: 'Cancelled',         cls: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',         icon: AlertCircle },
  scheduled:        { label_ar: 'مجدول',                label_en: 'Scheduled',         cls: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400', icon: Clock },
  draft:            { label_ar: 'مسودة',                label_en: 'Draft',             cls: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',       icon: FileText },
  submitted:        { label_ar: 'تم الإرسال',           label_en: 'Submitted',         cls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',     icon: CheckCircle },
  accepted:         { label_ar: 'مقبول',                label_en: 'Accepted',          cls: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', icon: CheckCircle },
  rejected:         { label_ar: 'مرفوض',                label_en: 'Rejected',          cls: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',         icon: AlertCircle },
  under_review:     { label_ar: 'قيد المراجعة',         label_en: 'Under Review',      cls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',     icon: Clock },
};

// =========================================================
// المكون الرئيسي
// =========================================================
const ServicePageWrapper = ({
  icon: Icon,
  title,
  description,
  gradient,
  shadowColor,
  guideSections = [],
  mockRequests = [],
  loadingRequests = false,
  statuses = DEFAULT_STATUSES,
  hideRequestsTab = false,
  requestsTabLabel_ar,
  requestsTabLabel_en,
  renderRequestCard,
  children,
}) => {
  const { currentLang, isRTL } = useSite();
  const isAr = currentLang === 'ar';

  const tabs = [
    { key: 'service', label_ar: 'الخدمة', label_en: 'Service' },
    { key: 'guide', label_ar: 'دليل الخدمة', label_en: 'Service Guide' },
    ...(!hideRequestsTab ? [{ key: 'requests', label_ar: requestsTabLabel_ar || 'طلباتي', label_en: requestsTabLabel_en || 'My Requests' }] : []),
  ];

  const [activeTab, setActiveTab] = useState('service');
  const [openSections, setOpenSections] = useState([guideSections[0]?.id]);
  const [filterStatus, setFilterStatus] = useState('all');

  const toggleSection = (id) => {
    setOpenSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // فلتر الحالات من البيانات الفعلية
  const usedStatuses = useMemo(() => {
    const set = new Set(mockRequests.map(r => r.status));
    return ['all', ...Array.from(set)];
  }, [mockRequests]);

  const filteredRequests = filterStatus === 'all'
    ? mockRequests
    : mockRequests.filter(r => r.status === filterStatus);

  const getStatus = (key) => statuses[key] || DEFAULT_STATUSES[key] || DEFAULT_STATUSES.pending;
  const StatusIcon = (key) => { const s = getStatus(key); return s.icon || Clock; };

  // ---- بطاقة طلب افتراضية ----
  const DefaultRequestCard = ({ req }) => {
    const sc = getStatus(req.status);
    const ScIcon = sc.icon || Clock;

    return (
      <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 p-5 hover:border-brand-orange/20 dark:hover:border-brand-orange/15 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gray-100 dark:bg-[#2a231e] rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 truncate">
                {isAr ? req.title_ar : req.title_en}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{req.date}</span>
                {req.meta_ar && <span>{isAr ? req.meta_ar : req.meta_en}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:flex-shrink-0">
            {req.score != null && (
              <div className="text-center px-2">
                <div className="text-lg font-black text-brand-orange">{req.score}%</div>
                <div className="text-[10px] text-gray-400">{isAr ? 'النتيجة' : 'Score'}</div>
              </div>
            )}
            <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${sc.cls}`}>
              <ScIcon className="w-3 h-3" />
              {isAr ? sc.label_ar : sc.label_en}
            </span>
            {req.status === 'completed' && (
              <button className="p-2 rounded-xl text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 transition-all">
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* صندوق "بحاجة إلى معلومات" */}
        {req.status === 'needs_info' && req.info_needed_ar && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#3a322c]/30">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-orange-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/30">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                  {isAr ? 'معلومات مطلوبة:' : 'Information required:'}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                  {isAr ? req.info_needed_ar : req.info_needed_en}
                </p>
                <button className="mt-2 text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:underline">
                  {isAr ? 'تقديم المعلومات' : 'Provide Info'} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* صندوق "بحاجة إلى تعديل" */}
        {req.status === 'revision_needed' && req.revision_note_ar && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#3a322c]/30">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/15 border border-orange-200 dark:border-orange-800/30">
              <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-orange-700 dark:text-orange-300 mb-1">
                  {isAr ? 'ملاحظات التعديل:' : 'Revision notes:'}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 leading-relaxed">
                  {isAr ? req.revision_note_ar : req.revision_note_en}
                </p>
                <button className="mt-2 text-[11px] font-bold text-orange-800 dark:text-orange-300 hover:underline">
                  {isAr ? 'تقديم التعديلات' : 'Submit Revisions'} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* شريط تقدم لقيد التنفيذ */}
                        {/* شريط التقدم لقيد التنفيذ */}
                {req.status === 'in_progress' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#3a322c]/30">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">{isAr ? 'التقدم' : 'Progress'}</span>
                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{req.progress || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-[#3a322c] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${req.progress || 0}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-l from-blue-500 to-blue-400 rounded-full"
                            />
                        </div>
                    </div>
                )}

                {/* ✅ ملاحظات المحكم + مرفق الملف — للطلبات المكتملة */}
                {req.status === 'completed' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#3a322c]/30 space-y-3">
                        {/* ملاحظات المحكم */}
                        {req.reviewer_notes && (
                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{isAr ? 'تقرير المحكم:' : 'Reviewer Report'}</span>
                                </div>
                                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 leading-relaxed whitespace-pre-wrap">{req.reviewer_notes}</p>
                            </div>
                        )}

                        {/* مرفق الملف بعد التحكيم (file_path) أو نتيجة الخدمة (result_file_path) + زر التنزيل */}
                        {(req.file_path || req.result_file_path) && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <a
                                    href={resolveUploadUrl(req.result_file_path || req.file_path)}
                                    download={req.result_file_name || req.file_name}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:text-[#d4502a] bg-brand-orange/10 hover:bg-brand-orange/20 px-3 py-2 rounded-lg transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    {req.result_file_path
                                      ? (isAr ? 'تحميل ملف النتيجة' : 'Download Result File')
                                      : (isAr ? 'تحميل الملف المُراجع' : 'Download Reviewed File')}
                                </a>
                                {(req.result_file_size || req.file_size) && (
                                    <span className="text-[10px] text-gray-400">({formatFileSize(req.result_file_size || req.file_size)})</span>
                                )}
                            </div>
                        )}
                        {/* ملاحظات نتيجة الخدمة (result_notes) — للخدمات الثماني الجديدة */}
                        {req.result_notes && (
                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{isAr ? 'ملاحظات مقدّم الخدمة:' : 'Provider Notes:'}</span>
                                </div>
                                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 leading-relaxed whitespace-pre-wrap">{req.result_notes}</p>
                            </div>
                        )}

                        {/* التقييم */}
                        {req.score != null && (
                            <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${req.score >= 80 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : req.score >= 60 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
                                    {req.score}
                                </div>
                                <span className="text-[11px] text-gray-400">{isAr ? 'من 100' : 'out of 100'}</span>
                            </div>
                        )}
                    </div>
                )}
      </div>
    );
  };

  const CardRenderer = renderRequestCard || DefaultRequestCard;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ---- رأس الصفحة ---- */}
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg ${shadowColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{isAr ? title.ar : title.en}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{isAr ? description.ar : description.en}</p>
        </div>
      </div>

      {/* ---- شريط التبويبات ---- */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-[#1a1613] rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-white dark:bg-[#211c18] text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {isAr ? tab.label_ar : tab.label_en}
            {tab.key === 'requests' && mockRequests.length > 0 && (
              <span className={`ms-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-brand-orange/15 text-brand-orange' : 'bg-gray-200 dark:bg-[#3a322c] text-gray-500 dark:text-gray-400'
              }`}>
                {mockRequests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ---- تبويب: الخدمة ---- */}
      {activeTab === 'service' && children}

      {/* ---- تبويب: دليل الخدمة ---- */}
      {activeTab === 'guide' && (
        <div className="space-y-3">
          {guideSections.length === 0 ? (
            <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 p-10 text-center">
              <HelpCircle className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 dark:text-gray-500">{isAr ? 'لا يوجد دليل متاح حالياً' : 'No guide available yet'}</p>
            </div>
          ) : (
            guideSections.map(section => {
              const isOpen = openSections.includes(section.id);
              return (
                <div key={section.id} className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-[#2a231e]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 dark:bg-[#2a231e] rounded-lg flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white text-start">
                        {isAr ? section.title_ar : section.title_en}
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 ms-3"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0">
                          <div className="border-t border-gray-100 dark:border-[#3a322c]/30 pt-4">
                            {/* قائمة عناصر */}
                            {section.items_ar && (
                              <ul className="space-y-2.5">
                                {section.items_ar.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2.5">
                                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-b ${gradient} mt-1.5 flex-shrink-0`} />
                                    <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                      {isAr ? item : (section.items_en?.[i] || item)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {/* محتوى غني (JSX) */}
                            {section.content && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
                                {section.content}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ---- تبويب: الطلبات ---- */}
            {/* ---- تبويب: الطلبات ---- */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* ✅ حالة التحميل */}
          {loadingRequests ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-2 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
              <p className="text-sm text-gray-400">{isAr ? 'جارٍ تحميل الطلبات...' : 'Loading requests...'}</p>
            </div>
          ) : mockRequests.length === 0 ? (
            <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 p-12 text-center">
              <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 dark:text-gray-500 mb-4">
                {isAr ? 'لا توجد طلبات سابقة' : 'No previous requests'}
              </p>
              <button
                onClick={() => setActiveTab('service')}
                className="px-4 py-2 bg-brand-orange/10 text-brand-orange text-sm font-semibold rounded-xl hover:bg-brand-orange/20 transition-colors"
              >
                {isAr ? 'ابدأ الآن' : 'Start Now'} →
              </button>
            </div>
          ) : (
            <>
              {/* فلتر الحالات */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {usedStatuses.map(key => {
                  const sc = key === 'all'
                    ? { label_ar: 'الكل', label_en: 'All', cls: '' }
                    : getStatus(key);
                  return (
                    <button
                      key={key}
                      onClick={() => setFilterStatus(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        filterStatus === key
                          ? 'bg-brand-orange/10 text-brand-orange'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a231e]'
                      }`}
                    >
                      {isAr ? sc.label_ar : sc.label_en}
                    </button>
                  );
                })}
              </div>

              {/* قائمة الطلبات */}
              <div className="space-y-3">
                {filteredRequests.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">{isAr ? 'لا توجد نتائج' : 'No results'}</p>
                ) : (
                  filteredRequests.map(req => (
                    <CardRenderer key={req.id} req={req} />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ServicePageWrapper;