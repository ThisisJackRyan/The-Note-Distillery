'use client';

import { useState } from 'react';
import { validateNote } from "../scripts/noteFactory"
import noteFactory from "../scripts/noteFactory"
import { addNewNote } from '@/firebase/firestoreFunctions';

/**
 * If the selected folder field is supplied, then the component will handle pushing the note creation or edit to the database;
 * otherwise, the parent component will have to handle the update in the onNoteModified handler
 * 
 * If the createMode prop is set to false, then the modal will run in edit mode
 * 
 * @param {*} param0 
 * @returns 
 */
export default function NoteModifier({ onNoteModified, initialNoteObj, createMode=true, selectedFolder=null}) {
  validateNote(initialNoteObj)

  const [finalNote, setFinalNote] = useState(null)
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Gather values from the form fields
    const formData = new FormData(e.target);
    const finalNote = {
      ...initialNoteObj,
      name: formData.get("name").trim(),
      summary: formData.get("summary").trim(),
      content: formData.get("content").trim(),
      tags: formData.get("tags").trim(),
    }
  
    // Validate inputs
    if (!finalNote.name) {
      setError("Note name cannot be empty");
      return;
    }
  
    if (!finalNote.content) {
      setError("Note text cannot be empty");
      return;
    }

    if(createMode) handleCreateNote(finalNote)
    else handleEditNote(finalNote)
  
    // Call the parent callback
    onNoteModified(finalNote);
  };

  // Handles the actual note creation action after the new note's info has been submitted, and the interface is in creation mode
  const handleCreateNote = async (finalNote) => {
    finalNote.id = `temp-${Date.now()}`;
    finalNote.source = "Image Upload";
    finalNote.dateCreated = new Date().toISOString();

    if(selectedFolder){
      addNewNote(
        selectedFolder.id, 
        finalNote.name, 
        finalNote.source, 
        finalNote.tags, 
        finalNote.summary, 
        finalNote.content
      )
    }
  }

  // Handles the actual edit action after the updated note info has been submitted, and the interface is in edit mode
  const handleEditNote = async(finalNote) => {
    if(selectedFolder){
      addNewNote(
        selectedFolder.id, 
        finalNote.id, 
        {
          name: finalNote.name,
          text: finalNote.text,
          tags: finalNote.tags,
          dateModified: finalNote.dateModified
        }
      )
    }
  }

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
              name="name" // Use the `name` attribute to identify the input
              defaultValue={initialNoteObj.name}
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