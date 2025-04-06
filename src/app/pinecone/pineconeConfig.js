import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX); // e.g., "notes"

export { index, pc };