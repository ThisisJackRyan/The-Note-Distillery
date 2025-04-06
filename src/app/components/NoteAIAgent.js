'use client';

import { useState } from 'react';
import Flashcard from './Flashcard';
import Quiz from './Quiz';
import QuestionForm from './QuestionForm';
import { aiService } from '../services/AIService';

export default function NoteAIAgent({ note }) {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleAskQuestion = async (question) => {
    return await aiService.answerQuestion(note, question);
  };

  const generateFlashcards = async () => {
    if (!note) return;
    
    setIsLoading(true);
    setError(null);
    setCurrentCardIndex(0);
    
    try {
      const flashcards = await aiService.generateFlashcards(note);
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
    
    try {
      const quiz = await aiService.generateQuiz(note);
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

  return (
    <div className="mt-6 p-4 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">AI Assistant</h3>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={generateFlashcards}
          disabled={isLoading || !note}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Generate Flashcards
        </button>
        
        <button
          onClick={startQuiz}
          disabled={isLoading || !note}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Start Quiz
        </button>
      </div>

      <QuestionForm note={note} onAskQuestion={handleAskQuestion} />

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">Generating content...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 dark:text-red-400 mb-4">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-4">
          {response[0]?.options ? (
            <Quiz questions={response} />
          ) : (
            <Flashcard 
              card={response[currentCardIndex]} 
              index={currentCardIndex} 
              totalCards={response.length}
              onPrev={prevCard}
              onNext={nextCard}
            />
          )}
        </div>
      )}
    </div>
  );
} 