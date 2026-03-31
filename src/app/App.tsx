/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock login/logout for demo purposes
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <Router>
      <AppRouter 
        isAuthenticated={isAuthenticated} 
        onLogin={login} 
        onLogout={logout} 
      />
    </Router>
  );
}

