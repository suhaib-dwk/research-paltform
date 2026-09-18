import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Bot, ArrowUp, RotateCcw, LogIn, AlertCircle } from "lucide-react";
import { useSite } from "../../SiteContext";
import { API_BASE_URL } from "../../api";
import { buildAdvisorContext } from "../../data/ministrySpacesDetails";

// =========================================================
// «المستشار البحثي الذكي» — واجهة محادثة تجريبية داخل مساحة البيانات والذكاء
// البحثي. تستدعي ai_chat_assistant.php بوضع mode=ministry_advisor، فتستخدم
// مزوّد الذكاء الاصطناعي المفعّل من لوحة التحكم (الإعدادات → الذكاء الاصطناعي)،
// وتُرسل أرقام المنصة المنشورة كبيانات مرجعية حتى لا يختلق النموذج أرقامًا.
// تتطلب تسجيل الدخول (نفس قيد المساعد الذكي — التحكم بالتكلفة).
// =========================================================

const SUGGESTIONS = {
  ar: [
    "ما أبرز ثلاثة اتجاهات في الإنتاج البحثي الليبي؟",
    "أين أكبر الفجوات بين المجالات البحثية والقطاعات الحيوية؟",
    "كيف يمكن رفع نسبة الأبحاث الممولة خلال 3 سنوات؟",
    "حلّل اتجاه التعاون الدولي واقترح خيارات سياسة.",
  ],
  en: [
    "What are the top three trends in Libyan research output?",
    "Where are the biggest gaps between research fields and vital sectors?",
    "How could the funded-research rate be raised within 3 years?",
    "Analyse the international collaboration trend and propose policy options.",
  ],
};

const TypingDots = () => (
  <span className="inline-flex items-center gap-1 py-2">
    {[0, 1, 2].map((i) => (
      <span key={i} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </span>
);

const MinistryAdvisorChat = ({ lang }) => {
  const { user } = useSite();
  const isAr = lang === "ar";
  const userId = user?.user_id ?? user?.id;
  const greeting = isAr
    ? "مرحبًا، أنا المستشار البحثي الذكي. اسألني عن اتجاهات البحث الوطني وفجواته وتنبؤاته — أجيب من أرقام المنصة مع ذكر مصدرها."
    : "Hello, I'm the smart research advisor. Ask me about national research trends, gaps and forecasts — I answer from the platform's figures and cite their source.";
  const [messages, setMessages] = useState([{ role: "assistant", content: greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading || !userId) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch(`${API_BASE_URL}/ai_chat_assistant.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          lang,
          mode: "ministry_advisor",
          context: buildAdvisorContext(lang),
          // رسالة الترحيب محلية فقط — لا تُرسل للخادم
          messages: next.slice(1),
        }),
      });
      const result = await res.json();
      if (result.status === "success") {
        setMessages((p) => [...p, { role: "assistant", content: result.data.content }]);
      } else if (result.message === "ai_not_configured") {
        setNotice(isAr ? "الذكاء الاصطناعي غير مفعّل بعد — اضبط مزوّدًا ومفتاحًا من لوحة التحكم (الإعدادات → الذكاء الاصطناعي)." : "AI is not configured yet — set a provider and key in the admin panel (Settings → AI).");
      } else {
        setNotice(isAr ? "تعذّر الحصول على رد، حاول مرة أخرى." : "Couldn't get a response, please try again.");
      }
    } catch {
      setNotice(isAr ? "تعذّر الاتصال بالخادم." : "Couldn't connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([{ role: "assistant", content: greeting }]);
    setNotice(null);
  };

  return (
    <div className="bg-brand-ink border border-brand-dark-border flex flex-col h-[560px]">
      {/* الرأس */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 bg-brand-orange flex items-center justify-center text-white">
            <Bot className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{isAr ? "المستشار البحثي الذكي" : "Smart research advisor"}</span>
            <span className="text-[11px] text-white/50">{isAr ? "نسخة تجريبية · يستخدم الذكاء الاصطناعي المفعّل في المنصة" : "Beta · uses the platform's configured AI"}</span>
          </div>
        </div>
        <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white/60 hover:text-brand-orange transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> {isAr ? "محادثة جديدة" : "New chat"}
        </button>
      </div>

      {/* الرسائل */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap px-4 py-3 ${
                m.role === "user" ? "bg-brand-orange text-white" : "bg-brand-dark-card border border-brand-dark-border text-white/90"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-brand-dark-card border border-brand-dark-border px-4"><TypingDots /></div>
          </div>
        )}
        {messages.length === 1 && userId && (
          <div className="grid sm:grid-cols-2 gap-2 mt-2">
            {SUGGESTIONS[lang].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="text-start text-[13px] font-semibold text-white/80 border border-white/15 px-3.5 py-2.5 hover:border-brand-orange hover:text-brand-orange transition-colors"
              >
                <Sparkles className="inline w-3.5 h-3.5 text-brand-orange me-1.5" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {notice && (
        <div className="mx-5 mb-3 flex items-start gap-2 text-[13px] font-semibold text-brand-orange border border-brand-orange/40 px-3.5 py-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {notice}
        </div>
      )}

      {/* الإدخال */}
      <div className="border-t border-white/10 p-4">
        {userId ? (
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-end gap-2"
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={isAr ? "اسأل المستشار عن البحث العلمي الوطني…" : "Ask the advisor about national research…"}
              className="flex-1 resize-none bg-brand-dark-card border border-brand-dark-border text-white text-sm px-4 py-3 placeholder:text-white/40 focus:outline-none focus:border-brand-orange max-h-32"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 bg-brand-orange text-white flex items-center justify-center disabled:opacity-40 hover:bg-brand-orange-dark transition-colors"
              aria-label={isAr ? "إرسال" : "Send"}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[13px] text-white/60">{isAr ? "سجّل الدخول لتجربة المستشار." : "Sign in to try the advisor."}</span>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-[13px] font-bold text-white hover:bg-brand-orange-dark transition-colors">
              <LogIn className="w-4 h-4" /> {isAr ? "تسجيل الدخول" : "Sign in"}
            </Link>
          </div>
        )}
        <p className="mt-2 text-[11px] text-white/40">
          {isAr ? "المستشار يقترح ويشرح، والقرار للوزارة. تحقق من الأرقام قبل أي استخدام رسمي." : "The advisor proposes and explains; the decision is the Ministry's. Verify figures before official use."}
        </p>
      </div>
    </div>
  );
};

export default MinistryAdvisorChat;
