import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaCheckCircle, FaKeyboard } from 'react-icons/fa';
import { TYPING_PASSAGES } from '../data/typingPassages';
import TypingControls from '../components/typing/TypingControls';
import TypingGuide from '../components/typing/TypingGuide';
import TypingPassage from '../components/typing/TypingPassage';
import TypingResults from '../components/typing/TypingResults';
import TypingStats from '../components/typing/TypingStats';

const HISTORY_KEY = 'typing-master-history-v2';
const getWords = (value) => value.trim().split(/\s+/).filter(Boolean);
const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

const compareText = (source, typed) => {
    const mismatches = [];
    const limit = Math.max(source.length, typed.length);
    for (let index = 0; index < limit; index += 1) {
        if (source[index] !== typed[index]) {
            const expected = source[index] || '';
            const actual = typed[index] || '';
            let type = 'Substitution';
            if (!actual) type = 'Omission or unfinished text';
            else if (!expected) type = 'Addition';
            else if (expected === ' ' || actual === ' ') type = 'Spacing error';
            else if (
                /[.,!?;:'"()-]/.test(expected) ||
                /[.,!?;:'"()-]/.test(actual)
            )
                type = 'Punctuation error';
            else if (expected.toLowerCase() === actual.toLowerCase())
                type = 'Capitalization error';
            mismatches.push({ position: index + 1, expected, actual, type });
        }
    }
    const sourceWords = getWords(source);
    const typedWords = getWords(typed);
    let wordErrors = 0;
    for (
        let index = 0;
        index < Math.max(sourceWords.length, typedWords.length);
        index += 1
    ) {
        if (sourceWords[index] !== typedWords[index]) wordErrors += 1;
    }
    return {
        mismatches,
        wordErrors,
        typedWords: typedWords.length,
        expectedWords: sourceWords.length,
    };
};

const loadHistory = () => {
    try {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        return Array.isArray(history) ? history : [];
    } catch {
        return [];
    }
};

const TypingMaster = () => {
    const inputRef = useRef(null);
    const [passageId, setPassageId] = useState(TYPING_PASSAGES[0].id);
    const [duration, setDuration] = useState(10);
    const [fontSize, setFontSize] = useState('text-lg');
    const [highlight, setHighlight] = useState(true);
    const [typed, setTyped] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(600);
    const [status, setStatus] = useState('idle');
    const [history, setHistory] = useState(loadHistory);
    const [result, setResult] = useState(null);
    const finishRef = useRef(null);
    const passage =
        TYPING_PASSAGES.find((item) => item.id === passageId) ||
        TYPING_PASSAGES[0];
    const evaluation = useMemo(
        () => compareText(passage.text, typed),
        [passage.text, typed]
    );
    const elapsed = duration * 60 - secondsLeft;
    const grossWpm =
        elapsed > 0 ? Math.round(typed.length / 5 / (elapsed / 60)) : 0;
    const accuracy =
        typed.length > 0
            ? Math.max(
                  0,
                  Math.round(
                      ((typed.length - evaluation.mismatches.length) /
                          typed.length) *
                          100
                  )
              )
            : 100;
    const netWpm = Math.max(
        0,
        grossWpm - evaluation.wordErrors / Math.max(elapsed / 60, 1 / 60)
    );

    const reset = (nextId = passageId) => {
        setPassageId(nextId);
        setTyped('');
        setSecondsLeft(duration * 60);
        setStatus('idle');
        setResult(null);
    };

    const finish = useCallback(() => {
        if (status === 'finished') return;
        const nextResult = {
            id: Date.now(),
            passage: passage.title,
            duration,
            wpm: grossWpm,
            netWpm: Math.round(netWpm),
            accuracy,
            wordErrors: evaluation.wordErrors,
            mismatches: evaluation.mismatches,
        };
        const nextHistory = [nextResult, ...history].slice(0, 8);
        setHistory(nextHistory);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
        setResult(nextResult);
        setStatus('finished');
    }, [
        accuracy,
        duration,
        evaluation.mismatches,
        evaluation.wordErrors,
        grossWpm,
        history,
        netWpm,
        passage.title,
        status,
    ]);

    useEffect(() => {
        finishRef.current = finish;
    }, [finish]);

    useEffect(() => {
        if (status !== 'running') return undefined;
        const timer = window.setInterval(
            () =>
                setSecondsLeft((value) => {
                    if (value <= 1) {
                        window.clearInterval(timer);
                        window.setTimeout(() => finishRef.current?.(), 0);
                        return 0;
                    }
                    return value - 1;
                }),
            1000
        );
        return () => window.clearInterval(timer);
    }, [status]);

    const start = () => {
        inputRef.current?.focus();
    };

    const handleInput = (event) => {
        if (status === 'idle') setStatus('running');
        if (status !== 'finished') setTyped(event.target.value);
    };

    return (
        <div className="mx-auto max-w-400 space-y-6 pb-10">
            <motion.header
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-950 via-indigo-950 to-cyan-900 p-6 text-white shadow-2xl md:p-9"
            >
                <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 text-cyan-300">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-2xl">
                                <FaKeyboard />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-[0.22em]">
                                SSC CGL DEST practice
                            </span>
                        </div>
                        <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                            Typing Master
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                            A calm, focused practice room for building the
                            accuracy and stamina that long SSC passages demand.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                        <FaCheckCircle className="text-emerald-400" /> Final
                        text is reviewed after every session
                    </div>
                </div>
            </motion.header>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
                <div className="space-y-6">
                    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                        <TypingControls
                            duration={duration}
                            setDuration={(value) => {
                                setDuration(value);
                                setSecondsLeft(value * 60);
                            }}
                            fontSize={fontSize}
                            setFontSize={setFontSize}
                            highlight={highlight}
                            setHighlight={setHighlight}
                            status={status}
                            onReset={reset}
                            onStart={start}
                        />
                        <div className="border-b border-slate-200/80 px-5 pb-5 dark:border-slate-800">
                            <TypingStats
                                time={formatTime(secondsLeft)}
                                wpm={grossWpm}
                                accuracy={accuracy}
                                errors={evaluation.wordErrors}
                            />
                        </div>
                        <div className="grid gap-6 p-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                            <div className="space-y-2">
                                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <FaBookOpen className="text-indigo-500" />{' '}
                                    Passage library
                                </p>
                                {TYPING_PASSAGES.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => reset(item.id)}
                                        disabled={status === 'running'}
                                        className={`w-full rounded-2xl border p-3 text-left transition ${passageId === item.id ? 'border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-400 dark:bg-indigo-500/10' : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900/50'} disabled:cursor-not-allowed disabled:opacity-50`}
                                    >
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            {item.difficulty} ·{' '}
                                            {getWords(item.text).length} words
                                        </p>
                                    </button>
                                ))}
                            </div>
                            <div className="min-w-0">
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        {passage.title}
                                    </div>
                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                                        {passage.source}
                                    </span>
                                </div>
                                <div
                                    className={`max-h-135 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-5 font-mono leading-8 text-slate-700 shadow-inner dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300 ${fontSize}`}
                                >
                                    <TypingPassage
                                        text={passage.text}
                                        typed={typed}
                                        highlight={highlight}
                                    />
                                </div>
                                <textarea
                                    ref={inputRef}
                                    value={typed}
                                    onChange={handleInput}
                                    disabled={status === 'finished'}
                                    spellCheck="false"
                                    aria-label="Typing practice input"
                                    placeholder="Start typing the passage here..."
                                    className={`mt-4 min-h-48 w-full resize-y rounded-2xl border-2 border-indigo-200 bg-white p-5 font-mono leading-8 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600 ${fontSize}`}
                                />
                            </div>
                        </div>
                    </section>
                    {result && (
                        <TypingResults result={result} onRetry={reset} />
                    )}
                </div>
                <aside className="space-y-6">
                    <TypingGuide />
                    <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900/75">
                        <h2 className="font-bold text-slate-800 dark:text-slate-100">
                            Recent practice
                        </h2>
                        {history.length === 0 ? (
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Complete a session to build your personal
                                practice record.
                            </p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {history.slice(0, 4).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800"
                                    >
                                        <div>
                                            <p className="max-w-45 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                {item.passage}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {item.duration} min ·{' '}
                                                {item.wordErrors} errors
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-extrabold text-indigo-600 dark:text-indigo-400">
                                                {item.netWpm} net
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {item.accuracy}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default TypingMaster;
