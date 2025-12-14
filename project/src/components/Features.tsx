import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: 'fas fa-robot',
      title: t('features.ai.title'),
      description: t('features.ai.desc'),
      color: 'blue'
    },
    {
      icon: 'fas fa-chart-pie',
      title: t('features.analysis.title'),
      description: t('features.analysis.desc'),
      color: 'green'
    },
    {
      icon: 'fas fa-bullseye',
      title: t('features.goals.title'),
      description: t('features.goals.desc'),
      color: 'purple'
    },
    {
      icon: 'fas fa-bell',
      title: t('features.notifications.title'),
      description: t('features.notifications.desc'),
      color: 'orange'
    },
    {
      icon: 'fas fa-shield-alt',
      title: t('features.security.title'),
      description: t('features.security.desc'),
      color: 'red'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: t('features.mobile.title'),
      description: t('features.mobile.desc'),
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-500',
      green: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-500',
      purple: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-500',
      orange: 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-500',
      red: 'bg-gradient-to-br from-red-50 to-red-100 text-red-500',
      indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('features.title')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${getColorClasses(feature.color)}`}>
                <i className={`${feature.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;