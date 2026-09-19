import { useNavigate } from "react-router-dom";

// =========================================================
// زر «رجوع» ذكي: يعيد المستخدم خطوة في سجل التصفح — أي إلى الصفحة التي جاء منها
// وإلى نفس موقع التمرير الذي ضغط منه (ScrollManager يستعيده عند POP).
// إن فُتحت الصفحة مباشرة بلا سجل داخل الموقع، يعمل الرابط العادي (href الاحتياطي).
// الاستخدام: <Link to="/fallback" onClick={onBack}>
// =========================================================
const useBackClick = () => {
  const navigate = useNavigate();
  return (e) => {
    if ((window.history.state?.idx ?? 0) > 0) {
      e?.preventDefault?.();
      navigate(-1);
    }
  };
};

export default useBackClick;
