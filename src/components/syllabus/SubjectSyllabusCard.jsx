import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { FaChevronDown, FaCheck } from 'react-icons/fa';

const THEMES = {
    blue: {
        gradient: 'from-blue-500 to-cyan-500',

        light: 'bg-blue-50 dark:bg-blue-500/10',

        text: 'text-blue-600 dark:text-blue-300',

        ring: 'ring-blue-200/60 dark:ring-blue-500/20',

        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    },

    purple: {
        gradient: 'from-purple-500 to-pink-500',

        light: 'bg-purple-50 dark:bg-purple-500/10',

        text: 'text-purple-600 dark:text-purple-300',

        ring: 'ring-purple-200/60 dark:ring-purple-500/20',

        badge: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
    },

    emerald: {
        gradient: 'from-emerald-500 to-green-500',

        light: 'bg-emerald-50 dark:bg-emerald-500/10',

        text: 'text-emerald-600 dark:text-emerald-300',

        ring: 'ring-emerald-200/60 dark:ring-emerald-500/20',

        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    },

    orange: {
        gradient: 'from-orange-500 to-red-500',

        light: 'bg-orange-50 dark:bg-orange-500/10',

        text: 'text-orange-600 dark:text-orange-300',

        ring: 'ring-orange-200/60 dark:ring-orange-500/20',

        badge: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
    },
};

// ─────────────────────────────────────────────────────────────
// TOPIC ROW
// ─────────────────────────────────────────────────────────────

const TopicRow = ({ topic, completed, onToggle }) => {
    return (
        <motion.button
            type="button"
            onClick={() => onToggle(topic.id, !completed)}
            whileHover={{
                x: 3,
            }}
            whileTap={{
                scale: 0.99,
            }}
            className="
                group
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-xl
                text-left
                transition-colors
                hover:bg-slate-50
                dark:hover:bg-slate-800/60
            "
        >
            <motion.span
                animate={{
                    scale: completed ? [1, 1.15, 1] : 1,
                }}
                className={`
                    relative
                    shrink-0
                    w-5
                    h-5
                    rounded-md
                    border-2
                    flex
                    items-center
                    justify-center
                    transition-all
                    ${
                        completed
                            ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/30'
                            : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
                    }
                `}
            >
                <AnimatePresence>
                    {completed && (
                        <motion.span
                            initial={{
                                scale: 0,
                                opacity: 0,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}
                            exit={{
                                scale: 0,
                                opacity: 0,
                            }}
                            className="text-white text-[10px]"
                        >
                            <FaCheck />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.span>

            <span
                className={`
                    text-sm
                    transition-all
                    ${
                        completed
                            ? 'text-slate-400 dark:text-slate-500 line-through'
                            : 'text-slate-700 dark:text-slate-200'
                    }
                `}
            >
                {topic.label}
            </span>

            {completed && (
                <motion.span
                    initial={{
                        opacity: 0,
                        scale: 0.5,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    className="ml-auto text-xs"
                >
                    ✓
                </motion.span>
            )}
        </motion.button>
    );
};

// ─────────────────────────────────────────────────────────────
// CHAPTER
// ─────────────────────────────────────────────────────────────

const Chapter = ({
    chapter,
    completedSet,
    onToggleTopic,
    theme,
    defaultOpen = false,
}) => {
    const [open, setOpen] = useState(defaultOpen);

    const topics = chapter.topics || [];

    const completedCount = topics.filter((topic) =>
        completedSet.has(topic.id)
    ).length;

    const percent = topics.length
        ? Math.round((completedCount / topics.length) * 100)
        : 0;

    const isComplete = topics.length > 0 && completedCount === topics.length;

    return (
        <motion.div
            layout
            className="
                rounded-2xl
                border
                border-slate-200/70
                dark:border-slate-700/60
                overflow-hidden
                bg-white/70
                dark:bg-slate-900/50
            "
        >
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="
                    w-full
                    p-4
                    flex
                    items-center
                    gap-3
                    text-left
                    hover:bg-slate-50
                    dark:hover:bg-slate-800/50
                    transition-colors
                "
            >
                <span
                    className="
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        text-xl
                        bg-slate-100
                        dark:bg-slate-800
                    "
                >
                    {chapter.icon || '📚'}
                </span>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4
                            className="
                            font-bold
                            text-slate-800
                            dark:text-white
                            truncate
                        "
                        >
                            {chapter.label}
                        </h4>

                        {isComplete && (
                            <motion.span
                                initial={{
                                    scale: 0,
                                }}
                                animate={{
                                    scale: 1,
                                }}
                                className="
                                    text-[10px]
                                    font-bold
                                    px-2
                                    py-0.5
                                    rounded-full
                                    bg-emerald-100
                                    text-emerald-700
                                    dark:bg-emerald-500/15
                                    dark:text-emerald-300
                                "
                            >
                                ✓ Complete
                            </motion.span>
                        )}
                    </div>

                    <div
                        className="
                        flex
                        items-center
                        gap-2
                        mt-1
                    "
                    >
                        <span
                            className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                        >
                            {completedCount}/{topics.length}
                        </span>

                        <div
                            className="
                            flex-1
                            max-w-45
                            h-1.5
                            rounded-full
                            bg-slate-200
                            dark:bg-slate-700
                            overflow-hidden
                        "
                        >
                            <motion.div
                                initial={false}
                                animate={{
                                    width: `${percent}%`,
                                }}
                                className={`
                                    h-full
                                    rounded-full
                                    bg-linear-to-r
                                    ${theme.gradient}
                                `}
                            />
                        </div>

                        <span
                            className="
                            text-[10px]
                            font-semibold
                            text-slate-400
                        "
                        >
                            {percent}%
                        </span>
                    </div>
                </div>

                <motion.span
                    animate={{
                        rotate: open ? 180 : 0,
                    }}
                    className="
                        text-slate-400
                        shrink-0
                    "
                >
                    <FaChevronDown size={12} />
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        className="overflow-hidden"
                    >
                        <div
                            className="
                            border-t
                            border-slate-100
                            dark:border-slate-800
                            p-2
                        "
                        >
                            {topics.map((topic) => (
                                <TopicRow
                                    key={topic.id}
                                    topic={topic}
                                    completed={completedSet.has(topic.id)}
                                    onToggle={onToggleTopic}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────
// SUBJECT CARD
// ─────────────────────────────────────────────────────────────

const SubjectSyllabusCard = ({
    subject,
    onToggleTopic,
    defaultOpen = false,
}) => {
    const [open, setOpen] = useState(defaultOpen);

    const theme = THEMES[subject.theme] || THEMES.blue;

    return (
        <motion.div
            layout
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className={`
                rounded-3xl
                bg-white/80
                dark:bg-slate-900/70
                backdrop-blur-xl
                border
                border-slate-200/60
                dark:border-slate-800
                shadow-lg
                ring-1
                ${theme.ring}
                overflow-hidden
            `}
        >
            {/* SUBJECT HEADER */}
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="w-full text-left"
            >
                <div className="p-5">
                    <div
                        className="
                        flex
                        items-center
                        gap-4
                    "
                    >
                        <div
                            className={`
                                w-14
                                h-14
                                rounded-2xl
                                flex
                                items-center
                                justify-center
                                text-3xl
                                ${theme.light}
                            `}
                        >
                            {subject.icon}
                        </div>

                        <div className="flex-1">
                            <div
                                className="
                                flex
                                items-center
                                gap-2
                                flex-wrap
                            "
                            >
                                <h3
                                    className="
                                    text-lg
                                    font-extrabold
                                    text-slate-800
                                    dark:text-white
                                "
                                >
                                    {subject.shortLabel}
                                </h3>

                                {subject.isComplete && (
                                    <span
                                        className="
                                        text-[10px]
                                        font-bold
                                        px-2
                                        py-1
                                        rounded-full
                                        bg-amber-100
                                        text-amber-700
                                        dark:bg-amber-500/15
                                        dark:text-amber-300
                                    "
                                    >
                                        🏆 Mastered
                                    </span>
                                )}
                            </div>

                            <p
                                className="
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                                mt-1
                            "
                            >
                                {subject.completedCount} of {subject.totalCount}{' '}
                                topics completed
                            </p>
                        </div>

                        <div
                            className="
                            text-right
                            shrink-0
                        "
                        >
                            <div
                                className={`
                                text-xl
                                font-extrabold
                                ${theme.text}
                            `}
                            >
                                {subject.percent}%
                            </div>

                            <motion.div
                                animate={{
                                    rotate: open ? 180 : 0,
                                }}
                                className="
                                    mt-1
                                    text-slate-400
                                    flex
                                    justify-end
                                "
                            >
                                <FaChevronDown size={12} />
                            </motion.div>
                        </div>
                    </div>

                    {/* SUBJECT PROGRESS */}
                    <div
                        className="
                        mt-4
                        h-2
                        rounded-full
                        bg-slate-200
                        dark:bg-slate-700
                        overflow-hidden
                    "
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                width: `${subject.percent}%`,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 120,
                                damping: 20,
                            }}
                            className={`
                                h-full
                                rounded-full
                                bg-linear-to-r
                                ${theme.gradient}
                            `}
                        />
                    </div>
                </div>
            </button>

            {/* CHAPTERS */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                        className="overflow-hidden"
                    >
                        <div
                            className="
                            px-4
                            pb-5
                            space-y-3
                        "
                        >
                            {subject.chapters.map((chapter, index) => (
                                <Chapter
                                    key={chapter.id}
                                    chapter={chapter}
                                    completedSet={subject.completedSet}
                                    theme={theme}
                                    defaultOpen={index === 0}
                                    onToggleTopic={(topicId, complete) =>
                                        onToggleTopic(
                                            subject.key,
                                            topicId,
                                            complete
                                        )
                                    }
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SubjectSyllabusCard;
