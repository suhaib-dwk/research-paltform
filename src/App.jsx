import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AllNewsPage from './pages/AllNewsPage';
import DynamicPage from './pages/DynamicPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import Footer from './components/layout/Footer';
import DynamicHead from './components/layout/DynamicHead';

import { SiteProvider, useSite } from './SiteContext';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';

import AdminNavbar from './components/layout/AdminNavbar';
import AdminFooter from './components/layout/AdminFooter';
import AdminLayout from './components/admin/AdminLayout';
import AdminSettings from './components/admin/AdminSettings';
import AdminSlides from './components/admin/AdminSlides';
import AdminManageTable from './components/admin/AdminManageTable';

// صفحات الداشبورد المشتركة
import SettingsPage from './pages/dashboard/SettingsPage';
import AccountPage from './pages/dashboard/AccountPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import HelpDashboardPage from './pages/dashboard/HelpDashboardPage';
import ActivityPage from './pages/dashboard/ActivityPage';
import TasksPage from './pages/dashboard/TasksPage';
import ResearchesPage from './pages/dashboard/ResearchesPage';
import NewResearchPage from './pages/dashboard/NewResearchPage';
import CollaborationsPage from './pages/services/CollaborationsPage';
import ReviewsPage from './pages/dashboard/ReviewsPage';
import ReviewsHistoryPage from './pages/dashboard/ReviewsHistoryPage';
import StatsPage from './pages/dashboard/StatsPage';

// صفحات الموظفين
import UniversitiesPage from './pages/dashboard/employee/UniversitiesPage';
import CollegesPage from './pages/dashboard/employee/CollegesPage';
import UsersPage from './pages/dashboard/employee/UsersPage';

// صفحات الخدمات
import ServicePageLayout from './pages/services/ServicePageLayout';

// =========================================================
// حراس المسارات
// =========================================================
const ProtectedRoute = ({ children }) => {
  const { user } = useSite();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user } = useSite();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useSite();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// =========================================================
// المحتوى الرئيسي
// =========================================================
function AppContent() {
  const { i18n } = useTranslation();
  const { isAdmin } = useSite();
  const location = useLocation();

  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    document.documentElement.style.fontFamily =
      i18n.language === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  }, [i18n.language]);

  const nonEmployeeRoles = ['undergrad', 'grad', 'faculty', 'researcher', 'reviewer', 'university', 'college', 'research_center', 'ministry'];
  const academicRoles = ['researcher', 'faculty', 'grad'];

  return (
    <>
      <DynamicHead />
      <div className="flex flex-col min-h-screen">
        {!isDashboardPage && (isAdmin ? <AdminNavbar /> : <Navbar />)}

        <main className="flex-grow">
          <Routes>
            {/* ---- الصفحات العامة ---- */}
            <Route path="/" element={<PublicOnlyRoute><HomePage /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/service/:slug" element={<ServiceDetailPage />} />
            <Route path="/all-news" element={<AllNewsPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/page/:slug" element={<DynamicPage />} />

            {/* ---- لوحة التحكم ---- */}
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardLayout /></ProtectedRoute>
            }>
              {/* مشتركة لجميع الأدوار */}
              <Route index element={<DashboardHome />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="help" element={<HelpDashboardPage />} />
              <Route path="activity" element={<ActivityPage />} />

              {/* صفحات الخدمات (ديناميكية حسب الـ slug) */}
              <Route path="services/:slug" element={<ServicePageLayout />} />

              {/* صفحات الموظفين */}
              <Route path="universities" element={<RoleRoute allowedRoles={['employee']}><UniversitiesPage /></RoleRoute>} />
              <Route path="colleges" element={<RoleRoute allowedRoles={['employee']}><CollegesPage /></RoleRoute>} />
              <Route path="users" element={<RoleRoute allowedRoles={['employee']}><UsersPage /></RoleRoute>} />

              {/* باقي الأدوار */}
              <Route path="tasks" element={<RoleRoute allowedRoles={nonEmployeeRoles}><TasksPage /></RoleRoute>} />
              <Route path="researches" element={<RoleRoute allowedRoles={academicRoles}><ResearchesPage /></RoleRoute>} />
              <Route path="researches/new" element={<RoleRoute allowedRoles={academicRoles}><NewResearchPage /></RoleRoute>} />
              <Route path="collaborations" element={<RoleRoute allowedRoles={['researcher', 'faculty', 'university', 'research_center']}><CollaborationsPage /></RoleRoute>} />
              <Route path="reviews" element={<RoleRoute allowedRoles={['reviewer', 'faculty']}><ReviewsPage /></RoleRoute>} />
              <Route path="reviews/history" element={<RoleRoute allowedRoles={['reviewer', 'faculty']}><ReviewsHistoryPage /></RoleRoute>} />
              <Route path="stats" element={<RoleRoute allowedRoles={nonEmployeeRoles}><StatsPage /></RoleRoute>} />
            </Route>

            {/* ---- لوحة الإدارة ---- */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminSettings />} />
              <Route path="slides" element={<AdminSlides />} />
              <Route path="table/:tableName" element={<AdminManageTable />} />
              <Route path="account" element={<div className="p-6 text-2xl font-bold text-gray-700">صفحة تحديث الحساب</div>} />
              <Route path="password" element={<div className="p-6 text-2xl font-bold text-gray-700">صفحة تعديل كلمة المرور</div>} />
            </Route>

            {/* ---- 404 ---- */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
                <h1 className="text-6xl font-black mb-4">404</h1>
                <p className="text-xl mb-6">{i18n.language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}</p>
                <a href="/dashboard" className="text-[#c8a44e] font-bold hover:underline">
                  {i18n.language === 'ar' ? 'العودة للرئيسية' : 'Back to Dashboard'}
                </a>
              </div>
            } />
          </Routes>
        </main>

        {!isDashboardPage && (isAdmin ? <AdminFooter /> : <Footer />)}
      </div>
    </>
  );
}

// =========================================================
// التطبيق
// =========================================================
function App() {
  return (
    <SiteProvider>
      <AppContent />
    </SiteProvider>
  );
}

export default App;