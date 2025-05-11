"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faFolder,
  faFile,
  faFolderPlus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import FolderModifier from "./folderModifier";
import NoteModifier from "./noteModifier";
import { deleteFolder, deleteNote } from "@/firebase/firestoreFunctions";
import noteFactory from "../scripts/noteFactory";
import { createPortal } from "react-dom";
import Modal from "./modal";

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  onFolderSelect,
  onNoteSelect,
  selectedFolder,
  selectedNote,
}) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFolderModifier, setShowFolderModifier] = useState(false);
  const [showNoteModifier, setShowNoteModifier] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    type: null,
    id: null,
    folderId: null,
  });
  const { user } = useAuth();

  // Fetch folders and notes from Firebase
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);

        if (!user) {
          console.log("No user is signed in");
          setLoading(false);
          return;
        }

        // Query folders for the current user
        const foldersQuery = query(
          collection(db, "users", user.uid, "folders"),
        );
        const foldersSnapshot = await getDocs(foldersQuery);

        const foldersData = [];

        for (const folderDoc of foldersSnapshot.docs) {
          const folder = {
            id: folderDoc.id,
            name: folderDoc.data().name,
            notes: [],
          };

          // Fetch notes for this folder
          const notesQuery = query(
            collection(db, "users", user.uid, "folders", folderDoc.id, "notes"),
          );
          const notesSnapshot = await getDocs(notesQuery);

          folder.notes = notesSnapshot.docs.map((noteDoc) => ({
            id: noteDoc.id,
            ...noteDoc.data(),
          }));

          foldersData.push(folder);
        }

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

  // Handle folder selection
  const handleFolderClick = (folder) => {
    onFolderSelect(folder);
  };

  // Handle note selection
  const handleNoteClick = (note) => {
    onNoteSelect(note);
  };

  const handleNewFolder = (newFolderName) => {
    const tempId = `temp-${Date.now()}`;
    const newFolder = {
      id: tempId,
      name: newFolderName,
      notes: [],
    };
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  };

  const handleNewNote = (newNote) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) => {
        if (folder.id === selectedFolder) {
          return {
            ...folder,
            notes: [...folder.notes, newNote],
          };
        }
        return folder;
      }),
    );
  };

  const handleAddNoteClick = (e) => {
    e.stopPropagation(); // Prevent folder selection
    if (selectedFolder) {
      setShowNoteModifier(true);
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteConfirmation.type === "folder") {
        await deleteFolder(deleteConfirmation.id);
        setFolders((prevFolders) =>
          prevFolders.filter((folder) => folder.id !== deleteConfirmation.id),
        );
        if (selectedFolder === deleteConfirmation.id) {
          onFolderSelect(null);
          onNoteSelect(null); // Clear selected note when folder is deleted
        }
      } else if (deleteConfirmation.type === "note") {
        await deleteNote(deleteConfirmation.folderId, deleteConfirmation.id);
        setFolders((prevFolders) =>
          prevFolders.map((folder) => {
            if (folder.id === deleteConfirmation.folderId) {
              return {
                ...folder,
                notes: folder.notes.filter(
                  (note) => note.id !== deleteConfirmation.id,
                ),
              };
            }
            return folder;
          }),
        );
        if (selectedNote === deleteConfirmation.id) {
          onNoteSelect(null);
        }
      }
      setDeleteConfirmation({
        isOpen: false,
        type: null,
        id: null,
        folderId: null,
      });
    } catch (err) {
      console.error("Error deleting:", err);
      setError("Failed to delete. Please try again.");
    }
  };

  const handleDeleteClick = (e, type, id, folderId = null) => {
    e.stopPropagation();
    setDeleteConfirmation({ isOpen: true, type, id, folderId });
  };

  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-full md:w-64 "} transition-all duration-300 bg-gray-800 rounded-lg shadow-md overflow-hidden`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2
          className={`font-semibold ${isCollapsed ? "hidden" : "block"} text-white`}
        >
          Folders
        </h2>
        <div className="flex gap-4 items-center">
          <FontAwesomeIcon
            icon={faFolderPlus}
            className=" text-gray-400 hover:text-gray-200 cursor-pointer"
            onClick={() => setShowFolderModifier(true)}
          />
          <button
            onClick={onToggleCollapse}
            className=" text-gray-400 hover:text-gray-200"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      <div className="p-2 overflow-y-auto max-h-[calc(100vh-300px)]">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-400">Loading folders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-400">{error}</p>
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-400">No folders found</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {folders.map((folder) => (
              <li key={folder.id}>
                <div
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                    selectedFolder === folder.id
                      ? "bg-blue-900"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleFolderClick(folder)}
                >
                  <div className="flex">
                    <FontAwesomeIcon
                      icon={
                        selectedFolder === folder.id
                          ? faChevronDown
                          : faChevronRight
                      }
                      className="mr-2 text-gray-400 w-4 h-4"
                    />
                    <FontAwesomeIcon
                      icon={faFolder}
                      className="mr-2 text-yellow-500 w-4 h-4"
                    />
                    {!isCollapsed && (
                      <span className="truncate text-white">{folder.name}</span>
                    )}
                  </div>
                  {selectedFolder === folder.id && (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-200"
                        onClick={handleAddNoteClick}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-gray-400 w-4 h-4 cursor-pointer hover:text-red-400"
                        onClick={(e) =>
                          handleDeleteClick(e, "folder", folder.id)
                        }
                      />
                    </div>
                  )}
                </div>

                {selectedFolder === folder.id && !isCollapsed && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {folder.notes.map((note) => (
                      <li
                        key={note.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                          selectedNote === note.id
                            ? "bg-blue-900"
                            : "hover:bg-gray-700"
                        }`}
                        onClick={() => handleNoteClick(note)}
                      >
                        <div className="flex items-center">
                          <FontAwesomeIcon
                            icon={faFile}
                            className="mr-2 text-blue-500 w-4 h-4"
                          />
                          <span className="truncate text-white">
                            {note.name}
                          </span>
                        </div>
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-gray-400 w-4 h-4 cursor-pointer hover:text-red-400"
                          onClick={(e) =>
                            handleDeleteClick(e, "note", note.id, folder.id)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {showNoteModifier &&
        createPortal(
          <Modal
            content={
              <NoteModifier
                onNoteModified={handleNewNote}
                initialNoteObj={noteFactory()}
                createMode={true}
                selectedFolder={folders.find((f) => f.id === selectedFolder)}
              />
            }
            onClose={setShowNoteModifier(false)}
          />,
          document.body,
        )}

      {showFolderModifier &&
        createPortal(
          <Modal
            content={<FolderModifier onFolderModified={handleNewFolder} />}
            onClose={setShowFolderModifier(false)}
          />,
          document.body,
        )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Confirm Delete
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this {deleteConfirmation.type}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() =>
                  setDeleteConfirmation({
                    isOpen: false,
                    type: null,
                    id: null,
                    folderId: null,
                  })
                }
                className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
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
