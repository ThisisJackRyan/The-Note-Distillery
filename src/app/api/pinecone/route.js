import { NextResponse } from 'next/server';
import { semanticSearch, addNoteToPinecone } from '../../../pinecone/pineconeFunctions';

// POST /api/pinecone
export async function POST(request) {
  try {
    const { action, data } = await request.json();
    
    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }
    
    switch (action) {
      case 'addNoteToPinecone':
        if (!data.noteId || !data.embedding || !data.userId || !data.folderId) {
          return NextResponse.json({ error: 'Missing required parameters for adding note to Pinecone' }, { status: 400 });
        }
        await addNoteToPinecone(data.noteId, data.embedding, data.userId, data.folderId);
        return NextResponse.json({ success: true });
        
      case 'semanticSearch':
        if (!data.query || !data.userId) {
          return NextResponse.json({ error: 'Query and userId are required for semantic search' }, { status: 400 });
        }
        const results = await semanticSearch(data.query, data.userId, data.topK || 5);
        return NextResponse.json({ results });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in Pinecone API route:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 