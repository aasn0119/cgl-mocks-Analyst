import { createContext, useContext, useEffect, useState } from 'react';

import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db, googleProvider } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// "checking"      -> we're still verifying against Firestore rules
// "authorized"    -> user's email is on the allow-list (Firestore let us read)
// "unauthorized"  -> signed in, but blocked by Firestore rules
// null            -> not signed in at all
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [authStatus, setAuthStatus] = useState(null);

    const [loading, setLoading] = useState(true);

    // Tries to read the user's own profile doc. If Firestore rules
    // reject it (permission-denied), the account isn't on the allow-list.
    const checkAuthorization = async (currentUser) => {
        const userRef = doc(db, 'users', currentUser.uid);

        try {
            const snap = await getDoc(userRef);

            if (!snap.exists()) {
                await setDoc(userRef, {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    email: currentUser.email,
                    photoURL: currentUser.photoURL,
                    joinedAt: serverTimestamp(),
                    role: 'student',
                });
            }

            setAuthStatus('authorized');
        } catch (error) {
            if (error.code === 'permission-denied') {
                setAuthStatus('unauthorized');
            } else {
                // Unexpected error (offline, etc.) — don't silently grant
                // access, but log it so it's distinguishable from a real block.
                console.error(error);
                setAuthStatus('unauthorized');
            }
        }
    };

    const login = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            // authorization check runs from the onAuthStateChanged
            // listener below once Firebase confirms the sign-in
        } catch (error) {
            console.error(error);
        }
    };

    const logout = () => {
        setAuthStatus(null);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                setAuthStatus('checking');
                await checkAuthorization(currentUser);
            } else {
                setAuthStatus(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                authStatus,
                login,
                logout,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
