import { useState } from 'react';
import { useSite } from '../../SiteContext';
import ServicePageWrapper from './ServicePageWrapper';
import { Mail, Send, FileText, Copy, ListChecks, Lightbulb, HelpCircle } from 'lucide-react';

const TYPES = [
  { id: 'cover', label_ar: 'رسالة تغطية', label_en: 'Cover Letter', desc_ar: 'مرافقة لتقديم البحث', desc_en: 'Accompanying submission letter' },
  { id: 'rebuttal', label_ar: 'رد على الملاحظات', label_en: 'Rebuttal Letter', desc_ar: 'رد مفصل على المحكمين', desc_en: 'Detailed reviewer response' },
  { id: 'revision', label_ar: 'رسالة تنقيح', label_en: 'Revision Letter', desc_ar: 'مع النسخة المنقحة', desc_en: 'With revised version' },
  { id: 'withdrawal', label_ar: 'رسالة سحب', label_en: 'Withdrawal Letter', desc_ar: 'طلب سحب البحث', desc_en: 'Withdrawal request' },
  { id: 'inquiry', label_ar: 'رسالة استفسار', label_en: 'Inquiry Letter', desc_ar: 'حالة البحث المقدم', desc_en: 'Submitted paper status' },
];

const MOCK = [
  { id: 1, title_ar: 'رسالة تغطية لمجلة Nature', title_en: 'Cover Letter for Nature', status: 'completed', date: '2025-01-10', meta_ar: 'رسالة تغطية' },
  { id: 2, title_ar: 'رد على ملاحظات المحكمين', title_en: 'Rebuttal to Reviewers', status: 'draft', date: '2025-01-14', meta_ar: 'رد على الملاحظات' },
  { id: 3, title_ar: 'رسالة تنقيح البحث', title_en: 'Revision Letter', status: 'needs_info', date: '2025-01-12', meta_ar: 'رسالة تنقيح', info_needed_ar: 'يرجى إرفاق نسخة البحث المنقحة بالنقاط المطلوبة لكي نتمكن من صياغة الرسالة بدقة.' },
];

const TPL_CONTENT = {
  cover: { ar: 'السيد المحترم / رئيس تحرير مجلة [اسم المجلة]\n\nتحية طيبة وبعد،\n\nنتشرف بتقديم بحثنا الموسوم بـ "عنوان البحث" للنشر في مجلتكم الموقرة...\n\nمع خالص التقدير،', en: 'Dear Editor-in-Chief, [Journal Name]\n\nWe are pleased to submit our manuscript entitled "Title" for consideration...\n\nSincerely,' },
  rebuttal: { ar: 'السيد المحترم / رئيس التحرير\n\nنشكركم على ملاحظات المحكمين القيمة. فيما يلي ردنا التفصيلي...\n\nمع التقدير,', en: 'Dear Editor,\n\nWe thank the reviewers for their valuable comments. Below is our detailed response...\n\nSincerely,' },
};

const CorrespondencePage = () => {
  const { currentLang } = useSite();
  const isAr = currentLang ==='ar';
  const [selectedType, setSelectedType] = useState(null);
  const [content, setContent] = useState('');
  const [showTpl, setShowTpl] = useState(false);

  const handleSelect = (t) => { setSelectedType(t); const tpl = TPL_CONTENT[t.id]; setContent(tpl ? (isAr ? tpl.ar : tpl.en) : ''); setShowTpl(false); };

  const guideSections = [
    { id: 'types', icon: ListChecks, title_ar: 'أنواع الرسائل', title_en: 'Letter Types', items_ar: ['رسالة تغطية: ترافق تقديم البحث للمجلة', 'رد على الملاحظات: رد مفصل على كل ملاحظة محكم', 'رسالة تنقيح: تُقدّم مع النسخة المنقحة', 'رسالة سحب: لسحب البحث من المجلة', 'رسالة استفسار: للسؤال عن حالة البحث'], items_en: ['Cover Letter: accompanies submission', 'Rebuttal: detailed response to each comment', 'Revision Letter: with revised version', 'Withdrawal Letter: to withdraw paper', 'Inquiry: check paper status'] },
    { id: 'tips', icon: Lightbulb, title_ar: 'نصائح كتابة المراسلات', title_en: 'Writing Tips', items_ar: ['استخدم لغة رسمية ومحترمة', 'كن مختصراً ومباشراً', 'أشر إلى رقم الإرسال إن وجد', 'راجع الرسالة قبل الإرسال'], items_en: ['Use formal and respectful language', 'Be concise and direct', 'Reference submission number if available', 'Review before sending'] },
  ];

  const form = (
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
              <button className="flex-1 py-3 bg-gradient-to-l from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"><Send className="w-4 h-4" />{isAr ? 'حفظ وإرسال' : 'Save & Send'}</button>
              <button className="px-4 py-3 border border-gray-200 dark:border-[#1e3050] text-gray-500 font-semibold text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a2744] transition-all">{isAr ? 'مسودة' : 'Draft'}</button>
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
  );

  return (
    <ServicePageWrapper icon={Mail} title={{ ar: 'المراسلات الأكاديمية', en: 'Academic Correspondence' }} description={{ ar: 'إنشاء رسائل أكاديمية احترافية', en: 'Create professional academic letters' }} gradient="from-pink-500 to-pink-600" shadowColor="shadow-pink-500/20" guideSections={guideSections} mockRequests={MOCK}>
      {form}
    </ServicePageWrapper>
  );
};

export default CorrespondencePage;