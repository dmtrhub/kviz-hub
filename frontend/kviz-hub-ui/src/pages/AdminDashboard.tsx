import React, { useState } from 'react';
import { FaChartBar, FaQuestionCircle, FaFolder, FaListAlt } from 'react-icons/fa';
import AdminQuizzes from '../components/admin/AdminQuizzes';
import AdminQuestions from '../components/admin/AdminQuestions';
import AdminCategories from '../components/admin/AdminCategories';
import AdminResults from '../components/admin/AdminResults';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'questions' | 'categories' | 'results'>('quizzes');

  const tabs = [
    { 
      id: 'quizzes' as const, 
      name: 'Quizzes', 
      icon: FaListAlt, 
      component: AdminQuizzes,
      description: 'Manage all quizzes'
    },
    { 
      id: 'questions' as const, 
      name: 'Questions', 
      icon: FaQuestionCircle, 
      component: AdminQuestions,
      description: 'Manage questions and answers'
    },
    { 
      id: 'categories' as const, 
      name: 'Categories', 
      icon: FaFolder, 
      component: AdminCategories,
      description: 'Organize by categories'
    },
    { 
      id: 'results' as const, 
      name: 'Results', 
      icon: FaChartBar, 
      component: AdminResults,
      description: 'View all quiz attempts'
    },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="page-shell">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8 surface-card rounded-2xl p-6 backdrop-blur-sm">
          <nav className="flex overflow-x-auto gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-slate-700 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="mr-2.5 text-base" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Tab Content */}
        <div className="surface-card rounded-2xl p-8 shadow-sm">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;