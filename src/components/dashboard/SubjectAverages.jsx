const SubjectAverages = ({ subjectAverages }) => {
    const MAX_SCORE = 50;

    const colors = [
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-emerald-500 to-green-500',
        'from-orange-500 to-red-500',
    ];

    const icons = {
        Quant: '🔢',
        Reasoning: '🧠',
        English: '📖',
        GK: '🌍',
    };

    const sorted = [...subjectAverages].sort((a, b) => b.score - a.score);

    const best = sorted[0]?.subject;
    const worst = sorted[sorted.length - 1]?.subject;

    return (
        <div
            className="
            bg-white dark:bg-slate-900
            rounded-3xl p-6
            shadow-lg border border-slate-200/50 dark:border-slate-700/40
        "
        >
            {/* HEADER */}
            <div className="mb-6">
                <h2
                    className="
                    text-2xl font-bold
                    bg-gradient-to-r from-indigo-500 to-cyan-500
                    bg-clip-text text-transparent
                "
                >
                    📚 Subject Intelligence
                </h2>

                <p className="text-slate-500 mt-1">
                    Out of {MAX_SCORE} marks per subject
                </p>

                {/* INSIGHTS */}
                <div className="flex gap-3 mt-3 text-xs">
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
                        🟢 Best: {best}
                    </span>

                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-600">
                        🔴 Weak: {worst}
                    </span>
                </div>
            </div>

            {/* GRID */}
            <div
                className="
                grid grid-cols-1
                md:grid-cols-2
                xl:grid-cols-4
                gap-5
            "
            >
                {subjectAverages.map((subject, index) => {
                    const percent = (subject.score / MAX_SCORE) * 100;

                    return (
                        <div
                            key={subject.subject}
                            className="
                                relative p-5 rounded-2xl
                                bg-gradient-to-br from-white to-slate-50
                                dark:from-slate-800 dark:to-slate-900
                                border border-slate-200/50 dark:border-slate-700/40
                                shadow-md
                                hover:shadow-xl hover:scale-[1.03]
                                transition-all duration-300
                                overflow-hidden
                            "
                        >
                            {/* TOP ROW */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">
                                        {icons[subject.subject]}
                                    </span>

                                    <h3 className="font-bold text-slate-800 dark:text-white">
                                        {subject.subject}
                                    </h3>
                                </div>

                                <span
                                    className="
                                    text-xs font-bold px-2 py-1 rounded-full
                                    bg-indigo-100 text-indigo-700
                                    dark:bg-indigo-900 dark:text-indigo-200
                                "
                                >
                                    {subject.score}/{MAX_SCORE}
                                </span>
                            </div>

                            {/* PROGRESS BAR */}
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`
                                        h-full bg-gradient-to-r ${colors[index]}
                                        transition-all duration-700
                                    `}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>

                            {/* FOOT NOTE */}
                            <div className="mt-3 text-xs text-slate-400 flex justify-between">
                                <span>0</span>
                                <span>
                                    {subject.score} / {MAX_SCORE}
                                </span>
                                <span>{percent.toFixed(0)}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SubjectAverages;
