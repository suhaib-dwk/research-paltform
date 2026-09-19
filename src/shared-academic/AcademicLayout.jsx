import { useState } from "react";
import { Outlet } from "react-router-dom"; // تمت إزالة الداخلية Routes للاعتماد على التوجيه الخارجي أو الحفاظ على البنية
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import DashboardFooter from "./DashboardFooter";

// =========================================================
// AcademicLayout Component
// =========================================================
export default function AcademicLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        // أضف منطق تسجيل الخروج هنا (مثلاً مسح التوكن)
        console.log("Logging out...");
        window.location.href = "/login"; // إعادة توجيه بسيط
    };

    return (
        <div className="flex h-screen bg-gray-50/50 font-sans text-gray-800 antialiased overflow-hidden">
            {/* 1. السايدبار (ثابت) */}
            <div
                className={`fixed inset-y-0 start-0 z-40 transition-all duration-300 ${isSidebarOpen ? "w-[280px]" : "w-0"}`}
            >
                <DashboardSidebar
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                />
            </div>

            {/* 2. الحاوية الرئيسية */}
            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "lg:ms-[280px]" : "ms-0"}`}
            >
                {/* Header (ثابت عند التمرير) */}
                <DashboardHeader
                    onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    onLogout={handleLogout}
                />

                {/* Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-4 md:p-6 lg:p-8 scroll-smooth">
                    <Outlet />
                    {/* إذا كنت تستخدم Routes داخل Layout هنا، ضعها بدلاً من Outlet، 
              ولكن استخدام Outlet هو الأفضل مع التوجيه في App.jsx */}
                </main>

                {/* Footer */}
                {/* <DashboardFooter /> */}
            </div>
        </div>
    );
}
