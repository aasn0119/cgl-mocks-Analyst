import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaCommentDots, FaPaperPlane, FaRegSmile } from 'react-icons/fa';

import { useAuth } from '../contexts/AuthContext';
import { submitFeedback } from '../services/feedbackService';

const CATEGORIES = [
    'General review',
    'Bug report',
    'Feature request',
    'Typing Master',
    'Other',
];

const Feedback = () => {
    const { user } = useAuth();
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [rating, setRating] = useState('5');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmedMessage = message.trim();
        if (trimmedMessage.length < 10) {
            toast.error('Please share at least 10 characters.');
            return;
        }

        setSubmitting(true);
        try {
            await submitFeedback({
                userId: user.uid,
                userName: user.displayName || 'Student',
                userEmail: user.email || '',
                category,
                rating: Number(rating),
                message: trimmedMessage,
            });
            setMessage('');
            setSubmitted(true);
            toast.success('Thanks. Your feedback was sent to the admin.');
        } catch (error) {
            toast.error(error.message || 'Could not send feedback.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-250 space-y-6 pb-10">
            <motion.section
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-950 via-indigo-950 to-cyan-900 p-6 text-white shadow-2xl md:p-9"
            >
                <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="relative max-w-2xl">
                    <div className="flex items-center gap-3 text-cyan-300">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-2xl">
                            <FaCommentDots />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.22em]">
                            Help us improve
                        </span>
                    </div>
                    <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
                        Share your feedback
                    </h1>
                    <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                        Tell the admin what is working, what feels difficult, or
                        what would make your SSC preparation more useful.
                    </p>
                </div>
            </motion.section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <motion.form
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/80"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Category
                            <select
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                            >
                                {CATEGORIES.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </label>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Overall rating
                            <select
                                value={rating}
                                onChange={(event) =>
                                    setRating(event.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                            >
                                {[5, 4, 3, 2, 1].map((value) => (
                                    <option key={value} value={value}>
                                        {'★'.repeat(value)} {value}/5
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Your message
                        <textarea
                            required
                            minLength={10}
                            maxLength={2000}
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="What should we keep, fix, or build next?"
                            className="mt-2 min-h-44 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm normal-case tracking-normal text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-600"
                        />
                        <span className="mt-1 block text-right text-[11px] font-normal normal-case tracking-normal text-slate-400">
                            {message.length}/2000
                        </span>
                    </label>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <FaRegSmile className="text-amber-500" /> Your
                            message is visible to the admin team.
                        </p>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FaPaperPlane />{' '}
                            {submitting ? 'Sending...' : 'Send feedback'}
                        </button>
                    </div>
                    {submitted && (
                        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                            Your feedback has been sent. You can submit another
                            message whenever you like.
                        </p>
                    )}
                </motion.form>

                <aside className="rounded-3xl border border-indigo-100 bg-indigo-50/80 p-5 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                    <h2 className="font-bold text-indigo-950 dark:text-indigo-100">
                        What makes feedback useful?
                    </h2>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-indigo-900/75 dark:text-indigo-100/75">
                        <li>• Name the page or feature involved.</li>
                        <li>• Explain what you expected to happen.</li>
                        <li>
                            • Mention the device or browser if something broke.
                        </li>
                        <li>• Suggest the change that would help you most.</li>
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default Feedback;
