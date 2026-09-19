import { useState, useEffect } from 'react';
import { useSite } from '../../../SiteContext';
import { API_BASE_URL } from '../../../api';
import ServicePageWrapper from './ServicePageWrapper';
import { BookMarked, Search, ExternalLink, TrendingUp, Globe, Filter, ListChecks, Lightbulb, HelpCircle, Send, XCircle, CheckCircle, Loader2 } from 'lucide-react';

const FIELDS = [
  { id: 'cs', label_ar: 'علوم الحاسب', label_en: 'Computer Science' }, { id: 'med', label_ar: 'الطب', label_en: 'Medicine' },
  { id: 'eng', label_ar: 'الهندسة', label_en: 'Engineering' }, { id: 'sci', label_ar: 'العلوم الأساسية', label_en: 'Basic Sciences' }, { id: 'soc', label_ar: 'العلوم الاجتماعية', label_en: 'Social Sciences' },
];

const getApiError = (serverMsg, isAr) => {
  if (!serverMsg) return isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred';
  const map = {
    unauthorized: { ar: 'يرجى تسجيل الدخول أولاً', en: 'Please login first' },
    research_field_required: { ar: 'يرجى اختيار التخصص', en: 'Please select a field' },
    file_required: { ar: 'يرجى رفع الملف', en: 'Please upload a file' },
    invalid_file_type: { ar: 'صيغة الملف غير مقبولة', en: 'Invalid file type' },
    file_size_exceeded: { ar: 'حجم الملف يتجاوز 20 ميغابايت', en: 'File size exceeds 20MB' },
    database_insert_failed: { ar: 'فشل حفظ الطلب', en: 'Failed to save request' },
  };
  const lower = serverMsg.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  for (const [key, trans] of Object.entries(map)) {
    if (lower.includes(key)) return isAr ? trans.ar : trans.en;
  }
  return serverMsg;
};

const JournalSelectionPage = () => {
  const { currentLang, user } = useSite();
  const isAr = currentLang === 'ar';
  const entityId = user?.user_id ?? user?.id;
  const [field, setField] = useState('');
  const [query, setQuery] = useState('');
  const [minIF, setMinIF] = useState('');
  const [oaOnly, setOaOnly] = useState(false);
  const [reqFile, setReqFile] = useState(null);
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
      const res = await fetch(`${API_BASE_URL}/get_journal_selection_requests.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setRequests(result.data.map(r => ({ ...r, title_ar: r.research_field, title_en: r.research_field })));
      }
    } catch (err) {
      console.error('Fetch journal selection requests error:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => { if (entityId) fetchRequests(); }, [entityId]);

  const handleSubmitRequest = async () => {
    if (!field || !reqFile) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const fieldLabel = FIELDS.find(f => f.id === field);
      const fd = new FormData();
      fd.append('user_id', entityId || '');
      fd.append('research_field', fieldLabel ? (isAr ? fieldLabel.label_ar : fieldLabel.label_en) : field);
      fd.append('priority', oaOnly ? 'open_access' : (minIF ? 'impact' : 'no_preference'));
      fd.append('notes', query.trim());
      fd.append('file', reqFile);
      const res = await fetch(`${API_BASE_URL}/submit_journal_selection.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setSubmitSuccess(isAr ? `تم إرسال طلبك بنجاح! رقم الطلب: #${result.data.id}` : `Request submitted! Request #${result.data.id}`);
        setReqFile(null);
        fetchRequests();
      } else {
        setSubmitError(getApiError(result.message, isAr));
      }
    } catch (err) {
      console.error('Journal selection submit error:', err);
      setSubmitError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
    } finally {
      setSubmitting(false);
    }
  };

  const guideSections = [
    { id: 'how', icon: ListChecks, title_ar: 'كيف تعمل الخدمة', title_en: 'How It Works', items_ar: ['حدد تخصص بحثك', 'أضف كلمات مفتاحية من العنوان', 'اضبط فلاتر معامل التأثير والوصول المفتوح', 'اعرض النتائج واطلب تقييم أي مجلة'], items_en: ['Select your field', 'Add keywords', 'Set IF and OA filters', 'View results and request evaluation'] },
    { id: 'features', icon: Lightbulb, title_ar: 'مزايا الخدمة', title_en: 'Features', items_ar: ['قاعدة بيانات شاملة للمجلات', 'فلترة ذكية حسب معايير متعددة', 'ربط مباشر مع خدمة تقييم المجلات', 'توصيات مخصصة لتخصصك'], items_en: ['Comprehensive journal database', 'Smart multi-criteria filtering', 'Direct link to journal evaluation', 'Personalized recommendations'] },
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
      <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-200 dark:border-brand-dark-border/50 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'التخصص' : 'Field'}</label>
            <select value={field} onChange={(e) => setField(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-brand-dark-border bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition">
              <option value="">{isAr ? 'الكل' : 'All'}</option>{FIELDS.map(f => <option key={f.id} value={f.id}>{isAr ? f.label_ar : f.label_en}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'بحث' : 'Search'}</label>
            <div className="relative"><Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" /><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isAr ? 'اسم المجلة...' : 'Journal name...'} className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-gray-200 dark:border-brand-dark-border bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition" /></div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'أدنى IF' : 'Min IF'}</label>
            <input type="number" value={minIF} onChange={(e) => setMinIF(e.target.value)} placeholder="0" step="0.1" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-brand-dark-border bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={oaOnly} onChange={(e) => setOaOnly(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" /><span className="text-sm text-gray-600 dark:text-gray-400">{isAr ? 'وصول مفتوح فقط' : 'Open Access Only'}</span></label>
        </div>
        {/* Stage A.5 / P6: أُزيلت قائمة المجلات الوهمية (3 عناصر ثابتة بمعاملات
            تأثير مصطنعة) التي كانت تُعرَض كأنها نتائج بحث حقيقية. لا توجد بعد
            قاعدة بيانات مجلات فعلية خلف هذه الفلاتر — إشعار صريح بدل بيانات مزيّفة. */}
        <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-800/30 rounded-xl">
          <Globe className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            {isAr
              ? 'قاعدة بيانات المجلات القابلة للبحث غير متوفرة بعد. استخدم نموذج طلب مساعدة مختص أدناه للحصول على توصيات مجلات حقيقية لبحثك.'
              : 'A searchable journal database is not available yet. Use the expert-help request form below to get real journal recommendations for your research.'}
          </p>
        </div>
      </div>

      {/* ─── طلب مساعدة مقدّم خدمة ─── */}
      <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-200 dark:border-brand-dark-border/50 p-5 space-y-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{isAr ? 'اطلب مساعدة مختص في اختيار المجلة' : 'Request expert help choosing a journal'}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{isAr ? 'ارفع ملخص بحثك وسيتواصل معك مختص لاقتراح أفضل المجلات (يتطلب اختيار التخصص أعلاه)' : 'Upload your abstract and a specialist will suggest the best journals (requires selecting a field above)'}</p>
        <label className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 dark:border-brand-dark-border rounded-xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 transition-all">
          <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => {
            const selected = e.target.files[0];
            if (!selected) return;
            const ext = selected.name.split('.').pop().toLowerCase();
            if (!['pdf', 'doc', 'docx'].includes(ext)) { setSubmitError(isAr ? 'صيغة الملف غير مقبولة' : 'Invalid file type'); return; }
            if (selected.size > 20 * 1024 * 1024) { setSubmitError(isAr ? 'حجم الملف يتجاوز 20 ميغابايت' : 'File size exceeds 20MB'); return; }
            setReqFile(selected); setSubmitError(null);
          }} />
          {reqFile ? (
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" />{reqFile.name}</span>
          ) : (
            <span className="text-xs text-gray-400 flex items-center gap-2"><Search className="w-4 h-4" />{isAr ? 'ارفع ملخص البحث (PDF, DOC, DOCX)' : 'Upload abstract (PDF, DOC, DOCX)'}</span>
          )}
        </label>
        <button onClick={handleSubmitRequest} disabled={!field || !reqFile || submitting} className="w-full py-3 bg-gradient-to-l from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 disabled:shadow-none flex items-center justify-center gap-2">
          {submitting ? <><Loader2 className="w-4.5 h-4.5 animate-spin" />{isAr ? 'جارٍ الإرسال...' : 'Submitting...'}</> : <><Send className="w-4 h-4" />{isAr ? 'إرسال الطلب' : 'Submit Request'}</>}
        </button>
      </div>
    </div>
  );

  return (
    <ServicePageWrapper icon={BookMarked} title={{ ar: 'اختيار المجلة', en: 'Journal Selection' }} description={{ ar: 'ابحث عن المجلة الأنسب لبحثك', en: 'Find the most suitable journal for your research' }} gradient="from-cyan-500 to-cyan-600" shadowColor="shadow-cyan-500/20" guideSections={guideSections} mockRequests={requests} loadingRequests={loadingRequests}>
      {form}
    </ServicePageWrapper>
  );
};

export default JournalSelectionPage;