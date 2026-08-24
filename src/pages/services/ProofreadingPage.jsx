import { useState } from 'react';
import { useSite } from '../../SiteContext';
import ServicePageWrapper from './ServicePageWrapper';
import { FileText, Upload, ListChecks, Lightbulb, HelpCircle, CheckCircle } from 'lucide-react';

const DOC_TYPES = [
  { id: 'article', label_ar: 'ورقة بحثية', label_en: 'Research Article' }, { id: 'thesis', label_ar: 'رسالة ماجستير/دكتوراه', label_en: 'Thesis / Dissertation' },
  { id: 'abstract', label_ar: 'ملخص بحثي', label_en: 'Abstract' }, { id: 'report', label_ar: 'تقرير بحثي', label_en: 'Research Report' }, { id: 'other', label_ar: 'أخرى', label_en: 'Other' },
];

const MOCK = [
  { id: 1, title_ar: 'تدقيق بحث الهندسة الوراثية', title_en: 'Genetic Engineering Editing', status: 'completed', date: '2025-01-08', score: 91, meta_ar: 'ورقة بحثية · APA' },
  { id: 2, title_ar: 'تدقيق رسالة الدكتوراه', title_en: 'PhD Thesis Editing', status: 'in_progress', date: '2025-01-15', progress: 35, meta_ar: 'رسالة · IEEE' },
  { id: 3, title_ar: 'تدقيق ملخص مؤتمر', title_en: 'Conference Abstract Editing', status: 'needs_info', date: '2025-01-11', meta_ar: 'ملخص · MLA', info_needed_ar: 'يرجى توضيح هل النص بالعربية أم الإنجليزية، واسم المؤتمر المستهدف.' },
];

const ProofreadingPage = () => {
  const { currentLang } = useSite();
  const isAr = currentLang === 'ar';
  const [docType, setDocType] = useState('article');
  const [file, setFile] = useState(null);
  const [styleGuide, setStyleGuide] = useState('apa');
  const [notes, setNotes] = useState('');

  const guideSections = [
    { id: 'how', icon: ListChecks, title_ar: 'خطوات التدقيق', title_en: 'Editing Steps', items_ar: ['اختر نوع المستند', 'ارفع الملف بصيغة Word أو PDF', 'حدد دليل الأسلوب المطلوب', 'أضف ملاحظات عن التدقيق المطلوب', 'إرسال الطلب'], items_en: ['Select document type', 'Upload file', 'Choose style guide', 'Add notes', 'Submit'] },
    { id: 'features', icon: Lightbulb, title_ar: 'ما يتضمنه التدقيق', title_en: 'What\'s Included', items_ar: ['تصحيح الأخطاء النحوية والإملائية', 'تحسين الصياغة والوضوح', 'التوافق مع دليل الأسلوب المختار', 'تسليط الضوء على التعديلات', 'تقرير بالتغييرات المُجراة'], items_en: ['Grammar & spelling correction', 'Clarity improvement', 'Style guide compliance', 'Highlighted changes', 'Change report'] },
    { id: 'faq', icon: HelpCircle, title_ar: 'أسئلة شائعة', title_en: 'FAQ', items_ar: ['هل التدقيق يشمل المحتوى العلمي؟ لا، التدقيق لغوي فقط. للمحتوى العلمي استخدم خدمة التحكيم', 'كم عدد الجولات المسموحة؟ تعديل واحد مجاني بعد التسليم', 'ما الفرق بين التدقيق والتحكيم؟ التدقيق لغوي، التحكيم علمي ومنهجي'], items_en: ['Does it include scientific review? No, linguistic only', 'Free revision rounds? One after delivery', 'Difference from review? Editing is linguistic, review is scientific'] },
  ];

  const form = (
    <div className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{isAr ? 'نوع المستند' : 'Document Type'}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DOC_TYPES.map(dt => (
            <button key={dt.id} onClick={() => setDocType(dt.id)} className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${docType === dt.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-gray-200 dark:border-[#1e3050] text-gray-500 dark:text-gray-400 hover:border-gray-300'}`}>
              {isAr ? dt.label_ar : dt.label_en}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'رفع المستند' : 'Upload'} <span className="text-rose-500">*</span></label>
        <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-200 dark:border-[#1e3050] rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all group">
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept=".doc,.docx,.pdf" />
          {file ? <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-5 h-5" /><span className="text-sm font-semibold">{file.name}</span><button onClick={(e) => { e.preventDefault(); setFile(null); }} className="text-rose-500 text-xs">✕</button></div>
            : <><Upload className="w-6 h-6 text-gray-300 dark:text-gray-600 group-hover:text-emerald-400 transition-colors mb-1" /><span className="text-xs text-gray-400">{isAr ? 'اسحب الملف أو انقر' : 'Drag or click'}</span></>}
        </label>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'دليل الأسلوب' : 'Style Guide'}</label>
        <select value={styleGuide} onChange={(e) => setStyleGuide(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition">
          <option value="apa">APA 7th</option><option value="mla">MLA</option><option value="chicago">Chicago</option><option value="ieee">IEEE</option><option value="vancouver">Vancouver</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'ملاحظات' : 'Notes'}</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder={isAr ? 'مثال: التركيز على القواعد والترقيم...' : 'e.g. Focus on grammar and punctuation...'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition resize-none" />
      </div>
      <button disabled={!file} className="w-full py-3 bg-gradient-to-l from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/25 disabled:shadow-none">
        {isAr ? 'إرسال طلب التدقيق' : 'Submit Editing Request'}
      </button>
    </div>
  );

  return (
    <ServicePageWrapper icon={FileText} title={{ ar: 'خدمة التدقيق اللغوي', en: 'Language Editing' }} description={{ ar: 'تدقيق لغوي وأكاديمي شامل لنصوصك', en: 'Comprehensive linguistic and academic editing' }} gradient="from-emerald-500 to-emerald-600" shadowColor="shadow-emerald-500/20" guideSections={guideSections} mockRequests={MOCK}>
      {form}
    </ServicePageWrapper>
  );
};

export default ProofreadingPage;