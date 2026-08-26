import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';

export default function useAdminAccess() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let active = true;

        const checkAccess = async () => {
            if (!user) {
                if (active) {
                    setIsAdmin(false);
                    setChecking(false);
                }
                return;
            }

            try {
                const snapshot = await getDoc(doc(db, 'users', user.uid));
                const roleIsAdmin = snapshot.data()?.role === 'admin';

                if (active) {
                    setIsAdmin(roleIsAdmin);
                    setChecking(false);
                }
            } catch (error) {
                console.error('Admin access check failed:', error);

                if (active) {
                    setIsAdmin(false);
                    setChecking(false);
                }
            }
        };

        setChecking(true);
        checkAccess();

        return () => {
            active = false;
        };
    }, [user]);

    return { isAdmin, checking };
}
