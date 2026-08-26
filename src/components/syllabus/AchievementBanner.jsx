import { motion, AnimatePresence } from 'framer-motion';

const AchievementBanner = ({ achievements = [] }) => {
    const latest = achievements[achievements.length - 1];

    if (!latest) {
        return (
            <motion.div
                initial={{
                    opacity: 0,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    dark:border-slate-800
                    bg-white/70
                    dark:bg-slate-900/60
                    p-4
                "
            >
                <div
                    className="
                    flex
                    items-center
                    gap-3
                "
                >
                    <span className="text-2xl">🌱</span>

                    <div>
                        <p
                            className="
                            font-bold
                            text-slate-800
                            dark:text-white
                        "
                        >
                            Your journey starts here
                        </p>

                        <p
                            className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                        >
                            Complete your first topic to unlock your first
                            achievement.
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={latest.id}
                initial={{
                    opacity: 0,
                    scale: 0.96,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.3,
                }}
                className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-amber-200/70
                    dark:border-amber-500/20
                    bg-gradient-to-r
                    from-amber-50
                    via-yellow-50
                    to-orange-50
                    dark:from-amber-500/10
                    dark:via-yellow-500/5
                    dark:to-orange-500/10
                    p-4
                "
            >
                <motion.div
                    animate={{
                        x: ['0%', '100%'],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 5,
                    }}
                    className="
                        absolute
                        inset-y-0
                        w-24
                        bg-white/20
                        blur-xl
                        -skew-x-12
                    "
                />

                <div
                    className="
                    relative
                    flex
                    items-center
                    gap-4
                "
                >
                    <motion.div
                        animate={{
                            rotate: [-5, 5, -5],
                            scale: [1, 1.08, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                        className="
                            w-12
                            h-12
                            rounded-xl
                            bg-white
                            dark:bg-slate-900
                            shadow-sm
                            flex
                            items-center
                            justify-center
                            text-2xl
                        "
                    >
                        {latest.icon}
                    </motion.div>

                    <div>
                        <p
                            className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-widest
                            text-amber-600
                            dark:text-amber-300
                        "
                        >
                            Achievement Unlocked
                        </p>

                        <h3
                            className="
                            font-extrabold
                            text-slate-800
                            dark:text-white
                        "
                        >
                            {latest.title}
                        </h3>

                        <p
                            className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                        >
                            {latest.description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AchievementBanner;
