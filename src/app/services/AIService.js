import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  cleanAndParseJSON(text) {
    try {
      // Remove any markdown code block indicators
      text = text.replace(/```json\n?|\n?```/g, '');
      
      // Remove any leading/trailing whitespace
      text = text.trim();
      
      // Try to parse the cleaned text
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return null;
    }
  }

  async generateFlashcards(note) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Create 5 flashcards based on the following note content. For each flashcard, provide a question and answer format. The note content is:
    
    Title: ${note.name}
    Summary: ${note.summary}
    Content: ${note.text}
    
    Format the response as a JSON array with each flashcard having "question" and "answer" fields. Make sure to format it as valid JSON without any additional text.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return this.cleanAndParseJSON(text);
  }

  async generateQuiz(note) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Create a 5-question quiz based on the following note content. For each question, provide the question, 4 multiple choice options, and the correct answer. The note content is:
    
    Title: ${note.name}
    Summary: ${note.summary}
    Content: ${note.text}
    
    Format the response as a JSON array with each question having "question", "options" (array of 4 strings), and "correctAnswer" (index of correct option) fields. Make sure to format it as valid JSON without any additional text.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return this.cleanAndParseJSON(text);
  }

  async answerQuestion(note, question) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Based on the following note content, please answer this question: "${question}"

    Note Content:
    Title: ${note.name}
    Summary: ${note.summary}
    Content: ${note.text}

    Please provide a clear and concise answer. If the question cannot be answered based on the note content, please indicate that.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}

export const aiService = new AIService(); 