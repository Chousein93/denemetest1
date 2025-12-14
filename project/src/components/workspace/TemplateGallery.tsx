import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { addToTrash } from './TrashManager';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'budget' | 'savings' | 'expense' | 'investment' | 'custom';
  icon: string;
  isCustom: boolean;
  createdAt: string;
  data?: any;
}

const TemplateGallery: React.FC = () => {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [hiddenTemplates, setHiddenTemplates] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'custom' as Template['category']
  });

  const predefinedTemplates: Template[] = [
    {
      id: 'monthly-budget',
      name: t('templates.monthlyBudget'),
      description: t('templates.monthlyBudgetDesc'),
      category: 'budget',
      icon: '📊',
      isCustom: false,
      createdAt: new Date().toISOString(),
      data: {
        income: [
          { category: 'salary', amount: 5000 },
          { category: 'freelance', amount: 1000 }
        ],
        expenses: [
          { category: 'rent', amount: 1500 },
          { category: 'groceries', amount: 500 },
          { category: 'transport', amount: 300 }
        ]
      }
    },
    {
      id: 'emergency-fund',
      name: t('templates.emergencyFund'),
      description: t('templates.emergencyFundDesc'),
      category: 'savings',
      icon: '🛡️',
      isCustom: false,
      createdAt: new Date().toISOString(),
      data: {
        goal: 10000,
        monthlyContribution: 500,
        timeline: 20
      }
    },
    {
      id: 'vacation-savings',
      name: t('templates.vacationSavings'),
      description: t('templates.vacationSavingsDesc'),
      category: 'savings',
      icon: '✈️',
      isCustom: false,
      createdAt: new Date().toISOString(),
      data: {
        goal: 3000,
        monthlyContribution: 250,
        timeline: 12
      }
    },
    {
      id: 'expense-tracker',
      name: t('templates.expenseTracker'),
      description: t('templates.expenseTrackerDesc'),
      category: 'expense',
      icon: '💳',
      isCustom: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'investment-portfolio',
      name: t('templates.investmentPortfolio'),
      description: t('templates.investmentPortfolioDesc'),
      category: 'investment',
      icon: '📈',
      isCustom: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'debt-payoff',
      name: t('templates.debtPayoff'),
      description: t('templates.debtPayoffDesc'),
      category: 'budget',
      icon: '💰',
      isCustom: false,
      createdAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    const savedTemplates = localStorage.getItem('customTemplates');
    const customTemplates = savedTemplates ? JSON.parse(savedTemplates) : [];
    
    // Load hidden templates list
    const savedHiddenTemplates = localStorage.getItem('hiddenTemplates');
    const hiddenTemplateIds = savedHiddenTemplates ? JSON.parse(savedHiddenTemplates) : [];
    setHiddenTemplates(hiddenTemplateIds);
    
    // Filter out hidden predefined templates
    const visiblePredefinedTemplates = predefinedTemplates.filter(
      template => !hiddenTemplateIds.includes(template.id)
    );
    
    setTemplates([...visiblePredefinedTemplates, ...customTemplates]);
  }, []);

  const categories = [
    { id: 'all', name: t('templates.all'), icon: '📁' },
    { id: 'budget', name: t('templates.budget'), icon: '📊' },
    { id: 'savings', name: t('templates.savings'), icon: '💰' },
    { id: 'expense', name: t('templates.expense'), icon: '💳' },
    { id: 'investment', name: t('templates.investment'), icon: '📈' },
    { id: 'custom', name: t('templates.custom'), icon: '⚙️' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) return;

    const template: Template = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      icon: '📋',
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    const updatedTemplates = [...templates, template];
    setTemplates(updatedTemplates);

    const customTemplates = updatedTemplates.filter(t => t.isCustom);
    localStorage.setItem('customTemplates', JSON.stringify(customTemplates));

    setNewTemplate({ name: '', description: '', category: 'custom' });
    setShowCreateModal(false);
  };

  const handleUseTemplate = (template: Template) => {
    // Here you would integrate with your financial dashboard
    console.log('Using template:', template);
    alert(`${t('templates.usingTemplate')} "${template.name}"`);
  };

  const handleRestoreHiddenTemplates = () => {
    if (hiddenTemplates.length === 0) {
      alert(t('templates.noHiddenTemplates'));
      return;
    }

    if (window.confirm(t('templates.confirmRestoreHidden'))) {
      // Get the hidden predefined templates
      const hiddenPredefinedTemplates = predefinedTemplates.filter(
        template => hiddenTemplates.includes(template.id)
      );
      
      // Add them back to visible templates
      const updatedTemplates = [...templates, ...hiddenPredefinedTemplates];
      setTemplates(updatedTemplates);
      
      // Clear hidden templates
      setHiddenTemplates([]);
      localStorage.removeItem('hiddenTemplates');
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const confirmMessage = template.isCustom 
      ? t('templates.confirmDelete')
      : t('templates.confirmDeletePredefined');

    if (window.confirm(confirmMessage)) {
      // Add to trash instead of immediate deletion
      addToTrash({
        name: template.name,
        type: 'template',
        originalData: template,
        icon: template.icon
      });
      
      if (template.isCustom) {
        // For custom templates, remove from storage
        const updatedTemplates = templates.filter(t => t.id !== templateId);
        setTemplates(updatedTemplates);
        
        const customTemplates = updatedTemplates.filter(t => t.isCustom);
        localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
      } else {
        // For predefined templates, just hide them
        const updatedHiddenTemplates = [...hiddenTemplates, templateId];
        setHiddenTemplates(updatedHiddenTemplates);
        localStorage.setItem('hiddenTemplates', JSON.stringify(updatedHiddenTemplates));
        
        // Remove from visible templates
        const updatedTemplates = templates.filter(t => t.id !== templateId);
        setTemplates(updatedTemplates);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('templates.title')}</h1>
        <p className="text-gray-600">{t('templates.subtitle')}</p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Create New Template Button and Restore Hidden Templates */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <span>+</span>
          <span>{t('templates.createNew')}</span>
        </button>
        
        {hiddenTemplates.length > 0 && (
          <button
            onClick={handleRestoreHiddenTemplates}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{t('templates.restoreHidden')} ({hiddenTemplates.length})</span>
          </button>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
                  {template.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{template.category}</p>
                </div>
              </div>
              {/* Show delete button for all templates */}
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                title={template.isCustom ? t('templates.deleteTemplate') : t('templates.hideTemplate')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(template.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleUseTemplate(template)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {t('templates.useTemplate')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">{t('templates.noTemplates')}</h3>
          <p className="text-gray-600">{t('templates.createFirstTemplate')}</p>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('templates.createNew')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('templates.templateName')}
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('templates.templateNamePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('templates.description')}
                </label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder={t('templates.descriptionPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('templates.category')}
                </label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as Template['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="custom">{t('templates.custom')}</option>
                  <option value="budget">{t('templates.budget')}</option>
                  <option value="savings">{t('templates.savings')}</option>
                  <option value="expense">{t('templates.expense')}</option>
                  <option value="investment">{t('templates.investment')}</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                {t('templates.cancel')}
              </button>
              <button
                onClick={handleCreateTemplate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                {t('templates.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;