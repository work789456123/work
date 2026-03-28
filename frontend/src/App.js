import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";


// ADMIN LAYOUT
import AdminLayout from "./components/admin/AdminLayout";

// PUBLIC PAGES
import Home from "./pages/user/Home";
import GopuChat from "./pages/user/GopuChat";
import Doctors from "./pages/user/Doctors";
import AppointmentsPage from "./pages/user/AppointmentsPage";
import Product from "./pages/user/Product";
import Blogs from "./pages/user/Blogs";
import BlogDetail from "./pages/user/BlogDetail";
import AboutUs from "./pages/user/AboutUs";
import OurStory from "./pages/user/OurStory";
import Contact from "./pages/user/Contact";
import Careers from "./pages/user/Careers";
import PashuCareSurakshaPlan from "./pages/user/PashuCareSurakshaPlan";
import TermsAndConditions from "./pages/user/TermsAndConditions";
import PrivacyPolicy from "./pages/user/PrivacyPolicy";
import TermsModal from "./components/TermsModal";
import PromoModal from "./components/PromoModal";

// ADMIN PAGES
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminBlogs from "./pages/admin/AdminBlogs";

// NEW ADMIN DASHBOARD
import NewAdminLayout from "./components/new-admin/NewAdminLayout";
import DashboardOverview from "./pages/new-admin/DashboardOverview";
import PlaceholderPage from "./components/new-admin/PlaceholderPage";

import "./App.css";


// 🔐 ADMIN PROTECTED ROUTE
function AdminProtectedRoute({ children }) {

  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}


function Layout() {

  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Hide Navbar on Admin Pages */}
      {(!isAdminPage && !location.pathname.startsWith('/admin-portal')) && <Navbar />}

      <main className="flex-1">

        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          <Route path="/" element={<Home />} />
          <Route path="/gopu" element={<GopuChat />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/product" element={<Product />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/pashucare-suraksha-plan" element={<PashuCareSurakshaPlan />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />


          {/* ================= ADMIN LOGIN ================= */}

          <Route path="/admin" element={<AdminLogin />} />


          {/* ================= ADMIN ROUTES ================= */}

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/doctors"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminDoctors />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/appointments"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminAppointments />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/blogs"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminBlogs />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />


          {/* ================= NEW ADMIN PORTAL ================= */}
          <Route path="/admin-portal" element={<AdminProtectedRoute><NewAdminLayout /></AdminProtectedRoute>}>
            <Route index element={<DashboardOverview />} />
            
            {/* Farmers */}
            <Route path="farmers/all" element={<PlaceholderPage title="All Farmers" />} />
            <Route path="farmers/registry" element={<PlaceholderPage title="Animal Registry" />} />
            
            {/* Animal Health */}
            <Route path="health/reports" element={<PlaceholderPage title="Disease Reports" />} />
            <Route path="health/heatmap" element={<PlaceholderPage title="Disease Heatmap" />} />
            <Route path="health/alerts" element={<PlaceholderPage title="Outbreak Alerts" />} />
            
            {/* AI Monitoring */}
            <Route path="ai/chat-logs" element={<PlaceholderPage title="Chat Logs" />} />
            <Route path="ai/flagged" element={<PlaceholderPage title="Flagged Responses" />} />
            <Route path="ai/accuracy" element={<PlaceholderPage title="AI Accuracy" />} />
            
            {/* Vet Network */}
            <Route path="vets/profiles" element={<PlaceholderPage title="Vet Profiles" />} />
            <Route path="vets/performance" element={<PlaceholderPage title="Vet Performance" />} />
            
            {/* Consultations */}
            <Route path="consultations/logs" element={<PlaceholderPage title="Consultation Logs" />} />
            <Route path="consultations/recordings" element={<PlaceholderPage title="Call Recordings" />} />
            
            {/* Knowledge Base */}
            <Route path="knowledge/diseases" element={<PlaceholderPage title="Diseases" />} />
            <Route path="knowledge/symptoms" element={<PlaceholderPage title="Symptoms" />} />
            <Route path="knowledge/treatments" element={<PlaceholderPage title="Treatments" />} />
            
            {/* Notifications */}
            <Route path="notifications/alerts" element={<PlaceholderPage title="Alerts" />} />
            <Route path="notifications/campaigns" element={<PlaceholderPage title="Campaigns" />} />
            
            {/* Payments */}
            <Route path="payments/revenue" element={<PlaceholderPage title="Revenue" />} />
            <Route path="payments/transactions" element={<PlaceholderPage title="Transactions" />} />
            
            {/* Reports */}
            <Route path="reports/analytics" element={<PlaceholderPage title="Analytics" />} />
            <Route path="reports/export" element={<PlaceholderPage title="Data Export" />} />
            
            {/* Settings */}
            <Route path="settings/roles" element={<PlaceholderPage title="Roles" />} />
            <Route path="settings/platform" element={<PlaceholderPage title="Platform Settings" />} />
          </Route>

          {/* ================= 404 PAGE ================= */}

          <Route
            path="*"
            element={
              <h1 className="text-center text-3xl mt-20">
                404 Page Not Found
              </h1>
            }
          />

        </Routes>

      </main>

      {/* Hide Footer on Admin Pages */}
      {(!isAdminPage && !location.pathname.startsWith('/admin-portal')) && <Footer />}

    </>
  );
}


function App() {

  return (
    <div className="App min-h-screen flex flex-col">

      <BrowserRouter>
        <ScrollToTop />

        <Layout />

        <Toaster position="top-right" />
        <TermsModal />
        <PromoModal />

      </BrowserRouter>

    </div>
  );

}

export default App;