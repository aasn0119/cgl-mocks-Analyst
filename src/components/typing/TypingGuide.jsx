import { FaBookOpen, FaInfoCircle } from 'react-icons/fa';

const TypingGuide = () => (
    <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900/75">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <FaBookOpen />
            <h2 className="font-bold">How your score is calculated</h2>
        </div>
        <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <Guide
                title="Gross WPM"
                formula="(characters typed / 5) / minutes"
                text="SSC-style typing speed conventionally treats five characters, including spaces, as one word."
            />
            <Guide
                title="Accuracy"
                formula="correct characters / typed characters x 100"
                text="It measures how much of your submitted text matches the supplied passage."
            />
            <Guide
                title="Net WPM"
                formula="gross WPM - (word errors / minutes)"
                text="This practice estimate subtracts one word for each final-text error. Backspaces are not errors by themselves."
            />
            <Guide
                title="What counts as an error"
                text="Omission, substitution, addition, incorrect punctuation or capitalization, wrong spacing, unfinished words, and missing paragraph breaks can affect the final evaluation."
            />
        </div>
        <div className="mt-4 flex gap-2 rounded-xl bg-indigo-50 p-3 text-xs leading-5 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-200">
            <FaInfoCircle className="mt-1 shrink-0" />
            Official notices can define qualifying standards for a specific
            examination and post. Use this lab for disciplined practice, not as
            an official result calculator.
        </div>
    </section>
);

const Guide = ({ title, formula, text }) => (
    <div>
        <p className="font-bold text-slate-800 dark:text-slate-100">
            {title}
            {formula && (
                <code className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-normal text-indigo-600 dark:bg-slate-800 dark:text-indigo-300">
                    {formula}
                </code>
            )}
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {text}
        </p>
    </div>
);

export default TypingGuide;
