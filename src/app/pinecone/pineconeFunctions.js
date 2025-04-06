import { db } from '../../firebase/firebaseConfig';
import { index } from './pineconeConfig'; // Adjust the import path as necessary
//import { VertexAI } from '@google-cloud/aiplatform';

const { VertexAI } = require('@google-cloud/aiplatform');

const vertexAI = new VertexAI({
    projectId: process.env.GOOGLE_PROJECT_ID,
    location: process.env.GOOGLE_LOCATION || 'us-central1',
  });
  
const textEmbeddingModel = vertexAI.getTextEmbeddingModel('text-embedding-005');

const generateEmbedding = async (text) => {
    const [response] = await textEmbeddingModel.predict({
        instances: [{ content: text }],
    });
    
    return response.predictions[0].values;
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

    const queryVector = await generateEmbedding(query);

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

      for (const noteId of noteIds) {
        const noteDoc = await db.collection('users').doc(userId).collection('folder').doc(noteId.folderId).collection('notes').doc(noteId.id).get();
        if (noteDoc.exists) {
          noteDocs.push(noteDoc);
        }
      }

    return noteDocs.map(doc => ({ id: doc.id, ...doc.data() }));

}   

export { generateEmbedding, semanticSearch, addNoteToPinecone };