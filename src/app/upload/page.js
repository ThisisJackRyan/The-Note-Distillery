/**
 * Page currently manages the uploading of a single file at a time, as well as the creation of a blank note.
 * It should eventually support batch uploads of notes, but right now it's tightly coupled to the single upload implementation.
 */

"use client";
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
