import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Check, Loader2, ChevronRight, ChevronDown,
  Shield, Clock, Star, Info, Send, CheckCircle,
  FileText, BookOpen, ClipboardList, UserCheck, MessageSquare
} from 'lucide-react';
import { useSite } from '../../../SiteContext';
import { getServiceConfig } from '../../../source/S02_Services/servicesConfig';

const STEPS = [
  { icon: FileText, title_ar: 'جهّز ملف البحث', title_en: 'Prepare Research File', desc_ar: 'تأكد من أن ملف البحث جاهز بصيغة PDF أو Word.', desc_en: 'Ensure your research file is ready in PDF or Word format.' },
  { icon: ClipboardList, title_ar: 'حدد التخصص والمجلة', title_en: 'Specify Specialty & Journal', desc_ar: 'أدخل التخصص الدقيق لبحثك واسم المجلة المستهدفة.', desc_en: 'Enter your exact research specialty and target journal name.' },
  { icon: Upload, title_ar: 'ارفع الملف وأرسل الطلب', title_en: 'Upload File & Submit', desc_ar: 'اسحب الملف إلى منطقة الرفع ثم اضغط على زر الإرسال.', desc_en: 'Drag the file to the upload area then click submit.' },
  { icon: UserCheck, title_ar: 'استلم تقرير التحكيم', title_en: 'Receive Review Report', desc_ar: 'بعد 3-5 أيام عمل ستحصل على تقرير تفصيلي.', desc_en: 'Within 3-5 business days you will receive a detailed report.' },
];

const FAQS = [
  { q_ar: 'ما هو التحكيم الأولي؟', q_en: 'What is Initial Review?', a_ar: 'تقييم مبدئي لبحثك من قبل محكم أكاديمي متخصص قبل إرساله للمجلة.', a_en: 'A preliminary evaluation of your research by a specialized academic reviewer before sending it to the journal.' },
  { q_ar: 'كم يستغرق التحكيم الأولي؟', q_en: 'How long does it take?', a_ar: 'يستغرق عادةً من 3 إلى 5 أيام عمل.', a_en: 'It usually takes 3 to 5 business days.' },
  { q_ar: 'ما الصيغ المقبولة؟', q_en: 'What formats are accepted?', a_ar: 'نقبل ملفات PDF و Word (.doc, .docx).', a_en: 'We accept PDF and Word files (.doc, .docx).' },
  { q_ar: 'من يقوم بتحكيم بحثي؟', q_en: 'Who reviews my research?', a_ar: 'محكم أكاديمي معتمد متخصص في مجال بحثك الدقيق.', a_en: 'A certified academic reviewer specialized in your exact research field.' },
  { q_ar: 'هل تضمنون قبول بحثي؟', q_en: 'Do you guarantee acceptance?', a_ar: 'لا، لكننا نضمن تحسين جودة البحث وتقليل أسباب الرفض.', a_en: 'No, but we guarantee improving research quality and reducing rejection reasons.' },
];

const InitialReviewPage = () => {
  const { t } = useTranslation();
  const { currentLang, isRTL } = useSite();
  const config = getServiceConfig('initial-review');

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const fileInputRef = useRef(null);

  const isAr = currentLang === 'ar';
  const title = isAr ? config?.title_ar : config?.title_en;
  const longDesc = isAr ? config?.long_desc_ar : config?.long_desc_en;

  const handleFileChange = (e) => { const f = e.target.files?.[0]; if (f) setFileName(f.name); };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) setFileName(f.name); };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSaved(true);
    setFileName('');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-2 bg-gradient-to-l from-emerald-500 to-emerald-700" />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4 flex-wrap text-xs">
            <Link to="/dashboard" className="text-gray-400 hover:text-brand-orange">{isAr ? 'الرئيسية' : 'Home'}</Link>
            <ChevronRight className={`w-3 h-3 text-gray-300 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-emerald-600 font-semibold">{title}</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-brand-dark mb-2">{title}</h1>
              <p className="text-sm text-gray-500 leading-relaxed">{longDesc}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* التعليمات */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-black text-brand-dark mb-5 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          {isAr ? 'كيف تستخدم الخدمة؟' : 'How to Use This Service?'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <step.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1 inline-block">{isAr ? `الخطوة ${i + 1}` : `Step ${i + 1}`}</span>
                <h3 className="text-sm font-bold text-brand-dark mb-0.5">{isAr ? step.title_ar : step.title_en}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{isAr ? step.desc_ar : step.desc_en}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* نموذج الطلب */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-black text-brand-dark mb-5 flex items-center gap-2">
          <Send className="w-5 h-5 text-emerald-500" />
          {isAr ? 'استخدم الخدمة الآن' : 'Use the Service Now'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{isAr ? 'التخصص الدقيق' : 'Exact Specialty'} <span className="text-red-400">*</span></label>
              <input type="text" required placeholder={isAr ? 'مثال: ذكاء اصطناعي - تعلم عميق' : 'e.g., AI - Deep Learning'} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-brand-dark outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{isAr ? 'المجلة المستهدفة (اختياري)' : 'Target Journal (Optional)'}</label>
              <input type="text" placeholder="e.g., IEEE Access" dir="ltr" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-brand-dark outline-none focus:border-emerald-500 transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{isAr ? 'رفع ملف البحث' : 'Upload Research File'} <span className="text-red-400">*</span></label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragOver ? 'border-emerald-300 bg-emerald-50' : fileName ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200 hover:border-emerald-300'}`}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
              {fileName ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Check className="w-5 h-5" /></div>
                  <p className="text-sm font-bold text-emerald-700">{fileName}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center"><Upload className="w-5 h-5" /></div>
                  <p className="text-sm font-semibold text-gray-500">{isAr ? 'اسحب الملف هنا أو انقر للاختيار' : 'Drag file here or click to select'}</p>
                  <p className="text-xs text-gray-400">PDF, DOC, DOCX</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{isAr ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (Optional)'}</label>
            <textarea rows={3} placeholder={isAr ? 'أضف أي ملاحظات...' : 'Add any notes...'} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-brand-dark outline-none focus:border-emerald-500 transition-colors resize-none" />
          </div>

          <div className="flex items-start gap-3 p-3 bg-orange-50 border border-amber-200 rounded-xl">
            <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">{isAr ? 'سيتم إشعارك ببدء التحكيم والانتهاء عبر صفحة التقديمات.' : 'You will be notified of start and completion via the submissions page.'}</p>
          </div>

          <div className="pt-3 border-t border-gray-50 flex items-center gap-4 flex-wrap">
            <button type="submit" disabled={loading || !fileName} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-l from-emerald-500 to-emerald-700 text-white hover:shadow-lg'}`}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {saved ? (isAr ? 'تم إرسال الطلب بنجاح!' : 'Sent!') : (isAr ? 'إرسال طلب التحكيم' : 'Submit Review Request')}
            </button>
            <Link to="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">{isAr ? 'العودة' : 'Back'}</Link>
          </div>
        </form>
      </motion.div>

      {/* الأسئلة الشائعة */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-black text-brand-dark mb-5 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-500" />
          {isAr ? 'أسئلة شائعة' : 'FAQ'}
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className={`border rounded-xl overflow-hidden transition-colors ${openFaq === i ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100'}`}>
              <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-3 p-4 text-start">
                <span className="text-sm font-bold text-brand-dark">{isAr ? faq.q_ar : faq.q_en}</span>
                <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown className="w-4 h-4 text-gray-400" /></motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-4 pb-4"><p className="text-sm text-gray-500 leading-relaxed">{isAr ? faq.a_ar : faq.a_en}</p></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InitialReviewPage;