import React from "react";

interface ResultsTabsProps {
  activeTab: "results" | "progress";
  onTabChange: (tab: "results" | "progress") => void;
}

const ResultsTabs: React.FC<ResultsTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onTabChange("results")}
          className={`px-4 py-2 font-medium ${
            activeTab === "results" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Quiz Results
        </button>
        <button
          onClick={() => onTabChange("progress")}
          className={`px-4 py-2 font-medium ${
            activeTab === "progress" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Progress Charts
        </button>
      </div>
    </div>
  );
};

export default ResultsTabs;