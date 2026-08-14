import { useEffect, useState } from 'react';
import { listenToMocks } from '../services/mockService';
import AccuracyTrend from '../charts/AccuracyTrend';
import ScoreTrend from '../charts/ScoreTrend';
import SubjectRadar from '../charts/SubjectRadar';
import PlatformChart from '../charts/PlatformChart';
import AIInsightsPanel from '../components/analytics/AIInsightsPanel';
import { useAuth } from '../contexts/AuthContext';
import { useTier } from '../contexts/TierContext';
import { getMockTier } from '../config/examPatterns';

const Analytics = () => {
    const { user } = useAuth();
    const { tier, pattern } = useTier();
    const [allMocks, setAllMocks] = useState([]);

    useEffect(() => {
        if (!user) return;

        const unsub = listenToMocks(user.uid, (data) => {
            setAllMocks(data);
        });

        return () => unsub();
    }, [user]);

    // Keep only mocks belonging to the currently selected tier.
    const mocks = allMocks.filter((m) => getMockTier(m) === tier);

    if (!mocks.length) {
        return (
            <div
                className="
                    min-h-[60vh]
                    px-4
                    sm:px-6
                    py-16
                    sm:py-24
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                "
            >
                <div
                    className="
                        text-5xl
                        sm:text-6xl
                        md:text-7xl
                        mb-5
                        sm:mb-6
                    "
                >
                    📈
                </div>

                <h2
                    className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        text-slate-700
                        dark:text-white
                    "
                >
                    No Analytics Available
                </h2>

                <p
                    className="
                        mt-3
                        max-w-xl
                        px-2
                        text-sm
                        sm:text-base
                        leading-relaxed
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Add a few {pattern.fullName} mock tests to unlock insights
                    and trends.
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
        <div
            className="
                w-full
                min-w-0
                p-3
                sm:p-4
                md:p-6
                grid
                gap-4
                sm:gap-5
                md:gap-6
            "
        >
            {/* =====================================================
                HERO
            ====================================================== */}

            <div
                className="
                    bg-gradient-to-r
                    from-indigo-600
                    via-blue-600
                    to-cyan-500
                    rounded-2xl
                    sm:rounded-3xl
                    p-5
                    sm:p-6
                    md:p-8
                    shadow-2xl
                    text-white
                    overflow-hidden
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        gap-3
                        min-w-0
                    "
                >
                    <h1
                        className="
                            min-w-0
                            text-2xl
                            sm:text-3xl
                            md:text-4xl
                            font-extrabold
                            leading-tight
                        "
                    >
                        Analytics Dashboard 📊
                    </h1>

                    <span
                        className="
                            shrink-0
                            w-fit
                            max-w-full
                            text-[10px]
                            sm:text-xs
                            font-bold
                            px-2.5
                            sm:px-3
                            py-1
                            rounded-full
                            bg-white/20
                            backdrop-blur-sm
                            truncate
                        "
                        title={pattern.fullName}
                    >
                        {pattern.fullName}
                    </span>
                </div>

                <p
                    className="
                        mt-2
                        max-w-2xl
                        text-sm
                        sm:text-base
                        text-indigo-100
                        leading-relaxed
                    "
                >
                    Track score trends, accuracy growth and subject performance.
                </p>
            </div>

            {/* =====================================================
                METRICS
            ====================================================== */}

            <div
                className="
                    grid
                    grid-cols-2
                    lg:grid-cols-4
                    gap-3
                    sm:gap-4
                    md:gap-5
                "
            >
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

            {/* =====================================================
                AI INSIGHTS
            ====================================================== */}

            <div className="min-w-0">
                <AIInsightsPanel mocks={mocks} />
            </div>

            {/* =====================================================
                SCORE + ACCURACY
            ====================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-2
                    gap-4
                    sm:gap-5
                    md:gap-6
                    min-w-0
                "
            >
                <ChartCard title="Score Trend">
                    <ScoreTrend data={sorted} />
                </ChartCard>

                <ChartCard title="Accuracy Trend">
                    <AccuracyTrend data={sorted} />
                </ChartCard>
            </div>

            {/* =====================================================
                SUBJECT + PLATFORM
            ====================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-2
                    gap-4
                    sm:gap-5
                    md:gap-6
                    min-w-0
                "
            >
                <ChartCard title="Subject Radar">
                    <SubjectRadar data={latest} />
                </ChartCard>

                <ChartCard title="Platform Distribution">
                    <PlatformChart data={sorted} />
                </ChartCard>
            </div>
        </div>
    );
};

/* ================================================================
   CHART CARD
================================================================ */

const ChartCard = ({ title, children }) => {
    return (
        <div
            className="
                w-full
                min-w-0
                overflow-hidden
                bg-white/70
                dark:bg-slate-900/70
                backdrop-blur-xl
                border
                border-white/20
                rounded-2xl
                sm:rounded-3xl
                p-4
                sm:p-5
                shadow-xl
            "
        >
            <h3
                className="
                    text-lg
                    sm:text-xl
                    font-bold
                    mb-3
                    sm:mb-4
                    bg-gradient-to-r
                    from-indigo-600
                    to-cyan-500
                    bg-clip-text
                    text-transparent
                "
            >
                {title}
            </h3>

            {/* Prevent chart libraries from forcing horizontal overflow */}
            <div
                className="
                    w-full
                    min-w-0
                    overflow-hidden
                "
            >
                {children}
            </div>
        </div>
    );
};

/* ================================================================
   METRIC CARD
================================================================ */

const MetricCard = ({ title, value, color }) => (
    <div
        className={`
            min-w-0
            bg-gradient-to-r
            ${color}
            rounded-2xl
            sm:rounded-3xl
            p-4
            sm:p-5
            md:p-6
            text-white
            shadow-lg
            hover:shadow-2xl
            transition-all
            duration-300
        `}
    >
        <p
            className="
                text-xs
                sm:text-sm
                opacity-90
                truncate
            "
            title={title}
        >
            {title}
        </p>

        <h2
            className="
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-bold
                mt-1
                sm:mt-2
                truncate
            "
        >
            {value}
        </h2>
    </div>
);

export default Analytics;
