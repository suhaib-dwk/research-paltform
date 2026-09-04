import { useState, useEffect } from 'react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';
import ServicePageWrapper from './ServicePageWrapper';
import { BarChart3, Search, AlertTriangle, CheckCircle, XCircle, Info, TrendingUp, Shield, Clock, ListChecks, Lightbulb, HelpCircle, Send, Loader2 } from 'lucide-react';

const getApiError = (serverMsg, isAr) => {
  if (!serverMsg) return isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred';
  const map = {
    unauthorized: { ar: 'يرجى تسجيل الدخول أولاً', en: 'Please login first' },
    journal_name_required: { ar: 'يرجى إدخال اسم المجلة', en: 'Please enter the journal name' },
    database_insert_failed: { ar: 'فشل حفظ الطلب', en: 'Failed to save request' },
  };
  const lower = serverMsg.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  for (const [key, trans] of Object.entries(map)) {
    if (lower.includes(key)) return isAr ? trans.ar : trans.en;
  }
  return serverMsg;
};

const JournalEvaluationPage = () => {
  const { currentLang, user } = useSite();
  const isAr = currentLang === 'ar';
  const entityId = user?.user_id ?? user?.id;
  const [name, setName] = useState('');
  const [issn, setIssn] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const fd = new FormData();
      fd.append('user_id', entityId || '');
      const res = await fetch(`${API_BASE_URL}/get_journal_evaluation_requests.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setRequests(result.data.map(r => ({ ...r, title_ar: r.journal_name, title_en: r.journal_name })));
      }
    } catch (err) {
      console.error('Fetch journal evaluation requests error:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => { if (entityId) fetchRequests(); }, [entityId]);

  // ✅ معاينة تحليل فورية (تجريبية، لا تُنشئ طلباً حقيقياً)
  const handleEval = () => {
    if (!name.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      setResult({ name, publisher: 'Elsevier', issn: '2090-1232', impactFactor: 10.7, quartile: 'Q1', acceptanceRate: 15, avgReviewDays: 45, openAccess: true, indexedIn: ['Scopus', 'Web of Science'], warnings: [{ text_ar: 'رسوم معالجة عالية (APC: $3,000)', text_en: 'High APC: $3,000' }], strengths: [{ text_ar: 'مفهرسة في قواعد بيانات موثوقة', text_en: 'Indexed in reliable databases' }, { text_ar: 'معامل تأثير مستقر', text_en: 'Stable impact factor' }], overallScore: 85, recommendation: 'recommended' });
      setLoading(false);
    }, 1800);
  };

  // ✅ طلب تقييم حقيقي من مقدّم خدمة (منفصل عن المعاينة التجريبية أعلاه)
  const handleSubmitRequest = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const fd = new FormData();
      fd.append('user_id', entityId || '');
      fd.append('journal_name', name.trim());
      fd.append('journal_issn', issn.trim());
      fd.append('journal_link', link.trim());
      const res = await fetch(`${API_BASE_URL}/submit_journal_evaluation.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setSubmitSuccess(isAr ? `تم إرسال طلب التقييم بنجاح! رقم الطلب: #${result.data.id}` : `Evaluation request submitted! Request #${result.data.id}`);
        fetchRequests();
      } else {
        setSubmitError(getApiError(result.message, isAr));
      }
    } catch (err) {
      console.error('Journal evaluation submit error:', err);
      setSubmitError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
    } finally {
      setSubmitting(false);
    }
  };

  const guideSections = [
    { id: 'how', icon: ListChecks, title_ar: 'كيف تعمل الخدمة', title_en: 'How It Works', items_ar: ['أدخل اسم المجلة باللغة الإنجليزية', 'انتظر تحليل البيانات', 'اعرض التقرير الشامل مع درجة الثقة', 'اتخذ قراراً مبنياً على البيانات'], items_en: ['Enter journal name in English', 'Wait for data analysis', 'View full report with trust score', 'Make data-driven decision'] },
    { id: 'what', icon: Lightbulb, title_ar: 'ماذا يُقيَّم؟', title_en: 'What Is Evaluated?', items_ar: ['معامل التأثير والربع', 'مؤشرات الاستشهاد', 'معدل القبول وزمن المراجعة', 'الفهرسة في قواعد بيانات موثوقة', 'تاريخ المجلة والناشر', 'تحذيرات محتملة'], items_en: ['Impact factor & quartile', 'Citation indices', 'Acceptance rate & review time', 'Indexing in reliable databases', 'Journal history & publisher', 'Potential warnings'] },
  ];

  const scoreColor = (s) => s >= 80 ? 'text-emerald-500' : s >= 60 ? 'text-amber-500' : 'text-red-500';

  const form = (
    <div className="space-y-4">
      {submitError && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 rounded-xl">
          <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{submitError}</p>
        </div>
      )}
      {submitSuccess && (
        <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/30 rounded-xl">
          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{submitSuccess}</p>
        </div>
      )}
      <div className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1"><Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" /><input type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleEval()} placeholder={isAr ? 'اسم المجلة...' : 'Journal name...'} className="w-full ps-9 pe-3 py-3 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition" /></div>
          <button onClick={handleEval} disabled={!name.trim() || loading} className="px-6 py-3 bg-gradient-to-l from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/25 disabled:shadow-none flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <BarChart3 className="w-4 h-4" />}{isAr ? 'معاينة سريعة' : 'Quick Preview'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" value={issn} onChange={(e) => setIssn(e.target.value)} placeholder={isAr ? 'ISSN (اختياري)' : 'ISSN (optional)'} className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition" />
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder={isAr ? 'رابط المجلة (اختياري)' : 'Journal link (optional)'} className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition" />
        </div>
        <button onClick={handleSubmitRequest} disabled={!name.trim() || submitting} className="w-full py-3 bg-gradient-to-l from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/25 disabled:shadow-none flex items-center justify-center gap-2">
          {submitting ? <><Loader2 className="w-4.5 h-4.5 animate-spin" />{isAr ? 'جارٍ الإرسال...' : 'Submitting...'}</> : <><Send className="w-4 h-4" />{isAr ? 'طلب تقييم احترافي من مختص' : 'Request Professional Evaluation'}</>}
        </button>
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
    <ServicePageWrapper icon={BarChart3} title={{ ar: 'تقييم المجلات', en: 'Journal Evaluation' }} description={{ ar: 'تقييم شامل وموثوق لأي مجلة أكاديمية', en: 'Comprehensive evaluation of any academic journal' }} gradient="from-orange-500 to-orange-600" shadowColor="shadow-orange-500/20" guideSections={guideSections} mockRequests={requests} loadingRequests={loadingRequests}>
      {form}
    </ServicePageWrapper>
  );
};

export default JournalEvaluationPage;