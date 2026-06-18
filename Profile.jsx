import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import useDashboardStats from '../hooks/useDashboardStats';

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
    Legend,
    Cell,
} from 'recharts';

/* ─── palette ─── */
const C = {
    purple: '#7F77DD',
    teal: '#1D9E75',
    amber: '#EF9F27',
    red: '#E24B4A',
    blue: '#378ADD',
    pink: '#D4537E',
    coral: '#D85A30',
    gray: '#888780',
};

// function to format date from timestamp
const getTimestamp = (mock) => {
    const ts = mock.createdAt;

    if (!ts) return new Date(mock.date).getTime();

    if (typeof ts.toMillis === 'function') return ts.toMillis();

    return ts.seconds * 1000 + (ts.nanoseconds || 0) / 1000000;
};
/* ─── reusable tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 12,
                color: 'var(--text)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
        >
            <p style={{ fontWeight: 600, marginBottom: 6, color: '#aaa' }}>
                {label}
            </p>
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

/* ─── stat card ─── */
const StatCard = ({ icon, label, value, sub, color, progress }) => (
    <div
        style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '16px',
            transition: 'transform 0.2s',
            cursor: 'default',
        }}
        onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'translateY(-3px)')
        }
        onMouseLeave={(e) =>
            (e.currentTarget.style.transform = 'translateY(0)')
        }
    >
        <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
        <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{label}</p>
        <h2 style={{ fontSize: 24, fontWeight: 700, color }}>{value}</h2>
        {sub && (
            <p style={{ fontSize: 11, color, opacity: 0.75, marginTop: 2 }}>
                {sub}
            </p>
        )}
        {progress !== undefined && (
            <div
                style={{
                    height: 4,
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    marginTop: 10,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: color,
                        borderRadius: 2,
                        transition: 'width 1s ease',
                    }}
                />
            </div>
        )}
    </div>
);

/* ─── chart card wrapper ─── */
const ChartCard = ({ title, icon, children, legend }) => (
    <div
        style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '20px 20px 14px',
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
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span
                style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}
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
                    marginBottom: 12,
                    marginTop: 6,
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

/* ─── score pill ─── */
const ScorePill = ({ score }) => {
    const color = score >= 145 ? C.teal : score >= 130 ? C.amber : C.red;
    return (
        <span
            style={{
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 600,
                background: color + '22',
                color,
            }}
        >
            {score}
        </span>
    );
};

/* ─── delta badge ─── */
const Delta = ({ val }) => {
    const up = val >= 0;
    return (
        <span
            style={{
                fontSize: 12,
                fontWeight: 600,
                color: up ? C.teal : C.red,
            }}
        >
            {up ? '↑ +' : '↓ '}
            {Math.abs(val).toFixed(1)}
        </span>
    );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const Profile = () => {
    const { uid } = useParams();
    const {
        loading,
        mocks,
        stats,
        chartData,
        subjectTrend,
        subjectAverages,
        TARGET_SCORE,
    } = useDashboardStats(uid);
    const [userData, setUserData] = useState(null);

    /* css variables injected once */
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            :root {
                --card: #0f1117;
                --border: rgba(255,255,255,0.09);
                --text: #e2e8f0;
                --subtext: #94a3b8;
                --bg: #060810;
            }
            .profile-root { min-height: 100vh; background: var(--bg); color: var(--text); padding: 24px; }
            .profile-root * { box-sizing: border-box; }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    /* fetch user data */
    useEffect(() => {
        if (!uid) return;
        const q = query(collection(db, 'users'), where('uid', '==', uid));
        const unsub = onSnapshot(q, (snap) => {
            if (!snap.empty) setUserData(snap.docs[0].data());
        });
        return () => unsub();
    }, [uid]);

    /* platform performance */
    const platformData = useMemo(() => {
        if (!mocks?.length) return [];
        const map = {};
        mocks.forEach((m) => {
            const key = m.platform || 'Unknown';
            if (!map[key]) map[key] = { platform: key, total: 0, count: 0 };
            map[key].total += Number(m.totalScore || 0);
            map[key].count += 1;
        });
        return Object.values(map).map((p) => ({
            platform: p.platform,
            avgScore: Number((p.total / p.count).toFixed(2)),
        }));
    }, [mocks]);

    /* radar data — uses real per-subject averages */
    const radarData = useMemo(() => {
        if (!subjectAverages?.length) return [];
        return subjectAverages.map((s) => ({
            subject: s.subject,
            value: Number(s.score),
        }));
    }, [subjectAverages]);

    /* recent mocks sorted desc */
    const recentMocks = useMemo(
        () =>
            [...(mocks || [])]
                .sort((a, b) => getTimestamp(b) - getTimestamp(a))
                .slice(0, 10),
        [mocks]
    );

    const formatDate = (t) => {
        if (!t) return 'N/A';
        if (t?.toDate)
            return t.toDate().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        return new Date(t).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const PLATFORM_COLORS = [
        C.purple,
        C.teal,
        C.amber,
        C.blue,
        C.pink,
        C.coral,
    ];

    if (!uid)
        return (
            <div style={{ padding: 40, color: '#888' }}>
                Invalid profile URL.
            </div>
        );
    if (loading)
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    background: '#060810',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            border: '3px solid rgba(127,119,221,0.3)',
                            borderTop: '3px solid #7F77DD',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            margin: '0 auto 12px',
                        }}
                    />
                    <p style={{ color: '#888', fontSize: 14 }}>
                        Loading profile…
                    </p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );

    const initials = (userData?.displayName || 'S U')
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    const readinessColor =
        stats.readiness === 'Exam Ready'
            ? C.teal
            : stats.readiness === 'Competitive'
              ? C.blue
              : stats.readiness === 'Improving'
                ? C.amber
                : C.red;

    return (
        <div className="profile-root">
            {/* ── HERO ── */}
            <div
                style={{
                    background:
                        'linear-gradient(135deg, #26215C 0%, #534AB7 50%, #185FA5 100%)',
                    borderRadius: 24,
                    padding: '28px 32px',
                    marginBottom: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* decorative circles */}
                <div
                    style={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 220,
                        height: 220,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        pointerEvents: 'none',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: -70,
                        right: 120,
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.04)',
                        pointerEvents: 'none',
                    }}
                />

                {userData?.photoURL ? (
                    <img
                        src={userData.photoURL}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 16,
                            border: '2px solid rgba(255,255,255,0.25)',
                            objectFit: 'cover',
                            flexShrink: 0,
                        }}
                        alt="avatar"
                    />
                ) : (
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 16,
                            border: '2px solid rgba(255,255,255,0.25)',
                            background: 'rgba(255,255,255,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            fontWeight: 700,
                            color: '#fff',
                            flexShrink: 0,
                        }}
                    >
                        {initials}
                    </div>
                )}

                <div>
                    <h1
                        style={{
                            fontSize: 26,
                            fontWeight: 700,
                            color: '#fff',
                            marginBottom: 4,
                        }}
                    >
                        {userData?.displayName || 'Student'}
                    </h1>
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: 13,
                            marginBottom: 12,
                        }}
                    >
                        📅 Joined {formatDate(userData?.joinedAt)}
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[
                            {
                                label: `🔥 ${stats.currentStreak}-day streak`,
                                bg: 'rgba(239,159,39,0.25)',
                                color: '#FAC775',
                            },
                            {
                                label: `🎯 ${stats.readiness}`,
                                bg: readinessColor + '33',
                                color:
                                    readinessColor === C.blue
                                        ? '#85B7EB'
                                        : readinessColor,
                            },
                            {
                                label: `📋 ${stats.totalMocks} mocks`,
                                bg: 'rgba(127,119,221,0.3)',
                                color: '#AFA9EC',
                            },
                        ].map((b, i) => (
                            <span
                                key={i}
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    padding: '4px 12px',
                                    borderRadius: 99,
                                    background: b.bg,
                                    color: b.color,
                                }}
                            >
                                {b.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 12,
                    marginBottom: 24,
                }}
            >
                <StatCard
                    icon="📋"
                    label="Total Mocks"
                    value={stats.totalMocks}
                    sub="attempts recorded"
                    color={C.purple}
                    progress={Math.min(stats.totalMocks * 2, 100)}
                />
                <StatCard
                    icon="📊"
                    label="Avg Score"
                    value={stats.avgScore}
                    sub="across all mocks"
                    color={C.blue}
                    progress={Number(stats.progressPercent)}
                />
                <StatCard
                    icon="🏆"
                    label="Best Score"
                    value={stats.bestScore}
                    sub="personal best"
                    color={C.amber}
                    progress={(stats.bestScore / TARGET_SCORE) * 100}
                />
                <StatCard
                    icon="🎯"
                    label="Accuracy"
                    value={`${stats.avgAccuracy}%`}
                    sub="avg correct"
                    color={C.teal}
                    progress={Number(stats.avgAccuracy)}
                />
                <StatCard
                    icon="📈"
                    label="Percentile"
                    value={`${stats.avgPercentile}`}
                    sub="avg rank"
                    color={C.pink}
                    progress={Number(stats.avgPercentile)}
                />
                <StatCard
                    icon="⚡"
                    label="Improvement"
                    value={`${stats.improvement}%`}
                    sub="since first mock"
                    color={C.coral}
                    progress={Math.min(
                        Math.abs(parseFloat(stats.improvement)),
                        100
                    )}
                />
                <StatCard
                    icon="🔮"
                    label="Predicted"
                    value={stats.predictedScore}
                    sub="next attempt"
                    color={C.purple}
                    progress={(stats.predictedScore / TARGET_SCORE) * 100}
                />
                <StatCard
                    icon="🔥"
                    label="Best Streak"
                    value={`${stats.bestStreak}d`}
                    sub="consecutive days"
                    color={C.amber}
                    progress={Math.min(stats.bestStreak * 5, 100)}
                />
            </div>

            {/* ── GOAL TRACKER ── */}
            <div
                style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    padding: '20px 24px',
                    marginBottom: 24,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 12,
                        flexWrap: 'wrap',
                        gap: 8,
                    }}
                >
                    <span style={{ fontWeight: 600, fontSize: 15 }}>
                        🎯 Goal Tracker — Target: {TARGET_SCORE}
                    </span>
                    <span style={{ fontSize: 13, color: '#888' }}>
                        Gap:{' '}
                        <b style={{ color: C.amber }}>{stats.goalGap} pts</b>{' '}
                        &nbsp;·&nbsp; Progress:{' '}
                        <b style={{ color: C.teal }}>
                            {stats.progressPercent}%
                        </b>
                    </span>
                </div>
                <div
                    style={{
                        height: 10,
                        background: 'rgba(255,255,255,0.07)',
                        borderRadius: 5,
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: `${stats.progressPercent}%`,
                            borderRadius: 5,
                            background: `linear-gradient(90deg, ${C.red}, ${C.amber}, ${C.teal})`,
                            transition: 'width 1.2s ease',
                        }}
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                        color: '#666',
                        marginTop: 6,
                    }}
                >
                    <span>0</span>
                    <span>80</span>
                    <span>120</span>
                    <span>{TARGET_SCORE}</span>
                </div>
            </div>

            {/* ── MAIN TREND ── */}
            <ChartCard
                title="Score · Accuracy · Percentile Trend"
                icon="📈"
                legend={[
                    { color: C.purple, label: 'Total score' },
                    { color: C.teal, label: 'Accuracy %' },
                    { color: C.amber, label: 'Percentile' },
                ]}
            >
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 4, right: 10, left: -10, bottom: 0 }}
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
                            dataKey="score"
                            name="Score"
                            stroke={C.purple}
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: C.purple }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="accuracy"
                            name="Accuracy %"
                            stroke={C.teal}
                            strokeWidth={2}
                            dot={{ r: 3, fill: C.teal }}
                            activeDot={{ r: 5 }}
                            strokeDasharray="6 3"
                        />
                        <Line
                            type="monotone"
                            dataKey="percentile"
                            name="Percentile"
                            stroke={C.amber}
                            strokeWidth={2}
                            dot={{ r: 3, fill: C.amber }}
                            activeDot={{ r: 5 }}
                            strokeDasharray="2 4"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── SUBJECT TRENDS ── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 14,
                    margin: '14px 0',
                }}
            >
                <ChartCard
                    title="Quant & Reasoning"
                    icon="🔢"
                    legend={[
                        { color: C.purple, label: 'Quant' },
                        { color: C.amber, label: 'Reasoning' },
                    ]}
                >
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart
                            data={subjectTrend}
                            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.06)"
                            />
                            <XAxis
                                dataKey="attempt"
                                tick={{ fontSize: 10, fill: '#666' }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#666' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="quant"
                                name="Quant"
                                stroke={C.purple}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="reasoning"
                                name="Reasoning"
                                stroke={C.amber}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                                strokeDasharray="5 3"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="English & GK"
                    icon="📚"
                    legend={[
                        { color: C.teal, label: 'English' },
                        { color: C.red, label: 'GK' },
                    ]}
                >
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart
                            data={subjectTrend}
                            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.06)"
                            />
                            <XAxis
                                dataKey="attempt"
                                tick={{ fontSize: 10, fill: '#666' }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#666' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="english"
                                name="English"
                                stroke={C.teal}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="gk"
                                name="GK"
                                stroke={C.red}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                                strokeDasharray="5 3"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* ── PLATFORM + RADAR ── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 14,
                    marginBottom: 14,
                }}
            >
                <ChartCard title="Platform Performance" icon="🏢">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={platformData}
                            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.06)"
                            />
                            <XAxis
                                dataKey="platform"
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
                                dataKey="avgScore"
                                name="Avg Score"
                                radius={[6, 6, 0, 0]}
                            >
                                {platformData.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={
                                            PLATFORM_COLORS[
                                                i % PLATFORM_COLORS.length
                                            ]
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="Skill Radar"
                    icon="🎯"
                    legend={[{ color: C.purple, label: 'Subject avg' }]}
                >
                    <ResponsiveContainer width="100%" height={220}>
                        <RadarChart
                            data={radarData}
                            margin={{ top: 4, right: 24, left: 24, bottom: 4 }}
                        >
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fontSize: 12, fill: '#aaa' }}
                            />
                            <PolarRadiusAxis
                                tick={{ fontSize: 9, fill: '#555' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Radar
                                dataKey="value"
                                name="Score"
                                stroke={C.purple}
                                fill={C.purple}
                                fillOpacity={0.35}
                                strokeWidth={2}
                                dot={{ r: 4, fill: C.purple }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* ── SUBJECT BAR (real per-subject averages) ── */}
            <ChartCard
                title="Subject Average Scores"
                icon="📊"
                style={{ marginBottom: 14 }}
            >
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={subjectAverages}
                        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.06)"
                        />
                        <XAxis
                            dataKey="subject"
                            tick={{ fontSize: 11, fill: '#666' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#666' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="score"
                            name="Avg Score"
                            radius={[6, 6, 0, 0]}
                        >
                            {subjectAverages.map((_, i) => (
                                <Cell
                                    key={i}
                                    fill={
                                        [C.purple, C.amber, C.teal, C.red][
                                            i % 4
                                        ]
                                    }
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── RECENT MOCKS ── */}
            <div
                style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    padding: '20px 24px',
                    marginTop: 14,
                }}
            >
                <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
                    📋 Recent Attempts
                </p>
                <div style={{ overflowX: 'auto' }}>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: 13,
                        }}
                    >
                        <thead>
                            <tr>
                                {[
                                    'Date',
                                    'Platform',
                                    'MockID / Name',
                                    'Score',
                                    'Quant',
                                    'Reasoning',
                                    'English',
                                    'GK',
                                    'Accuracy',
                                    'Percentile',
                                    'Δ Score',
                                ].map((h) => (
                                    <th
                                        key={h}
                                        style={{
                                            textAlign: 'left',
                                            color: '#666',
                                            fontWeight: 500,
                                            fontSize: 11,
                                            paddingBottom: 10,
                                            borderBottom:
                                                '1px solid rgba(255,255,255,0.07)',
                                            paddingRight: 12,
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentMocks.map((m, i) => {
                                const prev = recentMocks[i + 1];
                                const delta = prev
                                    ? Number(m.totalScore) -
                                      Number(prev.totalScore)
                                    : null;
                                return (
                                    <tr
                                        key={m.id}
                                        style={{
                                            borderBottom:
                                                '1px solid rgba(255,255,255,0.05)',
                                        }}
                                    >
                                        <td
                                            style={{
                                                padding: '11px 12px 11px 0',
                                                color: '#999',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {formatDate(m.date)}
                                        </td>
                                        <td style={{ paddingRight: 12 }}>
                                            <span
                                                style={{
                                                    background:
                                                        'rgba(255,255,255,0.07)',
                                                    borderRadius: 6,
                                                    padding: '3px 8px',
                                                    fontSize: 11,
                                                    color: '#aaa',
                                                }}
                                            >
                                                {m.platform || '—'}
                                            </span>
                                        </td>
                                        {/* MockId/Name */}
                                        <td
                                            style={{
                                                paddingRight: 12,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    background:
                                                        'rgba(255,255,255,0.07)',
                                                    borderRadius: 6,
                                                    padding: '3px 8px',
                                                    fontSize: 11,
                                                    color: C.teal,
                                                }}
                                            >
                                                {m.mockId || '—'}
                                            </span>
                                        </td>
                                        <td style={{ paddingRight: 12 }}>
                                            <ScorePill
                                                score={Number(m.totalScore)}
                                            />
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: 12,
                                                color: C.purple,
                                            }}
                                        >
                                            {m.quantScore ?? '—'}
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: 12,
                                                color: C.amber,
                                            }}
                                        >
                                            {m.reasoningScore ?? '—'}
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: 12,
                                                color: C.teal,
                                            }}
                                        >
                                            {m.englishScore ?? '—'}
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: 12,
                                                color: C.red,
                                            }}
                                        >
                                            {m.gkScore ?? '—'}
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: 12,
                                                color: '#888',
                                            }}
                                        >
                                            {m.accuracy
                                                ? `${Number(m.accuracy).toFixed(1)}%`
                                                : '—'}
                                        </td>
                                        <td
                                            style={{
                                                paddingRight: 12,
                                                color: '#888',
                                            }}
                                        >
                                            {m.percentile
                                                ? `${m.percentile}%`
                                                : '—'}
                                        </td>
                                        <td>
                                            {delta !== null ? (
                                                <Delta val={delta} />
                                            ) : (
                                                <span style={{ color: '#555' }}>
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {!recentMocks.length && (
                                <tr>
                                    <td
                                        colSpan={11}
                                        style={{
                                            padding: '24px 0',
                                            textAlign: 'center',
                                            color: '#555',
                                        }}
                                    >
                                        No mocks recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Profile;
