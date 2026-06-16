import { useEffect, useMemo, useState } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { User, Users, TrendingUp, Target, Award, Search } from 'lucide-react';

const Students = () => {
    const { user: currentUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [mocks, setMocks] = useState([]);
    const [search, setSearch] = useState('');

    const navigate = useNavigate();

    // ================= LOAD USERS =================
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
            setUsers(
                snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))
            );
        });

        return () => unsub();
    }, []);

    // ================= LOAD MOCKS =================
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'mocks'), (snapshot) => {
            setMocks(
                snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
        });

        return () => unsub();
    }, []);

    // ================= SAFE DATE =================
    const formatDate = (ts) => {
        if (!ts) return 'N/A';
        if (ts?.toDate) return ts.toDate().toDateString();
        return new Date(ts).toDateString();
    };

    // ================= STATS MAP (FAST) =================
    const statsMap = useMemo(() => {
        const map = {};

        mocks.forEach((m) => {
            const uid = m.userId;
            if (!uid) return;

            if (!map[uid]) {
                map[uid] = { total: 0, sum: 0, best: 0, acc: 0 };
            }

            const s = map[uid];
            const score = Number(m.totalScore || 0);
            const acc = Number(m.accuracy || 0);

            s.total += 1;
            s.sum += score;
            s.acc += acc;
            s.best = Math.max(s.best, score);
        });

        return map;
    }, [mocks]);

    const getStats = (uid) => {
        const s = statsMap[uid];
        if (!s) return { total: 0, avg: 0, best: 0, acc: 0 };

        return {
            total: s.total,
            avg: (s.sum / s.total).toFixed(1),
            best: s.best,
            acc: (s.acc / s.total).toFixed(1),
        };
    };

    // ================= FILTERED USERS =================
    const filteredUsers = useMemo(() => {
        return users
            .filter((u) => u.uid !== currentUser?.uid)
            .filter((u) =>
                u.displayName?.toLowerCase().includes(search.toLowerCase())
            );
    }, [users, search, currentUser]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-6">
            {/* ================= HEADER ================= */}
            <div
                className="
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        rounded-2xl p-5
        flex flex-col md:flex-row
        md:items-center md:justify-between
        gap-4
      "
            >
                <div className="flex items-center gap-3">
                    <Users className="text-indigo-600" />

                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Students Directory
                        </h1>
                        <p className="text-sm text-slate-500">
                            Compare performance across users
                        </p>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search students..."
                        className="
              w-full pl-9 pr-3 py-2
              rounded-xl
              border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-900
              text-slate-800 dark:text-white
              focus:ring-2 focus:ring-indigo-500 outline-none
            "
                    />
                </div>
            </div>

            {/* ================= GRID ================= */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((u) => {
                    const s = getStats(u.uid);

                    return (
                        <div
                            key={u.uid}
                            onClick={() => navigate(`/profile/${u.uid}`)}
                            className="
                cursor-pointer
                bg-white dark:bg-slate-900
                border border-slate-200 dark:border-slate-800
                rounded-2xl p-5
                hover:-translate-y-1 hover:shadow-xl
                transition
              "
                        >
                            {/* ================= USER HEADER ================= */}
                            <div className="flex items-center gap-4 mb-5">
                                {/* PROFILE IMAGE WITH FALLBACK */}
                                {u.photoURL ? (
                                    <img
                                        src={u.photoURL}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="
                    w-12 h-12 rounded-full
                    bg-indigo-100 dark:bg-slate-800
                    flex items-center justify-center
                  "
                                    >
                                        <User className="text-indigo-600 w-6 h-6" />
                                    </div>
                                )}

                                <div>
                                    <h2 className="font-semibold text-slate-900 dark:text-white">
                                        {u.displayName || 'Unknown User'}
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Joined {formatDate(u.joinedAt)}
                                    </p>
                                </div>
                            </div>

                            {/* ================= STATS ================= */}
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <Stat label="Mocks" value={s.total} />
                                <Stat label="Avg" value={s.avg} highlight />

                                <Stat label="Best" value={s.best} />
                                <Stat label="Accuracy" value={`${s.acc}%`} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Students;

/* ================= SMALL COMPONENT ================= */

const Stat = ({ label, value, highlight }) => (
    <div
        className="
    bg-slate-50 dark:bg-slate-800
    border border-slate-100 dark:border-slate-700
    rounded-xl p-2 text-center
  "
    >
        <p className="text-[11px] text-slate-500">{label}</p>

        <p
            className={`
      font-semibold
      ${highlight ? 'text-indigo-600' : 'text-slate-800 dark:text-slate-200'}
    `}
        >
            {value}
        </p>
    </div>
);
