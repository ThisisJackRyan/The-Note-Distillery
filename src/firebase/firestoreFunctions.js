import { db, app } from "./firebaseConfig"; // Adjust the import path as necessary
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  query,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const getUserID = () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  } else {
    console.log("No user is signed in.");
    return null;
  }
};

const makeNewFolder = async (folderName) => {
  try {
    const userId = getUserID();
    if (!userId) {
      console.error("No user is signed in");
      return null;
    }
    const docRef = await addDoc(collection(db, "users", userId, "folders"), {
      name: folderName,
    });
    console.log("Document written");
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
};

const createUserInDatabase = async (uid, email) => {
  try {
    await setDoc(doc(db, "users", uid), {
      email: email,
    });
    console.log("Document written");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const addNewNote = async (folderId, noteName, source, tags, summary, text) => {
    try {
        const userId = getUserID();
        if (!userId) return;
        
        if (!folderId) {
            console.error("Folder ID not provided");
            return;
        }

        console.log("Note details:", {
            folderId: folderId,
            name: noteName,
            source: source,
            tags: tags,
            summary: summary,
            text: text
        });
        
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
    const notesQuery = query(
      collection(db, "users", userId, "folders", folderId, "notes"),
    );
    const notesSnapshot = await getDocs(notesQuery);

    // Delete each note
    const deletePromises = notesSnapshot.docs.map((noteDoc) =>
      deleteDoc(
        doc(db, "users", userId, "folders", folderId, "notes", noteDoc.id),
      ),
    );
    await Promise.all(deletePromises);

    // Then delete the folder itself
    await deleteDoc(doc(db, "users", userId, "folders", folderId));
    console.log("Folder and its notes deleted successfully");
  } catch (e) {
    console.error("Error deleting folder: ", e);
    throw e;
  }
};

const deleteNote = async (folderId, noteId) => {
  try {
    const userId = getUserID();
    if (!userId) {
      console.error("No user is signed in");
      return;
    }

    await deleteDoc(
      doc(db, "users", userId, "folders", folderId, "notes", noteId),
    );
    console.log("Note deleted successfully");
  } catch (e) {
    console.error("Error deleting note: ", e);
    throw e;
  }
};

const getAllFolders = async () => {
  try {
    const userId = getUserID();
    if (!userId) {
      console.error("No user is signed in");
      return [];
    }

    const foldersQuery = query(collection(db, "users", userId, "folders"));
    const querySnapshot = await getDocs(foldersQuery);

    const folders = [];
    querySnapshot.forEach((doc) => {
      folders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return folders;
  } catch (e) {
    console.error("Error getting folders: ", e);
    return [];
  }
};

const updateFolderName = async (folderId, newName) => {
  try {
    const userId = getUserID();
    if (!userId) {
      console.error("No user is signed in");
      return;
    }
    await updateDoc(doc(db, "users", userId, "folders", folderId), {
      name: newName,
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
        console.log("Note name updated");n
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
    await updateDoc(
      doc(db, "users", userId, "folders", folderId, "notes", noteId),
      {
        name: updatedNote.name,
        text: updatedNote.text,
        tags: updatedNote.tags,
        dateModified: updatedNote.dateModified,
      },
    );
    console.log("Note updated successfully");
  } catch (e) {
    console.error("Error updating note: ", e);
    throw e;
  }
};

export {
  makeNewFolder,
  createUserInDatabase,
  addNewNote,
  deleteFolder,
  deleteNote,
  updateFolderName,
  updateNoteName,
  updateNote,
  getAllFolders,
};
