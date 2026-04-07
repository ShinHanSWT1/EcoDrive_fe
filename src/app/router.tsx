import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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
import OAuthCallbackPage from "../pages/OAuthCallbackPage";
import type { UserMe } from "../shared/types/api";

interface RouterProps {
  currentUser: UserMe | null;
  isAuthenticated: boolean;
  onLogin: (user: UserMe) => void;
  onLogout: () => void;
  onUserUpdate: (user: UserMe) => void;
}

function LayoutWrapper({
  children,
  currentUser,
  isAuthenticated,
  onLogout,
}: {
  children: ReactNode;
  currentUser: UserMe | null;
  isAuthenticated: boolean;
  onLogout: () => void;
}) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return <AdminLayout onLogout={onLogout}>{children}</AdminLayout>;
  }

  return (
    <AppLayout
      currentUser={currentUser}
      isAuthenticated={isAuthenticated}
      onLogout={onLogout}
    >
      {children}
    </AppLayout>
  );
}

export default function AppRouter({
  currentUser,
  isAuthenticated,
  onLogin,
  onLogout,
  onUserUpdate,
}: RouterProps) {
  const navigate = useNavigate();
  const isOnboardingCompleted = currentUser?.isOnboardingCompleted ?? false;
  const canAccessMainApp = isAuthenticated && isOnboardingCompleted;
  const shouldGoToOnboarding = isAuthenticated && !isOnboardingCompleted;
  const handleLogout = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  return (
    <LayoutWrapper
      currentUser={currentUser}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
    >
      <Routes>
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <LandingPage />
            ) : shouldGoToOnboarding ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <DashboardPage />
            )
          }
        />
        <Route
          path="/report"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboardingCompleted ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <ReportPage />
            )
          }
        />
        <Route
          path="/insurance"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboardingCompleted ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <InsurancePage />
            )
          }
        />
        <Route
          path="/payment"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboardingCompleted ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <PaymentPage />
            )
          }
        />
        <Route
          path="/profile"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboardingCompleted ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <ProfilePage />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage onLogin={onLogin} />
            ) : shouldGoToOnboarding ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : isOnboardingCompleted ? (
              <Navigate to="/" replace />
            ) : (
              <OnboardingPage onUserUpdate={onUserUpdate} />
            )
          }
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="/mission"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isOnboardingCompleted ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <MissionPage />
            )
          }
        />
        <Route
          path="/dashboard-preview"
          element={
            canAccessMainApp ? (
              <Navigate to="/" replace />
            ) : !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
        <Route
          path="/oauth/callback"
          element={<OAuthCallbackPage onLogin={onLogin} />}
        />
      </Routes>
    </LayoutWrapper>
  );
}
