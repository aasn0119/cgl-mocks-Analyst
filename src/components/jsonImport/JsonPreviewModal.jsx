const JsonPreviewModal = ({ data, onClose, onConfirm }) => {
    if (!data) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-[600px] max-h-[80vh] overflow-auto">
                <h2 className="text-xl font-bold mb-4">
                    Preview JSON ({data.length} records)
                </h2>

                <div className="space-y-2 text-sm">
                    {data.slice(0, 5).map((item, i) => (
                        <div
                            key={i}
                            className="p-2 bg-slate-100 dark:bg-slate-800 rounded"
                        >
                            <p>
                                <b>Mock:</b> {item.mockId}
                            </p>
                            <p>
                                <b>Score:</b> {item.totalScore}
                            </p>
                            <p>
                                <b>Date:</b> {item.date}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JsonPreviewModal;
