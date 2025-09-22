import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useRef, useState } from "react";

export default function ImageUpload({ onContentUploaded, enabled }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);
  const [stateMsg, setStateMsg] = useState("");
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      if (enabled) fileInputRef.current.click();
      else {
        setError(true);
        setStateMsg("Upload is currently disabled");
      }
    }
  };

  const handleFileUpload = async (event) => {
    console.log("Handling file upload");

    const file = event.target.files[0];
    if (!file) {
      setError(true);
      setStateMsg("No file selected");
      return;
    }

    try {
      setIsProcessing(true);
      setError(false);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/img-processing", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to process image");
      }

      const extractedText = data?.text || "";
      if (extractedText) {
        onContentUploaded(extractedText);
      } else {
        throw new Error("No text returned from processing");
      }

      // If user is logged in, offer to save as note
      if (user) {
        setStateMsg("Text extracted successfully! You can save it as a note.");
      } else {
        setStateMsg(
          "Text extracted successfully! Please log in to save as a note.",
        );
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setStateMsg("Error processing this image, please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col justify-around md:justify-center items-center bg-gray-900 text-white h-full p-4">
      <div className="text-3xl font-bold mb-4">Upload Image Files:</div>

      <div
        className="flex items-center justify-center border-2 text-4xl w-xs h-24 md:w-3xl md:h-96 border-dashed border-gray-500 rounded-lg p-4 mt-8 cursor-pointer hover:border-blue-500 transition-colors"
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
          event.target.value = ""; // Clear the input after handling the file
        }}
        accept=".jpg,.jpeg,.png,.pdf"
      />

      {isProcessing && (
        <div className="absolute inset-0 w-full h-full z-100 bg-black opacity-70 flex flex-col justify-center items-center">
          <div className="loader"></div>
          <p>The text is being extracted, this may take a moment.</p>
        </div>
      )}

      {error && <div className="mt-4 text-red-400">{stateMsg}</div>}
    </div>
  );
}
