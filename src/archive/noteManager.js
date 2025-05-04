"use server";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

/**
 * Saves the extracted text as a note in the user's folder
 * @param {string} userId - The ID of the current user
 * @param {string} text - The text content to save as a note
 * @param {string} title - The title of the note (optional)
 * @returns {Promise<string>} - The ID of the created note
 */
export async function saveNoteAsText(userId, text, title = "Extracted Note") {
  try {
    if (!userId) {
      throw new Error("User ID is required to save a note");
    }

    if (!text || text.trim() === "") {
      throw new Error("Note content cannot be empty");
    }

    // Create a reference to the user's notes collection
    const notesRef = collection(db, "users", userId, "notes");

    // Add the note to Firestore
    const docRef = await addDoc(notesRef, {
      title: title,
      content: text,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      type: "text",
      source: "image-extraction",
    });

    console.log(`Note saved successfully with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error saving note:", error);
    throw error;
  }
}
