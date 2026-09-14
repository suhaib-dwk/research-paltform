import { useState, useRef, useEffect } from 'react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';
import ServicePageWrapper from './ServicePageWrapper';
import { Sparkles, Send, Bot, User, Loader2, ListChecks, Lightbulb, HelpCircle, AlertCircle } from 'lucide-react';

// ✅ رسالة الترحيب الافتراضية بنسختين — تُستبدَل حسب لغة الواجهة الحالية عند
// أول تحميل فقط (انظر useState الابتدائي بالمكوّن)، وليست ثنائية اللغة بعد ذلك.
const getInitialMsgs = (isAr) => [
  { id: 1, role: 'assistant', content: isAr ? 'مرحباً! أنا المساعد الذكي لأبحاثك. كيف يمكنني مساعدتك؟' : "Hello! I'm your smart research assistant. How can I help?" },
];

const QUICK = [
  { ar: 'اقتراح عنوان بحثي', en: 'Suggest a research title', p_ar: 'اقترح 5 عناوين بحثية في مجال ', p_en: 'Suggest 5 research titles in ' },
  { ar: 'كتابة ملخص', en: 'Write an abstract', p_ar: 'ساعدني في كتابة ملخص بحث عن ', p_en: 'Help me write a research abstract about ' },
  { ar: 'تحسين نص', en: 'Improve text', p_ar: 'حسّن النص التالي أكاديمياً: ', p_en: 'Improve the following text academically: ' },
];

const AiAssistantPage = () => {
  const { currentLang, user } = useSite();
  const isAr = currentLang === 'ar';
  const entityId = user?.user_id ?? user?.id;
  const [messages, setMessages] = useState(() => getInitialMsgs(isAr));
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null); // { type: 'info' | 'error', text }
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ✅ يستدعي ai_chat_assistant.php فعلياً — يقرأ مفتاح المزوّد المفعّل (OpenRouter/OpenAI)
  // من لوحة تحكم الأدمن (نفس آلية تقييم جاهزية الجامعة)، بدل الردود الوهمية الثابتة سابقاً.
  //
  // ✅ كل رسالة تُخزَّن بحقل content واحد فقط (نص فعلي بلغة كتابتها/استلامها)،
  // لا content_ar/content_en مكرَّرين — لأنه لا توجد ترجمة فعلية بينهما أصلاً.
  // هذا يمنع تناقضاً كان يحدث سابقاً: لو المستخدم بدّل لغة الواجهة منتصف
  // محادثة قائمة، كانت رسائل سابقة تُعرض/تُرسَل بلغة الواجهة الحالية بأثر
  // رجعي رغم أن نصها الفعلي المخزَّن لم يتغيّر (لأن content_ar/content_en
  // كانا نسخة واحدة مكررة تحت مفتاحين، لا ترجمة حقيقية). الآن lang المُرسل
  // للخادم يعتمد على لغة رسالة المستخدم الحالية فعلياً، لا على currentLang
  // العامة المطبَّقة بأثر رجعي على كل التاريخ.
  const handleSend = async () => {
    if (!input.trim() || isLoading || !entityId) return;
    const userMessage = { id: Date.now(), role: 'user', content: input, lang: currentLang };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);
    setErrorNotice(null);

    try {
      // نرسل تاريخ المحادثة كاملاً (بصيغة role/content بسيطة يفهمها أي مزوّد متوافق مع OpenAI)
      const history = nextMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_BASE_URL}/ai_chat_assistant.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ✅ lang هنا يعكس لغة الرسالة الحالية فعلياً (وليس لغة واجهة عامة
        // قد لا تطابق لغة النص الفعلي لو بُدِّلت أثناء محادثة قائمة).
        body: JSON.stringify({ user_id: entityId, lang: currentLang, messages: history }),
      });
      const result = await res.json();

      if (result.status === 'success') {
        const replyText = result.data.content;
        setMessages((p) => [...p, { id: Date.now() + 1, role: 'assistant', content: replyText, lang: currentLang }]);
      } else if (result.message === 'ai_not_configured') {
        setErrorNotice({ type: 'info', text: isAr ? 'ميزة الذكاء الاصطناعي غير مُفعّلة بعد على هذا الخادم (لم يُضبط مفتاح مزوّد من لوحة تحكم الأدمن).' : 'AI features are not configured on this server yet (no provider key set from the admin panel).' });
      } else {
        setErrorNotice({ type: 'error', text: isAr ? 'تعذّر الحصول على رد، حاول مرة أخرى لاحقاً.' : 'Failed to get a response, please try again later.' });
      }
    } catch (err) {
      setErrorNotice({ type: 'error', text: isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server' });
    } finally {
      setIsLoading(false);
    }
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
          <button key={i} onClick={() => setInput(isAr ? q.p_ar : q.p_en)} className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2a231e] text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-orange-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-400 border border-transparent hover:border-amber-200 dark:hover:border-amber-800/30 transition-all">
            {isAr ? q.ar : q.en}
          </button>
        ))}
      </div>
      {errorNotice && (
        <div className={`flex items-start gap-2.5 p-3 mb-3 rounded-xl border text-sm font-medium ${
          errorNotice.type === 'info'
            ? 'bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400'
            : 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400'
        }`}>
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
          <p>{errorNotice.text}</p>
        </div>
      )}
      <div className="flex-1 bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-gradient-to-br from-[#e8623a] to-[#f0916d]' : 'bg-gradient-to-br from-amber-400 to-amber-600'}`}>
                {m.role === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
              </div>
              <div
                dir={m.lang ? (m.lang === 'ar' ? 'rtl' : 'ltr') : undefined}
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#e8623a] text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-[#2a231e] text-gray-700 dark:text-gray-300 rounded-tl-sm'}`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && <div className="flex gap-2.5"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-white" /></div><div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-[#2a231e]"><Loader2 className="w-4 h-4 text-amber-500 animate-spin" /></div></div>}
          <div ref={endRef} />
        </div>
        <div className="p-3 border-t border-gray-100 dark:border-[#3a322c]/40">
          <div className="flex items-end gap-2">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} rows={1} placeholder={isAr ? 'اكتب سؤالك...' : 'Type your question...'} className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#3a322c] bg-gray-50 dark:bg-[#1a1613] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition resize-none" style={{ minHeight: '40px' }} />
            <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-2.5 bg-gradient-to-br from-[#e8623a] to-[#f0916d] text-white rounded-xl hover:from-[#b8953e] hover:to-[#d6b95e] disabled:from-gray-300 disabled:to-gray-300 transition-all shadow-lg shadow-amber-500/20 disabled:shadow-none flex-shrink-0">
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