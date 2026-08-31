import { useEffect, useMemo, useState } from 'react';
import { fetchUsers, fetchAllMocks } from '../services/leaderboardService';
import { buildLeaderboard } from '../utils/leaderboardUtils';
import { useTier } from '../contexts/TierContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
    const { tier, pattern } = useTier();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [rawMocks, setRawMocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const [u, m] = await Promise.all([fetchUsers(), fetchAllMocks()]);

            setUsers(u);
            setRawMocks(m);
            setLoading(false);
        };

        load();
    }, []);

    const data = useMemo(
        () => buildLeaderboard(users, rawMocks, tier),
        [users, rawMocks, tier]
    );

    const sorted = useMemo(
        () =>
            [...data]
                .filter((u) => u.totalMocks > 0)
                .sort((a, b) => b.avgScore - a.avgScore),
        [data]
    );

    const currentUid = user?.uid;
    const currentUserRank =
        currentUid && sorted.length
            ? sorted.findIndex((entry) => entry.uid === currentUid) + 1
            : 0;

    const champion = sorted[0] ?? null;
    const bestAverage = sorted.reduce(
        (acc, entry) => Math.max(acc, Number(entry.avgScore || 0)),
        0
    );
    const avgBoardScore =
        sorted.length > 0
            ? (
                  sorted.reduce(
                      (acc, entry) => acc + Number(entry.avgScore || 0),
                      0
                  ) / sorted.length
              ).toFixed(1)
            : '0.0';
    const totalMocks = sorted.reduce(
        (acc, entry) => acc + Number(entry.totalMocks || 0),
        0
    );
    const leaderEntry = sorted[0] ?? null;
    const currentEntry = currentUid
        ? (sorted.find((entry) => entry.uid === currentUid) ?? null)
        : null;
    const leaderGap =
        currentEntry && leaderEntry
            ? Math.max(
                  0,
                  Number(leaderEntry.avgScore || 0) -
                      Number(currentEntry.avgScore || 0)
              )
            : 0;
    const maxLeaderboardAvg =
        sorted.length > 0
            ? Math.max(...sorted.map((entry) => Number(entry.avgScore || 0)))
            : 0;
    const highestAccuracy =
        sorted.length > 0
            ? Math.max(...sorted.map((entry) => Number(entry.avgAccuracy || 0)))
            : 0;
    const currentProgress =
        leaderEntry && currentEntry
            ? Math.min(
                  100,
                  Math.round(
                      (Number(currentEntry.avgScore || 0) /
                          Math.max(Number(leaderEntry.avgScore || 1), 1)) *
                          100
                  )
              )
            : 0;

    const getRankStyle = (index) => {
        if (index === 0)
            return 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/30';
        if (index === 1)
            return 'bg-slate-300 text-black shadow-lg shadow-slate-400/30';
        if (index === 2)
            return 'bg-orange-400 text-black shadow-lg shadow-orange-500/30';
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    };

    const getPodiumStyle = (index) => {
        if (index === 0)
            return 'bg-gradient-to-br from-amber-400/25 via-yellow-400/10 to-indigo-500/20 border-yellow-400/60';
        if (index === 1)
            return 'bg-gradient-to-br from-slate-300/20 via-slate-100/10 to-indigo-500/20 border-slate-300/60';
        return 'bg-gradient-to-br from-orange-400/25 via-orange-300/10 to-indigo-500/20 border-orange-400/60';
    };

    return (
        <div className="min-h-screen bg-[#060810] p-4 text-slate-100 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.45),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.25),transparent_30%),linear-gradient(135deg,#111827,#111827,#0f172a)] p-6 shadow-[0_20px_60px_rgba(59,130,246,0.15)] md:p-8">
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)]" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-xl shadow-inner shadow-white/10">
                                    🏆
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-200">
                                    {pattern.fullName}
                                </span>
                            </div>

                            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                                Leaderboard
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
                                Track performance, compare trends, and see where
                                you stand in your mock journey.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200">
                            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                            Live ranking
                        </div>
                    </div>
                </div>

                {!loading && sorted.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            {
                                label: 'Top scorer',
                                value: champion?.name ?? '—',
                                sub: champion
                                    ? `${champion.avgScore} avg`
                                    : 'No data',
                                icon: '🥇',
                                accent: 'from-amber-400/20 via-yellow-400/10 to-violet-500/10',
                                text: 'text-amber-200',
                            },
                            {
                                label: 'Best avg',
                                value: `${bestAverage.toFixed(1)}`,
                                sub: 'Peak leaderboard score',
                                icon: '📈',
                                accent: 'from-emerald-400/20 via-teal-400/10 to-violet-500/10',
                                text: 'text-emerald-200',
                            },
                            {
                                label: 'Board avg',
                                value: `${avgBoardScore}`,
                                sub: 'Average across the group',
                                icon: '📊',
                                accent: 'from-indigo-400/20 via-violet-500/10 to-slate-500/10',
                                text: 'text-indigo-200',
                            },
                            {
                                label: 'Attempts',
                                value: `${totalMocks}`,
                                sub: 'Total mocks recorded',
                                icon: '🎯',
                                accent: 'from-pink-500/20 via-violet-500/10 to-slate-500/10',
                                text: 'text-pink-200',
                            },
                        ].map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${stat.accent} p-4 shadow-[0_12px_35px_rgba(15,23,42,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30`}
                                style={{
                                    animation: 'fadeInUp 0.45s ease both',
                                    animationDelay: `${index * 70}ms`,
                                }}
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),transparent_30%)]" />
                                <div className="relative flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-300">
                                            {stat.label}
                                        </p>
                                        <div
                                            className={`mt-3 text-2xl font-black ${stat.text}`}
                                        >
                                            {stat.value}
                                        </div>
                                        <p className="mt-1 text-sm text-slate-300">
                                            {stat.sub}
                                        </p>
                                    </div>
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl shadow-inner shadow-white/10">
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && sorted.length >= 3 && (
                    <div className="grid gap-4 lg:grid-cols-3">
                        {sorted.slice(0, 3).map((userEntry, index) => (
                            <div
                                key={userEntry.uid}
                                className={`relative overflow-hidden rounded-[28px] border p-5 shadow-[0_18px_50px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${getPodiumStyle(index)}`}
                                style={{
                                    animation: 'fadeInUp 0.5s ease both',
                                    animationDelay: `${index * 110}ms`,
                                }}
                            >
                                <div className="absolute right-4 top-4">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getRankStyle(index)}`}
                                    >
                                        #{index + 1}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 pt-8">
                                    <img
                                        src={userEntry.photoURL}
                                        alt={userEntry.name}
                                        className="h-16 w-16 rounded-2xl border-2 border-white/35 object-cover shadow-lg"
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-lg font-bold text-white">
                                            {userEntry.name}
                                        </p>
                                        <p className="text-sm text-slate-200">
                                            {userEntry.totalMocks} mocks
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                                        <p className="text-slate-300">Avg</p>
                                        <p className="mt-1 text-xl font-bold text-white">
                                            {userEntry.avgScore}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                                        <p className="text-slate-300">Best</p>
                                        <p className="mt-1 text-xl font-bold text-white">
                                            {userEntry.bestScore}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && sorted.length > 0 && (
                    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
                        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_15px_40px_rgba(15,23,42,0.2)] backdrop-blur-xl">
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                                        Score spread
                                    </p>
                                    <h3 className="mt-2 text-xl font-bold text-white">
                                        Performance ladder
                                    </h3>
                                </div>
                                <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200">
                                    {sorted.length} users
                                </span>
                            </div>

                            <div className="space-y-4">
                                {sorted.map((entry, index) => {
                                    const width =
                                        maxLeaderboardAvg > 0
                                            ? (Number(entry.avgScore || 0) /
                                                  maxLeaderboardAvg) *
                                              100
                                            : 0;
                                    const isCurrent = entry.uid === currentUid;

                                    return (
                                        <div
                                            key={entry.uid}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center justify-between gap-3 text-sm">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <img
                                                        src={entry.photoURL}
                                                        alt={entry.name}
                                                        className="h-10 w-10 rounded-full border border-white/10 object-cover"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold text-slate-100">
                                                            {entry.name}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400">
                                                            #{index + 1} •{' '}
                                                            {entry.totalMocks}{' '}
                                                            mocks
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className="font-bold text-violet-300">
                                                        {entry.avgScore}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">
                                                        {entry.avgAccuracy}% acc
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${
                                                        index === 0
                                                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                                                            : index === 1
                                                              ? 'bg-gradient-to-r from-slate-300 to-slate-500'
                                                              : index === 2
                                                                ? 'bg-gradient-to-r from-orange-400 to-rose-500'
                                                                : 'bg-gradient-to-r from-indigo-500 to-violet-500'
                                                    } ${isCurrent ? 'ring-2 ring-violet-400/40' : ''}`}
                                                    style={{
                                                        width: `${Math.max(width, 8)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-[28px] border border-violet-400/30 bg-gradient-to-r from-violet-500/15 via-indigo-500/10 to-emerald-500/10 p-5 shadow-[0_15px_40px_rgba(91,33,182,0.12)]">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-violet-200">
                                    Your insight
                                </p>
                                <h3 className="mt-2 text-xl font-bold text-white">
                                    {currentEntry
                                        ? 'Competitive edge'
                                        : 'Waiting for data'}
                                </h3>

                                {currentEntry ? (
                                    <div className="mt-4 space-y-3">
                                        <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-3">
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-violet-100">
                                                Gap to leader
                                            </p>
                                            <p className="mt-1 text-lg font-bold text-white">
                                                +{leaderGap.toFixed(1)} avg pts
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-3">
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-violet-100">
                                                Progress vs leader
                                            </p>
                                            <p className="mt-1 text-lg font-bold text-white">
                                                {currentProgress}%
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-3">
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-violet-100">
                                                Accuracy ceiling
                                            </p>
                                            <p className="mt-1 text-lg font-bold text-white">
                                                {highestAccuracy.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-3 text-sm text-violet-100/80">
                                        Your performance will appear here once
                                        your profile is linked to the
                                        leaderboard.
                                    </p>
                                )}
                            </div>

                            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_15px_40px_rgba(15,23,42,0.2)] backdrop-blur-xl">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                                    Why it matters
                                </p>
                                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                                    <li className="flex gap-2">
                                        <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                        Best score reflects peak performance.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-violet-400" />
                                        Average score reveals consistency over
                                        time.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-orange-400" />
                                        Accuracy helps measure reliability under
                                        pressure.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && currentUserRank > 0 && (
                    <div className="rounded-[24px] border border-violet-400/30 bg-gradient-to-r from-violet-500/15 via-indigo-500/10 to-emerald-500/10 p-4 shadow-[0_10px_30px_rgba(79,70,229,0.12)] backdrop-blur-xl">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.25em] text-violet-200">
                                    Your standing
                                </p>
                                <h3 className="mt-1 text-xl font-bold text-white">
                                    Rank #{currentUserRank}
                                </h3>
                            </div>
                            <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-sm font-semibold text-violet-100">
                                {sorted[currentUserRank - 1]?.avgScore ?? 0} avg
                                score
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-20 text-center text-slate-300 shadow-[0_18px_45px_rgba(15,23,42,0.2)] backdrop-blur-xl">
                        Loading leaderboard...
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-20 text-center text-slate-300 shadow-[0_18px_45px_rgba(15,23,42,0.2)] backdrop-blur-xl">
                        No users found
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_20px_50px_rgba(15,23,42,0.2)] backdrop-blur-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 z-10 bg-slate-900/80 text-slate-200 backdrop-blur-xl">
                                    <tr>
                                        <th className="p-4 text-left font-semibold">
                                            Rank
                                        </th>
                                        <th className="p-4 text-left font-semibold">
                                            User
                                        </th>
                                        <th className="p-4 text-left font-semibold">
                                            Avg Score
                                        </th>
                                        <th className="p-4 text-left font-semibold">
                                            Best Score
                                        </th>
                                        <th className="p-4 text-left font-semibold">
                                            Accuracy
                                        </th>
                                        <th className="p-4 text-left font-semibold">
                                            Mocks
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sorted.map((u, index) => {
                                        const isCurrentUser =
                                            u.uid === currentUid;

                                        return (
                                            <tr
                                                key={u.uid}
                                                className={`border-t border-white/5 transition-all duration-300 ${
                                                    isCurrentUser
                                                        ? 'bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-emerald-500/10'
                                                        : 'hover:bg-white/5'
                                                }`}
                                                style={{
                                                    animation:
                                                        'fadeInUp 0.35s ease both',
                                                    animationDelay: `${index * 25}ms`,
                                                }}
                                            >
                                                <td className="p-4 font-bold">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getRankStyle(index)}`}
                                                    >
                                                        #{index + 1}
                                                    </span>
                                                </td>

                                                <td className="p-4">
                                                    <Link
                                                        to={`/profile/${u.uid}`}
                                                        className={`flex items-center gap-3 rounded-2xl p-2 -m-2 transition-all duration-200 group ${
                                                            isCurrentUser
                                                                ? 'bg-violet-500/10 ring-1 ring-violet-400/20'
                                                                : 'hover:bg-white/5'
                                                        }`}
                                                    >
                                                        <img
                                                            src={u.photoURL}
                                                            alt={u.name}
                                                            className="h-10 w-10 rounded-full border border-violet-400/30 object-cover transition-transform duration-200 group-hover:scale-105"
                                                        />

                                                        <div className="min-w-0">
                                                            <p className="flex items-center gap-2 font-semibold text-slate-100">
                                                                <span className="truncate">
                                                                    {u.name}
                                                                </span>
                                                                {isCurrentUser && (
                                                                    <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-violet-200">
                                                                        You
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                </td>

                                                <td className="p-4 font-semibold text-violet-300">
                                                    {u.avgScore}
                                                </td>
                                                <td className="p-4 font-semibold text-emerald-300">
                                                    {u.bestScore}
                                                </td>
                                                <td className="p-4 font-semibold text-orange-300">
                                                    {u.avgAccuracy}%
                                                </td>
                                                <td className="p-4 text-slate-200">
                                                    {u.totalMocks}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(12px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Leaderboard;
