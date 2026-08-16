// ─────────────────────────────────────────────────────────────
// Streak utilities
// Computes a "weekly consistency streak" — the number of
// consecutive ISO weeks (Mon–Sun) in which the student logged
// at least one mock. This is more meaningful for mock-taking
// cadence than a daily streak, since most students don't take
// a mock every single day.
// ─────────────────────────────────────────────────────────────

// Returns a Monday-anchored week key like "2026-W33" for a date.
const getWeekKey = (date) => {
    const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    // ISO: Monday = 1 ... Sunday = 7
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 1 - day);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

// Monday of the week containing `date`, normalized to midnight UTC.
const getWeekStart = (date) => {
    const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 1 - day);
    return d;
};

/**
 * @param {Array} mocks - mocks for the current tier (any order)
 * @returns {{ currentStreak: number, longestStreak: number, thisWeekCount: number, activeThisWeek: boolean }}
 */
export const computeWeeklyStreak = (mocks) => {
    if (!Array.isArray(mocks) || mocks.length === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            thisWeekCount: 0,
            activeThisWeek: false,
        };
    }

    const weekStarts = [
        ...new Set(mocks.map((m) => getWeekStart(new Date(m.date)).getTime())),
    ].sort((a, b) => a - b);

    // Longest run of consecutive weeks (gap of exactly 7 days)
    let longestStreak = 1;
    let run = 1;
    for (let i = 1; i < weekStarts.length; i++) {
        const gapDays = (weekStarts[i] - weekStarts[i - 1]) / 86400000;
        if (gapDays === 7) {
            run += 1;
        } else {
            run = 1;
        }
        longestStreak = Math.max(longestStreak, run);
    }

    // Current streak: walk backward from the most recent active week,
    // but only counts as "live" if that week is this week or last week
    // (otherwise the streak has already lapsed).
    const today = new Date();
    const thisWeekStart = getWeekStart(today).getTime();
    const lastWeekStart = thisWeekStart - 7 * 86400000;

    const mostRecentWeek = weekStarts[weekStarts.length - 1];
    let currentStreak = 0;

    if (mostRecentWeek === thisWeekStart || mostRecentWeek === lastWeekStart) {
        currentStreak = 1;
        for (let i = weekStarts.length - 1; i > 0; i--) {
            const gapDays = (weekStarts[i] - weekStarts[i - 1]) / 86400000;
            if (gapDays === 7) {
                currentStreak += 1;
            } else {
                break;
            }
        }
    }

    const thisWeekKey = getWeekKey(today);
    const thisWeekCount = mocks.filter(
        (m) => getWeekKey(new Date(m.date)) === thisWeekKey
    ).length;

    return {
        currentStreak,
        longestStreak,
        thisWeekCount,
        activeThisWeek: mostRecentWeek === thisWeekStart,
    };
};

/**
 * Days remaining until a target exam date. Returns null if no
 * target date is set, negative if the date has already passed.
 */
export const daysUntil = (targetDateStr) => {
    if (!targetDateStr) return null;
    const target = new Date(targetDateStr);
    const today = new Date();
    const targetUTC = Date.UTC(
        target.getFullYear(),
        target.getMonth(),
        target.getDate()
    );
    const todayUTC = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    return Math.round((targetUTC - todayUTC) / 86400000);
};
