import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ForgotPasswordProps {
  onClose: () => void;
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose, onBackToLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate password reset process
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        onBackToLogin();
      }, 3000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
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
            <i className="fas fa-key text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('forgot.title')}</h2>
          <p className="text-gray-600">{t('forgot.subtitle')}</p>
        </div>

        {!isSuccess ? (
          <>
            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('forgot.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={t('forgot.emailPlaceholder')}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-600 hover:to-emerald-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t('forgot.loading')}
                  </div>
                ) : (
                  t('forgot.submit')
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <button 
                onClick={onBackToLogin}
                className="text-blue-600 hover:text-blue-500 font-semibold"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                {t('forgot.backToLogin')}
              </button>
            </div>
          </>
        ) : (
          /* Success Message */
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-green-500 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('forgot.successTitle')}</h3>
            <p className="text-gray-600 mb-4">{t('forgot.successMessage')}</p>
            <p className="text-sm text-gray-500">{t('forgot.autoClose')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;