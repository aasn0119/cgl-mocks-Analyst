import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// FETCH ALL USERS
export const fetchUsers = async () => {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map((doc) => doc.data());
};

// FETCH ALL MOCKS
export const fetchAllMocks = async () => {
    const snap = await getDocs(collection(db, 'mocks'));
    return snap.docs.map((doc) => doc.data());
};
