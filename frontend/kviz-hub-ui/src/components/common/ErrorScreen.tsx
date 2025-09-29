import React from "react";

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
  buttonText: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry, buttonText }) => {
  return React.createElement('div', {
    className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 flex items-center justify-center"
  },
    React.createElement('div', { className: "bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center" },
      React.createElement('div', { className: "text-red-500 text-4xl mx-auto mb-4" }, "❌"),
      React.createElement('h2', { className: "text-xl font-semibold text-gray-800 mb-2" }, "Error"),
      React.createElement('p', { className: "text-gray-600 mb-6" }, message),
      React.createElement('button', {
        onClick: onRetry,
        className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      }, buttonText)
    )
  );
};

export default ErrorScreen;