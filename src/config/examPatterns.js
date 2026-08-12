// ─────────────────────────────────────────────────────────────
// SSC CGL Exam Patterns
// Single source of truth for how Tier 1 and Tier 2 (Paper I)
// are structured — subjects, max marks per subject, total max,
// and readiness targets. Every page/hook/chart that needs to
// know "what subject, what max marks" reads from here so
// switching tiers cascades consistently through the whole app.
//
// Internally we keep reusing the same 4 score fields
// (englishScore / reasoningScore / quantScore / gkScore) for
// both tiers — Tier 2 Paper I maps onto the same 4 conceptual
// areas (Maths, Reasoning, English, GA), just with different
// max marks and weightage. This keeps the Firestore schema
// simple while letting the UI fully re-label/re-scale itself.
// ─────────────────────────────────────────────────────────────

export const TIERS = {
    tier1: 'tier1',
    tier2: 'tier2',
};

export const EXAM_PATTERNS = {
    tier1: {
        id: 'tier1',
        label: 'Tier 1',
        fullName: 'SSC CGL Tier 1',
        description: 'Qualifying stage — 4 sections, 200 marks, 60 minutes.',
        totalMax: 200,
        maxQuestions: 100,
        maxTimeMinutes: 60,
        // Readiness thresholds are score-based (out of totalMax)
        targetScore: 160,
        readinessThresholds: [
            { min: 160, label: 'Exam Ready', color: 'teal' },
            { min: 140, label: 'Competitive', color: 'blue' },
            { min: 120, label: 'Improving', color: 'amber' },
            { min: 0, label: 'Needs Work', color: 'red' },
        ],
        subjects: [
            {
                key: 'quantScore',
                label: 'Quant',
                shortLabel: 'Quant',
                max: 50,
                icon: '🔢',
            },
            {
                key: 'reasoningScore',
                label: 'Reasoning',
                shortLabel: 'Reasoning',
                max: 50,
                icon: '🧠',
            },
            {
                key: 'englishScore',
                label: 'English',
                shortLabel: 'English',
                max: 50,
                icon: '📖',
            },
            {
                key: 'gkScore',
                label: 'General Awareness',
                shortLabel: 'GK',
                max: 50,
                icon: '🌍',
            },
        ],
    },
    tier2: {
        id: 'tier2',
        label: 'Tier 2',
        fullName: 'SSC CGL Tier 2 (Paper I)',
        description:
            'Scoring stage — Paper I, 390 scored marks across 4 areas.',
        totalMax: 390,
        maxQuestions: 130,
        maxTimeMinutes: 150,
        targetScore: 310,
        readinessThresholds: [
            { min: 310, label: 'Exam Ready', color: 'teal' },
            { min: 270, label: 'Competitive', color: 'blue' },
            { min: 230, label: 'Improving', color: 'amber' },
            { min: 0, label: 'Needs Work', color: 'red' },
        ],
        subjects: [
            {
                key: 'quantScore',
                label: 'Mathematical Abilities',
                shortLabel: 'Quant',
                max: 90,
                icon: '🔢',
            },
            {
                key: 'reasoningScore',
                label: 'Reasoning & General Intelligence',
                shortLabel: 'Reasoning',
                max: 90,
                icon: '🧠',
            },
            {
                key: 'englishScore',
                label: 'English Language & Comprehension',
                shortLabel: 'English',
                max: 135,
                icon: '📖',
            },
            {
                key: 'gkScore',
                label: 'General Awareness',
                shortLabel: 'GK',
                max: 75,
                icon: '🌍',
            },
        ],
    },
};

export const getPattern = (tier) => EXAM_PATTERNS[tier] || EXAM_PATTERNS.tier1;

// Mocks saved before tier-tracking existed have no `tier` field —
// treat those as Tier 1 for backward compatibility.
export const getMockTier = (mock) => mock?.tier || TIERS.tier1;

export const filterByTier = (mocks, tier) =>
    (mocks || []).filter((m) => getMockTier(m) === tier);

export const getReadiness = (avgScore, tier) => {
    const pattern = getPattern(tier);
    const match = pattern.readinessThresholds.find((t) => avgScore >= t.min);
    return (
        match ||
        pattern.readinessThresholds[pattern.readinessThresholds.length - 1]
    );
};
