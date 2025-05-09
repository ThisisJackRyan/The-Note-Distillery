"use client";

import { useState } from "react";
import Flashcard from "./Flashcard";
import Quiz from "./Quiz";
import QuestionForm from "./QuestionForm";
import {
  answerQuestion,
  generateFlashcards,
  generateQuiz,
} from "../services/AIService";

export default function NoteAIAgent({ note }) {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [activeOperation, setActiveOperation] = useState("question"); // 'question', 'flashcards', or 'quiz'

  const handleAskQuestion = async (question) => {
    return await answerQuestion(note, question);
  };

  const handleGenerateFlashcards = async () => {
    if (!note) return;

    setIsLoading(true);
    setError(null);
    setCurrentCardIndex(0);
    setActiveOperation("flashcards");

    try {
      const flashcards = await generateFlashcards(note);
      if (flashcards && Array.isArray(flashcards)) {
        setResponse(flashcards);
      } else {
        setError("Failed to generate valid flashcards. Please try again.");
      }
    } catch (error) {
      setError("Failed to generate flashcards. Please try again.");
      console.error("Error generating flashcards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!note) return;

    setIsLoading(true);
    setError(null);
    setCurrentCardIndex(0);
    setActiveOperation("quiz");

    try {
      const quiz = await generateQuiz(note);
      if (quiz && Array.isArray(quiz)) {
        setResponse(quiz);
      } else {
        setError("Failed to generate valid quiz. Please try again.");
      }
    } catch (error) {
      setError("Failed to generate quiz. Please try again.");
      console.error("Error generating quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < response.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const resetOperation = () => {
    setResponse(null);
    setError(null);
    setCurrentCardIndex(0);
    setActiveOperation("question");
  };

  return (
    <div className="mt-6 p-4 border-2 border-indigo-800 rounded-lg bg-gray-900 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-white">AI Assistant</h3>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button
          onClick={handleGenerateFlashcards}
          disabled={isLoading || !note}
          className={`px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 ${
            activeOperation === "flashcards"
              ? "bg-blue-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          Generate Flashcards
        </button>

        <button
          onClick={startQuiz}
          disabled={isLoading || !note}
          className={`px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ${
            activeOperation === "quiz"
              ? "bg-green-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          Start Quiz
        </button>

        <button
          onClick={resetOperation}
          disabled={isLoading || !note}
          className={`px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 ${
            activeOperation === "question"
              ? "bg-purple-500 text-white"
              : "bg-purple-500 text-white"
          }`}
        >
          Ask Question
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-400">Generating content...</p>
        </div>
      )}

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {isLoading == false && activeOperation === "question" && (
        <QuestionForm note={note} onAskQuestion={handleAskQuestion} />
      )}

      {isLoading == false && activeOperation === "flashcards" && response && (
        <div className="mt-4">
          <Flashcard
            card={response[currentCardIndex]}
            index={currentCardIndex}
            totalCards={response.length}
            onPrev={prevCard}
            onNext={nextCard}
          />
        </div>
      )}

      {isLoading == false && activeOperation === "quiz" && response && (
        <div className="mt-4">
          <Quiz questions={response} />
        </div>
      )}
    </div>
  );
}
