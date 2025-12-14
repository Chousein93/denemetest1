import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Testimonials = () => {
  const { t } = useLanguage();
  const { language } = useLanguage();

  // Her dil için uygun etnik görünüme sahip fotoğraflar
  const getTestimonialData = () => {
    if (language === 'tr') {
      return [
        {
          name: t('testimonials.1.name'),
          role: t('testimonials.1.role'),
          content: t('testimonials.1.content'),
          rating: 5,
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' // Türk kadın
        },
        {
          name: t('testimonials.2.name'),
          role: t('testimonials.2.role'),
          content: t('testimonials.2.content'),
          rating: 5,
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150' // Türk erkek
        },
        {
          name: t('testimonials.3.name'),
          role: t('testimonials.3.role'),
          content: t('testimonials.3.content'),
          rating: 5,
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' // Türk kadın
        }
      ];
    } else if (language === 'en') {
      return [
        {
          name: t('testimonials.1.name'),
          role: t('testimonials.1.role'),
          content: t('testimonials.1.content'),
          rating: 5,
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' // Amerikalı kadın
        },
        {
          name: t('testimonials.2.name'),
          role: t('testimonials.2.role'),
          content: t('testimonials.2.content'),
          rating: 5,
          avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150' // Amerikalı erkek
        },
        {
          name: t('testimonials.3.name'),
          role: t('testimonials.3.role'),
          content: t('testimonials.3.content'),
          rating: 5,
          avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150' // Amerikalı kadın
        }
      ];
    } else { // Almanca
      return [
        {
          name: t('testimonials.1.name'),
          role: t('testimonials.1.role'),
          content: t('testimonials.1.content'),
          rating: 5,
          avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150' // Alman kadın
        },
        {
          name: t('testimonials.2.name'),
          role: t('testimonials.2.role'),
          content: t('testimonials.2.content'),
          rating: 5,
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150' // Alman erkek
        },
        {
          name: t('testimonials.3.name'),
          role: t('testimonials.3.role'),
          content: t('testimonials.3.content'),
          rating: 5,
          avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150' // Alman kadın
        }
      ];
    }
  };

  const testimonials = getTestimonialData();

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t('testimonials.title')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('testimonials.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="fas fa-star text-yellow-400"></i>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;