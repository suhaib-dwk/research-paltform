import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// =========================================================
// إدارة التمرير بين الصفحات:
//  • الرجوع (زر «الرجوع للخلف» أو زر المتصفح = POP): يعيد المستخدم إلى نفس
//    المكان الذي كان عليه بالضبط في الصفحة السابقة.
//  • الانتقال لصفحة جديدة (PUSH/REPLACE): تفتح من أعلاها، إلا إذا كان في الرابط
//    قسم (#hash) فيتولاه الـ Navbar.
// المواقع تُحفظ لكل مدخل في سجل التصفح (location.key) في sessionStorage.
// =========================================================

const STORAGE_KEY = "source:scroll-positions";
const RESTORE_TIMEOUT_MS = 2500; // المحتوى قد يُحمَّل متأخرًا (بيانات/صور) — نعيد المحاولة حتى يصل الارتفاع

const load = () => {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
};

const ScrollManager = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const positions = useRef(load());

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  // حفظ موقع التمرير للصفحة الحالية أثناء التمرير
  useEffect(() => {
    const key = location.key;
    let timer;
    const save = () => {
      positions.current[key] = window.scrollY;
      clearTimeout(timer);
      timer = setTimeout(() => {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions.current)); } catch { /* التخزين غير متاح */ }
      }, 150);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => { window.removeEventListener("scroll", save); clearTimeout(timer); };
  }, [location.key]);

  // عند تغيّر الصفحة: استعادة الموقع عند الرجوع، أو البدء من الأعلى
  useLayoutEffect(() => {
    if (navType !== "POP") {
      if (!location.hash) window.scrollTo(0, 0);
      return undefined;
    }
    const target = positions.current[location.key];
    if (target == null) return undefined;

    let cancelled = false;
    const stop = () => { cancelled = true; };
    // إذا بدأ المستخدم يمرّر بنفسه نتوقف عن الاستعادة
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchstart", stop, { passive: true, once: true });
    window.addEventListener("keydown", stop, { once: true });

    const started = Date.now();
    let timer;
    const attempt = () => {
      if (cancelled) return;
      window.scrollTo(0, target);
      if (Math.abs(window.scrollY - target) > 2 && Date.now() - started < RESTORE_TIMEOUT_MS) {
        timer = setTimeout(attempt, 50);
      }
    };
    attempt();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [location.key, navType]);

  return null;
};

export default ScrollManager;
