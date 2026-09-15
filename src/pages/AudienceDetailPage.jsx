import { useParams, Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, ArrowRight, CheckCircle, Landmark, Building2, Award,
  FlaskConical, GraduationCap, BookOpen, Users, Microscope, Settings, Globe,
} from "lucide-react";

// =========================================================
// صفحة تفصيلية مستقلة لكل "نوع فرعي" من الفئات المستفيدة (وزارة/جامعة/
// كلية/مركز بحثي/طالب بكالوريوس/.../موظف/مقدّم خدمة) — بطلب صريح: كانت
// هذه التفاصيل تُعرض بلوحة موسّعة أسفل بطاقات القسم بنفس الصفحة الرئيسية،
// والمستخدم يريدها الآن صفحة مستقلة كاملة تُفتح عند الضغط على البطاقة،
// بدل التوسّع بنفس مكان الصفحة. تقرأ نفس بيانات الترجمة (audiences.types.*)
// المستخدمة سابقًا باللوحة الموسّعة، فلا حاجة لتكرار أي محتوى.
// =========================================================

// ✅ خريطة أيقونة لكل نوع فرعي — نفس الأيقونات المستخدمة بتعريف levelTabs
// بـ HomePage.jsx، مكرّرة هنا لأن هذه صفحة مستقلة لا تصل لذلك التعريف.
const SUBTYPE_ICONS = {
  ministry: Landmark,
  university: Building2,
  college: Award,
  research_center: FlaskConical,
  undergrad: GraduationCap,
  grad: BookOpen,
  phd: Award,
  faculty: Users,
  researcher: Microscope,
  employee: Settings,
  service_provider: Globe,
};

const VALID_KEYS = Object.keys(SUBTYPE_ICONS);

const AudienceDetailPage = () => {
  const { key } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith("ar") ?? false;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

  // ✅ مفتاح غير معروف (رابط خاطئ/قديم) → إعادة توجيه للصفحة الرئيسية بدل
  // عرض صفحة فارغة أو نصوص ترجمة مفقودة بصمت.
  if (!VALID_KEYS.includes(key)) {
    return <Navigate to="/" replace />;
  }

  const Icon = SUBTYPE_ICONS[key];
  const title = t(`roles.${key}`);
  const tagline = t(`audiences.types.${key}.tagline`);
  const details = [
    t(`audiences.types.${key}.detail1`),
    t(`audiences.types.${key}.detail2`),
    t(`audiences.types.${key}.detail3`),
    t(`audiences.types.${key}.detail4`),
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 md:py-24 max-w-4xl">
        {/* زر العودة */}
        <Link
          to="/#levels"
          className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-orange font-bold text-sm mb-10 transition-colors"
        >
          <BackArrow className="w-4 h-4" />
          {isRTL ? "العودة إلى الفئات المستفيدة" : "Back to audience levels"}
        </Link>

        {/* رأس الصفحة */}
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

        {/* نقاط التفاصيل */}
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

        {/* زر التسجيل */}
        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-brand-orange-dark transition-all duration-300"
        >
          {t("audiences.cta")}
          <ForwardArrow className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default AudienceDetailPage;
