import { useParams, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, ArrowRight, CheckCircle, Upload, TrendingUp, HandCoins, Search,
  FileCheck, PenTool, BarChart3,
} from "lucide-react";

// =========================================================
// صفحة تفصيلية مستقلة لكل "خدمة" (منصة أو ذكاء اصطناعي) — بطلب صريح: كانت
// الخدمات تُعرض كبطاقات فقط بالصفحة الرئيسية بدون أي تفاصيل إضافية عند
// الضغط عليها؛ الآن كل بطاقة تفتح صفحة كاملة تشرح الخدمة بالتفصيل، بنفس
// نمط AudienceDetailPage.jsx تمامًا لكن لقسم "خدمات المنصة/الذكاء
// الاصطناعي" بدل "الفئات المستفيدة".
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

const PlatformServiceDetailPage = () => {
  const { key } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith("ar") ?? false;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

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
              className="flex items-start gap-3 bg-white border border-gray-200 rounded-none p-6"
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
          to="/register"
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
