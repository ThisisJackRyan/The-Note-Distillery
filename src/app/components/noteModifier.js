"use client";

import { useState, useRef } from "react";
import { validateNote } from "../scripts/noteFactory";
import { addNewNote } from "@/firebase/firestoreFunctions";
import { sampleSummary } from "../scripts/sampleText";

/**
 * If the selected folder field is supplied, then the component will handle pushing the note creation or edit to the database;
 * otherwise, the parent component will have to handle the update in the onNoteModified handler
 *
 * If the createMode prop is set to false, then the modal will run in edit mode
 *
 * @param {*} param0
 * @returns
 */
export default function NoteModifier({
  onNoteModified,
  initialNoteObj,
  createMode = true,
  selectedFolder = null,
}) {
  validateNote(initialNoteObj);

  const [error, setError] = useState("");
  const [summaryButtonEnabled, setSummaryButtonEnabled] = useState(
    initialNoteObj.content && initialNoteObj.content.trim() !== "",
  );

  const contentFieldRef = useRef(null);
  const summaryFieldRef = useRef(null);

  const handleContentChanged = (e) => {
    const hasContent = e.target.value.trim() !== "";
    setSummaryButtonEnabled(hasContent);
  };

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
    };

    // Validate inputs
    if (!finalNote.name) {
      setError("Note name cannot be empty");
      return;
    }

    if (!finalNote.content) {
      setError("Note text cannot be empty");
      return;
    }

    if (createMode) handleCreateNote(finalNote);
    else handleEditNote(finalNote);

    // Call the parent callback
    onNoteModified(finalNote);
  };

  // Generate AI summary from content
  const handleAISummary = async () => {
    if (!contentFieldRef.current?.value) return;

    // Here you would normally call an API to generate the summary
    // For now, we'll just use a placeholder
    //const content = contentFieldRef.current.value;
    const aiSummary = sampleSummary; //await handleAISummary(content)

    // Update the summary field with the generated summary
    if (summaryFieldRef.current) {
      summaryFieldRef.current.value = aiSummary;
    }
  };

  // Handles the actual note creation action after the new note's info has been submitted, and the interface is in creation mode
  const handleCreateNote = async (finalNote) => {
    finalNote.id = `temp-${Date.now()}`;
    finalNote.source = "Image Upload";
    finalNote.dateCreated = new Date().toISOString();

    if (selectedFolder) {
      addNewNote(
        selectedFolder.id,
        finalNote.name,
        finalNote.source,
        finalNote.tags,
        finalNote.summary,
        finalNote.content,
      );
    }
  };

  // Handles the actual edit action after the updated note info has been submitted, and the interface is in edit mode
  const handleEditNote = async (finalNote) => {
    if (selectedFolder) {
      addNewNote(selectedFolder.id, finalNote.id, {
        name: finalNote.name,
        text: finalNote.text,
        tags: finalNote.tags,
        dateModified: finalNote.dateModified,
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center sm:h-auto  p-6 sm:rounded-lg shadow-xl">
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
            name="name"
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
            name="summary"
            ref={summaryFieldRef}
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
            name="content"
            ref={contentFieldRef}
            defaultValue={initialNoteObj.content}
            onChange={handleContentChanged}
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
            name="tags"
            defaultValue={initialNoteObj.tags}
            placeholder="Enter tags (optional)"
            className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            disabled={!summaryButtonEnabled}
            onClick={handleAISummary}
            className={`px-4 py-2 rounded-md ${
              summaryButtonEnabled
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
          >
            Generate AI Summary
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {createMode ? "Create" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
