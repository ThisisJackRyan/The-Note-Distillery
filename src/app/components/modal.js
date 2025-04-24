export default function Modal({ content, onClose }) {
    return (
        <div className="bg-white border border-gray-300">
            <div className="flex justify-between p-1 bg-gray-200">
                <button 
                    onClick={onClose} 
                    className="bg-none border-none cursor-pointer"
                >
                    ✖
                </button>
            </div>
            <div className="p-2" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    )
}
