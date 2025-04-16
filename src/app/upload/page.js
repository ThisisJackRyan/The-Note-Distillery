"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from "react";
import { detectText, cleanParsedText, generateSummary } from '../scripts/gemini'
import { useAuth } from '../context/AuthContext'
import AttachToFolder from '../components/attachToFolder';

export default function ScannerPage() {
const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [summarizedText, setSummarizedText] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);

    // Convert File to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            setError('No file selected');
            return;
        }

        try {
            setIsProcessing(true);
            setError('');
            setSuccess('');
            
            // Convert file to base64 on the client side
            const base64Data = await fileToBase64(file);
            
            // Extract text from the image using the base64 data
            const rawText = await detectText(base64Data);
            
            // Clean the extracted text
            const cleanedText = await cleanParsedText(rawText);

            const summary = await generateSummary(cleanedText);
            
            if (cleanedText) {
                setShowModal(true);
                setExtractedText(cleanedText);
                setSummarizedText(summary);
            }
            // Display the extracted text
            
            

            
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

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

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
                onChange={handleFileChange}
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
            
            {
                showModal && <AttachToFolder extractedText={extractedText} summarizedText={summarizedText} />
            }
            

            {/* {extractedText && (
                <div className="mt-6 w-full max-w-3xl">
                    <h3 className="text-xl font-semibold mb-2">Extracted Text:</h3>
                    <div className="bg-gray-900 p-4 rounded-lg max-h-96 overflow-y-auto whitespace-pre-wrap">
                        {extractedText}
                    </div>
                    
                    {user && (
                        <button 
                            onClick={handleSaveAsNote}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            disabled={isProcessing}
                        >
                            Save as Note
                        </button>
                    )}
                </div>
            )} */}
        </div>
    );
}