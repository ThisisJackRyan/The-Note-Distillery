import noteFactory from "../scripts/noteFactory";

export const initialState = {
    extractedContent: '',
    aiSummary: '',
    newNoteObj: noteFactory(),
    selectedFolder: null,
    showCreateNote: false,
    showFolderCreator: false,
    showFolderSelector: false,
    previousState: "initial_state"
}

export default function reducer(uploadState, action){
    console.log("Upload Action: " + action.type)

    switch(action.type){
        case "initial_state":
            return {
                ...initialState
            }

        case "content_uploaded":
            return {
                ...uploadState,
                extractedContent: action.extractedContent ?? uploadState.extractedContent,
                aiSummary: action.aiSummary ?? uploadState.aiSummary,
                showCreateNote: true,
                showFolderCreator: false,
                showFolderSelector: false,
                previousState: "initial_state"
            }
        
        case "note_created":
            return {
                ...uploadState,
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
                previousState: "initial_state"
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