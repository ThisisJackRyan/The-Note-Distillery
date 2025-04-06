import { db, app } from "./firebaseConfig"; // Adjust the import path as necessary
import { getAuth } from "firebase/auth";
import { collection, addDoc, setDoc, doc, query, where, getDocs, deleteDoc, updateDoc } from "firebase/firestore";


const getUserID = () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
        return user.uid;
    } else {
        console.log("No user is signed in.");
        return null;
    }
}

const makeNewFolder = async (folderName) => {
    try {
        const userId = getUserID();
        if (!userId) {
            console.error("No user is signed in");
            return;
        }
        await addDoc(collection(db, "users", userId, "folders"), {
            name: folderName,
        });
        console.log("Document written");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

const createUserInDatabase = async (uid, email) => {
    try {
        await setDoc(doc(db, "users", uid), {
            email: email,
        });
        console.log("Document written");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

const getFolderIdByName = async (folderName) => {
    try {
        const userId = getUserID();
        if (!userId) return null;
        
        const q = query(
            collection(db, "users", userId, "folders"), 
            where("name", "==", folderName)
        );
        
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("No folder found with that name");
            return null;
        }
        
        // Return the first matching folder's ID
        return querySnapshot.docs[0].id;
    } catch (e) {
        console.error("Error getting folder ID: ", e);
        return null;
    }
}

const addNewNote = async (folderName, noteName, source, tags, summary, text) => {
    try {
        const userId = getUserID();
        if (!userId) return;
        
        const folderId = await getFolderIdByName(folderName);
        if (!folderId) {
            console.error("Folder not found");
            return;
        }
        
        await addDoc(collection(db, "users", userId, "folders", folderId, "notes"), {
            name: noteName,
            dateCreated: new Date().toISOString(),
            source: source,
            tags: tags,
            summary: summary,
            text: text
        });
        console.log("Document written");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

const deleteFolder = async (folderId) => {
    try {
        const userId = getUserID();
        if (!userId) {
            console.error("No user is signed in");
            return;
        }

        // First, delete all notes in the folder
        const notesQuery = query(collection(db, "users", userId, "folders", folderId, "notes"));
        const notesSnapshot = await getDocs(notesQuery);
        
        // Delete each note
        const deletePromises = notesSnapshot.docs.map(noteDoc => 
            deleteDoc(doc(db, "users", userId, "folders", folderId, "notes", noteDoc.id))
        );
        await Promise.all(deletePromises);

        // Then delete the folder itself
        await deleteDoc(doc(db, "users", userId, "folders", folderId));
        console.log("Folder and its notes deleted successfully");
    } catch (e) {
        console.error("Error deleting folder: ", e);
        throw e;
    }
}

const deleteNote = async (folderId, noteId) => {
    try {
        const userId = getUserID();
        if (!userId) {
            console.error("No user is signed in");
            return;
        }

        await deleteDoc(doc(db, "users", userId, "folders", folderId, "notes", noteId));
        console.log("Note deleted successfully");
    } catch (e) {
        console.error("Error deleting note: ", e);
        throw e;
    }
}

const updateFolderName = async (folderId, newName) => {
    try {
        const userId = getUserID();
        if (!userId) {
            console.error("No user is signed in");
            return;
        }
        await updateDoc(doc(db, "users", userId, "folders", folderId), {
            name: newName
        });
        console.log("Folder name updated");
    } catch (e) {
        console.error("Error updating folder name: ", e);
        throw e;
    }
};

const updateNoteName = async (folderId, noteId, newName) => {
    try {
        const userId = getUserID();
        if (!userId) {
            console.error("No user is signed in");
            return;
        }
        await updateDoc(doc(db, "users", userId, "folders", folderId, "notes", noteId), {
            name: newName
        });
        console.log("Note name updated");
    } catch (e) {
        console.error("Error updating note name: ", e);
        throw e;
    }
};

const updateNote = async (folderId, noteId, updatedNote) => {
    try {
        const userId = getUserID();
        if (!userId) {
            console.error("No user is signed in");
            return;
        }
        await updateDoc(doc(db, "users", userId, "folders", folderId, "notes", noteId), {
            name: updatedNote.name,
            text: updatedNote.text,
            tags: updatedNote.tags,
            dateModified: updatedNote.dateModified
        });
        console.log("Note updated successfully");
    } catch (e) {
        console.error("Error updating note: ", e);
        throw e;
    }
};

export { makeNewFolder, createUserInDatabase, addNewNote, deleteFolder, deleteNote, updateFolderName, updateNoteName, updateNote };