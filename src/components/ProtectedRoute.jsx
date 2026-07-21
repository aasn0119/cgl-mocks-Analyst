import { Navigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, authStatus } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Still verifying against Firestore rules — avoid flashing the
    // dashboard (or the restricted page) before we know which one it is.
    if (authStatus === 'checking') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-gray-500">Checking access…</p>
            </div>
        );
    }

    if (authStatus === 'unauthorized') {
        return <Navigate to="/access-restricted" />;
    }

    return children;
};

export default ProtectedRoute;
