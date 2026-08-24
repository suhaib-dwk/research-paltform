import { useState } from 'react';
import { useSite } from '../../SiteContext';
import ServicePageWrapper from '../services/ServicePageWrapper';
import { Send, CheckCircle, Circle, ArrowRight, FileText, Upload, AlertCircle, ListChecks, Lightbulb, HelpCircle } from 'lucide-react';

const STEPS = [
  { id: 1, label_ar: 'اختيار المجلة', label_en: 'Select Journal' },
  { id: 2, label_ar: 'مراجعة الملفات', label_en: 'Review Files' },
  { id: 3, label_ar: 'معلومات التقديم', label_en: 'Submission Info' },
  { id: 4, label_ar: 'التأكيد والإرسال', label_en: 'Confirm & Submit' },
];

const REQ_FILES = [
  { id: 'manuscript', label_ar: 'المخطوطة', label_en: 'Manuscript', req: true },
  { id: 'figures', label_ar: 'الرسومات', label_en: 'Figures', req: true },
  { id: 'cover_letter', label_ar: 'رسالة التغطية', label_en: 'Cover Letter', req: true },
  { id: 'supplementary', label_ar: 'مواد تكميلية', label_en: 'Supplementary', req: false },
];

const MOCK = [
  { id: 1, title_ar: 'نشر بحث الذكاء الاصطناعي', title_en: 'Publish AI Research', status: 'submitted', date: '2025-01-10', meta_ar: 'Nature Computing Science' },
  { id: 2, title_ar: 'نشر بحث الطب', title_en: 'Publish Medical Research', status: 'under_review', date: '2025-01-12', progress: 40, meta_ar: 'Journal of Medical Research' },
  { id: 3, title_ar: 'نشر بحث الهندسة', title_en: 'Publish Engineering Research', status: 'revision_needed', date: '2025-01-08', meta_ar: 'IEEE Access', revision_note_ar: 'المحكمون طلبوا تعديل القسم التجريبي وإضافة مقارنة مع منهجية بديلة.' },
  { id: 4, title_ar: 'نشر بحث سابق', title_en: 'Publish Previous Research', status: 'accepted', date: '2025-01-05', meta_ar: 'PLOS ONE' },
  { id: 5, title_ar: 'نشر بحث مرفوض', title_en: 'Publish Rejected Research', status: 'rejected', date: '2025-01-03', meta_ar: 'مجلة غير مناسبة', info_needed_ar: 'يمكنك إعادة التقديم لمجلة أخرى. استخدم خدمة اختيار المجلة للمساعدة.' },
];

const PublicationPage = () => {
  const { currentLang, isRTL } = useSite();
  const isAr = currentLang ==='ar';
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState({});
  const [journal, setJournal] = useState('');
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [authors, setAuthors] = useState([{ name: '', email: '' }]);

  const addAuthor = () => setAuthors(p => [...p, { name: '', email: '' }]);
  const updateAuthor = (i, f, v) => setAuthors(p => { const n = [...p]; n[i][f] = v; return n; });
  const removeAuthor = (i) => authors.length > 1 && setAuthors(p => p.filter((_, idx) => idx !== i));

  const canProceed = () => {
    if (step === 1) return journal.trim().length > 0;
    if (step === 2) return REQ_FILES.filter(f => f.req).every(f => files[f.id]);
    if (step === 3) return title.trim().length > 0 && abstract.trim().length > 0;
    return true;
  };

  const guideSections = [
    { id: 'how', icon: ListChecks, title_ar: 'خطوات النشر', title_en: 'Publication Steps', items_ar: ['اختر المجلة المستهدفة', 'ارفع جميع الملفات المطلوبة', 'أدخل بيانات البحث والمؤلفين', 'راجع التفاصيل وأرسل الطلب', 'تابع حالة التقديم من تبويب طلباتي'], items_en: ['Select target journal', 'Upload all required files', 'Enter research & author details', 'Review and submit', 'Track status in My Requests'] },
    { id: 'statuses', icon: Lightbulb, title_ar: 'حالات التقديم', title_en: 'Submission Statuses', items_ar: ['تم الإرسال: وصل طلبك للمنصة', 'قيد المراجعة: لدى المحكمين حالياً', 'بحاجة إلى تعديل: المحكمون طلبوا تعديلات', 'مقبول: تم قبول البحث للنشر!', 'مرفوض: لم يُقبل، يمكنك إعادة التقديم'], items_en: ['Submitted: request received', 'Under Review: with reviewers', 'Revision Needed: reviewers requested changes', 'Accepted: paper accepted!', 'Rejected: not accepted, can resubmit'] },
    { id: 'tips', icon: HelpCircle, title_ar: 'نصائح للقبول', title_en: 'Acceptance Tips', items_ar: ['استخدم خدمة التحكيم قبل التقديم', 'تأكد من توافق البحث مع نطاق المجلة', 'اكتب رسالة تغطية قوية', 'استجب لملاحظات المحكمين بدقة'], items_en: ['Use review service before submitting', 'Ensure research fits journal scope', 'Write a strong cover letter', 'Respond carefully to reviewer comments'] },
  ];

  const form = (
    <div className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5 space-y-4">
      {/* شريط التقدم */}
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > s.id ? 'bg-emerald-500 text-white' : step === s.id ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30' : 'bg-gray-200 dark:bg-[#1e3050] text-gray-400'}`}>
              {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
            </div>
            <span className={`text-[10px] font-semibold hidden sm:block ${step >= s.id ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>{isAr ? s.label_ar : s.label_en}</span>
            {i < 3 && <div className={`flex-1 h-0.5 mx-1.5 rounded-full ${step > s.id ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-[#1e3050]'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3 max-w-lg">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">{isAr ? 'اسم المجلة' : 'Journal Name'}</h2>
          <input type="text" value={journal} onChange={(e) => setJournal(e.target.value)} placeholder={isAr ? 'مثال: Journal of Advanced Research' : 'e.g. Journal of Advanced Research'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition" />
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/30"><AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" /><p className="text-xs text-amber-700 dark:text-amber-400">{isAr ? 'يمكنك استخدام خدمة اختيار المجلة للمساعدة.' : 'Use the Journal Selection service for help.'}</p></div>
        </div>
      )}
      {step === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REQ_FILES.map(r => (
            <div key={r.id} className="p-3.5 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] space-y-2">
              <div className="flex items-center justify-between"><span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{isAr ? r.label_ar : r.label_en}</span>{r.req && <span className="text-[10px] font-bold text-rose-500">{isAr ? 'مطلوب' : 'Required'}</span>}</div>
              {files[r.id] ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/30"><span className="text-xs text-emerald-700 dark:text-emerald-400 truncate max-w-[140px]">{files[r.id].name}</span><button onClick={() => setFiles(p => { const n = { ...p }; delete n[r.id]; return n; })} className="text-rose-400 text-xs">✕</button></div>
              ) : (
                <label className="flex items-center justify-center h-9 border-2 border-dashed border-gray-200 dark:border-[#1e3050] rounded-lg cursor-pointer hover:border-rose-300 transition-all"><input type="file" className="hidden" onChange={(e) => setFiles(p => ({ ...p, [r.id]: e.target.files[0] }))} /><span className="text-xs text-gray-400">{isAr ? 'اختر ملف' : 'Choose'}</span></label>
              )}
            </div>
          ))}
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <div><label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'العنوان' : 'Title'}</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition" /></div>
          <div><label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'الملخص' : 'Abstract'}</label><textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition resize-none" /></div>
          <div><label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'الكلمات المفتاحية' : 'Keywords'}</label><input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder={isAr ? 'افصل بفواصل' : 'Comma separated'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition" /></div>
          <div>
            <div className="flex items-center justify-between mb-2"><label className="text-xs font-semibold text-gray-500 dark:text-gray-400">{isAr ? 'المؤلفون' : 'Authors'}</label><button onClick={addAuthor} className="text-xs font-semibold text-rose-600 hover:underline">+ {isAr ? 'إضافة' : 'Add'}</button></div>
            <div className="space-y-2">{authors.map((a, i) => (
              <div key={i} className="flex gap-2"><input type="text" value={a.name} onChange={(e) => updateAuthor(i, 'name', e.target.value)} placeholder={isAr ? 'الاسم' : 'Name'} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-[#1e3050] bg-white dark:bg-[#0c1425] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition" /><input type="email" value={a.email} onChange={(e) => updateAuthor(i, 'email', e.target.value)} placeholder="Email" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-[#1e3050] bg-white dark:bg-[#0c1425] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition" />{authors.length > 1 && <button onClick={() => removeAuthor(i)} className="text-gray-400 hover:text-rose-500 text-sm px-1">✕</button>}</div>
            ))}</div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{isAr ? 'تأكيد التقديم' : 'Confirm Submission'}</h2>
          {[{ l: isAr ? 'المجلة' : 'Journal', v: journal }, { l: isAr ? 'العنوان' : 'Title', v: title }, { l: isAr ? 'المؤلفون' : 'Authors', v: `${authors.filter(a => a.name).length} ${isAr ? 'مؤلف' : 'author(s)'}` }, { l: isAr ? 'الملفات' : 'Files', v: `${Object.keys(files).length} ${isAr ? 'ملف' : 'file(s)'}` }].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#0a1628] border border-gray-100 dark:border-[#1e3050]/30"><span className="text-xs font-semibold text-gray-500 min-w-[70px]">{item.l}</span><span className="text-sm text-gray-800 dark:text-gray-200">{item.v}</span></div>
          ))}
        </div>
      )}

      {/* أزرار التنقل */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#1e3050]/30">
        <button onClick={() => setStep(p => Math.max(1, p - 1))} disabled={step === 1} className="px-5 py-2.5 text-sm font-semibold text-gray-500 border border-gray-200 dark:border-[#1e3050] rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a2744] disabled:opacity-40 transition-all">{isAr ? 'السابق' : 'Previous'}</button>
        {step < 4 ? (
          <button onClick={() => setStep(p => p + 1)} disabled={!canProceed()} className="px-6 py-2.5 bg-gradient-to-l from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-rose-500/25 disabled:shadow-none flex items-center gap-2">{isAr ? 'التالي' : 'Next'}<ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} /></button>
        ) : (
          <button className="px-6 py-2.5 bg-gradient-to-l from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 flex items-center gap-2"><Send className="w-4 h-4" />{isAr ? 'إرسال' : 'Submit'}</button>
        )}
      </div>
    </div>
  );

  return (
    <ServicePageWrapper icon={Send} title={{ ar: 'خدمة النشر', en: 'Publication Service' }} description={{ ar: 'قدّم بحثك للمجلات باحترافية', en: 'Submit your research to journals professionally' }} gradient="from-rose-500 to-rose-600" shadowColor="shadow-rose-500/20" guideSections={guideSections} mockRequests={MOCK}>
      {form}
    </ServicePageWrapper>
  );
};

export default PublicationPage;