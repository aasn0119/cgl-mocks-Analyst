import { FaCheck, FaTrophy, FaStar } from 'react-icons/fa';

import './TargetTracker.css';

const TargetTracker = ({
    currentScore,
    avgScore,
    progressPercent,
    goalGap,
    targetScore,
}) => {
    const isGoalAchieved = goalGap <= 0;

    // Never allow the visual progress bar to overflow.
    const safeProgress = Math.min(
        Math.max(Number(progressPercent) || 0, 0),
        100
    );

    return (
        <div
            className="
                relative
                overflow-hidden
                rounded-3xl
                p-4
                sm:p-5
                md:p-6
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
            {/* Decorative background glow when target is achieved */}
            {isGoalAchieved && (
                <>
                    <div className="target-celebration-glow target-glow-one" />
                    <div className="target-celebration-glow target-glow-two" />

                    <div className="target-particles">
                        <span>✦</span>
                        <span>✧</span>
                        <span>✦</span>
                        <span>⋆</span>
                        <span>✧</span>
                        <span>✦</span>
                        <span>⋆</span>
                        <span>✧</span>
                    </div>
                </>
            )}

            {/* HEADER */}
            <div
                className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                    mb-6
                "
            >
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        {isGoalAchieved && (
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    w-9
                                    h-9
                                    rounded-xl
                                    bg-emerald-100
                                    dark:bg-emerald-500/15
                                    text-emerald-600
                                    dark:text-emerald-400
                                    target-check-badge
                                "
                            >
                                <FaTrophy />
                            </div>
                        )}

                        <h2
                            className="
                                text-xl
                                sm:text-2xl
                                font-bold
                                text-slate-800
                                dark:text-white
                            "
                        >
                            🎯 Target Tracker
                        </h2>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Goal Score:
                        <span
                            className="
                                font-semibold
                                text-indigo-600
                                dark:text-indigo-400
                                ml-1
                            "
                        >
                            {targetScore}
                        </span>
                    </p>
                </div>

                <div
                    className="
                        sm:text-right
                        flex
                        items-center
                        justify-between
                        sm:block
                    "
                >
                    <p
                        className="
                            text-xs
                            uppercase
                            tracking-wide
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Progress
                    </p>

                    <h3
                        className={`
                            font-bold
                            text-2xl
                            ${
                                isGoalAchieved
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-indigo-600 dark:text-indigo-400'
                            }
                        `}
                    >
                        {safeProgress}%
                    </h3>
                </div>
            </div>

            {/* =====================================================
                GOAL ACHIEVED
            ====================================================== */}

            {isGoalAchieved ? (
                <div
                    className="
                        relative
                        rounded-2xl
                        border
                        border-emerald-200
                        dark:border-emerald-500/20
                        bg-gradient-to-br
                        from-emerald-50
                        via-teal-50
                        to-cyan-50
                        dark:from-emerald-500/10
                        dark:via-teal-500/10
                        dark:to-cyan-500/10
                        px-4
                        sm:px-6
                        py-6
                        sm:py-7
                        overflow-hidden
                    "
                >
                    {/* Animated rings */}
                    <div className="target-success-ring ring-one" />
                    <div className="target-success-ring ring-two" />
                    <div className="target-success-ring ring-three" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Main icon */}
                        <div
                            className="
                                relative
                                flex
                                items-center
                                justify-center
                                w-16
                                h-16
                                sm:w-20
                                sm:h-20
                                rounded-full
                                bg-gradient-to-br
                                from-emerald-400
                                to-teal-500
                                text-white
                                shadow-lg
                                shadow-emerald-500/30
                                target-trophy
                            "
                        >
                            <FaTrophy
                                className="
                                    text-2xl
                                    sm:text-3xl
                                "
                            />

                            <span className="absolute -top-1 -right-1 text-yellow-400 target-star star-one">
                                <FaStar size={13} />
                            </span>

                            <span className="absolute -bottom-1 -left-2 text-cyan-400 target-star star-two">
                                <FaStar size={11} />
                            </span>
                        </div>

                        <h3
                            className="
                                mt-4
                                text-xl
                                sm:text-2xl
                                font-extrabold
                                text-emerald-700
                                dark:text-emerald-400
                            "
                        >
                            Goal Achieved! 🎉
                        </h3>

                        <p
                            className="
                                mt-1
                                max-w-md
                                text-sm
                                sm:text-base
                                text-emerald-700/80
                                dark:text-emerald-300/80
                            "
                        >
                            You've reached your target score of{' '}
                            <span className="font-bold">{targetScore}</span>.
                            Keep pushing for an even higher score!
                        </p>

                        <div
                            className="
                                mt-4
                                inline-flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-full
                                bg-white/70
                                dark:bg-slate-900/40
                                border
                                border-emerald-200/70
                                dark:border-emerald-500/20
                                text-sm
                                font-bold
                                text-emerald-700
                                dark:text-emerald-400
                            "
                        >
                            <FaCheck size={12} />
                            Target: {targetScore}
                        </div>
                    </div>
                </div>
            ) : (
                /* =================================================
                   NORMAL PROGRESS
                ================================================== */

                <div>
                    <div
                        className="
                            w-full
                            h-3
                            sm:h-3.5
                            bg-slate-200
                            dark:bg-slate-800
                            rounded-full
                            overflow-hidden
                        "
                    >
                        <div
                            className="
                                h-full
                                rounded-full
                                bg-gradient-to-r
                                from-indigo-500
                                via-purple-500
                                to-cyan-500
                                transition-[width]
                                duration-700
                                ease-out
                                relative
                                overflow-hidden
                            "
                            style={{
                                width: `${safeProgress}%`,
                            }}
                        >
                            {/* Moving shine */}
                            <span className="progress-shine" />
                        </div>
                    </div>

                    <div
                        className="
                            flex
                            justify-between
                            mt-2
                            text-xs
                            text-slate-400
                        "
                    >
                        <span>0</span>
                        <span>{targetScore}</span>
                    </div>
                </div>
            )}

            {/* =====================================================
                METRICS
            ====================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-3
                    gap-3
                    sm:gap-4
                    mt-6
                "
            >
                {/* Current Score */}
                <div
                    className="
                        bg-slate-50
                        dark:bg-slate-800
                        rounded-2xl
                        p-4
                        min-w-0
                    "
                >
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Current
                    </p>

                    <p
                        className="
                            text-xl
                            font-bold
                            text-slate-800
                            dark:text-white
                            mt-1
                            truncate
                        "
                    >
                        {currentScore}
                    </p>
                </div>

                {/* Average Score */}
                <div
                    className="
                        bg-slate-50
                        dark:bg-slate-800
                        rounded-2xl
                        p-4
                        min-w-0
                    "
                >
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Average
                    </p>

                    <p
                        className="
                            text-xl
                            font-bold
                            text-indigo-600
                            dark:text-indigo-400
                            mt-1
                            truncate
                        "
                    >
                        {avgScore}
                    </p>
                </div>

                {/* Goal Gap */}
                <div
                    className={`
                        rounded-2xl
                        p-4
                        min-w-0
                        ${
                            isGoalAchieved
                                ? 'bg-emerald-50 dark:bg-emerald-500/10'
                                : 'bg-rose-50 dark:bg-rose-500/10'
                        }
                    `}
                >
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Goal Gap
                    </p>

                    {isGoalAchieved ? (
                        <p
                            className="
                                mt-1
                                text-lg
                                sm:text-xl
                                font-bold
                                text-emerald-600
                                dark:text-emerald-400
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <FaCheck size={14} />
                            Achieved
                        </p>
                    ) : (
                        <p
                            className="
                                mt-1
                                text-xl
                                font-bold
                                text-rose-600
                                dark:text-rose-400
                            "
                        >
                            +{goalGap}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TargetTracker;
