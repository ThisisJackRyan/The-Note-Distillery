import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Modal({
  children,
  onClose,
  onGoBack = null,
  headerText = "",
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="h-auto max-h-10/12 bg-gray-900 border md:w-2/4 overflow-y-scroll border-gray-500 rounded-lg shadow-lg">
        <div className="flex border-b text-2xl border-gray-500 justify-end items-center p-2 z-1000">
          <button
            onClick={onClose}
            className="cursor-pointer hover:text-blue-500"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h2 className="text-white text-lg font-semibold">{headerText}</h2>
        </div>

        <div>{children}</div>

        {onGoBack && (
          <div className="flex border-t border-gray-500 justify-center p-1 bg-gray-900">
            <button
              onClick={onGoBack}
              className="bg-none border border-gray-500 rounded px-2 py-1 cursor-pointer hover:bg-gray-700 hover:text-blue-500"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
