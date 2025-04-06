'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faFolder, faFile, faFolderPlus, faPlus, faTrash, faPencil, faEllipsisVertical, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import NewFolderModal from './newFolderModal';
import NewNoteModal from './newNoteModal';
import EditNoteModal from './EditNoteModal';
import { deleteFolder, deleteNote, updateFolderName, updateNoteName } from '@/firebase/firestoreFunctions';

export default function Sidebar({ 
  onFolderSelect, 
  onNoteSelect, 
  selectedFolder, 
  selectedNote 
}) {
  // State management
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, type: null, id: null, folderId: null });
  const [editingItem, setEditingItem] = useState({ type: null, id: null, folderId: null, name: '' });
  const [selectedNoteForEdit, setSelectedNoteForEdit] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const { user } = useAuth();

  /**
   * Handles click events outside of the dropdown menu to close it
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Fetches folders and their associated notes from Firestore
   */
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          console.log("No user is signed in");
          setLoading(false);
          return;
        }
        
        const foldersQuery = query(collection(db, "users", user.uid, "folders"));
        const foldersSnapshot = await getDocs(foldersQuery);
        
        const foldersData = await Promise.all(foldersSnapshot.docs.map(async (folderDoc) => {
          const folder = {
            id: folderDoc.id,
            name: folderDoc.data().name,
            notes: []
          };
          
          const notesQuery = query(collection(db, "users", user.uid, "folders", folderDoc.id, "notes"));
          const notesSnapshot = await getDocs(notesQuery);
          
          folder.notes = notesSnapshot.docs.map(noteDoc => ({
            id: noteDoc.id,
            ...noteDoc.data()
          }));
          
          return folder;
        }));
        
        setFolders(foldersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching folders:", error);
        setError(`Failed to load folders: ${error.message}`);
        setLoading(false);
      }
    };
    
    fetchFolders();
  }, [user]);

  /**
   * Toggles the dropdown menu for a folder or note
   * @param {Event} e - The click event
   * @param {string} id - The ID of the folder or note
   */
  const toggleMenu = (e, id) => {
    e.stopPropagation();
    if (e.target) {
      const rect = e.target.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.left
      });
    }
    setOpenMenuId(openMenuId === id ? null : id);
  };

  /**
   * Handles folder selection
   * @param {Object} folder - The selected folder
   */
  const handleFolderClick = (folder) => {
    onFolderSelect(folder);
  };

  /**
   * Handles note selection
   * @param {Object} note - The selected note
   */
  const handleNoteClick = (note) => {
    onNoteSelect(note);
  };

  /**
   * Handles the creation of a new folder
   * @param {string} newFolderName - The name of the new folder
   */
  const handleNewFolder = (newFolderName) => {
    const tempId = `temp-${Date.now()}`;
    const newFolder = {
      id: tempId,
      name: newFolderName,
      notes: []
    };
    setFolders(prevFolders => [...prevFolders, newFolder]);
  };

  /**
   * Handles the creation of a new note
   * @param {Object} newNote - The new note object
   */
  const handleNewNote = (newNote) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => {
        if (folder.id === selectedFolder) {
          return {
            ...folder,
            notes: [...folder.notes, newNote]
          };
        }
        return folder;
      })
    );
  };

  /**
   * Handles the click event for adding a new note
   * @param {Event} e - The click event
   */
  const handleAddNoteClick = (e) => {
    e.stopPropagation();
    if (selectedFolder) {
      setIsNewNoteModalOpen(true);
    }
  };

  /**
   * Handles opening the edit modal for a note
   * @param {Event} e - The click event
   * @param {Object} note - The note to edit
   * @param {string} folderId - The ID of the folder containing the note
   */
  const handleEditNote = (e, note, folderId) => {
    e.stopPropagation();
    setSelectedNoteForEdit({
      ...note,
      folderId: folderId
    });
    setIsEditNoteModalOpen(true);
  };

  /**
   * Handles updating a note after editing
   * @param {Object} updatedNote - The updated note object
   */
  const handleNoteUpdated = (updatedNote) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => {
        if (folder.id === selectedNoteForEdit.folderId) {
          return {
            ...folder,
            notes: folder.notes.map(note => 
              note.id === updatedNote.id ? updatedNote : note
            )
          };
        }
        return folder;
      })
    );
    if (selectedNote === updatedNote.id) {
      onNoteSelect(updatedNote);
    }
  };

  /**
   * Handles the deletion of a folder or note
   */
  const handleDelete = async () => {
    try {
      if (deleteConfirmation.type === 'folder') {
        await deleteFolder(deleteConfirmation.id);
        setFolders(prevFolders => prevFolders.filter(folder => folder.id !== deleteConfirmation.id));
        if (selectedFolder === deleteConfirmation.id) {
          onFolderSelect(null);
          onNoteSelect(null);
        }
      } else if (deleteConfirmation.type === 'note') {
        await deleteNote(deleteConfirmation.folderId, deleteConfirmation.id);
        setFolders(prevFolders => 
          prevFolders.map(folder => {
            if (folder.id === deleteConfirmation.folderId) {
              return {
                ...folder,
                notes: folder.notes.filter(note => note.id !== deleteConfirmation.id)
              };
            }
            return folder;
          })
        );
        if (selectedNote === deleteConfirmation.id) {
          onNoteSelect(null);
        }
      }
      setDeleteConfirmation({ isOpen: false, type: null, id: null, folderId: null });
    } catch (err) {
      console.error('Error deleting:', err);
      setError('Failed to delete. Please try again.');
    }
  };

  /**
   * Handles the click event for deleting a folder or note
   * @param {Event} e - The click event
   * @param {string} type - The type of item to delete ('folder' or 'note')
   * @param {string} id - The ID of the item to delete
   * @param {string} folderId - The ID of the folder containing the note (for notes only)
   */
  const handleDeleteClick = (e, type, id, folderId = null) => {
    e.stopPropagation();
    setDeleteConfirmation({ isOpen: true, type, id, folderId });
  };

  /**
   * Handles the click event for editing a folder or note name
   * @param {Event} e - The click event
   * @param {string} type - The type of item to edit ('folder' or 'note')
   * @param {string} id - The ID of the item to edit
   * @param {string} folderId - The ID of the folder containing the note (for notes only)
   * @param {string} name - The current name of the item
   */
  const handleEditClick = (e, type, id, folderId, name) => {
    e.stopPropagation();
    setEditingItem({ type, id, folderId, name });
  };

  /**
   * Handles changes to the name input field during editing
   * @param {Event} e - The change event
   */
  const handleNameChange = (e) => {
    setEditingItem(prev => ({ ...prev, name: e.target.value }));
  };

  /**
   * Handles submitting the new name for a folder or note
   * @param {Event} e - The submit event
   */
  const handleNameSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem.type === 'folder') {
        await updateFolderName(editingItem.id, editingItem.name);
        setFolders(prevFolders => 
          prevFolders.map(folder => 
            folder.id === editingItem.id 
              ? { ...folder, name: editingItem.name }
              : folder
          )
        );
      } else if (editingItem.type === 'note') {
        await updateNoteName(editingItem.folderId, editingItem.id, editingItem.name);
        setFolders(prevFolders => 
          prevFolders.map(folder => {
            if (folder.id === editingItem.folderId) {
              return {
                ...folder,
                notes: folder.notes.map(note => 
                  note.id === editingItem.id 
                    ? { ...note, name: editingItem.name }
                    : note
                )
              };
            }
            return folder;
          })
        );
      }
      setEditingItem({ type: null, id: null, folderId: null, name: '' });
    } catch (err) {
      setError('Failed to update name. Please try again.');
      console.error('Error updating name:', err);
    }
  };

  return (
    <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-visible">
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          Folders
        </h2>
        <div className='flex gap-4 items-center'>
          <FontAwesomeIcon 
            icon={faFolderPlus} 
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200' 
            onClick={() => setIsNewFolderModalOpen(true)} 
          />
        </div>
      </div>
      
      <div className="p-2 overflow-y-auto max-h-[calc(100vh-300px)]">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">Loading folders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">No folders found</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {folders.map((folder) => (
              <li key={folder.id} className="relative">
                <div 
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                    selectedFolder === folder.id 
                      ? 'bg-blue-100 dark:bg-blue-900' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleFolderClick(folder)}
                >
                  <div className='flex items-center'>
                    <FontAwesomeIcon 
                      icon={selectedFolder === folder.id ? faChevronDown : faChevronRight} 
                      className="mr-2 text-gray-500 dark:text-gray-400 w-4 h-4 transition-transform duration-200" 
                    />
                    <FontAwesomeIcon 
                      icon={faFolder} 
                      className="mr-2 text-yellow-500 w-4 h-4" 
                    />
                    {editingItem.type === 'folder' && editingItem.id === folder.id ? (
                      <form onSubmit={handleNameSubmit} className="flex-1">
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={handleNameChange}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                        />
                      </form>
                    ) : (
                      <span className="truncate text-gray-900 dark:text-white">
                        {folder.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative" ref={menuRef}>
                      <FontAwesomeIcon 
                        icon={faEllipsisVertical} 
                        className="text-gray-500 dark:text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                        onClick={(e) => toggleMenu(e, `folder-${folder.id}`)}
                      />
                      {openMenuId === `folder-${folder.id}` && (
                        <div className="fixed w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-[100]"
                             style={{
                               top: `${menuPosition.top}px`,
                               left: `${menuPosition.left}px`
                             }}>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(e, 'folder', folder.id, null, folder.name);
                              setOpenMenuId(null);
                            }}
                          >
                            Rename
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(e, 'folder', folder.id);
                              setOpenMenuId(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <FontAwesomeIcon 
                      icon={faPlus} 
                      className="text-gray-500 dark:text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                      onClick={handleAddNoteClick}
                    />
                  </div>
                </div>
                
                {selectedFolder === folder.id && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {folder.notes.map((note) => (
                      <li 
                        key={note.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                          selectedNote === note.id 
                            ? 'bg-blue-100 dark:bg-blue-900' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleNoteClick(note)}
                      >
                        <div className="flex items-center">
                          <FontAwesomeIcon 
                            icon={faFile} 
                            className="mr-2 text-blue-500 w-4 h-4" 
                          />
                          <span className="truncate text-gray-900 dark:text-white">
                            {note.name}
                          </span>
                        </div>
                        <div className="relative" ref={menuRef}>
                          <FontAwesomeIcon 
                            icon={faEllipsisVertical} 
                            className="text-gray-500 dark:text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                            onClick={(e) => toggleMenu(e, `note-${note.id}`)}
                          />
                          {openMenuId === `note-${note.id}` && (
                            <div className="fixed w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-[100]"
                                 style={{
                                   top: `${menuPosition.top}px`,
                                   left: `${menuPosition.left}px`
                                 }}>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditNote(e, note, folder.id);
                                  setOpenMenuId(null);
                                }}
                              >
                                Edit Content
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(e, 'note', note.id, folder.id, note.name);
                                  setOpenMenuId(null);
                                }}
                              >
                                Rename
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(e, 'note', note.id, folder.id);
                                  setOpenMenuId(null);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <NewFolderModal 
        isOpen={isNewFolderModalOpen} 
        onClose={() => setIsNewFolderModalOpen(false)}
        onFolderCreated={handleNewFolder}
      />

      <NewNoteModal 
        isOpen={isNewNoteModalOpen} 
        onClose={() => setIsNewNoteModalOpen(false)}
        onNoteCreated={handleNewNote}
        selectedFolder={folders.find(f => f.id === selectedFolder)}
      />

      <EditNoteModal
        isOpen={isEditNoteModalOpen}
        onClose={() => setIsEditNoteModalOpen(false)}
        note={selectedNoteForEdit}
        folderId={selectedNoteForEdit?.folderId}
        onNoteUpdated={handleNoteUpdated}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this {deleteConfirmation.type}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmation({ isOpen: false, type: null, id: null, folderId: null })}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 