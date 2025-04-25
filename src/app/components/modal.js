export default function Modal({ content, handleClose, headerText='' }) {
    // const handleClose = (() => {
    //     console.log("Closing")
    // })

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-gray-900 border border-gray-300 rounded shadow-lg">
                <div className="flex border-b border-gray-300 justify-between items-center p-1 bg-gray-900 z-1000">
                    <h2 className="text-white text-lg font-semibold">{headerText}</h2>
                    <button 
                        onClick={handleClose} 
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
