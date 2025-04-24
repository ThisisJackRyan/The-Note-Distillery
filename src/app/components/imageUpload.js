import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { detectText, cleanParsedText } from '../scripts/imgProcessing'
import { generateAISummary } from '../scripts/prompts'
import { useAuth } from '../context/AuthContext'
import { useRef, useState } from "react";
import { sampleText, sampleSummary } from '../scripts/sampleText'


export default function imageUpload({setNoteContent, setSummarizedText, contentUploaded}, ){
    const [extractedText, setExtractedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const handleClick = () => {
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
        const file = event.target.files[0];
        if (!file) {
            setError('No file selected');
            return;
        }

        try {
            setIsProcessing(true);
            setError('');
            setSuccess('');

            const base64Data = await fileToBase64(file);
            
            const cleanedText = sampleText

            const summary = sampleSummary

            // actual code below
            // const rawText = await detectText(base64Data);
            
            // const cleanedText = await cleanParsedText(rawText);

            // const summary = await generateAISummary(cleanedText);
            
            if (cleanedText) {
                setExtractedText(cleanedText);
                
                // parent fields V
                setNoteContent(extractedText);
                setSummarizedText(summary);
                contentUploaded.current = true;
            }
            
            // If user is logged in, offer to save as note
            if (user) {
                setSuccess('Text extracted successfully! You can save it as a note.');
            } else {
                setSuccess('Text extracted successfully! Please log in to save as a note.');
            }
        } catch (err) {
            console.error(err);
            setError('Error processing image: ' + (err.message || 'Unknown error'));
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
                onClick={handleClick}
            >
                <FontAwesomeIcon icon={faCloudArrowUp} />
            </div>
            
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".jpg,.jpeg,.png,.pdf"
            />
            
            {isProcessing && (
                <div className="mt-4 text-blue-400">
                    Processing image... Please wait.
                </div>
            )}
            
            {error && (
                <div className="mt-4 text-red-400">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mt-4 text-green-400">
                    {success}
                </div>
            )}
        </div>
    )
}