import { motion } from 'framer-motion';

import { FaListCheck, FaLayerGroup, FaBookOpen } from 'react-icons/fa6';

import useSyllabus from '../hooks/useSyllabus';

import SubjectSyllabusCard from '../components/syllabus/SubjectSyllabusCard';

import OverallProgressRing from '../components/syllabus/OverallProgressRing';

import AchievementBanner from '../components/syllabus/AchievementBanner';

const Syllabus = () => {
    const {
        loading,
        pattern,
        subjectStats,
        overall,
        achievements,
        toggleTopic,
    } = useSyllabus();

    if (loading) {
        return (
            <div
                className="
                min-h-125
                flex
                items-center
                justify-center
            "
            >
                <div
                    className="
                    text-center
                    text-slate-400
                "
                >
                    <motion.div
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="
                            mx-auto
                            mb-4
                            w-10
                            h-10
                            rounded-full
                            border-4
                            border-slate-200
                            border-t-indigo-500
                        "
                    />

                    <p className="text-sm">Loading your syllabus...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="
            space-y-6
            pb-10
        "
        >
            {/* =================================================
                HERO
            ================================================== */}

            <motion.section
                initial={{
                    opacity: 0,
                    y: -15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.4,
                }}
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    bg-linear-to-br
                    from-indigo-600
                    via-blue-600
                    to-cyan-500
                    p-6
                    md:p-8
                    shadow-2xl
                    text-white
                "
            >
                {/* Decorative blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="
                        absolute
                        -right-20
                        -top-20
                        w-72
                        h-72
                        rounded-full
                        bg-white/10
                        blur-sm
                    "
                />

                <motion.div
                    animate={{
                        x: [-10, 10, -10],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="
                        absolute
                        -left-24
                        -bottom-32
                        w-72
                        h-72
                        rounded-full
                        bg-cyan-300/10
                        blur-xl
                    "
                />

                <div
                    className="
                    relative
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    justify-between
                    gap-8
                "
                >
                    {/* Hero text */}
                    <div>
                        <div
                            className="
                            flex
                            items-center
                            gap-3
                            flex-wrap
                        "
                        >
                            <div
                                className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-white/15
                                backdrop-blur
                                flex
                                items-center
                                justify-center
                                text-2xl
                            "
                            >
                                📚
                            </div>

                            <div>
                                <p
                                    className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-widest
                                    text-indigo-100
                                "
                                >
                                    Your Preparation
                                </p>

                                <h1
                                    className="
                                    text-3xl
                                    md:text-4xl
                                    font-black
                                "
                                >
                                    Syllabus Tracker
                                </h1>
                            </div>
                        </div>

                        <p
                            className="
                            mt-4
                            max-w-xl
                            text-sm
                            md:text-base
                            text-indigo-100
                        "
                        >
                            Track your preparation chapter-by-chapter and
                            topic-by-topic. Turn your entire SSC CGL syllabus
                            into a clear roadmap.
                        </p>

                        <div
                            className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                            bg-white/15
                            backdrop-blur
                            text-xs
                            font-bold
                        "
                        >
                            <FaListCheck />

                            {pattern === undefined ? '' : 'SSC CGL'}

                            <span
                                className="
                                opacity-60
                            "
                            >
                                •
                            </span>

                            {pattern === undefined ? '' : 'Tier Tracker'}
                        </div>
                    </div>

                    {/* Ring */}
                    <OverallProgressRing percent={overall.percent} />
                </div>

                {/* Hero stats */}
                <div
                    className="
                    relative
                    mt-8
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    gap-3
                "
                >
                    <HeroStat
                        icon="📖"
                        label="Topics"
                        value={overall.totalTopics}
                        sub={`${overall.totalCompleted} completed`}
                    />

                    <HeroStat
                        icon="📚"
                        label="Chapters"
                        value={overall.totalChapters}
                        sub={`${overall.completedChapters} completed`}
                    />

                    <HeroStat
                        icon="🏆"
                        label="Subjects"
                        value={overall.totalSubjects}
                        sub={`${overall.completedSubjects} mastered`}
                    />

                    <HeroStat
                        icon="⚡"
                        label="Progress"
                        value={`${overall.percent}%`}
                        sub="Keep going!"
                    />
                </div>
            </motion.section>

            {/* =================================================
                ACHIEVEMENT
            ================================================== */}

            <AchievementBanner achievements={achievements} />

            {/* =================================================
                SECTION HEADER
            ================================================== */}

            <div
                className="
                flex
                items-center
                justify-between
                gap-4
            "
            >
                <div>
                    <div
                        className="
                        flex
                        items-center
                        gap-2
                    "
                    >
                        <FaLayerGroup
                            className="
                                text-indigo-500
                            "
                        />

                        <h2
                            className="
                            text-xl
                            font-extrabold
                            text-slate-800
                            dark:text-white
                        "
                        >
                            Your Subjects
                        </h2>
                    </div>

                    <p
                        className="
                        mt-1
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                    "
                    >
                        Expand a subject to explore chapters and topics.
                    </p>
                </div>

                <div
                    className="
                    hidden
                    sm:flex
                    items-center
                    gap-2
                    text-xs
                    text-slate-400
                "
                >
                    <FaBookOpen />
                    {overall.totalCompleted} topics completed
                </div>
            </div>

            {/* =================================================
                SUBJECT GRID
            ================================================== */}

            <div
                className="
                grid
                grid-cols-1
                xl:grid-cols-2
                gap-5
            "
            >
                {subjectStats.map((subject, index) => (
                    <motion.div
                        key={subject.key}
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: index * 0.07,
                            duration: 0.35,
                        }}
                    >
                        <SubjectSyllabusCard
                            subject={subject}
                            onToggleTopic={toggleTopic}
                            defaultOpen={index === 0}
                        />
                    </motion.div>
                ))}
            </div>

            {/* =================================================
                FOOTER MOTIVATION
            ================================================== */}

            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    delay: 0.5,
                }}
                className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    dark:border-slate-800
                    bg-white/70
                    dark:bg-slate-900/60
                    p-5
                    text-center
                "
            >
                <div
                    className="
                    text-2xl
                    mb-2
                "
                >
                    {overall.percent === 100
                        ? '🏆'
                        : overall.percent >= 75
                          ? '🚀'
                          : overall.percent >= 50
                            ? '🔥'
                            : '🌱'}
                </div>

                <h3
                    className="
                    font-bold
                    text-slate-800
                    dark:text-white
                "
                >
                    {overall.percent === 100
                        ? 'You completed the entire syllabus!'
                        : overall.percent >= 75
                          ? 'The finish line is in sight!'
                          : overall.percent >= 50
                            ? 'You are more than halfway there!'
                            : 'Every completed topic moves you forward.'}
                </h3>

                <p
                    className="
                    mt-1
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                "
                >
                    Consistency beats intensity. Keep checking those boxes. 💪
                </p>
            </motion.div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// HERO STAT
// ─────────────────────────────────────────────────────────────

const HeroStat = ({ icon, label, value, sub }) => {
    return (
        <div
            className="
            rounded-2xl
            bg-white/10
            backdrop-blur-md
            border
            border-white/10
            p-3
        "
        >
            <div
                className="
                flex
                items-center
                gap-2
            "
            >
                <span className="text-lg">{icon}</span>

                <span
                    className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    font-bold
                    text-indigo-100
                "
                >
                    {label}
                </span>
            </div>

            <div
                className="
                mt-1
                text-xl
                font-black
            "
            >
                {value}
            </div>

            <div
                className="
                text-[10px]
                text-indigo-100
            "
            >
                {sub}
            </div>
        </div>
    );
};

export default Syllabus;
