import { useState } from 'react';
import { 
  Scale, 
  Languages, 
  FileText, 
  MessageSquare, 
  Bot, 
  ArrowRight, 
  CheckCircle2,
  X, 
  Check,
  Circle
} from 'lucide-react';
import { useSite } from '../SiteContext';

// =========================================================
// بيانات الخدمات مع خطوات العمل
// =========================================================
const SERVICES_DATA = [
  {
    id: 'peer_review',
    icon: Scale,
    title: { ar: 'تحكيم', en: 'Peer Review' },
    desc: { 
      ar: 'مراجعة أكاديمية لجاهزية بحثك من حيث المنهجية والوضوح والالتزام بمعايير النشر.',
      en: 'Academic review of your research readiness in terms of methodology, clarity, and adherence to publication standards.'
    },
    steps: [
      { title: { ar: 'رفع الملف', en: 'Upload File' }, desc: { ar: 'قم برفع نسخة من بحثك بصيغة PDF أو Word.', en: 'Upload a copy of your research in PDF or Word format.' } },
      { title: { ar: 'الفحص الأولي', en: 'Initial Check' }, desc: { ar: 'سيتم التحقق من توافق البحث مع المعايير الأساسية.', en: 'The research will be checked against basic standards.' } },
      { title: { ar: 'مراجعة الخبراء', en: 'Expert Review' }, desc: { ar: 'خبير أكاديمي يراجع المنهجية والوضوح والجودة.', en: 'An academic expert reviews methodology, clarity, and quality.' } },
      { title: { ar: 'استلام التقرير', en: 'Receive Report' }, desc: { ar: 'احصل على تقرير مفصل بالملاحظات والاقتراحات.', en: 'Receive a detailed report with notes and suggestions.' } }
    ]
  },
  {
    id: 'translation',
    icon: Languages,
    title: { ar: 'الترجمة', en: 'Translation' },
    desc: { 
      ar: 'ترجمة أكاديمية دقيقة لبحثك مع الحفاظ على المصطلحات العلمية.',
      en: 'Accurate academic translation of your research preserving scientific terminology.'
    },
    steps: [
      { title: { ar: 'تقديم الطلب', en: 'Submit Request' }, desc: { ar: 'حدد اللغة المستهدفة وارفع المستند.', en: 'Select target language and upload the document.' } },
      { title: { ar: 'حساب التكلفة', en: 'Cost Calculation' }, desc: { ar: 'سيتم احتساب عدد الكلمات والسعر المبدئي.', en: 'Word count and initial price will be calculated.' } },
      { title: { ar: 'عملية الترجمة', en: 'Translation Process' }, desc: { ar: 'مترجم متخصص يقوم بترجمة المحتوى بدقة.', en: 'A specialized translator accurately translates the content.' } },
      { title: { ar: 'التدقيق والتسليم', en: 'Proofreading & Delivery' }, desc: { ar: 'مراجعة الترجمة وتسليم الملف النهائي.', en: 'Reviewing the translation and delivering the final file.' } }
    ]
  },
  {
    id: 'proofreading',
    icon: FileText,
    title: { ar: 'التدقيق اللغوي', en: 'Proofreading' },
    desc: { 
      ar: 'تدقيق لغوي شامل يعالج الأخطاء النحوية والإملائية وركاكة الصياغة.',
      en: 'Comprehensive linguistic proofreading addressing grammatical, spelling, and phrasing errors.'
    },
    steps: [
      { title: { ar: 'رفع المسودة', en: 'Upload Draft' }, desc: { ar: 'ارفع الملف الذي تريد تدقيقه.', en: 'Upload the file you want proofread.' } },
      { title: { ar: 'التحليل اللغوي', en: 'Linguistic Analysis' }, desc: { ar: 'تحديد الأخطاء النحوية والأسلوبية.', en: 'Identifying grammatical and stylistic errors.' } },
      { title: { ar: 'التعديل والتصحيح', en: 'Editing & Correction' }, desc: { ar: 'تطبيق التصحيحات اللازمة مع الحفاظ على المعنى.', en: 'Applying necessary corrections while preserving meaning.' } },
      { title: { ar: 'النسخة النهائية', en: 'Final Version' }, desc: { ar: 'تحميل النسقة المصححة مع تتبع التغييرات.', en: 'Download the corrected copy with track changes.' } }
    ]
  },
  {
    id: 'consultation',
    icon: MessageSquare,
    title: { ar: 'الاستشارة', en: 'Consultation' },
    desc: { 
      ar: 'جلسة استشارية مع مختص لمناقشة تحدٍّ محدد يواجهك في بحثك.',
      en: 'Consultation session with an expert to discuss a specific research challenge.'
    },
    steps: [
      { title: { ar: 'تحديد الموعد', en: 'Schedule Slot' }, desc: { ar: 'اختر الوقت المناسب للاستشارة.', en: 'Choose a suitable time for the consultation.' } },
      { title: { ar: 'إعداد الأسئلة', en: 'Prepare Questions' }, desc: { ar: 'اكتب النقاط التي تريد مناقشتها مسبقاً.', en: 'Write down the points you want to discuss in advance.' } },
      { title: { ar: 'عقد الجلسة', en: 'Hold Session' }, desc: { ar: 'الاجتماع مع المخترص عبر الإنترنت أو حضورياً.', en: 'Meeting with the expert online or in person.' } },
      { title: { ar: 'خلاصة وتوصيات', en: 'Summary & Advice' }, desc: { ar: 'الحصول على محضر الجلسة والتوصيات.', en: 'Receive session minutes and recommendations.' } }
    ]
  },
  {
    id: 'ai_assistant',
    icon: Bot,
    title: { ar: 'المساعد الذكي', en: 'AI Assistant' },
    desc: { 
      ar: 'أداة ذكية لمساعدتك في صياغة الأفكار وتحسين المحتوى.',
      en: 'Smart tool to assist you in drafting ideas and improving content.'
    },
    steps: [
      { title: { ar: 'اختيار الأداة', en: 'Select Tool' }, desc: { ar: 'اختر ما إذا كنت تريد تلخيصاً أو صياغة أو تحليلاً.', en: 'Choose if you want summarization, drafting, or analysis.' } },
      { title: { ar: 'إدخال البيانات', en: 'Input Data' }, desc: { ar: 'الصق النص أو الملف المراد معالجته.', en: 'Paste the text or file to be processed.' } },
      { title: { ar: 'المعالجة الذكية', en: 'AI Processing' }, desc: { ar: 'يقوم النظام بإنشاء النتائج بناءً على طلبك.', en: 'The system generates results based on your request.' } },
      { title: { ar: 'تحرير النتائج', en: 'Edit Results' }, desc: { ar: 'مراجعة الإخراج وتعديله حسب الحاجة.', en: 'Review the output and edit as needed.' } }
    ]
  },
];

const TasksPage = () => {
  const { user, currentLang } = useSite();
  const isAr = currentLang === 'ar';

  const [selectedService, setSelectedService] = useState(null);

  const openModal = (service) => setSelectedService(service);
  const closeModal = () => setSelectedService(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] pb-12">
      
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                {isAr ? 'تصفح واستكشف الخدمات' : 'Browse & Explore Services'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {isAr 
                  ? `لديك ${SERVICES_DATA.length} خدمة جاهزة للاستخدام لتطوير بحثك.` 
                  : `You have ${SERVICES_DATA.length} ready-to-use services to develop your research.`
                }
              </p>
            </div>
            <div className="flex items-center gap-2 bg-brand-orange/10 dark:bg-brand-orange/20 px-4 py-2 rounded-lg border border-brand-orange/20">
              <CheckCircle2 className="w-5 h-5 text-brand-orange" />
              <span className="font-bold text-brand-orange">
                {isAr ? 'حالة النشاط: نشط' : 'Status: Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-8">

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.id} 
                onClick={() => openModal(service)}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {service.title[isAr ? 'ar' : 'en']}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {service.desc[isAr ? 'ar' : 'en']}
                  </p>

                  <div className="mt-auto flex items-center justify-center gap-2 text-brand-orange font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>{isAr ? 'عرض التفاصيل والخطوات' : 'View Details & Steps'}</span>
                    <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
           نافذة التفاصيل المنبثقة (Details Modal) - محسنة للعربية
      ========================================================= */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-fade-in-up flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-brand-orange text-white flex items-center justify-center shadow-lg shrink-0`}>
                  <selectedService.icon className="w-6 h-6" />
                </div>
                <div className="text-right sm:text-left"> {/* Fix alignment for mixed directions if needed, though dir usually handles it */}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedService.title[isAr ? 'ar' : 'en']}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {isAr ? 'مسار العمل المتبع' : 'Workflow Path'}
                  </p>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed text-right sm:text-right">
                {selectedService.desc[isAr ? 'ar' : 'en']}
              </p>

              {/* Steps Timeline - تم تحسينه للعربية والإنجليزية */}
              <div className="space-y-8">
                {selectedService.steps.map((step, idx) => (
                  <div key={idx} className={`relative flex gap-6 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Icon and Line Column */}
                    <div className="flex flex-col items-center relative z-10">
                      {/* Circle Icon */}
                      <div className="w-10 h-10 rounded-full bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange border-2 border-brand-orange dark:border-brand-orange flex items-center justify-center shrink-0">
                         <Check className="w-5 h-5" />
                      </div>
                      
                      {/* Connecting Line (vertical) */}
                      {idx !== selectedService.steps.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 my-2 absolute top-10 bottom-[-20px]"></div>
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 pt-2 pb-2">
                      <span className="inline-block px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">
                        {isAr ? `الخطوة ${idx + 1}` : `Step ${idx + 1}`}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {step.title[isAr ? 'ar' : 'en']}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {step.desc[isAr ? 'ar' : 'en']}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

            </div>

            {/* تم إزالة التذييل (Footer) والأزرار كما طلبت */}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;