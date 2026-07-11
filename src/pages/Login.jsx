import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    BarChart3,
    TrendingUp,
    Target,
    Lock,
    Percent,
    Hash,
    CheckCircle2,
    PenLine,
    Award,
    BookOpen,
    LineChart,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

// Generates an Archimedean spiral ("r = a + b*theta") as an SVG path string.
// Pure math, computed once — this is what makes the background a real spiral
// rather than a rotated blob.
const generateSpiralPath = ({ turns, points, a, b, cx, cy }) => {
    const total = turns * points;
    let d = '';
    for (let i = 0; i <= total; i += 1) {
        const theta = (i / points) * Math.PI * 2;
        const r = a + b * theta;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        d += i === 0 ? `M ${x},${y}` : ` L ${x.toFixed(2)},${y.toFixed(2)}`;
    }
    return d;
};

const SPIRAL_OUTER = generateSpiralPath({
    turns: 5,
    points: 48,
    a: 4,
    b: 7,
    cx: 250,
    cy: 250,
});
const SPIRAL_INNER = generateSpiralPath({
    turns: 4,
    points: 48,
    a: 2,
    b: 5,
    cx: 250,
    cy: 250,
});

// Exam-world symbols drifting in the background field. Positions are in vw/vh
// percentages so the field scales with viewport; kept clear of the centred card.
const FLOATING_SYMBOLS = [
    {
        Icon: Percent,
        top: '12%',
        left: '10%',
        size: 26,
        duration: 9,
        delay: 0,
        color: '#D9A441',
    },
    {
        Icon: Hash,
        top: '78%',
        left: '14%',
        size: 22,
        duration: 11,
        delay: 1.2,
        color: '#2C4C9E',
    },
    {
        Icon: CheckCircle2,
        top: '18%',
        left: '86%',
        size: 24,
        duration: 10,
        delay: 0.6,
        color: '#33C481',
    },
    {
        Icon: PenLine,
        top: '85%',
        left: '82%',
        size: 22,
        duration: 8,
        delay: 1.8,
        color: '#D9A441',
    },
    {
        Icon: Award,
        top: '8%',
        left: '48%',
        size: 20,
        duration: 12,
        delay: 0.3,
        color: '#2C4C9E',
    },
    {
        Icon: BookOpen,
        top: '92%',
        left: '48%',
        size: 22,
        duration: 10,
        delay: 2.2,
        color: '#D9A441',
    },
    {
        Icon: Target,
        top: '50%',
        left: '6%',
        size: 20,
        duration: 9,
        delay: 1.5,
        color: '#33C481',
    },
    {
        Icon: LineChart,
        top: '46%',
        left: '92%',
        size: 24,
        duration: 11,
        delay: 0.9,
        color: '#2C4C9E',
    },
];

// NOTE: this file uses two extra deps — run:
//   npm install framer-motion lucide-react
// For the display typeface, add this to your index.html <head>:
//   <link rel="preconnect" href="https://fonts.googleapis.com">
//   <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

const QUOTES = [
    'Discipline decides the rank, not luck.',
    'Every mock test is a rehearsal for result day.',
    'Consistency beats intensity.',
    'Your only real competition is yesterday\u2019s you.',
];

const FEATURES = [
    { icon: BarChart3, label: 'Real-time performance tracking' },
    { icon: TrendingUp, label: 'Advanced analytics dashboard' },
    { icon: Trophy, label: 'Competitive leaderboard' },
];

const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
};

const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Login = () => {
    const { login, user } = useAuth();
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setQuoteIndex((i) => (i + 1) % QUOTES.length);
        }, 3800);
        return () => clearInterval(id);
    }, []);

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
            style={{
                background:
                    'radial-gradient(circle at 20% 15%, #24346e 0%, #0b1220 55%, #060a16 100%)',
            }}
        >
            {/* soft base glow, sits under the vortex for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(circle at 50% 50%, rgba(44,76,158,0.25) 0%, transparent 60%)',
                }}
            />

            {/* RANK VORTEX — two counter-rotating spirals, dashes travelling along the arm */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.svg
                    viewBox="0 0 500 500"
                    className="absolute w-[140vmin] h-[140vmin] opacity-40"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 90,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <motion.path
                        d={SPIRAL_OUTER}
                        fill="none"
                        stroke="#D9A441"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeDasharray="4 18"
                        opacity="0.55"
                        animate={{ strokeDashoffset: [0, -440] }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                </motion.svg>
                <motion.svg
                    viewBox="0 0 500 500"
                    className="absolute w-[95vmin] h-[95vmin] opacity-40"
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: 70,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <motion.path
                        d={SPIRAL_INNER}
                        fill="none"
                        stroke="#2C4C9E"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeDasharray="3 14"
                        opacity="0.6"
                        animate={{ strokeDashoffset: [0, 340] }}
                        transition={{
                            duration: 14,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                </motion.svg>
            </div>

            {/* floating exam-world symbols */}
            <div className="absolute inset-0 pointer-events-none">
                {FLOATING_SYMBOLS.map(
                    ({ Icon, top, left, size, duration, delay, color }, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{ top, left }}
                            animate={{
                                y: [0, -14, 0],
                                opacity: [0.12, 0.32, 0.12],
                                rotate: [0, 6, 0],
                            }}
                            transition={{
                                duration,
                                delay,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Icon
                                style={{ width: size, height: size, color }}
                            />
                        </motion.div>
                    )
                )}
            </div>

            {/* CARD */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 w-full max-w-md"
            >
                <div
                    className="backdrop-blur-xl border rounded-3xl p-8 shadow-2xl"
                    style={{
                        background: 'rgba(245,247,252,0.06)',
                        borderColor: 'rgba(217,164,65,0.25)',
                    }}
                >
                    {/* SIGNATURE BADGE */}
                    <motion.div variants={item} className="flex justify-center">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <motion.span
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background:
                                        'conic-gradient(from 0deg, #D9A441, transparent 30%, #D9A441 60%, transparent 90%)',
                                }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            />
                            <div
                                className="absolute inset-[3px] rounded-full flex items-center justify-center"
                                style={{ background: '#0b1220' }}
                            >
                                <Trophy
                                    className="w-6 h-6"
                                    style={{ color: '#D9A441' }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* EYEBROW */}
                    <motion.p
                        variants={item}
                        className="text-center text-xs font-semibold tracking-[0.2em] uppercase mt-4"
                        style={{ color: '#D9A441' }}
                    >
                        🎯 Your Mock Test Command Center
                    </motion.p>

                    {/* HEADER */}
                    <motion.h1
                        variants={item}
                        className="text-3xl font-extrabold text-center mt-2 tracking-tight"
                        style={{
                            fontFamily: "'Sora', sans-serif",
                            color: '#F5F7FC',
                        }}
                    >
                        SSC CGL Analytics
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="text-center mt-3 text-sm"
                        style={{ color: 'rgba(245,247,252,0.7)' }}
                    >
                        Track mock performance, analytics &amp; rankings in one
                        place
                    </motion.p>

                    {/* ROTATING QUOTE */}
                    <motion.div
                        variants={item}
                        className="mt-5 h-10 flex items-center justify-center"
                    >
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={quoteIndex}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.4 }}
                                className="text-center text-sm italic px-4"
                                style={{ color: 'rgba(217,164,65,0.9)' }}
                            >
                                “{QUOTES[quoteIndex]}”
                            </motion.p>
                        </AnimatePresence>
                    </motion.div>

                    {/* FEATURES */}
                    <motion.div variants={item} className="mt-6 space-y-3">
                        {FEATURES.map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 text-sm"
                                style={{ color: 'rgba(245,247,252,0.85)' }}
                            >
                                <span
                                    className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0"
                                    style={{
                                        background: 'rgba(217,164,65,0.12)',
                                    }}
                                >
                                    <Icon
                                        className="w-4 h-4"
                                        style={{ color: '#D9A441' }}
                                    />
                                </span>
                                {label}
                            </div>
                        ))}
                    </motion.div>

                    {/* BUTTON */}
                    <motion.button
                        variants={item}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={login}
                        className="mt-8 w-full flex items-center justify-center gap-3 font-semibold py-3 rounded-2xl shadow-lg transition-shadow hover:shadow-xl cursor-pointer"
                        style={{ background: '#F5F7FC', color: '#0b1220' }}
                    >
                        <FcGoogle className="text-xl" />
                        Sign in with Google
                    </motion.button>

                    {/* FOOTER */}
                    <motion.p
                        variants={item}
                        className="flex items-center justify-center gap-1.5 text-xs mt-6"
                        style={{ color: 'rgba(245,247,252,0.5)' }}
                    >
                        <Lock className="w-3 h-3" />
                        Secure login powered by Google Authentication
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
