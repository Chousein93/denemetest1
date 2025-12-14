import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuthModals } from './Header';
import Login from './Login';
import Register from './Register';

const SynchronizedSavingsCounter = ({ 
  currency, 
  duration = 10000, 
  steps = 30,
  maxAmount = 3500
}: { 
  currency: string; 
  duration?: number; 
  steps?: number;
  maxAmount?: number;
}) => {
  const { resetKey } = useLanguage();
  const [savedAmount, setSavedAmount] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  // Reset all states when language changes
  useEffect(() => {
    setSavedAmount(0);
    setCurrentDay(0);
    setIsVisible(false);
    setIsAnimating(false);
    setCycleCount(0);
  }, [resetKey]);

  // Generate daily savings amounts that total exactly the maxAmount over 30 days
  const generateDailySavings = (maxAmount: number, currency: string) => {
    // Create clean round numbers based on currency
    let basePattern: number[];
    
    if (currency === '₺') {
      // Turkish Lira - larger round numbers
      basePattern = [
        1600, 1500, 1700, 1800, 1400, 1900, 1700, 1500, 1800, 1600,  // Days 1-10
        1700, 1400, 1900, 1600, 1500, 1800, 1700, 1600, 1500, 1900,  // Days 11-20
        1600, 1800, 1500, 1700, 1600, 1900, 1500, 1800, 1700, 1600   // Days 21-30
      ];
    } else if (currency === '$' || currency === '€') {
      // Dollar and Euro - clean smaller round numbers
      basePattern = [
        50, 45, 55, 60, 40, 65, 55, 45, 60, 50,     // Days 1-10
        55, 40, 65, 50, 45, 60, 55, 50, 45, 65,     // Days 11-20
        50, 60, 45, 55, 50, 65, 45, 60, 55, 50      // Days 21-30
      ];
    } else {
      // Default fallback
      basePattern = [
        50, 45, 55, 60, 40, 65, 55, 45, 60, 50,
        55, 40, 65, 50, 45, 60, 55, 50, 45, 65,
        50, 60, 45, 55, 50, 65, 45, 60, 55, 50
      ];
    }
    
    // Calculate current total
    const currentTotal = basePattern.reduce((sum, amount) => sum + amount, 0);
    
    // Scale to reach exactly the target amount while keeping round numbers
    const scaleFactor = maxAmount / currentTotal;
    let scaledAmounts = basePattern.map(amount => {
      const scaled = amount * scaleFactor;
      // Round to nearest clean number based on currency
      if (currency === '₺') {
        return Math.round(scaled / 100) * 100; // Round to nearest 100
      } else {
        return Math.round(scaled / 5) * 5; // Round to nearest 5 for $ and €
      }
    });
    
    // Ensure the total equals exactly maxAmount by adjusting the last day
    const newTotal = scaledAmounts.reduce((sum, amount) => sum + amount, 0);
    const difference = maxAmount - newTotal;
    scaledAmounts[29] += difference;
    
    return scaledAmounts;
  };

  // Same daily savings amounts as progress bar
  const dailySavings = generateDailySavings(maxAmount, currency);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    // Use the same selector as progress bar to ensure synchronization
    const element = document.querySelector('.animate-progress');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || isAnimating) return;

    setIsAnimating(true);
    let currentStep = 0;
    const stepDuration = duration / steps; // Duration per day

    // Start immediately with Day 1
    const animate = () => {
      if (currentStep < steps) {
        currentStep++;
        setCurrentDay(currentStep);
        
        // Calculate cumulative saved amount using daily savings pattern
        const cumulativeSaved = dailySavings.slice(0, currentStep).reduce((sum, amount) => sum + amount, 0);
        
        setSavedAmount(cumulativeSaved);
        
        // Continue to next day after stepDuration
        if (currentStep < steps) {
          setTimeout(animate, stepDuration);
        } else {
          // Animation complete - ensure exactly maxAmount
          setSavedAmount(maxAmount);
          
          // Wait 3 seconds at 100% then restart
          setTimeout(() => {
            setCycleCount(prev => prev + 1);
            setSavedAmount(0);
            setCurrentDay(0);
            setIsAnimating(false);
            // Trigger restart by changing visibility state
            setIsVisible(false);
            setTimeout(() => setIsVisible(true), 100);
          }, 3000);
        }
      }
    };

    // Start immediately with Day 1
    animate();

    return () => {}; // Cleanup handled by component unmount
  }, [isVisible, duration, steps, isAnimating, dailySavings]);

  return (
    <span>
      {currency}{savedAmount.toLocaleString()}
    </span>
  );
};

const SynchronizedPercentageCounter = ({ 
  duration = 15000,
  steps = 30,
  targetPercent = 100
}: { 
  duration?: number;
  steps?: number;
  targetPercent?: number;
}) => {
  const { resetKey } = useLanguage();
  const [percentage, setPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset when language changes
  useEffect(() => {
    setPercentage(0);
    setIsVisible(false);
    setIsAnimating(false);
  }, [resetKey]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    // Use the same selector as progress bar to ensure synchronization
    const element = document.querySelector('.animate-progress');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || isAnimating) return;

    setIsAnimating(true);
    let currentStep = 0;
    const stepDuration = duration / steps; // Duration per day

    // Start immediately with Day 1
    const animate = () => {
      if (currentStep < steps) {
        currentStep++;
        
        // Calculate exact progress percentage
        const progressPercent = (currentStep / steps) * targetPercent;
        
        setPercentage(Math.round(progressPercent));
        
        // Continue to next day after stepDuration
        if (currentStep < steps) {
          setTimeout(animate, stepDuration);
        } else {
          // Animation complete - ensure exactly targetPercent
          setPercentage(targetPercent);
          
          // Wait 3 seconds at 100% then restart
          setTimeout(() => {
            setPercentage(0);
            setIsAnimating(false);
            // Trigger restart by changing visibility state
            setIsVisible(false);
            setTimeout(() => setIsVisible(true), 100);
          }, 3000);
        }
      }
    };

    // Start immediately with Day 1
    animate();

    return () => {}; // Cleanup handled by component unmount
  }, [isVisible, duration, steps, isAnimating, targetPercent]);

  return <span>{percentage}%</span>;
};

const AnimatedCounter = ({ end, duration = 2000, prefix = '', suffix = '' }: { 
  end: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string; 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const AnimatedProgressBar = ({ 
  targetPercent, 
  duration = 10000, // 10 seconds (faster)
  steps = 30, // 30 days - fixed monthly
  maxAmount = 2500, // Monthly target ₺2500
  currentAmount = 0, // Starting amount
  currency = '₺' // Currency symbol
}: { 
  targetPercent: number; 
  duration?: number;
  steps?: number;
  maxAmount?: number;
  currentAmount?: number;
  currency?: string;
}) => {
  const { t, resetKey } = useLanguage();
  const [width, setWidth] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [savedAmount, setSavedAmount] = useState(currentAmount);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  // Reset all states when language changes
  useEffect(() => {
    setWidth(0);
    setCurrentDay(0);
    setSavedAmount(currentAmount);
    setIsVisible(false);
    setIsAnimating(false);
    setCycleCount(0);
  }, [resetKey, currentAmount]);

  // Generate daily savings amounts that total exactly the maxAmount over 30 days
  const generateDailySavings = (maxAmount: number, currency: string) => {
    // Create clean round numbers based on currency
    let basePattern: number[];
    
    if (currency === '₺') {
      // Turkish Lira - larger round numbers
      basePattern = [
        1600, 1500, 1700, 1800, 1400, 1900, 1700, 1500, 1800, 1600,  // Days 1-10
        1700, 1400, 1900, 1600, 1500, 1800, 1700, 1600, 1500, 1900,  // Days 11-20
        1600, 1800, 1500, 1700, 1600, 1900, 1500, 1800, 1700, 1600   // Days 21-30
      ];
    } else if (currency === '$' || currency === '€') {
      // Dollar and Euro - clean smaller round numbers
      basePattern = [
        50, 45, 55, 60, 40, 65, 55, 45, 60, 50,     // Days 1-10
        55, 40, 65, 50, 45, 60, 55, 50, 45, 65,     // Days 11-20
        50, 60, 45, 55, 50, 65, 45, 60, 55, 50      // Days 21-30
      ];
    } else {
      // Default fallback
      basePattern = [
        50, 45, 55, 60, 40, 65, 55, 45, 60, 50,
        55, 40, 65, 50, 45, 60, 55, 50, 45, 65,
        50, 60, 45, 55, 50, 65, 45, 60, 55, 50
      ];
    }
    
    // Calculate current total
    const currentTotal = basePattern.reduce((sum, amount) => sum + amount, 0);
    
    // Scale to reach exactly the target amount while keeping round numbers
    const scaleFactor = maxAmount / currentTotal;
    let scaledAmounts = basePattern.map(amount => {
      const scaled = amount * scaleFactor;
      // Round to nearest clean number based on currency
      if (currency === '₺') {
        return Math.round(scaled / 100) * 100; // Round to nearest 100
      } else {
        return Math.round(scaled / 5) * 5; // Round to nearest 5 for $ and €
      }
    });
    
    // Ensure the total equals exactly maxAmount by adjusting the last day
    const newTotal = scaledAmounts.reduce((sum, amount) => sum + amount, 0);
    const difference = maxAmount - newTotal;
    scaledAmounts[29] += difference;
    
    return scaledAmounts;
  };

  const dailySavings = generateDailySavings(maxAmount, currency);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.animate-progress');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || isAnimating) return;

    setIsAnimating(true);
    let currentStep = 0;
    const stepDuration = duration / steps; // Duration per day

    // Start immediately with Day 1
    const animate = () => {
      if (currentStep < steps) {
        currentStep++;
        setCurrentDay(currentStep);
        
        // Calculate cumulative saved amount using daily savings pattern
        const cumulativeSaved = dailySavings.slice(0, currentStep).reduce((sum, amount) => sum + amount, 0);
        
        // Calculate progress percentage based on cumulative savings
        const progressPercent = (cumulativeSaved / maxAmount) * targetPercent;
        
        setWidth(progressPercent);
        setSavedAmount(cumulativeSaved);
        
        // Continue to next day after stepDuration
        if (currentStep < steps) {
          setTimeout(animate, stepDuration);
        } else {
          // Animation complete - ensure exactly maxAmount and 100%
          setWidth(targetPercent);
          setSavedAmount(maxAmount);
          
          // Wait 3 seconds at 100% then restart
          setTimeout(() => {
            setCycleCount(prev => prev + 1);
            setWidth(0);
            setSavedAmount(currentAmount);
            setCurrentDay(0);
            setIsAnimating(false);
            // Trigger restart by changing visibility state
            setIsVisible(false);
            setTimeout(() => setIsVisible(true), 100);
          }, 3000);
        }
      }
    };

    // Start immediately with Day 1
    animate();

    return () => {}; // Cleanup handled by component unmount
  }, [isVisible, targetPercent, duration, steps, isAnimating, dailySavings]);

  return (
    <div className="animate-progress">
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div 
          className="bg-gradient-to-r from-blue-500 to-emerald-400 h-3 rounded-full transition-all duration-1000" 
          style={{ width: `${width}%` }}
        ></div>
      </div>
      {/* Day indicator for progress bar - Translatable display */}
      {isVisible && currentDay > 0 && savedAmount > 0 && (
        <div className="text-center mb-2">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {t('hero.dashboard.dayProgress', { day: currentDay, amount: savedAmount.toLocaleString(), currency })}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {t('hero.dashboard.todayAmount', { amount: currentDay > 0 ? dailySavings[currentDay - 1].toLocaleString() : '0', currency })}
          </div>
        </div>
      )}
    </div>
  );
};

const Hero = () => {
  const { t, currency } = useLanguage();
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

  // Get realistic monthly savings target based on currency/country
  const getMonthlyTarget = (currency: string) => {
    switch (currency) {
      case '₺': // Turkey - Average monthly salary ~15,000₺, realistic savings target
        return 50000; // ₺50000 target
      case '$': // USA - Higher income, realistic monthly savings
        return 1500; // $1500 target (higher than saved amount)
      case '€': // Europe - Strong economy, good savings potential
        return 1500; // €1500 target (higher than saved amount)
      case '£': // UK - High cost of living but good wages
        return 1200; // £1200 target (higher than saved amount)
      default:
        return 50000; // Default to Turkey values
    }
  };

  const monthlyTarget = getMonthlyTarget(currency);

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('hero.title.1')} <span className="bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">{t('hero.title.2')}</span>
              <br />
              {t('hero.title.3')}
              <br />
              {t('hero.title.4')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">{t('hero.description')}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {!isLoggedIn ? (
                <button 
                  onClick={handleOpenLogin}
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-600 hover:to-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  {t('hero.cta')}
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-600 hover:to-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <i className="fas fa-tachometer-alt mr-2"></i>
                  {t('hero.dashboard')}
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              )}
            </div>
          </div>

          {/* Right Dashboard Preview */}
          <div className="relative flex justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full animate-float">
              {/* Dashboard Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{t('hero.dashboard.title')}</h3>
              </div>

              {/* Amount Display - Realistic monthly savings */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-500 mb-2">
                    <SynchronizedSavingsCounter currency={currency} duration={15000} steps={30} maxAmount={monthlyTarget} />
                  </div>
                  <div className="text-gray-500 font-medium">{t('hero.dashboard.saved')}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-500 mb-2">
                    <AnimatedCounter end={monthlyTarget} prefix={currency} duration={2400} />
                  </div>
                  <div className="text-gray-500 font-medium">{t('hero.dashboard.target')}</div>
                </div>
              </div>

              {/* Progress Section - Monthly savings target */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">{t('hero.dashboard.progress')}</span>
                  <span className="text-lg font-bold text-gray-900">
                    <SynchronizedPercentageCounter duration={15000} steps={30} targetPercent={100} />
                  </span>
                </div>
                
                {/* Progress Bar - Monthly realistic savings */}
                <AnimatedProgressBar 
                  targetPercent={100} 
                  duration={15000} // 15 seconds (faster)
                  steps={30} // 30 days - FIXED monthly
                  maxAmount={monthlyTarget} // Dynamic monthly target
                  currentAmount={0}
                  currency={currency}
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('hero.dashboard.completion')}</span>
                  <span className="text-xl font-bold text-emerald-500">
                    30 {t('hero.dashboard.days')} {/* Fixed 30 days */}
                  </span>
                </div>
              </div>
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
  );
};

export default Hero;