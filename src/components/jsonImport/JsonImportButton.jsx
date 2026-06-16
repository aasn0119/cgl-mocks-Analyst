const JsonImportButton = ({ onFileSelect }) => {
    return (
        <button
            onClick={() => document.getElementById('jsonInput').click()}
            className="
                px-4 py-2
                bg-gradient-to-r from-indigo-500 to-cyan-500
                text-white rounded-xl
                shadow-md hover:scale-105
                transition
            "
        >
            ⬆️ Import JSON
        </button>
    );
};

export default JsonImportButton;
