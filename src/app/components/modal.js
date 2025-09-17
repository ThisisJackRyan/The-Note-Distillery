import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Modal({
  children,
  onClose,
  onGoBack = null,
  headerText = "",
  childrenParentClass = "",
  footerRight = null,
}) {
  return (
    <div className="fixed h-full md:h-auto inset-0 flex items-center justify-center z-50">
      <div className="md:h-auto h-full md:max-h-10/12 bg-gray-900 md:border w-full md:w-2/4 overflow-y-scroll border-gray-500 md:rounded-lg shadow-lg">
        <div className="flex text-2xl border-gray-500 justify-end items-center p-2 z-1000">
          <button
            onClick={onClose}
            className="cursor-pointer hover:text-blue-500 my-2 mx-4"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h2 className="text-white text-lg font-semibold">{headerText}</h2>
        </div>

        <div className={childrenParentClass}>{children}</div>

        {(onGoBack || footerRight) && (
          <div className="flex justify-between items-center p-6">
            <div>
              {onGoBack && (
                <button
                  onClick={onGoBack}
                  className="bg-gray-500 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-600"
                >
                  Go Back
                </button>
              )}
            </div>
            <div>{footerRight}</div>
          </div>
        )}

        
      </div>
    </div>
  );
}
