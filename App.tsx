import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

const AppContent = () => {
  const { resetKey } = useLanguage();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      setIsLoggedIn(!!userData);
    };

    checkAuth();
    window.addEventListener('userStatusChange', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('userStatusChange', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Check if we're on the dashboard/workspace page
  const isWorkspacePage = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-white" key={resetKey}>
      {/* Only show Header when not on workspace page */}
      {!isWorkspacePage && <Header key={`header-${resetKey}`} />}
      <Routes>
        <Route
          path="/"
          element={<Home key={`home-${resetKey}`} />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard key={`dashboard-${resetKey}`} /> : <Navigate to="/" replace />}
        />
      </Routes>
      {/* Only show Footer when not on workspace page */}
      {!isWorkspacePage && <Footer key={`footer-${resetKey}`} />}
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;