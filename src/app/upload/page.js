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
import FolderModifier from '../components/folderModifier';
import NoteModifier from '../components/noteModifier';

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
        addNewNote(
            state.selectedFolder.id, 
            state.newNoteObj.name, 
            state.newNoteObj.source, 
            state.newNoteObj.tags, 
            state.newNoteObj.summary, 
            state.newNoteObj.content
        )
        dispatch({
            type: "initial_state"
        })
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
                    <NoteModifier
                        onNoteModified={handleNoteCreated}
                        initialNoteObj={uploadState.newNoteObj}
                        createMode={true}
                        selectedFolder={null}
                    />
                }
                onClose={handleClose}
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
                    <FolderModifier
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
}