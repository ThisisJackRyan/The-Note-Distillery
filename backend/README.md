# VertexAI Backend Service

This is a simple Express backend service that handles VertexAI operations for the Note Distillery application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` (or edit the existing `.env` file)
   - Update the values in `.env` with your Google Cloud project details

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Generate Embedding
- **URL**: `/api/embed`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "text": "Text to generate embedding for"
  }
  ```
- **Response**:
  ```json
  {
    "embedding": [0.1, 0.2, ...]
  }
  ```

### Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

## Environment Variables

- `PORT`: Port to run the server on (default: 3001)
- `GOOGLE_PROJECT_ID`: Your Google Cloud project ID
- `GOOGLE_LOCATION`: Google Cloud location (default: us-central1)
- `CORS_ORIGIN`: Origin allowed for CORS (default: http://localhost:3000) 