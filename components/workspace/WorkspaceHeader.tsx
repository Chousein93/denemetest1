import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';

type WorkspaceSection = 'home' | 'templates' | 'videos' | 'trash' | 'library' | 'profile';

interface WorkspaceHeaderProps {
  activeSection: WorkspaceSection;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ activeSection }) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'home':
        return t('workspace.home');
      case 'templates':
        return t('workspace.templates');
      case 'videos':
        return t('workspace.videos');
      case 'trash':
        return t('workspace.trash');
      case 'library':
        return t('workspace.library');
      default:
        return t('workspace.workspace');
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.user_metadata?.firstName || (user as any).firstName || '';
    const lastName = user.user_metadata?.lastName || (user as any).lastName || '';
    
    const firstInitial = firstName ? firstName[0].toUpperCase() : '';
    const lastInitial = lastName ? lastName[0].toUpperCase() : '';
    return firstInitial + lastInitial || 'U';
  };

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    window.dispatchEvent(new Event('userStatusChange'));
  };

  const notifications = [
    {
      id: 1,
      title: t('workspace.newTemplateAvailable'),
      message: t('workspace.checkOutNewTemplate'),
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      title: t('workspace.monthlySummaryReady'),
      message: t('workspace.viewYourProgress'),
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: t('workspace.goalAchieved'),
      message: t('workspace.congratulationsGoal'),
      time: '3 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Page Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">{getSectionTitle()}</h1>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder={t('workspace.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'tr' | 'en' | 'de')}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">🇺🇸 EN</option>
            <option value="de">🇩🇪 DE</option>
            <option value="tr">🇹🇷 TR</option>
          </select>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-800">{t('workspace.notifications')}</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-800">{t('workspace.viewAllNotifications')}</button>
                </div>
              </div>
            )}
          </div>

          {/* Create New Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            {t('workspace.newTemplate')}
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {getUserInitials()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {(user?.user_metadata?.firstName || (user as any)?.firstName)} {(user?.user_metadata?.lastName || (user as any)?.lastName) ? (user?.user_metadata?.lastName || (user as any)?.lastName)[0] + '.' : ''}
              </span>
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {(user?.user_metadata?.firstName || (user as any)?.firstName)} {(user?.user_metadata?.lastName || (user as any)?.lastName) || ''}
                      </p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {t('workspace.profileSettings')}
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {t('workspace.accountSettings')}
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {t('workspace.preferences')}
                  </button>
                  <hr className="my-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    {t('workspace.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkspaceHeader;