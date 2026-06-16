const TargetTracker = ({
    currentScore,
    avgScore,
    progressPercent,
    goalGap,
    targetScore,
}) => {
    const isOnTrack = goalGap <= 0;

    return (
        <div
            className="
                rounded-3xl
                p-6
                shadow-xl
                border
                border-slate-200/60
                dark:border-slate-700/40
                bg-gradient-to-br
                from-white
                to-slate-50
                dark:from-slate-900
                dark:to-slate-950
            "
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        🎯 Target Tracker
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Goal Score:
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 ml-1">
                            {targetScore}
                        </span>
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Progress
                    </p>

                    <h3 className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">
                        {progressPercent}%
                    </h3>
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="
                        h-full
                        bg-gradient-to-r
                        from-indigo-500
                        via-purple-500
                        to-cyan-500
                        transition-all
                        duration-700
                    "
                    style={{
                        width: `${Math.min(progressPercent, 100)}%`,
                    }}
                />
            </div>

            {/* METRICS ROW */}
            <div className="grid grid-cols-3 gap-4 mt-6">
                {/* Current Score */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                    <p className="text-xs text-slate-500">Current</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-white">
                        {currentScore}
                    </p>
                </div>

                {/* Average Score */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                    <p className="text-xs text-slate-500">Average</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {avgScore}
                    </p>
                </div>

                {/* Goal Gap */}
                <div
                    className={`
                        rounded-2xl p-4
                        ${
                            isOnTrack
                                ? 'bg-emerald-50 dark:bg-emerald-500/10'
                                : 'bg-rose-50 dark:bg-rose-500/10'
                        }
                    `}
                >
                    <p className="text-xs text-slate-500">Goal Gap</p>

                    <p
                        className={`text-xl font-bold ${
                            isOnTrack
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                        }`}
                    >
                        {goalGap > 0 ? `+${goalGap}` : goalGap}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TargetTracker;
