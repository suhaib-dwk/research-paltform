import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

// =========================================================
// أكورديون الركائز — شرائح صور رأسية متجاورة، الشريحة النشطة تتمدد بانيميشن
// (flex-grow) وتكشف العنوان والشرح فوق تدرّج داكن، والشرائح المطوية تُظهر
// رقمها فقط (01 · 02 · 03 · 04). التنقل بالمرور أو النقر (يعمل على اللمس).
// items: [{ key, image, title, desc }] — كل شريحة تفتح صفحة الركيزة /pillar/:key
// =========================================================
const PillarsAccordion = ({ items, isRTL, moreLabel }) => {
  const [active, setActive] = useState(0);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="relative flex flex-col md:flex-row gap-1.5 h-[560px] md:h-[460px]">
      {items.map((item, i) => {
        const open = i === active;
        const number = `0${i + 1}`;
        return (
          <div
            key={item.key}
            role="button"
            tabIndex={0}
            aria-expanded={open}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className="relative overflow-hidden cursor-pointer basis-0 min-h-0 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-brand-ink"
            style={{ flexGrow: open ? 3.4 : 1 }}
          >
            <img
              src={item.image}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out ${open ? "scale-100" : "scale-110"}`}
            />
            {/* تدرّج داكن أقوى على الشريحة النشطة لقراءة النص */}
            <div className={`absolute inset-0 transition-opacity duration-700 ${open ? "bg-gradient-to-t from-brand-ink via-brand-ink/45 to-brand-ink/5" : "bg-gradient-to-t from-brand-ink/85 via-brand-ink/35 to-brand-ink/25"}`} />

            {/* رقم الشريحة المطوية */}
            <span
              className={`absolute inset-x-0 bottom-5 md:bottom-6 text-center text-3xl md:text-[40px] font-bold leading-none text-brand-orange transition-all duration-500 ${open ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}
            >
              {number}
            </span>

            {/* محتوى الشريحة النشطة */}
            <div
              className={`absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col items-start text-start transition-all duration-500 delay-150 ${
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
              }`}
            >
              <span className="text-brand-orange text-xs font-bold tracking-[0.25em] mb-2">{number}</span>
              <h3 className="text-2xl md:text-[28px] font-bold text-white leading-snug mb-2.5">{item.title}</h3>
              <p className="text-sm md:text-[15px] leading-relaxed text-white/85 max-w-md mb-4">{item.desc}</p>
              <Link
                to={`/pillar/${item.key}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-brand-orange transition-colors"
              >
                {moreLabel}
                <span className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
                  <ArrowIcon className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PillarsAccordion;
