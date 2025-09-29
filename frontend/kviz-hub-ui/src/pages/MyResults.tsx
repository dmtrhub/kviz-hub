import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizService } from "../services/QuizService";
import type { MyQuizResult, QuizProgress } from "../models/MyResults";

// Komponente
import MyResultsHeader from "../components/my-results/MyResultsHeader";
import ResultsTabs from "../components/my-results/ResultsTabs";
import QuizResultsList from "../components/my-results/QuizResultsList";
import ProgressCharts from "../components/my-results/ProgressCharts";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorScreen from "../components/common/ErrorScreen";

const MyResults: React.FC = () => {
  const navigate = useNavigate();
  const quizService = new QuizService();
  
  const [quizResults, setQuizResults] = useState<MyQuizResult[]>([]);
  const [quizProgress, setQuizProgress] = useState<QuizProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"results" | "progress">("results");

  useEffect(() => {
    const fetchMyResults = async () => {
      try {
        setError(null);
        
        const resultsData = await quizService.getMyResults();
        setQuizResults(resultsData);

        const progressData = await quizService.getMyProgress();
        setQuizProgress(progressData);
        
      } catch (err) {
        console.error("❌ Error fetching results:", err);
        setError("Failed to load your results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyResults();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your results..." />;
  }

  if (error) {
    return (
      <ErrorScreen 
        message={error || "Failed to load results"} 
        onRetry={() => navigate("/quizzes")}
        buttonText="Back to Quizzes"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <MyResultsHeader onBackToQuizzes={() => navigate("/quizzes")} />
        <ResultsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === "results" ? (
          <QuizResultsList 
            results={quizResults} 
            onViewDetails={(attemptId) => navigate(`/quiz-results/${attemptId}`)}
          />
        ) : (
          <ProgressCharts progress={quizProgress} />
        )}
      </div>
    </div>
  );
};

export default MyResults;