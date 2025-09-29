import React from "react";
import type { Question } from "../../models/Question";
import type { UserAnswerResponse } from "../../models/QuizAttempt";
import QuestionItem from "./QuestionItem";

interface QuestionListProps {
  questions: Question[];
  answers: UserAnswerResponse[];
  onSelectOption: (questionId: number, optionId: number, type: string) => void;
  onTextAnswer: (questionId: number, value: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  answers,
  onSelectOption,
  onTextAnswer,
}) => {
  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <QuestionItem
          key={question.id}
          question={question}
          questionNumber={index + 1}
          userAnswer={answers.find(a => a.questionId === question.id)}
          onSelectOption={onSelectOption}
          onTextAnswer={onTextAnswer}
        />
      ))}
    </div>
  );
};

export default QuestionList;