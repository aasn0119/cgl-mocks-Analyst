import { useAuth } from '../contexts/AuthContext';

const AccessRestricted = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                </div>

                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Access Restricted
                </h1>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    This app is private and only available to invited members.
                </p>

                {user?.email && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 break-all">
                        Signed in as{' '}
                        <span className="font-medium">{user.email}</span>, which
                        isn't on the access list.
                    </p>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    If you believe this is a mistake, please contact the admin
                    to get added.
                </p>

                <button
                    onClick={logout}
                    className="w-full py-2.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium hover:opacity-90 transition"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
};

export default AccessRestricted;
