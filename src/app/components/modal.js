export default function Modal({ content, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white border border-gray-300 rounded shadow-lg">
                <div className="flex justify-between p-1 bg-gray-200">
                    <button 
                        onClick={onClose} 
                        className="bg-none border-none cursor-pointer"
                    >
                        ✖
                    </button>
                </div>
                <div className="p-2">{content}</div>
            </div>
        </div>
    )
}
