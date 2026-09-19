import { Link } from "react-router-dom";
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

// ── الهيرو المصوّر ──
export const InnerHero = ({ image, kicker, titlePre, titleEm, titlePost, intro, primary, secondary, tone = "dark", children }) => {
  const { ArrowIcon, displayFont } = useInnerLang();
  const dark = tone === "dark";
  return (
    <section className={`relative overflow-hidden ${dark ? "bg-brand-ink" : "bg-brand-cream-hero"}`}>
      {image && (
        <img
          src={image}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover ${dark ? "brightness-[0.35]" : "opacity-[0.6]"}`}
        />
      )}
      {dark && (
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/60 to-brand-ink/20 pointer-events-none"></div>
      )}
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
      <div className="relative container mx-auto px-6 py-20 md:py-24 grid lg:grid-cols-12 gap-10 items-end">
        <div className={`lg:col-span-8 flex flex-col items-start ${dark ? "text-white" : "text-brand-ink"}`}>
          <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-5 block">{kicker}</span>
          <h1
            className="text-[34px] sm:text-[44px] md:text-[56px] font-bold leading-[1.4] max-w-4xl mb-5"
            style={{ fontFamily: displayFont }}
          >
            {titlePre}
            <span className="text-brand-orange">{titleEm}</span>
            {titlePost}
          </h1>
          <p className={`text-base md:text-lg leading-relaxed max-w-2xl mb-8 ${dark ? "text-gray-300" : "text-brand-muted"}`}>
            {intro}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {primary && (
              <Link
                to={primary.to}
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-[15px] font-bold text-white hover:bg-brand-orange-dark transition-colors"
              >
                {primary.label}
                <ArrowIcon className="w-4 h-4" />
              </Link>
            )}
            {secondary && (
              <Link
                to={secondary.to}
                className={`inline-flex items-center rounded-full border px-6 py-3 text-[15px] font-bold transition-colors ${
                  dark
                    ? "border-white/30 text-white hover:bg-white hover:text-brand-ink"
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
    </section>
  );
};

// ── شريط الروابط الداخلية اللاصق (Elsevier: قائمة أقسام صفحة المنتج) ──
export const AnchorNav = ({ items, cta }) => {
  const { ArrowIcon } = useInnerLang();
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
        {cta && (
          <Link
            to={cta.to}
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2 text-[13px] font-bold text-white hover:bg-brand-orange-dark transition-colors flex-shrink-0"
          >
            {cta.label}
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};

// ── رأس قسم ──
export const SectionHead = ({ kicker, title, desc, light = false, className = "" }) => (
  <div className={`mb-10 md:mb-12 ${className}`}>
    {kicker && (
      <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-4 block">{kicker}</span>
    )}
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
            className="group bg-white border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300 p-7 flex flex-col min-h-[200px]"
          >
            {item.kicker && (
              <span className="text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-2.5 block">{item.kicker}</span>
            )}
            <h3 className="text-lg font-bold text-brand-ink mb-2">{item.title}</h3>
            {item.desc && <p className="text-sm leading-relaxed text-brand-muted flex-1">{item.desc}</p>}
            <CardArrow />
          </Link>
        ))}
      </div>
    </div>
  </section>
);
