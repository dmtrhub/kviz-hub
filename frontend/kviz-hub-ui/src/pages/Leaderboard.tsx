import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizService } from "../services/QuizService";
import type { LeaderboardEntry, LeaderboardFilter, QuizOption } from "../models/Leaderboard";
import { useAsyncStatus } from "../hooks/useAsyncStatus";

// Komponente
import LeaderboardHeader from "../components/leaderboard/LeaderboardHeader";
import LeaderboardFilters from "../components/leaderboard/LeaderboardFilters";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import UserRankCard from "../components/leaderboard/UserRankCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorScreen from "../components/common/ErrorScreen";

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [quizzes, setQuizzes] = useState<QuizOption[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const { loading, error, execute } = useAsyncStatus({ initialLoading: true });
  
  const [filters, setFilters] = useState<LeaderboardFilter>({
    quizId: undefined,
    timePeriod: "all",
    top: 50
  });

  const fetchLeaderboardData = useCallback(async () => {
    const data = await execute(
      async () => {
        const [leaderboardData, userRankData, quizzesData] = await Promise.all([
          quizService.getLeaderboard(filters),
          quizService.getMyRank(filters),
          quizService.getAllQuizzes(),
        ]);

        return {
          entries: leaderboardData.entries,
          rank: userRankData.entries[0] || null,
          quizOptions: quizzesData.map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
          })),
        };
      },
      {
        errorMessage: "Failed to load leaderboard data. Please try again.",
      }
    );

    if (data) {
      setLeaderboard(data.entries);
      setUserRank(data.rank);
      setQuizzes(data.quizOptions);
    }
  }, [execute, filters]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  const handleFilterChange = (newFilters: LeaderboardFilter) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <LoadingSpinner message="Loading leaderboard..." />;
  }

  if (error) {
    return (
      <ErrorScreen 
        message={error} 
        onRetry={fetchLeaderboardData}
        buttonText="Try Again"
      />
    );
  }

  return (
    <div className="page-shell">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LeaderboardHeader onBackToQuizzes={() => navigate("/quizzes")} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Filteri */}
          <div className="lg:col-span-1">
            <LeaderboardFilters
              filters={filters}
              quizzes={quizzes}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Sadržaj */}
          <div className="lg:col-span-3 space-y-6">
            {/* User Rank Card */}
            {userRank && (
              <UserRankCard userRank={userRank} />
            )}
            
            {/* Leaderboard Table */}
            <LeaderboardTable 
              entries={leaderboard}
              currentUserId={userRank?.userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;