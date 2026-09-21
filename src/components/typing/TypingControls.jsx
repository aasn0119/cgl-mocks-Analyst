import { FaFont, FaHighlighter, FaPlay, FaRedoAlt } from 'react-icons/fa';
import { TYPING_DURATIONS } from '../../data/typingPassages';

const TypingControls = ({
    duration,
    setDuration,
    fontSize,
    setFontSize,
    highlight,
    setHighlight,
    status,
    onReset,
    onStart,
}) => (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 p-5 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
                    Test setup
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-800 dark:text-slate-100">
                    Set your practice conditions
                </h2>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                {TYPING_DURATIONS.map((value) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setDuration(value)}
                        disabled={status === 'running'}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${duration === value ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400'} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        {value} minutes
                    </button>
                ))}
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-300">
                <FaFont className="text-indigo-500" /> Text size{' '}
                <select
                    value={fontSize}
                    onChange={(event) => setFontSize(event.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                    <option value="text-sm">Small</option>
                    <option value="text-base">Normal</option>
                    <option value="text-lg">Large</option>
                    <option value="text-xl">Extra large</option>
                </select>
            </label>
            <label className="flex cursor-pointer items-center gap-2 font-semibold text-slate-600 dark:text-slate-300">
                <input
                    type="checkbox"
                    checked={highlight}
                    onChange={(event) => setHighlight(event.target.checked)}
                    className="h-4 w-4 accent-indigo-600"
                />
                <FaHighlighter className="text-amber-500" /> Highlight character
                matches
            </label>
            <div className="ml-auto flex gap-2">
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300"
                >
                    <FaRedoAlt /> Reset
                </button>
                {status === 'idle' && (
                    <button
                        type="button"
                        onClick={onStart}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700"
                    >
                        <FaPlay /> Start typing
                    </button>
                )}
            </div>
        </div>
    </div>
);

export default TypingControls;
