'use client';

import { useState, useEffect } from 'react';
import { updateNote } from '@/firebase/firestoreFunctions';

export default function EditNoteModal({ isOpen, onClose, note, folderId, onNoteUpdated }) {
  const [noteName, setNoteName] = useState('');
  const [tags, setTags] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (note) {
      setNoteName(note.name || '');
      setTags(note.tags?.join(', ') || '');
      setText(note.text || '');
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteName.trim()) {
      setError('Note name cannot be empty');
      return;
    }

    if (!text.trim()) {
      setError('Note text cannot be empty');
      return;
    }

    try {
      const updatedNote = {
        ...note,
        name: noteName,
        tags: tags.split(',').map(tag => tag.trim()),
        text: text,
        dateModified: new Date().toISOString()
      };

      await updateNote(folderId, note.id, updatedNote);
      onNoteUpdated(updatedNote);
      
      // Reset form
      setNoteName('');
      setTags('');
      setText('');
      onClose();
    } catch (err) {
      setError('Failed to update note. Please try again.');
      console.error('Error updating note:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Note</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Note Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={noteName}
              onChange={(e) => {
                setNoteName(e.target.value);
                setError('');
              }}
              placeholder="Enter note name"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
         
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter note text"
              rows="5"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags (optional)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 