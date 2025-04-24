/**
 * Contains all the methods which make general prompts to the AI; image processing prompts specifically are located in the imgProcessing module
 * @author CEOFYEAST
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateAISummary(imgText) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      
      const prompt = `Generate a summary of the following text. Your summary should be between 1 and 5 sentences, whichever encapsulates the idea of the note better. Only use the most important parts, while trying to also keep the whole idea of the note. If it is a short note, keep it short if there is no need for it to be long.\n\n${imgText}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summarizedText = response.text();
      
      console.log('Text summary successful');
      return summarizedText;
    } catch (error) {
      console.error('Error during generating summary:', error);
      throw error;
    }
  }