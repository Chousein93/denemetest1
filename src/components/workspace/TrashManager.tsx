import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TrashItem {
  id: string;
  name: string;
  type: 'transaction' | 'goal' | 'template' | 'file';
  originalData: any;
  deletedAt: string;
  expiresAt: string;
  icon: string;
}

const TrashManager: React.FC = () => {
  const { t } = useLanguage();
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'deletedAt' | 'expiresAt'>('deletedAt');

  // Auto-deletion timeout (30 days in milliseconds)
  const AUTO_DELETE_TIMEOUT = 30 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    loadTrashItems();
    const interval = setInterval(checkForExpiredItems, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const loadTrashItems = () => {
    const saved = localStorage.getItem('trashItems');
    if (saved) {
      const items = JSON.parse(saved);
      setTrashItems(items);
      checkForExpiredItems(items);
    }
  };

  const saveTrashItems = (items: TrashItem[]) => {
    localStorage.setItem('trashItems', JSON.stringify(items));
    setTrashItems(items);
  };

  const checkForExpiredItems = (items?: TrashItem[]) => {
    const currentItems = items || trashItems;
    const now = new Date().getTime();
    const nonExpiredItems = currentItems.filter(item => new Date(item.expiresAt).getTime() > now);
    
    if (nonExpiredItems.length !== currentItems.length) {
      saveTrashItems(nonExpiredItems);
    }
  };

  const addToTrash = (item: Omit<TrashItem, 'id' | 'deletedAt' | 'expiresAt'>) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + AUTO_DELETE_TIMEOUT);
    
    const trashItem: TrashItem = {
      ...item,
      id: Date.now().toString(),
      deletedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    const updatedItems = [trashItem, ...trashItems];
    saveTrashItems(updatedItems);
  };

  const restoreItem = (itemId: string) => {
    const item = trashItems.find(i => i.id === itemId);
    if (!item) return;

    // Here you would restore the item to its original location
    // For now, we'll just remove it from trash
    const updatedItems = trashItems.filter(i => i.id !== itemId);
    saveTrashItems(updatedItems);

    // Show success message
    alert(`${t('trash.restored')} "${item.name}"`);
  };

  const permanentlyDelete = (itemId: string) => {
    if (window.confirm(t('trash.confirmPermanentDelete'))) {
      const updatedItems = trashItems.filter(i => i.id !== itemId);
      saveTrashItems(updatedItems);
    }
  };

  const restoreSelected = () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(t('trash.confirmRestoreSelected').replace('{count}', selectedItems.length.toString()))) {
      selectedItems.forEach(restoreItem);
      setSelectedItems([]);
    }
  };

  const deleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(t('trash.confirmDeleteSelected').replace('{count}', selectedItems.length.toString()))) {
      const updatedItems = trashItems.filter(i => !selectedItems.includes(i.id));
      saveTrashItems(updatedItems);
      setSelectedItems([]);
    }
  };

  const emptyTrash = () => {
    if (window.confirm(t('trash.confirmEmptyTrash'))) {
      saveTrashItems([]);
      setSelectedItems([]);
    }
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === trashItems.length 
        ? [] 
        : trashItems.map(item => item.id)
    );
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const remaining = expiry - now;

    if (remaining <= 0) return t('trash.expired');

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} ${t('trash.days')} ${hours} ${t('trash.hours')}`;
    } else {
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours} ${t('trash.hours')} ${minutes} ${t('trash.minutes')}`;
    }
  };

  const sortedItems = [...trashItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'deletedAt':
        return new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime();
      case 'expiresAt':
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('trash.title')}</h1>
        <p className="text-gray-600">{t('trash.subtitle')}</p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-yellow-800">{t('trash.autoDeleteWarning')}</p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      {trashItems.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedItems.length === trashItems.length && trashItems.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                {selectedItems.length > 0 
                  ? `${selectedItems.length} ${t('trash.selected')}`
                  : t('trash.selectAll')
                }
              </span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500"
            >
              <option value="deletedAt">{t('trash.sortByDeleted')}</option>
              <option value="name">{t('trash.sortByName')}</option>
              <option value="expiresAt">{t('trash.sortByExpiry')}</option>
            </select>
          </div>

          <div className="flex space-x-2">
            {selectedItems.length > 0 && (
              <>
                <button
                  onClick={restoreSelected}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors duration-200"
                >
                  {t('trash.restoreSelected')}
                </button>
                <button
                  onClick={deleteSelected}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors duration-200"
                >
                  {t('trash.deleteSelected')}
                </button>
              </>
            )}
            <button
              onClick={emptyTrash}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors duration-200"
            >
              {t('trash.emptyTrash')}
            </button>
          </div>
        </div>
      )}

      {/* Trash Items */}
      {trashItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🗑️</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">{t('trash.empty')}</h3>
          <p className="text-gray-600">{t('trash.emptyDescription')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-lg p-4 transition-colors duration-200 ${
                selectedItems.includes(item.id) ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelectItem(item.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 truncate">{item.name}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                    <span className="text-xs text-gray-500">
                      {t('trash.deletedOn')} {new Date(item.deletedAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-red-600">
                      {t('trash.expiresIn')} {getTimeRemaining(item.expiresAt)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => restoreItem(item.id)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium transition-colors duration-200"
                  >
                    {t('trash.restore')}
                  </button>
                  <button
                    onClick={() => permanentlyDelete(item.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium transition-colors duration-200"
                  >
                    {t('trash.deleteForever')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Export the function to add items to trash for use by other components
export const addToTrash = (item: Omit<TrashItem, 'id' | 'deletedAt' | 'expiresAt'>) => {
  const saved = localStorage.getItem('trashItems');
  const currentItems = saved ? JSON.parse(saved) : [];
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  const trashItem: TrashItem = {
    ...item,
    id: Date.now().toString(),
    deletedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  };

  const updatedItems = [trashItem, ...currentItems];
  localStorage.setItem('trashItems', JSON.stringify(updatedItems));
};

export default TrashManager;