export default function Modal({ content, onClose, headerText='' }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-gray-900 border border-gray-300 rounded shadow-lg">
                <div className="flex border-b border-gray-300 justify-between items-center p-1 bg-gray-900">
                    <h2 className="text-white text-lg font-semibold">{headerText}</h2>
                    <button 
                        onClick={onClose} 
                        className="bg-none border-none cursor-pointer hover:text-amber-300"
                    >
                        ✖
                    </button>
                </div>
                <div 
                    className="p-2"
                >
                    {content}
                </div>
            </div>
        </div>
    )
}
