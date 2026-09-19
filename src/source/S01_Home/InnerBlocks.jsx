import { Link, useNavigate } from "react-router-dom";
import useBackClick from "../shared/useBackClick";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// =========================================================
// لبنات الصفحات الداخلية (أسلوب Elsevier للصفحات الداخلية): شريط عنوان
// + مسار تنقل، هيرو مصوّر بعنوان نسخ ومائل برتقالي، شريط روابط داخلية
// لاصق، رؤوس أقسام، شريط اقتباس، شريط CTA، وبطاقات مرتبطة.
// تُستخدم في: AudienceDetailPage (ثلاثة تصاميم) وPillarPage.
// =========================================================

export const useInnerLang = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith("ar") ?? false;
  return {
    t,
    isRTL,
    lang: isRTL ? "ar" : "en",
    ArrowIcon: isRTL ? ArrowLeft : ArrowRight,
    BackIcon: isRTL ? ArrowRight : ArrowLeft,
    CrumbIcon: isRTL ? ChevronLeft : ChevronRight,
    // ✅ خط الهوية للعناوين الكبيرة (Brand Guidelines): Tajawal / DM Sans
    displayFont: isRTL ? "var(--font-ar)" : "var(--font-en)",
  };
};

// ✅ تنظيف عناوين الهيرو (بطلب صريح): بلا شحطة (— / – أو - منفصلة) وبلا نقطة أو فاصلة في آخر النص.
// الشرطة داخل الكلمات (Post-Publication) تبقى.
export const cleanHeroText = (s) =>
  String(s ?? "")
    .replace(/\s*[—–]\s*/g, " ")
    .replace(/(^|\s)-(\s|$)/g, " ")
    .replace(/[\s.。،,]+$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();

// يقرأ الحقل المناسب للغة من كائن يحمل مفاتيح _ar / _en
export const pick = (obj, key, lang) => obj?.[`${key}_${lang}`] ?? obj?.[key] ?? "";

// ── شريط العنوان + مسار التنقل (Elsevier: "Academic & Government · Home › …") ──
export const Breadcrumb = ({ section, items }) => {
  const { CrumbIcon } = useInnerLang();
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="py-3.5 text-[15px] font-bold text-brand-ink border-b border-gray-100">{section}</div>
        <nav className="py-3 flex flex-wrap items-center gap-2 text-[13px]" aria-label="breadcrumb">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <span key={`${item.label}-${i}`} className="inline-flex items-center gap-2">
                {item.to && !isLast ? (
                  <Link to={item.to} className="text-brand-orange font-semibold hover:text-brand-orange-dark transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-brand-muted" : "text-brand-orange font-semibold"}>{item.label}</span>
                )}
                {!isLast && <CrumbIcon className="w-3.5 h-3.5 text-brand-muted" />}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// ── مسار التنقل داخل الهيرو (أسفل السلايدر) على شكل زر بيضاوي، ومقابله زر رجوع ──
// dark = فوق صورة داكنة، وإلا فوق خلفية فاتحة.
// زر الرجوع يعيد المستخدم إلى المكان الذي ضغط منه بالضبط (useBackClick + ScrollManager)؛
// وإن فُتحت الصفحة مباشرة يذهب إلى الصفحة الأعلى في المسار.
// ✅ مسار التنقل (breadcrumbs) مخفي في كل الصفحات الداخلية بطلب صريح — يظهر مكانه زر
// الرجوع فقط. items تبقى لتحديد الصفحة الاحتياطية عند فتح الصفحة مباشرة.
export const HeroCrumbs = ({ items, className = "" }) => {
  const { BackIcon, isRTL } = useInnerLang();
  const onBack = useBackClick();
  if (!items?.length) return null;
  const fallback = [...items].slice(0, -1).reverse().find((it) => it.to)?.to || "/";
  return (
    <div className={`w-full flex flex-wrap items-center justify-end gap-3 ${className}`}>
    <Link
      to={fallback}
      onClick={onBack}
      className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-[13px] font-bold text-white hover:bg-brand-orange-dark transition-colors"
    >
      <BackIcon className="w-4 h-4" />
      {isRTL ? "الرجوع للخلف" : "Go back"}
    </Link>
    </div>
  );
};

// ── الهيرو المصوّر ──
export const InnerHero = ({ image, imagePos, kicker, titlePre, titleEm, titlePost, intro, primary, secondary, tone = "dark", crumbs, children }) => {
  const { ArrowIcon, BackIcon, displayFont } = useInnerLang();
  const navigate = useNavigate();
  // زر الرجوع يعود للصفحة السابقة فعليًا (وموقعها يُستعاد عبر ScrollManager)؛
  // إن فُتحت الصفحة مباشرة بلا سجل داخل الموقع نستخدم primary.to
  const onPrimaryClick = (e) => {
    if (primary?.back && (window.history.state?.idx ?? 0) > 0) {
      e.preventDefault();
      navigate(-1);
    }
  };
  const dark = tone === "dark";
  return (
    <section className={`relative overflow-hidden ${dark && !image ? "bg-brand-ink" : "bg-brand-cream-hero"} ${image ? "min-h-[500px] md:min-h-0 md:h-[460px] flex items-center" : ""}`}>
      {image && (
        <img
          src={image}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover ${dark ? "" : "opacity-[0.6]"}`}
          style={imagePos ? { objectPosition: imagePos } : undefined}
        />
      )}
      {/* ✅ النمط الداكن: الصورة كما هي والنص فوقها — بلا طبقة سوداء (بطلب صريح) */}
      {/* ✅ الهيرو الفاتح: الصورة أوضح (بلا طبقة بيضاء ثقيلة) مع تدرّج أبيض خفيف على
          جهة النص فقط لضمان قراءته (بطلب صريح) */}
      {!dark && image && (
        <div className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-white/75 via-white/35 to-white/0 pointer-events-none"></div>
      )}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 end-10 h-20 w-20 bg-brand-orange/20" />
        <div className="absolute bottom-16 end-[8%] h-28 w-28 bg-brand-orange/10" />
        <div className="absolute top-1/2 end-1/4 h-12 w-44 bg-white/5" />
      </div>
      {/* ✅ بطول سلايدر الرئيسية (460px): مسافات أصغر، وزر الرجوع عائم في الزاوية بدل سطر إضافي */}
      <div className={`relative w-full container mx-auto px-6 grid lg:grid-cols-12 gap-8 items-center ${image ? "pt-8 pb-24 md:py-8" : "py-10 md:py-12"}`}>
        <div className={`lg:col-span-8 flex flex-col items-start ${dark ? "text-white" : "text-brand-ink"}`}>
          {/* ✅ فوق الصورة (النمط الداكن): بوكس أسود شفاف مع تمويه خلف النص — نفس بوكس سلايدر الرئيسية */}
          <div className={dark && image ? "bg-black/30 backdrop-blur-[6px] border border-white/15 rounded-2xl px-6 sm:px-8 md:px-10 py-5 md:py-6 mb-5 max-w-4xl" : "contents"}>
          {/* ✅ العنوان الفرعي (kicker) فوق عنوان الهيرو محذوف من كل الصفحات الداخلية بطلب صريح */}
          <h1
            className={`text-[28px] sm:text-[34px] md:text-[40px] font-bold leading-[1.3] max-w-4xl mb-3 ${dark ? "[text-shadow:0_2px_14px_rgba(0,0,0,0.55)]" : ""}`}
            style={{ fontFamily: displayFont }}
          >
            {/* ✅ الجزء البرتقالي في سطر مستقل أسفل النص، بلا شحطة ولا نقطة */}
            {cleanHeroText(titlePre)}
            {(titleEm || titlePost) && (
              <span className="block">
                <span className="text-brand-orange">{cleanHeroText(titleEm)}</span>
                {cleanHeroText(titlePost) && <> {cleanHeroText(titlePost)}</>}
              </span>
            )}
          </h1>
          <p className={`text-[15px] md:text-base leading-relaxed max-w-2xl ${image ? "line-clamp-3" : ""} ${dark && image ? "" : "mb-8"} ${dark ? "text-white font-medium [text-shadow:0_2px_14px_rgba(0,0,0,0.55)]" : "text-brand-muted"}`}>
            {intro}
          </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {primary && (
              <Link
                to={primary.to}
                onClick={onPrimaryClick}
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-[15px] font-bold text-white hover:bg-brand-orange-dark transition-colors"
              >
                {/* primary.back: زر رجوع — السهم قبل النص وباتجاه الرجوع */}
                {primary.back && <BackIcon className="w-4 h-4" />}
                {primary.label}
                {!primary.back && <ArrowIcon className="w-4 h-4" />}
              </Link>
            )}
            {secondary && (
              <Link
                to={secondary.to}
                className={`inline-flex items-center rounded-full border px-6 py-3 text-[15px] font-bold transition-colors ${
                  dark
                    ? "border-white/30 bg-black/30 backdrop-blur-[6px] text-white hover:bg-white hover:text-brand-ink"
                    : "border-brand-ink/15 text-brand-ink bg-white hover:border-brand-ink/30"
                }`}
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
        {children && <div className="lg:col-span-4">{children}</div>}
      </div>
      {/* ✅ مسار التنقل أسفل الهيرو على شكل زر */}
      {crumbs && (
        <div className={image ? "absolute inset-x-0 bottom-6 z-10" : "relative"}>
          <div className={`container mx-auto px-6 ${image ? "" : "pb-8 -mt-2"}`}>
            <HeroCrumbs items={crumbs} dark={dark} />
          </div>
        </div>
      )}
    </section>
  );
};

// ── شريط الروابط الداخلية اللاصق (Elsevier: قائمة أقسام صفحة المنتج) ──
export const AnchorNav = ({ items }) => {
  return (
    <div className="sticky top-16 z-20 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="container mx-auto px-6 flex items-center justify-between gap-6 overflow-x-auto">
        <div className="flex items-center gap-1 py-1">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap px-3.5 py-3 text-[13px] font-bold text-brand-muted hover:text-brand-orange border-b-2 border-transparent hover:border-brand-orange transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        {/* ✅ زر الـ CTA في شريط الأقسام محذوف بطلب صريح (تكرار لزر الهيرو) */}
      </div>
    </div>
  );
};

// ── رأس قسم ──
// ✅ العنوان الفرعي (kicker) مخفي في كل الأقسام بطلب صريح — الخاصية تبقى مقبولة لعدم كسر الاستدعاءات
// eslint-disable-next-line no-unused-vars
export const SectionHead = ({ kicker, title, desc, light = false, className = "" }) => (
  <div className={`mb-10 md:mb-12 ${className}`}>
    <h2 className={`text-3xl md:text-4xl font-bold leading-tight ${light ? "text-white" : "text-brand-ink"} ${desc ? "mb-4" : ""}`}>
      {title}
    </h2>
    {desc && (
      <p className={`text-[15px] md:text-base leading-relaxed max-w-3xl ${light ? "text-white/65" : "text-brand-muted"}`}>
        {desc}
      </p>
    )}
  </div>
);

// ── شريط اقتباس (نسخ) ──
export const QuoteBand = ({ quote, source, tone = "dark" }) => {
  const { displayFont } = useInnerLang();
  const dark = tone === "dark";
  return (
    <section className={`${dark ? "bg-brand-ink" : "bg-brand-cream-hero"} py-16 md:py-20`}>
      <div className="container mx-auto px-6 flex flex-col items-center text-center">
        <p
          className={`text-2xl md:text-[32px] md:leading-[1.6] font-medium max-w-4xl ${dark ? "text-white" : "text-brand-ink"}`}
          style={{ fontFamily: displayFont }}
        >
          «{quote}»
        </p>
        {source && (
          <span className={`mt-6 text-xs font-bold tracking-[0.2em] uppercase ${dark ? "text-brand-orange" : "text-brand-muted"}`}>
            {source}
          </span>
        )}
      </div>
    </section>
  );
};

// ── شريط CTA ختامي ──
export const CtaBand = ({ title, desc, primary, secondary }) => (
  <section className="bg-brand-cream-hero py-16 md:py-20">
    <div className="container mx-auto px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-brand-ink leading-tight mb-2.5">{title}</h2>
        {desc && <p className="text-base text-brand-muted">{desc}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
        <Link
          to={primary.to}
          className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-brand-orange-dark transition-all duration-300"
        >
          {primary.label}
        </Link>
        {secondary && (
          <Link
            to={secondary.to}
            className="inline-flex items-center gap-2 bg-white text-brand-ink border border-brand-ink/15 px-7 py-3.5 rounded-full font-medium text-sm hover:border-brand-ink/30 transition-all duration-300"
          >
            {secondary.label}
          </Link>
        )}
      </div>
    </div>
  </section>
);

// ── زر السهم الدائري الموحَّد ──
export const CardArrow = ({ className = "" }) => {
  const { ArrowIcon } = useInnerLang();
  return (
    <div
      className={`w-9 h-9 rounded-full border border-brand-orange/40 flex items-center justify-center self-end mt-6 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300 ${className}`}
    >
      <ArrowIcon className="w-3.5 h-3.5 text-brand-orange group-hover:text-white transition-colors" />
    </div>
  );
};

// ── بطاقات مرتبطة (السابق/التالي أو صفحات ذات صلة) ──
export const RelatedCards = ({ title, items }) => (
  <section className="bg-white py-16 md:py-20">
    <div className="container mx-auto px-6">
      {title && <h2 className="text-2xl md:text-3xl font-bold text-brand-ink mb-8">{title}</h2>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-2xl group bg-white border-2 border-gray-200 hover:border-brand-orange hover:shadow-lg transition-all duration-300 p-7 flex flex-col min-h-[200px] overflow-hidden"
          >
            {/* ✅ العنوان الفرعي (item.kicker) مخفي بطلب صريح */}
            <h3 className="text-lg font-bold text-brand-ink mb-2">{item.title}</h3>
            {item.desc && <p className="text-sm leading-relaxed text-brand-muted flex-1">{item.desc}</p>}
            <CardArrow />
          </Link>
        ))}
      </div>
    </div>
  </section>
);
