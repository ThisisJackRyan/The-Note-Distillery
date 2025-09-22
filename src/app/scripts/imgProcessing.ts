// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI } from "@google/genai";

type GenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<
        | { text?: string }
        | { inlineData?: { data?: string; mimeType?: string } }
      >;
    };
  }>;
};

function extractTextFromResponse(response: GenerateResponse): string {
  if (!response || !response.candidates || response.candidates.length === 0) {
    return "";
  }
  const parts = response.candidates[0]?.content?.parts || [];
  let text = "";
  for (const part of parts) {
    if (typeof (part as any).text === "string") {
      text += (part as any).text;
    }
  }
  return text.trim();
}

export async function detectText(
  imageBase64: string,
  mimeType: string,
  prompt: string = "Extract and return the plain text found in this image. Do not include any commentary.",
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const model = "gemini-1.5-flash";

  const contents = [
    {
      role: "user" as const,
      parts: [
        { text: prompt },
        { inlineData: { data: imageBase64, mimeType } },
      ],
    },
  ];

  const response: GenerateResponse = await ai.models.generateContent({
    model,
    contents,
  });

  const text = extractTextFromResponse(response);
  if (!text) {
    throw new Error("No text returned from Gemini");
  }
  return text;
}
