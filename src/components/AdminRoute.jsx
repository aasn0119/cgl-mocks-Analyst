import { Navigate } from 'react-router-dom';

import useAdminAccess from '../hooks/useAdminAccess';

const AdminRoute = ({ children }) => {
    const { isAdmin, checking } = useAdminAccess();

    if (checking) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
                Checking admin access...
            </div>
        );
    }

    return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
