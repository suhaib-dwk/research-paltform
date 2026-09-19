import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useBackClick from "./useBackClick";

// =========================================================
// زر «الرجوع للخلف» أسفل كل صفحة داخلية (قبل الفوتر) — نفس زر الهيرو شكلًا ومكانًا
// (جهة النهاية). يعيد المستخدم للصفحة السابقة وموقعها بالضبط (useBackClick +
// ScrollManager)؛ وإن فُتحت الصفحة مباشرة يذهب للصفحة الأعلى منها.
// =========================================================

const parentOf = (path) => {
  if (path.startsWith("/ministry-space/")) return "/audience/ministry";
  if (path.startsWith("/audience/") || path.startsWith("/target-audience/")) return "/target-audience";
  if (path.startsWith("/pillar/")) return "/about-us";
  if (path.startsWith("/platform-service/") || path.startsWith("/service/")) return "/services";
  if (path.startsWith("/news/")) return "/all-news";
  return "/";
};

const BottomBackBar = () => {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const onBack = useBackClick();
  const isRTL = i18n.language?.toLowerCase().startsWith("ar") ?? false;
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  if (pathname === "/") return null; // الصفحة الرئيسية بلا زر رجوع

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-8 flex justify-end">
        <Link
          to={parentOf(pathname)}
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-[13px] font-bold text-white hover:bg-brand-orange-dark transition-colors"
        >
          <BackIcon className="w-4 h-4" />
          {isRTL ? "الرجوع للخلف" : "Go back"}
        </Link>
      </div>
    </div>
  );
};

export default BottomBackBar;
