import { useEffect, useLayoutEffect, useRef, useState } from "react";

// =========================================================
// خطوات مرقّمة متحركة بأسلوب «الرحلة البحثية» في الرئيسية (بطلب صريح):
// خط تقدّم ونقطة متحركة وإضاءة الخطوات بالتتابع — بالأبيض فوق الأقسام الداكنة،
// وبالبرتقالي (كالرئيسية) إن صار القسم فاتحًا (SectionCycle يبدّل خلفيات الأقسام).
//  • تعمل فقط عندما تكون الخطوات ظاهرة على الشاشة، وتحترم «تقليل الحركة».
//  • الخط والنقطة يُقاسان من مواقع الدوائر الفعلية، فتقف النقطة على كل دائرة بدقة
//    (عربي/إنجليزي، أي عدد أعمدة)، ويختفيان إذا التفّت الخطوات لأكثر من سطر (الجوال).
// الاستخدام:
//   <AnimatedSteps items={steps} cols="gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5"
//     title={(s) => …} desc={(s) => …} extra={(s) => …} />
// =========================================================

const STEP_MS = 1300;

const THEMES = {
  dark: {
    track: "bg-white/25",
    fill: "bg-white",
    dot: "bg-white ring-4 ring-white/25 shadow-[0_0_0_8px_rgba(255,255,255,0.12)]",
    lit: "bg-white text-brand-ink",
    now: "scale-110 shadow-[0_10px_28px_-8px_rgba(255,255,255,0.75)]",
    idle: "bg-brand-ink border border-white/40 text-white",
    titleNow: "text-white", titleLit: "text-white", titleIdle: "text-white/60",
    descLit: "text-white/80", descIdle: "text-white/50",
  },
  light: {
    track: "bg-brand-orange/25",
    fill: "bg-brand-orange",
    dot: "bg-brand-orange ring-4 ring-brand-orange/25 shadow-[0_0_0_8px_rgba(255,135,16,0.12)]",
    lit: "bg-brand-orange text-white",
    now: "scale-110 shadow-[0_10px_24px_-8px_rgba(255,135,16,0.7)]",
    idle: "bg-white border border-brand-orange/50 text-brand-orange",
    titleNow: "text-brand-orange", titleLit: "text-brand-ink", titleIdle: "text-brand-ink/60",
    descLit: "text-brand-muted", descIdle: "text-brand-muted/70",
  },
};

// لون خلفية القسم الفعلي (بعد SectionCycle): داكن أم فاتح؟
const sectionIsDark = (el) => {
  const section = el?.closest("section");
  if (!section) return true;
  const [r, g, b, a = 1] = (getComputedStyle(section).backgroundColor.match(/[\d.]+/g) || []).map(Number);
  if (r === undefined || a === 0) return true;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
};

const AnimatedSteps = ({ items, cols, title, desc, extra, titleClass = "text-lg" }) => {
  const ref = useRef(null);
  const n = items.length;
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [step, setStep] = useState(reduce ? n : 0); // عدد الخطوات المضاءة (0 = بداية الدورة)
  const [running, setRunning] = useState(false);
  const [dark, setDark] = useState(true);
  const [geo, setGeo] = useState(null); // مراكز الدوائر بالبكسل داخل الحاوية، أو null إن التفّت

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return undefined;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setStep((cur) => (cur >= n ? 0 : cur + 1)), STEP_MS);
    return () => clearInterval(id);
  }, [running, n]);

  // لون القسم قد يتغيّر بعد الرسم (SectionCycle يضع data-cycle) — نراقبه
  useEffect(() => {
    const section = ref.current?.closest("section");
    const check = () => setDark(sectionIsDark(ref.current));
    check();
    if (!section) return undefined;
    const mo = new MutationObserver(check);
    mo.observe(section, { attributes: true, attributeFilter: ["data-cycle", "class"] });
    return () => mo.disconnect();
  }, []);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const measure = () => {
      const box = root.getBoundingClientRect();
      const circles = [...root.querySelectorAll("[data-step-circle]")].map((c) => c.getBoundingClientRect());
      const cy = (r) => r.top + r.height / 2;
      const oneRow = circles.length > 1 && circles.every((r) => Math.abs(cy(r) - cy(circles[0])) < 2);
      setGeo(oneRow ? { xs: circles.map((r) => r.left - box.left + r.width / 2), y: cy(circles[0]) - box.top } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [n]);

  const T = dark ? THEMES.dark : THEMES.light;
  const xFirst = geo?.xs[0];
  const xLast = geo?.xs[n - 1];
  const xNow = geo?.xs[Math.max(0, step - 1)];

  return (
    <div ref={ref} className="relative">
      {/* الخط الأساسي + خط التقدّم + النقطة المتحركة — تحت الدوائر فلا تغطي أرقامها */}
      {geo && (
        <>
          <span className={`absolute h-px ${T.track}`} style={{ top: geo.y, left: Math.min(xFirst, xLast), width: Math.abs(xLast - xFirst) }}></span>
          <span
            className={`absolute h-[3px] -mt-px rounded-full ${T.fill} transition-[left,width] duration-700 ease-out`}
            style={{ top: geo.y, left: Math.min(xFirst, xNow), width: Math.abs(xNow - xFirst) }}
          ></span>
          <span
            className={`absolute w-4 h-4 -mt-2 -ml-2 rounded-full ${T.dot} transition-[left] duration-700 ease-out`}
            style={{ top: geo.y, left: xNow }}
          ></span>
        </>
      )}
      <div className={`relative grid ${cols}`}>
        {items.map((item, i) => {
          const lit = i <= step - 1;
          const isNow = i === step - 1;
          return (
            <div key={i} className="flex flex-col items-start gap-4">
              <span
                data-step-circle
                className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-extrabold transition-all duration-500 ${lit ? `${T.lit} ${isNow ? T.now : ""}` : T.idle}`}
              >
                0{i + 1}
              </span>
              <h3 className={`${titleClass} font-bold leading-snug transition-colors duration-500 ${isNow ? T.titleNow : lit ? T.titleLit : T.titleIdle}`}>{title(item)}</h3>
              {desc && <p className={`text-sm leading-relaxed transition-colors duration-500 ${lit ? T.descLit : T.descIdle}`}>{desc(item)}</p>}
              {extra?.(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedSteps;
