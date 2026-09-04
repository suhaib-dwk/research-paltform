import { useState, useEffect } from 'react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';
import ServicePageWrapper from './ServicePageWrapper';
import { Mail, Send, FileText, Copy, ListChecks, Lightbulb, HelpCircle, XCircle, CheckCircle, Loader2 } from 'lucide-react';

const TYPES = [
  { id: 'cover_letter', label_ar: 'رسالة تغطية', label_en: 'Cover Letter', desc_ar: 'مرافقة لتقديم البحث', desc_en: 'Accompanying submission letter' },
  { id: 'response_to_reviewers', label_ar: 'رد على الملاحظات', label_en: 'Rebuttal Letter', desc_ar: 'رد مفصل على المحكمين', desc_en: 'Detailed reviewer response' },
  { id: 'revision', label_ar: 'رسالة تنقيح', label_en: 'Revision Letter', desc_ar: 'مع النسخة المنقحة', desc_en: 'With revised version' },
  { id: 'withdrawal', label_ar: 'رسالة سحب', label_en: 'Withdrawal Letter', desc_ar: 'طلب سحب البحث', desc_en: 'Withdrawal request' },
  { id: 'inquiry', label_ar: 'رسالة استفسار', label_en: 'Inquiry Letter', desc_ar: 'حالة البحث المقدم', desc_en: 'Submitted paper status' },
];

const getApiError = (serverMsg, isAr) => {
  if (!serverMsg) return isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred';
  const map = {
    unauthorized: { ar: 'يرجى تسجيل الدخول أولاً', en: 'Please login first' },
    notes_required: { ar: 'يرجى كتابة محتوى الرسالة', en: 'Please write the letter content' },
    invalid_correspondence_type: { ar: 'نوع الرسالة غير صحيح', en: 'Invalid letter type' },
    database_insert_failed: { ar: 'فشل حفظ الطلب', en: 'Failed to save request' },
  };
  const lower = serverMsg.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  for (const [key, trans] of Object.entries(map)) {
    if (lower.includes(key)) return isAr ? trans.ar : trans.en;
  }
  return serverMsg;
};

const TPL_CONTENT = {
  cover_letter: { ar: 'السيد المحترم / رئيس تحرير مجلة [اسم المجلة]\n\nتحية طيبة وبعد،\n\nنتشرف بتقديم بحثنا الموسوم بـ "عنوان البحث" للنشر في مجلتكم الموقرة...\n\nمع خالص التقدير،', en: 'Dear Editor-in-Chief, [Journal Name]\n\nWe are pleased to submit our manuscript entitled "Title" for consideration...\n\nSincerely,' },
  response_to_reviewers: { ar: 'السيد المحترم / رئيس التحرير\n\nنشكركم على ملاحظات المحكمين القيمة. فيما يلي ردنا التفصيلي...\n\nمع التقدير,', en: 'Dear Editor,\n\nWe thank the reviewers for their valuable comments. Below is our detailed response...\n\nSincerely,' },
};

const CorrespondencePage = () => {
  const { currentLang, user } = useSite();
  const isAr = currentLang ==='ar';
  const entityId = user?.user_id ?? user?.id;
  const [selectedType, setSelectedType] = useState(null);
  const [content, setContent] = useState('');
  const [showTpl, setShowTpl] = useState(false);
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
      const res = await fetch(`${API_BASE_URL}/get_correspondence_requests.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setRequests(result.data.map(r => ({ ...r, title_ar: r.meta_ar, title_en: r.meta_en })));
      }
    } catch (err) {
      console.error('Fetch correspondence requests error:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => { if (entityId) fetchRequests(); }, [entityId]);

  const handleSelect = (t) => { setSelectedType(t); const tpl = TPL_CONTENT[t.id]; setContent(tpl ? (isAr ? tpl.ar : tpl.en) : ''); setShowTpl(false); setSubmitSuccess(null); setSubmitError(null); };

  const handleSubmit = async () => {
    if (!selectedType || !content.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const fd = new FormData();
      fd.append('user_id', entityId || '');
      fd.append('correspondence_type', selectedType.id);
      fd.append('notes', content.trim());
      const res = await fetch(`${API_BASE_URL}/submit_correspondence.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setSubmitSuccess(isAr ? `تم حفظ وإرسال الرسالة بنجاح! رقم الطلب: #${result.data.id}` : `Letter saved & sent! Request #${result.data.id}`);
        fetchRequests();
      } else {
        setSubmitError(getApiError(result.message, isAr));
      }
    } catch (err) {
      console.error('Correspondence submit error:', err);
      setSubmitError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
    } finally {
      setSubmitting(false);
    }
  };

  const guideSections = [
    { id: 'types', icon: ListChecks, title_ar: 'أنواع الرسائل', title_en: 'Letter Types', items_ar: ['رسالة تغطية: ترافق تقديم البحث للمجلة', 'رد على الملاحظات: رد مفصل على كل ملاحظة محكم', 'رسالة تنقيح: تُقدّم مع النسخة المنقحة', 'رسالة سحب: لسحب البحث من المجلة', 'رسالة استفسار: للسؤال عن حالة البحث'], items_en: ['Cover Letter: accompanies submission', 'Rebuttal: detailed response to each comment', 'Revision Letter: with revised version', 'Withdrawal Letter: to withdraw paper', 'Inquiry: check paper status'] },
    { id: 'tips', icon: Lightbulb, title_ar: 'نصائح كتابة المراسلات', title_en: 'Writing Tips', items_ar: ['استخدم لغة رسمية ومحترمة', 'كن مختصراً ومباشراً', 'أشر إلى رقم الإرسال إن وجد', 'راجع الرسالة قبل الإرسال'], items_en: ['Use formal and respectful language', 'Be concise and direct', 'Reference submission number if available', 'Review before sending'] },
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        {!selectedType ? (
          <div className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-8 text-center"><Mail className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-gray-400">{isAr ? 'اختر نوع الرسالة' : 'Select a letter type'}</p></div>
        ) : (
          <div className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">{isAr ? selectedType.label_ar : selectedType.label_en}</h2>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowTpl(!showTpl)} className="px-3 py-1.5 text-xs font-semibold text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800/40 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/15 transition-colors"><FileText className="w-3 h-3 inline-block me-1" />{isAr ? 'قوالب' : 'Templates'}</button>
                <button onClick={() => navigator.clipboard.writeText(content)} className="p-1.5 rounded-lg text-gray-400 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/15 transition-all"><Copy className="w-4 h-4" /></button>
              </div>
            </div>
            {showTpl && TPL_CONTENT[selectedType.id] && (
              <div className="pb-3 border-b border-gray-100 dark:border-[#1e3050]/30">
                <button onClick={() => setContent(isAr ? TPL_CONTENT[selectedType.id].ar : TPL_CONTENT[selectedType.id].en)} className="w-full text-start p-3 rounded-xl bg-gray-50 dark:bg-[#0a1628] border border-gray-100 dark:border-[#1e3050]/30 hover:border-pink-300 transition-all">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{isAr ? 'استخدام القالب الجاهز' : 'Use ready template'}</p>
                </button>
              </div>
            )}
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition resize-none font-mono" dir="auto" />
            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={!content.trim() || submitting} className="flex-1 py-3 bg-gradient-to-l from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-pink-500/25 disabled:shadow-none flex items-center justify-center gap-2">
                {submitting ? <><Loader2 className="w-4.5 h-4.5 animate-spin" />{isAr ? 'جارٍ الإرسال...' : 'Submitting...'}</> : <><Send className="w-4 h-4" />{isAr ? 'حفظ وإرسال' : 'Save & Send'}</>}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-2">
        {TYPES.map(lt => (
          <button key={lt.id} onClick={() => handleSelect(lt)} className={`w-full text-start p-3.5 rounded-xl border transition-all ${selectedType?.id === lt.id ? 'border-pink-400 dark:border-pink-500/50 bg-pink-50 dark:bg-pink-900/15' : 'border-gray-200 dark:border-[#1e3050] bg-white dark:bg-[#0c1425] hover:border-pink-300 dark:hover:border-pink-500/30'}`}>
            <p className={`text-sm font-semibold mb-0.5 ${selectedType?.id === lt.id ? 'text-pink-700 dark:text-pink-400' : 'text-gray-800 dark:text-gray-200'}`}>{isAr ? lt.label_ar : lt.label_en}</p>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">{isAr ? lt.desc_ar : lt.desc_en}</p>
          </button>
        ))}
      </div>
    </div>
    </div>
  );

  return (
    <ServicePageWrapper icon={Mail} title={{ ar: 'المراسلات الأكاديمية', en: 'Academic Correspondence' }} description={{ ar: 'إنشاء رسائل أكاديمية احترافية', en: 'Create professional academic letters' }} gradient="from-pink-500 to-pink-600" shadowColor="shadow-pink-500/20" guideSections={guideSections} mockRequests={requests} loadingRequests={loadingRequests}>
      {form}
    </ServicePageWrapper>
  );
};

export default CorrespondencePage;