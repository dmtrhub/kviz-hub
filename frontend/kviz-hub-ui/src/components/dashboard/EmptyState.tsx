import React from "react";
import { FaQuestionCircle } from "react-icons/fa";

const EmptyState: React.FC = () => {
  return (
    <div className="col-span-full text-center py-12">
      <FaQuestionCircle className="text-gray-400 text-6xl mx-auto mb-4" />
      <p className="text-gray-500 text-lg">No quizzes found matching your criteria.</p>
    </div>
  );
};

export default EmptyState;