import noteFactory from "../scripts/noteFactory";

export const initialState = {
    extractedContent: '',
    aiSummary: '',
    newNoteObj: noteFactory(),
    selectedFolder: null,
    showCreateNote: false,
    showFolderCreator: false,
    showFolderSelector: false,
    previousState: "initial_state",
    processing: false
}

export default function reducer(uploadState, action){
    console.log("Upload Action: " + action.type)

    switch(action.type){
        case "initial_state":
            return {
                ...initialState
            }

        case "content_uploaded":
            // The ?? jargon is used so that the note's fields will still be filled properly in the case of a go-back.
            // In that case, the values of temp note obj are set to the existing values of newNoteObj.
            const tempNoteObj = {
                ...uploadState.newNoteObj,
                content: action.extractedContent ?? uploadState.newNoteObj.content,
                summary: action.aiSummary ?? uploadState.newNoteObj.summary,
            }

            return {
                ...uploadState,
                newNoteObj: {
                    ...tempNoteObj
                },
                showCreateNote: true,
                showFolderCreator: false,
                showFolderSelector: false,
                processing: true,
                previousState: "initial_state",
                
            }
        
        case "note_created":
            return {
                ...uploadState,
                // The ?? jargon here is used to the same effect as above
                newNoteObj: action.newNoteObj ?? uploadState.newNoteObj,
                showCreateNote: false,
                showFolderCreator: false,
                showFolderSelector: true,
                previousState: "content_uploaded"
            }

        /**
         * The previous state is not stored as a safeguard to prevent re-running of actions with side effects
         */
        case "existing_folder_selected":
            return {
                ...uploadState,
                selectedFolder: action.selectedFolder ?? uploadState.selectedFolder,
                showCreateNote: false,
                showFolderCreator: false,
                showFolderSelector: false,
                processing: false
            }

        case "new_folder_selected":
            return {
                ...uploadState,
                showCreateNote: false,
                showFolderCreator: true,
                showFolderSelector: false,
                previousState: "note_created"
            }
        
        case "upload_cancelled":
            return {
                ...uploadState,
                showCreateNote: false,
                showFolderCreator: false,
                showFolderSelector: false,
                processing: false,
                previousState: "initial_state",
            }

        /**
         * Should only be used before any actions with side-effects are carried out, such as adding the new note to the db or creating a new folder
         */
        case "go_back":
            return reducer(
                uploadState,
                { type: uploadState.previousState }
            )

        default:
            return uploadState
    }
}