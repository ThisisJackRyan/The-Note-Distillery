export default function Modal({
  children,
  onClose,
  onGoBack = null,
  headerText = "",
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-300 rounded shadow-lg">
        <div className="flex border-b border-gray-300 justify-between items-center p-1 bg-gray-900 z-1000">
          <button
            onClick={onClose}
            className="bg-none border-none cursor-pointer hover:text-amber-300"
          >
            ✖
          </button>
          <h2 className="text-white text-lg font-semibold">{headerText}</h2>
        </div>

        <div className="p-2">{children}</div>

        {onGoBack && (
          <div className="flex border-t border-gray-300 justify-center p-1 bg-gray-900">
            <button
              onClick={onGoBack}
              className="bg-none border border-gray-300 rounded px-2 py-1 cursor-pointer hover:bg-gray-700 hover:text-amber-300"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
