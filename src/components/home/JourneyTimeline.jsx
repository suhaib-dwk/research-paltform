import React from "react";

const MILESTONES = [
  {
    title: { ar: "تسجيل الجامعة", en: "University Onboarding" },
    desc: {
      ar: "إنشاء الملف البحثي للجامعة وربط وحداتها الأكاديمية",
      en: "Creating the university's research profile and connecting its academic units",
    },
  },
  {
    title: { ar: "بناء قاعدة البيانات البحثية", en: "Research Data Core" },
    desc: {
      ar: "استيراد وتوحيد بيانات الباحثين والمنشورات والمشاريع",
      en: "Importing and unifying researcher, publication, and project data",
    },
  },
  {
    title: { ar: "توثيق الأدلة", en: "Evidence and Verification" },
    desc: {
      ar: "رفع الأدلة وربطها بالمتطلبات، تحقق آلي وبشري",
      en: "Uploading evidence and linking it to requirements, with automated and human verification",
    },
  },
  {
    title: { ar: "اختيار الأطر", en: "Framework Selection" },
    desc: {
      ar: "تفعيل أطر التميز، الاعتماد، والتصنيف المطلوبة",
      en: "Activating the required excellence, accreditation, and ranking frameworks",
    },
  },
  {
    title: { ar: "التحليل الذكي", en: "AI-Powered Analysis" },
    desc: {
      ar: "مطابقة ذكية، اكتشاف الفجوات والفرص، مراجعة خبراء عند الحاجة",
      en: "Smart matching, gap and opportunity discovery, expert review when needed",
    },
  },
  {
    title: { ar: "خطة التحسين", en: "Continuous Improvement" },
    desc: {
      ar: "إجراءات تحسين متابَعة، إعادة تقييم دورية، تتبع التقدم عبر الزمن",
      en: "Tracked improvement actions, periodic re-assessment, and progress tracking over time",
    },
  },
];

export default function JourneyTimeline({ isAr }) {
  return (
    <section className="bg-brand-cream-hero py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="text-brand-orange text-sm font-bold tracking-[0.3em] uppercase mb-6 block flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-brand-orange rounded-full"></span>
            {isAr ? "رحلة الجامعة" : "The University Journey"}
            <span className="w-8 h-[2px] bg-brand-orange rounded-full"></span>
          </span>
          <h2
            className="text-3xl md:text-4xl font-normal text-brand-ink leading-tight"
            style={{ fontFamily: "var(--font-ar)" }}
          >
            {isAr
              ? "المسار من التسجيل إلى التميز المستمر"
              : "The Path From Registration to Continuous Excellence"}
          </h2>
          <p className="text-sm md:text-base text-brand-muted mt-4 leading-relaxed">
            {isAr
              ? "خطوات واضحة تقود الجامعة من الانضمام إلى المنصة وحتى تحقيق تحسّن بحثي مستدام وقابل للقياس"
              : "Clear steps that guide the university from joining the platform to achieving sustainable, measurable research improvement"}
          </p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:flex justify-between relative">
          <div
            className="absolute h-0.5 bg-gray-300 z-0"
            style={{ top: "24px", insetInlineStart: "6%", insetInlineEnd: "6%" }}
          ></div>

          {MILESTONES.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center text-center px-2"
              style={{ width: `${100 / MILESTONES.length}%` }}
            >
              <div className="w-12 h-12 rounded-full bg-white border-2 border-brand-orange text-brand-orange font-bold flex items-center justify-center mb-5 shrink-0">
                {index + 1}
              </div>
              <h3 className="text-sm md:text-base font-bold text-brand-ink mb-2">
                {isAr ? step.title.ar : step.title.en}
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed max-w-[180px]">
                {isAr ? step.desc.ar : step.desc.en}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: vertical timeline */}
        <div className="flex lg:hidden flex-col gap-8 relative">
          <div
            className="absolute w-0.5 bg-gray-300 z-0 top-2 bottom-2"
            style={{ insetInlineStart: "23px" }}
          ></div>

          {MILESTONES.map((step, index) => (
            <div key={index} className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-brand-orange text-brand-orange font-bold flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <div className="pt-2">
                <h3 className="text-sm md:text-base font-bold text-brand-ink mb-1.5">
                  {isAr ? step.title.ar : step.title.en}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {isAr ? step.desc.ar : step.desc.en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
