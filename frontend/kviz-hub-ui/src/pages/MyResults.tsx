import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizService } from "../services/QuizService";
import type { MyQuizResult, QuizProgress } from "../models/MyResults";
import { useAsyncStatus } from "../hooks/useAsyncStatus";

// Komponente
import MyResultsHeader from "../components/my-results/MyResultsHeader";
import ResultsTabs from "../components/my-results/ResultsTabs";
import QuizResultsList from "../components/my-results/QuizResultsList";
import ProgressCharts from "../components/my-results/ProgressCharts";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorScreen from "../components/common/ErrorScreen";

const MyResults: React.FC = () => {
  const navigate = useNavigate();
  
  const [quizResults, setQuizResults] = useState<MyQuizResult[]>([]);
  const [quizProgress, setQuizProgress] = useState<QuizProgress[]>([]);
  const { loading, error, execute } = useAsyncStatus({ initialLoading: true });
  const [activeTab, setActiveTab] = useState<"results" | "progress">("results");

  const fetchMyResults = useCallback(async () => {
    const data = await execute(
      async () => {
        const [resultsData, progressData] = await Promise.all([
          quizService.getMyResults(),
          quizService.getMyProgress(),
        ]);

        return {
          resultsData,
          progressData,
        };
      },
      {
        errorMessage: "Failed to load your results. Please try again.",
      }
    );

    if (data) {
      setQuizResults(data.resultsData);
      setQuizProgress(data.progressData);
    }
  }, [execute]);

  useEffect(() => {
    fetchMyResults();
  }, [fetchMyResults]);

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
    <div className="page-shell">
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