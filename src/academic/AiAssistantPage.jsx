import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSite } from "../SiteContext";
import { API_BASE_URL } from "../api";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ListChecks,
  Lightbulb,
  HelpCircle,
  AlertCircle,
  Plus,
  Copy,
  Check,
  X,
  BookOpenText,
  PenLine,
  Wand2,
  FlaskConical,
  ArrowUp,
} from "lucide-react";

// =========================================================
// المساعد الذكي — واجهة محادثة بأسلوب الأنظمة العالمية
// =========================================================

const getInitialMsgs = (isAr) => [
  {
    id: 1,
    role: "assistant",
    content: isAr
      ? "مرحباً! أنا المساعد الذكي لأبحاثك. كيف يمكنني مساعدتك؟"
      : "Hello! I'm your smart research assistant. How can I help?",
  },
];

const QUICK = [
  {
    icon: Lightbulb,
    ar: "اقتراح عنوان بحثي",
    en: "Suggest a research title",
    d_ar: "خمسة عناوين محكمة في مجالك",
    d_en: "Five focused titles in your field",
    p_ar: "اقترح 5 عناوين بحثية في مجال ",
    p_en: "Suggest 5 research titles in ",
  },
  {
    icon: BookOpenText,
    ar: "كتابة ملخص",
    en: "Write an abstract",
    d_ar: "ملخص أكاديمي بحدود 250 كلمة",
    d_en: "An academic abstract of ~250 words",
    p_ar: "ساعدني في كتابة ملخص بحث عن ",
    p_en: "Help me write a research abstract about ",
  },
  {
    icon: PenLine,
    ar: "تحسين نص",
    en: "Improve text",
    d_ar: "صياغة أوضح وأكثر أكاديمية",
    d_en: "Clearer, more academic wording",
    p_ar: "حسّن النص التالي أكاديمياً: ",
    p_en: "Improve the following text academically: ",
  },
  {
    icon: FlaskConical,
    ar: "مراجعة منهجية",
    en: "Review methodology",
    d_ar: "اتساق المشكلة والأهداف والأدوات",
    d_en: "Fit of problem, objectives and tools",
    p_ar: "راجع اتساق منهجية بحثي التالية: ",
    p_en: "Review the consistency of the following methodology: ",
  },
];

const TypingDots = () => (
  <span className="inline-flex items-center gap-1 px-1 py-2">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </span>
);

const AiAssistantPage = () => {
  const { currentLang, user } = useSite();
  const isAr = currentLang === "ar";
  const entityId = user?.user_id ?? user?.id;
  const [messages, setMessages] = useState(() => getInitialMsgs(isAr));
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // حقل إدخال يتمدد تلقائيًا
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 168)}px`;
  }, [input]);

  const handleSend = async (text) => {
    const content = (text ?? input).trim();
    if (!content || isLoading || !entityId) return;
    const userMessage = {
      id: Date.now(),
      role: "user",
      content,
      lang: currentLang,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setErrorNotice(null);

    try {
      const history = nextMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_BASE_URL}/ai_chat_assistant.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: entityId,
          lang: currentLang,
          messages: history,
        }),
      });
      const result = await res.json();

      if (result.status === "success") {
        const replyText = result.data.content;
        setMessages((p) => [
          ...p,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: replyText,
            lang: currentLang,
          },
        ]);
      } else if (result.message === "ai_not_configured") {
        setErrorNotice({
          type: "info",
          text: isAr
            ? "ميزة الذكاء الاصطناعي غير مُفعّلة بعد على هذا الخادم."
            : "AI features are not configured on this server yet.",
        });
      } else {
        setErrorNotice({
          type: "error",
          text: isAr
            ? "تعذّر الحصول على رد، حاول مرة أخرى لاحقاً."
            : "Failed to get a response, please try again later.",
        });
      }
    } catch (err) {
      setErrorNotice({
        type: "error",
        text: isAr ? "تعذّر الاتصال بالخادم" : "Failed to connect to server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages(getInitialMsgs(isAr));
    setInput("");
    setErrorNotice(null);
    textareaRef.current?.focus();
  };

  const handleCopy = async (m) => {
    try {
      await navigator.clipboard.writeText(m.content);
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* ignore */
    }
  };

  const guideSections = [
    {
      id: "how",
      icon: ListChecks,
      title_ar: "كيف تستخدم المساعد",
      title_en: "How to Use",
      items_ar: [
        "اكتب سؤالك أو طلبك في مربع النص",
        "اضغط Enter أو زر الإرسال",
        "انتظر الرد واقرأ التوصيات",
        "يمكنك المتابعة بأسئلة إضافية",
      ],
      items_en: [
        "Type your question",
        "Press Enter or Send",
        "Read the response",
        "Follow up with more questions",
      ],
    },
    {
      id: "tips",
      icon: Lightbulb,
      title_ar: "نصائح لنتائج أفضل",
      title_en: "Tips for Better Results",
      items_ar: [
        "كن محدداً في سؤالك",
        "أذكر التخصص والمجال",
        "اطلب التنسيق أو الصياغة بشكل صريح",
        "استخدم الاقتراحات كنقطة بداية",
      ],
      items_en: [
        "Be specific",
        "Mention your field",
        "Explicitly request formatting",
        "Use suggestions as a starting point",
      ],
    },
    {
      id: "limit",
      icon: HelpCircle,
      title_ar: "محدوديات المساعد",
      title_en: "Limitations",
      items_ar: [
        "المساعد لا يغني عن المراجعة الأكاديمية البشرية",
        "قد لا يكون دقيقاً في التخصصات النادرة جداً",
        "تحقق دائماً من المعلومات والمراجع المقترحة",
      ],
      items_en: [
        "Does not replace human academic review",
        "May be less accurate in very rare fields",
        "Always verify suggested references",
      ],
    },
  ];

  const isFresh = messages.length <= 1;
  const firstName = user?.name?.split(" ")[0] || "";

  return (
    //
    // التغييرات:
    // 1. h-[calc(100vh-5rem)]: ارتفاع كامل يملأ المساحة المتاحة تحت الهيدر
    // 2. overflow-hidden: يمنع التمرير العام للصفحة، مما يجعل التمرير يحدث فقط داخل منطقة الرسائل
    // 3. bg-gray-50: يضمن تغطية الفراغات الناتجة عن الهوامش السالبة
    //
    <div className="h-[calc(100vh-5rem)] -m-4 sm:-m-6 lg:-m-8 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      <div className="flex-1 flex flex-col min-w-0 min-h-0 relative">
        {/* ─── عمود المحادثة ─── */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* رأس المحادثة */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4 bg-white/80 dark:bg-brand-dark/80 backdrop-blur border-b border-gray-100 dark:border-brand-dark-border/60 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-lg shadow-brand-orange/25 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <h1 className="text-gray-900 dark:text-white text-base font-black leading-tight truncate">
                  {isAr ? "المساعد الذكي" : "AI Assistant"}
                </h1>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {isAr
                    ? "مساعد للأبحاث الأكاديمية — القرار الأكاديمي النهائي لك"
                    : "Academic research assistant — the final academic decision is yours"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleNewChat}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gray-100 dark:bg-brand-dark-hover text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-brand-orange/10 hover:text-brand-orange transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isAr ? "محادثة جديدة" : "New chat"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setGuideOpen((v) => !v)}
                aria-pressed={guideOpen}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${guideOpen ? "bg-brand-orange text-white" : "bg-gray-100 dark:bg-brand-dark-hover text-gray-600 dark:text-gray-300 hover:bg-brand-orange/10 hover:text-brand-orange"}`}
                aria-label={isAr ? "دليل الاستخدام" : "Usage guide"}
                title={isAr ? "دليل الاستخدام" : "Usage guide"}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* الرسائل (مساحة التمرير الداخلية) */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-3xl mx-auto">
              {isFresh ? (
                <div className="flex flex-col items-center text-center pt-6 sm:pt-14">
                  <span className="w-16 h-16 rounded-3xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-5">
                    <Wand2 className="w-8 h-8" />
                  </span>
                  <h2 className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-black mb-2">
                    {isAr
                      ? `${firstName ? `مرحباً ${firstName}، ` : ""}كيف يمكنني مساعدتك اليوم؟`
                      : `${firstName ? `Hi ${firstName}, ` : ""}how can I help you today?`}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mb-8">
                    {isAr
                      ? "اختر اقتراحًا للبدء أو اكتب طلبك مباشرة — أذكر تخصصك للحصول على نتائج أدق."
                      : "Pick a suggestion to start or type your request — mention your field for sharper results."}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 w-full">
                    {QUICK.map((q) => (
                      <button
                        key={q.en}
                        type="button"
                        onClick={() => {
                          setInput(isAr ? q.p_ar : q.p_en);
                          textareaRef.current?.focus();
                        }}
                        className="group text-start flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-brand-dark-card shadow-[0_12px_40px_-18px_rgba(31,26,23,0.22)] dark:shadow-none dark:border dark:border-brand-dark-border/60 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(255,135,16,0.35)] transition-all"
                      >
                        <span className="w-9 h-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                          <q.icon className="w-4 h-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-gray-900 dark:text-white">
                            {isAr ? q.ar : q.en}
                          </span>
                          <span className="block text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {isAr ? q.d_ar : q.d_en}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((m) =>
                    m.role === "user" ? (
                      <div key={m.id} className="flex justify-end">
                        <div className="flex items-end gap-2.5 max-w-[85%] flex-row-reverse">
                          <span className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() || (
                              <User className="w-4 h-4" />
                            )}
                          </span>
                          <div
                            dir={
                              m.lang === "ar"
                                ? "rtl"
                                : m.lang
                                  ? "ltr"
                                  : undefined
                            }
                            className="px-4 py-3 rounded-3xl rounded-ee-md bg-brand-orange/10 text-gray-900 dark:text-white text-[15px] leading-relaxed whitespace-pre-wrap"
                          >
                            {m.content}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={m.id} className="group flex items-start gap-3">
                        <span className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="w-4 h-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div
                            dir={
                              m.lang === "ar"
                                ? "rtl"
                                : m.lang
                                  ? "ltr"
                                  : undefined
                            }
                            className="text-gray-800 dark:text-gray-100 text-[15px] leading-[1.9] whitespace-pre-wrap"
                          >
                            {m.content}
                          </div>
                          {m.id !== 1 && (
                            <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleCopy(m)}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold text-gray-500 hover:text-brand-orange hover:bg-brand-orange/10 transition-colors"
                              >
                                {copiedId === m.id ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                                {copiedId === m.id
                                  ? isAr
                                    ? "تم النسخ"
                                    : "Copied"
                                  : isAr
                                    ? "نسخ"
                                    : "Copy"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </span>
                      <TypingDots />
                    </div>
                  )}
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>

          {/* المؤلِّف (ثابت في الأسفل) */}
          <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 pt-2 bg-gray-50 dark:bg-gray-900 z-10 flex-shrink-0">
            <div className="max-w-3xl mx-auto">
              {errorNotice && (
                <div
                  className={`flex items-start gap-2.5 p-3 mb-3 rounded-2xl text-sm font-medium ${
                    errorNotice.type === "info"
                      ? "bg-blue-50 dark:bg-blue-900/15 text-blue-700 dark:text-blue-300"
                      : "bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="flex-1">{errorNotice.text}</p>
                  <button
                    type="button"
                    onClick={() => setErrorNotice(null)}
                    className="opacity-60 hover:opacity-100"
                    aria-label="close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {!isFresh && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {QUICK.slice(0, 3).map((q) => (
                    <button
                      key={q.en}
                      type="button"
                      onClick={() => {
                        setInput(isAr ? q.p_ar : q.p_en);
                        textareaRef.current?.focus();
                      }}
                      className="px-3 py-1.5 rounded-full bg-white dark:bg-brand-dark-card shadow-sm text-gray-600 dark:text-gray-300 text-xs font-semibold hover:text-brand-orange hover:shadow-md transition-all"
                    >
                      {isAr ? q.ar : q.en}
                    </button>
                  ))}
                </div>
              )}
              <div className="rounded-3xl bg-white dark:bg-brand-dark-card shadow-[0_16px_48px_-18px_rgba(31,26,23,0.28)] dark:shadow-none dark:border dark:border-brand-dark-border/60 p-2 ps-4 flex items-end gap-2 focus-within:ring-2 focus-within:ring-brand-orange/30 transition-shadow">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder={
                    isAr
                      ? "اكتب طلبك… (Shift + Enter لسطر جديد)"
                      : "Type your request… (Shift + Enter for a new line)"
                  }
                  className="flex-1 bg-transparent text-gray-900 dark:text-white text-[15px] leading-relaxed placeholder-gray-400 dark:placeholder-gray-600 py-3 resize-none outline-none max-h-[168px]"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  aria-label={isAr ? "إرسال" : "Send"}
                  className="w-11 h-11 rounded-2xl bg-brand-orange text-white flex items-center justify-center hover:bg-brand-orange-dark disabled:bg-gray-200 dark:disabled:bg-brand-dark-border disabled:text-gray-400 transition-colors flex-shrink-0"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-2.5">
                {isAr
                  ? "قد يُخطئ المساعد — تحقّق من المعلومات والمراجع المقترحة قبل الاعتماد عليها."
                  : "The assistant can make mistakes — verify information and suggested references before relying on them."}
              </p>
            </div>
          </div>
        </div>

        {/* ─── لوحة دليل الاستخدام (منزلقة) ─── */}
        <AnimatePresence>
          {guideOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                onClick={() => setGuideOpen(false)}
              />
              <motion.aside
                initial={{ x: isAr ? -40 : 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isAr ? -40 : 40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="fixed lg:static inset-y-0 end-0 z-40 w-[320px] max-w-[88vw] lg:w-[320px] flex-shrink-0 bg-white dark:bg-brand-dark-soft border-s border-gray-100 dark:border-brand-dark-border/60 overflow-y-auto p-5"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-gray-900 dark:text-white text-sm font-black">
                    {isAr ? "دليل الاستخدام" : "Usage guide"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setGuideOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-brand-dark-hover flex items-center justify-center text-gray-500"
                    aria-label="close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-5">
                  {guideSections.map((section) => (
                    <div key={section.id}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-7 h-7 rounded-lg bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                          <section.icon className="w-3.5 h-3.5" />
                        </span>
                        <h3 className="text-[13px] font-bold text-gray-900 dark:text-white">
                          {isAr ? section.title_ar : section.title_en}
                        </h3>
                      </div>
                      <ul className="space-y-1.5 ps-2">
                        {(isAr ? section.items_ar : section.items_en).map(
                          (item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange flex-shrink-0 mt-1.5" />
                              {item}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AiAssistantPage;
