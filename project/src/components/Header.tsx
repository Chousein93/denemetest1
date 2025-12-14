import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Login from './Login';
import Register from './Register';
import UserProfile from './UserProfile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userData, setUserData] = useState<{name: string; email: string; displayName?: string} | null>(null);
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUserData = () => {
      const stored = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      if (stored) {
        const data = JSON.parse(stored);
        const names = data.name.split(' ');
        const displayName = names.length >= 2
          ? `${names[0]} ${names[names.length - 1][0]}.`
          : data.name;

        setUserData({
          ...data,
          displayName: displayName
        });
      } else {
        setUserData(null);
      }
    };

    checkUserData();
    window.addEventListener('storage', checkUserData);
    window.addEventListener('userStatusChange', checkUserData);

    return () => {
      window.removeEventListener('storage', checkUserData);
      window.removeEventListener('userStatusChange', checkUserData);
    };
  }, []);

  const handleOpenLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
    setIsMenuOpen(false);
  };

  const handleOpenRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
    setIsMenuOpen(false);
  };

  const handleCloseModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowUserProfile(false);
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    setUserData(null);
    window.dispatchEvent(new Event('userStatusChange'));
    navigate('/');
  };

  const getUserInitials = () => {
    if (!userData?.name) return 'U';
    const names = userData.name.split(' ');
    const firstInitial = names[0] ? names[0][0].toUpperCase() : '';
    const lastInitial = names.length > 1 && names[names.length - 1] ? names[names.length - 1][0].toUpperCase() : '';
    return firstInitial + lastInitial || 'U';
  };

  const handleResetFinancialData = () => {
    if (userData) {
      const financialKey = `financialData_${userData.email}`;
      const zeroData = {
        transactions: [],
        savingsGoals: [],
        isNewUser: true
      };
      localStorage.setItem(financialKey, JSON.stringify(zeroData));
      window.dispatchEvent(new CustomEvent('financialDataUpdate', {
        detail: { userEmail: userData.email, data: zeroData }
      }));
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200" onClick={() => navigate('/')} title="Go to Home Page">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center mr-3 hover:scale-105 transition-transform duration-200">
                <i className="fas fa-coins text-white text-lg"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Sparlo.<span className="text-blue-500">ai</span>
              </span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {location.pathname === '/' ? (
                <>
                  <a href="#features" className="text-gray-700 hover:text-blue-500 px-3 py-2 text-sm font-medium transition-colors">{t('nav.features')}</a>
                  <a href="#stats" className="text-gray-700 hover:text-blue-500 px-3 py-2 text-sm font-medium transition-colors">{t('nav.stats')}</a>
                  <a href="#testimonials" className="text-gray-700 hover:text-blue-500 px-3 py-2 text-sm font-medium transition-colors">{t('nav.testimonials')}</a>
                  <a href="#contact" className="text-gray-700 hover:text-blue-500 px-3 py-2 text-sm font-medium transition-colors">{t('nav.contact')}</a>
                </>
              ) : null}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
                {[
                  { code: 'en', flag: '🇺🇸', name: 'English' },
                  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
                  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as 'tr' | 'en' | 'de')}
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 hover:bg-white ${
                      language === lang.code 
                        ? 'bg-white shadow-sm ring-2 ring-blue-500 ring-offset-1' 
                        : 'hover:scale-110'
                    }`}
                    title={lang.name}
                  >
                    <span className="text-lg leading-none">{lang.flag}</span>
                  </button>
                ))}
              </div>
              
              {userData ? (
                <>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                  >
                    <i className="fas fa-tachometer-alt mr-2"></i>
                    {t('nav.dashboard')}
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    {t('nav.logout')}
                  </button>
                  <button 
                    onClick={() => setShowUserProfile(true)}
                    className="text-gray-700 hover:text-blue-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    title={t('nav.settings')}
                  >
                    <Settings size={18} />
                  </button>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white ml-4">
                    <span className="text-white text-sm font-bold tracking-wide">{getUserInitials()}</span>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleOpenLogin}
                    className="text-gray-700 hover:text-blue-500 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {t('nav.login')}
                  </button>
                  <button 
                    onClick={handleOpenRegister}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                  >
                    {t('nav.signup')}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {location.pathname === '/' ? (
                <>
                  <a href="#features" className="text-gray-700 hover:text-blue-500 block px-3 py-2 text-base font-medium">{t('nav.features')}</a>
                  <a href="#stats" className="text-gray-700 hover:text-blue-500 block px-3 py-2 text-base font-medium">{t('nav.stats')}</a>
                  <a href="#testimonials" className="text-gray-700 hover:text-blue-500 block px-3 py-2 text-base font-medium">{t('nav.testimonials')}</a>
                  <a href="#contact" className="text-gray-700 hover:text-blue-500 block px-3 py-2 text-base font-medium">{t('nav.contact')}</a>
                </>
              ) : null}
              <div className="border-t pt-4">
                <div className="px-3 py-2 mb-4">
                  <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-2">
                    {[
                      { code: 'en', flag: '🇺🇸', name: 'English' },
                      { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
                      { code: 'tr', flag: '🇹🇷', name: 'Türkçe' }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code as 'tr' | 'en' | 'de')}
                        className={`flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 ${
                          language === lang.code 
                            ? 'bg-white shadow-sm ring-2 ring-blue-500' 
                            : 'hover:bg-white'
                        }`}
                        title={lang.name}
                      >
                        <span className="text-lg leading-none">{lang.flag}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {userData ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                        <span className="text-white text-sm font-bold tracking-wide">{getUserInitials()}</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {userData.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {userData.email}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button 
                        onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                        className="bg-blue-500 hover:bg-blue-600 text-white block w-full text-left px-3 py-2 rounded-lg text-base font-medium flex items-center"
                      >
                        <i className="fas fa-tachometer-alt mr-2"></i>
                        {t('nav.dashboard')}
                      </button>
                      <button 
                        onClick={() => { setShowUserProfile(true); setIsMenuOpen(false); }}
                        className="text-gray-700 hover:text-blue-500 block w-full text-left px-3 py-2 text-base font-medium bg-gray-50 rounded-lg flex items-center"
                      >
                        <Settings size={18} className="mr-2" />
                        {t('nav.settings')}
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-500 block w-full text-left px-3 py-2 text-base font-medium bg-red-50 rounded-lg flex items-center"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={handleOpenLogin}
                      className="text-gray-700 hover:text-blue-500 block w-full text-left px-3 py-2 text-base font-medium"
                    >
                      {t('nav.login')}
                    </button>
                    <button 
                      onClick={handleOpenRegister}
                      className="bg-blue-500 hover:bg-blue-600 text-white block w-full text-left px-3 py-2 rounded-lg text-base font-medium mt-2"
                    >
                      {t('nav.signup')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {showLogin && (
        <Login 
          onClose={handleCloseModals} 
          onSwitchToRegister={handleSwitchToRegister} 
        />
      )}
      
      {showRegister && (
        <Register 
          onClose={handleCloseModals} 
          onSwitchToLogin={handleSwitchToLogin} 
        />
      )}
      
      {showUserProfile && userData && (
        <UserProfile 
          userData={userData}
          onClose={() => setShowUserProfile(false)}
          onUserUpdate={(updatedData: {name: string; email: string; displayName?: string}) => {
            setUserData(updatedData);
            const storage = localStorage.getItem('userData') ? localStorage : sessionStorage;
            storage.setItem('userData', JSON.stringify(updatedData));
            window.dispatchEvent(new Event('userStatusChange'));
          }}
          onResetFinancialData={handleResetFinancialData}
        />
      )}
    </header>
  );
};

export const useAuthModals = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleOpenLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleOpenRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleCloseModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return {
    showLogin,
    showRegister,
    handleOpenLogin,
    handleOpenRegister,
    handleCloseModals,
    handleSwitchToRegister,
    handleSwitchToLogin
  };
};

export default Header;