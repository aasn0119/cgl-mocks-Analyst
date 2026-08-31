import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTier } from '../contexts/TierContext';
import { db } from '../services/firebase';
import { getMockTier } from '../config/examPatterns';
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

const StatTile = ({ label, value, note, accent, glow }) => (
    <div
        style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 18,
            padding: '16px 18px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)',
        }}
    >
        <div
            style={{
                position: 'absolute',
                inset: 0,
                background: accent,
                opacity: 0.7,
                pointerEvents: 'none',
            }}
        />
        <div style={{ position: 'relative' }}>
            <p
                style={{
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#9ca3af',
                }}
            >
                {label}
            </p>
            <div
                style={{
                    marginTop: 8,
                    fontSize: 26,
                    fontWeight: 800,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 8,
                }}
            >
                <span>{value}</span>
                {glow && (
                    <span
                        style={{
                            display: 'inline-flex',
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: glow,
                            boxShadow: `0 0 18px ${glow}`,
                        }}
                    />
                )}
            </div>
            <p style={{ fontSize: 12, color: '#bfc6d4', marginTop: 6 }}>
                {note}
            </p>
        </div>
    </div>
);

const InsightMetric = ({ label, value, positive, note }) => (
    <div
        style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: '14px 16px',
        }}
    >
        <p style={{ fontSize: 11, color: '#7c8597', marginBottom: 6 }}>
            {label}
        </p>
        <p
            style={{
                fontSize: 20,
                fontWeight: 800,
                color: positive ? ME.primary : THEM.primary,
                marginBottom: 4,
            }}
        >
            {value}
        </p>
        <p style={{ fontSize: 11, color: '#7c8597' }}>{note}</p>
    </div>
);

const SubjectComparisonRow = ({ subject, me, them }) => {
    const delta = Number(me) - Number(them);
    const winner = delta >= 0 ? 'You' : 'Them';
    const lead = Math.abs(delta).toFixed(1);

    return (
        <div
            style={{
                padding: '12px 14px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
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
                <span
                    style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}
                >
                    {subject}
                </span>
                <span
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: winner === 'You' ? ME.primary : THEM.primary,
                        padding: '4px 8px',
                        borderRadius: 999,
                        background: winner === 'You' ? ME.light : THEM.light,
                    }}
                >
                    {winner} leads
                </span>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    fontSize: 12,
                    color: '#b3bdcf',
                }}
            >
                <div
                    style={{
                        background: 'rgba(127,119,221,0.08)',
                        borderRadius: 10,
                        padding: '8px 10px',
                    }}
                >
                    <div style={{ color: ME.primary, fontWeight: 700 }}>
                        You
                    </div>
                    <div
                        style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}
                    >
                        {Number(me).toFixed(1)}
                    </div>
                </div>
                <div
                    style={{
                        background: 'rgba(29,158,117,0.08)',
                        borderRadius: 10,
                        padding: '8px 10px',
                    }}
                >
                    <div style={{ color: THEM.primary, fontWeight: 700 }}>
                        Them
                    </div>
                    <div
                        style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}
                    >
                        {Number(them).toFixed(1)}
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: '#7c8597',
                }}
            >
                Lead: {winner} by {lead}
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Reports() {
    const { user } = useAuth();
    const { tier, pattern } = useTier();

    const [allUsers, setAllUsers] = useState([]);
    const [selectedUid, setSelectedUid] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [myMocksRaw, setMyMocksRaw] = useState([]);
    const [themMocksRaw, setThemMocksRaw] = useState([]);
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
            setMyMocksRaw(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [user]);

    /* fetch THEIR mocks + user doc when selection changes */
    useEffect(() => {
        if (!selectedUid) {
            setThemMocksRaw([]);
            setThemUser(null);
            return;
        }
        setLoadingThem(true);

        const q = query(
            collection(db, 'mocks'),
            where('userId', '==', selectedUid)
        );
        const unsub = onSnapshot(q, (snap) => {
            setThemMocksRaw(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoadingThem(false);
        });

        getDocs(
            query(collection(db, 'users'), where('uid', '==', selectedUid))
        ).then((snap) => {
            if (!snap.empty) setThemUser(snap.docs[0].data());
        });

        return () => unsub();
    }, [selectedUid]);

    /* only compare mocks belonging to the currently selected tier */
    const myMocks = useMemo(
        () => myMocksRaw.filter((m) => getMockTier(m) === tier),
        [myMocksRaw, tier]
    );
    const themMocks = useMemo(
        () => themMocksRaw.filter((m) => getMockTier(m) === tier),
        [themMocksRaw, tier]
    );

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

    const comparisonSummary = useMemo(() => {
        if (!myStats || !themStats) return [];
        return [
            {
                label: 'Avg score',
                value: `${myStats.avgScore} vs ${themStats.avgScore}`,
                positive:
                    Number(myStats.avgScore) >= Number(themStats.avgScore),
            },
            {
                label: 'Accuracy',
                value: `${myStats.avgAccuracy}% vs ${themStats.avgAccuracy}%`,
                positive:
                    Number(myStats.avgAccuracy) >=
                    Number(themStats.avgAccuracy),
            },
            {
                label: 'Best score',
                value: `${myStats.bestScore} vs ${themStats.bestScore}`,
                positive:
                    Number(myStats.bestScore) >= Number(themStats.bestScore),
            },
            {
                label: 'Percentile',
                value: `${myStats.avgPercentile} vs ${themStats.avgPercentile}`,
                positive:
                    Number(myStats.avgPercentile) >=
                    Number(themStats.avgPercentile),
            },
        ];
    }, [myStats, themStats]);

    const strongestSubject = useMemo(() => {
        if (!subjectCompare.length) return null;
        const overallWinner = subjectCompare.reduce((best, current) => {
            const diff =
                Math.abs(Number(current.me) - Number(current.them)) >
                Math.abs(Number(best.me) - Number(best.them))
                    ? current
                    : best;
            return diff;
        }, subjectCompare[0]);

        return overallWinner;
    }, [subjectCompare]);

    const nearestGap = useMemo(() => {
        if (!myStats || !themStats) return null;
        return (Number(myStats.avgScore) - Number(themStats.avgScore)).toFixed(
            1
        );
    }, [myStats, themStats]);

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
        <div
            className="cmp-root"
            style={{
                background:
                    'radial-gradient(circle at top left, rgba(127,119,221,0.22), transparent 22%), radial-gradient(circle at bottom right, rgba(29,158,117,0.18), transparent 28%), #060810',
                padding: 24,
            }}
        >
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                <div
                    style={{
                        background:
                            'linear-gradient(135deg, rgba(34, 28, 74, 0.95) 0%, rgba(83, 74, 183, 0.88) 42%, rgba(17, 85, 130, 0.9) 100%)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 28,
                        padding: '28px 28px 24px',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 24px 50px rgba(79,70,229,0.18)',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '-60px',
                            right: '-50px',
                            width: 220,
                            height: 220,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.06)',
                            pointerEvents: 'none',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-50px',
                            left: '-30px',
                            width: 180,
                            height: 180,
                            borderRadius: '50%',
                            background: 'rgba(16,185,129,0.12)',
                            pointerEvents: 'none',
                        }}
                    />
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            gap: 18,
                            flexWrap: 'wrap',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginBottom: 16,
                                }}
                            >
                                <div
                                    style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 14,
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 20,
                                    }}
                                >
                                    ⚔️
                                </div>
                                <span
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        background: 'rgba(255,255,255,0.08)',
                                        color: '#dfe7ff',
                                        borderRadius: 999,
                                        padding: '6px 10px',
                                        fontSize: 10,
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        fontWeight: 800,
                                    }}
                                >
                                    {pattern.fullName}
                                </span>
                            </div>
                            <h1
                                style={{
                                    margin: 0,
                                    color: '#fff',
                                    fontSize: 32,
                                    fontWeight: 800,
                                    letterSpacing: '-0.04em',
                                }}
                            >
                                Compare Performance
                            </h1>
                            <p
                                style={{
                                    marginTop: 8,
                                    color: 'rgba(255,255,255,0.72)',
                                    fontSize: 14,
                                    maxWidth: 720,
                                }}
                            >
                                Select a student and compare trends, battle
                                scores, and subject-level performance side by
                                side.
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 14px',
                                borderRadius: 999,
                                border: '1px solid rgba(52,211,153,0.3)',
                                background: 'rgba(16,185,129,0.12)',
                                color: '#a7f3d0',
                                fontWeight: 700,
                                fontSize: 12,
                            }}
                        >
                            <span
                                style={{
                                    display: 'inline-flex',
                                    width: 9,
                                    height: 9,
                                    borderRadius: '50%',
                                    background: '#34d399',
                                    boxShadow: '0 0 12px rgba(52,211,153,0.9)',
                                }}
                            />
                            Live comparison
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: 20,
                        background: 'rgba(15, 23, 42, 0.92)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 24,
                        padding: '20px 22px',
                        boxShadow: '0 16px 40px rgba(2, 6, 23, 0.32)',
                    }}
                >
                    <p
                        style={{
                            margin: '0 0 12px',
                            color: '#7c8597',
                            fontSize: 11,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                        }}
                    >
                        Choose a student to compare with
                    </p>

                    <div
                        onClick={() => setDropdownOpen((o) => !o)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${dropdownOpen ? ME.primary : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: 16,
                            padding: '12px 14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            userSelect: 'none',
                            minHeight: 50,
                        }}
                    >
                        {selectedUser ? (
                            <>
                                <Avatar user={selectedUser} size={34} />
                                <span style={{ fontWeight: 700, fontSize: 14 }}>
                                    {selectedUser.displayName ||
                                        selectedUser.email}
                                </span>
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: 18 }}>👤</span>
                                <span
                                    style={{ color: '#93a1b6', fontSize: 14 }}
                                >
                                    Select a student…
                                </span>
                            </>
                        )}
                        <span
                            style={{
                                marginLeft: 'auto',
                                color: '#76829a',
                                fontSize: 12,
                                transform: dropdownOpen
                                    ? 'rotate(180deg)'
                                    : 'none',
                                transition: 'transform 0.2s ease',
                            }}
                        >
                            ▼
                        </span>
                    </div>

                    {dropdownOpen && (
                        <div
                            style={{
                                position: 'relative',
                                zIndex: 20,
                                marginTop: 10,
                                background: '#131827',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 18,
                                padding: 10,
                                boxShadow: '0 18px 42px rgba(0,0,0,0.42)',
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
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: 10,
                                    padding: '10px 12px',
                                    color: '#e2e8f0',
                                    fontSize: 13,
                                    outline: 'none',
                                    marginBottom: 8,
                                }}
                            />
                            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                                {filteredUsers.length === 0 && (
                                    <p
                                        style={{
                                            padding: '12px',
                                            color: '#69758b',
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
                                            padding: '10px 8px',
                                            borderRadius: 12,
                                            cursor: 'pointer',
                                            background:
                                                selectedUid === u.uid
                                                    ? ME.light
                                                    : 'transparent',
                                            transition: 'background 0.15s ease',
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
                                        <div style={{ flex: 1 }}>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontWeight: 700,
                                                    fontSize: 13,
                                                    color: '#e2e8f0',
                                                }}
                                            >
                                                {u.displayName || 'Unknown'}
                                            </p>
                                            <p
                                                style={{
                                                    margin: '2px 0 0',
                                                    fontSize: 11,
                                                    color: '#69758b',
                                                }}
                                            >
                                                {u.email ||
                                                    `Joined ${formatDate(u.joinedAt)}`}
                                            </p>
                                        </div>
                                        {selectedUid === u.uid && (
                                            <span
                                                style={{
                                                    color: ME.primary,
                                                    fontSize: 18,
                                                    fontWeight: 800,
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

                {!selectedUid && (
                    <div
                        style={{
                            marginTop: 22,
                            padding: '56px 20px',
                            textAlign: 'center',
                            background: 'rgba(15, 23, 42, 0.7)',
                            borderRadius: 24,
                            border: '1px solid rgba(255,255,255,0.06)',
                            color: '#7c8597',
                        }}
                    >
                        <div style={{ fontSize: 48, marginBottom: 12 }}>⚔️</div>
                        <p
                            style={{
                                margin: 0,
                                color: '#dfe7ff',
                                fontSize: 18,
                                fontWeight: 700,
                            }}
                        >
                            No comparison yet
                        </p>
                        <p style={{ marginTop: 8, fontSize: 13 }}>
                            Choose a student from the dropdown to compare the
                            full battle breakdown.
                        </p>
                    </div>
                )}

                {loadingThem && (
                    <div
                        style={{
                            marginTop: 22,
                            textAlign: 'center',
                            padding: '40px 20px',
                            background: 'rgba(15, 23, 42, 0.7)',
                            borderRadius: 24,
                            border: '1px solid rgba(255,255,255,0.06)',
                            color: '#9aa7bf',
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
                        <p style={{ margin: 0 }}>Loading their data…</p>
                    </div>
                )}

                {selectedUid && !loadingThem && themStats && (
                    <div className="fade-in" style={{ marginTop: 22 }}>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr auto 1fr',
                                gap: 12,
                                alignItems: 'center',
                                marginBottom: 18,
                            }}
                        >
                            <div
                                style={{
                                    background:
                                        'linear-gradient(135deg, rgba(127,119,221,0.20), rgba(127,119,221,0.08))',
                                    border: '1px solid rgba(127,119,221,0.30)',
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
                                            margin: 0,
                                            fontSize: 10,
                                            letterSpacing: '0.18em',
                                            textTransform: 'uppercase',
                                            color: ME.primary,
                                            fontWeight: 800,
                                        }}
                                    >
                                        You
                                    </p>
                                    <p
                                        style={{
                                            margin: '6px 0 2px',
                                            fontSize: 16,
                                            fontWeight: 800,
                                            color: '#f8fafc',
                                        }}
                                    >
                                        {user?.displayName || 'You'}
                                    </p>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: 12,
                                            color: '#93a1b6',
                                        }}
                                    >
                                        {myStats.totalMocks} mocks · Best{' '}
                                        {myStats.bestScore}
                                    </p>
                                </div>
                            </div>

                            <div
                                style={{
                                    width: 54,
                                    height: 54,
                                    borderRadius: '50%',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    background: 'rgba(255,255,255,0.03)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 900,
                                    color: '#aab7c9',
                                }}
                            >
                                VS
                            </div>

                            <div
                                style={{
                                    background:
                                        'linear-gradient(135deg, rgba(29,158,117,0.20), rgba(29,158,117,0.08))',
                                    border: '1px solid rgba(29,158,117,0.30)',
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
                                            margin: 0,
                                            fontSize: 10,
                                            letterSpacing: '0.18em',
                                            textTransform: 'uppercase',
                                            color: THEM.primary,
                                            fontWeight: 800,
                                        }}
                                    >
                                        Opponent
                                    </p>
                                    <p
                                        style={{
                                            margin: '6px 0 2px',
                                            fontSize: 16,
                                            fontWeight: 800,
                                            color: '#f8fafc',
                                        }}
                                    >
                                        {themUser?.displayName || 'Student'}
                                    </p>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: 12,
                                            color: '#93a1b6',
                                        }}
                                    >
                                        {themStats.totalMocks} mocks · Best{' '}
                                        {themStats.bestScore}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {battleResults &&
                            battleResults.meWins !== battleResults.themWins && (
                                <div
                                    style={{
                                        marginBottom: 18,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        background:
                                            battleResults.meWins >
                                            battleResults.themWins
                                                ? ME.light
                                                : THEM.light,
                                        border: `1px solid ${battleResults.meWins > battleResults.themWins ? ME.primary : THEM.primary}44`,
                                        borderRadius: 16,
                                        padding: '14px 18px',
                                        fontWeight: 700,
                                        color:
                                            battleResults.meWins >
                                            battleResults.themWins
                                                ? ME.primary
                                                : THEM.primary,
                                    }}
                                >
                                    <span style={{ fontSize: 20 }}>🏆</span>
                                    {battleResults.meWins >
                                    battleResults.themWins
                                        ? `You’re ahead — winning ${battleResults.meWins} of ${battleResults.total} categories.`
                                        : `${themUser?.displayName || 'They'} leads — winning ${battleResults.themWins} of ${battleResults.total} categories.`}
                                </div>
                            )}

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(4, minmax(0, 1fr))',
                                gap: 12,
                                marginBottom: 18,
                            }}
                        >
                            {comparisonSummary.map((item, index) => (
                                <div
                                    key={item.label}
                                    style={{
                                        background: 'rgba(15, 23, 42, 0.8)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: 18,
                                        padding: '12px 14px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8,
                                        boxShadow:
                                            '0 10px 28px rgba(2,6,23,0.2)',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 11,
                                                color: '#8a93a7',
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 800,
                                                letterSpacing: '0.08em',
                                                color: item.positive
                                                    ? ME.primary
                                                    : THEM.primary,
                                            }}
                                        >
                                            {item.positive ? 'YOU' : 'THEM'}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 17,
                                            fontWeight: 800,
                                            color: '#fff',
                                        }}
                                    >
                                        {item.value}
                                    </div>
                                    <div
                                        style={{
                                            width: '100%',
                                            height: 6,
                                            borderRadius: 999,
                                            background:
                                                'rgba(255,255,255,0.06)',
                                            overflow: 'hidden',
                                            display: 'flex',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${Math.min(100, Math.max(15, (Number(item.value.split(' vs ')[0]) / Math.max(Number(item.value.split(' vs ')[1]) || 1, 1)) * 100))}%`,
                                                background: item.positive
                                                    ? ME.primary
                                                    : THEM.primary,
                                                borderRadius: 999,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12,
                                marginBottom: 18,
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

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1.2fr 0.8fr',
                                gap: 12,
                                marginBottom: 18,
                            }}
                        >
                            <div
                                style={{
                                    background: 'rgba(15, 23, 42, 0.8)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: 22,
                                    padding: '18px 18px 12px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 12,
                                        marginBottom: 10,
                                    }}
                                >
                                    <div>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: 10,
                                                letterSpacing: '0.18em',
                                                textTransform: 'uppercase',
                                                color: '#7c8597',
                                                fontWeight: 700,
                                            }}
                                        >
                                            Subject split
                                        </p>
                                        <h3
                                            style={{
                                                margin: '6px 0 0',
                                                fontSize: 20,
                                                color: '#f8fafc',
                                            }}
                                        >
                                            Strength by subject
                                        </h3>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: '#cbd5e1',
                                            background:
                                                'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            borderRadius: 999,
                                            padding: '6px 10px',
                                        }}
                                    >
                                        {strongestSubject
                                            ? `${strongestSubject.subject} focus`
                                            : 'No data'}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gap: 10 }}>
                                    {subjectCompare.map((subject) => (
                                        <SubjectComparisonRow
                                            key={subject.subject}
                                            subject={subject.subject}
                                            me={subject.me}
                                            them={subject.them}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div
                                style={{
                                    background: 'rgba(15, 23, 42, 0.8)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: 22,
                                    padding: '18px',
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: 10,
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        color: '#7c8597',
                                        fontWeight: 700,
                                    }}
                                >
                                    Summary
                                </p>
                                <div
                                    style={{
                                        marginTop: 12,
                                        display: 'grid',
                                        gap: 12,
                                    }}
                                >
                                    <InsightMetric
                                        label="Avg score delta"
                                        value={
                                            nearestGap >= 0
                                                ? `+${nearestGap}`
                                                : nearestGap
                                        }
                                        positive={Number(nearestGap) >= 0}
                                        note="overall average lead"
                                    />
                                    <InsightMetric
                                        label="Best performance"
                                        value={
                                            myStats.bestScore >
                                            themStats.bestScore
                                                ? 'You'
                                                : 'Them'
                                        }
                                        positive={
                                            myStats.bestScore >=
                                            themStats.bestScore
                                        }
                                        note="highest single mock"
                                    />
                                    <InsightMetric
                                        label="Accuracy edge"
                                        value={
                                            Number(myStats.avgAccuracy) >=
                                            Number(themStats.avgAccuracy)
                                                ? 'You'
                                                : 'Them'
                                        }
                                        positive={
                                            Number(myStats.avgAccuracy) >=
                                            Number(themStats.avgAccuracy)
                                        }
                                        note="most reliable scorer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: 18 }}>
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
                                        label:
                                            themUser?.displayName || 'Opponent',
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
                                            tick={{
                                                fontSize: 11,
                                                fill: '#666',
                                            }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{
                                                fontSize: 11,
                                                fill: '#666',
                                            }}
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

                        <div style={{ marginBottom: 18 }}>
                            <ChartCard
                                title="Accuracy trend comparison"
                                icon="🎯"
                                legend={[
                                    { color: ME.primary, label: 'You' },
                                    {
                                        color: THEM.primary,
                                        label:
                                            themUser?.displayName || 'Opponent',
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
                                            tick={{
                                                fontSize: 11,
                                                fill: '#666',
                                            }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{
                                                fontSize: 11,
                                                fill: '#666',
                                            }}
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

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 14,
                                marginBottom: 18,
                            }}
                        >
                            <ChartCard
                                title="Subject averages"
                                icon="📚"
                                legend={[
                                    { color: ME.primary, label: 'You' },
                                    {
                                        color: THEM.primary,
                                        label:
                                            themUser?.displayName || 'Opponent',
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
                                            tick={{
                                                fontSize: 10,
                                                fill: '#666',
                                            }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{
                                                fontSize: 10,
                                                fill: '#666',
                                            }}
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

                            <ChartCard
                                title="Skill radar"
                                icon="🕸️"
                                legend={[
                                    { color: ME.primary, label: 'You' },
                                    {
                                        color: THEM.primary,
                                        label:
                                            themUser?.displayName || 'Opponent',
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
                                            tick={{
                                                fontSize: 11,
                                                fill: '#aaa',
                                            }}
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

                        <div
                            style={{
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 22,
                                padding: '18px 20px',
                            }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    color: '#e2e8f0',
                                    fontSize: 16,
                                    fontWeight: 800,
                                }}
                            >
                                💡 Key insights
                            </p>
                            <div
                                style={{
                                    marginTop: 14,
                                    display: 'grid',
                                    gridTemplateColumns:
                                        'repeat(4, minmax(0, 1fr))',
                                    gap: 12,
                                }}
                            >
                                {[
                                    {
                                        label: 'Score gap',
                                        val: (
                                            parseFloat(myStats.avgScore) -
                                            parseFloat(themStats.avgScore)
                                        ).toFixed(1),
                                        positive:
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
                                        positive:
                                            parseFloat(myStats.avgAccuracy) >=
                                            parseFloat(themStats.avgAccuracy),
                                        desc: '% accuracy delta',
                                    },
                                    {
                                        label: 'Best score gap',
                                        val: (
                                            myStats.bestScore -
                                            themStats.bestScore
                                        ).toFixed(0),
                                        positive:
                                            myStats.bestScore >=
                                            themStats.bestScore,
                                        desc: 'peak mock lead',
                                    },
                                    {
                                        label: 'Trend lead',
                                        val:
                                            Number(myStats.avgPercentile) >=
                                            Number(themStats.avgPercentile)
                                                ? 'You'
                                                : 'Them',
                                        positive:
                                            Number(myStats.avgPercentile) >=
                                            Number(themStats.avgPercentile),
                                        desc: 'percentile advantage',
                                    },
                                ].map((ins) => (
                                    <InsightMetric
                                        key={ins.label}
                                        label={ins.label}
                                        value={
                                            ins.label === 'Trend lead'
                                                ? ins.val
                                                : Number(ins.val) > 0
                                                  ? `+${ins.val}`
                                                  : ins.val
                                        }
                                        positive={ins.positive}
                                        note={ins.desc}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selectedUid && !loadingThem && !themStats && (
                    <div
                        style={{
                            marginTop: 22,
                            textAlign: 'center',
                            padding: '48px 20px',
                            background: 'rgba(15, 23, 42, 0.7)',
                            borderRadius: 24,
                            border: '1px solid rgba(255,255,255,0.06)',
                            color: '#7c8597',
                        }}
                    >
                        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                        <p
                            style={{
                                margin: 0,
                                color: '#e2e8f0',
                                fontSize: 18,
                                fontWeight: 700,
                            }}
                        >
                            No mock data found
                        </p>
                        <p style={{ marginTop: 8, fontSize: 13 }}>
                            {themUser?.displayName || 'This student'} hasn't
                            recorded any mocks yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
