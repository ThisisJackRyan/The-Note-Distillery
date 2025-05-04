"use client";

import { useState } from "react";

export default function Flashcard({ card, index, totalCards, onPrev, onNext }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-full max-w-md h-64 perspective-1000 cursor-pointer ${isFlipped ? "flipped" : ""}`}
        onClick={flipCard}
      >
        <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d">
          <div
            className={`absolute w-full h-full backface-hidden ${isFlipped ? "rotate-y-180" : ""} p-6 border rounded-lg bg-gray-700 shadow-lg`}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">
              Question {index + 1}
            </h4>
            <p className="text-gray-300">{card.question}</p>
            <p className="mt-4 text-sm text-gray-400">Click to flip</p>
          </div>
          <div
            className={`absolute w-full h-full backface-hidden ${isFlipped ? "" : "rotate-y-180"} p-6 border rounded-lg bg-blue-900 shadow-lg`}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Answer</h4>
            <p className="text-gray-300">{card.answer}</p>
            <p className="mt-4 text-sm text-gray-400">Click to flip</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-300">
          {index + 1} / {totalCards}
        </span>
        <button
          onClick={onNext}
          disabled={index === totalCards - 1}
          className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
