"use client";

export default function ScannerPage() {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
        } else {
            console.log('No file selected');
        }
    };

    return (
        <div>
            <h1>Scanner Page</h1>
            <p>Welcome to the Scanner Page!</p>
            <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf" // Restrict file types if needed
            />
            <style jsx>{`
                #fileInput {
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: white;
                    background-color: #007bff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                #fileInput::-webkit-file-upload-button {
                    visibility: hidden;
                }
                #fileInput::before {
                    content: 'Upload File';
                    display: inline-block;
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                #fileInput:hover::before {
                    background-color: #0056b3;
                }
            `}</style>
        </div>
    );
}