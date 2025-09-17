import React, { useState, useEffect } from "react";
import { getAllFolders } from "../../firebase/firestoreFunctions";

export default function FolderSelector({
  onFolderSelected,
  onNewFolderSelected,
}) {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    const fetchFolders = async () => {
      const foldersData = await getAllFolders();
      setFolders(foldersData);
    };
    fetchFolders();
  }, []);

  return (
    <div className="inset-0 flex items-center justify-center">
      <div className="h-full w-full flex flex-col justify-center items-center sm:h-auto p-6 sm:rounded-lg sm:w-96">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Attach to Folder
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Select Folder <span className="text-red-500">*</span>
            </label>
            <div className="max-h-40 overflow-y-scroll">
              <select
                value={selectedFolder?.id || ""}
                onChange={(e) => {
                  const folder = folders.find((f) => f.id === e.target.value);
                  setSelectedFolder(folder);
                }}
                className="w-full px-3 py-2 border border-gray-700 rounded-md appearance-none outline-none focus:outline-none focus-visible:outline-none focus:border-blue-500 bg-gray-70"
              >
                <option value="">Select a folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onNewFolderSelected}
              className="px-4 py-2 cursor-pointer text-gray-300 hover:bg-gray-700 rounded-md"
            >
              Create New Folder
            </button>
            <button
              onClick={() => onFolderSelected(selectedFolder)}
              disabled={!selectedFolder}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use Selected Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
