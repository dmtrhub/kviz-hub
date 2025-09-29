import React, { useState, useMemo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useAdminQuizAttempts } from "../../hooks/useAdminQuizzAttempts";
import type { QuizAttemptResponse } from "../../models/QuizAttempt";
import { StatsCards } from "./StatsCards";
import { AttemptCard } from "./AttemptCard";
import { AttemptDetailsModal } from "./AttemptDetailsModal";

export const AdminResults: React.FC = () => {
  const { attempts, loading, error, fetchAllAttempts } = useAdminQuizAttempts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAttempt, setSelectedAttempt] =
    useState<QuizAttemptResponse | null>(null);

  // Helper functions
  const formatUserId = (userId: string): string => {
    if (userId.includes("@")) return userId.split("@")[0];
    if (userId.length > 15) return `${userId.substring(0, 12)}...`;
    return userId;
  };

  const calculatePercentage = (attempt: QuizAttemptResponse): number => {
    if (attempt.totalQuestions > 0) {
      return Math.round(
        (attempt.correctAnswers / attempt.totalQuestions) * 100
      );
    }
    return 0;
  };

  const calculateDuration = (attempt: QuizAttemptResponse): number => {
    if (!attempt.finishedAt) return 0;
    const start = new Date(attempt.startedAt);
    const end = new Date(attempt.finishedAt);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  };

  // Style helpers
  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (percentage: number): string => {
    if (percentage >= 80)
      return "bg-gradient-to-r from-green-500 to-emerald-600";
    if (percentage >= 60)
      return "bg-gradient-to-r from-yellow-500 to-amber-600";
    if (percentage >= 40) return "bg-gradient-to-r from-orange-500 to-red-600";
    return "bg-gradient-to-r from-red-500 to-pink-600";
  };

  const getStatusColor = (finished: boolean): string => {
    return finished
      ? "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200"
      : "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200";
  };

  // Filtered attempts
  const filteredAttempts = useMemo(
    () =>
      attempts.filter((attempt) =>
        attempt.userId.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [attempts, searchTerm]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <FaTimes className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 ml-3">
                Error Loading Results
              </h3>
            </div>
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchAllAttempts}
              className="mt-4 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Quiz Results
          </h1>
          <p className="text-gray-600 text-lg">
            View and analyze all user attempts
          </p>
        </div>

        {/* Stats */}
        <StatsCards
          attempts={attempts}
          calculatePercentage={calculatePercentage}
          calculateDuration={calculateDuration}
        />

        {/* Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center mb-4">
            <FaSearch className="text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results
            </h3>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid gap-6">
          {filteredAttempts.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="text-gray-400 text-8xl mb-6">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {attempts.length === 0
                  ? "No attempts recorded yet"
                  : "No attempts found"}
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {attempts.length === 0
                  ? "Quiz attempts will appear here once users start taking quizzes."
                  : "Try adjusting your search terms to find what you're looking for."}
              </p>
            </div>
          ) : (
            filteredAttempts.map((attempt) => (
              <AttemptCard
                key={attempt.id}
                attempt={attempt}
                onViewDetails={setSelectedAttempt}
                formatUserId={formatUserId}
                calculatePercentage={calculatePercentage}
                calculateDuration={calculateDuration}
                getScoreColor={getScoreColor}
                getScoreBgColor={getScoreBgColor}
                getStatusColor={getStatusColor}
              />
            ))
          )}
        </div>

        {/* Modal */}
        {selectedAttempt && (
          <AttemptDetailsModal
            attempt={selectedAttempt}
            onClose={() => setSelectedAttempt(null)}
            formatUserId={formatUserId}
            calculatePercentage={calculatePercentage}
            calculateDuration={calculateDuration}
          />
        )}
      </div>
    </div>
  );
};

export default AdminResults;
