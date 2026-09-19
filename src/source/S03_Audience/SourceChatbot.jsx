import { useState, useRef, useEffect } from "react";
import { Sparkles, Bot, ArrowUp, RotateCcw, AlertCircle, X, MessageCircle } from "lucide-react";
import { useSite } from "../../SiteContext";
import { API_BASE_URL } from "../../api";
import { buildChatbotContext } from "./ministrySpacesDetails";

// =========================================================
// «SOURCE Chatbot» — شات بوت عائم (زر في زاوية الشاشة يفتح نافذة محادثة) على
// صفحات الوزارة. يستدعي ai_chat_assistant.php بوضع mode=ministry_chatbot، فيستخدم
// مزوّد الذكاء الاصطناعي المفعّل من لوحة التحكم (الإعدادات → الذكاء الاصطناعي)،
// ويُرسل أرقام المنصة المنشورة كبيانات مرجعية حتى لا يختلق النموذج أرقامًا.
// متاح للزوار بلا تسجيل دخول؛ الخادم يطبّق حدّ استخدام للزوار (rate_limited).
// =========================================================

// الاسم بالعربي «المساعد الذكي»، وبالإنجليزي «SOURCE Chatbot»
const BOT_NAMES = { ar: "المساعد الذكي", en: "SOURCE Chatbot" };

// ✅ تخصيص حسب الصفحة المفتوحة: الموضوع + الترحيب + الأسئلة المقترحة.
// المفتاح = slug المساحة، أو "ministry" لصفحة الوزارة الرئيسية. يُرسل للخادم كـ page
// (قائمة بيضاء هناك) ليركّز الرد، وتُرتَّب البيانات المرجعية بحيث تأتي الصفحة الحالية أولًا.
const PAGES = {
  ministry: {
    topic_ar: "طبقة الوزارة", topic_en: "Ministry layer",
    intro_ar: "أنت الآن في صفحة الوزارة. اسألني عن المساحات الأربع: البيانات، الأولويات، الشراكات، والتمويل.",
    intro_en: "You're on the Ministry page. Ask me about the four spaces: data, priorities, partnerships and funding.",
    ar: ["ما أبرز ثلاثة اتجاهات في الإنتاج البحثي الليبي؟", "أين أكبر الفجوات بين المجالات البحثية والقطاعات الحيوية؟", "كيف يمكن رفع نسبة الأبحاث الممولة خلال 3 سنوات؟", "حلّل اتجاه التعاون الدولي واقترح خيارات سياسة."],
    en: ["What are the top three trends in Libyan research output?", "Where are the biggest gaps between research fields and vital sectors?", "How could the funded-research rate be raised within 3 years?", "Analyse the international collaboration trend and propose policy options."],
  },
  "data-intelligence": {
    topic_ar: "البيانات والذكاء البحثي", topic_en: "Research data & intelligence",
    intro_ar: "أنت الآن في «البيانات والذكاء البحثي الوطني». اسألني عن الإنتاج البحثي واتجاهاته وتنبؤاته والمقارنات بين الجامعات والمجالات.",
    intro_en: "You're in “National research data & intelligence”. Ask me about research output, its trends and forecasts, and comparisons across universities and fields.",
    ar: ["إلى أين يتجه الإنتاج البحثي حتى 2028؟", "قارن جامعة طرابلس بباقي الجامعات الكبرى.", "ما المجالات الأكبر إنتاجًا ولماذا؟", "ما نسبة الإنتاج الليبي المفهرس في Scopus؟"],
    en: ["Where is research output heading to 2028?", "Compare the University of Tripoli with the other large universities.", "Which fields produce the most, and why?", "What share of Libyan output is Scopus-indexed?"],
  },
  priorities: {
    topic_ar: "الأولويات البحثية الوطنية", topic_en: "National research priorities",
    intro_ar: "أنت الآن في «الأولويات البحثية الوطنية». اسألني عن المؤشرات المحسوبة، والفجوات، والأولويات التي يقترحها الذكاء الاصطناعي.",
    intro_en: "You're in “National research priorities”. Ask me about the computed indicators, the gaps and the priorities AI suggests.",
    ar: ["ما الأولويات التي تقترحها ولماذا؟", "اشرح مؤشر تغطية الطاقة 40%.", "ما القطاعات الحيوية الأقل تغطية بحثيًا؟", "كيف تتحول فجوة إلى دعوة بحثية؟"],
    en: ["Which priorities do you suggest, and why?", "Explain the 40% energy coverage indicator.", "Which vital sectors have the lowest research coverage?", "How does a gap become a research call?"],
  },
  partnerships: {
    topic_ar: "الشراكات البحثية", topic_en: "Research partnerships",
    intro_ar: "أنت الآن في «الشراكات البحثية». اسألني عن التعاون الدولي، والشركاء، وكيف تصل الشراكات المحلية إلى الوزارة كبيانات.",
    intro_en: "You're in “Research partnerships”. Ask me about international collaboration, partners, and how local partnerships reach the Ministry as data.",
    ar: ["لماذا تراجعت نسبة التعاون الدولي منذ 2023؟", "من أهم الشركاء العرب للبحث الليبي؟", "كيف تصل الشراكات المحلية للوزارة كبيانات؟", "اقترح شراكات تعالج فجوة الطاقة."],
    en: ["Why has the international collaboration rate fallen since 2023?", "Who are Libyan research's main Arab partners?", "How do local partnerships reach the Ministry as data?", "Suggest partnerships that could close the energy gap."],
  },
  funding: {
    topic_ar: "فرص التمويل البحثي", topic_en: "Research funding opportunities",
    intro_ar: "أنت الآن في «فرص التمويل البحثي». اسألني عن نسبة الأبحاث الممولة، والجهات الممولة، وفرص التمويل المتاحة للطلبة والباحثين.",
    intro_en: "You're in “Research funding opportunities”. Ask me about the funded-research rate, funders, and opportunities open to students and researchers.",
    ar: ["لماذا نسبة الأبحاث الممولة 10.2% فقط؟", "ما فرص التمويل الدولية المناسبة لطالب ماجستير؟", "ماذا يحدث لو رفعنا النسبة إلى 30%؟", "من أكثر الجهات تمويلًا للأبحاث الليبية؟"],
    en: ["Why is the funded-research rate only 10.2%?", "Which international funding suits a master's student?", "What happens if we raise the rate to 30%?", "Who funds Libyan research the most?"],
  },
};

const TypingDots = () => (
  <span className="inline-flex items-center gap-1 py-2">
    {[0, 1, 2].map((i) => (
      <span key={i} className="w-2 h-2 rounded-full bg-brand-orange/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </span>
);

const SourceChatbot = ({ lang, page = "ministry" }) => {
  const cfg = PAGES[page] || PAGES.ministry;
  const BOT_NAME = BOT_NAMES[lang] || BOT_NAMES.en;
  const { user } = useSite();
  const isAr = lang === "ar";
  const userId = user?.user_id ?? user?.id;
  const greeting = isAr
    ? `مرحبًا 👋 أنا المساعد الذكي. ${cfg.intro_ar} أجيب من أرقام المنصة مع ذكر مصدرها.`
    : `Hi 👋 I'm SOURCE Chatbot. ${cfg.intro_en} I answer from the platform's figures and cite their source.`;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
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
          user_id: userId || 0, // 0 = زائر
          lang,
          mode: "ministry_chatbot",
          page,
          context: buildChatbotContext(lang, page),
          // رسالة الترحيب محلية فقط — لا تُرسل للخادم
          messages: next.slice(1),
        }),
      });
      const result = await res.json();
      if (result.status === "success") {
        setMessages((p) => [...p, { role: "assistant", content: result.data.content }]);
      } else if (result.message === "rate_limited") {
        setNotice(isAr ? "وصلت للحد المسموح من الأسئلة حاليًا — حاول بعد قليل، أو سجّل الدخول لاستخدام غير محدود." : "You've reached the question limit for now — try again later, or sign in for unlimited use.");
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
    <>
      {/* نافذة المحادثة */}
      {open && (
        <div
          role="dialog"
          aria-label={BOT_NAME}
          className="fixed z-50 inset-x-3 bottom-24 sm:inset-x-auto sm:end-6 sm:w-[400px] h-[min(600px,calc(100vh-8rem))] bg-brand-orange rounded-2xl overflow-hidden shadow-[0_32px_64px_-24px_rgba(36,27,20,0.45)]"
        >
          {/* ✅ خلفية برتقالية كاملة بلا شفافية */}
          <div className="h-full flex flex-col">
          {/* الرأس */}
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-white/25">
            <div className="flex items-center gap-3">
              <span className="relative w-9 h-9 rounded-xl bg-white flex items-center justify-center text-brand-orange">
                <Bot className="w-5 h-5" strokeWidth={2} />
                <span className="absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white" dir={isAr ? undefined : "ltr"}>{BOT_NAME}</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  {isAr ? `متخصص في: ${cfg.topic_ar}` : `Focused on: ${cfg.topic_en}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={reset} title={isAr ? "محادثة جديدة" : "New chat"} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/85 hover:text-white hover:bg-white/15 transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setOpen(false)} title={isAr ? "إغلاق" : "Close"} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/85 hover:text-white hover:bg-white/15 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* الرسائل */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] text-[13px] leading-relaxed whitespace-pre-wrap px-3.5 py-2.5 rounded-2xl ${
                    m.role === "user" ? "bg-brand-orange-dark text-white rounded-se-md" : "bg-white text-brand-ink border border-brand-orange/15 rounded-ss-md shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-brand-orange/15 rounded-2xl rounded-ss-md px-3.5"><TypingDots /></div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-col gap-2 mt-1">
                {cfg[lang].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="text-start text-[12px] font-semibold text-brand-ink bg-white border border-white rounded-xl px-3 py-2 hover:bg-brand-cream-hero hover:text-brand-orange-dark transition-colors"
                  >
                    <Sparkles className="inline w-3.5 h-3.5 text-brand-orange me-1.5" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {notice && (
            <div className="mx-4 mb-3 flex items-start gap-2 text-[12px] font-semibold text-brand-orange-dark bg-white border border-brand-orange/40 rounded-xl px-3 py-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {notice}
            </div>
          )}

          {/* الإدخال */}
          <div className="border-t border-white/25 p-3">
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={isAr ? "اكتب سؤالك…" : "Type your question…"}
                className="flex-1 resize-none bg-white border border-white rounded-xl text-brand-ink text-[13px] px-3.5 py-2.5 placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-white/60 max-h-28"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-white text-brand-orange flex items-center justify-center disabled:opacity-60 hover:bg-brand-cream-hero transition-colors"
                aria-label={isAr ? "إرسال" : "Send"}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </form>
            <p className="mt-2 text-[10px] text-white/85">
              {isAr ? "يقترح ويشرح، والقرار للوزارة. تحقق من الأرقام قبل أي استخدام رسمي." : "It proposes and explains; the decision is the Ministry's. Verify figures before official use."}
            </p>
          </div>
          </div>
        </div>
      )}

      {/* زر الفتح العائم */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? (isAr ? "إغلاق المحادثة" : "Close chat") : BOT_NAME}
        className="fixed z-50 bottom-6 end-6 h-14 rounded-full bg-brand-orange text-white shadow-[0_16px_32px_-12px_rgba(255,135,16,0.7)] hover:bg-brand-orange-dark transition-all flex items-center gap-2.5 px-5"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && <span className="hidden sm:inline text-sm font-bold" dir={isAr ? undefined : "ltr"}>{BOT_NAME}</span>}
      </button>
    </>
  );
};

export default SourceChatbot;
