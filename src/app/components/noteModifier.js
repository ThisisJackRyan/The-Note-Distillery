/**
 * Serves as the interface for editing notes, as well as creating new notes
 * - If create mode is set to false, edit mode will be used
 */

'use client';

import { useState } from 'react';
import { validateNote } from "../scripts/noteFactory"

export default function NoteModifier({ onNoteModified, initialNoteObj, createMode=true}) {
  validateNote(initialNoteObj)

  const [note, setNote] = useState({...initialNoteObj})
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Gather values from the form fields
    const formData = new FormData(e.target);
    const updatedNote = {
      title: formData.get("title").trim(),
      summary: formData.get("summary").trim(),
      content: formData.get("content").trim(),
      tags: formData.get("tags").trim(),
    };
  
    // Validate inputs
    if (!updatedNote.title) {
      setError("Note name cannot be empty");
      return;
    }
  
    if (!updatedNote.content) {
      setError("Note text cannot be empty");
      return;
    }
  
    // Add additional properties if in create mode
    if (createMode) {
      updatedNote.id = `temp-${Date.now()}`;
      updatedNote.source = "Image Upload";
      updatedNote.dateCreated = new Date().toISOString();
    }
  
    // Call the parent callback
    onNoteModified(updatedNote);
  
    try {
      // Reset form
      setNote({});
    } catch (err) {
      setError("Failed to create note. Please try again.");
      console.error("Error creating note:", err);
    }
  };

  return (
    <div className="w-150 h-175 inset-0 flex items-center justify-center">
      <div className="h-full w-full flex flex-col justify-center items-center sm:h-auto  p-6 sm:rounded-lg shadow-xl overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {createMode ? "Create New Note" : "Edit Note"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 w-3/4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Note Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title" // Use the `name` attribute to identify the input
              defaultValue={initialNoteObj.title}
              required
              className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Summary
            </label>
            <textarea
              name="summary" // Use the `name` attribute to identify the input
              defaultValue={initialNoteObj.summary}
              rows="5"
              className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Note Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content" // Use the `name` attribute to identify the input
              defaultValue={initialNoteObj.content}
              rows="5"
              required
              className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags" // Use the `name` attribute to identify the input
              defaultValue={initialNoteObj.tags}
              placeholder="Enter tags (optional)"
              className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {createMode ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 