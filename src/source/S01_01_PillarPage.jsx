import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { CheckCircle, Layers, Sparkles, Workflow, ShieldCheck, GraduationCap, Building2, Landmark, Users, FolderKanban, Database, Bot, BarChart3, ClipboardCheck, Languages, Lightbulb, MonitorSmartphone, Code2, Bell, ListChecks, Lock, FileSearch } from "lucide-react";
import { PILLARS, PILLAR_ORDER, LAYERS, LAYER_ORDER, PILLAR_AUDIENCE_LABELS } from "./S01_Home/pillarsContent";
import { useInnerLang, pick, Breadcrumb, CtaBand } from "./S01_Home/InnerBlocks";

// =========================================================
// صفحة الركيزة التقنية (/pillar/:key) — التصميم "السينمائي الداكن بفصول"
// المعتمد من لوحة التصميم: هيرو داكن بعلامة مائية رقمية وعنوان نسخ بمائل
// برتقالي → شريط الفصول → 01 ما هو → 02 المكونات → 03 كيف يعمل → 04 الضمانة
// (بلوك مقسوم) → اقتباس → لمن يفيد → الركيزة السابقة/التالية → CTA.
// المحتوى من src/source/S01_Home/pillarsContent.js (المقترح + مواصفة الوزارة + الدليل).
// =========================================================

// ✅ الصفحة تخدم الركائز التقنية الأربع والطبقات التشغيلية الثلاث (المنصة الرقمية /
// خدمات الذكاء الاصطناعي / شبكة الخبراء) بنفس القالب — المحتوى من pillarsContent.js
const ALL = { ...PILLARS, ...LAYERS };
const PILLAR_ICONS = { digital: Layers, ai: Sparkles, automation: Workflow, security: ShieldCheck, platform: Layers, ai_services: Sparkles, experts: Users };
// ✅ أيقونة مختلفة لكل مكوّن من مكوّنات الفصل 02 (بترتيب البطاقات الثلاث)
const COMPONENT_ICONS = {
  platform: [Users, Workflow, Database],            // المستخدمون والسجلات / مسارات النشر والخدمات / المستودعات واللوحات
  ai_services: [Bot, BarChart3, ShieldCheck],       // المساعدون البحثيون / الوكلاء التحليليون / الحوكمة والإشراف البشري
  experts: [ClipboardCheck, Languages, Lightbulb],  // التحكيم والمنهجية / التحرير والترجمة والنشر / الابتكار والملكية الفكرية
  digital: [MonitorSmartphone, Code2, Database],    // تجربة المستخدم / التطبيق وواجهات API / البيانات والتكامل
  ai: [Bot, BarChart3, ShieldCheck],
  automation: [Workflow, Bell, ListChecks],
  security: [Lock, ShieldCheck, FileSearch],
};
const AUDIENCE_ICONS = { researcher: GraduationCap, university: Building2, ministry: Landmark };

const PillarPage = () => {
  const { key } = useParams();
  const { t, lang, isRTL, ArrowIcon, BackIcon, displayFont } = useInnerLang();

  if (!ALL[key]) return <Navigate to="/" replace />;
  const p = ALL[key];
  const isLayer = p.group === "layer";
  const ORDER = isLayer ? LAYER_ORDER : PILLAR_ORDER;
  const index = ORDER.indexOf(key);
  const prevKey = ORDER[(index - 1 + ORDER.length) % ORDER.length];
  const nextKey = ORDER[(index + 1) % ORDER.length];
  const name = pick(p, "name", lang);
  const total = ORDER.length;

  const L = isRTL
    ? (isLayer
        ? { section: "طبقات التشغيل", pillar: "الطبقة", chapter: "الفصل", ch1: "ما هي", ch2: "المكونات", ch3: "كيف تعمل", ch4: "الضمانة", who: "القيمة عبر مستويات المنظومة", whoTitle: "ماذا يتغيّر لكل دور؟", prev: "الطبقة السابقة", next: "الطبقة التالية", register: "تسجيل الدخول", contact: "للتواصل معنا", ctaTitle: "ثلاث طبقات. منظومة تشغيلية واحدة.", ctaDesc: "المنصة الرقمية، خدمات الذكاء الاصطناعي، وشبكة الخبراء تعمل معاً لدعم البحث وإدارته وتطويره ضمن بيئة مترابطة.", chapters: "الفصول الأربعة", all: "كل الميزات" }
        : { section: "الركائز التقنية", pillar: "الركيزة", chapter: "الفصل", ch1: "ما هو", ch2: "المكونات", ch3: "كيف يعمل", ch4: "الضمانة", who: "لمن يفيد", whoTitle: "ماذا يتغيّر لكل دور؟", prev: "الركيزة السابقة", next: "الركيزة التالية", register: "تسجيل الدخول", contact: "للتواصل معنا", ctaTitle: "خطوة نحو جاهزية أكاديمية عالمية.", ctaDesc: "أربع ركائز تقنية تحت المكونات الثلاثة — في منظومة وطنية واحدة.", chapters: "الفصول الأربعة", all: "كل الميزات" })
    : (isLayer
        ? { section: "Operating layers", pillar: "Layer", chapter: "Chapter", ch1: "What it is", ch2: "Components", ch3: "How it works", ch4: "The guarantee", who: "Who benefits", whoTitle: "What changes for each role?", prev: "Previous layer", next: "Next layer", register: "Sign in", contact: "Contact us", ctaTitle: "A step towards global academic readiness.", ctaDesc: "Three operating layers — the digital platform, AI services and the expert network — in one national system.", chapters: "The four chapters", all: "All features" }
        : { section: "Technical pillars", pillar: "Pillar", chapter: "Chapter", ch1: "What it is", ch2: "Components", ch3: "How it works", ch4: "The guarantee", who: "Who benefits", whoTitle: "What changes for each role?", prev: "Previous pillar", next: "Next pillar", register: "Sign in", contact: "Contact us", ctaTitle: "A step towards global academic readiness.", ctaDesc: "Four technical pillars beneath the three components — in one national system.", chapters: "The four chapters", all: "All features" });

  const chapters = [
    { id: "what", n: "01", label: L.ch1 },
    { id: "components", n: "02", label: L.ch2 },
    { id: "how", n: "03", label: L.ch3 },
    { id: "guarantee", n: "04", label: L.ch4 },
  ];
  // ✅ الفصل النشط يتبع التمرير (يُضاء تاب الفصل الظاهر على الشاشة)
  const [activeChapter, setActiveChapter] = useState("what");
  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveChapter(visible.target.id);
    }, { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb section={L.section} items={[{ label: t("nav.home"), to: "/" }, { label: t("nav.about_us"), to: "/about-us" }, { label: name }]} />

      {/* الهيرو السينمائي */}
      <section className="relative overflow-hidden bg-brand-ink min-h-[640px] md:min-h-[700px] flex flex-col justify-end">
        <img src={p.image} alt="" className="absolute inset-0 w-full h-full object-cover brightness-[0.3]" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/70 to-brand-ink/30 pointer-events-none"></div>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 end-10 h-24 w-24 bg-brand-orange/20" />
          <div className="absolute top-1/3 end-1/4 h-16 w-40 bg-white/5" />
          <div className="absolute bottom-40 end-16 h-32 w-32 bg-brand-orange/10" />
          <span className="absolute bottom-4 end-[-10px] text-[300px] md:text-[440px] leading-none font-black text-white/[0.035] tracking-[-0.04em]" dir="ltr">{p.number}</span>
        </div>
        <div className="relative z-10 container mx-auto px-6 pt-16 pb-14 flex flex-col items-start">
          <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-6 block">
            {L.pillar} {p.number} / {`0${total}`} — {name}
          </span>
          <h1 className="text-[34px] sm:text-[48px] md:text-[64px] font-bold leading-[1.35] text-white max-w-5xl mb-6" style={{ fontFamily: displayFont }}>
            {pick(p, "title_pre", lang)}
            <span className="text-brand-orange">{pick(p, "title_em", lang)}</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl">{pick(p, "intro", lang)}</p>
        </div>
        {/* ✅ شريط الفصول بأسلوب تابات الصفحة الرئيسية (بطلب صريح): مستطيل أبيض بفواصل
            وخط برتقالي أعلى التاب النشط — يتبع التمرير ويعمل كأزرار */}
        <div className="relative z-10 bg-white border-t border-gray-200">
          <div className="container mx-auto px-6 py-5">
            <div className="bg-white border border-gray-200 shadow-[0_16px_40px_-24px_rgba(31,26,23,0.35)] grid grid-cols-2 md:grid-cols-4">
              {chapters.map((c, i) => {
                const isActive = activeChapter === c.id;
                return (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    onClick={() => setActiveChapter(c.id)}
                    className={`flex items-center justify-center gap-2.5 px-3 md:px-6 py-4 md:py-5 text-xs sm:text-sm md:text-[15px] font-bold border-t-[3px] transition-colors duration-300 ${
                      i < chapters.length - 1 ? "border-e border-e-gray-200" : ""
                    } ${isActive ? "border-t-brand-orange text-brand-ink" : "border-t-transparent text-brand-muted hover:text-brand-ink"}`}
                  >
                    <span className={`text-xs font-extrabold tracking-[0.1em] ${isActive ? "text-brand-orange" : "text-brand-muted/60"}`}>{c.n}</span>
                    {c.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* الفصل 01 — ما هو */}
      <section id="what" className="bg-white py-20 md:py-24 scroll-mt-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-10 lg:gap-20 items-start">
          <div className="lg:col-span-5">
            <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-5 block">{L.chapter} 01 — {L.ch1}</span>
            <h2 className="text-3xl md:text-[44px] md:leading-[1.25] font-bold text-brand-ink mb-5">{pick(p, "what_title", lang)}</h2>
            <p className="text-base leading-relaxed text-brand-muted">{pick(p, "what_desc", lang)}</p>
          </div>
          <div className="lg:col-span-7 flex flex-col">
            {p.verbs.map((v, i) => (
              <div key={v.verb_ar} className={`grid sm:grid-cols-[150px_1fr] gap-3 sm:gap-6 items-start py-7 border-t border-gray-200 ${i === p.verbs.length - 1 ? "border-b" : ""}`}>
                <span className="text-3xl font-extrabold text-brand-ink leading-tight">{pick(v, "verb", lang)}</span>
                <div>
                  <span className="block text-xs font-bold tracking-[0.2em] text-brand-orange mb-1.5">{pick(v, "label", lang)}</span>
                  <p className="text-[15px] leading-relaxed text-brand-muted">{pick(v, "desc", lang)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الفصل 02 — المكونات */}
      <section id="components" className="bg-gray-50 py-20 md:py-24 border-t border-gray-200 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-5 block">{L.chapter} 02 — {L.ch2}</span>
            <h2 className="text-3xl md:text-[44px] md:leading-[1.25] font-bold text-brand-ink">{pick(p, "components_title", lang)}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {p.components.map((c, i) => {
              const Icon = (COMPONENT_ICONS[key] && COMPONENT_ICONS[key][i]) || PILLAR_ICONS[key];
              const inner = (
                <>
                  <span className="absolute -top-4 end-4 text-[120px] leading-none font-black text-brand-ink/[0.04]" dir="ltr">0{i + 1}</span>
                  <span className="w-14 h-14 bg-brand-orange/10 border border-brand-orange/25 flex items-center justify-center text-brand-orange mb-7"><Icon className="w-[26px] h-[26px]" strokeWidth={1.5} /></span>
                  <h3 className="text-xl font-bold text-brand-ink mb-3">{pick(c, "title", lang)}</h3>
                  <p className="text-sm leading-relaxed text-brand-muted flex-1">{pick(c, "desc", lang)}</p>
                  {c.id && <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-brand-orange">{t("services.cta")} <ArrowIcon className="w-3.5 h-3.5" /></span>}
                </>
              );
              const cls = "relative overflow-hidden min-h-[300px] p-8 bg-white border border-gray-200 flex flex-col";
              return c.id ? (
                <Link key={c.title_ar} to={`/platform-service/${c.id}`} className={`${cls} hover:border-brand-orange/50 transition-colors`}>{inner}</Link>
              ) : (
                <div key={c.title_ar} className={cls}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* الفصل 03 — كيف يعمل */}
      <section id="how" className="bg-white py-20 md:py-24 border-t border-gray-200 scroll-mt-20">
        <div className="container mx-auto px-6">
          <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-5 block">{L.chapter} 03 — {L.ch3}</span>
          <h2 className="text-3xl md:text-[44px] md:leading-[1.25] font-bold text-brand-ink mb-14">{pick(p, "how_title", lang)}</h2>
          <div className="relative">
            <span className="hidden lg:block absolute top-7 start-7 end-7 h-px bg-gradient-to-l from-brand-orange to-brand-orange/50"></span>
            <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10">
              {p.steps.map((s, i) => (
                <div key={s.title_ar} className="flex flex-col items-start">
                  <span className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-extrabold mb-7 ${s.highlight ? "bg-brand-orange text-white shadow-[0_0_0_8px_rgba(255,135,16,0.15)]" : "bg-white border border-brand-orange/60 text-brand-orange"}`}>0{i + 1}</span>
                  <h3 className={`text-[22px] font-bold mb-2.5 ${s.highlight ? "text-brand-orange" : "text-brand-ink"}`}>{pick(s, "title", lang)}</h3>
                  <p className="text-sm leading-relaxed text-brand-muted">{pick(s, "desc", lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* الفصل 04 — الضمانة: بلوك مقسوم */}
      <section id="guarantee" className="bg-gray-50 pt-20 md:pt-24 border-t border-gray-200 scroll-mt-20">
        <div className="container mx-auto px-6">
          <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-5 block">{L.chapter} 04 — {pick(p, "guarantee_kicker", lang)}</span>
          <h2 className={`text-3xl md:text-[44px] md:leading-[1.25] font-bold text-brand-ink ${pick(p, "guarantee_desc", lang) ? "mb-5" : "mb-14"}`}>{pick(p, "guarantee_title", lang)}</h2>
          {pick(p, "guarantee_desc", lang) && (
            <p className="text-base leading-relaxed text-brand-muted max-w-3xl mb-14">{pick(p, "guarantee_desc", lang)}</p>
          )}
        </div>
        <div className={`grid ${pick(p, "split_c_word", lang) ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          <div className="bg-brand-cream-hero px-8 md:px-16 py-16 flex flex-col justify-between gap-8 min-h-[400px]">
            <span className="text-xs font-bold tracking-[0.3em] text-brand-orange">{pick(p, "split_a_label", lang)}</span>
            <span className="text-6xl md:text-[100px] leading-none font-black text-brand-orange" dir={/^[0-9+]/.test(pick(p, "split_a_word", lang)) ? "ltr" : undefined}>{pick(p, "split_a_word", lang)}</span>
            <p className="text-base leading-relaxed text-brand-orange max-w-md">{pick(p, "split_a_desc", lang)}</p>
          </div>
          <div className="bg-brand-orange px-8 md:px-16 py-16 flex flex-col justify-between gap-8 min-h-[400px]">
            {/* نصوص "تتكامل" بلون خلفية بلوك "تستضيف" (الفاتح) */}
            <span className="text-xs font-bold tracking-[0.3em] text-brand-cream-hero">{pick(p, "split_b_label", lang)}</span>
            <span className="text-6xl md:text-[100px] leading-none font-black text-brand-cream-hero" dir={/^[0-9+]/.test(pick(p, "split_b_word", lang)) ? "ltr" : undefined}>{pick(p, "split_b_word", lang)}</span>
            <p className="text-base leading-relaxed text-brand-cream-hero max-w-md">{pick(p, "split_b_desc", lang)}</p>
          </div>
          {pick(p, "split_c_word", lang) && (
            <div className="bg-white border-y border-gray-200 px-8 md:px-16 py-16 flex flex-col justify-between gap-8 min-h-[400px]">
              <span className="text-xs font-bold tracking-[0.3em] text-brand-orange">{pick(p, "split_c_label", lang)}</span>
              <span className="text-6xl md:text-[100px] leading-none font-black text-brand-ink">{pick(p, "split_c_word", lang)}</span>
              <p className="text-base leading-relaxed text-brand-ink max-w-md">{pick(p, "split_c_desc", lang)}</p>
            </div>
          )}
        </div>
        {pick(p, "quote", lang) && (
          <div className="bg-white px-6 py-16 md:py-20 border-b border-gray-200 flex justify-center text-center">
            <p className="text-2xl md:text-[32px] md:leading-[1.6] font-medium text-brand-ink max-w-4xl" style={{ fontFamily: displayFont }}>«{pick(p, "quote", lang)}»</p>
          </div>
        )}
      </section>

      {/* لمن يفيد */}
      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-6">
          <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-5 block">{L.who}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-ink mb-10">{pick(p, "who_title", lang) || L.whoTitle}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {p.audiences.map((a) => {
              const Icon = AUDIENCE_ICONS[a.key];
              return (
                <div key={a.key} className="p-7 border border-gray-200 bg-white">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-10 h-10 bg-brand-orange/10 flex items-center justify-center text-brand-orange"><Icon className="w-5 h-5" strokeWidth={1.75} /></span>
                    <h3 className="text-lg font-bold text-brand-ink">{PILLAR_AUDIENCE_LABELS[a.key][lang]}</h3>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {a[`items_${lang}`].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-brand-ink leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* الركيزة السابقة / التالية */}
          <div className="mt-16 grid md:grid-cols-2 border border-gray-200">
            <Link to={`/pillar/${nextKey}`} className="group p-8 flex items-center justify-between gap-6 md:border-e border-b md:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors">
              <span className="flex flex-col gap-1.5">
                <span className="text-xs font-bold tracking-[0.2em] text-brand-muted">{L.next} — {ALL[nextKey].number}</span>
                <span className="text-2xl font-bold text-brand-ink">{pick(ALL[nextKey], "name", lang)}</span>
              </span>
              <span className="w-11 h-11 rounded-full bg-brand-orange flex items-center justify-center text-white"><ArrowIcon className="w-4 h-4" /></span>
            </Link>
            <Link to={`/pillar/${prevKey}`} className="group p-8 flex items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
              <span className="flex flex-col gap-1.5">
                <span className="text-xs font-bold tracking-[0.2em] text-brand-muted">{L.prev} — {ALL[prevKey].number}</span>
                <span className="text-2xl font-bold text-brand-ink">{pick(ALL[prevKey], "name", lang)}</span>
              </span>
              <span className="w-11 h-11 rounded-full border border-brand-orange/40 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all"><BackIcon className="w-4 h-4" /></span>
            </Link>
          </div>
        </div>
      </section>

      <CtaBand title={L.ctaTitle} desc={L.ctaDesc} primary={{ to: "/login", label: L.register }} secondary={{ to: "/contact-us", label: L.contact }} />
    </div>
  );
};

export default PillarPage;
