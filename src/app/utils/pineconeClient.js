/**
 * Client-side utility for interacting with the Pinecone API
 */

/**
 * Generate an embedding for the given text
 * @param {string} text - The text to generate an embedding for
 * @returns {Promise<Array<number>>} - The embedding vector
 */
export async function generateEmbedding(text) {
  const response = await fetch('/api/pinecone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'generateEmbedding',
      data: { text },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate embedding');
  }

  const data = await response.json();
  return data.embedding;
}

/**
 * Add a note to Pinecone
 * @param {string} noteId - The ID of the note
 * @param {Array<number>} embedding - The embedding vector
 * @param {string} userId - The ID of the user
 * @param {string} folderId - The ID of the folder
 * @returns {Promise<void>}
 */
export async function addNoteToPinecone(noteId, embedding, userId, folderId) {
  const response = await fetch('/api/pinecone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'addNoteToPinecone',
      data: { noteId, embedding, userId, folderId },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add note to Pinecone');
  }

  return await response.json();
}

/**
 * Perform a semantic search
 * @param {string} query - The search query
 * @param {string} userId - The ID of the user
 * @param {number} topK - The number of results to return
 * @returns {Promise<Array>} - The search results
 */
export async function semanticSearch(query, userId, topK = 5) {
  const response = await fetch('/api/pinecone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'semanticSearch',
      data: { query, userId, topK },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to perform semantic search');
  }

  const data = await response.json();
  return data.results;
} 