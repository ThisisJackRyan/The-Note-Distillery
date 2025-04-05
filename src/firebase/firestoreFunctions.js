import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 
import { db, app } from "./firebaseConfig"; // Adjust the import path as necessary
import { getAuth } from "firebase/auth";


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

export { makeNewFolder, createUserInDatabase };