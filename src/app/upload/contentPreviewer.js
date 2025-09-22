"use client";

import { useState } from "react";
/**
 * If the selected folder field is supplied, then the component will handle pushing the note creation or edit to the database;
 * otherwise, the parent component will have to handle the update in the onNoteModified handler
 *
 * If the createMode prop is set to false, then the modal will run in edit mode
 *
 * @param {*} param0
 * @returns
 */
export default function NoteModifier({ extractedContent, onContentPreviewed }) {
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contentInput = e.target.elements.content.value;

    if (!contentInput.trim()) {
      setError("Content cannot be empty.");
      return;
    }

    setError("");
    onContentPreviewed(contentInput);
  };

  return (
    <div className=" inset-0 flex items-center justify-center">
      <div className="h-full w-full flex flex-col justify-center items-center sm:h-auto px-2 pb-4 sm:rounded-lg overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Preview Note content
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full md:px-4 2xl:w-3/4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Extracted Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              defaultValue={extractedContent}
              required
              className="w-full h-96 max-h-[60vh] overflow-y-auto px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white text-left whitespace-pre-wrap resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
