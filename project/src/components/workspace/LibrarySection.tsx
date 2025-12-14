import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { addToTrash } from './TrashManager';

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  category: 'guide' | 'template' | 'article' | 'video' | 'tool' | 'custom';
  type: 'pdf' | 'doc' | 'video' | 'link' | 'image' | 'spreadsheet';
  url?: string;
  fileSize?: string;
  createdAt: string;
  tags: string[];
  icon: string;
  isBookmarked: boolean;
  author?: string;
}

const LibrarySection: React.FC = () => {
  const { t } = useLanguage();
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'custom' as LibraryItem['category'],
    type: 'link' as LibraryItem['type'],
    url: '',
    tags: [] as string[],
    tagInput: ''
  });

  const predefinedItems: LibraryItem[] = [
    {
      id: '1',
      title: t('library.budgetingGuide'),
      description: t('library.budgetingGuideDesc'),
      category: 'guide',
      type: 'pdf',
      fileSize: '2.5 MB',
      createdAt: '2024-01-15',
      tags: ['budgeting', 'beginners', 'finance'],
      icon: '📊',
      isBookmarked: false,
      author: 'Sparlo Team'
    },
    {
      id: '2',
      title: t('library.investmentBasics'),
      description: t('library.investmentBasicsDesc'),
      category: 'article',
      type: 'link',
      url: '#',
      createdAt: '2024-01-10',
      tags: ['investment', 'stocks', 'portfolio'],
      icon: '📈',
      isBookmarked: true,
      author: 'Financial Expert'
    },
    {
      id: '3',
      title: t('library.retirementCalculator'),
      description: t('library.retirementCalculatorDesc'),
      category: 'tool',
      type: 'spreadsheet',
      fileSize: '1.2 MB',
      createdAt: '2024-01-08',
      tags: ['retirement', 'planning', 'calculator'],
      icon: '🔢',
      isBookmarked: false,
      author: 'Sparlo Team'
    },
    {
      id: '4',
      title: t('library.emergencyFundVideo'),
      description: t('library.emergencyFundVideoDesc'),
      category: 'video',
      type: 'video',
      url: '#',
      createdAt: '2024-01-05',
      tags: ['emergency', 'savings', 'security'],
      icon: '🎥',
      isBookmarked: true,
      author: 'Finance Guru'
    },
    {
      id: '5',
      title: t('library.taxPlanningGuide'),
      description: t('library.taxPlanningGuideDesc'),
      category: 'guide',
      type: 'pdf',
      fileSize: '3.8 MB',
      createdAt: '2024-01-03',
      tags: ['tax', 'planning', 'deductions'],
      icon: '📋',
      isBookmarked: false,
      author: 'Tax Professional'
    },
    {
      id: '6',
      title: t('library.debtPayoffTemplate'),
      description: t('library.debtPayoffTemplateDesc'),
      category: 'template',
      type: 'spreadsheet',
      fileSize: '800 KB',
      createdAt: '2024-01-01',
      tags: ['debt', 'payoff', 'strategy'],
      icon: '💰',
      isBookmarked: true,
      author: 'Sparlo Team'
    }
  ];

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('libraryBookmarks');
    const bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
    
    const savedCustomItems = localStorage.getItem('customLibraryItems');
    const customItems = savedCustomItems ? JSON.parse(savedCustomItems) : [];
    
    const allItems = [...predefinedItems, ...customItems];
    const itemsWithBookmarks = allItems.map(item => ({
      ...item,
      isBookmarked: bookmarks.includes(item.id)
    }));
    
    setLibraryItems(itemsWithBookmarks);
  }, []);

  const categories = [
    { id: 'all', name: t('library.all'), icon: '📁' },
    { id: 'guide', name: t('library.guides'), icon: '📖' },
    { id: 'template', name: t('library.templates'), icon: '📋' },
    { id: 'article', name: t('library.articles'), icon: '📰' },
    { id: 'video', name: t('library.videos'), icon: '🎥' },
    { id: 'tool', name: t('library.tools'), icon: '🔧' }
  ];

  const toggleBookmark = (itemId: string) => {
    const updatedItems = libraryItems.map(item => 
      item.id === itemId ? { ...item, isBookmarked: !item.isBookmarked } : item
    );
    setLibraryItems(updatedItems);

    const bookmarks = updatedItems.filter(item => item.isBookmarked).map(item => item.id);
    localStorage.setItem('libraryBookmarks', JSON.stringify(bookmarks));
  };

  const getFileTypeIcon = (type: LibraryItem['type']) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'video': return '🎥';
      case 'link': return '🔗';
      case 'image': return '🖼️';
      case 'spreadsheet': return '📊';
      default: return '📁';
    }
  };

  const filteredItems = libraryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBookmark = !showBookmarksOnly || item.isBookmarked;
    
    return matchesCategory && matchesSearch && matchesBookmark;
  });

  const handleDeleteItem = (itemId: string) => {
    const item = libraryItems.find(i => i.id === itemId);
    if (!item) return;
    
    const confirmMessage = item.category === 'custom' 
      ? t('library.confirmDelete')
      : t('library.confirmRemove');
      
    if (window.confirm(confirmMessage)) {
      // Add to trash instead of immediate deletion
      addToTrash({
        name: item.title,
        type: 'file',
        originalData: item,
        icon: item.icon
      });
      
      const updatedItems = libraryItems.filter(item => item.id !== itemId);
      setLibraryItems(updatedItems);
      
      // Only update localStorage for custom items
      if (item.category === 'custom') {
        const customItems = updatedItems.filter(item => item.category === 'custom');
        localStorage.setItem('customLibraryItems', JSON.stringify(customItems));
      }
    }
  };

  const handleCreateItem = () => {
    if (!newItem.title.trim()) return;

    const tags = newItem.tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const item: LibraryItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      category: newItem.category,
      type: newItem.type,
      url: newItem.url || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      tags: tags,
      icon: newItem.category === 'custom' ? '📄' : '📖',
      isBookmarked: false,
      author: 'You'
    };

    const updatedItems = [...libraryItems, item];
    setLibraryItems(updatedItems);

    const customItems = updatedItems.filter(i => i.category === 'custom');
    localStorage.setItem('customLibraryItems', JSON.stringify(customItems));

    setNewItem({
      title: '',
      description: '',
      category: 'custom',
      type: 'link',
      url: '',
      tags: [],
      tagInput: ''
    });
    setShowAddModal(false);
  };

  const handleItemClick = (item: LibraryItem) => {
    if (item.url) {
      window.open(item.url, '_blank');
    } else {
      // Handle file download or view
      console.log('Opening item:', item.title);
      alert(`${t('library.opening')} "${item.title}"`);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('library.title')}</h1>
        <p className="text-gray-600">{t('library.subtitle')}</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('library.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showBookmarksOnly}
              onChange={(e) => setShowBookmarksOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{t('library.bookmarksOnly')}</span>
          </label>
        </div>

        {/* Category Filter */}
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

      {/* Library Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchTerm || showBookmarksOnly ? t('library.noResults') : t('library.noItems')}
          </h3>
          <p className="text-gray-600">
            {searchTerm || showBookmarksOnly ? t('library.tryDifferentSearch') : t('library.addFirstItem')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getFileTypeIcon(item.type)}</span>
                    {item.fileSize && (
                      <span className="text-xs text-gray-500">{item.fileSize}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(item.id);
                    }}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      item.isBookmarked 
                        ? 'text-yellow-500 hover:text-yellow-600' 
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={item.isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  {/* Show delete button for all items */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 transition-colors duration-200"
                    title={item.category === 'custom' ? t('library.deleteItem') : t('library.removeItem')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.author}</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Resource Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{t('library.addNewResource')}</span>
        </button>
      </div>

      {/* Add New Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('library.addNewResource')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('library.resourceTitle')}
                </label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('library.resourceTitlePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('library.description')}
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder={t('library.descriptionPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('library.category')}
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as LibraryItem['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="custom">{t('library.custom')}</option>
                  <option value="guide">{t('library.guides')}</option>
                  <option value="article">{t('library.articles')}</option>
                  <option value="tool">{t('library.tools')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('library.resourceType')}
                </label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value as LibraryItem['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="link">{t('library.typeLink')}</option>
                  <option value="pdf">{t('library.typePdf')}</option>
                  <option value="doc">{t('library.typeDoc')}</option>
                  <option value="video">{t('library.typeVideo')}</option>
                  <option value="image">{t('library.typeImage')}</option>
                  <option value="spreadsheet">{t('library.typeSpreadsheet')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('library.url')}
                </label>
                <input
                  type="url"
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('library.urlPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('library.tags')}
                </label>
                <input
                  type="text"
                  value={newItem.tagInput}
                  onChange={(e) => setNewItem({ ...newItem, tagInput: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('library.tagsPlaceholder')}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                {t('library.cancel')}
              </button>
              <button
                onClick={handleCreateItem}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                {t('library.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarySection;