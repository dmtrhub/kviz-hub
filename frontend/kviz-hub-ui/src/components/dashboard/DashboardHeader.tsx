import React from "react";
import { FaGraduationCap, FaRocket } from "react-icons/fa";

const DashboardHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full shadow-2xl">
            <FaGraduationCap className="text-4xl text-white" />
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mb-3">
          <FaRocket className="text-purple-500 text-xl animate-bounce" />
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Available Quizzes
          </h1>
          <FaRocket className="text-purple-500 text-xl animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        
        <p className="text-gray-600 text-lg lg:text-xl max-w-2xl leading-relaxed">
          Challenge yourself with interactive quizzes and climb the leaderboard!
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;