/**
 * Serves as the interface for editing notes, as well as creating new notes
 */

'use client';

import { useState } from 'react';
import { addNewNote } from '@/firebase/firestoreFunctions';
import Modal from './modal'
import imageUpload from './fileUploader';

export default function NewNoteModal({ onNoteCreated, initialContent='', initialSummary=''}) {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState(initialContent);
  const [summary, setSummary] = useState(initialSummary);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Note name cannot be empty');
      return;
    }

    if (!content.trim()) {
      setError('Note text cannot be empty');
      return;
    }

    try {
      // Create a temporary note object
      const newNote = {
        id: `temp-${Date.now()}`,
        name: title,
        source: "Image Upload",
        tags: tags.split(',').map(tag => tag.trim()),
        summary: summary,
        content: content,
        dateCreated: new Date().toISOString()
      };

      // Update UI immediately
      onNoteCreated(newNote);
      
      // Then try to save to Firebase
      //await addNewNote(selectedFolder.id, title, extractedText ? 'Image Upload' : 'Manual Entry', tags.split(',').map(tag => tag.trim()), summary, text);
      
      // TO-DO Add logic for returning contents of note

      // Reset form
      setTitle('');
      setTags('');
      setContent('');
    } catch (err) {
      setError('Failed to create note. Please try again.');
      console.error('Error creating note:', err);
    }
  };

  return (
    <Modal
    content={

    <div className="inset-0 bg-opacity-50 flex items-center justify-center">
      <div className="h-full w-full flex flex-col justify-center items-center sm:h-auto  p-6 sm:rounded-lg shadow-xl overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-white">Create New Note</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 w-3/4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Note Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="Enter note name"
              required
              className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>
          {
            summary &&
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows="5"
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              />
            </div>
          }
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Note Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter note text"
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
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags (optional)"
              className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          {<div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create
            </button>
          </div> }
        </form>
      </div>
    </div>

    }/>
  );
} 