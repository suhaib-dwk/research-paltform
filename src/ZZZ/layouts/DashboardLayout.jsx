import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSite } from '../SiteContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

// =========================================================
// هيكل لوحات التحكم (التصميم المرجعي الجديد):
//   سايدبار أبيض بكامل الارتفاع (اللوجو + بطاقة المستخدم + القائمة + الأسفل)
//   + هيدر أبيض بجانب السايدبار (بحث + إشعارات + المستخدم)
//   + منطقة محتوى بخلفية رمادية فاتحة محايدة تُبرز البطاقات البيضاء بلا حدود.
// الوضع الداكن مدعوم بنفس الهيكل (خلفيات brand.dark).
// =========================================================
const DashboardLayout = () => {
  const { isRTL, logoutUser } = useSite();

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // إغلاق السايدبار عند الانتقال لشاشة كبيرة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // منع التمرير عند فتح السايدبار في الموبايل
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div
      className="dash-theme min-h-screen bg-gray-50 dark:bg-brand-dark transition-colors duration-300"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <DashboardSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ✅ العمود الرئيسي بجانب السايدبار: هيدر لاصق + محتوى بخلفية متدرجة */}
      <div className="min-h-screen flex flex-col lg:ps-[280px] transition-[padding] duration-300">
        <DashboardHeader onMenuToggle={handleMenuToggle} onLogout={handleLogout} />
        {/* ✅ خلفية محايدة (بلا تدرّج ملوّن) بطلب صريح — البطاقات البيضاء بظلها الناعم فوقها */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
