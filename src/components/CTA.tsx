import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuthModals } from './Header';
import Login from './Login';
import Register from './Register';

const CTA = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {
    showLogin,
    showRegister,
    handleOpenLogin,
    handleCloseModals,
    handleSwitchToRegister,
    handleSwitchToLogin
  } = useAuthModals();

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      setIsLoggedIn(!!userData);
    };
    
    checkLoginStatus();
    
    // Listen for storage changes
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('userStatusChange', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('userStatusChange', checkLoginStatus);
    };
  }, []);

  return (
    <>
      {!isLoggedIn && (
        <section className="py-20 bg-gradient-to-r from-blue-500 to-green-400">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('cta.title.1')}
                <span className="block">{t('cta.title.2')}</span>
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{t('cta.description')}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button 
                  onClick={handleOpenLogin}
                  className="bg-white text-blue-500 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                >
                  <i className="fas fa-rocket mr-2"></i>
                  {t('cta.start')}
                </button>
                <button 
                  onClick={handleOpenLogin}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-green-500 transition-all duration-300 flex items-center"
                >
                  <i className="fas fa-phone mr-2"></i>
                  {t('cta.chat')}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/90">
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-white"></i>
                  <span>{t('cta.free')}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-white"></i>
                  <span>{t('cta.nocard')}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-white"></i>
                  <span>{t('cta.instant')}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Login Modal */}
          {showLogin && (
            <Login 
              onClose={handleCloseModals} 
              onSwitchToRegister={handleSwitchToRegister} 
            />
          )}
          
          {/* Register Modal */}
          {showRegister && (
            <Register 
              onClose={handleCloseModals} 
              onSwitchToLogin={handleSwitchToLogin} 
            />
          )}
        </section>
      )}
    </>
  );
};

export default CTA;