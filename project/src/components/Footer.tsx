import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-coins text-white text-lg"></i>
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Sparlo.<span className="text-emerald-400">ai</span>
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">{t('footer.description')}</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-gray-700 transition-all duration-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-gray-700 transition-all duration-300">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-gray-700 transition-all duration-300">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-gray-700 transition-all duration-300">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Home */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <i className="fas fa-home mr-2 text-emerald-400"></i>
              {t('nav.home')}
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                <i className="fas fa-chart-line mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                {t('nav.features')}
              </a></li>
              <li><a href="#testimonials" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                <i className="fas fa-star mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                {t('nav.testimonials')}
              </a></li>
              <li><a href="#stats" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                <i className="fas fa-chart-bar mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                {t('nav.stats')}
              </a></li>
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <i className="fas fa-blog mr-2 text-emerald-400"></i>
              Blog
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                <i className="fas fa-lightbulb mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                {t('blog.financialTips') || 'Financial Tips'}
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                <i className="fas fa-graduation-cap mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                {t('blog.education') || 'Education'}
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                <i className="fas fa-newspaper mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                {t('blog.news') || 'News & Updates'}
              </a></li>
            </ul>
          </div>

          {/* Pricing & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <i className="fas fa-tag mr-2 text-emerald-400"></i>
              {t('footer.pricing')}
            </h3>
            <ul className="space-y-3 mb-8">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                <i className="fas fa-gift mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                {t('pricing.free') || 'Free Plan'}
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                <i className="fas fa-crown mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                {t('pricing.premium') || 'Premium'}
              </a></li>
            </ul>
            
            <h4 className="text-md font-semibold mb-4 text-white flex items-center">
              <i className="fas fa-envelope mr-2 text-emerald-400"></i>
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                <i className="fas fa-headset mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                {t('footer.live')}
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                <i className="fas fa-question-circle mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                {t('footer.help')}
              </a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
              <p className="text-gray-400 text-sm md:mr-6">© 2025 Sparlo.ai. {t('footer.rights')}</p>
              <p className="text-gray-500 text-xs mt-1 md:mt-0">{t('footer.tagline') || 'Smart Financial Management for Everyone'}</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">{t('footer.privacy')}</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">{t('footer.terms')}</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">{t('footer.cookies')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;