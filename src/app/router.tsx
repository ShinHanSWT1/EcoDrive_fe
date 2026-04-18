import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ReactNode } from "react";

// Layouts
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import DashboardPage from "../pages/DashboardPage";
import ReportPage from "../pages/ReportPage";
import InsurancePage from "../pages/InsurancePage";
import InsuranceApplyPage from "../pages/InsuranceApplyPage";
import InsuranceConfirmPage from "../pages/InsuranceConfirmPage";
import InsuranceCheckoutSuccessPage from "../pages/InsuranceCheckoutSuccessPage";
import InsuranceCheckoutFailPage from "../pages/InsuranceCheckoutFailPage";
import AddressSearchPopupPage from "../pages/AddressSearchPopupPage";
import PaymentPage from "../pages/PaymentPage";
import CouponCheckoutPage from "../pages/CouponCheckoutPage";
import CouponCheckoutSuccessPage from "../pages/CouponCheckoutSuccessPage";
import CouponCheckoutFailPage from "../pages/CouponCheckoutFailPage";
import ProfilePage from "../pages/ProfilePage";
import VehicleAddPage from "../pages/VehicleAddPage";
import LoginPage from "../pages/LoginPage";
import OnboardingPage from "../pages/OnboardingPage";
import AdminPage from "../pages/AdminPage";
import MissionPage from "../pages/MissionPage";
import LandingPage from "../pages/LandingPage";
import OAuthCallbackPage from "../pages/OAuthCallbackPage";
import DashboardPreviewPage from "../pages/DashboardPreviewPage";
import type { UserMe } from "../shared/types/api";
import { SuccessPage } from "../features/payment/components/SuccessPage";

interface RouterProps {
  currentUser: UserMe | null;
  isAuthenticated: boolean;
  onLogin: (user: UserMe) => void;
  onLogout: () => void;
  onUserUpdate: (user: UserMe) => void;
}

function RequireAuth({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: ReactNode;
}) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function RequireOnboardingComplete({
  isOnboardingCompleted,
  children,
}: {
  isOnboardingCompleted: boolean;
  children: ReactNode;
}) {
  if (!isOnboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function ProtectedRoute({
  isAuthenticated,
  isOnboardingCompleted,
  children,
}: {
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
  children: ReactNode;
}) {
  return (
    <RequireAuth isAuthenticated={isAuthenticated}>
      <RequireOnboardingComplete isOnboardingCompleted={isOnboardingCompleted}>
        {children}
      </RequireOnboardingComplete>
    </RequireAuth>
  );
}

function OnboardingRoute({
  isAuthenticated,
  isOnboardingCompleted,
  onUserUpdate,
}: {
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
  onUserUpdate: (user: UserMe) => void;
}) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isOnboardingCompleted) {
    return <Navigate to="/" replace />;
  }

  return <OnboardingPage onUserUpdate={onUserUpdate} />;
}

function RedirectIfAuthenticated({
  isAuthenticated,
  shouldGoToOnboarding,
  children,
}: {
  isAuthenticated: boolean;
  shouldGoToOnboarding: boolean;
  children: ReactNode;
}) {
  if (isAuthenticated) {
    return shouldGoToOnboarding ? (
      <Navigate to="/onboarding" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return <>{children}</>;
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
  const isPopupOnlyPage =
    location.pathname === "/address/search-popup" ||
    location.pathname === "/insurance/checkout/success" ||
    location.pathname === "/insurance/checkout/fail" ||
    location.pathname === "/payment/coupon/success" ||
    location.pathname === "/payment/coupon/fail" ||
    location.pathname === "/payment/success" ||
    location.pathname === "/payment/fail";

  // 팝업 전용 페이지는 AppLayout/Header/Nav를 렌더링하지 않는다.
  if (isPopupOnlyPage) {
    return <>{children}</>;
  }

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
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
                <ReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insurance"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
                <InsurancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insurance/apply"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
                <InsuranceApplyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insurance/confirm"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
                <InsuranceConfirmPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insurance/checkout/success"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
                <InsuranceCheckoutSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insurance/checkout/fail"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
                <InsuranceCheckoutFailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/address/search-popup"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
              <AddressSearchPopupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
                <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/checkout"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
              <CouponCheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/coupon/success"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
              <CouponCheckoutSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/coupon/fail"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
              <CouponCheckoutFailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
              <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isOnboardingCompleted={isOnboardingCompleted}
              >
                  <SuccessPage />
              </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
                <ProfilePage onLogout={handleLogout} onUserUpdate={onUserUpdate} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/new"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
              <VehicleAddPage onUserUpdate={onUserUpdate} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated
              isAuthenticated={isAuthenticated}
              shouldGoToOnboarding={shouldGoToOnboarding}
            >
              <LoginPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/onboarding"
          element={
            <OnboardingRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
              onUserUpdate={onUserUpdate}
            />
          }
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="/mission"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboardingCompleted={isOnboardingCompleted}
            >
                <MissionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-preview"
          element={
            canAccessMainApp ? <Navigate to="/" replace /> : <DashboardPreviewPage />
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
