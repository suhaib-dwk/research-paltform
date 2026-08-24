import { useState } from 'react';
import { useSite } from '../../SiteContext';
import ServicePageWrapper from './ServicePageWrapper';
import { BarChart3, Search, AlertTriangle, CheckCircle, XCircle, Info, TrendingUp, Shield, Clock, ListChecks, Lightbulb, HelpCircle } from 'lucide-react';

const MOCK_REQ = [
  { id: 1, title_ar: 'تقييم Nature Computing', title_en: 'Evaluate Nature Computing', status: 'completed', date: '2025-01-10', score: 85, meta_ar: 'موثوقة · Q1' },
  { id: 2, title_ar: 'تقييم مجلة جديدة', title_en: 'Evaluate new journal', status: 'in_progress', date: '2025-01-14', progress: 50, meta_ar: 'جاري التقييم...' },
  { id: 3, title_ar: 'تقييم مجلة مشبوهة', title_en: 'Evaluate suspicious journal', status: 'completed', date: '2025-01-08', score: 15, meta_ar: 'غير موثوقة · تحذير' },
];

const JournalEvaluationPage = () => {
  const { currentLang } = useSite();
  const isAr = currentLang === 'ar';
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleEval = () => {
    if (!name.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      setResult({ name, publisher: 'Elsevier', issn: '2090-1232', impactFactor: 10.7, quartile: 'Q1', acceptanceRate: 15, avgReviewDays: 45, openAccess: true, indexedIn: ['Scopus', 'Web of Science'], warnings: [{ text_ar: 'رسوم معالجة عالية (APC: $3,000)', text_en: 'High APC: $3,000' }], strengths: [{ text_ar: 'مفهرسة في قواعد بيانات موثوقة', text_en: 'Indexed in reliable databases' }, { text_ar: 'معامل تأثير مستقر', text_en: 'Stable impact factor' }], overallScore: 85, recommendation: 'recommended' });
      setLoading(false);
    }, 1800);
  };

  const guideSections = [
    { id: 'how', icon: ListChecks, title_ar: 'كيف تعمل الخدمة', title_en: 'How It Works', items_ar: ['أدخل اسم المجلة باللغة الإنجليزية', 'انتظر تحليل البيانات', 'اعرض التقرير الشامل مع درجة الثقة', 'اتخذ قراراً مبنياً على البيانات'], items_en: ['Enter journal name in English', 'Wait for data analysis', 'View full report with trust score', 'Make data-driven decision'] },
    { id: 'what', icon: Lightbulb, title_ar: 'ماذا يُقيَّم؟', title_en: 'What Is Evaluated?', items_ar: ['معامل التأثير والربع', 'مؤشرات الاستشهاد', 'معدل القبول وزمن المراجعة', 'الفهرسة في قواعد بيانات موثوقة', 'تاريخ المجلة والناشر', 'تحذيرات محتملة'], items_en: ['Impact factor & quartile', 'Citation indices', 'Acceptance rate & review time', 'Indexing in reliable databases', 'Journal history & publisher', 'Potential warnings'] },
  ];

  const scoreColor = (s) => s >= 80 ? 'text-emerald-500' : s >= 60 ? 'text-amber-500' : 'text-red-500';

  const form = (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5">
        <div className="flex gap-3">
          <div className="relative flex-1"><Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" /><input type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleEval()} placeholder={isAr ? 'اسم المجلة...' : 'Journal name...'} className="w-full ps-9 pe-3 py-3 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition" /></div>
          <button onClick={handleEval} disabled={!name.trim() || loading} className="px-6 py-3 bg-gradient-to-l from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/25 disabled:shadow-none flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <BarChart3 className="w-4 h-4" />}{isAr ? 'تقييم' : 'Evaluate'}
          </button>
        </div>
      </div>
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5 space-y-4">
            <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-gray-900 dark:text-white">{result.name}</h2><p className="text-sm text-gray-500">{result.publisher} · ISSN: {result.issn}</p></div><div className="text-center"><div className={`text-3xl font-black ${scoreColor(result.overallScore)}`}>{result.overallScore}</div><div className="text-[10px] text-gray-400">{isAr ? 'ثقة' : 'Trust'}</div></div></div>
            <div className="grid grid-cols-4 gap-3">{[{ l: isAr ? 'IF' : 'IF', v: result.impactFactor }, { l: isAr ? 'الربع' : 'Quartile', v: result.quartile }, { l: isAr ? 'قبول' : 'Accept', v: `${result.acceptanceRate}%` }, { l: isAr ? 'مراجعة' : 'Review', v: `${result.avgReviewDays}d` }].map((m, i) => <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-[#0a1628] text-center"><p className="text-base font-bold text-gray-900 dark:text-white">{m.v}</p><p className="text-[10px] text-gray-400">{m.l}</p></div>)}</div>
            <div className="flex flex-wrap gap-2">{result.indexedIn.map(db => <span key={db} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">{db}</span>)}</div>
            <div className="space-y-1.5"><h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">{isAr ? 'نقاط القوة' : 'Strengths'}</h3>{result.strengths.map((s, i) => <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span>{isAr ? s.text_ar : s.text_en}</span></div>)}</div>
          </div>
          <div className="space-y-4">
            <div className={`rounded-2xl border p-4 ${result.recommendation === 'recommended' ? 'bg-emerald-50 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-800/30' : 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800/30'}`}>
              <div className="flex items-center gap-2 mb-2">{result.recommendation === 'recommended' ? <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}<h3 className="text-sm font-bold text-gray-900 dark:text-white">{result.recommendation === 'recommended' ? (isAr ? 'مجلة موثوقة' : 'Trusted') : (isAr ? 'غير موثوقة' : 'Not Trusted')}</h3></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{result.recommendation === 'recommended' ? (isAr ? 'تفي بمعايير الجودة الأكاديمية.' : 'Meets academic quality standards.') : (isAr ? 'تحذير: قد لا تكون موثوقة.' : 'Warning: May not be reliable.')}</p>
            </div>
            {result.warnings.length > 0 && <div className="bg-amber-50 dark:bg-amber-900/15 rounded-2xl border border-amber-200 dark:border-amber-800/30 p-4 space-y-1.5"><div className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300"><AlertTriangle className="w-4 h-4" />{isAr ? 'تحذيرات' : 'Warnings'}</div>{result.warnings.map((w, i) => <p key={i} className="text-xs text-amber-700 dark:text-amber-400">{isAr ? w.text_ar : w.text_en}</p>)}</div>}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ServicePageWrapper icon={BarChart3} title={{ ar: 'تقييم المجلات', en: 'Journal Evaluation' }} description={{ ar: 'تقييم شامل وموثوق لأي مجلة أكاديمية', en: 'Comprehensive evaluation of any academic journal' }} gradient="from-orange-500 to-orange-600" shadowColor="shadow-orange-500/20" guideSections={guideSections} mockRequests={MOCK_REQ}>
      {form}
    </ServicePageWrapper>
  );
};

export default JournalEvaluationPage;