import { getPattern } from '../config/examPatterns';

// ─────────────────────────────────────────────────────────────
// AI Insights Engine
// A deterministic, rule-based analyzer that studies a student's
// mock history and produces subject-wise focus areas, trend
// analysis, and actionable improvement guidance.
// No external API calls — everything is computed from the data
// already present in Firestore, so it works instantly and free.
//
// Tier-aware: subject max marks (and therefore mastery %, status
// tiers, and priority scoring) come from the exam pattern config,
// so the same engine works for Tier 1 (50 marks/subject) and
// Tier 2 Paper I (90/90/135/75 marks) without duplication.
// ─────────────────────────────────────────────────────────────

const SUBJECT_KEY_TO_SHORT_LABEL = {
    englishScore: 'English',
    reasoningScore: 'Reasoning',
    quantScore: 'Quant',
    gkScore: 'GK',
};

// Tiered, subject-specific study guidance. Tier is chosen based on
// how strong the student currently is in that subject.
const TIPS = {
    English: {
        weak: [
            'Build a daily habit of learning 10–15 new words with usage in sentences.',
            'Revise core grammar rules — tense consistency, subject-verb agreement, and articles.',
            'Read one editorial or short passage daily to build reading speed and comprehension.',
        ],
        moderate: [
            'Practice timed cloze tests and error-spotting sets to sharpen accuracy.',
            'Build a running list of idioms, phrases, and one-word substitutions to revise weekly.',
            'Attempt sectional English mocks under strict time limits to build exam temperament.',
        ],
        strong: [
            'Focus on speed — aim to clear the section in well under the allotted time.',
            'Target zero-error attempts by re-checking grammar-heavy questions first.',
            'Take full-length sectional tests from varied platforms to avoid pattern familiarity bias.',
        ],
    },
    Reasoning: {
        weak: [
            'Practice basic series, analogy, and classification questions daily to build pattern recognition.',
            'Learn shortcut tricks for coding-decoding and blood relation problems.',
            'Revisit fundamentals of syllogism and Venn diagrams with worked examples.',
        ],
        moderate: [
            'Do timed puzzle sets — seating arrangement, floor puzzles, and box puzzles.',
            'Practice non-verbal reasoning (mirror/water images, paper folding) regularly.',
            'Track average time per puzzle and work on cutting it down without losing accuracy.',
        ],
        strong: [
            'Attempt high-difficulty puzzle sets to stay sharp under exam-level complexity.',
            'Focus on reducing silly mistakes rather than learning new concepts.',
            'Simulate exam pressure with full-length timed reasoning sections.',
        ],
    },
    Quant: {
        weak: [
            'Revise basic arithmetic — percentages, ratios, profit & loss, averages — from scratch.',
            'Memorize tables up to 30, squares up to 30, and cubes up to 20 for faster calculation.',
            'Solve NCERT-level problems before moving to advanced-level questions.',
        ],
        moderate: [
            'Work through advanced maths topics (algebra, geometry, trigonometry) one at a time.',
            'Take topic-wise timed tests to identify which chapters still slow you down.',
            'Learn 2–3 shortcut/alternate methods per topic to cut calculation time.',
        ],
        strong: [
            'Attempt mixed-difficulty full-length mocks to simulate real exam variety.',
            'Push for calculation speed — practice mental math drills daily.',
            'Review your last few mocks for the specific question types causing occasional slips.',
        ],
    },
    GK: {
        weak: [
            'Start a daily current affairs habit covering the last 6 months of news.',
            'Build static GK fundamentals — Indian history, polity, and geography basics.',
            'Use short daily quizzes to reinforce retention instead of long reading sessions.',
        ],
        moderate: [
            'Go through monthly current affairs compilations and revise them weekly.',
            'Strengthen static GK topic-wise — science, economy, and important schemes.',
            'Attempt sectional GK mocks to identify recurring gap areas.',
        ],
        strong: [
            'Focus revision on the most recent 1–2 months of current affairs before each mock.',
            'Use rapid-fire quizzes to maintain recall speed under time pressure.',
            'Skim through award/scheme/appointment updates weekly — a common scoring area.',
        ],
    },
};

const num = (v) => Number(v || 0);

const average = (arr) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const stdDev = (arr) => {
    if (arr.length < 2) return 0;
    const avg = average(arr);
    const variance = average(arr.map((v) => (v - avg) ** 2));
    return Math.sqrt(variance);
};

// Simple slope-based trend: compares the average of the most recent
// mocks against the average of the earlier ones.
const getTrend = (scores) => {
    if (scores.length < 2) return { label: 'steady', delta: 0 };

    const recentCount = Math.max(1, Math.min(3, Math.floor(scores.length / 2)));
    const recent = scores.slice(-recentCount);
    const earlier = scores.slice(0, scores.length - recentCount);

    const recentAvg = average(recent);
    const earlierAvg = average(earlier.length ? earlier : recent);
    const delta = recentAvg - earlierAvg;

    if (delta > 2) return { label: 'improving', delta };
    if (delta < -2) return { label: 'declining', delta };
    return { label: 'steady', delta };
};

const statusForPercent = (pct) => {
    if (pct < 50) return { tier: 'weak', label: 'Needs Focus', color: 'red' };
    if (pct < 75)
        return { tier: 'moderate', label: 'Building Up', color: 'amber' };
    return { tier: 'strong', label: 'Strong', color: 'teal' };
};

/**
 * Analyzes a student's mock history and returns structured,
 * subject-wise AI insights.
 *
 * @param {Array} mocks - array of mock objects for a single student
 *   (should already be filtered to the tier being analyzed)
 * @param {string} tier - 'tier1' | 'tier2', determines subject
 *   labels and max marks used for mastery %, priority, and tips
 * @returns {Object|null} insights payload, or null if not enough data
 */
export const generateAIInsights = (mocks, tier = 'tier1') => {
    if (!Array.isArray(mocks) || mocks.length === 0) return null;

    const pattern = getPattern(tier);

    // Build subject meta (key + max marks) straight from the
    // active exam pattern, keyed by the same short labels the
    // TIPS knowledge base uses (English / Reasoning / Quant / GK).
    const subjectMeta = {};
    pattern.subjects.forEach((s) => {
        const shortLabel = SUBJECT_KEY_TO_SHORT_LABEL[s.key] || s.shortLabel;
        subjectMeta[shortLabel] = {
            key: s.key,
            max: s.max,
            fullLabel: s.label,
        };
    });

    const sorted = [...mocks].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    const subjectInsights = Object.entries(subjectMeta).map(
        ([subject, meta]) => {
            const scores = sorted.map((m) => num(m[meta.key]));
            const avg = average(scores);
            const best = Math.max(...scores);
            const worst = Math.min(...scores);
            const pctOfMax = (avg / meta.max) * 100;
            const trend = getTrend(scores);
            const volatility = stdDev(scores);
            const status = statusForPercent(pctOfMax);

            // Priority score: lower percent score = higher priority.
            // Declining subjects get bumped up; strongly improving
            // subjects get a small priority discount since the
            // student is already course-correcting on their own.
            let priority = 100 - pctOfMax;
            if (trend.label === 'declining') priority += 15;
            if (trend.label === 'improving') priority -= 8;

            return {
                subject,
                label: meta.fullLabel,
                max: meta.max,
                avg: Number(avg.toFixed(1)),
                best,
                worst,
                pctOfMax: Number(pctOfMax.toFixed(1)),
                trend: trend.label,
                trendDelta: Number(trend.delta.toFixed(1)),
                volatility: Number(volatility.toFixed(1)),
                status,
                priority,
                tips: TIPS[subject][status.tier],
            };
        }
    );

    const rankedByPriority = [...subjectInsights].sort(
        (a, b) => b.priority - a.priority
    );

    const primaryFocus = rankedByPriority[0];
    const secondaryFocus = rankedByPriority[1];

    const strongestSubject = [...subjectInsights].sort(
        (a, b) => b.pctOfMax - a.pctOfMax
    )[0];

    const mostImproved = [...subjectInsights].sort(
        (a, b) => b.trendDelta - a.trendDelta
    )[0];

    // ── Overall / cross-cutting insights ──────────────────────
    const totalScores = sorted.map((m) => num(m.totalScore));
    const accuracyScores = sorted.map((m) => num(m.accuracy));
    const overallTrend = getTrend(totalScores);
    const scoreVolatility = stdDev(totalScores);
    const avgAccuracy = average(accuracyScores);

    const generalInsights = [];

    if (avgAccuracy > 0 && avgAccuracy < 75) {
        generalInsights.push({
            type: 'warning',
            text: `Average accuracy is ${avgAccuracy.toFixed(1)}%. With negative marking, aim to push this above 80% by attempting only questions you're confident about.`,
        });
    }

    if (scoreVolatility > 15 && sorted.length >= 4) {
        generalInsights.push({
            type: 'warning',
            text: `Total scores are fluctuating a fair amount (±${scoreVolatility.toFixed(1)} marks). Work on exam-day consistency — a fixed section order and time budget per section can help.`,
        });
    }

    if (overallTrend.label === 'improving') {
        generalInsights.push({
            type: 'positive',
            text: `Overall score trend is improving (+${overallTrend.delta.toFixed(1)} in recent mocks). Keep the current routine going.`,
        });
    } else if (overallTrend.label === 'declining') {
        generalInsights.push({
            type: 'warning',
            text: `Overall score has dipped recently (${overallTrend.delta.toFixed(1)} in recent mocks). Consider revisiting fundamentals in ${primaryFocus.subject} before the next attempt.`,
        });
    }

    if (mostImproved.trendDelta > 2) {
        generalInsights.push({
            type: 'positive',
            text: `${mostImproved.subject} shows the strongest improvement recently (+${mostImproved.trendDelta} marks) — whatever you changed there is working.`,
        });
    }

    const headline =
        sorted.length < 3
            ? `Based on ${sorted.length} mock${sorted.length > 1 ? 's' : ''} so far, ${primaryFocus.subject} looks like the area to prioritize — add a few more mocks for sharper trend analysis.`
            : `${primaryFocus.subject} is your highest-priority focus area right now, followed by ${secondaryFocus.subject}. ${strongestSubject.subject} is currently your strongest section.`;

    return {
        headline,
        primaryFocus,
        secondaryFocus,
        strongestSubject,
        mostImproved,
        subjectInsights,
        generalInsights,
        meta: {
            totalMocks: sorted.length,
            avgAccuracy: Number(avgAccuracy.toFixed(1)),
            overallTrend: overallTrend.label,
        },
    };
};
