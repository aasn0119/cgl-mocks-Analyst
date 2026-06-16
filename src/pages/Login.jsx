import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
    const { login, user } = useAuth();

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 relative overflow-hidden">
            {/* background glow blobs */}
            <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-10"></div>
            <div className="absolute w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl bottom-10 right-10"></div>

            {/* CARD */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-8 text-white">
                    {/* HEADER */}
                    <h1 className="text-3xl font-extrabold text-center">
                        SSC CGL Analytics
                    </h1>

                    <p className="text-center text-white/80 mt-3 text-sm">
                        Track mock performance, analytics & rankings in one
                        place
                    </p>

                    {/* FEATURES */}
                    <div className="mt-6 space-y-2 text-sm text-white/80">
                        <p>📊 Real-time performance tracking</p>
                        <p>📈 Advanced analytics dashboard</p>
                        <p>🏆 Competitive leaderboard</p>
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={login}
                        className="
              mt-8 w-full
              flex items-center justify-center gap-3
              bg-white text-slate-800
              font-semibold
              py-3 rounded-2xl
              hover:scale-[1.02]
              active:scale-[0.98]
              transition
              shadow-lg
            "
                    >
                        <FcGoogle className="text-xl" />
                        Sign in with Google
                    </button>

                    {/* FOOTER */}
                    <p className="text-xs text-center text-white/60 mt-6">
                        Secure login powered by Google Authentication
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
