import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

// =========================================================
// أكورديون الطبقات — بأسلوب بطاقات Elsevier (Academic & Government / Health /
// Industry): بطاقات بيضاء متجاورة، العنوان أعلى كل بطاقة، والصورة ليست خلفية
// بل عنصر فني مقصوص إلى شرائح مائلة (chevron): شرائح أفقية أسفل البطاقة
// المطوية، وشرائح رأسية بجانب النص في البطاقة الممددة. لا شريحة مفتوحة في
// البداية؛ التمدد عند المرور/النقر ويعود للإغلاق عند الخروج.
// items: [{ key, image, title, desc }] — كل بطاقة تفتح /pillar/:key
// =========================================================

// شرائح صورة متصلة (الصورة واحدة تمتد عبر كل الشرائح) مع فجوات وقصّ مائل متناوب — للبطاقة الممددة فقط
const ImageStrips = ({ image, count = 4, gap = 3, direction = "v" }) => {
  const size = 100 / count; // حصة كل شريحة بالنسبة المئوية (مع الفجوة)
  const inner = size - gap; // عرض/ارتفاع الشريحة الفعلي
  return (
    <div className="absolute inset-0">
      {Array.from({ length: count }).map((_, i) => {
        const offset = i * size;
        const clip = direction === "v"
          ? (i % 2 === 0 ? "polygon(0 0, 100% 9%, 100% 91%, 0 100%)" : "polygon(0 9%, 100% 0, 100% 100%, 0 91%)")
          : (i % 2 === 0 ? "polygon(0 0, 100% 14%, 100% 100%, 0 86%)" : "polygon(0 14%, 100% 0, 100% 86%, 0 100%)");
        const box = direction === "v"
          ? { left: `${offset}%`, width: `${inner}%`, top: 0, bottom: 0 }
          : { top: `${offset}%`, height: `${inner}%`, left: 0, right: 0 };
        const img = direction === "v"
          ? { left: `${(-offset / inner) * 100}%`, width: `${(100 / inner) * 100}%`, height: "100%" }
          : { top: `${(-offset / inner) * 100}%`, height: `${(100 / inner) * 100}%`, width: "100%" };
        return (
          <div key={i} className="absolute overflow-hidden" style={{ ...box, clipPath: clip }}>
            <img src={image} alt="" className="absolute object-cover max-w-none" style={img} />
          </div>
        );
      })}
    </div>
  );
};

const PillarsAccordion = ({ items, isRTL, moreLabel }) => {
  const [active, setActive] = useState(null);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="relative flex flex-col md:flex-row gap-3 h-[720px] md:h-[460px]" onMouseLeave={() => setActive(null)}>
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
            onClick={() => setActive((cur) => (cur === i ? null : i))}
            className={`relative overflow-hidden cursor-pointer basis-0 min-h-0 bg-white border transition-[flex-grow,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "border-brand-orange/40 shadow-[0_24px_50px_-30px_rgba(36,27,20,0.35)]" : "border-gray-200 hover:border-brand-orange/40"
            }`}
            style={{ flexGrow: open ? 3.4 : 1 }}
          >
            {/* ── البطاقة المطوية: العنوان أعلى + شرائح أفقية من الصورة أسفل ── */}
            <div className={`absolute inset-0 flex flex-col transition-opacity duration-500 ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <div className="p-5 md:p-6">
                <span className="text-brand-orange text-xs font-bold tracking-[0.25em] block mb-2">{number}</span>
                <h3 className="text-base md:text-lg font-bold text-brand-ink leading-snug">{item.title}</h3>
              </div>
              {/* الصورة عادية (بلا تقطيع) في الحالة المطوية — التقطيع يظهر عند التمدد فقط */}
              <div className="relative flex-1 mx-3 mb-3 overflow-hidden">
                <img src={item.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>

            {/* ── البطاقة الممددة: نص في جهة + شرائح رأسية (chevron) من الصورة في الجهة الأخرى ── */}
            <div className={`absolute inset-0 grid md:grid-cols-12 transition-opacity duration-500 delay-150 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <div className="md:col-span-6 p-6 md:p-8 flex flex-col items-start text-start">
                <span className="text-brand-orange text-xs font-bold tracking-[0.25em] mb-3">{number}</span>
                <h3 className="text-2xl md:text-[28px] font-bold text-brand-ink leading-snug mb-3">{item.title}</h3>
                <p className="text-sm md:text-[15px] leading-relaxed text-brand-muted mb-5">{item.desc}</p>
                <Link
                  to={`/pillar/${item.key}`}
                  onClick={(e) => e.stopPropagation()}
                  className="group inline-flex items-center gap-2 text-sm font-bold text-brand-ink hover:text-brand-orange transition-colors"
                >
                  {moreLabel}
                  <span className="w-9 h-9 rounded-full border border-brand-orange/40 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
              <div className="relative hidden md:block md:col-span-6 m-4 ms-0">
                <ImageStrips image={item.image} count={4} gap={3} direction="v" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PillarsAccordion;
