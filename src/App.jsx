import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Shared/Public Pages (Direct imports for demo purposes, can be extracted too)
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

// ✅ مفعّلان (معلّقان في النسخة الأصلية) — يُستخدمان أدناه لحساب الأدمن، وبدونهما تنهار الصفحة
import AdminNavbar from "./ZZZ/components/layout/AdminNavbar";
import AdminFooter from "./ZZZ/components/layout/AdminFooter";

// Route Groups
// import { AdminRoutes } from "./routes/AdminRoutes";
// import { MinistryRoutes } from "./routes/MinistryRoutes";
// import { UniversityRoutes } from "./routes/UniversityRoutes";
// import { StudentRoutes } from "./routes/StudentRoutes";
// import { EmployeeRoutes } from "./routes/EmployeeRoutes";

// ...

// Guards
const ProtectedRoute = ({ children }) => {
  const { user } = useSite();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};
// =========================================================
// مكون صفحة 404
// =========================================================
const NotFoundPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      {/* الرقم الكبير */}
      <h1 className="text-8xl md:text-9xl font-extrabold text-gray-200 mb-4 select-none">
        404
      </h1>

      {/* العنوان */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
        {isArabic ? "عذراً، الصفحة غير موجودة" : "Oops! Page Not Found"}
      </h2>

      {/* النص التوضيحي */}
      <p className="text-gray-600 mb-8 max-w-md text-sm md:text-base">
        {isArabic
          ? "يبدو أن الرابط الذي تحاول الوصول إليه غير صحيح أو تم نقله."
          : "The page you are looking for might have been removed or is temporarily unavailable."}
      </p>

      {/* زر العودة للرئيسية */}
      <a
        href="/"
        className="group relative px-8 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <span className="flex items-center gap-2">
          {isArabic ? "العودة للرئيسية" : "Back to Home"}

          {/* سهم صغير يتحرك عند التحويم */}
          {isArabic ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transition-transform group-hover:-translate-x-1"
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
          ) : (
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
          )}
        </span>
      </a>
    </div>
  );
};
// =========================================================
// App Content
// =========================================================
function AppContent() {
  const { i18n } = useTranslation();
  const { isAdmin } = useSite();
  const location = useLocation();

  const isDashboardPage = location.pathname.startsWith("/dashboard");
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const isArabic = i18n.language?.toLowerCase().startsWith("ar");
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = isArabic ? "ar" : "en";
  }, [i18n.language]);

  return (
    <>
      <DynamicHead />
      {/* الرجوع يعيد لنفس موقع التمرير، والصفحة الجديدة تبدأ من الأعلى */}
      <ScrollManager />
      <div className="flex flex-col min-h-screen">
        {/* Header Logic */}
        {!isDashboardPage &&
          !isAdminPage &&
          !isAuthPage &&
          (isAdmin ? <AdminNavbar /> : <Navbar />)}

        <main className="flex-grow">
          <Routes>
            {/* 1. Source / Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/pillar/:key" element={<PillarPage />} />

            <Route
              path="/platform-service/:key"
              element={<PlatformServiceDetailPage />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/target-audience" element={<TargetAudiencePage />} />
            <Route path="/staff" element={<StaffPage />} />

            <Route
              path="/audience/:key"
              element={<TargetAudienceDetailPage />}
            />

            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/service/:slug" element={<ServiceDetailPage />} />
            <Route path="/all-news" element={<AllNewsPage />} />

            <Route
              path="/target-audience/:key"
              element={<TargetAudienceDetailPage />}
            />
            {/* صفحات مساحات الوزارة الأربع (/ministry-space/data-intelligence …) */}
            <Route path="/ministry-space/:slug" element={<MinistrySpacePage />} />
            <Route path="/services" element={<ServicesCataloguePage />} />

            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />

            <Route path="/register" element={<RegisterPage />} />

            {/* ... المزيد من الصفحات العامة */}

            {/* 2. Dashboard Wrapper (Shared Layout for Internal Users) */}
            {/* <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            > */}
            {/* 3. Ministry Routes */}
            {/* <MinistryRoutes /> */}

            {/* 4. University Routes */}
            {/* <UniversityRoutes /> */}

            {/* 5. Student Routes */}
            {/* <StudentRoutes /> */}

            {/* 6. Employee Routes */}
            {/* <EmployeeRoutes /> */}
            {/* </Route> */}

            {/* 7. Admin Routes (Separate Layout) */}
            {/* <AdminRoutes /> */}

            {/* 404 */}
            {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer Logic */}
        {!isDashboardPage &&
          !isAdminPage &&
          !isAuthPage &&
          (isAdmin ? <AdminFooter /> : <Footer />)}
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
// import DashboardHome from "./ZZZ/components/dashboard/DashboardHome";

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
// import TasksPage from "../pages/dashboard/TasksPage";
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
// // حراس المسارات
// // =========================================================
// const ProtectedRoute = ({ children }) => {
//   const { user } = useSite();
//   if (!user) return <Navigate to="/login" replace />;
//   return children;
// };

// const PublicOnlyRoute = ({ children }) => {
//   const { user } = useSite();
//   if (user) return <Navigate to="/dashboard" replace />;
//   return children;
// };

// const RoleRoute = ({ allowedRoles, children }) => {
//   const { user } = useSite();
//   if (!user || !allowedRoles.includes(user.role)) {
//     return <Navigate to="/dashboard" replace />;
//   }
//   return children;
// };

// // =========================================================
// // المحتوى الرئيسي
// // =========================================================
// function AppContent() {

//   const nonEmployeeRoles = [
//     "undergrad",
//     "grad",
//     "faculty",
//     "researcher",
//     "reviewer",
//     "university",
//     "college",
//     "research_center",
//     "ministry",
//   ];
//   const academicRoles = ["researcher", "faculty", "grad"];

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
//               {/* مشتركة لجميع الأدوار */}
//               <Route index element={<DashboardHome />} />
//               <Route path="settings" element={<SettingsPage />} />
//               <Route path="account" element={<AccountPage />} />
//               <Route path="messages" element={<MessagesPage />} />
//               <Route path="help" element={<HelpDashboardPage />} />

//               {/* صفحات الخدمات (فهرس عام + ديناميكية حسب الـ slug) */}
//               <Route path="services" element={<ServicesIndexPage />} />
//               <Route path="services/:slug" element={<ServicePageLayout />} />

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
//                 path="tasks"
//                 element={
//                   <RoleRoute allowedRoles={nonEmployeeRoles}>
//                     <TasksPage />
//                   </RoleRoute>
//                 }
//               />
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
