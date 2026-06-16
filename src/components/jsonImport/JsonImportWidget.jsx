import { useState } from 'react';
import JsonImportButton from './JsonImportButton';
import JsonPreviewModal from './JsonPreviewModal';
import { useJsonImport } from '../../hooks/useJsonImport';

const JsonImportWidget = ({ userId }) => {
    const { parseFile, uploadToFirebase, loading } = useJsonImport(userId);

    const [previewData, setPreviewData] = useState(null);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const json = await parseFile(file);
        setPreviewData(json);
    };

    const handleUpload = async () => {
        await uploadToFirebase(previewData);
        setPreviewData(null);
        alert('Upload complete 🚀');
    };

    return (
        <div className="flex items-center gap-3">
            {/* BUTTON */}
            <JsonImportButton />

            {/* FILE INPUT */}
            <input
                type="file"
                accept="application/json"
                hidden
                id="jsonInput"
                onChange={handleFile}
            />

            {/* PREVIEW MODAL */}
            {previewData && (
                <JsonPreviewModal
                    data={previewData}
                    onClose={() => setPreviewData(null)}
                    onConfirm={handleUpload}
                />
            )}

            {loading && (
                <span className="text-sm text-slate-500">Uploading...</span>
            )}
        </div>
    );
};

export default JsonImportWidget;
