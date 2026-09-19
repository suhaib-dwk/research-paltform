import { useParams, Link, Navigate } from "react-router-dom";
import { CheckCircle, FileCheck, Search, Users, RefreshCw, Award, Landmark, Building2, GraduationCap, ChevronDown } from "lucide-react";
import {
  AUDIENCES, AUDIENCE_GROUP, QUALITY_TRACKS, PERFORMANCE_AREAS, DATA_FLOW,
  MINISTRY_SPACES, POLICY_JOURNEY, MINISTRY_PRINCIPLES, MINISTRY_ROLES, MINISTRY_REPORTS, getLevelLabel,
} from "./S01_Home/audiencesContent";
import { SERVICE_FAMILIES, EXEC_TYPES, SERVICES_CATALOGUE, getServiceById } from "./S02_Services/servicesCatalogue";
import { MINISTRY_SPACE_DETAILS } from "./S03_Audience/ministrySpacesDetails";
import HomeStatsPanel from "./S01_Home/HomeStatsPanel";
import SourceChatbot from "./S03_Audience/SourceChatbot";
import {
  useInnerLang, pick, Breadcrumb, InnerHero, AnchorNav, SectionHead, QuoteBand, CtaBand, CardArrow, RelatedCards,
} from "./S01_Home/InnerBlocks";

// =========================================================
// صفحة تفصيلية لكل فئة مستفيدة (/audience/:key) — ثلاثة تصاميم مختلفة
// حسب المجموعة (audiencesContent.js):
//   journey      → مراحل الباحث: مستويات التمكين + خدمات الكتالوج + الرحلة
//   quality      → المؤسسات: المساران + مجالات الأداء + تدفق البيانات
//   intelligence → الوزارة: المساحات الأربع بلوحات توضيحية + رحلة القرار
// كلها بأسلوب الصفحات الداخلية في Elsevier: شريط عنوان ومسار تنقل، هيرو
// مصوّر بعنوان نسخ، شريط روابط داخلية لاصق، أقسام متناوبة، اقتباس، وCTA.
// =========================================================

// ✅ أسماء الفئات المؤسسية بصيغة معرّفة (roles.* بصيغة نكرة: "جامعة"، "وزارة")
const GROUP_NAMES = {
  ministry: { ar: "الوزارة", en: "Ministry" },
  university: { ar: "الجامعات", en: "Universities" },
  college: { ar: "الكليات", en: "Colleges" },
  research_center: { ar: "المراكز البحثية", en: "Research centres" },
};

// ✅ أدوار التسجيل التي تفتحها كل صفحة فئة — نموذج التسجيل يُفتح بالدور مباشرة
// (/register?role=…) بلا عرض كل أنواع الحسابات
const REGISTER_ROLES = {
  undergrad: ["undergrad"],
  grad: ["grad", "phd"],
  faculty: ["faculty", "researcher"],
  university: ["university"],
  college: ["college"],
  research_center: ["research_center"],
  ministry: ["ministry"],
};
const registerLinks = (audienceKey, t, isRTL) =>
  (REGISTER_ROLES[audienceKey] || []).map((role) => ({
    to: `/register?role=${role}`,
    label: `${isRTL ? "إنشاء حساب" : "Create account"} — ${t(`roles.${role}`)}`,
  }));

const FAMILY_ICONS = { assessment: FileCheck, development: Search, editing: FileCheck, review: Users, journal: Search, revision: RefreshCw, post: Award };
const VALID_KEYS = Object.keys(AUDIENCES);

const ServiceCard = ({ service, lang }) => {
  const Icon = FAMILY_ICONS[service.family] || FileCheck;
  return (
    <Link
      to={`/platform-service/${service.id}`}
      className="group w-full h-full min-h-[250px] text-start bg-white rounded-none p-7 flex flex-col border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <span className="w-11 h-11 bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-[22px] h-[22px] text-brand-orange" strokeWidth={1.75} />
        </span>
        <span className="text-[11px] font-bold text-brand-ink bg-brand-cream-hero px-2.5 py-1 leading-tight text-end">
          {EXEC_TYPES[service.exec][`label_${lang}`]}
        </span>
      </div>
      <span className="text-[11px] font-bold tracking-[0.15em] text-brand-muted mb-1.5 block" dir="ltr">
        <span className="block text-start">{service.id}</span>
      </span>
      <h3 className="text-[17px] font-bold text-brand-ink mb-2">{service[`name_${lang}`]}</h3>
      <p className="text-[13px] leading-relaxed text-brand-muted flex-1">{service[`desc_${lang}`]}</p>
      <CardArrow />
    </Link>
  );
};

// ───────────────────────── 1) مراحل الباحث — تصميم "الرحلة" ─────────────────────────
const JourneyLayout = ({ audienceKey, data, L }) => {
  const { t, lang, isRTL, ArrowIcon } = L;
  const stageIndex = ["undergrad", "grad", "faculty"].indexOf(audienceKey);
  const services = SERVICES_CATALOGUE.filter((s) => s.id.charAt(0) === data.level);
  const families = SERVICE_FAMILIES.filter((f) => services.some((s) => s.family === f.key));
  const title = `${pick(data, "title_pre", lang)}${pick(data, "title_em", lang)}${pick(data, "title_post", lang)}`;
  const labels = isRTL
    ? { levels: "ما تحصل عليه", services: "خدمات المرحلة", journey: "رحلتك", related: "المراحل الأخرى", stage: "المرحلة", of: "من 3", count: "خدمة في هذه المرحلة", decision: "القرار الأكاديمي النهائي يبقى لك", levelsTitle: "ثلاثة مستويات من التمكين", levelsKicker: "ما تحصل عليه", servicesKicker: "خدمات هذه المرحلة", journeyKicker: "رحلتك في هذه المرحلة", journeyTitle: "خطوة بخطوة — وكل خدمة في مكانها من الرحلة.", allServices: "كل الخدمات", register: "تسجيل الدخول", contact: "للتواصل معنا", ctaTitle: "ابدأ من مرحلتك الآن.", ctaDesc: "حساب واحد يرافقك عبر المراحل الثلاث.", relatedTitle: "المراحل الأخرى وكتالوج الخدمات", catalogue: "كتالوج الخدمات", catalogueDesc: "35 خدمة بحثية بسبع عائلات، بفلتر المرحلة ونوع التنفيذ." }
    : { levels: "What you get", services: "Stage services", journey: "Your journey", related: "Other stages", stage: "Stage", of: "of 3", count: "services in this stage", decision: "The final academic decision stays with you", levelsTitle: "Three levels of enablement", levelsKicker: "What you get", servicesKicker: "Services for this stage", journeyKicker: "Your journey in this stage", journeyTitle: "Step by step — and every service in its place on the journey.", allServices: "All services", register: "Sign in", contact: "Contact us", ctaTitle: "Start from your stage now.", ctaDesc: "One account accompanies you across all three stages.", relatedTitle: "Other stages and the services catalogue", catalogue: "Services catalogue", catalogueDesc: "35 research services in seven families, filterable by stage and delivery type." };

  const regLinks = registerLinks(audienceKey, t, isRTL);
  const related = ["undergrad", "grad", "faculty"]
    .filter((k) => k !== audienceKey)
    .map((k) => ({ to: `/audience/${k}`, kicker: pick(AUDIENCES[k], "kicker", lang).split(" — ")[0], title: t(`home.stage_${k}_title`), desc: t(`home.stage_${k}_desc`) }))
    .concat([{ to: "/services", kicker: isRTL ? "المكون الثالث" : "Component three", title: labels.catalogue, desc: labels.catalogueDesc }]);

  return (
    <>
      <Breadcrumb section={t("nav.target_audience")} items={[{ label: t("nav.home"), to: "/" }, { label: t("nav.target_audience"), to: "/target-audience" }, { label: t(`home.stage_${audienceKey}_title`) }]} />
      <InnerHero
        image={data.image}
        kicker={pick(data, "kicker", lang)}
        titlePre={pick(data, "title_pre", lang)}
        titleEm={pick(data, "title_em", lang)}
        titlePost={pick(data, "title_post", lang)}
        intro={pick(data, "intro", lang)}
        primary={regLinks[0]}
        secondary={regLinks[1] || { to: "#services", label: labels.services }}
      >
        <div className="bg-white p-6 md:p-7 flex flex-col gap-5 shadow-[0_32px_56px_-28px_rgba(0,0,0,0.6)]">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-brand-orange leading-none">{stageIndex + 1}</span>
            <span className="text-sm font-bold text-brand-muted">{labels.stage} {labels.of}</span>
          </div>
          <div className="flex items-baseline gap-3 border-t border-gray-200 pt-4">
            <span className="text-4xl font-black text-brand-ink leading-none">{services.length}</span>
            <span className="text-sm font-bold text-brand-muted">
              {isRTL && services.length >= 3 && services.length <= 10 ? "خدمات في هذه المرحلة" : labels.count}
            </span>
          </div>
          <div className="flex items-start gap-2.5 border-t border-gray-200 pt-4 text-sm font-semibold text-brand-ink">
            <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            {labels.decision}
          </div>
        </div>
      </InnerHero>
      <AnchorNav
        items={[{ href: "#levels", label: labels.levels }, { href: "#services", label: labels.services }, { href: "#journey", label: labels.journey }, { href: "#related", label: labels.related }]}
        cta={regLinks[0]}
      />

      {/* المستويات الثلاثة: القدرة / الخبرة / الفرص */}
      <section id="levels" className="bg-gray-50 py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.levelsKicker} title={labels.levelsTitle} />
          <div className="grid md:grid-cols-3 gap-6">
            {data.levels.map((lvl, i) => (
              <div key={lvl.key} className="bg-white border border-gray-200 p-8 flex flex-col">
                <span className="text-5xl font-black text-brand-cream leading-none mb-5">0{i + 1}</span>
                <h3 className="text-xl font-bold text-brand-ink mb-3">{getLevelLabel(lvl.key, lang)}</h3>
                <p className="text-sm leading-relaxed text-brand-muted">{pick(lvl, "desc", lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* خدمات المرحلة مجمّعة بالعائلات */}
      <section id="services" className="bg-white py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
            <SectionHead kicker={labels.servicesKicker} title={title} className="mb-0" />
            <Link to="/services" className="inline-flex items-center gap-3 text-brand-ink font-bold text-sm group hover:text-brand-orange transition-colors flex-shrink-0 mb-2">
              {labels.allServices}
              <span className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <ArrowIcon className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
          {families.map((family) => (
            <div key={family.key} className="mt-10">
              <div className="flex items-baseline justify-between border-b border-gray-200 pb-3 mb-6">
                <h3 className="text-xl font-bold text-brand-ink">{family[`label_${lang}`]}</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.filter((s) => s.family === family.key).map((service) => (
                  <ServiceCard key={service.id} service={service} lang={lang} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* الرحلة: خطوات بحسب المرحلة، مع رموز الخدمات */}
      <section id="journey" className="bg-brand-ink py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.journeyKicker} title={labels.journeyTitle} light />
          <div className="relative">
            <span className="hidden lg:block absolute top-6 start-6 end-6 h-px bg-brand-orange/50"></span>
            <div className={`relative grid gap-x-6 gap-y-10 sm:grid-cols-2 ${data.steps.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
              {data.steps.map((step, i) => (
                <div key={step.title_ar} className="flex flex-col items-start gap-4">
                  <span className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-extrabold ${i === data.steps.length - 1 ? "bg-brand-orange text-white" : "bg-brand-ink border border-brand-orange/60 text-brand-orange"}`}>
                    0{i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">{pick(step, "title", lang)}</h3>
                  <p className="text-sm text-white/65 leading-relaxed">{pick(step, "desc", lang)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {step.ids.map((id) => {
                      const svc = getServiceById(id);
                      return svc ? (
                        <Link key={id} to={`/platform-service/${id}`} className="text-[11px] font-bold text-white/80 border border-white/20 px-2 py-1 hover:border-brand-orange hover:text-brand-orange transition-colors" title={svc[`name_${lang}`]}>
                          <span dir="ltr">{id}</span>
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <QuoteBand quote={pick(data, "quote", lang)} source={pick(data, "quote_source", lang)} tone="light" />
      <div id="related" className="scroll-mt-28">
        <RelatedCards title={labels.relatedTitle} items={related} />
      </div>
      <CtaBand title={labels.ctaTitle} desc={labels.ctaDesc} primary={regLinks[0]} secondary={regLinks[1] || { to: "/login", label: labels.register }} />
    </>
  );
};

// ───────────────────────── 2) المؤسسات — تصميم "الجودة" ─────────────────────────
const QualityLayout = ({ audienceKey, data, L }) => {
  const { t, lang, isRTL } = L;
  const labels = isRTL
    ? { tracks: "المساران", areas: "مجالات الأداء", flow: "تدفق البيانات", related: "صفحات ذات صلة", focus: "ما تحصل عليه", tracksKicker: "المكون الثاني — الجودة والاعتماد والتصنيفات", tracksTitle: "مساران متوازيان، وملف بحثي واحد يغذيهما.", areasKicker: "ما الذي يُقاس", areasTitle: "مجالات الأداء التي تراقبها المؤسسة.", areasDesc: "أمثلة على المؤشرات من المقترح — يمكن للنظام دعم أطر مثل QS وTimes Higher Education وSCImago وLeiden CWTS متى توافرت البيانات.", flowKicker: "من المؤسسة إلى الوزارة", flowTitle: "بياناتك تُدخل مرة واحدة، وتصل إلى الوزارة عبر طبقة مشاركة وحوكمة.", register: "تسجيل الدخول", contact: "للتواصل معنا", ctaTitle: "انضم كمؤسسة وابدأ من ملفك البحثي.", ctaDesc: "التسجيل المؤسسي ثم تسجيل الباحثين، ثم تتدفق البيانات.", relatedTitle: "صفحات ذات صلة", quote: "لا يُعدّ ارتفاع عدد المنشورات وحده دليلًا على جودة البحث — كل رقم يجب أن يعود إلى مصدر وفترة وتعريف.", quoteSource: "مواصفة طبقة الوزارة — قواعد غير قابلة للتفاوض" }
    : { tracks: "The two tracks", areas: "Performance areas", flow: "Data flow", related: "Related pages", focus: "What you get", tracksKicker: "Component two — Quality, accreditation & rankings", tracksTitle: "Two parallel tracks, fed by one research profile.", areasKicker: "What is measured", areasTitle: "The performance areas an institution monitors.", areasDesc: "Example indicators from the proposal — the system can support frameworks such as QS, Times Higher Education, SCImago and Leiden CWTS where data is available.", flowKicker: "From institution to Ministry", flowTitle: "Your data is entered once and reaches the Ministry through a sharing and governance layer.", register: "Sign in", contact: "Contact us", ctaTitle: "Join as an institution and start from your research profile.", ctaDesc: "Institutional registration, then researcher enrolment, then the data flows.", relatedTitle: "Related pages", quote: "A rising publication count alone is never evidence of research quality — every figure must trace back to a source, a period and a definition.", quoteSource: "Ministry layer specification — non-negotiable rules" };

  const regLinks = registerLinks(audienceKey, t, isRTL);
  const related = ["university", "college", "research_center"]
    .filter((k) => k !== audienceKey)
    .map((k) => ({ to: `/audience/${k}`, kicker: pick(AUDIENCES[k], "kicker", lang).split(" — ")[0], title: GROUP_NAMES[k][lang], desc: pick(AUDIENCES[k], "intro", lang).slice(0, 110) + "…" }))
    .concat([{ to: "/audience/ministry", kicker: isRTL ? "المكون الأول" : "Component one", title: t("home.comp1_title"), desc: t("home.ministry_q1_question") }]);

  return (
    <>
      <Breadcrumb section={t("nav.target_audience")} items={[{ label: t("nav.home"), to: "/" }, { label: t("nav.target_audience"), to: "/target-audience" }, { label: GROUP_NAMES[audienceKey][lang] }]} />
      <InnerHero
        tone="light"
        image={data.image}
        kicker={pick(data, "kicker", lang)}
        titlePre={pick(data, "title_pre", lang)}
        titleEm={pick(data, "title_em", lang)}
        titlePost={pick(data, "title_post", lang)}
        intro={pick(data, "intro", lang)}
        primary={regLinks[0]}
        secondary={{ to: "#tracks", label: labels.tracks }}
      >
        <div className="bg-white border border-gray-200 p-6 md:p-7">
          <span className="text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-4 block">{labels.focus}</span>
          <ul className="flex flex-col gap-3">
            {data[`focus_${lang}`].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm font-semibold text-brand-ink leading-relaxed">
                <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </InnerHero>
      <AnchorNav
        items={[{ href: "#tracks", label: labels.tracks }, { href: "#areas", label: labels.areas }, { href: "#flow", label: labels.flow }, { href: "#related", label: labels.related }]}
        cta={regLinks[0]}
      />

      {/* المساران */}
      <section id="tracks" className="bg-white py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.tracksKicker} title={labels.tracksTitle} />
          <div className="grid md:grid-cols-2 gap-6">
            {QUALITY_TRACKS.map((track, i) => (
              <div key={track.number} className={`p-8 md:p-10 flex flex-col ${i === 0 ? "bg-brand-ink text-white" : "bg-brand-cream-hero text-brand-ink"}`}>
                <span className={`text-6xl font-black leading-none mb-6 ${i === 0 ? "text-brand-orange" : "text-brand-ink/15"}`}>{track.number}</span>
                <h3 className="text-2xl font-bold mb-3">{pick(track, "title", lang)}</h3>
                <p className={`text-sm leading-relaxed mb-6 ${i === 0 ? "text-white/70" : "text-brand-muted"}`}>{pick(track, "desc", lang)}</p>
                <ul className={`flex flex-col gap-3 border-t pt-5 ${i === 0 ? "border-white/15" : "border-brand-ink/10"}`}>
                  {track[`items_${lang}`].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm font-semibold leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-brand-orange flex-shrink-0 mt-2.5"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* مجالات الأداء */}
      <section id="areas" className="bg-gray-50 py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.areasKicker} title={labels.areasTitle} desc={labels.areasDesc} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERFORMANCE_AREAS.map((area, i) => (
              <div key={area.title_ar} className="bg-white border border-gray-200 p-7 flex flex-col gap-3">
                <span className="text-xs font-extrabold tracking-[0.1em] text-brand-orange">0{i + 1}</span>
                <h3 className="text-lg font-bold text-brand-ink">{pick(area, "title", lang)}</h3>
                <p className="text-sm leading-relaxed text-brand-muted">{pick(area, "desc", lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* تدفق البيانات */}
      <section id="flow" className="bg-brand-ink py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.flowKicker} title={labels.flowTitle} light />
          <div className="relative">
            <span className="hidden lg:block absolute top-6 start-6 end-6 h-px bg-brand-orange/50"></span>
            <div className="relative grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10">
              {DATA_FLOW.map((step, i) => (
                <div key={step.title_ar} className="flex flex-col items-start gap-4">
                  <span className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-extrabold ${i === DATA_FLOW.length - 1 ? "bg-brand-orange text-white" : "bg-brand-ink border border-brand-orange/60 text-brand-orange"}`}>0{i + 1}</span>
                  <h3 className="text-lg font-bold text-white leading-snug">{pick(step, "title", lang)}</h3>
                  <p className="text-sm text-white/65 leading-relaxed">{pick(step, "desc", lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <QuoteBand quote={labels.quote} source={labels.quoteSource} tone="light" />
      <div id="related" className="scroll-mt-28">
        <RelatedCards title={labels.relatedTitle} items={related} />
      </div>
      <CtaBand title={labels.ctaTitle} desc={labels.ctaDesc} primary={regLinks[0]} secondary={{ to: "/login", label: labels.register }} />
    </>
  );
};

// ── لوحات توضيحية للمساحات الأربع (بلا أرقام مختلقة) ──
// ✅ تُعرض الآن داخل الصفحة التفصيلية لكل مساحة (MinistrySpacePage) كمعاينة للواجهة
export const SpaceMock = ({ kind, lang }) => {
  const label = (ar, en) => (lang === "ar" ? ar : en);
  const frame = "bg-brand-ink p-5 md:p-6 shadow-[0_40px_64px_-32px_rgba(31,26,23,0.45)]";
  const tile = "bg-brand-dark-card border border-brand-dark-border";
  if (kind === "kpi") {
    return (
      <div className={frame}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="text-[12px] font-bold text-white tracking-[0.1em]">{label("لوحة الذكاء البحثي الوطني", "National research intelligence")}</span>
          <div className="flex gap-1.5">{[label("السنة", "Year"), label("الجامعة", "University"), label("المجال", "Field"), label("الجغرافيا", "Geography")].map((f) => (<span key={f} className="inline-flex items-center gap-1 text-[11px] text-white/70 border border-white/20 px-2 py-1">{f}<ChevronDown className="w-3 h-3" /></span>))}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {[[label("الباحثون النشطون", "Active researchers"), "70%", true], [label("المنشورات", "Publications"), "55%"], [label("المشاريع الممولة", "Funded projects"), "40%"], [label("تغطية الأولويات", "Priority coverage"), "62%"]].map(([k, w, strong]) => (
            <div key={k} className={`${tile} px-4 py-3.5 flex flex-col gap-2.5`}><span className="text-[11px] text-white/60">{k}</span><span className={`h-2 ${strong ? "bg-brand-orange" : "bg-brand-orange/60"}`} style={{ width: w }}></span></div>
          ))}
        </div>
        <div className="grid md:grid-cols-12 gap-3">
          <div className={`md:col-span-7 ${tile} p-4 flex flex-col gap-3`}><span className="text-[11px] text-white/60">{label("جامعة مقابل المتوسط الوطني", "University vs national average")}</span>
            <div className="flex items-end gap-2 h-[96px]">{[45, 62, 38, 80, 55, 70, 48, 66].map((h, i) => (<span key={i} className={`flex-1 ${h === 80 ? "bg-brand-orange" : "bg-white/[0.14]"}`} style={{ height: `${h}%` }}></span>))}</div>
          </div>
          <div className={`md:col-span-5 ${tile} p-4 flex flex-col gap-2.5`}><span className="text-[11px] text-white/60">{label("تنبيهات", "Alerts")}</span>
            {[label("فجوة حرجة في أولوية", "Critical priority gap"), label("مجال بحثي صاعد", "Emerging field"), label("أولوية ناقصة التمويل", "Underfunded priority"), label("نقص قدرات", "Capacity shortage")].map((a) => (<span key={a} className="flex items-center gap-2 text-xs text-white"><span className="w-1.5 h-1.5 bg-brand-orange"></span>{a}</span>))}
          </div>
        </div>
      </div>
    );
  }
  if (kind === "priorities") {
    const sectors = [[label("المياه", "Water"), 91], [label("البيئة", "Environment"), 88], [label("الصحة", "Health"), 82], [label("التعليم", "Education"), 79], [label("الطاقة", "Energy"), 76], [label("العمل والمهارات", "Labour & skills"), 74]];
    return (
      <div className={frame}>
        <div className="flex items-center justify-between mb-4"><span className="text-[12px] font-bold text-white tracking-[0.1em]">{label("الأولويات البحثية الوطنية", "National research priorities")}</span><span className="text-[11px] text-white/60">{label("مؤشر الأولوية — مثال توضيحي", "Priority index — illustrative")}</span></div>
        <div className="flex flex-col gap-2.5">
          {sectors.map(([s, v], i) => (
            <div key={s} className={`${tile} px-4 py-3 grid grid-cols-[110px_1fr_auto] items-center gap-3`}>
              <span className="text-xs font-bold text-white">{s}</span>
              <span className="h-2 bg-white/10"><span className={`block h-2 ${i === 0 ? "bg-brand-orange" : "bg-brand-orange/60"}`} style={{ width: `${v}%` }}></span></span>
              <span className="text-[11px] text-white/70 border border-white/20 px-2 py-0.5">{i < 2 ? label("تغطية منخفضة", "Low coverage") : label("تغطية متوسطة", "Medium coverage")}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">{[label("ابحث عن جامعات", "Find universities"), label("ابحث عن باحثين", "Find researchers"), label("أنشئ دعوة تمويل", "Create a funding call"), label("ابحث عن شركاء", "Find partners")].map((b) => (<span key={b} className="text-[11px] font-bold text-brand-orange border border-brand-orange/40 px-2.5 py-1">{b}</span>))}</div>
      </div>
    );
  }
  if (kind === "network") {
    const nodes = [[50, 50, true], [18, 30], [82, 26], [22, 74], [78, 76], [50, 14], [50, 88]];
    return (
      <div className={frame}>
        <div className="flex items-center justify-between mb-3"><span className="text-[12px] font-bold text-white tracking-[0.1em]">{label("شبكة الشراكات", "Partnership network")}</span><span className="text-[11px] text-white/60">{label("داخلي · إقليمي · عالمي", "National · Regional · Global")}</span></div>
        <div className={`${tile} relative h-[260px]`}>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {nodes.slice(1).map(([x, y], i) => (<line key={i} x1="50" y1="50" x2={x} y2={y} stroke="rgba(255,135,16,0.45)" strokeWidth="0.6" />))}
            <line x1="18" y1="30" x2="22" y2="74" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            <line x1="82" y1="26" x2="78" y2="76" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          </svg>
          {nodes.map(([x, y, main], i) => (
            <span key={i} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${main ? "w-8 h-8 bg-brand-orange shadow-[0_0_0_8px_rgba(255,135,16,0.15)]" : "w-4 h-4 bg-white/80"}`} style={{ left: `${x}%`, top: `${y}%` }}></span>
          ))}
          <span className="absolute bottom-3 start-3 text-[11px] text-white/60">{label("كل مطابقة تشرح سبب الاقتراح", "Every match explains why")}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">{[label("تقارب الموضوع", "Topic similarity"), label("خبرة مكمّلة", "Complementarity"), label("خدمة الأولوية", "Priority fit")].map((d) => (<span key={d} className="text-[11px] text-white/80 border border-white/20 px-2 py-1 text-center">{d}</span>))}</div>
      </div>
    );
  }
  // funding
  return (
    <div className={frame}>
      <div className="flex items-center justify-between mb-4"><span className="text-[12px] font-bold text-white tracking-[0.1em]">{label("فرص التمويل المطابقة", "Matched funding opportunities")}</span><span className="text-[11px] text-white/60">{label("درجة الملاءمة ترتيب داخلي", "Fit score is an internal ranking")}</span></div>
      <div className="flex flex-col gap-2.5">
        {[[label("برنامج وطني", "National programme"), label("فريق", "Team"), 86], [label("صندوق إقليمي عربي", "Arab regional fund"), label("جامعة", "University"), 71], [label("وكالة دولية", "International agency"), label("تحالف", "Consortium"), 58]].map(([f, a, v], i) => (
          <div key={f} className={`${tile} px-4 py-3.5 flex flex-col gap-2`}>
            <div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-white">{f}</span><span className="text-[11px] text-white/70 border border-white/20 px-2 py-0.5">{a}</span></div>
            <div className="flex items-center gap-3"><span className="flex-1 h-2 bg-white/10"><span className={`block h-2 ${i === 0 ? "bg-brand-orange" : "bg-brand-orange/60"}`} style={{ width: `${v}%` }}></span></span><span className="text-[11px] text-white/60">{label("الأهلية ✓ · موعد نهائي", "Eligible ✓ · deadline")}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ───────────────────────── 3) الوزارة — تصميم "الذكاء الوطني" ─────────────────────────
const IntelligenceLayout = ({ data, L }) => {
  const { t, lang, isRTL, ArrowIcon } = L;
  const labels = isRTL
    ? { spaces: "المساحات الأربع", policy: "رحلة القرار", principles: "القواعد", roles: "لمن", reports: "التقارير", spacesKicker: "المكون الأول — لوحات الوزارة والذكاء البحثي الوطني", spacesTitle: "أربع مساحات مستقلة وظيفيًا، مترابطة بياناتيًا.", spacesDesc: "البيانات تتحول إلى أولويات، والأولويات إلى شراكات وتمويل، ثم تنتج مشاريع ومخرجات تعود إلى قاعدة البيانات لقياس الأثر.", policyKicker: "الاستخدام الأهم", policyTitle: "من «عرض الأرقام» إلى «فهم الواقع ثم اختيار التدخل».", policyDesc: "المخرج النهائي ليس رقمًا؛ بل ملف قرار يوضح الأدلة والخيارات والمخاطر والمؤشرات التي ستُستخدم لمتابعته.", principlesKicker: "قواعد غير قابلة للتفاوض", principlesTitle: "ما الذي يضمنه النظام للوزارة.", rolesKicker: "لمن هذه الطبقة", rolesTitle: "صلاحيات بحسب الدور داخل الوزارة.", reportsKicker: "التقارير الوطنية", reportsTitle: "تقارير دورية تُبنى من الأرقام نفسها التي تراها في اللوحة.", contact: "للتواصل معنا", ctaTitle: "الخطوة التالية: مرحلة تأسيس واكتشاف تقني مشتركة.", ctaDesc: "تبدأ باعتماد لوحات الوزارة ومؤشراتها الأساسية، ثم النطاق والحوكمة والمؤسسات المشاركة.", relatedTitle: "صفحات ذات صلة", quote: "لا تجعلوا الوزارة مجرد شاشة تقارير.", quoteSource: "مواصفة طبقة الوزارة — قواعد غير قابلة للتفاوض", question: "السؤال", details: "العرض التفصيلي والمؤشرات" }
    : { spaces: "The four spaces", policy: "Decision journey", principles: "Rules", roles: "Who", reports: "Reports", spacesKicker: "Component one — Ministry dashboards & national research intelligence", spacesTitle: "Four functionally independent spaces, linked by data.", spacesDesc: "Data becomes priorities, priorities become partnerships and funding, which produce projects and outputs that return to the database to measure impact.", policyKicker: "The most important use", policyTitle: "From “showing numbers” to “understanding reality, then choosing the intervention”.", policyDesc: "The final output is not a number; it is a decision file showing evidence, options, risks and the indicators that will track the decision.", principlesKicker: "Non-negotiable rules", principlesTitle: "What the system guarantees the Ministry.", rolesKicker: "Who this layer is for", rolesTitle: "Role-based access inside the Ministry.", reportsKicker: "National reports", reportsTitle: "Periodic reports built from the same figures you see on the dashboard.", contact: "Contact us", ctaTitle: "Next step: a joint foundation and technical discovery phase.", ctaDesc: "It starts by approving the Ministry dashboards and core indicators, then scope, governance and participating institutions.", relatedTitle: "Related pages", quote: "Do not turn the Ministry into a mere reporting screen.", quoteSource: "Ministry layer specification — non-negotiable rules", question: "The question", details: "Detailed view & indicators" };

  const regLinks = registerLinks("ministry", t, isRTL);
  const related = [
    { to: "/audience/university", kicker: isRTL ? "المكون الثاني" : "Component two", title: t("home.comp2_title"), desc: t("home.comp2_desc").slice(0, 120) + "…" },
    { to: "/services", kicker: isRTL ? "المكون الثالث" : "Component three", title: t("home.comp3_title"), desc: t("home.comp3_desc").slice(0, 120) + "…" },
    { to: "/pillar/ai", kicker: isRTL ? "الركيزة 02" : "Pillar 02", title: t("home.tile2_title"), desc: t("home.tile2_desc") },
  ];

  return (
    <>
      <Breadcrumb section={t("nav.target_audience")} items={[{ label: t("nav.home"), to: "/" }, { label: t("nav.target_audience"), to: "/target-audience" }, { label: GROUP_NAMES.ministry[lang] }]} />
      <InnerHero
        image={data.image}
        kicker={pick(data, "kicker", lang)}
        titlePre={pick(data, "title_pre", lang)}
        titleEm={pick(data, "title_em", lang)}
        titlePost={pick(data, "title_post", lang)}
        intro={pick(data, "intro", lang)}
        primary={regLinks[0]}
        secondary={{ to: "#spaces", label: labels.spaces }}
      />
      <AnchorNav
        items={[{ href: "#spaces", label: labels.spaces }, { href: "#policy", label: labels.policy }, { href: "#principles", label: labels.principles }, { href: "#roles", label: labels.roles }, { href: "#reports", label: labels.reports }]}
        cta={regLinks[0]}
      />

      {/* المساحات الأربع — صفوف متناوبة نص/لوحة */}
      <section id="spaces" className="bg-white py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.spacesKicker} title={labels.spacesTitle} desc={labels.spacesDesc} />
          <div className="flex flex-col gap-16 md:gap-20">
            {MINISTRY_SPACES.map((space, i) => (
              <div key={space.number} className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                <div className={`lg:col-span-5 flex flex-col items-start ${i % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                  <span className="text-6xl font-black text-brand-cream leading-none mb-4">{space.number}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-brand-ink mb-2">{pick(space, "title", lang)}</h3>
                  <p className="text-brand-orange font-bold text-sm mb-4">{labels.question}: {pick(space, "question", lang)}</p>
                  <p className="text-[15px] leading-relaxed text-brand-muted mb-5">{pick(space, "desc", lang)}</p>
                  <ul className="flex flex-col gap-2.5">
                    {space[`items_${lang}`].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm font-semibold text-brand-ink leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/ministry-space/${space.slug}`}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-[15px] font-bold text-white hover:bg-brand-orange-dark transition-colors"
                  >
                    {labels.details}
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                </div>
                {/* ✅ أرقام حقيقية منشورة بدل اللوحة التوضيحية (اللوحة انتقلت للصفحة التفصيلية) */}
                <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                  {MINISTRY_SPACE_DETAILS[space.slug]?.summary && (
                    <HomeStatsPanel stats={MINISTRY_SPACE_DETAILS[space.slug].summary} isRTL={isRTL} />
                  )}
                  {/* ✅ المستوى الثاني (الأولويات) بلا إحصائيات — شرح مختصر مبني على أرقام المستوى الأول */}
                  {MINISTRY_SPACE_DETAILS[space.slug]?.explanation_summary && (
                    <div className="bg-brand-ink p-7 md:p-9 flex flex-col gap-5">
                      <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-orange">
                        {isRTL ? "ماذا تقول البيانات" : "What the data says"}
                      </span>
                      <ul className="flex flex-col gap-4">
                        {MINISTRY_SPACE_DETAILS[space.slug].explanation_summary[lang].map((txt) => (
                          <li key={txt} className="flex items-start gap-3 text-[15px] font-semibold text-white/85 leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-brand-orange flex-shrink-0 mt-2.5"></span>
                            {txt}
                          </li>
                        ))}
                      </ul>
                      <Link to="/ministry-space/data-intelligence#priority-indicators" className="inline-flex items-center gap-2 text-[13px] font-bold text-white hover:text-brand-orange transition-colors border-t border-white/10 pt-4">
                        {isRTL ? "الأرقام في المستوى الأول" : "Figures in level one"} <ArrowIcon className="w-3.5 h-3.5 text-brand-orange" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* رحلة القرار */}
      <section id="policy" className="bg-brand-ink py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.policyKicker} title={labels.policyTitle} desc={labels.policyDesc} light />
          <div className="relative">
            <span className="hidden lg:block absolute top-6 start-6 end-6 h-px bg-brand-orange/50"></span>
            <div className="relative grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-x-4 gap-y-8">
              {POLICY_JOURNEY.map((step, i) => (
                <div key={step.ar} className="flex flex-col items-start gap-4">
                  <span className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-extrabold ${i === 5 ? "bg-brand-orange text-white shadow-[0_0_0_8px_rgba(255,135,16,0.15)]" : "bg-brand-ink border border-brand-orange/60 text-brand-orange"}`}>0{i + 1}</span>
                  <span className={`text-[13px] font-bold leading-snug ${i === 5 ? "text-brand-orange" : "text-white"}`}>{step[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* القواعد */}
      <section id="principles" className="bg-gray-50 py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.principlesKicker} title={labels.principlesTitle} />
          <div className="grid md:grid-cols-2 gap-x-10">
            {MINISTRY_PRINCIPLES.map((p, i) => (
              <div key={p.ar} className="grid grid-cols-[40px_1fr] gap-4 py-5 border-t border-gray-200">
                <span className="text-xs font-extrabold text-brand-orange pt-1">0{i + 1}</span>
                <span className="text-[15px] font-semibold text-brand-ink leading-relaxed">{p[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الأدوار */}
      <section id="roles" className="bg-white py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.rolesKicker} title={labels.rolesTitle} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MINISTRY_ROLES.map((role) => (
              <div key={role.ar} className="bg-white border border-gray-200 p-7 flex flex-col gap-3">
                <span className="w-10 h-10 bg-brand-orange/10 flex items-center justify-center text-brand-orange"><Landmark className="w-5 h-5" strokeWidth={1.75} /></span>
                <h3 className="text-lg font-bold text-brand-ink">{role[lang]}</h3>
                <p className="text-sm leading-relaxed text-brand-muted">{pick(role, "desc", lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* التقارير */}
      <section id="reports" className="bg-brand-cream-hero py-16 md:py-20 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={labels.reportsKicker} title={labels.reportsTitle} className="mb-8" />
          <div className="flex flex-wrap gap-3">
            {MINISTRY_REPORTS.map((r) => (
              <span key={r.ar} className="bg-white border border-brand-ink/10 px-4 py-2.5 text-sm font-bold text-brand-ink">{r[lang]}</span>
            ))}
          </div>
        </div>
      </section>

      <QuoteBand quote={labels.quote} source={labels.quoteSource} />
      <RelatedCards title={labels.relatedTitle} items={related} />
      <CtaBand title={labels.ctaTitle} desc={labels.ctaDesc} primary={regLinks[0]} secondary={{ to: "/contact-us", label: labels.contact }} />
      <SourceChatbot lang={lang} page="ministry" />
    </>
  );
};

// ── أيقونات الأدوار (تُستخدم في صفحة الفئات العامة أيضًا) ──
export const AUDIENCE_ICONS = { ministry: Landmark, university: Building2, college: Award, research_center: Search, undergrad: GraduationCap, grad: GraduationCap, faculty: Users };

const AudienceDetailPage = () => {
  const { key } = useParams();
  const L = useInnerLang();

  // ✅ مفاتيح قديمة (phd / researcher) تُحوَّل إلى أقرب مرحلة
  const alias = { phd: "grad", researcher: "faculty" };
  const audienceKey = alias[key] || key;
  if (!VALID_KEYS.includes(audienceKey)) {
    return <Navigate to="/" replace />;
  }
  if (audienceKey !== key) {
    return <Navigate to={`/audience/${audienceKey}`} replace />;
  }

  const data = AUDIENCES[audienceKey];
  const group = AUDIENCE_GROUP[audienceKey];

  return (
    <div className="min-h-screen bg-white">
      {group === "journey" && <JourneyLayout audienceKey={audienceKey} data={data} L={L} />}
      {group === "quality" && <QualityLayout audienceKey={audienceKey} data={data} L={L} />}
      {group === "intelligence" && <IntelligenceLayout data={data} L={L} />}
    </div>
  );
};

export default AudienceDetailPage;
