import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Landmark,
  Building2,
  GraduationCap,
  UserCog,
} from "lucide-react";

export default function HeroElsevier({ isAr }) {
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const quickLinks = [
    { icon: Landmark, label: isAr ? "الوزارة" : "Ministry" },
    { icon: Building2, label: isAr ? "الجامعات" : "Universities" },
    { icon: GraduationCap, label: isAr ? "الباحثون" : "Researchers" },
    { icon: UserCog, label: isAr ? "الموظفون" : "Staff" },
  ];

  return (
    <section className="relative isolate">
      {/* Hero */}
      <div className="relative min-h-[600px] md:min-h-[85vh] w-full overflow-hidden bg-brand-ink">
        {/* Background image */}
        <img
          src="/Home/home05.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover brightness-[0.35]"
        />

        {/* Decorative geometric overlay squares */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 end-10 h-24 w-24 bg-brand-orange/20" />
          <div className="absolute top-1/3 end-1/4 h-16 w-40 bg-white/5" />
          <div className="absolute bottom-24 end-16 h-32 w-32 bg-brand-orange/10" />
          <div className="absolute top-1/4 end-[8%] h-10 w-10 bg-brand-orange/20" />
          <div className="absolute bottom-10 end-1/3 h-20 w-20 bg-white/5" />
          <div className="absolute top-1/2 end-[5%] h-14 w-56 bg-brand-orange/10" />
        </div>

        {/* Foreground content */}
        <div className="relative z-10 flex h-full min-h-[600px] md:min-h-[85vh] w-full flex-col items-start justify-end px-6 pb-16 pt-24 md:px-16 md:pb-24">
          <h1
            className="max-w-3xl text-4xl font-normal leading-tight text-white md:text-6xl"
            style={{ fontFamily: "'Noto Naskh Arabic', 'Cairo', serif" }}
          >
            {isAr ? (
              <>
                أنت و <span className="italic text-brand-orange">مستقبل البحث العلمي</span> في العراق
              </>
            ) : (
              <>
                You & Iraq's <span className="italic text-brand-orange">next research breakthrough</span>
              </>
            )}
          </h1>

          <p className="mt-6 max-w-xl text-lg font-normal text-gray-300">
            {isAr
              ? "المنصة الوطنية العراقية للتميز البحثي، والجاهزية للاعتماد الأكاديمي، والاستعداد للتصنيفات العالمية."
              : "Iraq's national platform for research excellence, accreditation readiness, and global ranking readiness."}
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center rounded-full bg-brand-orange px-6 py-3 font-bold text-white transition-colors hover:bg-brand-orange-dark"
          >
            {isAr ? "ابدأ الآن" : "Get Started"}
            <Arrow className="ms-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Quick-link strip */}
      <div className="border-t border-white/10 bg-brand-dark-card px-6 py-4">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-6 md:justify-start md:gap-10">
          {quickLinks.map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#levels"
              className="flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-300 transition-colors hover:text-brand-orange"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
