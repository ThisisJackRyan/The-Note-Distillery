/**
 * Page currently manages the uploading of a single file at a time, as well as the creation of a blank note.
 * It should eventually support batch uploads of notes, but right now it's tightly coupled to the single upload implementation.
 */

"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from 'react-dom';
import ImageUpload from '../components/fileUploader'
import Modal from '../components/modal'
import AttachNote from '../components/folderSelector';
import NewFolderModal from '../components/folderModifier';
import NewNote from '../components/noteModifier';

export default function ScannerPage() {
    const [extractedContent, setExtractedContent] = useState('')
    const [aiSummary, setAISummary] = useState('')
    const [newNoteObject, setNewNoteObject] = useState(null)

    const [showCreateNote, setShowCreateNote] = useState(false)
    const [showCreateFolder, setShowCreateFolder] = useState(false)
    const [showAttachNote, setShowAttachNote] = useState(false)

    const handleContentUploaded = ((extractedContent, aiSummary) => {
        setExtractedContent(extractedContent)
        setAISummary(aiSummary)
        setShowCreateNote(true)
    })

    const handleNoteCreated = ((newNote) => {
        setNewNoteObject(newNote)
        setShowCreateNote(false)
        setShowAttachNote(true)
    })

    const handleNoteCancelled = ((newNote) => {
        setShowCreateNote(false)
        setShowAttachNote(false)
        setShowCreateFolder(false)
    })

    return (
        <>
        
        <ImageUpload
            onContentUploaded={handleContentUploaded}
        />

        {showCreateNote && createPortal(
            <Modal
                content={
                    //<div className="text-black">New Note Div</div>
                    <NewNote
                        onNoteCreated={handleNoteCreated}
                        initialContent={extractedContent}
                        initialSummary={aiSummary}
                    />
                }
                onClose={handleNoteCancelled}
            />,
            document.body
        )}

        {showAttachNote && createPortal(
            <Modal
                content={
                    <div className="text-black">Attach Note Div</div>
                    //<AttachNote/>
                }
                onClose={() => setShowAttachNote(false)}
            />,
            document.body
        )}

        </>
    );
    

    // const handleSaveAsNote = async () => {
    //     if (!user) {
    //         setError('You must be logged in to save notes');
    //         return;
    //     }

    //     if (!extractedText) {
    //         setError('No text to save');
    //         return;
    //     }

    //     try {
    //         setIsProcessing(true);
    //         setError('');
            
    //         // Generate a title from the first line or use a default
    //         const title = extractedText.split('\n')[0].substring(0, 50) || 'Extracted Note';
            
    //         // Save the note
    //         // await saveNoteAsText(user.uid, extractedText, title);
            
    //         setSuccess('Note saved successfully!');
    //         setExtractedText(''); // Clear the extracted text after saving
    //     } catch (err) {
    //         console.error(err);
    //         setError('Error saving note: ' + (err.message || 'Unknown error'));
    //     } finally {
    //         setIsProcessing(false);
    //     }
    // };

   
    
            
        //     { {
        //         <NewNoteModal
        //             isOpen={showEditNote}
        //             onClose={() => setShowEditNote(false)}
        //             onNoteCreated={handleNewNote}
        //             selectedFolder={selectedFolder}
        //             extractedText={extractedText}
        //             generatedSummary={aiSummary}
        //         />

        //         <AttachToFolder extractedText={extractedText} aiSummary={aiSummary} />
        //     } 
        //    },
            

        //     { {extractedText && (
        //         <div className="mt-6 w-full max-w-3xl">
        //             <h3 className="text-xl font-semibold mb-2">Extracted Text:</h3>
        //             <div className="bg-gray-900 p-4 rounded-lg max-h-96 overflow-y-auto whitespace-pre-wrap">
        //                 {extractedText}
        //             </div>
                    
        //             {user && (
        //                 <button 
        //                     onClick={handleSaveAsNote}
        //                     className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        //                     disabled={isProcessing}
        //                 >
        //                     Save as Note
        //                 </button>
        //             )}
        //         </div>
        //     )} 
        //    }
}