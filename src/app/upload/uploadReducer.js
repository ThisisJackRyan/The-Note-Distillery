import noteFactory from "../scripts/noteFactory";

export const initialState = {
    extractedContent: '',
    previewedContent: '',
    newNoteObj: null,
    showContentPreviewer: false,
    showCreateNote: false,
    showFolderCreator: false,
    showFolderSelector: false,
    processing: false,
    actionHistory: [], 
    goBackEnabled: false
}

/**
 * This function is responsible for mutating the state of the upload page
 * 
 * Each case in the switch statement corresponds to a user action
 * 
 * For example, after the user uploads content, the upload_content case will be dispatched; the content previewer modal will then be set to display by this case
 * 
 * Lots of the repeated code has to do with enabling and disabling modals, as well as dealing with the state history stack
 * 
 * The state history stack is used to maintain which actions have been taken by the user; this in turn enables a go-back feature in the modals
 * 
 * The functionality for the go-back feature is impelmented in the go_back switch case; this is because the go-back is another user action
 * 
 * @param {*The current state to be mutated} uploadState 
 * @param {*Contains the state used to mutate the existing state} action 
 * @returns The mutated state
 */
export default function reducer(uploadState, action){    
    let toReturn = uploadState; // Initialize with current state

    switch(action.type){
        case "initial_state":
            toReturn = {
                ...initialState
            };
            break;

        case "content_uploaded":
            // The ?? jargon is used so that the note's fields will still be filled properly in the case of a go-back.
            // In that case, the values of temp note obj are set to the existing values of newNoteObj. Otherwise, the values are set to the new vals passed in the action.
            toReturn = {
                ...uploadState,
                extractedContent: action.extractedContent ?? uploadState.previewedContent,
                showContentPreviewer: true,
                showCreateNote: false,
                showFolderCreator: false,
                showFolderSelector: false,
                processing: true,
                actionHistory: action.fromGoBack ? [...uploadState.actionHistory] : [...uploadState.actionHistory, action.type],
            };
            break;

        case "blank_note_selected":
            toReturn = {
                ...uploadState,
                newNoteObj: {
                    ...uploadState.newNoteObj ?? noteFactory()
                },
                showContentPreviewer: false,
                showCreateNote: true,
                showFolderCreator: false,
                showFolderSelector: false,
                processing: true,
                actionHistory: action.fromGoBack ? [...uploadState.actionHistory] : [...uploadState.actionHistory, action.type],
            };
            break;

        case "content_previewed":
            const tempNoteObj = {
                ...uploadState.newNoteObj ?? noteFactory(),
                content: action.previewedContent ?? uploadState.newNoteObj.content
            }

            toReturn = {
                ...uploadState,
                previewedContent: action.previewedContent ?? uploadState.newNoteObj.content,
                newNoteObj: {
                    ...tempNoteObj
                },
                showContentPreviewer: false,
                showCreateNote: true,
                showFolderCreator: false,
                showFolderSelector: false,
                processing: true,
                actionHistory: action.fromGoBack ? [...uploadState.actionHistory] : [...uploadState.actionHistory, action.type],
            };
            break;
        
        case "note_created":
            toReturn = {
                ...uploadState,
                // The ?? jargon here is used to the same effect as above
                newNoteObj: action.newNoteObj ?? uploadState.newNoteObj,
                showContentPreviewer: false,
                showCreateNote: false,
                showFolderCreator: false,
                showFolderSelector: true,
                actionHistory: action.fromGoBack ? [...uploadState.actionHistory] : [...uploadState.actionHistory, action.type]
            };
            break;

        case "new_folder_selected":
            toReturn = {
                ...uploadState,
                showContentPreviewer: false,
                showCreateNote: false,
                showFolderCreator: true,
                showFolderSelector: false,
                actionHistory: action.fromGoBack ? [...uploadState.actionHistory] : [...uploadState.actionHistory, action.type]
            };
            break;

        case "go_back":
            // Need at least 2 items in history to go back properly
            if (uploadState.actionHistory.length < 2) {
                break;
            }
            
            const targetState = uploadState.actionHistory[uploadState.actionHistory.length - 2];
            
            const newHistory = uploadState.actionHistory.slice(0, -1);
            
            // Go back to the previous state
            toReturn = reducer(
                {
                    ...uploadState,
                    actionHistory: newHistory 
                },
                { type: targetState, fromGoBack: true }
            );
            break;

        default:
            break;
    }

    toReturn.goBackEnabled = toReturn.actionHistory.length >= 2;

    return toReturn;
}