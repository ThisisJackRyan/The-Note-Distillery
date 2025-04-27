import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { detectText, cleanParsedText } from '../scripts/imgProcessing'
import { generateAISummary } from '../scripts/prompts'
import { useAuth } from '../context/AuthContext'
import { useRef, useState } from "react";
import { sampleText, sampleSummary } from '../scripts/sampleText'

export default function imageUpload({onContentUploaded}, ){
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [stateMsg, setStateMsg] = useState('')
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileUpload = async (event) => {
        console.log("Handling file upload")

        const file = event.target.files[0];
        if (!file) {
            setError(true);
            setStateMsg('No file selected')
            return;
        }

        try {
            setIsProcessing(true);
            setError(false);
            setSuccess(false);

            const base64Data = await fileToBase64(file);
            
            const cleanedText = sampleText

            const summary = sampleSummary

            // actual code below
            // const rawText = await detectText(base64Data);
            
            // const cleanedText = await cleanParsedText(rawText);

            // const summary = await generateAISummary(cleanedText);
            
            if (cleanedText) {
                onContentUploaded(cleanedText, summary)
            }
            
            // If user is logged in, offer to save as note
            if (user) {
                setSuccess(true)
                setStateMsg('Text extracted successfully! You can save it as a note.');
            } else {
                setSuccess(true)
                setStateMsg('Text extracted successfully! Please log in to save as a note.');
            }
        } catch (err) {
            console.error(err);
            setError(true)
            setStateMsg('Error processing image: ' + (err.message || 'Unknown error'));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col justify-around md:justify-center items-center bg-gray-900 text-white h-full p-4">
            <div className="text-3xl font-bold mb-4">
                Upload Image Files:
            </div>
                
            <div className="flex items-center justify-center border-2 text-4xl w-xs h-24 md:w-3xl md:h-96 border-dashed border-gray-500 rounded-lg p-4 mt-8 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={handleUploadClick}
            >
                <FontAwesomeIcon icon={faCloudArrowUp} />
            </div>
            
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(event) => {
                    handleFileUpload(event);
                    event.target.value = ''; // Clear the input after handling the file
                }}
                accept=".jpg,.jpeg,.png,.pdf"
            />
            
            {isProcessing && (
                <div className="mt-4 text-blue-400">
                    Processing image... Please wait.
                </div>
            )}
            
            {error && (
                <div className="mt-4 text-red-400">
                    {stateMsg}
                </div>
            )}
            
            {success && (
                <div className="mt-4 text-green-400">
                    {stateMsg}
                </div>
            )}
        </div>
    )
}