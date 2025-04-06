import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllFolders } from '../../firebase/firestoreFunctions'
import NewFolderModal from './newFolderModal';
import NewNoteModal from './newNoteModal';

const AttachToFolder = ({extractedText}) => {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showNextModal, setShowNextModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchFolders = async () => {
            const foldersData = await getAllFolders();
            setFolders(foldersData);
        };
        fetchFolders();
    }, []);

    const handleNewFolder = (newFolderName, folderId) => {
        const newFolder = {
            id: folderId,
            name: newFolderName,
            notes: []
        };
        setFolders(prevFolders => [...prevFolders, newFolder]);
        setSelectedFolder(newFolder);
        setShowNextModal(true);
        setShowModal(false);
    };

    const handleNewNote = (newNote) => {
        router.push('/zone/');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="h-full w-full flex flex-col justify-center items-center sm:h-auto bg-white dark:bg-gray-900 p-6 sm:rounded-lg shadow-xl sm:w-96">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Attach to Folder</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Select Folder <span className="text-red-500">*</span>
                        </label>
                        <select 
                            value={selectedFolder?.id || ''} 
                            onChange={(e) => {
                                const folder = folders.find(f => f.id === e.target.value);
                                setSelectedFolder(folder);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select a folder</option>
                            {folders.map((folder) => (
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button 
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        >
                            Create New Folder
                        </button>
                        <button 
                            onClick={() => {
                                if (selectedFolder) {
                                    setShowNextModal(true);
                                }
                            }}
                            disabled={!selectedFolder}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Attach to Folder
                        </button>
                    </div>
                </div>
            </div>
            
            <NewFolderModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onFolderCreated={handleNewFolder}
            />
            <NewNoteModal
                isOpen={showNextModal}
                onClose={() => setShowNextModal(false)}
                onNoteCreated={handleNewNote}
                selectedFolder={selectedFolder}
                extractedText={extractedText}
                summary=""
            />
        </div>
    );
};

export default AttachToFolder;