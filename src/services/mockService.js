import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    query,
    where,
    onSnapshot,
} from 'firebase/firestore';

import { db } from './firebase';

const mocksRef = collection(db, 'mocks');

export const addMock = async (mockData) => {
    return await addDoc(mocksRef, {
        ...mockData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

export const listenToMocks = (userId, callback) => {
    const q = query(mocksRef, where('userId', '==', userId));

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        callback(data);
    });
};

export const updateMock = (id, data) => {
    return updateDoc(doc(db, 'mocks', id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
};
