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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your quiz platform and user results</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;