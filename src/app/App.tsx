/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import AppRouter from "./router";
import { fetchMe } from "../shared/api/auth";
import { getAccessToken, removeAccessToken } from "../shared/lib/auth";
import type { UserMe } from "../shared/types/api";

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserMe | null>(null);

  const applyAuthenticatedUser = (user: UserMe) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const clearAuthentication = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const shouldRemoveToken = (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return false;
    }

    const status = error.response?.status;
    return status === 401 || status === 403;
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const me = await fetchMe();
        applyAuthenticatedUser(me);
      } catch (error) {
        console.error("인증 복원 실패", error);

        if (shouldRemoveToken(error)) {
          removeAccessToken();
        }

        clearAuthentication();
      } finally {
        setIsInitializing(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = (user: UserMe) => {
    applyAuthenticatedUser(user);
  };

  const updateCurrentUser = (user: UserMe) => {
    applyAuthenticatedUser(user);
  };

  const logout = () => {
    removeAccessToken();
    clearAuthentication();
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium">로그인 상태 확인 중입니다...</p>
      </div>
    );
  }

  return (
    <Router>
      <AppRouter
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onLogin={login}
        onLogout={logout}
        onUserUpdate={updateCurrentUser}
      />
    </Router>
  );
}
