import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import PortfolioPage from './pages/Dashboard';
import Markets from './pages/Markets';
import News from './pages/News';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CryptoData from './pages/Crypto';
import Login from './pages/Login';
import Signup from './pages/SIgnup';
import ProtectedRoute from './components/ProtectedRoutes';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
  };

  return (
    <Router>
      {isAuthenticated && (
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar onLogout={handleLogout} />
            <main className="p-4">
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <PortfolioPage />
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <PortfolioPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/markets"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Markets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/:coin"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <CryptoData />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/news"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <News />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      )}

      {/* Public Routes */}
      {!isAuthenticated && (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
