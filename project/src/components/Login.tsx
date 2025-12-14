import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, isSupabaseAvailable } from '../lib/supabase';
import ForgotPassword from './ForgotPassword';

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onSwitchToRegister }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [registeredEmails] = useState(['test@example.com', 'user@demo.com']); // Simulated registered emails

  const handleGoogleLogin = async () => {
    if (!isSupabaseAvailable()) {
      // Demo modunda Google girişi simülasyonu
      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
        
        // Demo kullanıcı verisi oluştur
        const userData = {
          name: 'Google User',
          email: 'google.user@demo.com',
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        alert(t('login.success'));
        onClose();
        
        // Trigger user status change event
        window.dispatchEvent(new Event('userStatusChange'));
        
        // Navigate to home page
        navigate('/');
      }, 1500);
      return;
    }

    // Gerçek Supabase Google OAuth
    try {
      setIsLoading(true);
      const { data, error } = await supabase!.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Google login error:', error);
        alert(t('login.error') || 'Login failed');
      }
      // OAuth redirect will handle the rest
    } catch (error) {
      console.error('Google login error:', error);
      alert(t('login.error') || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    if (!isSupabaseAvailable()) {
      // Demo modunda Facebook girişi simülasyonu
      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
        
        // Demo kullanıcı verisi oluştur
        const userData = {
          name: 'Facebook User',
          email: 'facebook.user@demo.com',
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        alert(t('login.success'));
        onClose();
        
        // Trigger user status change event
        window.dispatchEvent(new Event('userStatusChange'));
        
        // Navigate to home page
        navigate('/');
      }, 1500);
      return;
    }

    // Gerçek Supabase Facebook OAuth
    try {
      setIsLoading(true);
      const { data, error } = await supabase!.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Facebook login error:', error);
        alert(t('login.error') || 'Login failed');
      }
      // OAuth redirect will handle the rest
    } catch (error) {
      console.error('Facebook login error:', error);
      alert(t('login.error') || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);

      // Get registered user data from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find((u: any) => u.email === formData.email && u.password === formData.password);

      if (!user) {
        alert(t('login.invalidCredentials') || 'Invalid email or password');
        return;
      }

      // Store user data in localStorage if remember me is checked
      const userData = {
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString()
      };

      if (rememberMe) {
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('userData', JSON.stringify(userData));
      }

      alert(t('login.success'));
      onClose();

      // Trigger user status change event
      window.dispatchEvent(new Event('userStatusChange'));

      // Navigate to dashboard
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400"></div>
        
        <div className="p-8">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <i className="fas fa-times text-lg"></i>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ring-4 ring-blue-100">
              <i className="fas fa-coins text-white text-3xl"></i>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">{t('login.title')}</h2>
            <p className="text-gray-600 text-lg">{t('login.subtitle')}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('login.email')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400"
                  placeholder={t('login.emailPlaceholder')}
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <i className="fas fa-envelope"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-4 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400"
                  placeholder={t('login.passwordPlaceholder')}
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <i className="fas fa-lock"></i>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">{t('login.remember')}</span>
              </label>
              <button 
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all"
              >
                {t('login.forgot')}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  {t('login.loading')}
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  {t('login.submit')}
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-6 text-sm text-gray-500 font-medium">{t('login.or')}</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-[1.02] shadow-sm disabled:opacity-50"
            >
              <i className="fab fa-google text-red-500 text-xl mr-3"></i>
              <span className="font-medium text-gray-700">{t('login.google')}</span>
            </button>
            <button 
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-[1.02] shadow-sm disabled:opacity-50"
            >
              <i className="fab fa-facebook text-blue-600 text-xl mr-3"></i>
              <span className="font-medium text-gray-700">{t('login.facebook')}</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {t('login.noAccount')} {' '}
              <button 
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all"
              >
                {t('login.register')}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPassword 
          onClose={() => setShowForgotPassword(false)}
          onBackToLogin={() => setShowForgotPassword(false)}
        />
      )}
    </div>
  );
};

export default Login;