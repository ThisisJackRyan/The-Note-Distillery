require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { VertexAI } = require('@google-cloud/aiplatform');

const app = express();
const port = process.env.PORT || 3001;

// Initialize VertexAI
const vertexAI = new VertexAI({
  projectId: process.env.GOOGLE_PROJECT_ID,
  location: process.env.GOOGLE_LOCATION || 'us-central1',
});

const textEmbeddingModel = vertexAI.getTextEmbeddingModel('text-embedding-005');

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.post('/api/embed', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required for embedding generation' });
    }
    
    const [response] = await textEmbeddingModel.predict({
      instances: [{ content: text }],
    });
    
    const embedding = response.predictions[0].values;
    res.json({ embedding });
  } catch (error) {
    console.error('Error generating embedding:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`VertexAI backend server running on port ${port}`);
}); 