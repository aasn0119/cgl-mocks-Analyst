import { useEffect, useMemo, useState } from 'react';
import { fetchUsers, fetchAllMocks } from '../services/leaderboardService';
import { buildLeaderboard } from '../utils/leaderboardUtils';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const users = await fetchUsers();
            const mocks = await fetchAllMocks();

            const leaderboard = buildLeaderboard(users, mocks);

            setData(leaderboard);
            setLoading(false);
        };

        load();
    }, []);

    const sorted = useMemo(
        () => [...data].sort((a, b) => b.avgScore - a.avgScore),
        [data]
    );

    const getRankStyle = (index) => {
        if (index === 0) return 'bg-yellow-400 text-black';
        if (index === 1) return 'bg-slate-300 text-black';
        if (index === 2) return 'bg-orange-400 text-black';
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    };

    return (
        <div className="space-y-8 p-6">
            {/* ================= HEADER ================= */}
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white p-8 rounded-3xl shadow-2xl">
                <h1 className="text-3xl font-extrabold">🏆 Leaderboard</h1>

                <p className="text-white/80 mt-2">
                    Compete with SSC aspirants and track top performers
                </p>
            </div>

            {/* ================= LOADING ================= */}
            {loading ? (
                <div className="text-center py-20 text-slate-500">
                    Loading leaderboard...
                </div>
            ) : sorted.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    No users found
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            {/* HEADER */}
                            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                <tr>
                                    <th className="p-4 text-left">Rank</th>
                                    <th className="p-4 text-left">User</th>
                                    <th className="p-4 text-left">Avg Score</th>
                                    <th className="p-4 text-left">
                                        Best Score
                                    </th>
                                    <th className="p-4 text-left">Accuracy</th>
                                    <th className="p-4 text-left">Mocks</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sorted.map((u, index) => (
                                    <tr
                                        key={u.uid}
                                        className="
                      border-b
                      border-slate-100
                      dark:border-slate-800
                      hover:bg-slate-50
                      dark:hover:bg-slate-800/60
                      transition
                    "
                                    >
                                        {/* RANK */}
                                        <td className="p-4 font-bold">
                                            <span
                                                className={`
                          px-3 py-1 rounded-full text-xs font-bold
                          ${getRankStyle(index)}
                        `}
                                            >
                                                #{index + 1}
                                            </span>
                                        </td>

                                        {/* USER */}
                                        <td className="p-4">
                                            <Link
                                                to={`/profile/${u.uid}`}
                                                className="
            flex items-center gap-3
            rounded-xl
            p-2
            -m-2
            transition-all
            duration-200
            hover:bg-slate-100
            dark:hover:bg-slate-800
            group
        "
                                            >
                                                <img
                                                    src={u.photoURL}
                                                    alt={u.name}
                                                    className="
                w-10 h-10
                rounded-full
                border-2 border-indigo-500
                transition-transform
                duration-200
                group-hover:scale-105
            "
                                                />

                                                <div>
                                                    <p
                                                        className="
                    font-semibold
                    text-slate-800
                    dark:text-white
                    transition-colors
                    duration-200
                    group-hover:text-indigo-600
                    dark:group-hover:text-indigo-400
                "
                                                    >
                                                        {u.name}
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>

                                        {/* SCORE */}
                                        <td className="p-4 font-semibold text-indigo-600 dark:text-indigo-400">
                                            {u.avgScore}
                                        </td>

                                        {/* BEST */}
                                        <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">
                                            {u.bestScore}
                                        </td>

                                        {/* ACCURACY */}
                                        <td className="p-4 font-semibold text-orange-500">
                                            {u.avgAccuracy}%
                                        </td>

                                        {/* MOCKS */}
                                        <td className="p-4 text-slate-700 dark:text-slate-300">
                                            {u.totalMocks}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
