'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";


// Initialize the Gemini API with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//const ai = new GoogleGenAI({ apiKey: key });

async function detectLabels() {
    console.log("pulling labels from test image")

    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');
  
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
  
    // Performs label detection on the image file
    const [result] = await client.labelDetection(exampleImgPath);
    const labels = result.labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
}

// export async function fetchImgBuffer(imgFile){
//     console.log("Reading image buffer...");
//     console.log("File: (serverside)" + imgFile)
//     const fs = require('fs');
//     try {
//         const buffer = await fs.readFile(imgFile);
//         console.log("Image buffer successfully read.");
//         return buffer;
//     } catch (error) {
//         console.error("Error reading image file:", error);
//         throw error;
//     }
// }

/**
 * Extracts text from an image using Gemini API
 * @param {File|Buffer|string} imgData - The image file, buffer, or base64 string
 * @returns {Promise<string>} - The extracted text
 */
export async function detectText(imgData) {
  console.log("Extracting text from image using Gemini API");
  
  try {
    // Handle different types of image data
    let imageData;
    
    if (typeof imgData === 'string') {
      if (imgData.startsWith('data:image')) {
        // Already a base64 data URL
        imageData = imgData.split(',')[1];
      } else {
        // Assume it's a file path
        const fs = require('fs').promises;
        const buffer = await fs.readFile(imgData);
        imageData = buffer.toString('base64');
      }
    } else if (Buffer.isBuffer(imgData)) {
      // It's already a buffer
      imageData = imgData.toString('base64');
    } else {
      // For File objects from the browser, we need to handle them differently
      // This will be handled on the client side before calling this function
      throw new Error('File objects must be converted to base64 on the client side before calling this function');
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Prepare the image part for the API
    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: "image/jpeg"
      }
    };

    // Generate content with the image
    const result = await model.generateContent([
      "Extract and return ONLY the text from this image. Do not include any explanations or additional text.",
      imagePart
    ]);

    const response = await result.response;
    const extractedText = response.text();
    
    console.log("Text extraction successful");
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from image:", error);
    throw error;
  }
}

/**
 * Cleans and formats the extracted text
 * @param {string} imgText - The raw text extracted from the image
 * @returns {Promise<string>} - The cleaned text
 */
export async function cleanParsedText(imgText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    
    const prompt = `Clean and organize the following text, keeping only English characters and proper formatting. Remove any noise or artifacts from OCR. Return only the cleaned text without any explanations:\n\n${imgText}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanedText = response.text();
    
    console.log('Text cleaning successful');
    return cleanedText;
  } catch (error) {
    console.error('Error during text cleaning:', error);
    throw error;
  }
}

async function saveFileLocally(file, filePath) {
    const fs = require('fs');

    try {
        await fs.promises.writeFile(filePath, file);
        console.log(`File saved successfully at ${filePath}`);
    } catch (error) {
        console.error('Error saving file locally:', error);
        throw error;
    }
}