import { useState } from 'react';
import { useSite } from '../../SiteContext';
import ServicePageWrapper from './ServicePageWrapper';
import { MessageSquare, Star, ListChecks, Lightbulb, HelpCircle, Send } from 'lucide-react';

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

const MOCK = [
  { id: 1, title_ar: 'استشارة في منهجية البحث النوعي', title_en: 'Qualitative Methodology Consultation', status: 'completed', date: '2025-01-08', score: 95, meta_ar: 'د. أحمد محمد' },
  { id: 2, title_ar: 'استشارة تحليل SPSS', title_en: 'SPSS Analysis Consultation', status: 'scheduled', date: '2025-01-18', meta_ar: 'د. سارة علي · 18 يناير 3:00 م' },
  { id: 3, title_ar: 'استشارة كتابة الملخص', title_en: 'Abstract Writing Consultation', status: 'needs_info', date: '2025-01-12', meta_ar: 'د. أحمد محمد', info_needed_ar: 'يرجى إرفاق مسودة الملخص الحالية لكي يتمكن المستشار من مراجعتها قبل الجلسة.' },
];

const ConsultationPage = () => {
  const { currentLang } = useSite();
  const isAr = currentLang === 'ar';
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [question, setQuestion] = useState('');
  const [step, setStep] = useState(1);

  const guideSections = [
    { id: 'how', icon: ListChecks, title_ar: 'كيف تعمل الاستشارة', title_en: 'How Consultation Works', items_ar: ['اختر موضوع الاستشارة', 'اختر المستشار المناسب', 'اكتب سؤالك أو وصف مشكلتك بالتفصيل', 'استلم رداً مفصلاً خلال 24 ساعة', 'يمكنك طلب جلسة مباشرة إضافية'], items_en: ['Choose topic', 'Select consultant', 'Write detailed question', 'Get response within 24h', 'Request live session'] },
    { id: 'features', icon: Lightbulb, title_ar: 'مزايا الخدمة', title_en: 'Features', items_ar: ['مستشارون أكاديميون معتمدون', 'ردود مكتوبة مفصلة', 'إمكانية حجز جلسات مباشرة', 'سرية تامة للاستشارة'], items_en: ['Certified academic consultants', 'Detailed written responses', 'Live session booking', 'Full confidentiality'] },
    { id: 'faq', icon: HelpCircle, title_ar: 'أسئلة شائعة', title_en: 'FAQ', items_ar: ['كم عدد الاستشارات المتاحة؟ حسب الباقة المشتركة', 'هل يمكن تغيير المستشار؟ نعم قبل بدء الاستشارة', 'ما مدة الجلسة المباشرة؟ 30-60 دقيقة'], items_en: ['How many consultations? Depends on plan', 'Change consultant? Yes before starting', 'Live session duration? 30-60 minutes'] },
  ];

  const handleTopic = (id) => { setSelectedTopic(id); setStep(2); };
  const handleConsultant = (c) => { setSelectedConsultant(c); setStep(3); };
  const handleSubmit = () => { setStep(1); setSelectedTopic(''); setSelectedConsultant(null); setQuestion(''); };

  const form = (
    <div className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5 space-y-4">
      {step === 1 && (
        <>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">{isAr ? 'اختر موضوع الاستشارة' : 'Choose Topic'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TOPICS.map(t => (
              <button key={t.id} onClick={() => handleTopic(t.id)} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-[#1e3050] hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all text-start">
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
              <button key={c.id} onClick={() => handleConsultant(c)} className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-[#1e3050] hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all text-start">
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
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={5} placeholder={isAr ? 'اكتب سؤالك بالتفصيل...' : 'Write your question in detail...'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition resize-none" />
          <button onClick={handleSubmit} disabled={!question.trim()} className="w-full py-3 bg-gradient-to-l from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-violet-500/25 disabled:shadow-none flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />{isAr ? 'إرسال الاستشارة' : 'Send Consultation'}
          </button>
        </>
      )}
    </div>
  );

  return (
    <ServicePageWrapper icon={MessageSquare} title={{ ar: 'خدمة الاستشارة', en: 'Consultation Service' }} description={{ ar: 'احصل على استشارة متخصصة من خبراء أكاديميين', en: 'Get specialized consultation from academic experts' }} gradient="from-violet-500 to-violet-600" shadowColor="shadow-violet-500/20" guideSections={guideSections} mockRequests={MOCK}>
      {form}
    </ServicePageWrapper>
  );
};

export default ConsultationPage;