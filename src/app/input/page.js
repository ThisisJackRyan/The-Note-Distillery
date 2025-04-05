"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useRef } from "react";
import {detectText, cleanParsedText, processImgFileInput, fetchImgBuffer} from '../scripts/gemini'

const exampleImgPath = "./src/app/data/test-jps/IMG_8140.jpg"

export default function ScannerPage() {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                console.log("File: (clientside)" + file)
                detectText(file)
            } catch(err) {
              console.log(err)
            }
        } else {
            console.log('No files selected');
        }
    };

    const fileInputRef = useRef(null);

    const handleClick = () => {
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.click();
        }
    }

    return (
        <div className="flex flex-col justify-around md:justify-center items-center dark:bg-gray-900 text-white h-full">
            <div className="text-3xl font-bold">
                Upload Image Files:
            </div>
               
            <div className=" flex items-center justify-center border-2 text-4xl w-xs h-24 md:w-3xl  md:h-96 border-dashed border-gray-500 rounded-lg p-4 mt-8 cursor-pointer"
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
                
            <button onClick={() => detectText(exampleImgPath)}>Test text parse from set image filepath</button>

            <style jsx>{`
                .file-upload {
                    margin-bottom: 20px;
                }
                .fileInput {
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: white;
                    background-color: #007bff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .fileInput::-webkit-file-upload-button {
                    visibility: hidden;
                }
                .fileInput::before {
                    content: 'Upload File';
                    display: inline-block;
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .fileInput:hover::before {
                    background-color: #0056b3;
                }
                button {
                    border: 2px solid black;
                }
            `}</style>
        </div>
    );
}