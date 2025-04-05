"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useRef } from "react";
import { textFromImage } from "../calls";

export default function ScannerPage() {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
              console.log("Processing Image")
              textFromImage(file)
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
            
        </div>
    );
}