import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
  useNavigate,
  Link,
} from "react-router-dom";

// Shared/Public Pages
import LoginPage from "./source/LoginPage";
import RegisterPage from "./source/RegisterPage";

import HomePage from "./source/S01_00_HomePage";
import PillarPage from "./source/S01_01_PillarPage";
import AllNewsPage from "./source/S01_02_AllNewsPage";
import NewsDetailPage from "./source/S01_03_NewsDetailPage";

import ServicesCataloguePage from "./source/S02_00_ServicesCataloguePage";
import TargetAudiencePage from "./source/S03_00_TargetAudiencePage";
import TargetAudienceDetailPage from "./source/S03_01_TargetAudienceDetailPage";
import MinistrySpacePage from "./source/S03_02_MinistrySpacePage";

import StaffPage from "./source/S04_StaffPage";
import AboutUsPage from "./source/S05_AboutUsPage";
import HelpPage from "./source/S06_HelpPage";
import ContactPage from "./source/S07_ContactPage";

import ServiceDetailPage from "./source/S02_02_ServiceDetailPage";
import PlatformServiceDetailPage from "./source/S02_01_PlatformServiceDetailPage";

// Contexts
import { SiteProvider, useSite } from "./SiteContext";

// layouts & Components
import Navbar from "./source/shared/Navbar";
import Footer from "./source/shared/Footer";
import DynamicHead from "./source/shared/DynamicHead";
import ScrollManager from "./source/shared/ScrollManager";

// Shared Dashboard Home & Tasks
import Home from "./academic/Home";
import TasksPage from "./academic/TasksPage";

// New Pages Imports
import MessagesPage from "./academic/MessagesPage";
import Help from "./academic/Help";
import ServicesIndexPage from "./academic/ServicesIndexPage";
import AiAssistantPage from "./academic/AiAssistantPage";
import ReviewServicePage from './sharedServices/Ser01_ReviewServicePage';
import TranslationPage from './sharedServices/TranslationPage';
import ConsultationPage from './sharedServices/ConsultationPage'; 
import ProofreadingPage from './sharedServices/ProofreadingPage'; 

// Layouts
import AcademicLayout from "./shared-academic/AcademicLayout";
import SettingsPage from "./settings/SettingsPage";
import AccountPage from "./settings/AccountPage";

// =========================================================
// تعريف الأدوار الصحيحة
// =========================================================
const ACADEMIC_ROLES = [
  "bachelor_student",
  "master_student",
  "phd_student",
  "lecturer",
  "researcher",
];

const INSTITUTION_ROLES = [
  "university",
  "college",
  "research_center",
  "ministry",
];

const PROTECTED_ROLES = [
  ...ACADEMIC_ROLES,
  ...INSTITUTION_ROLES,
  "employee",
  "service_provider",
  "system_admin",
  "super_admin",
];

// =========================================================
// مكونات التخطيط المؤقتة (Placeholders) للمؤسسات الأخرى
// =========================================================
const AdminLayout = () => (
  <div className="flex h-screen bg-gray-100">
    <div className="w-64 bg-gray-900 text-white p-4">
      Admin Sidebar Placeholder
    </div>
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Outlet />
    </main>
  </div>
);

const UniversityLayout = () => (
  <div className="flex h-screen bg-purple-50">
    <div className="w-64 bg-purple-900 text-white p-4">
      University Sidebar Placeholder
    </div>
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-4">University Dashboard</h1>
      <Outlet />
    </main>
  </div>
);

const CollegeLayout = () => (
  <div className="flex h-screen bg-green-50">
    <div className="w-64 bg-green-900 text-white p-4">
      College Sidebar Placeholder
    </div>
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-4">College Dashboard</h1>
      <Outlet />
    </main>
  </div>
);

const ResearchCenterLayout = () => (
  <div className="flex h-screen bg-teal-50">
    <div className="w-64 bg-teal-900 text-white p-4">
      Research Center Sidebar Placeholder
    </div>
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-4">Research Center Dashboard</h1>
      <Outlet />
    </main>
  </div>
);

const MinistryLayout = () => (
  <div className="flex h-screen bg-indigo-50">
    <div className="w-64 bg-indigo-900 text-white p-4">
      Ministry Sidebar Placeholder
    </div>
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-4">Ministry Dashboard</h1>
      <Outlet />
    </main>
  </div>
);

const EmployeeLayout = () => (
  <div className="flex h-screen bg-orange-50">
    <div className="w-64 bg-orange-900 text-white p-4">
      Employee Sidebar Placeholder
    </div>
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <Outlet />
    </main>
  </div>
);

const ProviderLayout = () => (
  <div className="flex h-screen bg-pink-50">
    <div className="w-64 bg-pink-900 text-white p-4">
      Provider Sidebar Placeholder
    </div>
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-4">Service Provider Dashboard</h1>
      <Outlet />
    </main>
  </div>
);

// =========================================================
// Components: Guards & Redirects
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
    return <Navigate to="/dashboard" replace state={{ isGlobal: true, useJsx: true }}/>;
  }
  return children;
};

const getRedirectPath = (role) => {
  if (role === "system_admin" || role === "super_admin") return "/admin";
  if (role === "service_provider") return "/provider";
  if (role === "employee") return "/employee";
  if (INSTITUTION_ROLES.includes(role)) return `/${role.replace("_", "-")}`;
  return "/academic";
};

const DashboardRedirect = () => {
  const { user } = useSite();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    const targetPath = getRedirectPath(user.role);
    navigate(targetPath, { replace: true });
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-brand-orange animate-spin text-4xl">
        <svg
          className="w-10 h-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    </div>
  );
};

// =========================================================
// صفحة 404 للوحة التحكم
// =========================================================
const DashboardNotFound = () => {
  const translationObj = useTranslation();
  const isArabic = translationObj.i18n.language === "ar";
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4">
      <h1 className="text-6xl md:text-8xl font-extrabold text-gray-200 mb-4 select-none">
        404
      </h1>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
        {isArabic ? "الصفحة غير موجودة" : "Page Not Found"}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        {isArabic ? "عذراً، الرابط غير صحيح." : "Sorry, the link is invalid."}
      </p>
      <Link
        to="./"
        className="px-6 py-2 bg-brand-orange text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
      >
        {isArabic ? "العودة للرئيسية" : "Go to Dashboard"}
      </Link>
    </div>
  );
};

// =========================================================
// صفحة 404 العامة
// =========================================================
const NotFoundPage = () => {
  const translationObj = useTranslation();
  const isArabic = translationObj.i18n.language === "ar";
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-8xl md:text-9xl font-extrabold text-gray-200 mb-4 select-none">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
        {isArabic ? "عذراً، الصفحة غير موجودة" : "Oops! Page Not Found"}
      </h2>
      <p className="text-gray-600 mb-8 max-w-md text-sm md:text-base">
        {isArabic
          ? "يبدو أن الرابط الذي تحاول الوصول إليه غير صحيح."
          : "The page you are looking for might have been removed."}
      </p>
      <Link
        to="/"
        className="group relative px-8 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <span className="flex items-center gap-2">
          {isArabic ? "العودة للرئيسية" : "Back to Home"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </span>
      </Link>
    </div>
  );
};

// =========================================================
// App Content
// =========================================================
function AppContent() {
  const translationObj = useTranslation();
  const i18n = translationObj.i18n;
  const location = useLocation();

  const isInternalPage =
    location.pathname.startsWith("/academic") ||
    location.pathname.startsWith("/university") ||
    location.pathname.startsWith("/college") ||
    location.pathname.startsWith("/research-center") ||
    location.pathname === "/ministry" || location.pathname.startsWith("/ministry/") ||
    location.pathname.startsWith("/employee") ||
    location.pathname.startsWith("/provider") ||
    location.pathname.startsWith("/admin") ;

  const isAdminPage = location.pathname.startsWith("/admin");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    if (!i18n) return;
    const isArabic = i18n.language?.toLowerCase().startsWith("ar");
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = isArabic ? "ar" : "en";
  }, [i18n?.language]);

  return (
    <>
      <DynamicHead />
      {/* الرجوع يعيد لنفس موقع التمرير، والصفحة الجديدة تبدأ من الأعلى */}
      <ScrollManager />
      <div className="flex flex-col min-h-screen">
        {!isInternalPage && !isAdminPage && !isAuthPage && <Navbar />}

        <main className="flex-grow">
          <Routes>
            {/* 1. Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/pillar/:key" element={<PillarPage />} />
            <Route
              path="/platform-service/:key"
              element={<PlatformServiceDetailPage />}
            />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />

            <Route path="/target-audience" element={<TargetAudiencePage />} />
            <Route
              path="/audience/:key"
              element={<TargetAudienceDetailPage />}
            />
            <Route
              path="/target-audience/:key"
              element={<TargetAudienceDetailPage />}
            />
            {/* صفحات مساحات الوزارة الأربع (/ministry-space/data-intelligence …) */}
            <Route path="/ministry-space/:slug" element={<MinistrySpacePage />} />

            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/all-news" element={<AllNewsPage />} />
            <Route path="/service/:slug" element={<ServiceDetailPage />} />
            <Route path="/services" element={<ServicesCataloguePage />} />

            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/staff" element={<StaffPage />} />

            {/* 2. General Dashboard Redirect */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* 3. Protected Layouts & Nested Routes */}

            {/* --- ACADEMIC LAYOUT --- */}
            <Route
              path="/academic"
              element={
                <ProtectedRoute>
                  <AcademicLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />

              {/* ========================================= */}
              {/*          صفحة الحساب (Account)           */}
              {/* ========================================= */}
              <Route
                path="account"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <AccountPage />
                  </RoleRoute>
                }
              />

              {/* ========================================= */}
              {/*          صفحة الإعدادات (Settings)         */}
              {/* ========================================= */}
              <Route
                path="settings"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <SettingsPage />
                  </RoleRoute>
                }
              />

              {/* Tasks */}
              <Route
                path="tasks"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <TasksPage />
                  </RoleRoute>
                }
              />

              {/* Messages */}
              <Route
                path="messages"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <MessagesPage />
                  </RoleRoute>
                }
              />
              
              {/* Helps */}
              <Route
                path="help"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <Help />
                  </RoleRoute>
                }
              />

              {/* ========================================= */}
              {/*       مسارات الخدمات (Services)            */}
              {/* ========================================= */}
              
              {/* 1. صفحة الفهرس الرئيسية */}
              <Route
                path="services"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <ServicesIndexPage />
                  </RoleRoute>
                }
              />

              {/* 2. مسارات خاصة للخدمات (يتم معالجتها قبل الديناميكي) */}
              
              {/* Review Service */}
              <Route
                path="services/review"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <ReviewServicePage />
                  </RoleRoute>
                }
              />

              {/* ✅ Translation Service */}
              <Route
                path="services/translation"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <TranslationPage />
                  </RoleRoute>
                }
              />

              {/* ✅ Consultation Service */}
              <Route
                path="services/consultation"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <ConsultationPage />
                  </RoleRoute>
                }
              />
               {/* ✅ ProofreadingPage Service */}
              <Route
                path="services/proofreading"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <ProofreadingPage />
                  </RoleRoute>
                }
              />

              {/* 3. مسار عام/ديناميكي لباقي الخدمات (Modal Logic) */}
              <Route
                path="services/:slug"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <ServicesIndexPage />
                  </RoleRoute>
                }
              />

              {/* AI Assistant Service */}
              <Route
                path="ai-assistant"
                element={
                  <RoleRoute allowedRoles={ACADEMIC_ROLES}>
                    <AiAssistantPage />
                  </RoleRoute>
                }
              />

              {/* 404 لوحة التحكم */}
              <Route path="*" element={<DashboardNotFound />} />
            </Route>

            {/* --- INSTITUTIONS LAYOUTS --- */}
            <Route
              path="/university"
              element={
                <ProtectedRoute>
                  <UniversityLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="*" element={<DashboardNotFound />} />
            </Route>

            <Route
              path="/college"
              element={
                <ProtectedRoute>
                  <CollegeLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="*" element={<DashboardNotFound />} />
            </Route>

            <Route
              path="/research-center"
              element={
                <ProtectedRoute>
                  <ResearchCenterLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="*" element={<DashboardNotFound />} />
            </Route>

            <Route
              path="/ministry"
              element={
                <ProtectedRoute>
                  <MinistryLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="*" element={<DashboardNotFound />} />
            </Route>

            {/* --- EMPLOYEE & PROVIDER LAYOUTS --- */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute>
                  <EmployeeLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="*" element={<DashboardNotFound />} />
            </Route>

            <Route
              path="/provider"
              element={
                <ProtectedRoute>
                  <ProviderLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="*" element={<DashboardNotFound />} />
            </Route>

            {/* --- ADMIN LAYOUT --- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="*" element={<DashboardNotFound />} />
            </Route>

            {/* 4. Global 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {!isInternalPage && !isAdminPage && !isAuthPage && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <SiteProvider>
      <AppContent />
    </SiteProvider>
  );
}

export default App;

// // Public SOURCE PAGES

// import DynamicPage from "../pages/DynamicPage";

// import DashboardLayout from "./ZZZ/layouts/DashboardLayout";
//

// import AdminNavbar from "./ZZZ/components/layout/AdminNavbar";
// import AdminFooter from "./ZZZ/components/layout/AdminFooter";
// import AdminLayout from "./ZZZ/components/admin/AdminLayout";
// import AdminSettings from "./ZZZ/components/admin/AdminSettings";
// import AdminSlides from "./ZZZ/components/admin/AdminSlides";
// import AdminManageTable from "./ZZZ/components/admin/AdminManageTable";

// // صفحات الداشبورد المشتركة
// import SettingsPage from "../pages/dashboard/SettingsPage";
// import AccountPage from "../pages/dashboard/AccountPage";
// import MessagesPage from "../pages/dashboard/MessagesPage";
// import HelpDashboardPage from "../pages/dashboard/HelpDashboardPage";
// import ResearchesPage from "../pages/dashboard/ResearchesPage";
// import NewResearchPage from "../pages/dashboard/NewResearchPage";
// import CollaborationsPage from "../pages/services/CollaborationsPage";
// import ReviewsPage from "../pages/dashboard/ReviewsPage";
// import ReviewsHistoryPage from "../pages/dashboard/ReviewsHistoryPage";
// import AcademicQualityPage from "../pages/dashboard/AcademicQualityPage";
// import ProviderRequestsPage from "../pages/dashboard/ProviderRequestsPage";
// import UniversityProfilePage from "../pages/dashboard/UniversityProfilePage";

// // صفحات الموظفين
// import UniversitiesPage from "../pages/dashboard/employee/UniversitiesPage";
// import CollegesPage from "../pages/dashboard/employee/CollegesPage";
// import UsersPage from "../pages/dashboard/employee/UsersPage";

// // صفحات الخدمات
// import ServicePageLayout from "../pages/services/ServicePageLayout";
// import ServicesIndexPage from "../pages/services/ServicesIndexPage";

// // =========================================================
// // استيراد صفحات الوزارة (Ministry Pages)
// // =========================================================
// import {
//   MinistryNationalDashboard,
//   MinistryUniversityComparison,
//   MinistryGeographicMap,
//   MinistryResearchFields,
//   MinistryPolicyIntelligence,
//   MinistrySectors,
//   MinistryPartnerships,
//   MinistryAgreements,
//   MinistryFunding,
//   MinistryDataGovernance,
// } from "../pages/ministry/MinistryPages";

// // =========================================================
// // المحتوى الرئيسي
// // =========================================================
// function AppContent() {

//   return (
//     <>
//       <DynamicHead />
//       <div className="flex flex-col min-h-screen">
//         {/* ✅ صفحات لوحة الإدارة (/admin/*) لها تخطيطها المستقل بالكامل (AdminLayout: سايدبار + هيدر
//             هاتف خاصين بها) — عرض AdminNavbar هنا فوقها كان يسبب هيدرين متراكبين بألوان غير متسقة. */}
//         {!isDashboardPage &&
//           !isAdminPage &&
//           !isAuthPage &&
//           (isAdmin ? <AdminNavbar /> : <Navbar />)}

//         <main className="flex-grow">
//           <Routes>
//             {/* ---- الصفحات العامة ---- */}
//

//             <Route path="/page/:slug" element={<DynamicPage />} />

//             {/* ---- لوحة التحكم ---- */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <DashboardLayout />
//                 </ProtectedRoute>
//               }
//             >

//               <Route path="settings" element={<SettingsPage />} />
//               <Route path="account" element={<AccountPage />} />
//               <Route path="messages" element={<MessagesPage />} />
//               <Route path="help" element={<HelpDashboardPage />} />

//               {/* صفحات الخدمات (فهرس عام + ديناميكية حسب الـ slug) */}
//               <Route path="services" element={<ServicesIndexPage />} />
//               

//               {/* صفحات الموظفين */}
//               <Route
//                 path="universities"
//                 element={
//                   <RoleRoute allowedRoles={["employee"]}>
//                     <UniversitiesPage />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="colleges"
//                 element={
//                   <RoleRoute allowedRoles={["employee"]}>
//                     <CollegesPage />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="users"
//                 element={
//                   <RoleRoute allowedRoles={["employee"]}>
//                     <UsersPage />
//                   </RoleRoute>
//                 }
//               />

//               {/* باقي الأدوار */}

//               <Route
//                 path="researches"
//                 element={
//                   <RoleRoute allowedRoles={academicRoles}>
//                     <ResearchesPage />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="researches/new"
//                 element={
//                   <RoleRoute allowedRoles={academicRoles}>
//                     <NewResearchPage />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="collaborations"
//                 element={
//                   <RoleRoute
//                     allowedRoles={[
//                       "researcher",
//                       "faculty",
//                       "university",
//                       "research_center",
//                     ]}
//                   >
//                     <CollaborationsPage />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="reviews"
//                 element={
//                   <RoleRoute allowedRoles={["reviewer", "faculty"]}>
//                     <ReviewsPage />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="reviews/history"
//                 element={
//                   <RoleRoute allowedRoles={["reviewer", "faculty"]}>
//                     <ReviewsHistoryPage />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="university-profile"
//                 element={
//                   <RoleRoute allowedRoles={["university"]}>
//                     <UniversityProfilePage />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="academic-quality"
//                 element={
//                   <RoleRoute
//                     allowedRoles={["university", "college", "research_center"]}
//                   >
//                     <AcademicQualityPage />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="provider-requests"
//                 element={
//                   <RoleRoute allowedRoles={["service_provider"]}>
//                     <ProviderRequestsPage />
//                   </RoleRoute>
//                 }
//               />

//               {/* ========================================================= */}
//               {/* ---- صفحات الوزارة (Ministry Routes - Part 3) ---- */}
//               {/* ========================================================= */}
//               <Route
//                 path="ministry/national-dashboard"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryNationalDashboard />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="ministry/university-comparison"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryUniversityComparison />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="ministry/geographic-intelligence"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryGeographicMap />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="ministry/research-fields"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryResearchFields />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="ministry/policy-intelligence"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryPolicyIntelligence />
//                   </RoleRoute>
//                 }
//               />

//               <Route
//                 path="ministry/sectors"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistrySectors />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="ministry/gap-analysis"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistrySectors />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="ministry/coverage-map"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistrySectors />
//                   </RoleRoute>
//                 }
//               />

//               <Route
//                 path="ministry/partners-network"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryPartnerships />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="ministry/agreements"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryAgreements />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="ministry/partnership-matching"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryPartnerships />
//                   </RoleRoute>
//                 }
//               />

//               <Route
//                 path="ministry/funding-opportunities"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryFunding />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="ministry/funding-matching"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryFunding />
//                   </RoleRoute>
//                 }
//               />
//               <Route
//                 path="ministry/calls-budget"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryFunding />
//                   </RoleRoute>
//                 }
//               />

//               <Route
//                 path="ministry/data-governance"
//                 element={
//                   <RoleRoute allowedRoles={["ministry"]}>
//                     <MinistryDataGovernance />
//                   </RoleRoute>
//                 }
//               />
//             </Route>

//             {/* ---- لوحة الإدارة ---- */}
//             <Route path="/admin" element={<AdminLayout />}>
//               <Route index element={<AdminSettings />} />
//               <Route path="slides" element={<AdminSlides />} />
//               <Route path="table/:tableName" element={<AdminManageTable />} />
//               <Route
//                 path="account"
//                 element={
//                   <div className="p-6 text-2xl font-bold text-gray-700">
//                     صفحة تحديث الحساب
//                   </div>
//                 }
//               />
//               <Route
//                 path="password"
//                 element={
//                   <div className="p-6 text-2xl font-bold text-gray-700">
//                     صفحة تعديل كلمة المرور
//                   </div>
//                 }
//               />
//             </Route>

//             {/* ---- 404 ---- */}
//             <Route
//               path="*"
//               element={
//                 <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
//                   <h1 className="text-6xl font-black mb-4">404</h1>
//                   <p className="text-xl mb-6">
//                     {i18n.language === "ar"
//                       ? "الصفحة غير موجودة"
//                       : "Page Not Found"}
//                   </p>
//                   <a
//                     href="/dashboard"
//                     className="text-brand-orange font-bold hover:underline"
//                   >
//                     {i18n.language === "ar"
//                       ? "العودة للرئيسية"
//                       : "Back to Dashboard"}
//                   </a>
//                 </div>
//               }
//             />
//           </Routes>
//         </main>

//       </div>
//     </>
//   );
// }

// export default App;
