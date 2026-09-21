import { FaCheckCircle, FaRedoAlt, FaTimesCircle } from 'react-icons/fa';

const TypingResults = ({ result, onRetry }) => (
    <section className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-xl dark:border-emerald-500/20 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                    Test complete
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-800 dark:text-slate-100">
                    Your correction report
                </h2>
            </div>
            <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
                <FaRedoAlt /> Try again
            </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <ResultStat label="Gross WPM" value={result.wpm} />
            <ResultStat label="Net WPM" value={result.netWpm} />
            <ResultStat label="Accuracy" value={`${result.accuracy}%`} />
            <ResultStat label="Word errors" value={result.wordErrors} />
        </div>
        <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
            <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">
                    Character review
                </h3>
                <span className="text-xs text-slate-500">
                    {result.mismatches.length} mismatch
                    {result.mismatches.length === 1 ? '' : 'es'}
                </span>
            </div>
            {result.mismatches.length === 0 ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                    <FaCheckCircle /> No character mismatches in the typed
                    portion.
                </p>
            ) : (
                <div className="mt-3 max-h-56 space-y-2 overflow-y-auto">
                    {result.mismatches.map((item) => (
                        <div
                            key={item.position}
                            className="flex items-start gap-3 rounded-xl border border-rose-100 bg-white p-3 text-sm dark:border-rose-500/20 dark:bg-slate-900"
                        >
                            <FaTimesCircle className="mt-0.5 shrink-0 text-rose-500" />
                            <div>
                                <p className="font-semibold text-slate-700 dark:text-slate-200">
                                    Position {item.position}: expected{' '}
                                    <Code value={item.expected} />, typed{' '}
                                    <Code value={item.actual} />
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {item.type}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </section>
);

const Code = ({ value }) => (
    <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-rose-600 dark:bg-slate-800 dark:text-rose-300">
        {value === ' ' ? 'space' : value || 'nothing'}
    </code>
);
const ResultStat = ({ label, value }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
            {value}
        </p>
    </div>
);

export default TypingResults;
