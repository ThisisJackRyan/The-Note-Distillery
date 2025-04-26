/**
 * Page currently manages the uploading of a single file at a time, as well as the creation of a blank note.
 * It should eventually support batch uploads of notes, but right now it's tightly coupled to the single upload implementation.
 */

"use client";
import { useRouter } from "next/router";
import reducer from "./uploadReducer"
import { initialState } from "./uploadReducer"
import { useReducer } from "react";
import { createPortal } from 'react-dom';
import { addNewNote } from '@/firebase/firestoreFunctions';
import ImageUpload from '../components/fileUploader'
import Modal from '../components/modal'
import FolderSelector from '../components/folderSelector';
import FolderCreator from '../components/folderModifier';
import NewNote from '../components/noteModifier';

export default function ScannerPage() {
    //const router = useRouter()
    const [uploadState, dispatch] = useReducer(reducer, initialState)

    const handleContentUploaded = ((extractedContent, aiSummary) => {
        dispatch({
            type: "content_uploaded",
            extractedContent: extractedContent,
            aiSummary: aiSummary
        })
    })

    const handleNoteCreated = ((newNote) => {
        dispatch({
            type: "note_created",
            newNoteObj: newNote
        })
    })

    const handleExistingFolderSelected = ((folder) => {
        const action = {
            type: "existing_folder_selected",
            selectedFolder: folder
        }
        dispatch(action)

        const nextState = reducer(uploadState, action);
        finalizeNote(nextState);
    })

    const handleNewFolderSelected = (() => {
        dispatch({
            type: "new_folder_selected"
        })
    })

    const handleClose = (() => {
        dispatch({
            type: "upload_cancelled"
        })
    })

    const handleGoBack = (() => {
        dispatch({
            type: "go_back",
        })
    })

    function finalizeNote(state){
        if (state.selectedFolder) {
            console.log("Selected Folder Details:");
            Object.entries(state.selectedFolder).forEach(([key, value]) => {
                console.log(`${key}: ${value}`);
            });
        }
        addNewNote(
            state.selectedFolder.id, 
            state.newNoteObj.name, 
            state.newNoteObj.source, 
            state.newNoteObj.tags, 
            state.newNoteObj.summary, 
            state.newNoteObj.content
        )
        //router.push('/zone/');
    }

    return (
        <>
        
        <ImageUpload
            onContentUploaded={handleContentUploaded}
        />

        {uploadState.showCreateNote && createPortal(
            <Modal
                content={
                    <NewNote
                        onNoteCreated={handleNoteCreated}
                        initialContent={uploadState.extractedContent}
                        initialSummary={uploadState.aiSummary}
                    />
                }
                onClose={handleClose}
                onGoBack={handleGoBack}
            />,
            document.body
        )}

        {uploadState.showFolderSelector && createPortal(
            <Modal
                content={
                    <FolderSelector
                        folderSelected={handleExistingFolderSelected}
                        newFolderSelected={handleNewFolderSelected}
                    />
                }
                onClose={handleClose}
                onGoBack={handleGoBack}
            />,
            document.body
        )}

        {uploadState.showFolderCreator && createPortal(
            <Modal
                content={
                    <FolderCreator
                        folderCreated={handleExistingFolderSelected}
                    />
                }
                onClose={handleClose}
                onGoBack={handleGoBack}
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