import { db } from '../../firebase/firebaseConfig';
import { index } from './pineconeConfig'; // Adjust the import path as necessary

// Note: The generateEmbedding function has been moved to the backend service
// This function is kept for reference but should not be used directly
const generateEmbedding = async (text) => {
    throw new Error('This function should not be used directly. Use the backend service instead.');
}

const addNoteToPinecone = async (noteId, embedding, userId, folderId) => {
    const vector = {
        id: noteId,
        values: embedding,
        metadata: {
          userId,
          folderId,
        },
      };
    
      await index.upsert({
        vectors: [vector],
      });
    
      console.log(`Note ${noteId} embedded and uploaded to Pinecone.`);
}

const semanticSearch = async (query, userId, topK = 5) => {
    // This function now expects the query to already be an embedding
    // The conversion from text to embedding should be done using the backend service
    const queryVector = query;

    const searchResult = await index.query({
        vector: queryVector,
        topK,
        filter: {
          userId
        },
        includeMetadata: true
      });

      const noteIds = searchResult.matches.map(match => match.id);

      /*
    const foldersSnapshot = await db.collection('users').doc(userId).collection('folders').get();
    const noteDocs = [];

    for (const folderDoc of foldersSnapshot.docs) {
      const notesSnapshot = await folderDoc.ref.collection('notes').where('__name__', '==', id).get();
      if (!notesSnapshot.empty) {
        noteDocs.push(...notesSnapshot.docs);
      }
    }
      */

      const noteDocs = [];
      for (const noteId of noteIds) {
        const noteDoc = await db.collection('users').doc(userId).collection('folder').doc(noteId.folderId).collection('notes').doc(noteId.id).get();
        if (noteDoc.exists) {
          noteDocs.push(noteDoc);
        }
      }

    return noteDocs.map(doc => ({ id: doc.id, ...doc.data() }));
}   

export { generateEmbedding, semanticSearch, addNoteToPinecone };