import { useState } from 'react';
import {
    collection,
    writeBatch,
    doc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';

export const useJsonImport = (userId) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ================= FILE PARSER =================
    const parseFile = (file) => {
        console.log('📂 File selected:', file.name);

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);

                    console.log('📥 Parsed JSON:', json);

                    if (!Array.isArray(json)) {
                        console.error('❌ JSON is not an array');
                        reject('JSON must be an array');
                        return;
                    }

                    console.log(`✅ Valid array with ${json.length} items`);
                    resolve(json);
                } catch (err) {
                    console.error('❌ JSON parse error:', err);
                    reject('Invalid JSON file');
                }
            };

            reader.onerror = (err) => {
                console.error('❌ File read error:', err);
                reject('File reading failed');
            };

            reader.readAsText(file);
        });
    };

    // ================= VALIDATION =================
    const validateMock = (mock, index) => {
        const isValid =
            mock &&
            typeof mock === 'object' &&
            typeof mock.mockId === 'string' &&
            mock.mockId.trim().length > 0 &&
            mock.date &&
            !isNaN(new Date(mock.date).getTime()) &&
            typeof mock.totalScore !== 'undefined' &&
            !isNaN(Number(mock.totalScore));

        if (!isValid) {
            console.warn(`⚠️ Invalid mock at index ${index}:`, mock);
        }

        return isValid;
    };

    // ================= TRANSFORM =================
    const transformMock = (mock) => {
        return {
            ...mock,

            userId,

            // ensure numeric safety
            totalScore: Number(mock.totalScore || 0),
            accuracy: Number(mock.accuracy || 0),
            rank: Number(mock.rank || 0),

            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
    };

    // ================= UPLOAD (BATCH) =================
    const uploadToFirebase = async (mocks) => {
        setLoading(true);
        setError(null);

        console.log('🚀 Starting upload process...');
        console.log('📊 Total incoming mocks:', mocks.length);

        try {
            const validMocks = mocks.filter(validateMock);

            console.log(
                `✅ Valid mocks: ${validMocks.length} / ${mocks.length}`
            );

            if (validMocks.length === 0) {
                throw new Error('No valid mocks to upload');
            }

            const batch = writeBatch(db);

            validMocks.forEach((mock, index) => {
                const transformed = transformMock(mock);

                console.log(`➡️ Preparing mock ${index + 1}:`, transformed);

                const ref = doc(collection(db, 'mocks'));
                batch.set(ref, transformed);
            });

            console.log('📦 Committing batch to Firestore...');

            await batch.commit();

            console.log('🎉 Upload successful!');

            setLoading(false);

            return {
                success: true,
                uploaded: validMocks.length,
                skipped: mocks.length - validMocks.length,
            };
        } catch (err) {
            console.error('❌ Upload failed:', err);

            setError(err.message || 'Upload failed');
            setLoading(false);

            return {
                success: false,
                error: err.message,
            };
        }
    };

    return {
        data,
        setData,
        parseFile,
        uploadToFirebase,
        loading,
        error,
    };
};
