import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// =========================================================
// إدارة التمرير بين الصفحات:
//  • الرجوع (زر «الرجوع للخلف» أو زر المتصفح = POP): يعيد المستخدم إلى نفس
//    المكان الذي كان عليه بالضبط في الصفحة السابقة.
//  • الانتقال لصفحة جديدة (PUSH/REPLACE): تفتح من أعلاها، إلا إذا كان في الرابط
//    قسم (#hash) فيتولاه الـ Navbar.
// المواقع تُحفظ لكل مدخل في سجل التصفح (location.key) في الذاكرة و sessionStorage.
// مستمع تمرير واحد يكتب دائمًا لمفتاح الصفحة الحالية (currentKey) — يُحدَّث قبل أي
// تمرير برمجي، فلا يطغى «التمرير للأعلى» في الصفحة الجديدة على موقع الصفحة السابقة.
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
  const currentKey = useRef(location.key);

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  // مستمع واحد طوال عمر التطبيق: يحفظ موقع التمرير لمفتاح الصفحة الحالية
  useEffect(() => {
    let timer;
    const save = () => {
      positions.current[currentKey.current] = window.scrollY;
      clearTimeout(timer);
      timer = setTimeout(() => {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions.current)); } catch { /* التخزين غير متاح */ }
      }, 150);
    };
    window.addEventListener("scroll", save, { passive: true });
    // ✅ نحفظ أيضًا لحظة الضغط/الإدخال (قبل أي انتقال) — لا نعتمد على أحداث التمرير
    // وحدها، فهي لا تُطلق مثلًا إذا كانت الصفحة في الخلفية
    document.addEventListener("click", save, true);
    document.addEventListener("keydown", save, true);
    return () => {
      window.removeEventListener("scroll", save);
      document.removeEventListener("click", save, true);
      document.removeEventListener("keydown", save, true);
      clearTimeout(timer);
    };
  }, []);

  // عند تغيّر الصفحة: استعادة الموقع عند الرجوع، أو البدء من الأعلى
  useLayoutEffect(() => {
    currentKey.current = location.key; // أولًا — قبل أي تمرير
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
