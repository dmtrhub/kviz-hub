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
    return "bg-gradient-to-r from-red-500 to-orange-500";
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
      <div className="py-16 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-slate-900 mb-4"></div>
          <p className="text-slate-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="surface-card rounded-2xl p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Results
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchAllAttempts}
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Quiz Results
          </h2>
          <p className="text-slate-600">
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
        <div className="surface-card rounded-2xl p-6 mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results Grid */}
        {filteredAttempts.length === 0 ? (
          <div className="col-span-full text-center py-20 surface-card rounded-2xl">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {attempts.length === 0
                ? "No attempts recorded yet"
                : "No attempts found"}
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
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
  );
};

export default AdminResults;
