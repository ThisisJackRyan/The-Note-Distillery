This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Using the VertexAI Backend Service

To avoid issues with Node.js modules in the Next.js application, we've created a separate backend service for VertexAI operations.

### Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   Or on Windows:
   ```
   install.bat
   ```

3. Configure environment variables:
   - Edit the `.env` file in the `backend` directory
   - Update the values with your Google Cloud project details

4. Start the backend service:
   ```
   npm run dev
   ```
   Or on Windows:
   ```
   start.bat
   ```

5. The backend service will run on port 3001 by default.

### API Endpoints

- **Generate Embedding**: `POST http://localhost:3001/api/embed`
  - Body: `{ "text": "Text to generate embedding for" }`
  - Response: `{ "embedding": [0.1, 0.2, ...] }`

- **Health Check**: `GET http://localhost:3001/health`
  - Response: `{ "status": "ok" }`

### Integration with Next.js

The Next.js application is configured to use the backend service for embedding generation. The `pineconeClient.js` utility has been updated to call the backend service for embedding generation.
