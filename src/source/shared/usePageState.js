import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// =========================================================
// حالة واجهة مرتبطة بمدخل سجل التصفح (location.key): فلتر، تاب، بحث…
//  • عند الرجوع للصفحة (زر «الرجوع للخلف» أو زر المتصفح) تعود كما تركها المستخدم.
//  • عند فتح الصفحة من جديد (مدخل جديد في السجل) تبدأ بالقيمة الافتراضية.
// الاستخدام: const [value, setValue] = usePageState("services.level", "all");
// =========================================================

const STORAGE_KEY = "source:page-state";
const memory = (() => {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
})();

const persist = () => {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memory)); } catch { /* التخزين غير متاح */ }
};

const usePageState = (name, initial) => {
  const { key } = useLocation();
  const id = `${key}:${name}`;
  const [value, setValue] = useState(() => (id in memory ? memory[id] : initial));

  useEffect(() => {
    memory[id] = value;
    persist();
  }, [id, value]);

  return [value, setValue];
};

export default usePageState;
