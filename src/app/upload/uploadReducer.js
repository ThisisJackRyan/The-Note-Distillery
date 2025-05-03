import noteFactory from "../scripts/noteFactory";

export const initialState = {
    extractedContent: '',
    aiSummary: '',
    newNoteObj: noteFactory(),
    selectedFolder: null,
    showCreateNote: false,
    showFolderCreator: false,
    showFolderSelector: false,
    processing: false,
    stateHistory: [], // Add state history array
    goBackEnabled: false
}

export default function reducer(uploadState, action){
    console.log("Upload Action: " + action.type)
    
    let toReturn = uploadState; // Initialize with current state

    switch(action.type){
        case "initial_state":
            toReturn = {
                ...initialState
            };
            break;

        case "content_uploaded":
            // The ?? jargon is used so that the note's fields will still be filled properly in the case of a go-back.
            // In that case, the values of temp note obj are set to the existing values of newNoteObj.
            const tempNoteObj = {
                ...uploadState.newNoteObj,
                content: action.extractedContent ?? uploadState.newNoteObj.content
            }

            toReturn = {
                ...uploadState,
                newNoteObj: {
                    ...tempNoteObj
                },
                showCreateNote: true,
                showFolderCreator: false,
                showFolderSelector: false,
                processing: true,
                stateHistory: action.fromGoBack ? [...uploadState.stateHistory] : [...uploadState.stateHistory, action.type],
            };
            break;
        
        case "note_created":
            toReturn = {
                ...uploadState,
                // The ?? jargon here is used to the same effect as above
                newNoteObj: action.newNoteObj ?? uploadState.newNoteObj,
                showCreateNote: false,
                showFolderCreator: false,
                showFolderSelector: true,
                stateHistory: action.fromGoBack ? [...uploadState.stateHistory] : [...uploadState.stateHistory, action.type]
            };
            break;

        case "existing_folder_selected":
            toReturn = {
                ...uploadState,
                selectedFolder: action.selectedFolder ?? uploadState.selectedFolder,
                showCreateNote: false,
                showFolderCreator: false,
                showFolderSelector: false,
                processing: false,
                stateHistory: action.fromGoBack ? [...uploadState.stateHistory] : [...uploadState.stateHistory, action.type]
            };
            break;

        case "new_folder_selected":
            toReturn = {
                ...uploadState,
                showCreateNote: false,
                showFolderCreator: true,
                showFolderSelector: false,
                stateHistory: action.fromGoBack ? [...uploadState.stateHistory] : [...uploadState.stateHistory, action.type]
            };
            break;
        
        case "upload_cancelled":
            toReturn = {
                ...uploadState,
                showCreateNote: false,
                showFolderCreator: false,
                showFolderSelector: false,
                processing: false,
                stateHistory: action.fromGoBack ? [...uploadState.stateHistory] : [...uploadState.stateHistory, action.type]
            };
            break;

        case "go_back":
            // Need at least 2 items in history to go back properly
            if (uploadState.stateHistory.length < 2) {
                // No need to change toReturn, it's already initialized to uploadState
                break;
            }
            
            // Get the second-to-last state from history (the one we want to go back to)
            const targetState = uploadState.stateHistory[uploadState.stateHistory.length - 2];
            
            // Remove the last state from history (current state)
            const newHistory = uploadState.stateHistory.slice(0, -1);
            
            // Go back to the previous state
            toReturn = reducer(
                {
                    ...uploadState,
                    stateHistory: newHistory  // Update history before recursing
                },
                { type: targetState, fromGoBack: true }
            );
            break;

        default:
            // toReturn is already set to uploadState, no need to do anything
            break;
    }

    toReturn.goBackEnabled = toReturn.stateHistory.length >= 2;

    console.log("State History:", toReturn.stateHistory.join(" -> "));

    return toReturn;
}