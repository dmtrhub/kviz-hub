import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizService } from "../services/QuizService";
import type { LeaderboardEntry, LeaderboardFilter, QuizOption } from "../models/Leaderboard";

// Komponente
import LeaderboardHeader from "../components/leaderboard/LeaderboardHeader";
import LeaderboardFilters from "../components/leaderboard/LeaderboardFilters";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import UserRankCard from "../components/leaderboard/UserRankCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorScreen from "../components/common/ErrorScreen";

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const quizService = new QuizService();
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [quizzes, setQuizzes] = useState<QuizOption[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<LeaderboardFilter>({
    quizId: undefined,
    timePeriod: "all",
    top: 50
  });

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Uzmi leaderboard podatke
        const leaderboardData = await quizService.getLeaderboard(filters);
        setLeaderboard(leaderboardData.entries);
        
        // Uzmi user rank
        const userRankData = await quizService.getMyRank(filters);
        setUserRank(userRankData.entries[0] || null);
        
        // Uzmi listu kvizova za filter
        const quizzesData = await quizService.getAllQuizzes();
        const quizOptions: QuizOption[] = quizzesData.map(quiz => ({
          id: quiz.id,
          title: quiz.title
        }));
        setQuizzes(quizOptions);
        
      } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [filters]);

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
        onRetry={() => window.location.reload()}
        buttonText="Try Again"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-8">
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