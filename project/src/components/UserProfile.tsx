import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface UserData {
  name: string;
  email: string;
  displayName?: string;
}

interface UserProfileProps {
  userData: UserData;
  onClose: () => void;
  onUserUpdate: (updatedData: UserData) => void;
  onResetFinancialData?: () => void;
  initialTab?: 'profile' | 'account' | 'preferences';
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, onClose, onUserUpdate, onResetFinancialData, initialTab = 'profile' }) => {
  const { t } = useLanguage();
  
  // Map initialTab to specific internal tabs
  const getInitialActiveTab = () => {
    switch (initialTab) {
      case 'profile': return 'personal';
      case 'account': return 'password';
      case 'preferences': return 'notifications';
      default: return 'personal';
    }
  };
  
  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Split name into first and last name
  const nameParts = userData.name.split(' ');
  const [formData, setFormData] = useState({
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: userData.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    dataSharing: false,
    analytics: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const names = fullName.split(' ');
      const displayName = names.length >= 2 
        ? `${names[0]} ${names[names.length - 1][0]}.`
        : fullName;
      
      const updatedData = {
        name: fullName,
        email: formData.email,
        displayName: displayName
      };
      
      onUserUpdate(updatedData);
      setMessage({ type: 'success', text: t('profile.successMessage') });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: t('profile.errorMessage') });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: t('profile.passwordMismatch') });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setMessage({ type: 'success', text: t('profile.passwordChangeSuccess') });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: t('profile.passwordChangeError') });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t('profile.deleteWarning'))) {
      // Handle account deletion
      localStorage.removeItem('userData');
      sessionStorage.removeItem('userData');
      window.dispatchEvent(new Event('userStatusChange'));
      onClose();
      window.location.href = '/';
    }
  };

  // Get title based on initialTab
  const getModalTitle = () => {
    switch (initialTab) {
      case 'profile': return t('workspace.profileSettings');
      case 'account': return t('workspace.accountSettings');
      case 'preferences': return t('workspace.preferences');
      default: return t('profile.title');
    }
  };

  const getModalSubtitle = () => {
    switch (initialTab) {
      case 'profile': return 'Manage your personal information';
      case 'account': return 'Manage your account security and data';
      case 'preferences': return 'Customize your experience';
      default: return t('profile.subtitle');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-emerald-400 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{getModalTitle()}</h2>
              <p className="text-blue-100">{getModalSubtitle()}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 p-4">
            <nav className="space-y-2">
              {/* Profile Settings Group */}
              {(initialTab === 'profile') && (
                <>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-4">
                    {t('workspace.profileSettings')}
                  </div>
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                      activeTab === 'personal' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-user mr-3"></i>
                    {t('profile.personalInfo')}
                  </button>
                </>
              )}
              
              {/* Account Settings Group */}
              {(initialTab === 'account') && (
                <>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-4">
                    {t('workspace.accountSettings')}
                  </div>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                      activeTab === 'password' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-lock mr-3"></i>
                    {t('profile.password')}
                  </button>
                  <button
                    onClick={() => setActiveTab('data')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                      activeTab === 'data' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-database mr-3"></i>
                    {t('profile.dataManagement')}
                  </button>
                </>
              )}
              
              {/* Preferences Group */}
              {(initialTab === 'preferences') && (
                <>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-4">
                    {t('workspace.preferences')}
                  </div>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                      activeTab === 'notifications' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-bell mr-3"></i>
                    {t('profile.notifications')}
                  </button>
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                      activeTab === 'privacy' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-shield-alt mr-3"></i>
                    {t('profile.privacy')}
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {message && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <form onSubmit={handleSavePersonalInfo} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.firstName')}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.lastName')}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {t('profile.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('profile.saveChanges')}
                      </div>
                    ) : (
                      t('profile.saveChanges')
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.currentPassword')}
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.newPassword')}
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {t('profile.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('profile.changePassword')}
                      </div>
                    ) : (
                      t('profile.changePassword')
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{t('profile.emailNotifications')}</h3>
                      <p className="text-gray-600">{t('profile.emailNotificationsDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{t('profile.pushNotifications')}</h3>
                      <p className="text-gray-600">{t('profile.pushNotificationsDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={formData.pushNotifications}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{t('profile.marketingEmails')}</h3>
                      <p className="text-gray-600">{t('profile.marketingEmailsDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="marketingEmails"
                        checked={formData.marketingEmails}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{t('profile.dataSharing')}</h3>
                      <p className="text-gray-600">{t('profile.dataSharingDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="dataSharing"
                        checked={formData.dataSharing}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{t('profile.analytics')}</h3>
                      <p className="text-gray-600">{t('profile.analyticsDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="analytics"
                        checked={formData.analytics}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-red-800 mb-2">{t('profile.deleteAccount')}</h3>
                    <p className="text-red-700 mb-4">{t('profile.deleteWarning')}</p>
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t('profile.deleteAccount')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('profile.dataManagement')}</h2>
                  <p className="text-gray-600">{t('profile.dataManagementDesc')}</p>
                </div>

                {/* Complete Data Reset Section */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('profile.resetData')}</h3>
                      <p className="text-gray-700 mb-4">
                        {t('profile.resetDataDesc')}
                        {' '}<strong className="text-red-600">{t('profile.resetDataWarning')}</strong>
                      </p>
                      
                      <div className="bg-white border border-red-300 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2 text-red-800">{t('profile.whatWillBeDeleted')}</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li className="flex items-center">
                            <i className="fas fa-minus-circle text-red-500 mr-2"></i>
                            {t('profile.allTransactions')}
                          </li>
                          <li className="flex items-center">
                            <i className="fas fa-minus-circle text-red-500 mr-2"></i>
                            {t('profile.allGoals')}
                          </li>
                          <li className="flex items-center">
                            <i className="fas fa-minus-circle text-red-500 mr-2"></i>
                            {t('profile.dashboardStats')}
                          </li>
                          <li className="flex items-center">
                            <i className="fas fa-minus-circle text-red-500 mr-2"></i>
                            {t('profile.activityHistory')}
                          </li>
                          <li className="flex items-center">
                            <i className="fas fa-minus-circle text-red-500 mr-2"></i>
                            {t('profile.customTemplates')}
                          </li>
                          <li className="flex items-center">
                            <i className="fas fa-minus-circle text-red-500 mr-2"></i>
                            {t('profile.libraryItems')}
                          </li>
                          <li className="flex items-center">
                            <i className="fas fa-minus-circle text-red-500 mr-2"></i>
                            {t('profile.trashItems')}
                          </li>
                          <li className="flex items-center">
                            <i className="fas fa-minus-circle text-red-500 mr-2"></i>
                            {t('profile.userSettings')}
                          </li>
                        </ul>
                      </div>
                      
                      <button 
                        onClick={() => {
                          if (window.confirm(t('profile.resetConfirm'))) {
                            if (onResetFinancialData) {
                              onResetFinancialData();
                              setMessage({ type: 'success', text: t('profile.resetSuccess') });
                              setTimeout(() => setMessage(null), 3000);
                            }
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold transition-all duration-200 flex items-center text-lg shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-red-700"
                      >
                        <i className="fas fa-bomb mr-3 text-xl"></i>
                        {t('profile.resetAllData')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Data Export Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-download text-blue-600 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('profile.exportData')}</h3>
                      <p className="text-gray-700 mb-4">
                        {t('profile.exportDataDesc')}
                      </p>
                      <button 
                        onClick={() => {
                          // This would implement data export functionality
                          alert('Data export feature coming soon!');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
                      >
                        <i className="fas fa-file-export mr-2"></i>
                        {t('profile.exportDataButton')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Data Import Section */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-upload text-green-600 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('profile.importData')}</h3>
                      <p className="text-gray-700 mb-4">
                        {t('profile.importDataDesc')}
                      </p>
                      <button 
                        onClick={() => {
                          // This would implement data import functionality
                          alert('Data import feature coming soon!');
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
                      >
                        <i className="fas fa-file-import mr-2"></i>
                        {t('profile.importDataButton')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;