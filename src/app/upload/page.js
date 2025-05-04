"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from "react";
import { detectText, cleanParsedText, generateSummary } from '../scripts/gemini'
import AttachToFolder from '../components/attachToFolder';

export default function ScannerPage() {
const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [summarizedText, setSummarizedText] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
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
               
            <div className=" flex items-center justify-center border-2 text-4xl w-xs h-24 md:w-3xl md:h-96 border-dashed border-gray-500 rounded-lg p-4 mt-8 mb-4 cursor-pointer hover:border-blue-500 transition-colors"
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
            
            <div className="flex items-center justify-center h-6">
                {isProcessing && (
                    <span className="loader"></span>
                )}
            </div>
            
            {error && (
                <div className="mt-4 text-red-400">
                    {error}
                </div>
            )}
            {
                showModal && <AttachToFolder extractedText={extractedText} summarizedText={summarizedText} />
            }
        </div>
    );
}