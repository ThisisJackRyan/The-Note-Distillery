"use client";

import { useState } from "react";
import { makeNewFolder } from "@/firebase/firestoreFunctions";

export default function NewFolderModal({ onFolderModified }) {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError("Folder name cannot be empty");
      return;
    }

    try {
      // First create the folder in Firebase
      const folderId = await makeNewFolder(folderName);
      if (!folderId) {
        throw new Error("Failed to create folder");
      }

      const folder = {
        id: folderId,
        name: folderName
      }
      
      // Pass both the name and ID to the parent
      onFolderModified(folder);
      
      setFolderName('');
    } catch (err) {
      setError("Failed to create folder. Please try again.");
      console.error("Error creating folder:", err);
    }
  };

  return (
    <div className="inset-0 flex items-center justify-center">
      <div className="h-full w-full flex flex-col justify-center items-center sm:h-auto bg-gray-900 p-6 sm:rounded-lg shadow-xl sm:w-96">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Create New Folder
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Folder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setError("");
              }}
              placeholder="Enter folder name"
              required
              className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
