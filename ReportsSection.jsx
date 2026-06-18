import {
    FaCalendarWeek,
    FaCalendarAlt,
    FaChartBar,
    FaTrophy,
} from 'react-icons/fa';

const ReportsSection = ({ weeklyReport, monthlyReport, mocks }) => {
    const platformAnalysis = getPlatformAnalysis(mocks);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* WEEKLY */}
            <ReportCard
                title="Weekly Performance"
                icon={<FaCalendarWeek />}
                gradient="from-indigo-500 to-cyan-500"
            >
                <Stat label="Mocks" value={weeklyReport.mocks} />
                <Stat label="Avg Score" value={weeklyReport.avgScore} />
                <Stat label="Accuracy" value={`${weeklyReport.avgAccuracy}%`} />
            </ReportCard>

            {/* MONTHLY */}
            <ReportCard
                title="Monthly Performance"
                icon={<FaCalendarAlt />}
                gradient="from-purple-500 to-pink-500"
            >
                <Stat label="Mocks" value={monthlyReport.mocks} />
                <Stat label="Avg Score" value={monthlyReport.avgScore} />
                <Stat
                    label="Accuracy"
                    value={`${monthlyReport.avgAccuracy}%`}
                />
            </ReportCard>

            {/* PLATFORM */}
            <ReportCard
                title="Platform Ranking"
                icon={<FaTrophy />}
                gradient="from-amber-500 to-orange-500"
            >
                {platformAnalysis.length === 0 ? (
                    <p className="text-slate-500 text-sm">
                        No platform data available
                    </p>
                ) : (
                    <div className="space-y-3">
                        {platformAnalysis.map((p, index) => (
                            <div
                                key={p.name}
                                className="
                                    flex items-center justify-between
                                    p-3 rounded-xl
                                    bg-slate-50 dark:bg-slate-800
                                    hover:scale-[1.02]
                                    transition-all duration-200
                                "
                            >
                                {/* LEFT */}
                                <div className="flex items-center gap-2">
                                    <span
                                        className="
                                        text-xs font-bold
                                        px-2 py-1 rounded-full
                                        bg-indigo-100 text-indigo-700
                                        dark:bg-indigo-900 dark:text-indigo-200
                                    "
                                    >
                                        #{index + 1}
                                    </span>

                                    <span className="font-medium text-slate-700 dark:text-white">
                                        {p.name}
                                    </span>
                                </div>

                                {/* RIGHT */}
                                <span className="font-bold text-indigo-600">
                                    {p.average}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </ReportCard>
        </div>
    );
};

/* ================= REPORT CARD ================= */

const ReportCard = ({ title, icon, gradient, children }) => {
    return (
        <div
            className="
            bg-white dark:bg-slate-900
            rounded-3xl p-6
            shadow-lg
            border border-slate-200/50 dark:border-slate-700/40
            hover:shadow-xl
            transition-all duration-300
        "
        >
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-5">
                <div
                    className={`
                    w-10 h-10 rounded-xl
                    bg-gradient-to-r ${gradient}
                    flex items-center justify-center
                    text-white shadow-md
                `}
                >
                    {icon}
                </div>

                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    {title}
                </h2>
            </div>

            {children}
        </div>
    );
};

/* ================= STAT ================= */

const Stat = ({ label, value }) => {
    return (
        <div className="mb-4">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {value}
            </p>
        </div>
    );
};

/* ================= PLATFORM ANALYSIS ================= */

function getPlatformAnalysis(mocks) {
    const grouped = {};

    if (!mocks?.length) return [];

    mocks.forEach((mock) => {
        const platform = mock.platform || 'Unknown';
        const score = Number(mock.totalScore || 0);
        const date = new Date(mock.date).getTime();

        if (!grouped[platform]) {
            grouped[platform] = {
                total: 0,
                count: 0,
                scores: [],
            };
        }

        grouped[platform].total += score;
        grouped[platform].count += 1;

        grouped[platform].scores.push({
            score,
            date,
        });
    });

    const result = Object.entries(grouped).map(([name, data]) => {
        const { scores, total, count } = data;

        // sort oldest → newest for time weighting
        scores.sort((a, b) => a.date - b.date);

        const avgScore = total / count;
        const bestScore = Math.max(...scores.map((s) => s.score));

        // -----------------------------
        // Weighted recent performance
        // -----------------------------
        const decay = 0.15;
        let weightedSum = 0;
        let weightTotal = 0;

        scores.forEach((s, index) => {
            const weight = Math.exp(decay * index); // recent gets higher weight
            weightedSum += s.score * weight;
            weightTotal += weight;
        });

        const weightedAvg = weightTotal ? weightedSum / weightTotal : 0;

        // -----------------------------
        // Final ranking score
        // -----------------------------
        const finalScore =
            weightedAvg * 0.6 + // recent form (most important)
            bestScore * 0.3 + // peak performance
            avgScore * 0.1; // stability

        return {
            name,
            average: avgScore.toFixed(2), // keep UI unchanged
            _rankScore: finalScore, // internal ranking only
        };
    });

    // sort by improved ranking logic
    return result
        .sort((a, b) => b._rankScore - a._rankScore)
        .map(({ _rankScore, ...rest }) => rest);
}

export default ReportsSection;
