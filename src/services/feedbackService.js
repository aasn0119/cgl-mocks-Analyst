import {
    addDoc,
    collection,
    onSnapshot,
    serverTimestamp,
    updateDoc,
    doc,
} from 'firebase/firestore';

import { db } from './firebase';

const feedbackRef = collection(db, 'feedback');

export const submitFeedback = async ({
    userId,
    userName,
    userEmail,
    category,
    rating,
    message,
}) =>
    addDoc(feedbackRef, {
        userId,
        userName,
        userEmail,
        category,
        rating,
        message,
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

export const listenToFeedback = (callback, onError) =>
    onSnapshot(feedbackRef, callback, onError);

export const updateFeedbackStatus = (feedbackId, status) =>
    updateDoc(doc(db, 'feedback', feedbackId), {
        status,
        updatedAt: serverTimestamp(),
    });
