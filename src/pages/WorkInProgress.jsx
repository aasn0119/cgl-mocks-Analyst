import { useEffect, useState } from 'react';

const WorkInProgress = ({
    title = 'Work in Progress',
    subtitle = 'This section is being actively built',
    showLoader = true,
}) => {
    const [dots, setDots] = useState('');

    // animated dots effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((d) => (d.length >= 3 ? '' : d + '.'));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div
                className="
                    relative
                    w-full max-w-2xl
                    rounded-3xl
                    p-10
                    text-center
                    overflow-hidden
                    border border-slate-200/60 dark:border-slate-800
                    bg-gradient-to-br from-white via-slate-50 to-slate-100
                    dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
                    shadow-2xl
                "
            >
                {/* glowing background effect */}
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-400/20 blur-3xl rounded-full animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />

                {/* ICON */}
                <div className="relative z-10">
                    <div className="text-6xl mb-4 animate-bounce">🚧</div>

                    {/* TITLE */}
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
                        {title}
                    </h1>

                    {/* SUBTITLE */}
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        {subtitle}
                        {dots}
                    </p>

                    {/* LOADER */}
                    {showLoader && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-2">
                                <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
                                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:150ms]" />
                                <span className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce [animation-delay:300ms]" />
                            </div>
                        </div>
                    )}

                    {/* PROGRESS SKELETON CARD */}
                    <div className="mt-10 space-y-3">
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full w-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 animate-pulse" />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                                />
                            ))}
                        </div>
                    </div>

                    {/* FOOT NOTE */}
                    <p className="mt-8 text-xs text-slate-500">
                        We’re actively building this feature. It will be
                        available soon.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WorkInProgress;
