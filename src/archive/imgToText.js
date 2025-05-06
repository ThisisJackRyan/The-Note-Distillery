import { createWorker } from 'tesseract.js';
//import cv from "@techstark/opencv-js";

export async function textFromImage(imgFile){
    //const cleanedImg = processImage(imgFile.buffer)
    const worker = await createWorker('eng');
    const ret = await worker.recognize(imgFile);
    console.log("Img Text: \n" + ret.data.text)
    await worker.terminate();
}

export async function textFromImages(imgFiles){
    const worker = await createWorker('eng');
    for(let index in imgFiles){
        const ret = await worker.recognize(imgFiles[index]);
        console.log("Img " + index + " Text: \n" + ret.data.text)
    }
    await worker.terminate();
}
