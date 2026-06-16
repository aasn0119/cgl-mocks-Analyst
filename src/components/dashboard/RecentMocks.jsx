import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis } from 'recharts';

import {
    FaTrophy,
    FaChartLine,
    FaClock,
    FaBullseye,
    FaCheckCircle,
    FaTimesCircle,
    FaCalendarAlt,
} from 'react-icons/fa';

const RecentMocks = ({ mocks }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [compare, setCompare] = useState([]);

    const recentMocks = [...mocks]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const toggleCompare = (mock) => {
        setCompare((prev) => {
            if (prev.find((m) => m.id === mock.id)) {
                return prev.filter((m) => m.id !== mock.id);
            }
            if (prev.length < 2) return [...prev, mock];
            return prev;
        });
    };

    const selectedCompare = compare.length === 2 ? compare : null;

    return (
        <div
            className="
            bg-white dark:bg-slate-900
            rounded-3xl p-6
            shadow-xl
            border border-slate-200/50 dark:border-slate-700/40
        "
        >
            {/* HEADER */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                    📈 Recent Mocks
                </h2>
                <p className="text-sm text-slate-500">
                    Click to expand • Select 2 to compare
                </p>
            </div>

            {/* COMPARE */}
            {selectedCompare && <ComparePanel mocks={selectedCompare} />}

            {/* LIST */}
            <div className="space-y-4">
                {recentMocks.map((mock) => {
                    const isOpen = expandedId === mock.id;

                    return (
                        <div
                            key={mock.id}
                            className="
                                rounded-2xl overflow-hidden
                                border border-slate-200/60 dark:border-slate-700/40
                                shadow-md hover:shadow-xl
                                transition-all duration-300
                            "
                        >
                            {/* COLLAPSED HEADER */}
                            <div
                                onClick={() =>
                                    setExpandedId(isOpen ? null : mock.id)
                                }
                                className="
                                    flex justify-between items-center
                                    p-4 cursor-pointer
                                    bg-gradient-to-r from-slate-50 to-white
                                    dark:from-slate-800 dark:to-slate-900
                                "
                            >
                                <div>
                                    <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                                        <FaChartLine className="text-indigo-500" />
                                        {mock.platform}
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        ID: {mock.mockId} • 📅 {mock.date}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={compare.find(
                                            (m) => m.id === mock.id
                                        )}
                                        onChange={() => toggleCompare(mock)}
                                        onClick={(e) => e.stopPropagation()}
                                    />

                                    <span className="text-xs text-slate-400">
                                        Compare
                                    </span>
                                </div>
                            </div>

                            {/* EXPANDED */}
                            {isOpen && (
                                <div className="p-5 space-y-5 bg-white dark:bg-slate-900">
                                    {/* SCORE BAR */}
                                    <ScoreBar score={mock.totalScore} />

                                    {/* BEST / WORST */}
                                    <BestWorst mock={mock} />

                                    {/* SPARKLINE */}
                                    <SparkLine mock={mock} />

                                    {/* STATS GRID */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <Stat
                                            icon="📊"
                                            label="Score"
                                            value={mock.totalScore}
                                            color="indigo"
                                        />
                                        <Stat
                                            icon="🎯"
                                            label="Accuracy"
                                            value={`${mock.accuracy}%`}
                                            color="green"
                                        />
                                        <Stat
                                            icon="🏆"
                                            label="Rank"
                                            value={mock.rank}
                                            color="red"
                                        />
                                        <Stat
                                            icon="⭐"
                                            label="Percentile"
                                            value={`${mock.percentile}%`}
                                            color="yellow"
                                        />

                                        <Stat
                                            icon="🧠"
                                            label="Quant"
                                            value={mock.quantScore}
                                        />
                                        <Stat
                                            icon="🧩"
                                            label="Reasoning"
                                            value={mock.reasoningScore}
                                        />
                                        <Stat
                                            icon="📖"
                                            label="English"
                                            value={mock.englishScore}
                                        />
                                        <Stat
                                            icon="🌍"
                                            label="GK"
                                            value={mock.gkScore}
                                        />

                                        <Stat
                                            icon="⏱️"
                                            label="Time"
                                            value={`${mock.timeTaken} min`}
                                        />
                                        <Stat
                                            icon="📘"
                                            label="Attempted"
                                            value={mock.attemptedQuestions}
                                        />
                                        <Stat
                                            icon="✅"
                                            label="Correct"
                                            value={mock.correctQuestions}
                                        />
                                        <Stat
                                            icon="❌"
                                            label="Wrong"
                                            value={mock.wrongQuestions}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ================= SCORE BAR ================= */

const ScoreBar = ({ score }) => {
    const percent = Math.min((score / 200) * 100, 100);

    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Score Progress</span>
                <span className="font-semibold text-indigo-600">{score}</span>
            </div>

            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-700"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};

/* ================= BEST / WORST ================= */

const BestWorst = ({ mock }) => {
    const subjects = [
        { name: 'Quant', value: mock.quantScore },
        { name: 'Reasoning', value: mock.reasoningScore },
        { name: 'English', value: mock.englishScore },
        { name: 'GK', value: mock.gkScore },
    ];

    const sorted = [...subjects].sort((a, b) => b.value - a.value);

    return (
        <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
                <FaCheckCircle />
                Best: {sorted[0].name} ({sorted[0].value})
            </div>

            <div className="flex items-center gap-1 text-red-500">
                <FaTimesCircle />
                Weak: {sorted[3].name} ({sorted[3].value})
            </div>
        </div>
    );
};

/* ================= SPARKLINE ================= */

const SparkLine = ({ mock }) => {
    const data = [
        { subject: 'Q', v: mock.quantScore },
        { subject: 'R', v: mock.reasoningScore },
        { subject: 'E', v: mock.englishScore },
        { subject: 'G', v: mock.gkScore },
    ];

    return (
        <div className="h-16 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis dataKey="subject" hide />
                    {/* GRADIENT DEFINITION */}
                    <defs>
                        <linearGradient
                            id="sparkGrad"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                        >
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                    </defs>

                    <Line
                        type="monotone"
                        dataKey="v"
                        stroke="url(#sparkGrad)"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

/* ================= STAT ================= */

const Stat = ({ icon, label, value, color }) => {
    const colorMap = {
        indigo: 'text-indigo-600',
        green: 'text-green-600',
        red: 'text-red-500',
        yellow: 'text-yellow-500',
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
            <p className="text-xs text-slate-400 flex items-center gap-1">
                {icon} {label}
            </p>

            <p
                className={`font-bold ${colorMap[color] || 'text-slate-800 dark:text-white'}`}
            >
                {value}
            </p>
        </div>
    );
};

/* ================= COMPARE ================= */

const ComparePanel = ({ mocks }) => {
    return (
        <div
            className="
            mb-6 p-5 rounded-2xl
            border border-slate-200/50 dark:border-slate-700/40
            bg-gradient-to-r from-indigo-50 via-purple-50 to-cyan-50
            dark:from-slate-800 dark:via-slate-900 dark:to-slate-950
            shadow-lg
        "
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    📊 Compare Mode
                </h3>

                <span className="text-xs text-slate-500">
                    Side-by-side performance analysis
                </span>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mocks.map((m) => (
                    <div
                        key={m.id}
                        className="
                            relative
                            p-4 rounded-xl
                            bg-white dark:bg-slate-900
                            border border-slate-200/60 dark:border-slate-700/40
                            shadow-md
                            hover:shadow-xl
                            transition-all duration-300
                        "
                    >
                        {/* TOP BAR */}
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white">
                                    {m.platform}
                                </p>

                                <p className="text-xs text-slate-500">
                                    ID: {m.mockId}
                                </p>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <FaCalendarAlt />
                                {m.date}
                            </div>
                        </div>

                        {/* SCORE HIGHLIGHT */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-2xl font-bold text-indigo-600">
                                {m.totalScore}
                            </div>

                            <div className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                                Score
                            </div>
                        </div>

                        {/* METRICS GRID */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <Metric
                                icon="📊"
                                label="Accuracy"
                                value={`${m.accuracy}%`}
                            />
                            <Metric icon="🏆" label="Rank" value={m.rank} />
                            <Metric
                                icon="⭐"
                                label="Percentile"
                                value={`${m.percentile}%`}
                            />
                            <Metric
                                icon="⏱️"
                                label="Time"
                                value={`${m.timeTaken}m`}
                            />

                            <Metric
                                icon="📘"
                                label="Attempted"
                                value={m.attemptedQuestions}
                            />
                            <Metric
                                icon="✅"
                                label="Correct"
                                value={m.correctQuestions}
                            />
                            <Metric
                                icon="❌"
                                label="Wrong"
                                value={m.wrongQuestions}
                            />
                            <Metric
                                icon="🎯"
                                label="Score"
                                value={m.totalScore}
                            />
                        </div>

                        {/* FOOTER INSIGHT */}
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                            <FaBullseye className="text-indigo-500" />
                            Performance snapshot comparison
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ================= METRIC ================= */

const Metric = ({ icon, label, value }) => {
    return (
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
            <span className="text-sm">{icon}</span>

            <div>
                <p className="text-[10px] text-slate-400">{label}</p>
                <p className="font-semibold text-sm">{value}</p>
            </div>
        </div>
    );
};

export default RecentMocks;
