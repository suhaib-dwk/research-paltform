import React from "react";
import { ChevronDown, Sparkles, UserCheck } from "lucide-react";

/**
 * ArchitectureFlow
 * Visual, top-to-bottom diagram of the platform's layered technical
 * architecture — from raw research data up to continuous improvement.
 * Pure CSS boxes + connecting lines/arrows (no ASCII, no plain bullet list).
 */
export default function ArchitectureFlow({ isAr }) {
  const dataCoreChips = isAr
    ? [
        "الباحثون",
        "المنشورات",
        "المقاييس الببليومترية",
        "المشاريع والمنح",
        "التعاون",
        "البراءات والجوائز",
        "البنية التحتية",
        "الحوكمة",
        "الجودة",
        "الأثر",
      ]
    : [
        "Researchers",
        "Publications",
        "Bibliometrics",
        "Projects and Grants",
        "Collaboration",
        "Patents and Awards",
        "Infrastructure",
        "Governance",
        "Quality",
        "Impact",
      ];

  const rankingChips = ["QS", "QS Arab", "THE", "ARWU"];

  const boxBase =
    "bg-white border border-gray-200 rounded-lg px-6 py-4 shadow-sm text-center font-bold text-brand-ink";

  const DownArrow = () => (
    <div className="flex flex-col items-center">
      <div className="w-px h-8 bg-gray-300 mx-auto"></div>
      <ChevronDown className="text-brand-orange w-5 h-5 mx-auto" />
    </div>
  );

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16 md:mb-20 max-w-2xl mx-auto">
          <span className="text-brand-orange text-sm font-bold tracking-[0.3em] uppercase mb-4 block flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-brand-orange rounded-full"></span>
            {isAr ? "كيف تعمل المنصة" : "How the platform works"}
            <span className="w-8 h-[2px] bg-brand-orange rounded-full"></span>
          </span>
          <h2
            className="text-3xl md:text-4xl font-normal text-brand-ink leading-tight mb-5"
            style={{ fontFamily: "'Noto Naskh Arabic', 'Cairo', serif" }}
          >
            {isAr
              ? "من البيانات الخام إلى التميز والجاهزية"
              : "From raw data to excellence and readiness"}
          </h2>
          <p className="text-brand-muted leading-relaxed">
            {isAr
              ? "بنية طبقية واحدة تحوّل بيانات البحث العلمي المتناثرة إلى تميّز بحثي قابل للقياس، وجاهزية للاعتماد الأكاديمي، وجاهزية للتصنيف الدولي — بشفافية كاملة في كل طبقة."
              : "One layered architecture that turns scattered research data into measurable research excellence, accreditation readiness, and international ranking readiness — with full transparency at every layer."}
          </p>
        </div>

        {/* Diagram */}
        <div className="flex flex-col items-center">
          {/* 1. University Research Profile */}
          <div className={`${boxBase} max-w-md mx-auto w-full`}>
            {isAr ? "الملف البحثي للجامعة" : "University Research Profile"}
          </div>

          <DownArrow />

          {/* 3. Research Data Core */}
          <div className={`${boxBase} max-w-2xl mx-auto w-full`}>
            <div className="mb-3">
              {isAr ? "نواة بيانات البحث العلمي" : "Research Data Core"}
            </div>
            <div className="flex flex-wrap justify-center gap-2 font-normal">
              {dataCoreChips.map((label, i) => (
                <span
                  key={i}
                  className="rounded-full bg-brand-cream text-xs px-3 py-1 text-brand-ink"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <DownArrow />

          {/* 5. Evidence Core + Data Quality */}
          <div className={`${boxBase} max-w-md mx-auto w-full`}>
            {isAr ? "نواة الأدلة وجودة البيانات" : "Evidence Core & Data Quality"}
          </div>

          <DownArrow />

          {/* 6. Three branches */}
          <div className="w-full max-w-4xl mx-auto">
            {/* Connector visual — desktop only */}
            <div className="hidden md:block relative h-6">
              <div className="absolute top-0 left-[8%] right-[8%] border-t border-gray-300"></div>
              <div className="absolute top-0 left-[16.66%] w-px h-6 bg-gray-300"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-gray-300"></div>
              <div className="absolute top-0 right-[16.66%] w-px h-6 bg-gray-300"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
              {/* Research Excellence Engine */}
              <div className={`${boxBase} flex-1 w-full`}>
                {isAr ? "محرك التميز البحثي" : "Research Excellence Engine"}
              </div>

              {/* Research Accreditation Engine */}
              <div className={`${boxBase} flex-1 w-full`}>
                <div>
                  {isAr
                    ? "محرك جاهزية الاعتماد"
                    : "Research Accreditation Engine"}
                </div>
                <div className="mt-2 text-xs font-normal text-brand-muted">
                  QAS · National · Future
                </div>
              </div>

              {/* Research Ranking Engine */}
              <div className={`${boxBase} flex-1 w-full`}>
                <div>
                  {isAr ? "محرك جاهزية التصنيف" : "Research Ranking Engine"}
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-2 font-normal">
                  {rankingChips.map((label, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-brand-cream text-xs px-3 py-1 text-brand-ink"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DownArrow />

          {/* 7. AI Insight + Gap + Opportunity */}
          <div
            className={`${boxBase} max-w-md mx-auto w-full flex items-center justify-center gap-2`}
          >
            <Sparkles className="w-4 h-4 text-brand-orange shrink-0" />
            <span>
              {isAr
                ? "رؤى الذكاء الاصطناعي والفجوات والفرص"
                : "AI Insight, Gap & Opportunity"}
            </span>
          </div>

          <DownArrow />

          {/* 8. Expert Review */}
          <div
            className={`${boxBase} max-w-md mx-auto w-full flex items-center justify-center gap-2`}
          >
            <UserCheck className="w-4 h-4 text-brand-orange shrink-0" />
            <span>{isAr ? "مراجعة الخبراء" : "Expert Review"}</span>
          </div>

          <DownArrow />

          {/* 9. Improvement Plan and Reassessment */}
          <div className="max-w-md mx-auto w-full flex flex-col items-center">
            <div className="bg-brand-orange/10 border-2 border-brand-orange rounded-lg px-6 py-4 shadow-sm text-center font-bold text-brand-ink w-full">
              {isAr ? "خطة التحسين وإعادة التقييم" : "Improvement Plan & Reassessment"}
            </div>
            <div className="mt-3 text-xs text-brand-orange font-bold">
              {isAr ? "↻ دورة تحسين مستمرة" : "↻ Continuous improvement cycle"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
