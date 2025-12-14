import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import Hero from '../Hero';
import Features from '../Features';
import Stats from '../Stats';
import Testimonials from '../Testimonials';
import CTA from '../CTA';
import Partnership from '../Partnership';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface SavingsGoal {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
}

interface UserFinancialData {
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  isNewUser: boolean;
}

interface Activity {
  id: string;
  type: 'template_created' | 'transaction_added' | 'goal_set' | 'document_added' | 'template_used';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
}

const WorkspaceHome: React.FC = () => {
  const { t, currency } = useLanguage();
  const { user } = useUser();
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [financialData, setFinancialData] = useState<UserFinancialData>({
    transactions: [],
    savingsGoals: [],
    isNewUser: true
  });

  // Get email from either Supabase user or localStorage user
  const getUserEmail = () => {
    if (user?.email) return user.email;
    const localUser = localStorage.getItem('userData');
    return localUser ? JSON.parse(localUser).email : null;
  };

  const userEmail = getUserEmail();

  useEffect(() => {
    if (userEmail) {
      const financialKey = `financialData_${userEmail}`;
      const storedFinancialData = localStorage.getItem(financialKey);
      
      if (storedFinancialData) {
        const data = JSON.parse(storedFinancialData);
        setFinancialData({
          ...data,
          transactions: data.transactions.map((t: any) => ({
            ...t,
            date: new Date(t.date)
          })),
          savingsGoals: data.savingsGoals.map((g: any) => ({
            ...g,
            deadline: new Date(g.deadline)
          }))
        });
      } else {
        const sampleTransactions: Transaction[] = [
          {
            id: 1,
            type: 'income',
            amount: 5000,
            category: 'Salary',
            description: 'Monthly salary',
            date: new Date(2024, 11, 1)
          },
          {
            id: 2,
            type: 'expense',
            amount: 1200,
            category: 'Rent',
            description: 'Monthly rent payment',
            date: new Date(2024, 11, 5)
          },
          {
            id: 3,
            type: 'expense',
            amount: 300,
            category: 'Groceries',
            description: 'Weekly grocery shopping',
            date: new Date(2024, 11, 10)
          }
        ];

        const sampleGoals: SavingsGoal[] = [
          {
            id: 1,
            title: 'Emergency Fund',
            targetAmount: 10000,
            currentAmount: 3500,
            deadline: new Date(2025, 5, 1),
            priority: 'high'
          },
          {
            id: 2,
            title: 'Vacation',
            targetAmount: 2500,
            currentAmount: 800,
            deadline: new Date(2025, 6, 15),
            priority: 'medium'
          }
        ];

        const newFinancialData = {
          transactions: sampleTransactions,
          savingsGoals: sampleGoals,
          isNewUser: false
        };
        
        setFinancialData(newFinancialData);
        localStorage.setItem(financialKey, JSON.stringify(newFinancialData));
      }
    }
  }, [userEmail]);

  useEffect(() => {
    const loadActivities = () => {
      if (!userEmail) return;
      const stored = localStorage.getItem(`activities_${userEmail}`);
      if (stored) {
        const activities = JSON.parse(stored);
        setRecentActivities(activities.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp)
        })));
      } else {
        const sampleActivities: Activity[] = [
          {
            id: '1',
            type: 'template_created',
            title: t('workspace.newTemplateCreated'),
            description: t('workspace.budgetTemplateCreated'),
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            icon: 'fas fa-plus-circle',
            color: 'text-green-600'
          },
          {
            id: '2',
            type: 'transaction_added',
            title: t('workspace.transactionAdded'),
            description: t('workspace.expenseTracked'),
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            icon: 'fas fa-chart-line',
            color: 'text-blue-600'
          },
          {
            id: '3',
            type: 'goal_set',
            title: t('workspace.goalSet'),
            description: t('workspace.savingsGoalCreated'),
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            icon: 'fas fa-target',
            color: 'text-purple-600'
          }
        ];
        setRecentActivities(sampleActivities);
        localStorage.setItem(`activities_${userEmail}`, JSON.stringify(sampleActivities));
      }
    };

    loadActivities();
  }, [userEmail, t]);

  const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    const updatedActivities = [newActivity, ...recentActivities.slice(0, 9)];
    setRecentActivities(updatedActivities);
    localStorage.setItem(`activities_${userEmail}`, JSON.stringify(updatedActivities));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return t('workspace.justNow');
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} ${t('workspace.minutesAgo')}`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ${t('workspace.hoursAgo')}`;
    return `${Math.floor(diffInSeconds / 86400)} ${t('workspace.daysAgo')}`;
  };

  const quickActions = [
    {
      title: t('workspace.newTemplate'),
      description: t('workspace.createTemplate'),
      icon: 'fas fa-plus-circle',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        addActivity({
          type: 'template_created',
          title: t('workspace.newTemplateCreated'),
          description: t('workspace.budgetTemplateCreated'),
          icon: 'fas fa-plus-circle',
          color: 'text-green-600'
        });
      }
    },
    {
      title: t('workspace.addTransaction'),
      description: t('workspace.trackExpense'),
      icon: 'fas fa-receipt',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        addActivity({
          type: 'transaction_added',
          title: t('workspace.transactionAdded'),
          description: t('workspace.expenseTracked'),
          icon: 'fas fa-chart-line',
          color: 'text-blue-600'
        });
      }
    },
    {
      title: t('workspace.setGoal'),
      description: t('workspace.planSavings'),
      icon: 'fas fa-bullseye',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {
        addActivity({
          type: 'goal_set',
          title: t('workspace.goalSet'),
          description: t('workspace.savingsGoalCreated'),
          icon: 'fas fa-target',
          color: 'text-purple-600'
        });
      }
    },
    {
      title: t('workspace.addDocument'),
      description: t('workspace.uploadFile'),
      icon: 'fas fa-file-upload',
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => {
        addActivity({
          type: 'document_added',
          title: t('workspace.documentAdded'),
          description: t('workspace.fileUploaded'),
          icon: 'fas fa-file',
          color: 'text-orange-600'
        });
      }
    }
  ];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = financialData.transactions.filter(
    t => t.date.getMonth() === currentMonth && t.date.getFullYear() === currentYear
  );
  
  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
  
  const totalGoalsTarget = financialData.savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalGoalsCurrent = financialData.savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const goalsProgress = totalGoalsTarget > 0 ? Math.round((totalGoalsCurrent / totalGoalsTarget) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 relative">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('workspace.dashboard')}
            </h1>
            <p className="text-gray-600">
              {t('workspace.overviewProgress')}
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <i className="fas fa-calendar mr-2"></i>
                {new Date().toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <i className="fas fa-user mr-2"></i>
                {user?.email || 'User'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('finDash.totalIncome')}</h3>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-arrow-up text-green-600 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">{currency}{totalIncome.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">{t('finDash.thisMonth')}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('finDash.totalExpense')}</h3>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-arrow-down text-red-600 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600">{currency}{totalExpense.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">{t('finDash.thisMonth')}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('finDash.netSavings')}</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-piggy-bank text-blue-600 text-xl"></i>
              </div>
            </div>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {currency}{balance.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">{savingsRate}% {t('finDash.savingsRate')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('finDash.goalsProgress')}</h3>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-target text-purple-600 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600">{goalsProgress}%</p>
            <p className="text-sm text-gray-500 mt-2">{financialData.savingsGoals.length} {t('finDash.activeGoals')}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-history mr-3"></i>
            {t('workspace.whereLeftOff')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <i className="fas fa-tasks mr-2"></i>
                <span className="font-medium">{t('workspace.lastActivity')}</span>
              </div>
              <p className="text-sm opacity-90">{t('workspace.budgetReview')}</p>
              <p className="text-xs opacity-75 mt-1">{formatTimeAgo(new Date(Date.now() - 2 * 60 * 60 * 1000))}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <i className="fas fa-chart-line mr-2"></i>
                <span className="font-medium">{t('workspace.progressUpdate')}</span>
              </div>
              <p className="text-sm opacity-90">{savingsRate}% {t('workspace.improvementThisMonth')}</p>
              <p className="text-xs opacity-75 mt-1">{t('workspace.comparedToLastMonth')}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <i className="fas fa-lightbulb mr-2"></i>
                <span className="font-medium">{t('workspace.nextRecommendation')}</span>
              </div>
              <p className="text-sm opacity-90">{t('workspace.reviewExpenseCategories')}</p>
              <button className="text-xs bg-white/20 px-2 py-1 rounded mt-1 hover:bg-white/30 transition-colors">
                {t('workspace.viewDetails')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-chart-area text-green-500 mr-2"></i>
              {t('workspace.monthlyProgress')}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('workspace.savingsProgress')}</span>
                  <span className="text-sm text-gray-500">{savingsRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(savingsRate, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('workspace.goalAchievement')}</span>
                  <span className="text-sm text-gray-500">{goalsProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(goalsProgress, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('workspace.budgetAdherence')}</span>
                  <span className="text-sm text-gray-500">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">{t('workspace.weeklyInsights')}</h4>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const height = Math.random() * 40 + 20;
                  const isToday = index === new Date().getDay() - 1;
                  return (
                    <div key={day} className="text-center">
                      <div className="h-16 flex items-end justify-center mb-2">
                        <div 
                          className={`w-6 rounded-t transition-all duration-500 ${
                            isToday ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                          style={{ height: `${height}px` }}
                        ></div>
                      </div>
                      <span className={`text-xs ${
                        isToday ? 'text-blue-600 font-semibold' : 'text-gray-500'
                      }`}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fas fa-trophy text-yellow-500 mr-2"></i>
                {t('workspace.achievements')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-star text-yellow-600"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t('workspace.firstGoalSet')}</p>
                    <p className="text-sm text-gray-500">{t('workspace.completedToday')}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-chart-line text-green-600"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t('workspace.savingsStreak')}</p>
                    <p className="text-sm text-gray-500">7 {t('workspace.daysInARow')}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-target text-blue-600"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t('workspace.budgetExpert')}</p>
                    <p className="text-sm text-gray-500">{t('workspace.under5Budgets')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <i className="fas fa-analytics text-purple-500 mr-2"></i>
                {t('workspace.quickStats')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('workspace.totalTransactions')}</span>
                  <span className="font-semibold text-gray-900">{financialData.transactions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('workspace.activeGoals')}</span>
                  <span className="font-semibold text-gray-900">{financialData.savingsGoals.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('workspace.avgMonthlySavings')}</span>
                  <span className="font-semibold text-gray-900">{currency}{Math.round(balance * 0.8).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('workspace.bestSavingsMonth')}</span>
                  <span className="font-semibold text-gray-900">{t('workspace.thisMonth')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-list text-blue-500 mr-2"></i>
              {t('finDash.recentTransactions')}
            </h3>
            <div className="space-y-3">
              {financialData.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <i className={`fas ${transaction.type === 'income' ? 'fa-plus' : 'fa-minus'} text-sm ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{currency}{transaction.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <i className="fas fa-bullseye text-purple-500 mr-2"></i>
              {t('finDash.savingsGoals')}
            </h3>
            <div className="space-y-4">
              {financialData.savingsGoals.slice(0, 3).map((goal) => {
                const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount * 100) : 0;
                return (
                  <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {goal.priority === 'high' ? t('finDash.high') : 
                         goal.priority === 'medium' ? t('finDash.medium') : t('finDash.low')}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{currency}{goal.currentAmount.toLocaleString()}</span>
                        <span>{currency}{goal.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{Math.round(progress)}% {t('finDash.completed')}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <i className="fas fa-bolt text-yellow-500 mr-3"></i>
          {t('workspace.quickActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left group`}
            >
              <div className="flex items-center justify-between mb-4">
                <i className={`${action.icon} text-2xl`}></i>
                <i className="fas fa-arrow-right text-sm opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </div>
              <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="fas fa-clock text-blue-500 mr-3"></i>
            {t('workspace.recentActivities')}
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {recentActivities.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <i className={`${activity.icon} ${activity.color}`}></i>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{activity.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                        <p className="text-gray-400 text-xs mt-2">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <i className="fas fa-history text-gray-300 text-3xl mb-4"></i>
                <p className="text-gray-500">{t('workspace.noRecentActivities')}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="fas fa-chart-bar text-green-500 mr-3"></i>
            {t('workspace.quickStats')}
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('workspace.activitiesThisWeek')}</p>
                  <p className="text-2xl font-bold text-blue-600">{recentActivities.length}</p>
                </div>
                <i className="fas fa-clock text-blue-500 text-2xl"></i>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('workspace.templatesUsed')}</p>
                  <p className="text-2xl font-bold text-green-600">12</p>
                </div>
                <i className="fas fa-clipboard-list text-green-500 text-2xl"></i>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{t('workspace.documentsManaged')}</p>
                  <p className="text-2xl font-bold text-purple-600">24</p>
                </div>
                <i className="fas fa-file-alt text-purple-500 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 space-y-16">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-emerald-400 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{t('workspace.heroSection')}</h2>
            <p className="text-blue-100">{t('workspace.heroSectionDesc')}</p>
          </div>
          <div className="p-0">
            <Hero />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{t('workspace.featuresSection')}</h2>
            <p className="text-green-100">{t('workspace.featuresSectionDesc')}</p>
          </div>
          <div className="p-0">
            <Features />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{t('workspace.statsSection')}</h2>
            <p className="text-purple-100">{t('workspace.statsSectionDesc')}</p>
          </div>
          <div className="p-0">
            <Stats />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{t('workspace.partnershipSection')}</h2>
            <p className="text-indigo-100">{t('workspace.partnershipSectionDesc')}</p>
          </div>
          <div className="p-0">
            <Partnership />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{t('workspace.testimonialsSection')}</h2>
            <p className="text-orange-100">{t('workspace.testimonialsSectionDesc')}</p>
          </div>
          <div className="p-0">
            <Testimonials />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-green-500 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{t('workspace.ctaSection')}</h2>
            <p className="text-teal-100">{t('workspace.ctaSectionDesc')}</p>
          </div>
          <div className="p-0">
            <CTA />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceHome;