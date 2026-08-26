import {
    deleteDoc,
    deleteField,
    doc,
    setDoc,
    updateDoc,
} from 'firebase/firestore';

import { db } from './firebase';

const userRef = (uid) => doc(db, 'users', uid);

export const createAdminUser = async ({ uid, displayName, email, role }) => {
    await setDoc(userRef(uid), {
        uid,
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        role,
    });
};

export const updateAdminUser = async (uid, updates) => {
    await updateDoc(userRef(uid), updates);
};

export const deleteAdminUser = async (uid) => {
    await deleteDoc(userRef(uid));
};

export const removeUserAdminRole = (uid) =>
    updateAdminUser(uid, { role: deleteField() });
