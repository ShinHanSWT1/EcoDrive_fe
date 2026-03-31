import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

// Layouts
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import DashboardPage from "../pages/DashboardPage";
import ReportPage from "../pages/ReportPage";
import InsurancePage from "../pages/InsurancePage";
import PaymentPage from "../pages/PaymentPage";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";
import OnboardingPage from "../pages/OnboardingPage";
import AdminPage from "../pages/AdminPage";
import MissionPage from "../pages/MissionPage";
import LandingPage from "../pages/LandingPage";

interface RouterProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

function LayoutWrapper({
  children,
  isAuthenticated,
  onLogout,
}: {
  children: ReactNode;
  isAuthenticated: boolean;
  onLogout: () => void;
}) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return <AdminLayout onLogout={onLogout}>{children}</AdminLayout>;
  }

  return (
    <AppLayout isAuthenticated={isAuthenticated} onLogout={onLogout}>
      {children}
    </AppLayout>
  );
}

export default function AppRouter({
  isAuthenticated,
  onLogin,
  onLogout,
}: RouterProps) {
  return (
    <LayoutWrapper isAuthenticated={isAuthenticated} onLogout={onLogout}>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <DashboardPage /> : <LandingPage />}
        />
        <Route
          path="/report"
          element={isAuthenticated ? <ReportPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/insurance"
          element={
            isAuthenticated ? <InsurancePage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/payment"
          element={isAuthenticated ? <PaymentPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="/mission"
          element={isAuthenticated ? <MissionPage /> : <Navigate to="/login" />}
        />
        <Route path="/dashboard-preview" element={<DashboardPage />} />
      </Routes>
    </LayoutWrapper>
  );
}
