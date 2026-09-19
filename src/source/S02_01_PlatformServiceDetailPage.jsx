import { useParams, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, ArrowRight, CheckCircle, Upload, TrendingUp, HandCoins, Search,
  FileCheck, PenTool, BarChart3, Sparkles, Users, Workflow,
} from "lucide-react";
import { getServiceById, getServiceLevel, EXEC_TYPES, SERVICE_FAMILIES, getExecLabel } from "./S02_Services/servicesCatalogue";
import useBackClick from "./shared/useBackClick";

// =========================================================
// صفحة تفصيلية مستقلة لكل "خدمة" (منصة أو ذكاء اصطناعي) — بطلب صريح: كانت
// الخدمات تُعرض كبطاقات فقط بالصفحة الرئيسية بدون أي تفاصيل إضافية عند
// الضغط عليها؛ الآن كل بطاقة تفتح صفحة كاملة تشرح الخدمة بالتفصيل، بنفس
// نمط AudienceDetailPage.jsx تمامًا لكن لقسم "خدمات المنصة/الذكاء
// الاصطناعي" بدل "الفئات المستفيدة".
//
// ✅ تُغطّي الصفحة الآن مسارين بنفس الرابط /platform-service/:key:
//   1) المفاتيح القديمة السبع (submit_research… ai_gap_insights) من i18n.
//   2) خدمات كتالوج الباحثين الـ35 (U01…F12) من src/source/S02_Services/servicesCatalogue.js
//      — تعرض التعريف، وكيف يحصل عليها المستخدم، والمدخلات، والمخرجات،
//      ونوع التنفيذ، والتنبيه الأخلاقي (قاعدة عرض الخدمة، القسم 2 بالدليل).
// =========================================================

const SERVICE_ICONS = {
  submit_research: Upload,
  track_status: TrendingUp,
  funding: HandCoins,
  collaboration: Search,
  ai_evidence_match: FileCheck,
  ai_writing_assistant: PenTool,
  ai_gap_insights: BarChart3,
};

const VALID_KEYS = Object.keys(SERVICE_ICONS);

const EXEC_ICONS = {
  ai: Sparkles,
  human: Users,
  hybrid: Sparkles,
  workflow: Workflow,
};

// ✅ عرض خدمة من كتالوج الباحثين (U/P/F)
const CatalogueServiceDetail = ({ service, isRTL }) => {
  const lang = isRTL ? "ar" : "en";
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const onBack = useBackClick(); // الرجوع لمكان الضغط بالضبط
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;
  const level = getServiceLevel(service);
  const family = SERVICE_FAMILIES.find((f) => f.key === service.family);
  const exec = EXEC_TYPES[service.exec];
  const ExecIcon = EXEC_ICONS[service.exec] || Sparkles;

  const labels = isRTL
    ? {
        back: "العودة إلى الخدمات",
        how: "كيف يحصل عليها المستخدم",
        inputs: "ما الذي يقدمه المستخدم",
        outputs: "المخرجات",
        exec: "نوع التنفيذ في سورس",
        level: "الفئة المستهدفة",
        family: "العائلة",
        ethics: "الذكاء الاصطناعي مساعد، والقرار الأكاديمي النهائي يبقى للباحث أو الجهة الأكاديمية. لا تضمن سورس قبول البحث في أي مجلة — قرار القبول للمجلة وهيئة التحرير.",
        cta: "ابدأ الخدمة",
        all: "كل الخدمات",
      }
    : {
        back: "Back to services",
        how: "How the user gets it",
        inputs: "What the user provides",
        outputs: "Outputs",
        exec: "Delivery in SOURCE",
        level: "Target group",
        family: "Family",
        ethics: "AI is assistive; the final academic decision remains with the researcher or academic body. SOURCE does not guarantee acceptance in any journal — that decision belongs to the journal and its editorial board.",
        cta: "Start the service",
        all: "All services",
      };

  // ✅ القوائم التفصيلية (كيف/المدخلات/المخرجات) موجودة بالعربية في الدليل
  // فقط؛ بالإنجليزية تُعرض الأقسام العامة (الاسم، الوصف، نوع التنفيذ).
  const showLists = isRTL;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 md:py-24 max-w-4xl">
        <Link
          to="/services"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-orange font-bold text-sm mb-10 transition-colors"
        >
          <BackArrow className="w-4 h-4" />
          {labels.back}
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-[11px] font-bold tracking-[0.15em] text-brand-muted border border-gray-200 px-2.5 py-1" dir="ltr">
            {service.id}
          </span>
          <span className="text-[11px] font-bold text-brand-ink bg-brand-cream-hero px-2.5 py-1">
            {labels.level}: {level[`label_${lang}`]}
          </span>
          {family && (
            <span className="text-[11px] font-bold text-brand-ink bg-gray-100 px-2.5 py-1">
              {labels.family}: {family[`label_${lang}`]}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-brand-ink leading-tight mb-3">
          {service[`name_${lang}`]}
        </h1>
        {lang === "ar" && (
          <p className="text-sm font-semibold text-brand-muted mb-5" dir="ltr">
            {service.name_en}
          </p>
        )}
        <p className="text-base md:text-lg leading-relaxed text-brand-muted mb-10 max-w-3xl">
          {service[`desc_${lang}`]}
        </p>

        {/* نوع التنفيذ — يجب أن يظهر بوضوح متى تتطلب الخدمة خبيرًا بشريًا */}
        <div className="flex items-start gap-4 bg-brand-ink text-white p-6 mb-10">
          <span className="w-11 h-11 bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center flex-shrink-0">
            <ExecIcon className="w-5 h-5 text-brand-orange" strokeWidth={1.75} />
          </span>
          <div>
            <span className="text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-1 block">
              {labels.exec}
            </span>
            <span className="text-lg font-bold">{getExecLabel(service, lang)}</span>
          </div>
        </div>

        {showLists && (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="rounded-2xl md:col-span-2 bg-white border-2 border-gray-200 p-6 overflow-hidden">
              <h2 className="text-base font-bold text-brand-ink mb-4">{labels.how}</h2>
              <ol className="flex flex-col gap-3">
                {service.how_ar.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-brand-ink font-medium leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl bg-white border-2 border-gray-200 p-6 overflow-hidden">
              <h2 className="text-base font-bold text-brand-ink mb-4">{labels.inputs}</h2>
              <ul className="flex flex-col gap-2.5">
                {service.inputs_ar.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-brand-ink font-medium leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-brand-orange flex-shrink-0 mt-2.5"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white border-2 border-gray-200 p-6 overflow-hidden">
              <h2 className="text-base font-bold text-brand-ink mb-4">{labels.outputs}</h2>
              <ul className="flex flex-col gap-2.5">
                {service.outputs_ar.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-brand-ink font-medium leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <p className="text-xs leading-relaxed text-brand-muted border-t border-gray-200 pt-5 mb-8">{labels.ethics}</p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-brand-orange-dark transition-all duration-300"
          >
            {labels.cta}
            <ForwardArrow className="w-4 h-4" />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand-ink border border-brand-ink/15 px-7 py-3.5 rounded-full font-medium text-sm hover:border-brand-ink/30 transition-all duration-300"
          >
            {labels.all}
          </Link>
        </div>
      </div>
    </div>
  );
};

const PlatformServiceDetailPage = () => {
  const { key } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith("ar") ?? false;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const onBack = useBackClick(); // الرجوع لمكان الضغط بالضبط
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

  // ✅ خدمات كتالوج الباحثين (U01…F12) لها عرضها الخاص
  const catalogueService = getServiceById(key);
  if (catalogueService) {
    return <CatalogueServiceDetail service={catalogueService} isRTL={isRTL} />;
  }

  if (!VALID_KEYS.includes(key)) {
    return <Navigate to="/" replace />;
  }

  const Icon = SERVICE_ICONS[key];
  const isAiKey = key.startsWith("ai_");
  // ✅ للخدمات الأربع الأولى: العنوان/الوصف من services.<key>/services.<key>_desc
  // (نفس النصوص المعروضة بالبطاقة بالصفحة الرئيسية). لخدمات الذكاء الاصطناعي
  // الثلاث: من services.types.<key>.title/desc (لا مفاتيح مستقلة لها).
  const title = isAiKey ? t(`services.types.${key}.title`) : t(`services.${key}`);
  const tagline = t(`services.types.${key}.tagline`);
  const details = [
    t(`services.types.${key}.detail1`),
    t(`services.types.${key}.detail2`),
    t(`services.types.${key}.detail3`),
    t(`services.types.${key}.detail4`),
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 md:py-24 max-w-4xl">
        <Link
          to="/#services"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-orange font-bold text-sm mb-10 transition-colors"
        >
          <BackArrow className="w-4 h-4" />
          {isRTL ? "العودة إلى الخدمات" : "Back to services"}
        </Link>

        <div className="flex items-start gap-5 mb-10">
          <div className="w-16 h-16 rounded-none bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-8 h-8 text-brand-orange" strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
              {title}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-brand-ink leading-tight">
              {tagline}
            </h1>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {details.map((detail, i) => (
            <div
              key={i}
              className="rounded-2xl flex items-start gap-3 bg-white border-2 border-gray-200 p-6 overflow-hidden"
            >
              <span className="w-7 h-7 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-brand-orange" strokeWidth={2.5} />
              </span>
              <span className="text-sm text-brand-ink font-medium leading-relaxed">
                {detail}
              </span>
            </div>
          ))}
        </div>

        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-brand-orange-dark transition-all duration-300"
        >
          {t("services.cta")}
          <ForwardArrow className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default PlatformServiceDetailPage;
