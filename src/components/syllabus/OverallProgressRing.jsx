import { motion } from 'framer-motion';

const OverallProgressRing = ({ percent, size = 140, strokeWidth = 11 }) => {
    const radius = (size - strokeWidth) / 2;

    const circumference = 2 * Math.PI * radius;

    const offset = circumference - (percent / 100) * circumference;

    return (
        <motion.div
            initial={{
                scale: 0.85,
                opacity: 0,
            }}
            animate={{
                scale: 1,
                opacity: 1,
            }}
            transition={{
                duration: 0.5,
            }}
            className="
                relative
                shrink-0
            "
            style={{
                width: size,
                height: size,
            }}
        >
            {/* Glow */}
            <div
                className="
                absolute
                inset-3
                rounded-full
                bg-white/10
                blur-xl
            "
            />

            <svg
                width={size}
                height={size}
                className="
                    relative
                    -rotate-90
                "
            >
                {/* Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-white/15"
                />

                {/* Progress */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="white"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={false}
                    animate={{
                        strokeDashoffset: offset,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 80,
                        damping: 20,
                    }}
                />
            </svg>

            <div
                className="
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
                text-white
            "
            >
                <motion.span
                    key={percent}
                    initial={{
                        scale: 0.7,
                        opacity: 0,
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                    }}
                    className="
                        text-3xl
                        font-black
                    "
                >
                    {percent}%
                </motion.span>

                <span
                    className="
                    text-[10px]
                    text-white/75
                    font-semibold
                    uppercase
                    tracking-wider
                "
                >
                    complete
                </span>
            </div>
        </motion.div>
    );
};

export default OverallProgressRing;
