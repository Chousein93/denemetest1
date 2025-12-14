import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import TemplateGallery from './TemplateGallery';
import TrashManager from './TrashManager';
import LibrarySection from './LibrarySection';
import WorkspaceHome from './WorkspaceHome';
import FinancialDashboard from '../FinancialDashboard';
import UserProfile from '../UserProfile';

type WorkspaceSection = 'home' | 'dashboard' | 'templates' | 'trash' | 'library' | 'profile';

const WorkspaceLayout: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState<'profile' | 'account' | 'preferences' | false>(false);
  const [userData, setUserData] = useState<{name: string; email: string; displayName?: string} | null>(null);

  useEffect(() => {
    const checkUserData = () => {
      const stored = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      if (stored) {
        const data = JSON.parse(stored);
        const names = data.name.split(' ');
        const displayName = names.length >= 2
          ? `${names[0]} ${names[names.length - 1][0]}.`
          : data.name;

        setUserData({
          ...data,
          displayName: displayName
        });
      } else {
        setUserData(null);
      }
    };

    checkUserData();
    window.addEventListener('storage', checkUserData);
    window.addEventListener('userStatusChange', checkUserData);

    return () => {
      window.removeEventListener('storage', checkUserData);
      window.removeEventListener('userStatusChange', checkUserData);
    };
  }, []);

  const handleResetFinancialData = () => {
    if (userData) {
      const financialKey = `financialData_${userData.email}`;
      const zeroData = {
        transactions: [],
        savingsGoals: [],
        isNewUser: true
      };
      localStorage.setItem(financialKey, JSON.stringify(zeroData));

      localStorage.removeItem('customTemplates');
      localStorage.removeItem('hiddenTemplates');
      localStorage.removeItem('customLibraryItems');
      localStorage.removeItem('libraryBookmarks');
      localStorage.removeItem('trashItems');
      localStorage.removeItem('userPreferences');
      localStorage.removeItem('activityHistory');
      localStorage.removeItem('customCategories');
      localStorage.removeItem('userSettings');
      localStorage.removeItem('dashboardSettings');
      localStorage.removeItem('workspaceSettings');

      const userSpecificKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes(userData.email) || key.startsWith('user_'))) {
          userSpecificKeys.push(key);
        }
      }
      userSpecificKeys.forEach(key => localStorage.removeItem(key));

      window.dispatchEvent(new CustomEvent('financialDataUpdate', {
        detail: { userEmail: userData.email, data: zeroData }
      }));

      window.dispatchEvent(new CustomEvent('userDataReset', {
        detail: { userEmail: userData.email, resetType: 'complete' }
      }));

      window.location.reload();
    }
  };

  const sidebarItems = [
    {
      id: 'home' as WorkspaceSection,
      icon: '🏠',
      label: t('workspace.home'),
      isActive: activeSection === 'home'
    },
    {
      id: 'dashboard' as WorkspaceSection,
      icon: '📊',
      label: t('workspace.dashboard'),
      isActive: activeSection === 'dashboard'
    },
    {
      id: 'templates' as WorkspaceSection,
      icon: '📋',
      label: t('workspace.templates'),
      isActive: activeSection === 'templates'
    },
    {
      id: 'trash' as WorkspaceSection,
      icon: '🗑️',
      label: t('workspace.trash'),
      isActive: activeSection === 'trash'
    },
    {
      id: 'library' as WorkspaceSection,
      icon: '📚',
      label: t('workspace.library'),
      isActive: activeSection === 'library'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <WorkspaceHome />;
      case 'dashboard':
        return <FinancialDashboard />;
      case 'templates':
        return <TemplateGallery />;
      case 'trash':
        return <TrashManager />;
      case 'library':
        return <LibrarySection />;
      default:
        return <WorkspaceHome />;
    }
  };

  const getUserInitials = () => {
    if (!userData?.name) return 'U';
    const names = userData.name.split(' ');
    const firstInitial = names[0] ? names[0][0].toUpperCase() : '';
    const lastInitial = names.length > 1 && names[names.length - 1] ? names[names.length - 1][0].toUpperCase() : '';
    return firstInitial + lastInitial || 'U';
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    setUserData(null);
    window.dispatchEvent(new Event('userStatusChange'));
    navigate('/');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('workspace.pleaseLogin')}</h2>
          <p className="text-gray-600">{t('workspace.loginRequired')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Enhanced Header with Logo */}
        <div className="p-4 border-b border-gray-200">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-200 group hover:scale-105" 
            onClick={() => navigate('/')} 
            title={t('workspace.goToHomePage')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center text-white shadow-md group-hover:shadow-xl transition-all duration-200 group-hover:rotate-12">
              <i className="fas fa-coins text-sm"></i>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 flex items-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Sparlo.<span className="text-blue-500">ai</span>
                <i className="fas fa-external-link-alt text-xs ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
              </div>
              <div className="text-xs text-gray-500 font-medium group-hover:text-blue-500 transition-colors duration-200">
                {t('workspace.clickToGoHome')}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder={t('workspace.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-6">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                    item.isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg ring-2 ring-white">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userData?.displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
              </div>
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <button 
                    onClick={() => { setShowUserProfile('profile'); setShowProfileMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <i className="fas fa-user mr-3"></i>
                    {t('workspace.profileSettings')}
                  </button>
                  <button 
                    onClick={() => { setShowUserProfile('account'); setShowProfileMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <i className="fas fa-cog mr-3"></i>
                    {t('workspace.accountSettings')}
                  </button>
                  <button 
                    onClick={() => { setShowUserProfile('preferences'); setShowProfileMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <i className="fas fa-sliders-h mr-3"></i>
                    {t('workspace.preferences')}
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    {t('workspace.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <main className="h-screen overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* User Profile Modal */}
      {showUserProfile && userData && (
        <UserProfile 
          userData={userData}
          initialTab={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          onUserUpdate={(updatedData: {name: string; email: string; displayName?: string}) => {
            localStorage.setItem('userData', JSON.stringify(updatedData));
            window.dispatchEvent(new Event('userStatusChange'));
          }}
          onResetFinancialData={handleResetFinancialData}
        />
      )}
    </div>
  );
};

export default WorkspaceLayout;