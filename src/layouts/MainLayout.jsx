import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import {
    FaHome,
    FaFileAlt,
    FaChartBar,
    FaUsers,
    FaTrophy,
    FaUser,
    FaBars,
    FaSignOutAlt,
} from 'react-icons/fa';
import { FaCodeCompare } from 'react-icons/fa6';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(true);

    const menu = [
        { name: 'Dashboard', path: '/', icon: <FaHome /> },
        { name: 'Mocks', path: '/mocks', icon: <FaFileAlt /> },
        { name: 'Analytics', path: '/analytics', icon: <FaChartBar /> },
        { name: 'Compare', path: '/reports', icon: <FaCodeCompare /> },
        // { name: 'Students', path: '/students', icon: <FaUsers /> },
        { name: 'Leaderboard', path: '/leaderboard', icon: <FaTrophy /> },
        { name: 'Profile', path: `/profile/${user?.uid}`, icon: <FaUser /> },
    ];

    const sidebarWidth = open ? 'w-64' : 'w-20';

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* ================= SIDEBAR (FIXED) ================= */}
            <aside
                className={`
                    fixed
                    top-0
                    left-0
                    h-screen
                    z-50
                    backdrop-blur-xl
                    bg-white/70
                    dark:bg-slate-900/60
                    border-r
                    border-slate-200
                    dark:border-slate-800
                    shadow-xl
                    transition-all duration-300
                    ${sidebarWidth}
                `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    {open && (
                        <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                            SSC Analytics
                        </h1>
                    )}

                    <button
                        onClick={() => setOpen(!open)}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer"
                    >
                        <FaBars className="text-white" />
                    </button>
                </div>

                {/* MENU */}
                <nav className="mt-4 flex flex-col gap-1 px-2">
                    {menu.map((item, i) => (
                        <NavLink
                            key={i}
                            to={item.path}
                            className={({ isActive }) =>
                                `
                                flex items-center gap-3
                                px-3 py-3
                                rounded-xl
                                transition-all duration-200
                                ${
                                    isActive
                                        ? 'bg-indigo-500 text-white shadow-lg'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                                }
                                `
                            }
                        >
                            <span className="text-lg">{item.icon}</span>

                            {open && (
                                <span className="font-medium">{item.name}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* LOGOUT */}
                <div className="absolute bottom-4 w-full px-3">
                    <button
                        onClick={logout}
                        className="
                            flex items-center gap-3
                            w-full
                            px-3 py-3
                            rounded-xl
                            text-red-500
                            hover:bg-red-50 dark:hover:bg-red-500/10
                            transition
                        "
                    >
                        <FaSignOutAlt />
                        {open && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* ================= MAIN AREA ================= */}
            <div
                className={`
                    flex flex-col
                    transition-all duration-300
                    ${open ? 'ml-64' : 'ml-20'}
                `}
            >
                {/* TOPBAR */}
                <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 shadow-sm px-6 py-3 flex items-center justify-between">
                    <h2 className="text-sm md:text-base font-semibold text-slate-700 dark:text-slate-200">
                        Welcome back,{' '}
                        <span className="text-indigo-600 dark:text-indigo-400">
                            {user?.displayName}
                        </span>
                    </h2>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {user?.displayName}
                            </p>
                            <p className="text-xs text-slate-500">Student</p>
                        </div>

                        <img
                            src={user?.photoURL}
                            alt="user"
                            className="w-10 h-10 rounded-full border-2 border-indigo-500"
                        />
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
