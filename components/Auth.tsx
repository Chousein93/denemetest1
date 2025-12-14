import React, { useState } from 'react';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../constants';
import { Language } from '../types';

interface AuthProps {
  onLogin: (user: any) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, language, onLanguageChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    onLogin({ name: 'Mehmet Mahsun', email });
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">{isLogin ? t.welcomeBack : t.register}</h2>
           <p className="text-gray-500 text-sm mt-1">Please enter your details.</p>
        </div>
        <div className="relative">
           <button 
             type="button"
             onClick={() => setIsLangOpen(!isLangOpen)}
             className="text-2xl hover:scale-110 transition-transform p-1"
           >
             {SUPPORTED_LANGUAGES.find(l => l.code === language)?.flag}
           </button>
           
           {isLangOpen && (
             <>
               <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
               <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg border border-gray-100 p-2 z-50 w-32">
                  {SUPPORTED_LANGUAGES.map(l => (
                      <button 
                        key={l.code} 
                        type="button"
                        onClick={() => {
                            onLanguageChange(l.code as Language);
                            setIsLangOpen(false);
                        }} 
                        className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded text-sm text-left text-gray-700"
                      >
                          <span>{l.flag}</span> {l.label}
                      </button>
                  ))}
               </div>
             </>
           )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="name@company.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all mt-4">
          {isLogin ? t.login : t.register}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-medium hover:underline">
          {isLogin ? t.register : t.login}
        </button>
      </div>
    </div>
  );
};

export default Auth;