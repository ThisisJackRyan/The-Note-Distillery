"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react";
import { detectText, cleanParsedText } from '../scripts/imgProcessing'
import { generateAISummary } from '../scripts/prompts'
import { useAuth } from '../context/AuthContext'
import ImageUpload from '../components/imageUpload'
import AttachToFolder from '../components/attachToFolder';
import NewFolderModal from '../components/newFolderModal';
import NewNoteModal from '../components/newNoteModal';

export default function ScannerPage() {
    const [noteContent, setNoteContent] = useState('')
    const [summarizedText, setSummarizedText] = useState('');
    // const [showEditNote, setShowEditNote] = useState('');
    // const [showAttachFolder, setShowAttachFolder] = useState('');
    
    return (
        <ImageUpload
            setNoteContent={setNoteContent}
            setSummarizedText={setSummarizedText}
        />
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
        //             generatedSummary={summarizedText}
        //         />

        //         <AttachToFolder extractedText={extractedText} summarizedText={summarizedText} />
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