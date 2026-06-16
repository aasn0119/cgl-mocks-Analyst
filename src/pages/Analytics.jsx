import { useEffect, useState } from 'react';
import { listenToMocks } from '../services/mockService';
import AccuracyTrend from '../charts/AccuracyTrend';
import ScoreTrend from '../charts/ScoreTrend';
import SubjectRadar from '../charts/SubjectRadar';
import PlatformChart from '../charts/PlatformChart';
import { useAuth } from '../contexts/AuthContext';

const Analytics = () => {
    const { user } = useAuth();
    console.log('Analytics user:', user);
    const [mocks, setMocks] = useState([]);

    useEffect(() => {
        if (!user) return;

        const unsub = listenToMocks(user.uid, (data) => {
            setMocks(data);
        });

        return () => unsub();
    }, [user]);

    if (!mocks.length) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <div className="text-7xl mb-6">📈</div>

                <h2 className="text-2xl font-bold text-slate-700 dark:text-white">
                    No Analytics Available
                </h2>

                <p className="mt-3 text-slate-500">
                    Add a few mock tests to unlock insights and trends.
                </p>
            </div>
        );
    }

    const sorted = [...mocks].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    const latest = sorted[sorted.length - 1];

    const totalMocks = mocks.length;

    const avgScore = (
        mocks.reduce((sum, m) => sum + Number(m.totalScore || 0), 0) /
        totalMocks
    ).toFixed(1);

    const avgAccuracy = (
        mocks.reduce((sum, m) => sum + Number(m.accuracy || 0), 0) / totalMocks
    ).toFixed(1);

    const bestScore = Math.max(...mocks.map((m) => Number(m.totalScore || 0)));

    return (
        <div className="p-6 grid gap-6">
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 shadow-2xl text-white">
                <h1 className="text-4xl font-extrabold">
                    Analytics Dashboard 📊
                </h1>

                <p className="mt-2 text-indigo-100">
                    Track score trends, accuracy growth and subject performance.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <MetricCard
                    title="Total Mocks"
                    value={totalMocks}
                    color="from-blue-500 to-cyan-500"
                />

                <MetricCard
                    title="Average Score"
                    value={avgScore}
                    color="from-purple-500 to-pink-500"
                />

                <MetricCard
                    title="Best Score"
                    value={bestScore}
                    color="from-emerald-500 to-green-500"
                />

                <MetricCard
                    title="Accuracy"
                    value={`${avgAccuracy}%`}
                    color="from-orange-500 to-red-500"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                        Score Trend
                    </h3>

                    <ScoreTrend data={sorted} />
                </div>
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                        Accuracy Trend
                    </h3>

                    <AccuracyTrend data={sorted} />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                        Subject Radar
                    </h3>

                    <SubjectRadar data={latest} />
                </div>
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                        Platform Distribution
                    </h3>

                    <PlatformChart data={sorted} />
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, color }) => (
    <div
        className={`
      bg-gradient-to-r
      ${color}
      rounded-3xl
      p-6
      text-white
      shadow-lg
      hover:scale-[1.03]
      hover:shadow-2xl
      transition-all
      duration-300
    `}
    >
        <p className="text-sm opacity-90">{title}</p>

        <h2 className="text-4xl font-bold mt-2">{value}</h2>
    </div>
);

export default Analytics;
