import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSite } from '../../SiteContext';
import { ShieldCheck, CheckCircle, Clock, FileText, Eye, MessageSquare, Filter } from 'lucide-react';

const REVIEW_TYPES = [
  { id: 'initial', label_ar: 'تحكيم أولي', label_en: 'Initial Review', desc_ar: 'تقييم أولي سريع لمدى ملاءمة البحث', desc_en: 'Quick initial assessment of research suitability', color: 'from-blue-500 to-blue-600', shadowColor: 'shadow-blue-500/20' },
  { id: 'expert', label_ar: 'تحكيم خبير', label_en: 'Expert Review', desc_ar: 'تحكيم متعمق من متخصص في المجال', desc_en: 'In-depth review by a field specialist', color: 'from-violet-500 to-violet-600', shadowColor: 'shadow-violet-500/20' },
  { id: 'final', label_ar: 'تحكيم نهائي', label_en: 'Final Review', desc_ar: 'مراجعة نهائية شاملة قبل النشر', desc_en: 'Comprehensive final review before publication', color: 'from-emerald-500 to-emerald-600', shadowColor: 'shadow-emerald-500/20' },
];

const MOCK_REVIEWS = {
  initial: [
    { id: 1, title_ar: 'بحث في تعلم الآلة', title_en: 'Machine Learning Research', status: 'completed', date: '2025-01-10', score: 78 },
    { id: 2, title_ar: 'بحث في الطب الجيني', title_en: 'Genetic Medicine Research', status: 'in_progress', date: '2025-01-14', score: null },
  ],
  expert: [
    { id: 3, title_ar: 'بحث الهوية الرقمية', title_en: 'Digital Identity Research', status: 'in_progress', date: '2025-01-12', score: null },
  ],
  final: [
    { id: 4, title_ar: 'بحث الأمن السيبراني', title_en: 'Cybersecurity Research', status: 'pending', date: '2025-01-15', score: null },
  ],
};

const ReviewsPage = () => {
  const { t } = useTranslation();
  const { currentLang, isRTL } = useSite();
  const isAr = currentLang === 'ar';

  const [activeTab, setActiveTab] = useState('initial');
  const [filterStatus, setFilterStatus] = useState('all');

  const reviews = MOCK_REVIEWS[activeTab] || [];
  const filteredReviews = filterStatus === 'all' ? reviews : reviews.filter(r => r.status === filterStatus);

  const statusConfig = {
    completed: { label_ar: 'مكتمل', label_en: 'Completed', cls: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
    in_progress: { label_ar: 'قيد التنفيذ', label_en: 'In Progress', cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
    pending: { label_ar: 'قيد الانتظار', label_en: 'Pending', cls: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
  };

  const activeType = REVIEW_TYPES.find(rt => rt.id === activeTab);

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${activeType.color} rounded-2xl flex items-center justify-center shadow-lg ${activeType.shadowColor}`}>
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{isAr ? 'التحكيم' : 'Review'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isAr ? 'إدارة طلبات التحكيم ومتابعتها' : 'Manage and track review requests'}
          </p>
        </div>
      </div>

      {/* تبويبات أنواع التحكيم */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {REVIEW_TYPES.map(rt => {
          const count = (MOCK_REVIEWS[rt.id] || []).length;
          const isActive = activeTab === rt.id;
          return (
            <button
              key={rt.id}
              onClick={() => { setActiveTab(rt.id); setFilterStatus('all'); }}
              className={`relative text-start p-4 rounded-2xl border-2 transition-all overflow-hidden ${
                isActive
                  ? 'border-transparent shadow-lg'
                  : 'border-gray-200 dark:border-[#1e3050] hover:border-gray-300 dark:hover:border-[#2a3a5c]'
              }`}
              style={isActive ? { background: `linear-gradient(135deg, var(--tw-gradient-stops))` } : {}}
            >
              {isActive && (
                <div className={`absolute inset-0 bg-gradient-to-br ${rt.color} opacity-10`} />
              )}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-bold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {isAr ? rt.label_ar : rt.label_en}
                  </h3>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-gray-800 dark:text-white' : 'bg-gray-200 dark:bg-[#1e3050] text-gray-500 dark:text-gray-400'
                  }`}>
                    {count}
                  </span>
                </div>
                <p className={`text-[12px] leading-relaxed ${isActive ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {isAr ? rt.desc_ar : rt.desc_en}
                </p>
                {isActive && (
                  <div className={`mt-3 h-0.5 w-8 rounded-full bg-gradient-to-r ${rt.color}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* فلتر الحالة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex gap-1">
            {[
              { key: 'all', label_ar: 'الكل', label_en: 'All' },
              { key: 'pending', label_ar: 'قيد الانتظار', label_en: 'Pending' },
              { key: 'in_progress', label_ar: 'قيد التنفيذ', label_en: 'In Progress' },
              { key: 'completed', label_ar: 'مكتمل', label_en: 'Completed' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === f.key
                    ? 'bg-[#c8a44e]/10 text-[#c8a44e]'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a2744]'
                }`}
              >
                {isAr ? f.label_ar : f.label_en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* قائمة التحكيمات */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-12 text-center">
          <ShieldCheck className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 dark:text-gray-500">{isAr ? 'لا توجد تحكيمات' : 'No reviews found'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map(review => {
            const sc = statusConfig[review.status];
            return (
              <div key={review.id} className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5 hover:border-[#c8a44e]/30 dark:hover:border-[#c8a44e]/20 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-[#1a2744] rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                        {isAr ? review.title_ar : review.title_en}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {review.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          {isAr ? activeType.label_ar : activeType.label_en}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-shrink-0">
                    {review.score !== null && (
                      <div className="text-center">
                        <div className="text-lg font-black text-[#c8a44e]">{review.score}%</div>
                        <div className="text-[10px] text-gray-400">{isAr ? 'النتيجة' : 'Score'}</div>
                      </div>
                    )}
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.cls}`}>
                      {isAr ? sc.label_ar : sc.label_en}
                    </span>
                    <button className="p-2 rounded-xl text-gray-400 hover:text-[#c8a44e] hover:bg-[#c8a44e]/10 transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;