import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface StatItem {
  number: string;
  label: string;
  icon: string;
  color: string;
}

const Stats: React.FC = () => {
  const { language } = useLanguage();

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-500',
      green: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-500',
      purple: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-500',
      orange: 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStats = (): StatItem[] => {
    switch (language) {
      case 'tr':
        return [
          { number: '50K+', label: 'Aktif Kullanıcı', icon: 'fas fa-users', color: 'blue' },
          { number: '₺2.5M+', label: 'Toplam Tasarruf', icon: 'fas fa-coins', color: 'green' },
          { number: '95%', label: 'Müşteri Memnuniyeti', icon: 'fas fa-star', color: 'purple' },
          { number: '24/7', label: 'Destek Hizmeti', icon: 'fas fa-headset', color: 'orange' }
        ];
      case 'de':
        return [
          { number: '50K+', label: 'Aktive Benutzer', icon: 'fas fa-users', color: 'blue' },
          { number: '€2.5M+', label: 'Gesamtersparnisse', icon: 'fas fa-coins', color: 'green' },
          { number: '95%', label: 'Kundenzufriedenheit', icon: 'fas fa-star', color: 'purple' },
          { number: '24/7', label: 'Support-Service', icon: 'fas fa-headset', color: 'orange' }
        ];
      case 'en':
      default:
        return [
          { number: '50K+', label: 'Active Users', icon: 'fas fa-users', color: 'blue' },
          { number: '$2.5M+', label: 'Total Savings', icon: 'fas fa-coins', color: 'green' },
          { number: '95%', label: 'Customer Satisfaction', icon: 'fas fa-star', color: 'purple' },
          { number: '24/7', label: 'Support Service', icon: 'fas fa-headset', color: 'orange' }
        ];
    }
  };

  const stats = getStats();

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto ${getColorClasses(stat.color)}`}>
                <i className={`${stat.icon} text-2xl`}></i>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;