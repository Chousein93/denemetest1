import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, isSupabaseAvailable } from '../lib/supabase';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose, onSwitchToLogin }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registeredEmails] = useState(['test@example.com', 'user@demo.com']); // Simulated registered emails

  const handleGoogleRegister = async () => {
    // Demo modunda Google kayıt simülasyonu
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
      alert(t('register.success'));
      onClose();
      
      // Trigger user status change event
      window.dispatchEvent(new Event('userStatusChange'));
      
      // Navigate to home page
      navigate('/');
    }, 2000);
  };

  const handleFacebookRegister = async () => {
    // Demo modunda Facebook kayıt simülasyonu
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
      alert(t('register.success'));
      onClose();
      
      // Trigger user status change event
      window.dispatchEvent(new Event('userStatusChange'));
      
      // Navigate to home page
      navigate('/');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert(t('register.passwordMismatch'));
      return;
    }

    if (!acceptTerms) {
      alert(t('register.acceptTerms'));
      return;
    }

    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);

      // Get existing users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

      // Check if email already exists
      if (registeredUsers.some((u: any) => u.email === formData.email)) {
        alert(t('register.emailExists'));
        return;
      }

      // Add new user to registered users
      registeredUsers.push({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Store user data after successful registration
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      alert(t('register.success'));
      onClose();

      // Trigger user status change event
      window.dispatchEvent(new Event('userStatusChange'));

      // Navigate to dashboard
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user-plus text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('register.title')}</h2>
          <p className="text-gray-600">{t('register.subtitle')}</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.firstName')}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t('register.firstNamePlaceholder')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.lastName')}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t('register.lastNamePlaceholder')}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('register.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder={t('register.emailPlaceholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('register.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t('register.passwordPlaceholder')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('register.confirmPassword')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t('register.confirmPasswordPlaceholder')}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="flex items-start">
            <input 
              type="checkbox" 
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1" 
            />
            <span className="ml-2 text-sm text-gray-600">
              {t('register.terms')} {' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">{t('register.termsLink')}</a>
              {' '} {t('register.and')} {' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">{t('register.privacyLink')}</a>
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !acceptTerms}
            className="w-full bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-600 hover:to-emerald-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {t('register.loading')}
              </div>
            ) : (
              t('register.submit')
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">{t('register.or')}</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Social Register */}
        <div className="space-y-3">
          <button 
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <i className="fab fa-google text-red-500 mr-3"></i>
            {t('register.google')}
          </button>
          <button 
            onClick={handleFacebookRegister}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <i className="fab fa-facebook text-blue-600 mr-3"></i>
            {t('register.facebook')}
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('register.hasAccount')} {' '}
            <button 
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-500 font-semibold"
            >
              {t('register.login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;