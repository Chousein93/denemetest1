import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Target, Activity, MoreVertical, Plus } from 'lucide-react';
import { TRANSLATIONS, MOCK_TRANSACTIONS, INITIAL_GOALS } from '../constants';
import { Language, Goal } from '../types';

interface DashboardProps {
  language: Language;
  onQuickAction: (action: string) => void;
}

const dataIncomeExpense = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
  { name: 'Jul', income: 3490, expense: 4300 },
];

const dataCategories = [
  { name: 'Food', value: 400, color: '#8884d8' },
  { name: 'Rent', value: 300, color: '#82ca9d' },
  { name: 'Ent', value: 300, color: '#ffc658' },
  { name: 'Trans', value: 200, color: '#ff8042' },
];

const Dashboard: React.FC<DashboardProps> = ({ language, onQuickAction }) => {
  const t = TRANSLATIONS[language];
  const [goals] = useState<Goal[]>(INITIAL_GOALS);

  const StatCard = ({ title, value, sub, positive }: { title: string, value: string, sub: string, positive: boolean }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <div className={`mt-2 text-xs font-medium flex items-center gap-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {sub}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t.totalIncome} value="₺45,250" sub="+12.5% vs last month" positive={true} />
        <StatCard title={t.totalExpenses} value="₺12,800" sub="-2.3% vs last month" positive={true} />
        <StatCard title={t.netSavings} value="₺32,450" sub="71% Savings Rate" positive={true} />
        <StatCard title={t.activeGoals} value="3" sub="2 on track" positive={false} />
      </div>

      {/* Main Charts & Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900">Income vs Expense</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataIncomeExpense} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="4 4" />
                <Tooltip />
                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900">{t.activeGoals}</h3>
            <button 
              onClick={() => onQuickAction('setGoal')}
              className="p-1 hover:bg-gray-100 rounded-full text-blue-600 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{goal.title}</span>
                  <span className="text-gray-500">{goal.currency}{goal.currentAmount} / {goal.currency}{goal.targetAmount}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${goal.title.includes('Emergency') ? 'bg-amber-500' : 'bg-blue-500'}`} 
                    style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% completed</span>
                  {goal.hasVideo && <span className="text-purple-500 flex items-center gap-1"><Target size={10} /> Visualized</span>}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4">Expense Categories</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataCategories}>
                  <XAxis dataKey="name" hide />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {dataCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-gray-900">{t.recentActivity}</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Transaction</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {MOCK_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-gray-900 font-medium flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {tx.type === 'income' ? <TrendingUp size={16} /> : <DollarSign size={16} />}
                    </div>
                    {tx.description}
                  </td>
                  <td className="py-4 text-gray-500"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{tx.category}</span></td>
                  <td className="py-4 text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className={`py-4 text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.type === 'income' ? '+' : '-'}₺{tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
