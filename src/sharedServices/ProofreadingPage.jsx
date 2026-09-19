import { useState, useEffect } from 'react';
import { useSite } from '../SiteContext';
import { API_BASE_URL } from '../api';
import ServicePageWrapper from './ServicePageWrapper';
import { FileText, Upload, ListChecks, Lightbulb, HelpCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const DOC_TYPES = [
  { id: 'article', label_ar: 'ورقة بحثية', label_en: 'Research Article' }, { id: 'thesis', label_ar: 'رسالة ماجستير/دكتوراه', label_en: 'Thesis / Dissertation' },
  { id: 'abstract', label_ar: 'ملخص بحثي', label_en: 'Abstract' }, { id: 'report', label_ar: 'تقرير بحثي', label_en: 'Research Report' }, { id: 'other', label_ar: 'أخرى', label_en: 'Other' },
];

const STYLE_GUIDES = ['apa', 'mla', 'chicago', 'ieee', 'vancouver'];

const getApiError = (serverMsg, isAr) => {
  if (!serverMsg) return isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred';
  const map = {
    unauthorized: { ar: 'يرجى تسجيل الدخول أولاً', en: 'Please login first' },
    file_required: { ar: 'يرجى رفع الملف', en: 'Please upload a file' },
    invalid_file_type: { ar: 'صيغة الملف غير مقبولة. المسموح: PDF, DOC, DOCX', en: 'Invalid file type. Allowed: PDF, DOC, DOCX' },
    file_size_exceeded: { ar: 'حجم الملف يتجاوز 20 ميغابايت', en: 'File size exceeds 20MB' },
    file_empty: { ar: 'الملف فارغ', en: 'File is empty' },
    database_insert_failed: { ar: 'فشل حفظ الطلب', en: 'Failed to save request' },
  };
  const lower = serverMsg.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  for (const [key, trans] of Object.entries(map)) {
    if (lower.includes(key)) return isAr ? trans.ar : trans.en;
  }
  return serverMsg;
};

const ProofreadingPage = () => {
  const { currentLang, user } = useSite();
  const isAr = currentLang === 'ar';
  const entityId = user?.user_id ?? user?.id;
  const [docType, setDocType] = useState('article');
  const [file, setFile] = useState(null);
  const [styleGuide, setStyleGuide] = useState('apa');
  const [notes, setNotes] = useState('');
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
      const res = await fetch(`${API_BASE_URL}/get_proofreading_requests.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setRequests(result.data.map(r => ({
          ...r,
          title_ar: 'طلب تدقيق لغوي',
          title_en: 'Proofreading Request',
        })));
      }
    } catch (err) {
      console.error('Fetch proofreading requests error:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => { if (entityId) fetchRequests(); }, [entityId]);

  const handleSubmit = async () => {
    if (!file) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const fd = new FormData();
      fd.append('user_id', entityId || '');
      fd.append('citation_style', styleGuide.toUpperCase());
      fd.append('notes', (DOC_TYPES.find(d => d.id === docType) ? (isAr ? DOC_TYPES.find(d => d.id === docType).label_ar : DOC_TYPES.find(d => d.id === docType).label_en) + ' — ' : '') + notes.trim());
      fd.append('file', file);
      const res = await fetch(`${API_BASE_URL}/submit_proofreading.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setSubmitSuccess(isAr ? `تم إرسال طلب التدقيق بنجاح! رقم الطلب: #${result.data.id}` : `Editing request submitted! Request #${result.data.id}`);
        setFile(null);
        setNotes('');
        fetchRequests();
      } else {
        setSubmitError(getApiError(result.message, isAr));
      }
    } catch (err) {
      console.error('Proofreading submit error:', err);
      setSubmitError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
    } finally {
      setSubmitting(false);
    }
  };

  const guideSections = [
    { id: 'how', icon: ListChecks, title_ar: 'خطوات التدقيق', title_en: 'Editing Steps', items_ar: ['اختر نوع المستند', 'ارفع الملف بصيغة Word أو PDF', 'حدد دليل الأسلوب المطلوب', 'أضف ملاحظات عن التدقيق المطلوب', 'إرسال الطلب'], items_en: ['Select document type', 'Upload file', 'Choose style guide', 'Add notes', 'Submit'] },
    { id: 'features', icon: Lightbulb, title_ar: 'ما يتضمنه التدقيق', title_en: 'What\'s Included', items_ar: ['تصحيح الأخطاء النحوية والإملائية', 'تحسين الصياغة والوضوح', 'التوافق مع دليل الأسلوب المختار', 'تسليط الضوء على التعديلات', 'تقرير بالتغييرات المُجراة'], items_en: ['Grammar & spelling correction', 'Clarity improvement', 'Style guide compliance', 'Highlighted changes', 'Change report'] },
    { id: 'faq', icon: HelpCircle, title_ar: 'أسئلة شائعة', title_en: 'FAQ', items_ar: ['هل التدقيق يشمل المحتوى العلمي؟ لا، التدقيق لغوي فقط. للمحتوى العلمي استخدم خدمة التحكيم', 'كم عدد الجولات المسموحة؟ تعديل واحد مجاني بعد التسليم', 'ما الفرق بين التدقيق والتحكيم؟ التدقيق لغوي، التحكيم علمي ومنهجي'], items_en: ['Does it include scientific review? No, linguistic only', 'Free revision rounds? One after delivery', 'Difference from review? Editing is linguistic, review is scientific'] },
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
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{isAr ? 'نوع المستند' : 'Document Type'}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DOC_TYPES.map(dt => (
            <button key={dt.id} onClick={() => setDocType(dt.id)} className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${docType === dt.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-gray-200 dark:border-brand-dark-border text-gray-500 dark:text-gray-400 hover:border-gray-300'}`}>
              {isAr ? dt.label_ar : dt.label_en}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'رفع المستند' : 'Upload'} <span className="text-rose-500">*</span></label>
        <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-200 dark:border-brand-dark-border rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all group">
          <input type="file" className="hidden" onChange={(e) => {
            const selected = e.target.files[0];
            if (!selected) return;
            const ext = selected.name.split('.').pop().toLowerCase();
            if (!['pdf', 'doc', 'docx'].includes(ext)) { setSubmitError(isAr ? 'صيغة الملف غير مقبولة. المسموح: PDF, DOC, DOCX' : 'Invalid file type. Allowed: PDF, DOC, DOCX'); return; }
            if (selected.size > 20 * 1024 * 1024) { setSubmitError(isAr ? 'حجم الملف يتجاوز 20 ميغابايت' : 'File size exceeds 20MB'); return; }
            setFile(selected); setSubmitError(null);
          }} accept=".doc,.docx,.pdf" />
          {file ? <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-5 h-5" /><span className="text-sm font-semibold">{file.name}</span><button onClick={(e) => { e.preventDefault(); setFile(null); }} className="text-rose-500 text-xs">✕</button></div>
            : <><Upload className="w-6 h-6 text-gray-300 dark:text-gray-600 group-hover:text-emerald-400 transition-colors mb-1" /><span className="text-xs text-gray-400">{isAr ? 'اسحب الملف أو انقر' : 'Drag or click'}</span></>}
        </label>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'دليل الأسلوب' : 'Style Guide'}</label>
        <select value={styleGuide} onChange={(e) => setStyleGuide(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-brand-dark-border bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition">
          <option value="apa">APA 7th</option><option value="mla">MLA</option><option value="chicago">Chicago</option><option value="ieee">IEEE</option><option value="vancouver">Vancouver</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'ملاحظات' : 'Notes'}</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder={isAr ? 'مثال: التركيز على القواعد والترقيم...' : 'e.g. Focus on grammar and punctuation...'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-brand-dark-border bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition resize-none" />
      </div>
      <button onClick={handleSubmit} disabled={!file || submitting} className="w-full py-3 bg-gradient-to-l from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/25 disabled:shadow-none flex items-center justify-center gap-2">
        {submitting ? <><Loader2 className="w-4.5 h-4.5 animate-spin" />{isAr ? 'جارٍ الإرسال...' : 'Submitting...'}</> : (isAr ? 'إرسال طلب التدقيق' : 'Submit Editing Request')}
      </button>
    </div>
    </div>
  );

  return (
    <ServicePageWrapper icon={FileText} title={{ ar: 'خدمة التدقيق اللغوي', en: 'Language Editing' }} description={{ ar: 'تدقيق لغوي وأكاديمي شامل لنصوصك', en: 'Comprehensive linguistic and academic editing' }} gradient="from-emerald-500 to-emerald-600" shadowColor="shadow-emerald-500/20" guideSections={guideSections} mockRequests={requests} loadingRequests={loadingRequests}>
      {form}
    </ServicePageWrapper>
  );
};

export default ProofreadingPage;