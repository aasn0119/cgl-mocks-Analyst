// import WorkInProgress from './WorkInProgress';

// const Reports = () => {
//     return (
//         <WorkInProgress
//             title="Reports Dashboard"
//             subtitle="Advanced analytics dashboard coming soon"
//         />
//     );
// };

// export default Reports;
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import {
    collection,
    query,
    where,
    onSnapshot,
    getDocs,
} from 'firebase/firestore';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from 'recharts';

/* ─── palette ─── */
const ME = {
    primary: '#7F77DD',
    light: 'rgba(127,119,221,0.15)',
    label: 'You',
};
const THEM = {
    primary: '#1D9E75',
    light: 'rgba(29,158,117,0.15)',
    label: 'Them',
};

const C = {
    purple: '#7F77DD',
    teal: '#1D9E75',
    amber: '#EF9F27',
    red: '#E24B4A',
    blue: '#378ADD',
    pink: '#D4537E',
};

/* ─── inject global styles once ─── */
const STYLE = `
    :root { --card:#0f1117; --border:rgba(255,255,255,0.09); --text:#e2e8f0; --bg:#060810; }
    .cmp-root { min-height:100vh; background:var(--bg); color:var(--text); padding:24px; font-family:sans-serif; }
    .cmp-root * { box-sizing:border-box; }
    .hover-lift { transition:transform 0.18s; cursor:default; }
    .hover-lift:hover { transform:translateY(-2px); }
    .fade-in { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin { to { transform:rotate(360deg); } }
`;

/* ─── helpers ─── */
const avg = (arr, key) => {
    if (!arr.length) return 0;
    return arr.reduce((s, m) => s + Number(m[key] || 0), 0) / arr.length;
};
const best = (arr, key) =>
    arr.length ? Math.max(...arr.map((m) => Number(m[key] || 0))) : 0;

const formatDate = (t) => {
    if (!t) return '—';
    const d = t?.toDate ? t.toDate() : new Date(t);
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const buildStats = (mocks) => {
    if (!mocks.length) return null;
    const sorted = [...mocks].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );
    return {
        totalMocks: sorted.length,
        avgScore: avg(sorted, 'totalScore').toFixed(1),
        bestScore: best(sorted, 'totalScore'),
        avgAccuracy: avg(sorted, 'accuracy').toFixed(1),
        avgPercentile: avg(sorted, 'percentile').toFixed(1),
        avgQuant: avg(sorted, 'quantScore').toFixed(1),
        avgReasoning: avg(sorted, 'reasoningScore').toFixed(1),
        avgEnglish: avg(sorted, 'englishScore').toFixed(1),
        avgGk: avg(sorted, 'gkScore').toFixed(1),
        trend: sorted.map((m, i) => ({
            attempt: i + 1,
            score: Number(m.totalScore || 0),
            accuracy: Number(m.accuracy || 0),
            percentile: Number(m.percentile || 0),
            quant: Number(m.quantScore || 0),
            reasoning: Number(m.reasoningScore || 0),
            english: Number(m.englishScore || 0),
            gk: Number(m.gkScore || 0),
        })),
    };
};

/* ─── sub-components ─── */

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 12,
            }}
        >
            <p style={{ color: '#888', marginBottom: 6 }}>Attempt {label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color, margin: '2px 0' }}>
                    {p.name}:{' '}
                    <b>
                        {typeof p.value === 'number'
                            ? p.value.toFixed(1)
                            : p.value}
                    </b>
                </p>
            ))}
        </div>
    );
};

const Avatar = ({ user, size = 48 }) => {
    const initials = (user?.displayName || 'U')
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
    return user?.photoURL ? (
        <img
            src={user.photoURL}
            style={{
                width: size,
                height: size,
                borderRadius: size / 4,
                objectFit: 'cover',
                border: '2px solid rgba(255,255,255,0.15)',
            }}
            alt="avatar"
        />
    ) : (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: size / 4,
                background: 'rgba(127,119,221,0.25)',
                border: '2px solid rgba(127,119,221,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: size * 0.35,
                color: '#AFA9EC',
            }}
        >
            {initials}
        </div>
    );
};

const StatBattle = ({ label, meVal, themVal, icon, higherBetter = true }) => {
    const me = parseFloat(meVal) || 0;
    const them = parseFloat(themVal) || 0;
    const meWins = higherBetter ? me > them : me < them;
    const themWins = higherBetter ? them > me : them < me;
    const total = me + them || 1;
    const mePct = Math.round((me / total) * 100);

    return (
        <div
            className="hover-lift"
            style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 8,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                }}
            >
                <span style={{ fontSize: 11, color: '#666' }}>
                    {icon} {label}
                </span>
                {meWins && (
                    <span
                        style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: ME.primary,
                            background: ME.light,
                            padding: '2px 8px',
                            borderRadius: 99,
                        }}
                    >
                        You win
                    </span>
                )}
                {themWins && (
                    <span
                        style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: THEM.primary,
                            background: THEM.light,
                            padding: '2px 8px',
                            borderRadius: 99,
                        }}
                    >
                        They win
                    </span>
                )}
                {!meWins && !themWins && (
                    <span
                        style={{
                            fontSize: 10,
                            color: '#555',
                            padding: '2px 8px',
                        }}
                    >
                        Tie
                    </span>
                )}
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                }}
            >
                <span
                    style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: meWins ? ME.primary : '#e2e8f0',
                    }}
                >
                    {meVal}
                </span>
                <span
                    style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: themWins ? THEM.primary : '#e2e8f0',
                    }}
                >
                    {themVal}
                </span>
            </div>
            <div
                style={{
                    height: 6,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                }}
            >
                <div
                    style={{
                        width: `${mePct}%`,
                        background: ME.primary,
                        borderRadius: '3px 0 0 3px',
                        transition: 'width 0.8s ease',
                    }}
                />
                <div
                    style={{
                        flex: 1,
                        background: THEM.primary,
                        borderRadius: '0 3px 3px 0',
                    }}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 10,
                    color: '#555',
                    marginTop: 4,
                }}
            >
                <span style={{ color: ME.primary }}>You</span>
                <span style={{ color: THEM.primary }}>Them</span>
            </div>
        </div>
    );
};

const ChartCard = ({ title, icon, children, legend }) => (
    <div
        style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '18px 20px 12px',
        }}
    >
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
            }}
        >
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span
                style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}
            >
                {title}
            </span>
        </div>
        {legend && (
            <div
                style={{
                    display: 'flex',
                    gap: 14,
                    flexWrap: 'wrap',
                    margin: '8px 0 10px',
                }}
            >
                {legend.map((l, i) => (
                    <span
                        key={i}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 11,
                            color: '#888',
                        }}
                    >
                        <span
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: l.color,
                                display: 'inline-block',
                            }}
                        />
                        {l.label}
                    </span>
                ))}
            </div>
        )}
        {children}
    </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Reports() {
    const { user } = useAuth();

    const [allUsers, setAllUsers] = useState([]);
    const [selectedUid, setSelectedUid] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [myMocks, setMyMocks] = useState([]);
    const [themMocks, setThemMocks] = useState([]);
    const [themUser, setThemUser] = useState(null);
    const [loadingThem, setLoadingThem] = useState(false);

    /* inject styles */
    useEffect(() => {
        const el = document.createElement('style');
        el.innerHTML = STYLE;
        document.head.appendChild(el);
        return () => document.head.removeChild(el);
    }, []);

    /* fetch all users for dropdown */
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'users'), (snap) => {
            setAllUsers(
                snap.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .filter((u) => u.uid !== user?.uid)
            );
        });
        return () => unsub();
    }, [user]);

    /* fetch MY mocks */
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'mocks'),
            where('userId', '==', user.uid)
        );
        const unsub = onSnapshot(q, (snap) => {
            setMyMocks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [user]);

    /* fetch THEIR mocks + user doc when selection changes */
    useEffect(() => {
        if (!selectedUid) {
            setThemMocks([]);
            setThemUser(null);
            return;
        }
        setLoadingThem(true);

        const q = query(
            collection(db, 'mocks'),
            where('userId', '==', selectedUid)
        );
        const unsub = onSnapshot(q, (snap) => {
            setThemMocks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoadingThem(false);
        });

        getDocs(
            query(collection(db, 'users'), where('uid', '==', selectedUid))
        ).then((snap) => {
            if (!snap.empty) setThemUser(snap.docs[0].data());
        });

        return () => unsub();
    }, [selectedUid]);

    const myStats = useMemo(() => buildStats(myMocks), [myMocks]);
    const themStats = useMemo(() => buildStats(themMocks), [themMocks]);

    /* merged trend — align by attempt index */
    const mergedTrend = useMemo(() => {
        if (!myStats || !themStats) return [];
        const len = Math.max(myStats.trend.length, themStats.trend.length);
        return Array.from({ length: len }, (_, i) => ({
            attempt: i + 1,
            myScore: myStats.trend[i]?.score ?? null,
            themScore: themStats.trend[i]?.score ?? null,
            myAcc: myStats.trend[i]?.accuracy ?? null,
            themAcc: themStats.trend[i]?.accuracy ?? null,
        }));
    }, [myStats, themStats]);

    const subjectCompare = useMemo(() => {
        if (!myStats || !themStats) return [];
        return [
            {
                subject: 'Quant',
                me: Number(myStats.avgQuant),
                them: Number(themStats.avgQuant),
            },
            {
                subject: 'Reasoning',
                me: Number(myStats.avgReasoning),
                them: Number(themStats.avgReasoning),
            },
            {
                subject: 'English',
                me: Number(myStats.avgEnglish),
                them: Number(themStats.avgEnglish),
            },
            {
                subject: 'GK',
                me: Number(myStats.avgGk),
                them: Number(themStats.avgGk),
            },
        ];
    }, [myStats, themStats]);

    const radarData = subjectCompare;

    const filteredUsers = allUsers.filter((u) =>
        (u.displayName || u.email || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const selectedUser = allUsers.find((u) => u.uid === selectedUid);

    /* ── win counter ── */
    const battleResults = useMemo(() => {
        if (!myStats || !themStats) return null;
        const keys = [
            ['avgScore', true],
            ['bestScore', true],
            ['avgAccuracy', true],
            ['avgPercentile', true],
            ['totalMocks', true],
        ];
        let meWins = 0,
            themWins = 0;
        keys.forEach(([k, hb]) => {
            const me = parseFloat(myStats[k]) || 0;
            const them = parseFloat(themStats[k]) || 0;
            if (hb ? me > them : me < them) meWins++;
            else if (hb ? them > me : them < me) themWins++;
        });
        return { meWins, themWins, total: keys.length };
    }, [myStats, themStats]);

    /* ── loading state ── */
    if (!myStats)
        return (
            <div
                className="cmp-root"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            border: '3px solid rgba(127,119,221,0.2)',
                            borderTop: `3px solid ${ME.primary}`,
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            margin: '0 auto 12px',
                        }}
                    />
                    <p style={{ color: '#888', fontSize: 13 }}>
                        Loading your data…
                    </p>
                </div>
            </div>
        );

    return (
        <div className="cmp-root">
            {/* ── HEADER ── */}
            <div
                style={{
                    background:
                        'linear-gradient(135deg, #26215C 0%, #534AB7 50%, #185FA5 100%)',
                    borderRadius: 24,
                    padding: '24px 28px',
                    marginBottom: 24,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: -40,
                        right: -40,
                        width: 180,
                        height: 180,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        pointerEvents: 'none',
                    }}
                />
                <h1
                    style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: 4,
                    }}
                >
                    ⚔️ Compare Performance
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                    Select a student to compare scores, accuracy, and subject
                    breakdown side by side.
                </p>
            </div>

            {/* ── USER SELECTOR ── */}
            <div
                style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    padding: '20px 24px',
                    marginBottom: 20,
                    position: 'relative',
                }}
            >
                <p
                    style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: 12,
                    }}
                >
                    Choose a student to compare with
                </p>

                {/* custom dropdown trigger */}
                <div
                    onClick={() => setDropdownOpen((o) => !o)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${dropdownOpen ? ME.primary : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 12,
                        padding: '10px 14px',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                        userSelect: 'none',
                    }}
                >
                    {selectedUser ? (
                        <>
                            <Avatar user={selectedUser} size={32} />
                            <span style={{ fontWeight: 600, fontSize: 14 }}>
                                {selectedUser.displayName || selectedUser.email}
                            </span>
                        </>
                    ) : (
                        <>
                            <span style={{ fontSize: 18 }}>👤</span>
                            <span style={{ color: '#666', fontSize: 14 }}>
                                Select a student…
                            </span>
                        </>
                    )}
                    <span
                        style={{
                            marginLeft: 'auto',
                            color: '#555',
                            fontSize: 12,
                            transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s',
                        }}
                    >
                        ▼
                    </span>
                </div>

                {/* dropdown panel */}
                {dropdownOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            left: 24,
                            right: 24,
                            top: 'calc(100% - 12px)',
                            zIndex: 100,
                            background: '#13131f',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 14,
                            padding: '8px',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                        }}
                    >
                        <input
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Search by name…"
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: '#e2e8f0',
                                fontSize: 13,
                                outline: 'none',
                                marginBottom: 6,
                            }}
                        />
                        <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                            {filteredUsers.length === 0 && (
                                <p
                                    style={{
                                        padding: '12px',
                                        color: '#555',
                                        fontSize: 13,
                                        textAlign: 'center',
                                    }}
                                >
                                    No students found.
                                </p>
                            )}
                            {filteredUsers.map((u) => (
                                <div
                                    key={u.uid}
                                    onClick={() => {
                                        setSelectedUid(u.uid);
                                        setDropdownOpen(false);
                                        setSearchTerm('');
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '9px 10px',
                                        borderRadius: 9,
                                        cursor: 'pointer',
                                        background:
                                            selectedUid === u.uid
                                                ? ME.light
                                                : 'transparent',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedUid !== u.uid)
                                            e.currentTarget.style.background =
                                                'rgba(255,255,255,0.04)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedUid !== u.uid)
                                            e.currentTarget.style.background =
                                                'transparent';
                                    }}
                                >
                                    <Avatar user={u} size={34} />
                                    <div>
                                        <p
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                margin: 0,
                                            }}
                                        >
                                            {u.displayName || 'Unknown'}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: 11,
                                                color: '#666',
                                                margin: 0,
                                            }}
                                        >
                                            {u.email ||
                                                `Joined ${formatDate(u.joinedAt)}`}
                                        </p>
                                    </div>
                                    {selectedUid === u.uid && (
                                        <span
                                            style={{
                                                marginLeft: 'auto',
                                                color: ME.primary,
                                                fontSize: 16,
                                            }}
                                        >
                                            ✓
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── EMPTY STATE ── */}
            {!selectedUid && (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#444',
                    }}
                >
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚔️</div>
                    <p
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: '#666',
                            marginBottom: 6,
                        }}
                    >
                        No comparison yet
                    </p>
                    <p style={{ fontSize: 13 }}>
                        Select a student from the dropdown above to start
                        comparing.
                    </p>
                </div>
            )}

            {loadingThem && (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666',
                    }}
                >
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            border: '3px solid rgba(127,119,221,0.2)',
                            borderTop: `3px solid ${ME.primary}`,
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            margin: '0 auto 10px',
                        }}
                    />
                    <p style={{ fontSize: 13 }}>Loading their data…</p>
                </div>
            )}

            {selectedUid && !loadingThem && themStats && (
                <div className="fade-in">
                    {/* ── PLAYER HEADERS ── */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto 1fr',
                            gap: 14,
                            marginBottom: 20,
                            alignItems: 'center',
                        }}
                    >
                        {/* Me */}
                        <div
                            style={{
                                background: `linear-gradient(135deg, ${ME.primary}22, ${ME.primary}11)`,
                                border: `1px solid ${ME.primary}44`,
                                borderRadius: 18,
                                padding: '18px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 14,
                            }}
                        >
                            <Avatar user={user} size={52} />
                            <div>
                                <p
                                    style={{
                                        fontSize: 11,
                                        color: ME.primary,
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        marginBottom: 2,
                                    }}
                                >
                                    You
                                </p>
                                <p style={{ fontSize: 15, fontWeight: 700 }}>
                                    {user?.displayName || 'You'}
                                </p>
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: '#666',
                                        marginTop: 2,
                                    }}
                                >
                                    {myStats.totalMocks} mocks · Best{' '}
                                    {myStats.bestScore}
                                </p>
                            </div>
                        </div>

                        {/* VS badge */}
                        <div style={{ textAlign: 'center' }}>
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: '#888',
                                    margin: '0 auto',
                                }}
                            >
                                VS
                            </div>
                            {battleResults && (
                                <p
                                    style={{
                                        fontSize: 11,
                                        color: '#555',
                                        marginTop: 6,
                                    }}
                                >
                                    <span style={{ color: ME.primary }}>
                                        {battleResults.meWins}
                                    </span>
                                    {' – '}
                                    <span style={{ color: THEM.primary }}>
                                        {battleResults.themWins}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Them */}
                        <div
                            style={{
                                background: `linear-gradient(135deg, ${THEM.primary}22, ${THEM.primary}11)`,
                                border: `1px solid ${THEM.primary}44`,
                                borderRadius: 18,
                                padding: '18px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 14,
                            }}
                        >
                            <Avatar user={themUser} size={52} />
                            <div>
                                <p
                                    style={{
                                        fontSize: 11,
                                        color: THEM.primary,
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        marginBottom: 2,
                                    }}
                                >
                                    Opponent
                                </p>
                                <p style={{ fontSize: 15, fontWeight: 700 }}>
                                    {themUser?.displayName || 'Student'}
                                </p>
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: '#666',
                                        marginTop: 2,
                                    }}
                                >
                                    {themStats.totalMocks} mocks · Best{' '}
                                    {themStats.bestScore}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── WIN BANNER ── */}
                    {battleResults &&
                        battleResults.meWins !== battleResults.themWins && (
                            <div
                                style={{
                                    background:
                                        battleResults.meWins >
                                        battleResults.themWins
                                            ? ME.light
                                            : THEM.light,
                                    border: `1px solid ${battleResults.meWins > battleResults.themWins ? ME.primary : THEM.primary}44`,
                                    borderRadius: 14,
                                    padding: '12px 20px',
                                    marginBottom: 18,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color:
                                        battleResults.meWins >
                                        battleResults.themWins
                                            ? ME.primary
                                            : THEM.primary,
                                }}
                            >
                                <span style={{ fontSize: 20 }}>🏆</span>
                                {battleResults.meWins > battleResults.themWins
                                    ? `You're leading — winning ${battleResults.meWins} out of ${battleResults.total} categories!`
                                    : `${themUser?.displayName || 'They'} is ahead — leading ${battleResults.themWins} out of ${battleResults.total} categories.`}
                            </div>
                        )}

                    {/* ── STAT BATTLES ── */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 10,
                            marginBottom: 20,
                        }}
                    >
                        <StatBattle
                            label="Avg Score"
                            icon="📊"
                            meVal={myStats.avgScore}
                            themVal={themStats.avgScore}
                        />
                        <StatBattle
                            label="Best Score"
                            icon="🏆"
                            meVal={myStats.bestScore}
                            themVal={themStats.bestScore}
                        />
                        <StatBattle
                            label="Avg Accuracy"
                            icon="🎯"
                            meVal={`${myStats.avgAccuracy}%`}
                            themVal={`${themStats.avgAccuracy}%`}
                        />
                        <StatBattle
                            label="Avg Percentile"
                            icon="📈"
                            meVal={`${myStats.avgPercentile}`}
                            themVal={`${themStats.avgPercentile}`}
                        />
                        <StatBattle
                            label="Total Mocks"
                            icon="📋"
                            meVal={myStats.totalMocks}
                            themVal={themStats.totalMocks}
                        />
                        <StatBattle
                            label="Avg Quant"
                            icon="🔢"
                            meVal={myStats.avgQuant}
                            themVal={themStats.avgQuant}
                        />
                        <StatBattle
                            label="Avg Reasoning"
                            icon="🧠"
                            meVal={myStats.avgReasoning}
                            themVal={themStats.avgReasoning}
                        />
                        <StatBattle
                            label="Avg English"
                            icon="📖"
                            meVal={myStats.avgEnglish}
                            themVal={themStats.avgEnglish}
                        />
                        <StatBattle
                            label="Avg GK"
                            icon="🌐"
                            meVal={myStats.avgGk}
                            themVal={themStats.avgGk}
                        />
                    </div>

                    {/* ── SCORE TREND ── */}
                    <div style={{ marginBottom: 14 }}>
                        <ChartCard
                            title="Score trend comparison"
                            icon="📈"
                            legend={[
                                {
                                    color: ME.primary,
                                    label: `You (${user?.displayName || 'You'})`,
                                },
                                {
                                    color: THEM.primary,
                                    label: themUser?.displayName || 'Opponent',
                                },
                            ]}
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <LineChart
                                    data={mergedTrend}
                                    margin={{
                                        top: 4,
                                        right: 10,
                                        left: -10,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.06)"
                                    />
                                    <XAxis
                                        dataKey="attempt"
                                        tick={{ fontSize: 11, fill: '#666' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#666' }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="myScore"
                                        name="Your score"
                                        stroke={ME.primary}
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: ME.primary }}
                                        activeDot={{ r: 6 }}
                                        connectNulls
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="themScore"
                                        name="Their score"
                                        stroke={THEM.primary}
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: THEM.primary }}
                                        activeDot={{ r: 6 }}
                                        connectNulls
                                        strokeDasharray="6 3"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* ── ACCURACY TREND ── */}
                    <div style={{ marginBottom: 14 }}>
                        <ChartCard
                            title="Accuracy trend comparison"
                            icon="🎯"
                            legend={[
                                { color: ME.primary, label: `You` },
                                {
                                    color: THEM.primary,
                                    label: themUser?.displayName || 'Opponent',
                                },
                            ]}
                        >
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart
                                    data={mergedTrend}
                                    margin={{
                                        top: 4,
                                        right: 10,
                                        left: -10,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.06)"
                                    />
                                    <XAxis
                                        dataKey="attempt"
                                        tick={{ fontSize: 11, fill: '#666' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#666' }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="myAcc"
                                        name="Your accuracy"
                                        stroke={ME.primary}
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                        connectNulls
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="themAcc"
                                        name="Their accuracy"
                                        stroke={THEM.primary}
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                        connectNulls
                                        strokeDasharray="5 3"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* ── SUBJECT CHARTS ── */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 14,
                            marginBottom: 14,
                        }}
                    >
                        {/* Grouped bar */}
                        <ChartCard
                            title="Subject averages"
                            icon="📚"
                            legend={[
                                { color: ME.primary, label: 'You' },
                                {
                                    color: THEM.primary,
                                    label: themUser?.displayName || 'Opponent',
                                },
                            ]}
                        >
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart
                                    data={subjectCompare}
                                    margin={{
                                        top: 4,
                                        right: 8,
                                        left: -16,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.06)"
                                    />
                                    <XAxis
                                        dataKey="subject"
                                        tick={{ fontSize: 10, fill: '#666' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: '#666' }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="me"
                                        name="You"
                                        fill={ME.primary}
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="them"
                                        name="Them"
                                        fill={THEM.primary}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        {/* Radar */}
                        <ChartCard
                            title="Skill radar"
                            icon="🕸️"
                            legend={[
                                { color: ME.primary, label: 'You' },
                                {
                                    color: THEM.primary,
                                    label: themUser?.displayName || 'Opponent',
                                },
                            ]}
                        >
                            <ResponsiveContainer width="100%" height={220}>
                                <RadarChart
                                    data={radarData}
                                    margin={{
                                        top: 4,
                                        right: 24,
                                        left: 24,
                                        bottom: 4,
                                    }}
                                >
                                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fontSize: 11, fill: '#aaa' }}
                                    />
                                    <PolarRadiusAxis
                                        tick={{ fontSize: 9, fill: '#555' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Radar
                                        dataKey="me"
                                        name="You"
                                        stroke={ME.primary}
                                        fill={ME.primary}
                                        fillOpacity={0.25}
                                        strokeWidth={2}
                                    />
                                    <Radar
                                        dataKey="them"
                                        name="Them"
                                        stroke={THEM.primary}
                                        fill={THEM.primary}
                                        fillOpacity={0.2}
                                        strokeWidth={2}
                                        strokeDasharray="4 2"
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* ── INSIGHTS PANEL ── */}
                    <div
                        style={{
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: 20,
                            padding: '20px 24px',
                        }}
                    >
                        <p
                            style={{
                                fontWeight: 600,
                                fontSize: 14,
                                marginBottom: 14,
                            }}
                        >
                            💡 Key Insights
                        </p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 10,
                            }}
                        >
                            {[
                                {
                                    label: 'Score gap',
                                    val: (
                                        parseFloat(myStats.avgScore) -
                                        parseFloat(themStats.avgScore)
                                    ).toFixed(1),
                                    pos:
                                        parseFloat(myStats.avgScore) >=
                                        parseFloat(themStats.avgScore),
                                    desc: 'avg score difference',
                                },
                                {
                                    label: 'Accuracy gap',
                                    val: (
                                        parseFloat(myStats.avgAccuracy) -
                                        parseFloat(themStats.avgAccuracy)
                                    ).toFixed(1),
                                    pos:
                                        parseFloat(myStats.avgAccuracy) >=
                                        parseFloat(themStats.avgAccuracy),
                                    desc: '% accuracy difference',
                                },
                                {
                                    label: 'Best score gap',
                                    val: (
                                        myStats.bestScore - themStats.bestScore
                                    ).toFixed(0),
                                    pos:
                                        myStats.bestScore >=
                                        themStats.bestScore,
                                    desc: 'personal best difference',
                                },
                                {
                                    label: 'Percentile gap',
                                    val: (
                                        parseFloat(myStats.avgPercentile) -
                                        parseFloat(themStats.avgPercentile)
                                    ).toFixed(1),
                                    pos:
                                        parseFloat(myStats.avgPercentile) >=
                                        parseFloat(themStats.avgPercentile),
                                    desc: 'percentile difference',
                                },
                            ].map((ins, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: 12,
                                        padding: '12px 14px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: 11,
                                            color: '#666',
                                            marginBottom: 4,
                                        }}
                                    >
                                        {ins.label}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 700,
                                            color: ins.pos
                                                ? ME.primary
                                                : THEM.primary,
                                            marginBottom: 2,
                                        }}
                                    >
                                        {Number(ins.val) > 0
                                            ? `+${ins.val}`
                                            : ins.val}
                                    </p>
                                    <p style={{ fontSize: 11, color: '#555' }}>
                                        {ins.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── NO MOCKS STATE ── */}
            {selectedUid && !loadingThem && !themStats && (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '48px 20px',
                        color: '#555',
                    }}
                >
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#666' }}>
                        No mock data found
                    </p>
                    <p style={{ fontSize: 13, marginTop: 4 }}>
                        {themUser?.displayName || 'This student'} hasn't
                        recorded any mocks yet.
                    </p>
                </div>
            )}
        </div>
    );
}
