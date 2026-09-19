import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// =========================================================
// تدرّج خلفيات الأقسام في الصفحات الداخلية: أبيض → رمادي → أسود ثم يتكرر.
// يمرّ على الأقسام العليا داخل <main> بالترتيب (بعد الهيرو — أول قسم) ويضع لكل قسم
// data-cycle = white | gray | black. الألوان وقلب لون النص في src/index.css
// (قسم «تدرّج خلفيات الأقسام»). يُعاد الحساب عند تغيّر الصفحة أو محتواها.
// =========================================================

const CYCLE = ["white", "gray", "black"];

const apply = () => {
  const main = document.querySelector("main");
  if (!main) return;
  // الأقسام العليا فقط (ليست داخل قسم آخر) وليست داخل نافذة منبثقة
  const sections = [...main.querySelectorAll("section")].filter(
    (s) => !s.parentElement.closest("section") && !s.closest('[role="dialog"]'),
  );
  sections.forEach((s, i) => {
    if (i === 0) { s.removeAttribute("data-cycle"); return; } // الهيرو كما هو
    const c = CYCLE[(i - 1) % CYCLE.length];
    if (s.getAttribute("data-cycle") !== c) s.setAttribute("data-cycle", c);
  });
};

const SectionCycle = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    apply();
    const main = document.querySelector("main");
    if (!main) return undefined;
    let raf;
    const obs = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); });
    obs.observe(main, { childList: true, subtree: true });
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [pathname]);
  return null;
};

export default SectionCycle;
