'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import NoteContent from '../components/NoteContent';
import { useAuth } from '../context/AuthContext';

export default function Zone() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteContent, setNoteContent] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router]);

  // Handle folder selection
  const handleFolderSelect = (folder) => {
    if (folder === null) {
      setSelectedFolder(null);
      setSelectedNote(null);
      setNoteContent(null);
    } else {
      if (selectedFolder === folder.id) {
        setSelectedFolder(null);
      } else {
        setSelectedFolder(folder.id);
      }
      setSelectedNote(null);
      setNoteContent(null);
    }
  };

  // Handle note selection
  const handleNoteSelect = (note) => {
    if (note === null) {
      setSelectedNote(null);
      setNoteContent(null);
    } else {
      setSelectedNote(note.id);
      setNoteContent(note);
    }
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className=" bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render the page (will redirect in useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 mt-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            The Zone
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your personal space for organizing and accessing your notes.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64">
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={toggleSidebar}
              onFolderSelect={handleFolderSelect}
              onNoteSelect={handleNoteSelect}
              selectedFolder={selectedFolder}
              selectedNote={selectedNote}
            />
          </div>

          <hr className='text-gray-700 block md:hidden' />

          {/* Content area */}
          <div className={`flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 ${isSidebarCollapsed ? 'md:ml-0' : 'md:ml-6'}`}>
            <NoteContent note={noteContent} />
          </div>
        </div>
      </main>
    </div>
  );
} 