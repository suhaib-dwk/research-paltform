import { useState, useEffect } from 'react';
import { useSite } from '../SiteContext';
import { API_BASE_URL } from '../api';
import ServicePageWrapper from './ServicePageWrapper';
import { MessageSquare, Star, ListChecks, Lightbulb, HelpCircle, Send, XCircle, CheckCircle, Loader2 } from 'lucide-react';

const TOPICS = [
  { id: 'methodology', label_ar: 'منهجية البحث', label_en: 'Research Methodology', icon: '🔬' },
  { id: 'analysis', label_ar: 'التحليل الإحصائي', label_en: 'Statistical Analysis', icon: '📊' },
  { id: 'writing', label_ar: 'كتابة البحث', label_en: 'Research Writing', icon: '✍️' },
  { id: 'publishing', label_ar: 'خطوات النشر', label_en: 'Publishing Steps', icon: '📚' },
  { id: 'other', label_ar: 'موضوع آخر', label_en: 'Other', icon: '💬' },
];

const CONSULTANTS = [
  { id: 1, name_ar: 'د. أحمد محمد', name_en: 'Dr. Ahmed Mohammed', spec_ar: 'منهجية بحثية', spec_en: 'Research Methodology', rating: 4.9 },
  { id: 2, name_ar: 'د. سارة علي', name_en: 'Dr. Sara Ali', spec_ar: 'تحليل إحصائي', spec_en: 'Statistical Analysis', rating: 4.8 },
];

const getApiError = (serverMsg, isAr) => {
  if (!serverMsg) return isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred';
  const map = {
    unauthorized: { ar: 'يرجى تسجيل الدخول أولاً', en: 'Please login first' },
    topic_required: { ar: 'يرجى كتابة سؤالك', en: 'Please write your question' },
    database_insert_failed: { ar: 'فشل حفظ الطلب', en: 'Failed to save request' },
  };
  const lower = serverMsg.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  for (const [key, trans] of Object.entries(map)) {
    if (lower.includes(key)) return isAr ? trans.ar : trans.en;
  }
  return serverMsg;
};

const ConsultationPage = () => {
  const { currentLang, user } = useSite();
  const isAr = currentLang === 'ar';
  const entityId = user?.user_id ?? user?.id;
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [question, setQuestion] = useState('');
  const [step, setStep] = useState(1);
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
      const res = await fetch(`${API_BASE_URL}/get_consultation_requests.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setRequests(result.data.map(r => ({ ...r, title_ar: r.topic, title_en: r.topic })));
      }
    } catch (err) {
      console.error('Fetch consultation requests error:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => { if (entityId) fetchRequests(); }, [entityId]);

  const guideSections = [
    { id: 'how', icon: ListChecks, title_ar: 'كيف تعمل الاستشارة', title_en: 'How Consultation Works', items_ar: ['اختر موضوع الاستشارة', 'اختر المستشار المناسب', 'اكتب سؤالك أو وصف مشكلتك بالتفصيل', 'استلم رداً مفصلاً خلال 24 ساعة', 'يمكنك طلب جلسة مباشرة إضافية'], items_en: ['Choose topic', 'Select consultant', 'Write detailed question', 'Get response within 24h', 'Request live session'] },
    { id: 'features', icon: Lightbulb, title_ar: 'مزايا الخدمة', title_en: 'Features', items_ar: ['مستشارون أكاديميون معتمدون', 'ردود مكتوبة مفصلة', 'إمكانية حجز جلسات مباشرة', 'سرية تامة للاستشارة'], items_en: ['Certified academic consultants', 'Detailed written responses', 'Live session booking', 'Full confidentiality'] },
    { id: 'faq', icon: HelpCircle, title_ar: 'أسئلة شائعة', title_en: 'FAQ', items_ar: ['كم عدد الاستشارات المتاحة؟ حسب الباقة المشتركة', 'هل يمكن تغيير المستشار؟ نعم قبل بدء الاستشارة', 'ما مدة الجلسة المباشرة؟ 30-60 دقيقة'], items_en: ['How many consultations? Depends on plan', 'Change consultant? Yes before starting', 'Live session duration? 30-60 minutes'] },
  ];

  const handleTopic = (id) => { setSelectedTopic(id); setStep(2); };
  const handleConsultant = (c) => { setSelectedConsultant(c); setStep(3); };
  const handleSubmit = async () => {
    if (!question.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const topicLabel = TOPICS.find(t => t.id === selectedTopic);
      const consultantName = selectedConsultant ? (isAr ? selectedConsultant.name_ar : selectedConsultant.name_en) : '';
      const fd = new FormData();
      fd.append('user_id', entityId || '');
      fd.append('topic', (topicLabel ? (isAr ? topicLabel.label_ar : topicLabel.label_en) : '') + (consultantName ? ` — ${consultantName}` : ''));
      fd.append('notes', question.trim());
      const res = await fetch(`${API_BASE_URL}/submit_consultation.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setSubmitSuccess(isAr ? `تم إرسال الاستشارة بنجاح! رقم الطلب: #${result.data.id}` : `Consultation submitted! Request #${result.data.id}`);
        setStep(1); setSelectedTopic(''); setSelectedConsultant(null); setQuestion('');
        fetchRequests();
      } else {
        setSubmitError(getApiError(result.message, isAr));
      }
    } catch (err) {
      console.error('Consultation submit error:', err);
      setSubmitError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
    } finally {
      setSubmitting(false);
    }
  };

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
      {step === 1 && (
        <>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">{isAr ? 'اختر موضوع الاستشارة' : 'Choose Topic'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TOPICS.map(t => (
              <button key={t.id} onClick={() => handleTopic(t.id)} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-brand-dark-border hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all text-start">
                <span className="text-2xl">{t.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{isAr ? t.label_ar : t.label_en}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <button onClick={() => setStep(1)} className="text-sm text-violet-600 dark:text-violet-400 hover:underline">← {isAr ? 'رجوع' : 'Back'}</button>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">{isAr ? 'اختر المستشار' : 'Choose Consultant'}</h2>
          <div className="space-y-2">
            {CONSULTANTS.map(c => (
              <button key={c.id} onClick={() => handleConsultant(c)} className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-brand-dark-border hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all text-start">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold">{(isAr ? c.name_ar : c.name_en).charAt(0)}</div>
                <div className="flex-1"><p className="text-sm font-bold text-gray-900 dark:text-white">{isAr ? c.name_ar : c.name_en}</p><p className="text-xs text-gray-500">{isAr ? c.spec_ar : c.spec_en}</p></div>
                <div className="flex items-center gap-1 text-amber-500"><Star className="w-3.5 h-3.5 fill-current" /><span className="text-xs font-bold">{c.rating}</span></div>
              </button>
            ))}
          </div>
        </>
      )}
      {step === 3 && selectedConsultant && (
        <>
          <button onClick={() => setStep(2)} className="text-sm text-violet-600 dark:text-violet-400 hover:underline">← {isAr ? 'رجوع' : 'Back'}</button>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/15 border border-violet-100 dark:border-violet-800/30">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">{(isAr ? selectedConsultant.name_ar : selectedConsultant.name_en).charAt(0)}</div>
            <div><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{isAr ? selectedConsultant.name_ar : selectedConsultant.name_en}</p><p className="text-[11px] text-violet-600 dark:text-violet-400">{isAr ? selectedConsultant.spec_ar : selectedConsultant.spec_en}</p></div>
          </div>
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={5} placeholder={isAr ? 'اكتب سؤالك بالتفصيل...' : 'Write your question in detail...'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-brand-dark-border bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition resize-none" />
          <button onClick={handleSubmit} disabled={!question.trim() || submitting} className="w-full py-3 bg-gradient-to-l from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-violet-500/25 disabled:shadow-none flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="w-4.5 h-4.5 animate-spin" />{isAr ? 'جارٍ الإرسال...' : 'Submitting...'}</> : <><Send className="w-4 h-4" />{isAr ? 'إرسال الاستشارة' : 'Send Consultation'}</>}
          </button>
        </>
      )}
    </div>
    </div>
  );

  return (
    <ServicePageWrapper icon={MessageSquare} title={{ ar: 'خدمة الاستشارة', en: 'Consultation Service' }} description={{ ar: 'احصل على استشارة متخصصة من خبراء أكاديميين', en: 'Get specialized consultation from academic experts' }} gradient="from-violet-500 to-violet-600" shadowColor="shadow-violet-500/20" guideSections={guideSections} mockRequests={requests} loadingRequests={loadingRequests}>
      {form}
    </ServicePageWrapper>
  );
};

export default ConsultationPage;