import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { C, PLATFORM_COLORS } from '../components/profile/constants';
import { getTimestamp, formatDate } from '../components/profile/utils';
import CustomTooltip from '../components/profile/CustomTooltip';
import StatCard from '../components/profile/StatCard';
import ChartCard from '../components/profile/ChartCard';
import ScorePill from '../components/profile/ScorePill';
import Delta from '../components/profile/Delta';
import ProfileHero from '../components/profile/ProfileHero';

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
import StatsGrid from '../components/profile/StatsGrid';
import GoalTracker from '../components/profile/GoalTracker';
import RecentMocksTable from '../components/profile/RecentMocksTable';
import MainTrendChart from '../components/profile/MainTrendChart';
import SubjectTrendChart from '../components/profile/SubjectTrendChart';
import PlatformPerformanceChart from '../components/profile/PlatformPerformanceChart';
import RadarChartComponent from '../components/profile/RadarChart';
import SubjectAverageChart from '../components/profile/SubjectAverageChart';

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
            [...(mocks || [])].sort(
                (a, b) => getTimestamp(b) - getTimestamp(a)
            ),
        [mocks]
    );

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
            <ProfileHero
                userData={userData}
                initials={initials}
                stats={stats}
                readinessColor={readinessColor}
                formatDate={formatDate}
            />

            {/* ── STAT CARDS ── */}
            <StatsGrid stats={stats} TARGET_SCORE={TARGET_SCORE} />

            {/* ── GOAL TRACKER ── */}
            <GoalTracker stats={stats} TARGET_SCORE={TARGET_SCORE} />

            {/* ── MAIN TREND ── */}
            <MainTrendChart chartData={chartData} />

            {/* ── SUBJECT TRENDS ── */}
            <SubjectTrendChart subjectTrend={subjectTrend} />

            {/* ── PLATFORM + RADAR ── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 14,
                    marginBottom: 14,
                }}
            >
                <PlatformPerformanceChart platformData={platformData} />
                <RadarChartComponent radarData={radarData} />
            </div>

            {/* ── SUBJECT BAR (real per-subject averages) ── */}
            <SubjectAverageChart subjectAverages={subjectAverages} />

            {/* ── RECENT MOCKS ── */}
            <RecentMocksTable
                recentMocks={recentMocks}
                formatDate={formatDate}
            />
        </div>
    );
};

export default Profile;
