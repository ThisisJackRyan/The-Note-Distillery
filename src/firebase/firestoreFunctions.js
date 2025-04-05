import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 
import { db, app } from "./firebaseConfig"; // Adjust the import path as necessary
import { getAuth } from "firebase/auth";
import { collection, addDoc, setDoc, doc, query, where, getDocs } from "firebase/firestore";


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
        await addDoc(collection(db, "users", getUserID, "folders"), {
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

const addNewNote = async (folderName, noteName, sources, tags, summary, text) => {
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
            sources: sources,
            tags: tags,
            summary: summary,
            text: text
        });
        console.log("Document written");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export { makeNewFolder, createUserInDatabase, addNewNote };