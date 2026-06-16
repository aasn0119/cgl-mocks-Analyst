import { useEffect, useMemo, useState } from 'react';
import { FiSearch, FiTrash2, FiFilter } from 'react-icons/fi';

import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';

import {
    collection,
    query,
    where,
    onSnapshot,
    deleteDoc,
    doc,
} from 'firebase/firestore';

const platforms = [
    'Testbook',
    'Oliveboard',
    'TestRanking',
    'RBE',
    'Pundits',
    'ParmarMocks',
    'MathsMania',
    'Others',
];

const formatPlatform = (p) => (p ? String(p) : '-');

const formatDate = (d) => {
    if (!d) return '-';
    // If Firestore stores a Date or Timestamp-like value, JS Date can still handle it.
    try {
        const date = new Date(d);
        if (Number.isNaN(date.getTime())) return String(d);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    } catch {
        return String(d);
    }
};

const MockTable = () => {
    const { user } = useAuth();

    const [mocks, setMocks] = useState([]);
    const [search, setSearch] = useState('');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'mocks'),
            where('userId', '==', user.uid)
        );

        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));

            setMocks(data);
        });

        return () => unsub();
    }, [user]);

    const handleDelete = async (id) => {
        const ok = window.confirm('Delete this mock? This cannot be undone.');
        if (!ok) return;

        try {
            setDeletingId(id);
            await deleteDoc(doc(db, 'mocks', id));
        } finally {
            setDeletingId(null);
        }
    };

    const filteredMocks = useMemo(() => {
        const searchQ = search.trim().toLowerCase();

        return mocks
            .filter((m) =>
                platformFilter === 'all'
                    ? true
                    : formatPlatform(m.platform) === platformFilter
            )
            .filter((m) =>
                formatPlatform(m.platform).toLowerCase().includes(searchQ)
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [mocks, platformFilter, search]);

    return (
        <div className="mt-6">
            <div className="dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800">
                {/* Toolbar */}
                <div className="p-4 md:p-5">
                    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                        <div className="">
                            <label className="sr-only" htmlFor="mock-search">
                                Search mocks
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                                    <FiSearch />
                                </div>
                                <input
                                    id="mock-search"
                                    className=" pl-10 pr-3 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 shadow-sm"
                                    placeholder="Search by platform..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                <span className="text-indigo-500">
                                    <FiFilter />
                                </span>
                                <span>Filter</span>
                            </div>

                            <select
                                className="px-3 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 shadow-sm"
                                value={platformFilter}
                                onChange={(e) =>
                                    setPlatformFilter(e.target.value)
                                }
                                aria-label="Platform filter"
                            >
                                <option value="all">All Platforms</option>
                                {platforms.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>

                            {/* quick reset */}
                            {(search.trim() || platformFilter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setPlatformFilter('all');
                                    }}
                                    className="px-3 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm text-sm"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Summary row */}
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-3 py-1 border border-indigo-200/70 dark:border-indigo-500/20">
                            {filteredMocks.length} result
                            {filteredMocks.length === 1 ? '' : 's'}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 border border-slate-200/70 dark:border-slate-700">
                            Sorted by latest date
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr className="text-left">
                                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                                    Date
                                </th>
                                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                                    Platform
                                </th>
                                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                                    Score
                                </th>
                                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                                    Accuracy
                                </th>
                                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                                    Rank
                                </th>
                                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredMocks.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center p-10 text-slate-500 dark:text-slate-400"
                                    >
                                        No mocks found.
                                    </td>
                                </tr>
                            ) : (
                                filteredMocks.map((m) => {
                                    const accuracy =
                                        typeof m.accuracy === 'number'
                                            ? m.accuracy
                                            : Number(m.accuracy);
                                    const isHigh =
                                        Number.isFinite(accuracy) &&
                                        accuracy >= 75;
                                    const isMid =
                                        Number.isFinite(accuracy) &&
                                        accuracy >= 50 &&
                                        accuracy < 75;
                                    const accuracyBadge = isHigh
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-500/20'
                                        : isMid
                                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200/70 dark:border-amber-500/20'
                                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200/70 dark:border-rose-500/20';

                                    return (
                                        <tr
                                            key={m.id}
                                            className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                                        >
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                                                {formatDate(m.date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700">
                                                    {formatPlatform(m.platform)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">
                                                {m.totalScore ?? '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${accuracyBadge}`}
                                                >
                                                    {Number.isFinite(accuracy)
                                                        ? `${accuracy}%`
                                                        : '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-indigo-700 dark:text-indigo-300">
                                                {m.rank ?? '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(m.id)
                                                    }
                                                    disabled={
                                                        deletingId === m.id
                                                    }
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-rose-200/70 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                                    aria-label="Delete mock"
                                                >
                                                    <FiTrash2 className="text-base" />
                                                    {deletingId === m.id
                                                        ? 'Deleting...'
                                                        : 'Delete'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MockTable;
