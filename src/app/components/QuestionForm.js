"use client";

import { useState } from "react";

export default function QuestionForm({ note, onAskQuestion }) {
  const [userQuestion, setUserQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note || !userQuestion.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const answer = await onAskQuestion(userQuestion);
      setResponse(answer);
      setUserQuestion("");
    } catch (error) {
      setError("Failed to get answer. Please try again.");
      console.error("Error getting answer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="Ask a question about the note..."
            className="flex-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 border-gray-600 text-white"
            disabled={isLoading || !note}
          />
          <button
            type="submit"
            disabled={isLoading || !note || !userQuestion.trim()}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Ask
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-400">Generating answer...</p>
        </div>
      )}

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {response && (
        <div className="mb-4 p-4 border rounded-lg  bg-gray-700">
          <h4 className="font-semibold mb-2 text-white">Answer</h4>
          <p className="text-gray-300 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}
