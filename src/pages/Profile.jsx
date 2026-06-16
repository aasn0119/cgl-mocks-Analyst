import {
    buildScoreTrend,
    buildAccuracyTrend,
    buildSubjectPerformance,
    buildPlatformPerformance,
} from '../utils/profileAnalytics';

import CustomLineChart from '../charts/LineChart';
import CustomBarChart from '../charts/BarChart';

import RecentMocks from '../components/dashboard/RecentMocks';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase';

import { TrendingUp, Activity, BarChart3, Globe } from 'lucide-react';

import { collection, query, where, onSnapshot } from 'firebase/firestore';

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from 'recharts';

const Profile = () => {
    const { uid } = useParams();

    const [mocks, setMocks] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log('Mocks in Profile:', mocks); // Debugging line

    // ================= LOAD MOCKS =================
    useEffect(() => {
        if (!uid) return;

        const q = query(collection(db, 'mocks'), where('userId', '==', uid));

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setMocks(data);
            setLoading(false);
        });

        return () => unsub();
    }, [uid]);

    // ================= LOAD USER =================
    useEffect(() => {
        if (!uid) return;

        const q = query(collection(db, 'users'), where('uid', '==', uid));

        const unsub = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                setUserData(snapshot.docs[0].data());
            }
        });

        return () => unsub();
    }, [uid]);

    // ================= DERIVED STATS =================
    const stats = useMemo(() => {
        const total = mocks.length;

        const avgScore =
            total > 0
                ? (
                      mocks.reduce(
                          (sum, m) => sum + Number(m.totalScore || 0),
                          0
                      ) / total
                  ).toFixed(1)
                : 0;

        const bestScore =
            total > 0
                ? Math.max(...mocks.map((m) => Number(m.totalScore || 0)))
                : 0;

        const avgAccuracy =
            total > 0
                ? (
                      mocks.reduce(
                          (sum, m) => sum + Number(m.accuracy || 0),
                          0
                      ) / total
                  ).toFixed(1)
                : 0;

        return { total, avgScore, bestScore, avgAccuracy };
    }, [mocks]);

    const scoreTrend = buildScoreTrend(mocks);
    const accuracyTrend = buildAccuracyTrend(mocks);
    const subjectData = buildSubjectPerformance(mocks);
    const platformData = buildPlatformPerformance(mocks);

    const radarData = [
        { subject: 'English', value: stats.avgScore / 5 },
        { subject: 'Reasoning', value: stats.avgScore / 5 },
        { subject: 'Quant', value: stats.avgScore / 5 },
        { subject: 'GK', value: stats.avgScore / 5 },
    ];

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';

        if (timestamp?.toDate) {
            return timestamp.toDate().toDateString();
        }

        return new Date(timestamp).toDateString();
    };

    // ================= LOADING =================
    if (!uid) {
        return (
            <div className="p-10 text-center text-slate-500">
                Invalid Profile URL
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-10 text-center text-slate-500">
                Loading profile...
            </div>
        );
    }

    // ================= UI =================
    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-2xl">
                <div className="flex items-center gap-6">
                    <img
                        src={userData?.photoURL}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    />

                    <div>
                        <h1 className="text-3xl font-bold">
                            {userData?.displayName || 'Student'}
                        </h1>

                        <p className="text-indigo-100 mt-1">
                            Joined{' '}
                            {userData?.joinedAt
                                ? formatDate(userData.joinedAt)
                                : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <StatCard
                    title="Total Mocks"
                    value={stats.total}
                    color="from-blue-500 to-cyan-500"
                />
                <StatCard
                    title="Average Score"
                    value={stats.avgScore}
                    color="from-purple-500 to-pink-500"
                />
                <StatCard
                    title="Best Score"
                    value={stats.bestScore}
                    color="from-emerald-500 to-green-500"
                />
                <StatCard
                    title="Accuracy"
                    value={`${stats.avgAccuracy}%`}
                    color="from-orange-500 to-red-500"
                />
            </div>

            {/* INSIGHTS */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 rounded-3xl shadow-xl">
                <h2 className="text-xl font-bold mb-3">AI Insights</h2>

                <p className="text-white/80">
                    Performance trends based on your mock history.
                </p>
            </div>

            {/* ✅ REPLACED RECENT MOCKS SECTION */}
            <RecentMocks mocks={mocks} />

            {/* CHARTS */}
            <div className="grid md:grid-cols-2 gap-6">
                <ChartCard
                    title="Score Trend"
                    icon={<TrendingUp className="text-indigo-500" />}
                >
                    <CustomLineChart data={scoreTrend} dataKey="score" />
                </ChartCard>

                <ChartCard
                    title="Accuracy Trend"
                    icon={<Activity className="text-orange-500" />}
                >
                    <CustomLineChart
                        data={accuracyTrend}
                        dataKey="accuracy"
                        color="#f97316"
                    />
                </ChartCard>

                <ChartCard
                    title="Subject Performance"
                    icon={<BarChart3 className="text-emerald-500" />}
                >
                    <CustomBarChart data={subjectData} dataKey="value" />
                </ChartCard>

                <ChartCard
                    title="Platform Performance"
                    icon={<Globe className="text-cyan-500" />}
                >
                    <CustomBarChart data={platformData} dataKey="avgScore" />
                </ChartCard>

                {/* RADAR */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl">
                    <h2 className="text-xl font-bold mb-4">Skill Radar</h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar
                                dataKey="value"
                                stroke="#6366f1"
                                fill="#6366f1"
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Profile;

// ================= COMPONENTS =================

const StatCard = ({ title, value, color }) => (
    <div
        className={`bg-gradient-to-r ${color} text-white p-6 rounded-3xl shadow-lg`}
    >
        <p className="text-sm opacity-90">{title}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
);

const ChartCard = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
            {icon}
            <h2 className="text-lg font-bold">{title}</h2>
        </div>
        {children}
    </div>
);
