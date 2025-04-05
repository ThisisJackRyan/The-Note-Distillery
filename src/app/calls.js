import { createWorker } from 'tesseract.js';
//import cv from "@techstark/opencv-js";

export async function textFromImage(imgFile){
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

/*
export function cleanImage(imgFile){
    // Convert edgesMat back to an image file
    let canvas = document.createElement('canvas');
    cv.imshow(canvas, edgesMat);

    let mat = cv.imread(imgFile);  // Read the image into Mat
    let grayMat = new cv.Mat();
    cv.cvtColor(mat, grayMat, cv.COLOR_RGBA2GRAY);  // Convert to grayscale

    // Optional: Resize the image
    let resizedMat = new cv.Mat();
    cv.resize(grayMat, resizedMat, new cv.Size(224, 224));  // Resize to 224x224

    // Apply Gaussian blur to remove noise
    let blurredMat = new cv.Mat();
    cv.GaussianBlur(resizedMat, blurredMat, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);

    // Apply binary thresholding
    let thresholdMat = new cv.Mat();
    cv.threshold(blurredMat, thresholdMat, 100, 255, cv.THRESH_BINARY);

    // Optional: Edge detection
    let edgesMat = new cv.Mat();
    cv.Canny(thresholdMat, edgesMat, 100, 200);

    // Convert edgesMat back to an image file
    let canvas = document.createElement('canvas');
    cv.imshow(canvas, edgesMat);
    let imageFile = canvas.toDataURL(); // Convert canvas to a data URL (image file)
    return imageFile;



    // Optional: Morphological operation
    // let kernel = cv.Mat.ones(5, 5, cv.CV_8U);
    // let morphMat = new cv.Mat();
    // cv.morphologyEx(edgesMat, morphMat, cv.MORPH_CLOSE, kernel);

    // Display the cleaned image
    // cv.imshow('outputCanvas', morphMat);

    // Clean up memory
    mat.delete();
    grayMat.delete();
    resizedMat.delete();
    blurredMat.delete();
    thresholdMat.delete();
    edgesMat.delete();
    morphMat.delete();
}
    */