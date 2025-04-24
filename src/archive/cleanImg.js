"use server"

const { Jimp } = require("jimp");

function createImgBuffer(imgFile){
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // `e.target.result` is the file content as a data URL or array buffer.
      const fileBuffer = e.target.result;  // This is similar to a buffer.
      
      // Example: You can now pass this fileBuffer to a server, or process it in the browser
      console.log(fileBuffer); // Logs the binary data

      // For example, sending the buffer to the server:
      // uploadFileToServer(fileBuffer);
    };
}

// Function to process the image
export async function processImage(imgPath) {
    try {
        // Read the image file
        const image = await Jimp.read(imgPath);

        // Step 1: Reduce noise (apply a blur filter)
        imgBuffer.blur(2); // The higher the number, the stronger the blur

        // Step 2: Enhance contrast
        imgBuffer.contrast(0.5); // Increase contrast (0 to 1, 0 being no change)

        // Step 3: Convert the image to grayscale
        imgBuffer.grayscale();

        const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
        return buffer;

        //return imgBuffer

        // Save the processed image to a file
        // await imgFile.writeAsync('processed_image.png');
        // console.log('Image processing complete! The processed image is saved as "processed_image.png".');
        
        //You can also display the image in the console (in a server environment, or just for confirmation):
        
    } catch (err) {
        console.error('Error processing image:', err);
        return null
    }
}