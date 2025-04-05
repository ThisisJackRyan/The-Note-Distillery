"use client";

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

    return (
        <div>
            <h1>Scanner Page</h1>
            <p>Welcome to the Scanner Page!</p>

            <div className="file-upload">
                <label>
                    Upload Image Files:
                    <input
                        type="file"
                        className="fileInput"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                    />
                </label>
            </div>

            <div className="file-upload">
                <label>
                    Upload Text File:
                    <input
                        type="file"
                        className="fileInput"
                        onChange={handleFileChange}
                        accept=".txt"
                    />
                </label>
            </div>

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
            `}</style>
        </div>
    );
}