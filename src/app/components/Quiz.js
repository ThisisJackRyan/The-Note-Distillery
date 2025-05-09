"use client";

import { useState } from "react";

export default function Quiz({ questions }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealedAnswers, setRevealedAnswers] = useState([]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const toggleAnswerReveal = (questionIndex) => {
    setRevealedAnswers((prev) =>
      prev.includes(questionIndex)
        ? prev.filter((i) => i !== questionIndex)
        : [...prev, questionIndex],
    );
  };

  return (
    <div>
      {questions.map((item, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg  bg-gray-700">
          <h4 className="font-semibold mb-2 text-white">
            Question {index + 1}
          </h4>
          <p className=" text-gray-300 mb-2">{item.question}</p>

          <div className="ml-4 space-y-2">
            {item.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  selectedAnswers[index] === optIndex
                    ? "bg-blue-900"
                    : "hover:bg-gray-600"
                }`}
                onClick={() => handleAnswerSelect(index, optIndex)}
              >
                <p
                  className={`text-gray-400 ${
                    revealedAnswers.includes(index) &&
                    optIndex === item.correctAnswer
                      ? "font-bold text-green-400"
                      : ""
                  }`}
                >
                  {String.fromCharCode(65 + optIndex)}. {option}
                </p>
              </div>
            ))}
            <button
              onClick={() => toggleAnswerReveal(index)}
              className="mt-2 px-3 py-1 text-sm bg-gray-600 text-gray-300 rounded hover:bg-gray-500"
            >
              {revealedAnswers.includes(index) ? "Hide Answer" : "Show Answer"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
