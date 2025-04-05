'use server'

import { GoogleGenAI } from "@google/genai";

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
 * Can input buffer or serverside file path to image
 */
export async function detectText(imgData){
    console.log("pulling text from image data")

    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');
    const fs = require('fs');
  
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    saveFileLocally(imgData, "./img-file").then(() => {
        client.textDetection("./img-file").then((result) => {
            const detections = result.textAnnotations;
            const parsedText = detections[0]["description"]

            fs.writeFile('./detections.json', JSON.stringify(detections, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log('Detections logged to detections.json');
                }
            });

        return parsedText
        })
    })
    
}

export async function cleanParsedText(imgText){
    const ai = new GoogleGenAI({ apiKey: key });

    try {
        const prompt = `Clean and organize the following text, keeping only English characters:\n\n${imgText}`;
        const response = await ai.generateText({ prompt });
        const cleanedText = response.data.text;
        console.log('Cleaned Text:', cleanedText);
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