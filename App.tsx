import React, { useState } from 'react';
import { 
  LayoutDashboard, Wallet, Settings, LogOut, Menu, User, 
  Globe, Plus, Sparkles, Mic, Video, Trash2, RotateCcw,
  PiggyBank, Plane, Calculator, TrendingUp, BookOpen, CreditCard, FileText
} from 'lucide-react';
import { TRANSLATIONS, INITIAL_TEMPLATES, SUPPORTED_LANGUAGES } from './constants';
import { AppState, Language, Template } from './types';
import Login from './components/Auth';
import Dashboard from './components/Dashboard';
import AIAdvisor from './components/AIFinancialAdvisor';
import SmartActions from './components/SmartActions';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    language: 'en',
    isAuthenticated: false,
    activeTab: 'dashboard',
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [isSmartActionsOpen, setIsSmartActionsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const t = TRANSLATIONS[state.language];

  // --- Handlers ---
  const handleLogin = (user: any) => {
    setState(prev => ({ ...prev, isAuthenticated: true, user }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, isAuthenticated: false, user: null }));
  };

  const toggleLanguage = (lang: Language) => {
    setState(prev => ({ ...prev, language: lang }));
  };

  const addToLibrary = (id: string) => {
    setTemplates(prev => prev.map(tpl => tpl.id === id ? { ...tpl, isSaved: true, isInTrash: false } : tpl));
  };

  const moveToTrash = (id: string) => {
    setTemplates(prev => prev.map(tpl => tpl.id === id ? { ...tpl, isSaved: false, isInTrash: true } : tpl));
  };

  const restoreFromTrash = (id: string) => {
    setTemplates(prev => prev.map(tpl => tpl.id === id ? { ...tpl, isSaved: true, isInTrash: false } : tpl));
  };

  const deletePermanently = (id: string) => {
    setTemplates(prev => prev.filter(tpl => tpl.id !== id));
  };

  // --- Icon Helper ---
  const getIconComponent = (iconName: string, size: number = 24) => {
    const icons: Record<string, React.ReactNode> = {
      LayoutDashboard: <LayoutDashboard size={size} />,
      PiggyBank: <PiggyBank size={size} />,
      Plane: <Plane size={size} />,
      Calculator: <Calculator size={size} />,
      Video: <Video size={size} />,
      TrendingUp: <TrendingUp size={size} />,
      BookOpen: <BookOpen size={size} />,
      CreditCard: <CreditCard size={size} />,
      FileText: <FileText size={size} />,
      Wallet: <Wallet size={size} />
    };
    return icons[iconName] || <Wallet size={size} />;
  };

  // --- Render ---
  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Login onLogin={handleLogin} language={state.language} onLanguageChange={toggleLanguage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800 font-sans flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-xl lg:shadow-none
      `}>
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-50">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-gray-900">FinGemini</h1>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">Pro Dashboard</span>
          </div>
        </div>

        {/* User Greeting */}
        <div className="p-6 pb-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Overview</div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
              {state.user?.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.greeting},</p>
              <p className="font-semibold text-gray-900">{state.user?.name}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <button 
            onClick={() => setState(prev => ({...prev, activeTab: 'dashboard'}))}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${state.activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={20} />
            {t.dashboard}
          </button>
          
          <button 
            onClick={() => setState(prev => ({...prev, activeTab: 'library'}))}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${state.activeTab === 'library' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <div className="relative">
                <Wallet size={20} />
                {templates.filter(t => t.isSaved && !t.isInTrash).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
            </div>
            {t.library}
          </button>

          <button 
            onClick={() => setState(prev => ({...prev, activeTab: 'trash'}))}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${state.activeTab === 'trash' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <div className="relative">
                <Trash2 size={20} />
                {templates.filter(t => t.isInTrash).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </div>
            {t.trash}
          </button>
        </nav>

        {/* AI FABs in Sidebar (Desktop) */}
        <div className="p-4 space-y-2">
           <button 
             onClick={() => setIsAIAdvisorOpen(true)}
             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
           >
             <Mic size={18} className="group-hover:scale-110 transition-transform"/>
             <span className="font-medium text-sm">{t.financialAdvisor}</span>
           </button>
           
           <button 
             onClick={() => setIsSmartActionsOpen(true)}
             className="w-full bg-white border border-gray-200 text-gray-700 p-3 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
           >
             <Sparkles size={18} className="text-purple-500" />
             <span className="font-medium text-sm">{t.smartAnalysis}</span>
           </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between relative">
           <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 p-2 rounded-lg"
              >
                <Globe size={16} />
                {SUPPORTED_LANGUAGES.find(l => l.code === state.language)?.flag}
              </button>
              
              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                  <div className="absolute bottom-full left-0 mb-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <button 
                        key={lang.code}
                        onClick={() => {
                            toggleLanguage(lang.code as Language);
                            setIsLangOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span>{lang.flag}</span> {lang.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
           </div>
           <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
             <LogOut size={20} />
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 shrink-0 z-10 sticky top-0">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600">
               <Menu size={24} />
             </button>
             <div className="text-sm text-gray-500 font-medium">
                {new Date().toLocaleDateString(state.language === 'en' ? 'en-US' : state.language === 'de' ? 'de-DE' : 'tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </div>
           </div>
           
           <div className="flex items-center gap-4">
             <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
               <User size={20} />
             </button>
           </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-20">
             
             {state.activeTab === 'dashboard' && (
               <>
                 <Dashboard language={state.language} onQuickAction={() => {}} />
                 
                 {/* Templates Section */}
                 <div className="pt-8">
                   <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <Wallet size={24} className="text-blue-600"/>
                     Available Templates
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {templates.filter(t => !t.isInTrash).map(tpl => (
                        <div key={tpl.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group relative">
                          {/* Control Panel */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                             {!tpl.isSaved ? (
                               <button onClick={() => addToLibrary(tpl.id)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" title="Save to Library">
                                 <Plus size={16} />
                               </button>
                             ) : (
                               <button onClick={() => moveToTrash(tpl.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Move to Trash">
                                 <Trash2 size={16} />
                               </button>
                             )}
                          </div>

                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                             tpl.type === 'video' ? 'bg-purple-100 text-purple-600' : 
                             tpl.type === 'calculator' ? 'bg-orange-100 text-orange-600' : 
                             'bg-blue-100 text-blue-600'
                          }`}>
                              {getIconComponent(tpl.icon)}
                          </div>
                          <h3 className="font-semibold text-gray-900">{tpl.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                             {tpl.type === 'video' ? 'AI Generated Video' : 'Financial Template'}
                          </p>
                        </div>
                      ))}
                   </div>
                 </div>
               </>
             )}

             {state.activeTab === 'library' && (
                <div className="min-h-[50vh]">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Wallet size={24} className="text-blue-600"/>
                    My Library
                  </h2>
                  <p className="text-gray-500 mb-8">Your saved templates and financial guides.</p>
                  
                  {templates.filter(t => t.isSaved && !t.isInTrash).length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                      <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                        <Wallet size={32} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Library is Empty</h3>
                      <p className="text-gray-500">Save templates from the dashboard to see them here.</p>
                      <button onClick={() => setState(prev => ({...prev, activeTab: 'dashboard'}))} className="mt-4 text-blue-600 font-medium hover:underline">
                        Go to Dashboard
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {templates.filter(t => t.isSaved && !t.isInTrash).map(tpl => (
                        <div key={tpl.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group relative">
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => moveToTrash(tpl.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Move to Trash">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                             tpl.type === 'video' ? 'bg-purple-100 text-purple-600' : 
                             tpl.type === 'calculator' ? 'bg-orange-100 text-orange-600' : 
                             'bg-blue-100 text-blue-600'
                          }`}>
                              {getIconComponent(tpl.icon)}
                          </div>
                          <h3 className="font-semibold text-gray-900">{tpl.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">Saved Template</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
             )}

             {state.activeTab === 'trash' && (
                <div className="min-h-[50vh]">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Trash2 size={24} className="text-red-500"/>
                    Trash Bin
                  </h2>
                  <p className="text-gray-500 mb-8">Deleted templates. You can restore them or delete permanently.</p>
                  
                  {templates.filter(t => t.isInTrash).length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                      <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                        <Trash2 size={32} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Trash is Empty</h3>
                      <p className="text-gray-500">Items moved to trash will appear here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {templates.filter(t => t.isInTrash).map(tpl => (
                        <div key={tpl.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm opacity-75 hover:opacity-100 transition-all group relative">
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button onClick={() => restoreFromTrash(tpl.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Restore">
                              <RotateCcw size={16} />
                            </button>
                            <button onClick={() => deletePermanently(tpl.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Delete Permanently">
                              <X size={16} />
                            </button>
                          </div>
                          
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gray-100 text-gray-400">
                              {getIconComponent(tpl.icon)}
                          </div>
                          <h3 className="font-semibold text-gray-500">{tpl.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">Deleted Item</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
             )}
          </div>
        </div>
      </main>

      {/* AI Modals */}
      <AIAdvisor isOpen={isAIAdvisorOpen} onClose={() => setIsAIAdvisorOpen(false)} />
      <SmartActions isOpen={isSmartActionsOpen} onClose={() => setIsSmartActionsOpen(false)} />

    </div>
  );
};

// Simple X icon helper for local component usage
const X = ({size}:{size:number}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default App;