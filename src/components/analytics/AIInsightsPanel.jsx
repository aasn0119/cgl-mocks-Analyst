import { useMemo, useState } from 'react';
import {
    FaBrain,
    FaBullseye,
    FaChevronDown,
    FaChevronUp,
    FaArrowUp,
    FaArrowDown,
    FaMinus,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTrophy,
} from 'react-icons/fa';
import { generateAIInsights } from '../../utils/aiInsights';

const STATUS_STYLES = {
    red: {
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
        ring: 'ring-rose-300/50 dark:ring-rose-500/30',
        bar: 'bg-rose-500',
    },
    amber: {
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
        ring: 'ring-amber-300/50 dark:ring-amber-500/30',
        bar: 'bg-amber-500',
    },
    teal: {
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        ring: 'ring-emerald-300/50 dark:ring-emerald-500/30',
        bar: 'bg-emerald-500',
    },
};

const TrendIcon = ({ trend }) => {
    if (trend === 'improving')
        return <FaArrowUp className="text-emerald-500" />;
    if (trend === 'declining') return <FaArrowDown className="text-rose-500" />;
    return <FaMinus className="text-slate-400" />;
};

const SubjectCard = ({ insight, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    const style = STATUS_STYLES[insight.status.color];

    return (
        <div
            className={`rounded-2xl border border-white/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-lg ring-1 ${style.ring} transition-all`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 dark:text-white">
                            {insight.subject}
                        </h4>
                        <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${style.badge}`}
                        >
                            {insight.status.label}
                        </span>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Avg {insight.avg}/50 · {insight.pctOfMax}% mastery
                    </p>
                </div>

                <div className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <TrendIcon trend={insight.trend} />
                    <span className="capitalize">{insight.trend}</span>
                </div>
            </div>

            <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                    className={`h-full ${style.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, insight.pctOfMax)}%` }}
                />
            </div>

            <button
                onClick={() => setOpen((o) => !o)}
                className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition cursor-pointer"
            >
                {open ? 'Hide' : 'Show'} improvement tips
                {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>

            {open && (
                <ul className="mt-3 space-y-2">
                    {insight.tips.map((tip, i) => (
                        <li
                            key={i}
                            className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"
                        >
                            <span className="text-indigo-500 mt-0.5">•</span>
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const GeneralInsightRow = ({ insight }) => {
    const isWarning = insight.type === 'warning';
    return (
        <div
            className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm ${
                isWarning
                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300'
                    : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'
            }`}
        >
            {isWarning ? (
                <FaExclamationTriangle className="mt-0.5 shrink-0" />
            ) : (
                <FaCheckCircle className="mt-0.5 shrink-0" />
            )}
            <span>{insight.text}</span>
        </div>
    );
};

const AIInsightsPanel = ({ mocks }) => {
    const insights = useMemo(() => generateAIInsights(mocks), [mocks]);

    if (!insights) return null;

    const { headline, primaryFocus, subjectInsights, generalInsights, meta } =
        insights;

    // Order cards so the highest-priority subject appears first.
    const orderedSubjects = [...subjectInsights].sort(
        (a, b) => b.priority - a.priority
    );

    return (
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shrink-0">
                    <FaBrain />
                </div>
                <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                        AI-Powered Insights
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Based on {meta.totalMocks} mock
                        {meta.totalMocks > 1 ? 's' : ''} · avg accuracy{' '}
                        {meta.avgAccuracy}%
                    </p>
                </div>
            </div>

            {/* Headline / primary focus banner */}
            <div className="mt-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-5 text-white shadow-lg">
                <div className="flex items-center gap-2 text-indigo-100 text-xs font-semibold uppercase tracking-wide">
                    <FaBullseye />
                    Recommended Focus
                </div>
                <p className="mt-2 font-semibold leading-relaxed">{headline}</p>
            </div>

            {/* General cross-cutting insights */}
            {generalInsights.length > 0 && (
                <div className="mt-5 grid gap-2">
                    {generalInsights.map((g, i) => (
                        <GeneralInsightRow key={i} insight={g} />
                    ))}
                </div>
            )}

            {/* Per-subject breakdown */}
            <div className="mt-6">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaTrophy className="text-amber-500" />
                    Subject-wise Breakdown & Action Plan
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orderedSubjects.map((insight, i) => (
                        <SubjectCard
                            key={insight.subject}
                            insight={insight}
                            defaultOpen={
                                insight.subject === primaryFocus.subject &&
                                i === 0
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIInsightsPanel;
