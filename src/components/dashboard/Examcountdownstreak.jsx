import { useMemo, useState } from 'react';
import { FaCalendarAlt, FaFire, FaEdit } from 'react-icons/fa';
import { computeWeeklyStreak, daysUntil } from '../../utils/Streaks';

// Purely additive dashboard widget. Exam date is stored per-tier
// in localStorage (no backend/schema change needed) so switching
// tiers shows the right countdown for each exam stage. Parent
// should render this with `key={tier}` so state re-initializes
// cleanly on tier switch instead of syncing via an effect.
const ExamCountdownStreak = ({ mocks, tier, pattern }) => {
    const storageKey = `examDate_${tier}`;
    const [examDate, setExamDate] = useState(
        () => localStorage.getItem(storageKey) || ''
    );
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(examDate);

    const days = useMemo(() => daysUntil(examDate), [examDate]);
    const streak = useMemo(() => computeWeeklyStreak(mocks), [mocks]);

    const saveDate = () => {
        if (draft) {
            localStorage.setItem(storageKey, draft);
            setExamDate(draft);
        } else {
            localStorage.removeItem(storageKey);
            setExamDate('');
        }
        setEditing(false);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* COUNTDOWN CARD */}
            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-100 text-xs font-bold uppercase tracking-wide">
                        <FaCalendarAlt />
                        {pattern.label} Exam Countdown
                    </div>
                    <button
                        onClick={() => {
                            setDraft(examDate);
                            setEditing((e) => !e);
                        }}
                        className="text-indigo-100 hover:text-white transition"
                        title="Set exam date"
                    >
                        <FaEdit size={14} />
                    </button>
                </div>

                {editing ? (
                    <div className="mt-4 flex items-center gap-2">
                        <input
                            type="date"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="rounded-lg px-3 py-2 text-sm text-slate-800 outline-none"
                        />
                        <button
                            onClick={saveDate}
                            className="text-xs font-bold px-3 py-2 rounded-lg bg-white text-indigo-700 hover:bg-indigo-50 transition"
                        >
                            Save
                        </button>
                    </div>
                ) : days === null ? (
                    <div className="mt-3">
                        <p className="text-sm text-indigo-100">
                            No exam date set yet.
                        </p>
                        <button
                            onClick={() => setEditing(true)}
                            className="mt-2 text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 transition"
                        >
                            Set your {pattern.label} exam date
                        </button>
                    </div>
                ) : days >= 0 ? (
                    <div className="mt-3">
                        <p className="text-4xl font-extrabold">
                            {days} day{days === 1 ? '' : 's'}
                        </p>
                        <p className="text-sm text-indigo-100 mt-1">
                            until your {pattern.label} exam (
                            {new Date(examDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                            )
                        </p>
                    </div>
                ) : (
                    <div className="mt-3">
                        <p className="text-lg font-bold">
                            Exam date has passed
                        </p>
                        <p className="text-sm text-indigo-100 mt-1">
                            Update it once your next attempt is scheduled.
                        </p>
                    </div>
                )}
            </div>

            {/* STREAK CARD */}
            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl">
                <div className="flex items-center gap-2 text-orange-100 text-xs font-bold uppercase tracking-wide">
                    <FaFire />
                    Weekly Practice Streak
                </div>

                <div className="mt-3 flex items-end gap-2">
                    <p className="text-4xl font-extrabold">
                        {streak.currentStreak}
                    </p>
                    <p className="text-sm text-orange-100 pb-1">
                        week{streak.currentStreak === 1 ? '' : 's'} in a row
                    </p>
                </div>

                <p className="text-sm text-orange-100 mt-2">
                    {streak.thisWeekCount > 0
                        ? `${streak.thisWeekCount} mock${streak.thisWeekCount === 1 ? '' : 's'} logged this week — keep it up!`
                        : streak.currentStreak > 0
                          ? "You haven't logged a mock this week yet — don't break the streak!"
                          : 'Log a mock this week to start a new streak.'}
                </p>

                {streak.longestStreak > streak.currentStreak && (
                    <p className="text-xs text-orange-100/80 mt-2">
                        Best streak so far: {streak.longestStreak} weeks
                    </p>
                )}
            </div>
        </div>
    );
};

export default ExamCountdownStreak;
