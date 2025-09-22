import { GoogleGenAI } from '@google/genai';

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
  
export async function generateSummary(content: string) : Promise<string> {
  const basePrompt = "Generate a short summary from given content: ";
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const model = 'gemini-1.5-flash';

  const contents = [
    {
      role: 'user' as const,
      parts: [
        { text: basePrompt + content },
      ],
    },
  ];

  const response: GenerateResponse = await ai.models.generateContent({
    model,
    contents,
  });

  // Extract concatenated text parts
  const parts = response.candidates?.[0]?.content?.parts || [];
  let text = '';
  for (const part of parts as Array<{ text?: string }>) {
    if (typeof part?.text === 'string') text += part.text;
  }
  if (!text.trim()) throw new Error('No summary returned from Gemini');
  return text.trim();
}