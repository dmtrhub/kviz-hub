import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuizService } from "../services/QuizService";
import type { QuizAttemptResponse } from "../models/QuizAttempt";

// Komponente
import ResultsHeader from "../components/results/ResultsHeader";
import ResultsStats from "../components/results/ResultsStats";
import QuestionResultsList from "../components/results/QuestionResultsList";
import ResultsActions from "../components/results/ResultsActions";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorScreen from "../components/common/ErrorScreen";

const QuizResults: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const quizService = new QuizService();
  
  const [attempt, setAttempt] = useState<QuizAttemptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setError(null);
        console.log("📥 Fetching results for attempt:", attemptId);
        
        const data = await quizService.getQuizResults(Number(attemptId));
        console.log("📊 Raw backend data:", data);
        console.log("🔍 Answers data:", data.answers);
        
        setAttempt(data);
      } catch (err) {
        console.error("❌ Error fetching results:", err);
        setError("Failed to load quiz results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchResults();
    }
  }, [attemptId]);

  if (loading) {
    return <LoadingSpinner message="Loading results..." />;
  }

  if (error || !attempt) {
    return (
      <ErrorScreen 
        message={error || "Results not found"} 
        onRetry={() => navigate("/quizzes")}
        buttonText="Back to Quizzes"
      />
    );
  }

  const percentage = attempt.totalQuestions > 0 
    ? Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ResultsHeader attempt={attempt} percentage={percentage} />
        <ResultsStats attempt={attempt} percentage={percentage} />
        <QuestionResultsList answers={attempt.answers} />
        <ResultsActions 
          onBackToQuizzes={() => navigate("/quizzes")}
          onTryAgain={() => navigate(`/quizzes/${attempt.quizId}`)}
        />
      </div>
    </div>
  );
};

export default QuizResults;