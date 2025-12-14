import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Partnership = () => {
  const { t } = useLanguage();

  const partners = [
    {
      name: 'TechBank',
      logo: 'fas fa-university',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'FinanceSecure',
      logo: 'fas fa-shield-alt',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'CryptoTrust',
      logo: 'fas fa-coins',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'PaymentPro',
      logo: 'fas fa-credit-card',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'InvestSmart',
      logo: 'fas fa-chart-line',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      name: 'SecureVault',
      logo: 'fas fa-lock',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const achievements = [
    {
      number: '150K+',
      label: t('partnership.activeUsers'),
      icon: 'fas fa-users',
      color: 'text-blue-600'
    },
    {
      number: '₺50M+',
      label: t('partnership.totalSavings'),
      icon: 'fas fa-piggy-bank',
      color: 'text-green-600'
    },
    {
      number: '99.9%',
      label: t('partnership.uptime'),
      icon: 'fas fa-server',
      color: 'text-purple-600'
    },
    {
      number: '24/7',
      label: t('partnership.support'),
      icon: 'fas fa-headset',
      color: 'text-orange-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('partnership.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('partnership.subtitle')}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            {t('partnership.trustedPartners')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 group cursor-pointer"
              >
                <div className={`w-16 h-16 ${partner.bgColor} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${partner.logo} ${partner.color} text-2xl`}></i>
                </div>
                <span className="text-gray-700 font-medium text-center">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            {t('partnership.achievements')}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <i className={`${achievement.icon} ${achievement.color} text-xl`}></i>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {achievement.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">
            {t('partnership.trustIndicators')}
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center space-x-3 text-gray-700">
              <i className="fas fa-shield-alt text-green-500 text-xl"></i>
              <span className="font-medium">{t('partnership.bankLevel')}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <i className="fas fa-certificate text-blue-500 text-xl"></i>
              <span className="font-medium">{t('partnership.certified')}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <i className="fas fa-lock text-purple-500 text-xl"></i>
              <span className="font-medium">{t('partnership.encrypted')}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <i className="fas fa-award text-yellow-500 text-xl"></i>
              <span className="font-medium">{t('partnership.awardWinning')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partnership;