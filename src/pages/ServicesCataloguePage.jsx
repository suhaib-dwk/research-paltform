import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, FileCheck, Search, Users, RefreshCw, Award } from "lucide-react";
import {
  SERVICE_FAMILIES,
  SERVICES_CATALOGUE,
  SERVICE_LEVELS,
  EXEC_TYPES,
  getServicesByFamily,
  getServiceLevel,
} from "../data/servicesCatalogue";

// =========================================================
// كتالوج الخدمات العام (/services) — كل خدمات الطبقة الأولى (35 خدمة) من
// دليل خدمات الباحثين، مجمّعة بعائلات العرض السبع، مع فلتر بالمرحلة
// البحثية (بكالوريوس / دراسات عليا / هيئة تدريس). نفس بطاقة قسم
// "الخدمات" بالصفحة الرئيسية بالضبط، وكل بطاقة تفتح /platform-service/:id.
// =========================================================

const FAMILY_ICONS = {
  assessment: FileCheck,
  development: Search,
  editing: FileCheck,
  review: Users,
  journal: Search,
  revision: RefreshCw,
  post: Award,
};

// ✅ صيغة العدد بالعربية: خدمة واحدة / خدمتان / 3–10 خدمات / 11+ خدمة
const countLabel = (n, isRTL) => {
  if (!isRTL) return `${n} ${n === 1 ? "service" : "services"}`;
  if (n === 1) return "خدمة واحدة";
  if (n === 2) return "خدمتان";
  if (n >= 3 && n <= 10) return `${n} خدمات`;
  return `${n} خدمة`;
};

const ServicesCataloguePage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith("ar") ?? false;
  const lang = isRTL ? "ar" : "en";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  // "all" أو أحد مفاتيح SERVICE_LEVELS (undergrad / grad / faculty)
  const [activeLevel, setActiveLevel] = useState("all");

  const levelFilters = [
    { key: "all", label: isRTL ? "كل المراحل" : "All stages" },
    ...Object.values(SERVICE_LEVELS).map((level) => ({
      key: level.key,
      label: level[`label_${lang}`],
    })),
  ];

  const matchesLevel = (service) =>
    activeLevel === "all" || getServiceLevel(service).key === activeLevel;

  const visibleCount = SERVICES_CATALOGUE.filter(matchesLevel).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* رأس الصفحة — نفس مفردات الصفحات الداخلية (كريمي، عنوان، وصف) */}
      <section className="bg-brand-cream-hero py-14 md:py-16">
        <div className="container mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-orange font-bold text-sm mb-8 transition-colors"
          >
            <BackArrow className="w-4 h-4" />
            {isRTL ? "العودة إلى الرئيسية" : "Back to home"}
          </Link>
          <span className="text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
            {isRTL ? "المكون الثالث — خدمات البحث والممكنات البحثية" : "Component three — Research services & enablers"}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-brand-ink leading-tight mb-4">
            {t("services.section_heading")}
          </h1>
          <p className="text-base leading-relaxed text-brand-muted max-w-3xl">{t("home.services_desc")}</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          {/* فلتر المرحلة البحثية */}
          <div className="flex flex-wrap items-center gap-2 mb-12">
            {levelFilters.map((filter) => {
              const isActive = filter.key === activeLevel;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveLevel(filter.key)}
                  aria-pressed={isActive}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${
                    isActive
                      ? "bg-brand-orange border-brand-orange text-white"
                      : "bg-white border-gray-200 text-brand-muted hover:text-brand-ink hover:border-brand-ink/30"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
            <span className="ms-auto text-sm text-brand-muted font-semibold">
              {countLabel(visibleCount, isRTL)}
            </span>
          </div>

          {SERVICE_FAMILIES.map((family) => {
            const services = getServicesByFamily(family.key).filter(matchesLevel);
            if (services.length === 0) return null;
            const Icon = FAMILY_ICONS[family.key] || FileCheck;
            return (
              <div key={family.key} className="mb-14 last:mb-0">
                <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-brand-ink">{family[`label_${lang}`]}</h2>
                  <span className="text-sm text-brand-muted font-semibold flex-shrink-0">
                    {countLabel(services.length, isRTL)}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.map((service) => {
                    const level = getServiceLevel(service);
                    return (
                      <Link
                        key={service.id}
                        to={`/platform-service/${service.id}`}
                        className="group w-full h-full min-h-[270px] text-start bg-white rounded-none p-7 flex flex-col border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center justify-between gap-3 mb-5">
                          <span className="w-11 h-11 bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-[22px] h-[22px] text-brand-orange" strokeWidth={1.75} />
                          </span>
                          <span className="text-[11px] font-bold text-brand-ink bg-brand-cream-hero px-2.5 py-1 leading-tight text-end">
                            {EXEC_TYPES[service.exec][`label_${lang}`]}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold tracking-[0.15em] text-brand-muted mb-1.5 block">
                          <span dir="ltr">{service.id}</span> · {level[`label_${lang}`]}
                        </span>
                        <h3 className="text-[17px] font-bold text-brand-ink mb-2">{service[`name_${lang}`]}</h3>
                        <p className="text-[13px] leading-relaxed text-brand-muted flex-1">{service[`desc_${lang}`]}</p>
                        <div className="w-9 h-9 rounded-full border border-brand-orange/40 flex items-center justify-center self-end mt-6 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300">
                          <ArrowIcon className="w-3.5 h-3.5 text-brand-orange group-hover:text-white transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <p className="mt-12 text-xs text-brand-muted leading-relaxed max-w-3xl">{t("home.services_note")}</p>
        </div>
      </section>
    </div>
  );
};

export default ServicesCataloguePage;
