/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router";
import { fetchMe } from "../shared/api/auth";
import { getAccessToken, removeAccessToken } from "../shared/lib/auth";
import type { UserMe } from "../shared/types/api";

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserMe | null>(null);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const me = await fetchMe();
        setCurrentUser(me);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("인증 복원 실패", error);
        removeAccessToken();
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsInitializing(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = (user: UserMe) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const updateCurrentUser = (user: UserMe) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeAccessToken();
    setCurrentUser(null);
    setIsAuthenticated(false);
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
