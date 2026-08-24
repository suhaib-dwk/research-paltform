import { useState, useRef, useEffect } from 'react';
import { useSite } from '../../SiteContext';
import ServicePageWrapper from './ServicePageWrapper';
import { Sparkles, Send, Bot, User, Loader2, ListChecks, Lightbulb, HelpCircle } from 'lucide-react';

const INITIAL_MSGS = [
  { id: 1, role: 'assistant', content_ar: 'مرحباً! أنا المساعد الذكي لأبحاثك. كيف يمكنني مساعدتك؟', content_en: "Hello! I'm your smart research assistant. How can I help?" },
];

const QUICK = [
  { ar: 'اقتراح عنوان بحثي', en: 'Suggest a research title', p_ar: 'اقترح 5 عناوين بحثية في مجال ', p_en: 'Suggest 5 research titles in ' },
  { ar: 'كتابة ملخص', en: 'Write an abstract', p_ar: 'ساعدني في كتابة ملخص بحث عن ', p_en: 'Help me write a research abstract about ' },
  { ar: 'تحسين نص', en: 'Improve text', p_ar: 'حسّن النص التالي أكاديمياً: ', p_en: 'Improve the following text academically: ' },
];

const AiAssistantPage = () => {
  const { currentLang, user } = useSite();
  const isAr = currentLang === 'ar';
  const [messages, setMessages] = useState(INITIAL_MSGS);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    setMessages(p => [...p, { id: Date.now(), role: 'user', content_ar: input, content_en: input }]);
    setInput('');
    setIsLoading(true);
    setTimeout(() => {
      const r = isAr ? ['بناءً على سؤالك، إليك بعض الاقتراحات المفيدة لبحثك. أنصحك بالتركيز على الجانب المنهجي وتحديد الفجوة البحثية بوضوح.', 'هذا سؤال جيد. يُفضل مراجعة الدراسات السابقة وتحليل المنهجيات المستخدمة لتحديد أفضل نهج.', 'يمكنني مساعدتك في تحسين الصياغة الأكاديمية. النص يجب أن يكون دقيقاً وموضوعياً.'] : ['Based on your question, here are some useful suggestions. Focus on methodology and clearly identify the research gap.', 'Good question. Review previous studies and analyze methodologies to determine the best approach.', 'I can help improve academic writing. Text should be precise and objective.'][Math.floor(Math.random() * 3)];
      setMessages(p => [...p, { id: Date.now(), role: 'assistant', content_ar: r, content_en: r }]);
      setIsLoading(false);
    }, 1200);
  };

  const guideSections = [
    { id: 'how', icon: ListChecks, title_ar: 'كيف تستخدم المساعد', title_en: 'How to Use', items_ar: ['اكتب سؤالك أو طلبك في مربع النص', 'اضغط Enter أو زر الإرسال', 'انتظر الرد واقرأ التوصيات', 'يمكنك المتابعة بأسئلة إضافية'], items_en: ['Type your question', 'Press Enter or Send', 'Read the response', 'Follow up with more questions'] },
    { id: 'tips', icon: Lightbulb, title_ar: 'نصائح لنتائج أفضل', title_en: 'Tips for Better Results', items_ar: ['كن محدداً في سؤالك', 'أذكر التخصص والمجال', 'اطلب التنسيق أو الصياغة بشكل صريح', 'استخدم الأزرار السريعة كنقطة بداية'], items_en: ['Be specific', 'Mention your field', 'Explicitly request formatting', 'Use quick buttons as starting point'] },
    { id: 'limit', icon: HelpCircle, title_ar: 'محدوديات المساعد', title_en: 'Limitations', items_ar: ['المساعد لا يغني عن المراجعة الأكاديمية البشرية', 'قد لا يكون دقيقاً في التخصصات النادرة جداً', 'تحقق دائماً من المعلومات والمراجع المقترحة'], items_en: ['Does not replace human academic review', 'May be less accurate in very rare fields', 'Always verify suggested references'] },
  ];

  const form = (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 340px)', minHeight: '400px' }}>
      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK.map((q, i) => (
          <button key={i} onClick={() => setInput(isAr ? q.p_ar : q.p_en)} className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#1a2744] text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-400 border border-transparent hover:border-amber-200 dark:hover:border-amber-800/30 transition-all">
            {isAr ? q.ar : q.en}
          </button>
        ))}
      </div>
      <div className="flex-1 bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-gradient-to-br from-[#c8a44e] to-[#e6c96e]' : 'bg-gradient-to-br from-amber-400 to-amber-600'}`}>
                {m.role === 'user' ? <User className="w-3.5 h-3.5 text-[#0a1628]" /> : <Bot className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#c8a44e] text-[#0a1628] rounded-tr-sm' : 'bg-gray-100 dark:bg-[#1a2744] text-gray-700 dark:text-gray-300 rounded-tl-sm'}`}>
                {isAr ? m.content_ar : m.content_en}
              </div>
            </div>
          ))}
          {isLoading && <div className="flex gap-2.5"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-white" /></div><div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-[#1a2744]"><Loader2 className="w-4 h-4 text-amber-500 animate-spin" /></div></div>}
          <div ref={endRef} />
        </div>
        <div className="p-3 border-t border-gray-100 dark:border-[#1e3050]/40">
          <div className="flex items-end gap-2">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} rows={1} placeholder={isAr ? 'اكتب سؤالك...' : 'Type your question...'} className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition resize-none" style={{ minHeight: '40px' }} />
            <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-2.5 bg-gradient-to-br from-[#c8a44e] to-[#e6c96e] text-[#0a1628] rounded-xl hover:from-[#b8953e] hover:to-[#d6b95e] disabled:from-gray-300 disabled:to-gray-300 transition-all shadow-lg shadow-amber-500/20 disabled:shadow-none flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ServicePageWrapper icon={Sparkles} title={{ ar: 'المساعد الذكي', en: 'AI Assistant' }} description={{ ar: 'مساعدك الذكي للأبحاث الأكاديمية', en: 'Your smart assistant for academic research' }} gradient="from-amber-400 to-amber-600" shadowColor="shadow-amber-500/20" guideSections={guideSections} hideRequestsTab>
      {form}
    </ServicePageWrapper>
  );
};

export default AiAssistantPage;