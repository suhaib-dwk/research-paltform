import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSite } from '../SiteContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

const DashboardLayout = () => {
  const { user, siteSettings, currentLang, isRTL, logoutUser } = useSite();
  
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
    // ✅ دعم الوضع الفاتح (bg-gray-50) والداكن (brand.dark)
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1613] flex flex-col transition-colors duration-300" dir={isRTL ? 'rtl' : 'ltr'}>
      <DashboardHeader
        onMenuToggle={handleMenuToggle}
        onLogout={handleLogout}
      />
      <DashboardSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ✅ دعم الوضع الفاتح للهوامش والمسافات */}
      <div className="flex-1 flex flex-col pt-20 lg:ps-72 transition-[padding] duration-300">
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;