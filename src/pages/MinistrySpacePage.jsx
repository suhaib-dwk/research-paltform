import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Sparkles, Brain, Radar, Lightbulb, ShieldCheck, Gauge, Megaphone, ExternalLink } from "lucide-react";
import { API_BASE_URL } from "../api";
import MinistryAdvisorChat from "../components/ministry/MinistryAdvisorChat";
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { MINISTRY_SPACES } from "../data/audiencesContent";
import { MINISTRY_SPACE_DETAILS, FUNDING_FALLBACK } from "../data/ministrySpacesDetails";
import HomeStatsPanel from "../components/home/HomeStatsPanel";
import {
  useInnerLang, pick, Breadcrumb, InnerHero, AnchorNav, SectionHead, QuoteBand, CtaBand, RelatedCards,
} from "../components/inner/InnerBlocks";

// =========================================================
// صفحة تفصيلية لكل مساحة من مساحات الوزارة الأربع (/ministry-space/:slug):
// أرقام حقيقية منشورة (src/data/ministrySpacesDetails.js) + المؤشرات المعتمدة
// بتعريفها وصيغتها + إحصائيات يولّدها الذكاء الاصطناعي (تنبؤات وسيناريوهات)
// محسوبة من تلك الأرقام + دور الذكاء الاصطناعي في المساحة.
// =========================================================

const AI_ICONS = [Brain, Radar, Lightbulb, Sparkles, Gauge, ShieldCheck];

// ── رسم التوقع: القيم الفعلية (برتقالي) + التوقع (متقطع) + نطاق الثقة 95% ──
const ForecastChart = ({ chart, lang, labels }) => {
  const unit = chart.unit || "";
  const f = (v) => `${Number(v).toLocaleString("en-US")}${unit}`;
  return (
    <div className="bg-white border border-gray-200 p-5 md:p-6 flex flex-col h-full min-h-[340px]">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h4 className="text-sm md:text-[15px] font-bold text-brand-ink leading-snug">{chart[`title_${lang}`]}</h4>
        <span className="w-2.5 h-2.5 rounded-full bg-brand-orange mt-1.5 flex-shrink-0" />
      </div>
      <div className="flex-1 min-h-[260px]" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart.points} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={f} domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #F3F4F6", fontSize: 12 }}
              formatter={(v, name) => [Array.isArray(v) ? `${f(v[0])} – ${f(v[1])}` : f(v), name]}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
            <Area dataKey="band" name={labels.band} stroke="none" fill="#FF8710" fillOpacity={0.12} connectNulls />
            <Line dataKey="actual" name={labels.actual} stroke="#FF8710" strokeWidth={3} dot={{ r: 3.5, strokeWidth: 2, fill: "#fff" }} connectNulls={false} />
            <Line dataKey="forecast" name={labels.forecast} stroke="#241B14" strokeWidth={2.5} strokeDasharray="6 5" dot={{ r: 3.5, fill: "#241B14" }} connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ── أخبار وإعلانات التمويل من جدول الأخبار (تصنيفات grants/announcements) ──
const FundingAnnouncements = ({ categories, lang, labels }) => {
  const [items, setItems] = useState(null); // null = تحميل

  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE_URL}/get_news.php?category=${categories.join(",")}&limit=6`)
      .then((r) => r.json())
      .then((res) => { if (alive) setItems(res.status === "success" ? res.data : []); })
      .catch(() => { if (alive) setItems([]); });
    return () => { alive = false; };
  }, [categories]);

  const dateFmt = (d) => {
    const dt = new Date(String(d).replace(" ", "T"));
    return Number.isNaN(dt.getTime()) ? "" : dt.toLocaleDateString(lang === "ar" ? "ar-LY" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <section id="announcements" className="bg-brand-cream-hero py-20 md:py-24 scroll-mt-28">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <SectionHead kicker={labels.newsKicker} title={labels.newsTitle} desc={labels.newsDesc} />
          <Link to="/all-news" className="inline-flex items-center gap-2 text-brand-ink font-bold text-sm hover:text-brand-orange transition-colors flex-shrink-0 mb-12">
            <Megaphone className="w-4 h-4 text-brand-orange" /> {labels.allNews}
          </Link>
        </div>
        {items === null ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => <div key={i} className="h-[280px] bg-white/70 animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          // ✅ لا إعلانات منشورة (أو تعذّر الخادم): برامج تمويل دولية حقيقية مفتوحة دوريًا
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FUNDING_FALLBACK.map((n) => (
                <a key={n.slug} href={n.url} target="_blank" rel="noopener noreferrer" className="group bg-white border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                    <img src={n.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col gap-2.5 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-1">{labels.newsCats[n.category]}</span>
                      <span className="text-[11px] font-semibold text-brand-muted">{n[`tag_${lang}`]}</span>
                    </div>
                    <h3 className="text-[17px] font-bold text-brand-ink leading-snug group-hover:text-brand-orange transition-colors flex-1">{n[`title_${lang}`]}</h3>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-ink group-hover:text-brand-orange transition-colors">
                      {labels.officialSite} <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-5 text-[12px] font-semibold text-brand-muted">{labels.fallbackNote}</p>
          </>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((n) => (
              <Link key={n.id} to={`/news/${n.slug}`} className="group bg-white border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                  {n.image_url && <img src={n.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                </div>
                <div className="p-6 flex flex-col gap-2.5 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-1">{labels.newsCats[n.category] || n.category}</span>
                    <span className="text-[11px] font-semibold text-brand-muted">{dateFmt(n.created_at)}</span>
                  </div>
                  <h3 className="text-[17px] font-bold text-brand-ink leading-snug group-hover:text-brand-orange transition-colors">{n[`title_${lang}`] || n.title_ar}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const MinistrySpacePage = () => {
  const { slug } = useParams();
  const { t, lang, isRTL } = useInnerLang();

  const index = MINISTRY_SPACES.findIndex((s) => s.slug === slug);
  const space = MINISTRY_SPACES[index];
  const detail = MINISTRY_SPACE_DETAILS[slug];
  if (!space || !detail) return <Navigate to="/audience/ministry" replace />;
  const ai = detail.ai_stats;

  const labels = isRTL
    ? { ministry: "الوزارة", space: "المساحة", numbers: "الأرقام", indicators: "المؤشرات", ai: "الذكاء الاصطناعي", insights: "تنبؤات الذكاء الاصطناعي", others: "المساحات الأخرى", question: "السؤال الذي تجيب عنه", numbersKicker: "أرقام حقيقية منشورة", numbersNote: "أرقام منشورة من مصادر رسمية ودولية، وتُستكمل ببيانات الجامعات المعتمدة عند التشغيل.", indicatorsKicker: "المؤشرات المعتمدة", indicatorsTitle: "كل مؤشر بتعريف وصيغة ومصدر ودورية — لا أرقام بلا أصل.", formula: "الصيغة", source: "المصدر", frequency: "الدورية", aiKicker: "دور الذكاء الاصطناعي", aiTitle: "الذكاء الاصطناعي يكتشف ويشرح ويقترح — والقرار للوزارة.", output: "المخرج", guard: "كل مخرج من مخرجات الذكاء الاصطناعي يحمل أدلته ودرجة الثقة، ويمر بمراجعة بشرية قبل أي استخدام رسمي.", insightsKicker: "إحصائيات يولّدها الذكاء الاصطناعي", insightsNote: "تقديرات تحليلية محسوبة آليًا من الأرقام المنشورة أعلاه — تنبؤات وسيناريوهات للاسترشاد، وليست أرقامًا رسمية.", found: "ما الذي اكتشفه النموذج", method: "المنهجية", actual: "فعلي", forecast: "متوقع", band: "نطاق الثقة 95%", local: "المستوى المحلي", localKicker: "من أين تأتي الشراكات", localTitle: "الشراكات لا تُنشئها الوزارة — تنشأ محليًا وتصلها كبيانات.", localDesc: "يبنيها الطلبة والباحثون والجامعات والمراكز والجهات المحلية، وتُسجَّل في المنصة كاتفاقيات ومشاريع ومخرجات؛ والوزارة تقرأها وتحلّلها وتكشف الفرص.", advisor: "المستشار الذكي", advisorKicker: "خدمة داخل المساحة", advisorTitle: "المستشار البحثي الذكي.", advisorDesc: "اسأل بلغة طبيعية عن واقع البحث الوطني، فيحلّل ويجيب من أرقام المنصة ويذكر مصدرها.", advisorPoints: ["يحلّل الاتجاهات والمقارنات والفجوات", "يشرح التنبؤات والسيناريوهات ويقترح خيارات سياسة", "يستخدم مزوّد الذكاء الاصطناعي المفعّل من إعدادات المنصة", "لا يختلق أرقامًا — وإن نقصت البيانات يقول ذلك"], announcements: "إعلانات التمويل", newsKicker: "أخبار وإعلانات", newsTitle: "فرص التمويل المتاحة الآن للطلبة والباحثين.", newsDesc: "إعلانات تتجدد باستمرار: منح ودعوات بحثية وفرص تمويل تُنشر من لوحة التحكم.", allNews: "كل الأخبار", newsEmpty: "لا توجد إعلانات تمويل منشورة حاليًا — تظهر هنا فور نشرها من لوحة التحكم.", officialSite: "الموقع الرسمي", fallbackNote: "برامج تمويل دولية مفتوحة دوريًا — تحقق من الأهلية والمواعيد في الموقع الرسمي لكل برنامج.", newsCats: { grants: "منحة", announcements: "إعلان", updates: "تحديث", events: "فعالية" }, suggestTitle: "أولويات يقترحها الذكاء الاصطناعي", field: "المجال", works: "عملًا", gap: "مؤشر الفجوة", pending: "مقترح — بانتظار اعتماد الوزارة",othersTitle: "المساحات الأخرى في طبقة الوزارة", back: "كل المساحات", ctaTitle: "ابدأ بهذه المساحة في مرحلة التأسيس.", ctaDesc: "نعتمد المؤشرات الأساسية معًا، ثم نربط البيانات ونفتح اللوحة للأدوار المخوّلة.", contact: "للتواصل معنا", register: "إنشاء حساب — وزارة" }
    : { ministry: "Ministry", space: "Space", numbers: "Figures", indicators: "Indicators", ai: "Artificial intelligence", insights: "AI forecasts", others: "Other spaces", question: "The question it answers", numbersKicker: "Real published figures", numbersNote: "Figures published by official and international sources, completed with approved university data once live.", indicatorsKicker: "Approved indicators", indicatorsTitle: "Every indicator has a definition, formula, source and frequency — no figure without an origin.", formula: "Formula", source: "Source", frequency: "Frequency", aiKicker: "The role of AI", aiTitle: "AI detects, explains and proposes — the decision stays with the Ministry.", output: "Output", guard: "Every AI output carries its evidence and a confidence level, and goes through human review before any official use.", insightsKicker: "AI-generated statistics", insightsNote: "Analytical estimates computed automatically from the published figures above — forecasts and scenarios for guidance, not official figures.", found: "What the model found", method: "Method", actual: "Actual", forecast: "Forecast", band: "95% confidence band", local: "Local level", localKicker: "Where partnerships come from", localTitle: "The Ministry doesn't create partnerships — they start locally and reach it as data.", localDesc: "Students, researchers, universities, centres and local bodies build them; the platform records them as agreements, projects and outputs, and the Ministry reads, analyses and spots opportunities.", advisor: "Smart advisor", advisorKicker: "A service inside this space", advisorTitle: "The smart research advisor.", advisorDesc: "Ask in natural language about national research; it analyses and answers from the platform's figures, citing the source.", advisorPoints: ["Analyses trends, comparisons and gaps", "Explains forecasts and scenarios and proposes policy options", "Uses the AI provider configured in the platform settings", "Never invents figures — says so when data is missing"], announcements: "Funding announcements", newsKicker: "News & announcements", newsTitle: "Funding opportunities open now for students and researchers.", newsDesc: "Constantly refreshed announcements: grants, research calls and funding opportunities published from the admin panel.", allNews: "All news", newsEmpty: "No funding announcements are published right now — they appear here as soon as they're published from the admin panel.", officialSite: "Official site", fallbackNote: "International funding programmes that open periodically — check eligibility and deadlines on each programme's official site.", newsCats: { grants: "Grant", announcements: "Announcement", updates: "Update", events: "Event" }, suggestTitle: "Priorities suggested by AI", field: "Field", works: "works", gap: "Gap index", pending: "Suggested — pending Ministry approval",othersTitle: "Other spaces in the Ministry layer", back: "All spaces", ctaTitle: "Start with this space in the foundation phase.", ctaDesc: "We approve the core indicators together, then connect the data and open the dashboard to authorised roles.", contact: "Contact us", register: "Create account — Ministry" };

  const register = { to: "/register?role=ministry", label: labels.register };
  const related = MINISTRY_SPACES.filter((s) => s.slug !== slug).map((s) => ({
    to: `/ministry-space/${s.slug}`,
    kicker: `${labels.space} ${s.number}`,
    title: pick(s, "title", lang),
    desc: pick(s, "question", lang),
  }));

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb
        section={labels.ministry}
        items={[
          { label: t("nav.home"), to: "/" },
          { label: t("nav.target_audience"), to: "/target-audience" },
          { label: labels.ministry, to: "/audience/ministry" },
          { label: pick(space, "title", lang) },
        ]}
      />
      <InnerHero
        image={detail.image}
        kicker={`${labels.space} ${space.number} — ${pick(detail, "kicker", lang)}`}
        titlePre={pick(detail, "hero_pre", lang)}
        titleEm={pick(detail, "hero_em", lang)}
        titlePost={pick(detail, "hero_post", lang)}
        intro={pick(space, "desc", lang)}
        primary={{ to: "#numbers", label: labels.numbers }}
        secondary={{ to: "/audience/ministry#spaces", label: labels.back }}
      >
        <div className="bg-white p-6 md:p-7 flex flex-col gap-4 shadow-[0_32px_56px_-28px_rgba(0,0,0,0.6)]">
          <span className="text-5xl font-black text-brand-orange leading-none">{space.number}</span>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-muted">{labels.question}</span>
          <p className="text-lg font-bold text-brand-ink leading-snug">{pick(space, "question", lang)}</p>
          <ul className="flex flex-col gap-2.5 border-t border-gray-200 pt-4">
            {detail.headline.map((h) => (
              <li key={h.value} className="flex items-baseline gap-3">
                <span dir="ltr" className="text-2xl font-black text-brand-ink leading-none">{h.value}</span>
                <span className="text-[13px] font-semibold text-brand-muted leading-snug">{pick(h, "label", lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </InnerHero>
      <AnchorNav
        items={[
          { href: "#numbers", label: labels.numbers },
          detail.local_flow && { href: "#local", label: labels.local },
          { href: "#ai-insights", label: labels.insights },
          detail.advisor && { href: "#advisor", label: labels.advisor },
          detail.news && { href: "#announcements", label: labels.announcements },
          { href: "#indicators", label: labels.indicators },
          { href: "#ai", label: labels.ai },
          { href: "#others", label: labels.others },
        ].filter(Boolean)}
        cta={register}
      />

      {/* الأرقام الحقيقية */}
      <section id="numbers" className="bg-gray-50 py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.numbersKicker} title={pick(detail, "stats_title", lang)} desc={labels.numbersNote} />
          <HomeStatsPanel stats={detail.stats} isRTL={isRTL} />
        </div>
      </section>

      {/* الشراكات على المستوى المحلي — الوزارة لا تُنشئها، تصلها كبيانات */}
      {detail.local_flow && (
        <section id="local" className="bg-brand-ink py-20 md:py-24 scroll-mt-28">
          <div className="container mx-auto px-6">
            <SectionHead kicker={labels.localKicker} title={labels.localTitle} desc={labels.localDesc} light />
            <div className="relative">
              <span className="hidden lg:block absolute top-6 start-6 end-6 h-px bg-brand-orange/50"></span>
              <div className="relative grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10">
                {detail.local_flow.map((step, i) => (
                  <div key={step.title_en} className="flex flex-col items-start gap-4">
                    <span className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-extrabold ${i === detail.local_flow.length - 1 ? "bg-brand-orange text-white" : "bg-brand-ink border border-brand-orange/60 text-brand-orange"}`}>0{i + 1}</span>
                    <h3 className="text-lg font-bold text-white leading-snug">{pick(step, "title", lang)}</h3>
                    <p className="text-sm text-white/65 leading-relaxed">{pick(step, "desc", lang)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* إحصائيات يولّدها الذكاء الاصطناعي: تنبؤات وتحليلات محسوبة من الأرقام أعلاه */}
      {ai && (
        <section id="ai-insights" className="bg-white py-20 md:py-24 scroll-mt-28">
          <div className="container mx-auto px-6">
            <SectionHead kicker={labels.insightsKicker} title={pick(ai, "title", lang)} desc={labels.insightsNote} />
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
              {ai.tiles.map((st) => (
                <div key={st.label_en} className="relative bg-brand-ink p-5 md:p-6 flex flex-col">
                  <span className="absolute top-4 end-4 inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.15em] text-brand-orange border border-brand-orange/40 px-1.5 py-0.5">
                    <Sparkles className="w-3 h-3" /> AI
                  </span>
                  <span dir="ltr" className="text-[28px] md:text-[34px] font-bold leading-none text-brand-orange text-start mb-2.5">{st.value}</span>
                  <p className="text-[12px] md:text-[13px] font-semibold leading-relaxed text-white/70">{pick(st, "label", lang)}</p>
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8">
                {ai.forecast ? (
                  <ForecastChart chart={ai.forecast} lang={lang} labels={labels} />
                ) : (
                  <HomeStatsPanel stats={{ tiles: [], charts: ai.charts }} isRTL={isRTL} />
                )}
              </div>
              <div className="lg:col-span-4 bg-brand-cream-hero p-6 md:p-7 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-brand-orange">
                  <Brain className="w-4 h-4" /> {labels.found}
                </span>
                <ul className="flex flex-col gap-3.5 flex-1">
                  {ai[`insights_${lang}`].map((txt) => (
                    <li key={txt} className="flex items-start gap-2.5 text-sm font-semibold text-brand-ink leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-brand-orange flex-shrink-0 mt-2"></span>
                      {txt}
                    </li>
                  ))}
                </ul>
                <p className="text-[12px] text-brand-muted leading-relaxed border-t border-brand-ink/10 pt-3">
                  <span className="font-bold text-brand-ink">{labels.method}: </span>
                  {pick(ai, "method", lang)}
                </p>
              </div>
            </div>

            {/* أولويات يقترحها الذكاء الاصطناعي — بانتظار اعتماد الوزارة */}
            {ai.suggestions && (
              <div className="mt-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6">
                  <h3 className="text-2xl font-bold text-brand-ink">{labels.suggestTitle}</h3>
                  <span className="text-[12px] text-brand-muted">{pick(ai, "suggestions_formula", lang)}</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {ai.suggestions.map((s, i) => (
                    <div key={s.field_en} className="border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300 p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-brand-orange">#{i + 1}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-orange border border-brand-orange/40 px-1.5 py-0.5">
                          <Sparkles className="w-3 h-3" /> AI
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-brand-ink leading-snug">{pick(s, "sector", lang)}</h4>
                      <p className="text-[12px] font-semibold text-brand-muted">
                        {labels.field}: {pick(s, "field", lang)} · <span dir="ltr">{s.works.toLocaleString("en-US")}</span> {labels.works} · <span dir="ltr">{s.share.toFixed(1)}%</span>
                      </p>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between text-[11px] font-bold text-brand-ink mb-1.5">
                          <span>{labels.gap}</span>
                          <span dir="ltr">{Math.round(s.gap)}%</span>
                        </div>
                        <span className="block h-2 bg-gray-100">
                          <span className="block h-2 bg-brand-orange" style={{ width: `${s.gap}%` }}></span>
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-brand-muted border-t border-gray-100 pt-2.5">{labels.pending}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* المستشار البحثي الذكي — واجهة محادثة تجريبية بالذكاء الاصطناعي المفعّل */}
      {detail.advisor && (
        <section id="advisor" className="bg-gray-50 py-20 md:py-24 scroll-mt-28">
          <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-4">
              <SectionHead kicker={labels.advisorKicker} title={labels.advisorTitle} desc={labels.advisorDesc} className="mb-6" />
              <ul className="flex flex-col gap-3">
                {labels.advisorPoints.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm font-semibold text-brand-ink leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-brand-orange flex-shrink-0 mt-2"></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-8">
              <MinistryAdvisorChat lang={lang} />
            </div>
          </div>
        </section>
      )}

      {/* أخبار وإعلانات التمويل — تتغير باستمرار وموجهة للطلبة والباحثين */}
      {detail.news && <FundingAnnouncements categories={detail.news} lang={lang} labels={labels} />}

      {/* المؤشرات */}
      <section id="indicators" className="bg-white py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.indicatorsKicker} title={labels.indicatorsTitle} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detail.indicators.map((ind) => (
              <div key={ind.code} className="bg-white border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300 p-7 flex flex-col gap-3">
                <span dir="ltr" className="text-[11px] font-extrabold tracking-[0.15em] text-brand-orange text-start">{ind.code}</span>
                <h3 className="text-lg font-bold text-brand-ink leading-snug">{pick(ind, "name", lang)}</h3>
                <p className="text-sm leading-relaxed text-brand-muted flex-1">{pick(ind, "desc", lang)}</p>
                <div className="bg-brand-cream-hero px-3.5 py-2.5 text-[13px] font-semibold text-brand-ink leading-relaxed">
                  <span className="text-brand-orange font-bold">{labels.formula}: </span>
                  {pick(ind, "formula", lang)}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] font-bold text-brand-muted border border-gray-200 px-2.5 py-1">{labels.source}: {pick(ind, "source", lang)}</span>
                  <span className="text-[11px] font-bold text-brand-muted border border-gray-200 px-2.5 py-1">{labels.frequency}: {pick(ind, "freq", lang)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الذكاء الاصطناعي */}
      <section id="ai" className="bg-brand-ink py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.aiKicker} title={labels.aiTitle} desc={pick(detail, "ai_intro", lang)} light />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detail.ai.map((item, i) => {
              const Icon = AI_ICONS[i % AI_ICONS.length];
              return (
                <div key={item.title_ar} className="bg-brand-dark-card border border-brand-dark-border p-7 flex flex-col gap-3">
                  <span className="w-11 h-11 bg-brand-orange/15 flex items-center justify-center text-brand-orange">
                    <Icon className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">{pick(item, "title", lang)}</h3>
                  <p className="text-sm text-white/65 leading-relaxed flex-1">{pick(item, "desc", lang)}</p>
                  <p className="text-[13px] font-semibold text-white/85 border-t border-white/10 pt-3">
                    <span className="text-brand-orange font-bold">{labels.output}: </span>
                    {pick(item, "output", lang)}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex items-start gap-3 border border-brand-orange/40 px-5 py-4 text-sm font-semibold text-white">
            <ShieldCheck className="w-5 h-5 text-brand-orange flex-shrink-0" strokeWidth={2} />
            {labels.guard}
          </div>
        </div>
      </section>


      <QuoteBand quote={pick(detail, "quote", lang)} source={isRTL ? "مواصفة طبقة الوزارة" : "Ministry layer specification"} />
      <div id="others" className="scroll-mt-28">
        <RelatedCards title={labels.othersTitle} items={related} />
      </div>
      <CtaBand title={labels.ctaTitle} desc={labels.ctaDesc} primary={register} secondary={{ to: "/contact-us", label: labels.contact }} />
    </div>
  );
};

export default MinistrySpacePage;
