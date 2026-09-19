import { useState, useEffect } from 'react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';
import ServicePageWrapper from './ServicePageWrapper';
import { LayoutTemplate, Download, Eye, Search, FileText, ListChecks, Lightbulb, HelpCircle, Send, XCircle, CheckCircle, Loader2 } from 'lucide-react';

const TEMPLATES = [
  { id: 1, name_ar: 'قالب IEEE', name_en: 'IEEE Template', cat: 'article', fmt: 'Word', size: '245 KB', desc_ar: 'تنسيق الأوراق وفق IEEE', desc_en: 'Paper formatting per IEEE' },
  { id: 2, name_ar: 'قالب APA', name_en: 'APA Template', cat: 'article', fmt: 'Word', size: '198 KB', desc_ar: 'وفق APA الإصدار السابع', desc_en: 'Per APA 7th edition' },
  { id: 3, name_ar: 'قالب رسالة ماجستير', name_en: 'Master\'s Thesis', cat: 'thesis', fmt: 'Word', size: '520 KB', desc_ar: 'شامل لجميع الفصول', desc_en: 'Complete with all chapters' },
  { id: 4, name_ar: 'قالب عرض تقديمي', name_en: 'Presentation', cat: 'presentation', fmt: 'PPT', size: '1.2 MB', desc_ar: 'عرض أكاديمي احترافي', desc_en: 'Professional academic presentation' },
  { id: 5, name_ar: 'قالب خطة بحث', name_en: 'Research Proposal', cat: 'proposal', fmt: 'Word', size: '310 KB', desc_ar: 'إعداد خطة البحث', desc_en: 'Research proposal preparation' },
  { id: 6, name_ar: 'قالب مراجعة أدبيات', name_en: 'Literature Review', cat: 'review', fmt: 'Word', size: '175 KB', desc_ar: 'تنظيم المراجعة المنهجية', desc_en: 'Systematic review organization' },
];

const CATS = [
  { id: 'all', label_ar: 'الكل', label_en: 'All' }, { id: 'article', label_ar: 'أوراق بحثية', label_en: 'Articles' }, { id: 'thesis', label_ar: 'رسائل', label_en: 'Theses' }, { id: 'presentation', label_ar: 'عروض', label_en: 'Presentations' }, { id: 'proposal', label_ar: 'خطط بحث', label_en: 'Proposals' }, { id: 'review', label_ar: 'مراجعات', label_en: 'Reviews' },
];

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

const TemplatePage = () => {
  const { currentLang, user } = useSite();
  const isAr = currentLang === 'ar';
  const entityId = user?.user_id ?? user?.id;
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [journalName, setJournalName] = useState('');
  const [reqNotes, setReqNotes] = useState('');
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
      const res = await fetch(`${API_BASE_URL}/get_template_requests.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setRequests(result.data.map(r => ({ ...r, title_ar: 'قالب: ' + r.journal_name, title_en: 'Template: ' + r.journal_name })));
      }
    } catch (err) {
      console.error('Fetch template requests error:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => { if (entityId) fetchRequests(); }, [entityId]);

  const handleSubmitRequest = async () => {
    if (!journalName.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const fd = new FormData();
      fd.append('user_id', entityId || '');
      fd.append('journal_name', journalName.trim());
      fd.append('notes', reqNotes.trim());
      const res = await fetch(`${API_BASE_URL}/submit_template.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setSubmitSuccess(isAr ? `تم إرسال طلبك بنجاح! رقم الطلب: #${result.data.id}` : `Request submitted! Request #${result.data.id}`);
        setJournalName(''); setReqNotes('');
        fetchRequests();
      } else {
        setSubmitError(getApiError(result.message, isAr));
      }
    } catch (err) {
      console.error('Template submit error:', err);
      setSubmitError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = TEMPLATES.filter(t => {
    if (cat !== 'all' && t.cat !== cat) return false;
    if (query && !(isAr ? t.name_ar : t.name_en).toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const guideSections = [
    { id: 'how', icon: ListChecks, title_ar: 'كيف تستخدم القوالب', title_en: 'How to Use Templates', items_ar: ['اختر القالب المناسب لنوع مستندك', 'حمّل الملف بصيغة Word أو PowerPoint', 'استبدل المحتوى التجريبي بمحتواك', 'تحقق من التوافق مع دليل الأسلوب المطلوب'], items_en: ['Choose the right template', 'Download in Word or PPT', 'Replace placeholder content', 'Verify style guide compliance'] },
    { id: 'features', icon: Lightbulb, title_ar: 'مميزات القوالب', title_en: 'Template Features', items_ar: ['مُنسّقة مسبقاً وفق أعلى المعايير', 'أنماط وأشكال جاهزة', 'ترقيم تلقائي للجداول والأشكال', 'متوافقة مع Word و PowerPoint'], items_en: ['Pre-formatted to highest standards', 'Ready-made styles and figures', 'Auto-numbering for tables/figures', 'Word & PowerPoint compatible'] },
  ];

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

      {/* ─── طلب قالب مخصص لمجلة معينة ─── */}
      <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-200 dark:border-brand-dark-border/50 p-5 space-y-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><LayoutTemplate className="w-4 h-4 text-indigo-500" />{isAr ? 'لم تجد قالب مجلتك؟ اطلبه' : "Can't find your journal's template? Request it"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" value={journalName} onChange={(e) => setJournalName(e.target.value)} placeholder={isAr ? 'اسم المجلة المستهدفة' : 'Target journal name'} className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-brand-dark-border bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition" />
          <input type="text" value={reqNotes} onChange={(e) => setReqNotes(e.target.value)} placeholder={isAr ? 'ملاحظات (اختياري)' : 'Notes (optional)'} className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-brand-dark-border bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition" />
        </div>
        <button onClick={handleSubmitRequest} disabled={!journalName.trim() || submitting} className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-l from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:shadow-none flex items-center justify-center gap-2">
          {submitting ? <><Loader2 className="w-4.5 h-4.5 animate-spin" />{isAr ? 'جارٍ الإرسال...' : 'Submitting...'}</> : <><Send className="w-4 h-4" />{isAr ? 'إرسال الطلب' : 'Submit Request'}</>}
        </button>
      </div>

      <div className="relative"><Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" /><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isAr ? 'ابحث عن قالب...' : 'Search templates...'} className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-gray-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition" /></div>
      <div className="flex flex-wrap gap-2">{CATS.map(c => (
        <button key={c.id} onClick={() => setCat(c.id)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${cat === c.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'bg-gray-100 dark:bg-brand-dark-hover text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-brand-dark-hover'}`}>{isAr ? c.label_ar : c.label_en}</button>
      ))}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(tp => (
          <div key={tp.id} className="bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-200 dark:border-brand-dark-border/50 p-4 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
            <div className="w-full h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-xl flex items-center justify-center mb-3"><FileText className="w-9 h-9 text-indigo-400 dark:text-indigo-500 group-hover:scale-110 transition-transform" /></div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{isAr ? tp.name_ar : tp.name_en}</h3>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">{isAr ? tp.desc_ar : tp.desc_en}</p>
            <div className="flex items-center justify-between"><span className="text-[11px] text-gray-400">{tp.fmt} · {tp.size}</span><div className="flex items-center gap-1"><button className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/15 transition-all"><Eye className="w-4 h-4" /></button><button className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/15 transition-all"><Download className="w-4 h-4" /></button></div></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ServicePageWrapper icon={LayoutTemplate} title={{ ar: 'قوالب البحث', en: 'Research Templates' }} description={{ ar: 'قوالب جاهزة لتنسيق أبحاثك', en: 'Ready templates for your research' }} gradient="from-indigo-500 to-indigo-600" shadowColor="shadow-indigo-500/20" guideSections={guideSections} mockRequests={requests} loadingRequests={loadingRequests} requestsTabLabel_ar="طلباتي" requestsTabLabel_en="My Requests">
      {form}
    </ServicePageWrapper>
  );
};

export default TemplatePage;