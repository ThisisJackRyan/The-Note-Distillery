'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faFolder, faFile } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ 
  isCollapsed, 
  onToggleCollapse, 
  onFolderSelect, 
  onNoteSelect, 
  selectedFolder, 
  selectedNote 
}) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const { user } = useAuth();

  // Fetch folders and notes from Firebase
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        setDebugInfo('Starting to fetch folders...');
        
        if (!user) {
          console.log("No user is signed in");
          setDebugInfo('No user is signed in');
          setLoading(false);
          return;
        }
        
        setDebugInfo(`User signed in with ID: ${user.uid}`);
        
        // Query the users collection directly
        const usersCollection = collection(db, "users");
        const userDoc = await getDocs(query(usersCollection));
        
        setDebugInfo(prev => `${prev}\nFound ${userDoc.docs.length} users in collection`);
        
        // Query folders for the current user
        const foldersQuery = query(collection(db, "users", user.uid, "folders"));
        const foldersSnapshot = await getDocs(foldersQuery);
        
        setDebugInfo(prev => `${prev}\nFound ${foldersSnapshot.docs.length} folders for user`);
        
        const foldersData = [];
        
        for (const folderDoc of foldersSnapshot.docs) {
          const folder = {
            id: folderDoc.id,
            name: folderDoc.data().name,
            notes: []
          };
          
          setDebugInfo(prev => `${prev}\nProcessing folder: ${folder.name} (${folder.id})`);
          
          // Fetch notes for this folder
          const notesQuery = query(collection(db, "users", user.uid, "folders", folderDoc.id, "notes"));
          const notesSnapshot = await getDocs(notesQuery);
          
          setDebugInfo(prev => `${prev}\nFound ${notesSnapshot.docs.length} notes in folder ${folder.name}`);
          
          folder.notes = notesSnapshot.docs.map(noteDoc => ({
            id: noteDoc.id,
            ...noteDoc.data()
          }));
          
          foldersData.push(folder);
        }
        
        setFolders(foldersData);
        setLoading(false);
        setDebugInfo(prev => `${prev}\nFinished loading ${foldersData.length} folders with their notes`);
      } catch (error) {
        console.error("Error fetching folders:", error);
        setError(`Failed to load folders: ${error.message}`);
        setDebugInfo(prev => `${prev}\nError: ${error.message}`);
        setLoading(false);
      }
    };
    
    fetchFolders();
  }, [user]);

  // Handle folder selection
  const handleFolderClick = (folder) => {
    onFolderSelect(folder);
  };

  // Handle note selection
  const handleNoteClick = (note) => {
    onNoteSelect(note);
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h2 className={`font-semibold ${isCollapsed ? 'hidden' : 'block'} text-gray-900 dark:text-white`}>Folders</h2>
        <button 
          onClick={onToggleCollapse}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <div className="p-2 overflow-y-auto max-h-[calc(100vh-300px)]">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">Loading folders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-500 dark:text-red-400">{error}</p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
              {debugInfo}
            </div>
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">No folders found</p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
              {debugInfo}
            </div>
          </div>
        ) : (
          <ul className="space-y-1">
            {folders.map((folder) => (
              <li key={folder.id}>
                <div 
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    selectedFolder === folder.id 
                      ? 'bg-blue-100 dark:bg-blue-900' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleFolderClick(folder)}
                >
                  <FontAwesomeIcon 
                    icon={selectedFolder === folder.id ? faChevronDown : faChevronRight} 
                    className="mr-2 text-gray-500 dark:text-gray-400 w-4 h-4" 
                  />
                  <FontAwesomeIcon 
                    icon={faFolder} 
                    className="mr-2 text-yellow-500 w-4 h-4" 
                  />
                  {!isCollapsed && (
                    <span className="truncate text-gray-900 dark:text-white">{folder.name}</span>
                  )}
                </div>
                
                {selectedFolder === folder.id && !isCollapsed && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {folder.notes.map((note) => (
                      <li 
                        key={note.id}
                        className={`flex items-center p-2 rounded-md cursor-pointer ${
                          selectedNote === note.id 
                            ? 'bg-blue-100 dark:bg-blue-900' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleNoteClick(note)}
                      >
                        <FontAwesomeIcon 
                          icon={faFile} 
                          className="mr-2 text-blue-500 w-4 h-4" 
                        />
                        <span className="truncate text-gray-900 dark:text-white">{note.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 