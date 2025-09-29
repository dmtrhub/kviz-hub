import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuizService } from "../services/QuizService";
import type { 
  QuizAttemptResponse, 
  UserAnswerResponse,
  SubmitQuizRequest 
} from "../models/QuizAttempt";
import type { Question } from "../models/Question";
import type { Quiz } from "../models/Quiz";

// Komponente
import QuizHeader from "../components/quiz/QuizHeader";
import QuestionList from "../components/quiz/QuestionList";
import QuizFooter from "../components/quiz/QuizFooter";
import LoadingSpinner from "../components/common/LoadingSpinner";

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quizService = new QuizService();

  const hasStartedRef = useRef(false);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<QuizAttemptResponse | null>(null);
  const [answers, setAnswers] = useState<UserAnswerResponse[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const startQuiz = async () => {
      try {
        console.log("🔄 Starting quiz...");
        
        // Učitaj kviz podatke
        const quizData = await quizService.getQuizById(Number(id));
        setQuiz(quizData);
        setQuestions(quizData.questions ?? []);
        setTimeLeft(quizData.timeLimit * 60);

        // Kreiraj attempt
        const attemptData = await quizService.startQuiz(Number(id));
        setAttempt(attemptData);
        
        setQuizStarted(true);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error starting quiz:", error);
        navigate("/quizzes");
      }
    };

    if (id) {
      startQuiz();
    }
  }, [id, navigate]);

  // Timer
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0 || !attempt) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, attempt, quizStarted]);

  const handleSelectOption = (questionId: number, optionId: number, type: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);

      if (type === "SingleChoice" || type === "TrueFalse") {
        const newAnswer: UserAnswerResponse = { 
          questionId, 
          selectedOptionIds: [optionId],
          questionText: "", 
          questionType: type,
          isCorrect: false,
          points: 0,
          details: [],
          textAnswer: ""
        };
        return [...prev.filter((a) => a.questionId !== questionId), newAnswer];
      }

      if (type === "MultipleChoice") {
        if (!existing) {
          const newAnswer: UserAnswerResponse = {  
            questionId, 
            selectedOptionIds: [optionId],
            questionText: "",
            questionType: type,
            isCorrect: false,
            points: 0,
            details: [],
            textAnswer: ""
          };
          return [...prev, newAnswer];
        }

        const selected = existing.selectedOptionIds || [];
        const updated = selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId];

        const updatedAnswer: UserAnswerResponse = {  
          ...existing,
          selectedOptionIds: updated
        };

        return [
          ...prev.filter((a) => a.questionId !== questionId),
          updatedAnswer,
        ];
      }

      return prev;
    });
  };

  const handleTextAnswer = (questionId: number, value: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      const updatedAnswer: UserAnswerResponse = {  
        questionId, 
        textAnswer: value,
        selectedOptionIds: existing?.selectedOptionIds || [],
        questionText: existing?.questionText || "",
        questionType: existing?.questionType || "FillInBlank",
        isCorrect: existing?.isCorrect || false,
        points: existing?.points || 0,
        details: existing?.details || []
      };
      
      return !existing 
        ? [...prev, updatedAnswer]
        : [...prev.filter(a => a.questionId !== questionId), updatedAnswer];
    });
  };

  const prepareSubmitData = (): SubmitQuizRequest => {
    const submitAnswers = questions.map(question => {
      const userAnswer = answers.find(a => a.questionId === question.id);
      
      if (question.type === "FillInBlank") {
        return {
          questionId: question.id,
          selectedAnswerOptionIds: [],
          textAnswer: userAnswer?.textAnswer || ""
        };
      } else {
        return {
          questionId: question.id,
          selectedAnswerOptionIds: userAnswer?.selectedOptionIds || [],
          textAnswer: ""
        };
      }
    });

    return { answers: submitAnswers };
  };

  const handleSubmit = async (): Promise<void> => {
    if (!attempt || submitting) return;
    
    setSubmitting(true);
    
    try {
      const payload = prepareSubmitData();
      await quizService.submitQuiz(attempt.id, payload.answers);
      navigate(`/quiz-results/${attempt.id}`);
    } catch (error) {
      console.error("❌ Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Starting quiz..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuizHeader
          quiz={quiz}
          attempt={attempt}
          timeLeft={timeLeft}
          answersCount={answers.length}
          totalQuestions={questions.length}
        />

        <QuestionList
          questions={questions}
          answers={answers}  
          onSelectOption={handleSelectOption}
          onTextAnswer={handleTextAnswer}
        />

        <QuizFooter
          answersCount={answers.length}
          totalQuestions={questions.length}
          onSubmit={handleSubmit}
          submitting={submitting}
          onNavigateBack={() => navigate("/quizzes")}
        />
      </div>
    </div>
  );
};

export default QuizPage;