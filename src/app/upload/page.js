/**
 * Page currently manages the uploading of a single file at a time, as well as the creation of a blank note.
 * It should eventually support batch uploads of notes, but right now it's tightly coupled to the single upload implementation.
 */

"use client";
<<<<<<< HEAD
import { useRouter } from "next/router";
import reducer from "./uploadReducer"
import { initialState } from "./uploadReducer"
import { useReducer, useEffect } from "react";
import { createPortal } from 'react-dom';
import { addNewNote } from '@/firebase/firestoreFunctions';
import ImageUpload from './fileUploader'
import Modal from '../components/modal'
import ContentPreviewer from './contentPreviewer'
import FolderSelector from '../components/folderSelector';
import FolderModifier from '../components/folderModifier';
import NoteModifier from '../components/noteModifier';

export default function ScannerPage() {
    const [uploadState, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        dispatch({
            type: "initial_state"
        })
    }, [])

    const handleContentUploaded = ((extractedContent) => {
        dispatch({
            type: "content_uploaded",
            extractedContent: extractedContent
        })
    })

    const handleBlankNoteSelected = (() => {
        dispatch({
            type: "blank_note_selected"
        })
    })

    const handleContentPreviewed = ((previewedContent) => {
        dispatch({
            type: "content_previewed",
            previewedContent: previewedContent
        })
    })

    const handleNoteCreated = ((newNote) => {
        dispatch({
            type: "note_created",
            newNoteObj: newNote
        })
    })

    const handleExistingFolderSelected = ((folder) => {
        finalizeNote(uploadState.newNoteObj, folder);

        dispatch({
            type: "initial_state"
        })
    })

    const handleNewFolderSelected = (() => {
        dispatch({
            type: "new_folder_selected"
        })
    })

    const handleClose = (() => {
        dispatch({
            type: "initial_state"
        })
    })

    const handleGoBack = (() => {
        dispatch({
            type: "go_back",
        })
    })

    function finalizeNote(note, folder){
        addNewNote(
            folder.id, 
            note.name, 
            note.source, 
            note.tags, 
            note.summary, 
            note.content
        )
        //router.push('/zone/');
    }

    return (
        <>
        
        <ImageUpload
            onContentUploaded={handleContentUploaded}
            enabled={!(uploadState.processing)}
        />

        <div className="text-center">
            <button 
                className="px-5 py-2 text-lg bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => handleBlankNoteSelected()}
            >
                Create Blank Note
            </button>
        </div>

        {uploadState.showContentPreviewer && createPortal(
            <Modal
                onClose={handleClose}
                onGoBack={uploadState.goBackEnabled ? handleGoBack : null}
            >
                <ContentPreviewer
                    extractedContent={uploadState.extractedContent}
                    onContentPreviewed={handleContentPreviewed}
                />
            </Modal>,
            document.body
        )}

        {uploadState.showCreateNote && createPortal(
            <Modal
                onClose={handleClose}
                onGoBack={uploadState.goBackEnabled ? handleGoBack : null}
            >
                <NoteModifier
                    onNoteModified={handleNoteCreated}
                    initialNoteObj={uploadState.newNoteObj}
                    createMode={true}
                    selectedFolder={null}
                />
            </Modal>,
            document.body
        )}

        {uploadState.showFolderSelector && createPortal(
            <Modal
                onClose={handleClose}
                onGoBack={uploadState.goBackEnabled ? handleGoBack : null}
            >
                <FolderSelector
                    onFolderSelected={handleExistingFolderSelected}
                    onNewFolderSelected={handleNewFolderSelected}
                />
            </Modal>,
            document.body
        )}

        {uploadState.showFolderCreator && createPortal(
            <Modal
                onClose={handleClose}
                onGoBack={uploadState.goBackEnabled ? handleGoBack : null}
            >
                <FolderModifier
                    onFolderModified={handleExistingFolderSelected}
                />
            </Modal>,
            document.body
        )}

        </>
    );
}
=======
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import {
  detectText,
  cleanParsedText,
  generateSummary,
} from "../scripts/gemini";
import AttachToFolder from "../components/attachToFolder";

export default function ScannerPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  // Convert File to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError("No file selected");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");

      // Convert file to base64 on the client side
      const base64Data = await fileToBase64(file);

      // Extract text from the image using the base64 data
      const rawText = await detectText(base64Data);

      // Clean the extracted text
      const cleanedText = await cleanParsedText(rawText);

      const summary = await generateSummary(cleanedText);

      if (cleanedText) {
        setShowModal(true);
        setExtractedText(cleanedText);
        setSummarizedText(summary);
      }
    } catch (err) {
      console.error(err);
      setError("Error processing image: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col justify-around md:justify-center items-center bg-gray-900 text-white h-full p-4">
      <div className="text-3xl font-bold mb-4">Upload Image Files:</div>

      <div
        className=" flex items-center justify-center border-2 text-4xl w-xs h-24 md:w-3xl md:h-96 border-dashed border-gray-500 rounded-lg p-4 mt-8 mb-4 cursor-pointer hover:border-blue-500 transition-colors"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faCloudArrowUp} />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf"
      />

      <div className="flex items-center justify-center h-6">
        {isProcessing && <span className="loader"></span>}
      </div>

      {error && <div className="mt-4 text-red-400">{error}</div>}
      {showModal && (
        <AttachToFolder
          extractedText={extractedText}
          summarizedText={summarizedText}
        />
      )}
    </div>
  );
}
>>>>>>> c5484f0 (adds prettier and Eslint)
