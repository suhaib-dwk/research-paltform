import { useState } from 'react';
import { useSite } from '../../SiteContext';
import ServicePageWrapper from './ServicePageWrapper';
import { BookMarked, Search, ExternalLink, TrendingUp, Globe, Filter, ListChecks, Lightbulb, HelpCircle } from 'lucide-react';

const FIELDS = [
  { id: 'cs', label_ar: 'علوم الحاسب', label_en: 'Computer Science' }, { id: 'med', label_ar: 'الطب', label_en: 'Medicine' },
  { id: 'eng', label_ar: 'الهندسة', label_en: 'Engineering' }, { id: 'sci', label_ar: 'العلوم الأساسية', label_en: 'Basic Sciences' }, { id: 'soc', label_ar: 'العلوم الاجتماعية', label_en: 'Social Sciences' },
];

const JOURNALS = [
  { id: 1, name: 'Nature Computing Science', q: 'Q1', if: 12.5, oa: true, field: 'cs', acc: 8 },
  { id: 2, name: 'IEEE Access', q: 'Q2', if: 3.9, oa: true, field: 'eng', acc: 35 },
  { id: 3, name: 'Journal of Medical Research', q: 'Q1', if: 9.2, oa: false, field: 'med', acc: 12 },
];

const MOCK = [
  { id: 1, title_ar: 'اختيار مجلة لبحث الذكاء الاصطناعي', title_en: 'Journal selection for AI research', status: 'completed', date: '2025-01-10', score: 92, meta_ar: 'علوم الحاسب · 5 مجلات مقترحة' },
  { id: 2, title_ar: 'اختيار مجلة لبحث الطب', title_en: 'Journal selection for medical research', status: 'in_progress', date: '2025-01-14', progress: 70, meta_ar: 'الطب · جاري البحث...' },
  { id: 3, title_ar: 'اختيار مجلة بحث الهندسة', title_en: 'Journal selection for engineering', status: 'needs_info', date: '2025-01-11', meta_ar: 'الهندسة', info_needed_ar: 'يرجى توضيح هل البحث باللغة العربية أم الإنجليزية، وهل تفضل مجلات وصول مفتوح فقط.' },
];

const JournalSelectionPage = () => {
  const { currentLang } = useSite();
  const isAr = currentLang === 'ar';
  const [field, setField] = useState('');
  const [query, setQuery] = useState('');
  const [minIF, setMinIF] = useState('');
  const [oaOnly, setOaOnly] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const filtered = JOURNALS.filter(j => {
    if (field && j.field !== field) return false;
    if (query && !j.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (minIF && j.if < parseFloat(minIF)) return false;
    if (oaOnly && !j.oa) return false;
    return true;
  });

  const qColor = (q) => ({ Q1: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', Q2: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', Q3: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', Q4: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' }[q] || 'bg-gray-100 text-gray-600');

  const guideSections = [
    { id: 'how', icon: ListChecks, title_ar: 'كيف تعمل الخدمة', title_en: 'How It Works', items_ar: ['حدد تخصص بحثك', 'أضف كلمات مفتاحية من العنوان', 'اضبط فلاتر معامل التأثير والوصول المفتوح', 'اعرض النتائج واطلب تقييم أي مجلة'], items_en: ['Select your field', 'Add keywords', 'Set IF and OA filters', 'View results and request evaluation'] },
    { id: 'features', icon: Lightbulb, title_ar: 'مزايا الخدمة', title_en: 'Features', items_ar: ['قاعدة بيانات شاملة للمجلات', 'فلترة ذكية حسب معايير متعددة', 'ربط مباشر مع خدمة تقييم المجلات', 'توصيات مخصصة لتخصصك'], items_en: ['Comprehensive journal database', 'Smart multi-criteria filtering', 'Direct link to journal evaluation', 'Personalized recommendations'] },
  ];

  const form = (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'التخصص' : 'Field'}</label>
            <select value={field} onChange={(e) => setField(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition">
              <option value="">{isAr ? 'الكل' : 'All'}</option>{FIELDS.map(f => <option key={f.id} value={f.id}>{isAr ? f.label_ar : f.label_en}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'بحث' : 'Search'}</label>
            <div className="relative"><Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" /><input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setShowResults(true); }} placeholder={isAr ? 'اسم المجلة...' : 'Journal name...'} className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition" /></div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'أدنى IF' : 'Min IF'}</label>
            <input type="number" value={minIF} onChange={(e) => { setMinIF(e.target.value); setShowResults(true); }} placeholder="0" step="0.1" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={oaOnly} onChange={(e) => { setOaOnly(e.target.checked); setShowResults(true); }} className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" /><span className="text-sm text-gray-600 dark:text-gray-400">{isAr ? 'وصول مفتوح فقط' : 'Open Access Only'}</span></label>
          <button onClick={() => setShowResults(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl transition-colors">{isAr ? 'بحث' : 'Search'}</button>
        </div>
      </div>
      {showResults && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">{isAr ? `${filtered.length} مجلة` : `${filtered.length} journals`}</p>
          {filtered.map(j => (
            <div key={j.id} className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-4 hover:border-cyan-300 dark:hover:border-cyan-500/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap"><h3 className="text-sm font-bold text-gray-900 dark:text-white">{j.name}</h3><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${qColor(j.q)}`}>{j.q}</span>{j.oa && <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"><Globe className="w-3 h-3" />OA</span>}</div>
                  <div className="flex items-center gap-4 text-[12px] text-gray-500"><span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />IF: {j.if}</span><span>{isAr ? 'قبول' : 'Accept'}: {j.acc}%</span></div>
                </div>
                <div className="flex items-center gap-2"><button className="px-3 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/15 transition-colors">{isAr ? 'تقييم' : 'Evaluate'}</button><button className="p-1.5 text-gray-400 hover:text-cyan-600 transition-colors"><ExternalLink className="w-4 h-4" /></button></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ServicePageWrapper icon={BookMarked} title={{ ar: 'اختيار المجلة', en: 'Journal Selection' }} description={{ ar: 'ابحث عن المجلة الأنسب لبحثك', en: 'Find the most suitable journal for your research' }} gradient="from-cyan-500 to-cyan-600" shadowColor="shadow-cyan-500/20" guideSections={guideSections} mockRequests={MOCK}>
      {form}
    </ServicePageWrapper>
  );
};

export default JournalSelectionPage;