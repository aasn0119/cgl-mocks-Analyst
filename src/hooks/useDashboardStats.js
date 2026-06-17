import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const TARGET_SCORE = 160;

export default function useDashboardStats(userId = null) {
    const { user } = useAuth();

    const targetUid = userId || user?.uid;

    const [mocks, setMocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!targetUid) {
            setMocks([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'mocks'),
            where('userId', '==', targetUid)
        );

        const unsub = onSnapshot(q, (snap) => {
            setMocks(
                snap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );

            setLoading(false);
        });

        return () => unsub();
    }, [targetUid]);

    /* ── aggregate stats ── */
    const stats = useMemo(() => {
        const empty = {
            totalMocks: 0,
            avgScore: 0,
            bestScore: 0,
            currentScore: 0,
            avgAccuracy: 0,
            avgPercentile: 0,
            improvement: '+0.00',
            currentStreak: 0,
            bestStreak: 0,
            goalGap: TARGET_SCORE,
            progressPercent: 0,
            readiness: 'Needs Work',
            predictedScore: 0,
        };
        if (!mocks.length) return empty;

        const sorted = [...mocks].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
        const n = sorted.length;

        const avgScore =
            sorted.reduce((s, m) => s + Number(m.totalScore || 0), 0) / n;
        const avgAccuracy =
            sorted.reduce((s, m) => s + Number(m.accuracy || 0), 0) / n;
        const avgPercentile =
            sorted.reduce((s, m) => s + Number(m.percentile || 0), 0) / n;
        const bestScore = Math.max(
            ...sorted.map((m) => Number(m.totalScore || 0))
        );
        const currentScore = Number(sorted[n - 1]?.totalScore || 0);
        const firstScore = Number(sorted[0]?.totalScore || 0);

        const improvementRaw =
            firstScore > 0
                ? ((currentScore - firstScore) / firstScore) * 100
                : 0;
        const improvement = `${improvementRaw >= 0 ? '+' : ''}${improvementRaw.toFixed(2)}`;

        const goalGap = TARGET_SCORE - currentScore;
        const progressPercent = Math.min(
            (currentScore / TARGET_SCORE) * 100,
            100
        );

        const readiness =
            avgScore >= 160
                ? 'Exam Ready'
                : avgScore >= 140
                  ? 'Competitive'
                  : avgScore >= 120
                    ? 'Improving'
                    : 'Needs Work';

        const lastFive = sorted.slice(-5);
        let predictedScore = currentScore;
        if (lastFive.length >= 2) {
            const growth =
                (Number(lastFive[lastFive.length - 1].totalScore) -
                    Number(lastFive[0].totalScore)) /
                (lastFive.length - 1);
            predictedScore = currentScore + growth;
        }

        const streaks = calculateStreaks(sorted);

        return {
            totalMocks: n,
            avgScore: avgScore.toFixed(2),
            bestScore,
            currentScore,
            avgAccuracy: avgAccuracy.toFixed(2),
            avgPercentile: avgPercentile.toFixed(2),
            improvement,
            currentStreak: streaks.current,
            bestStreak: streaks.best,
            goalGap: goalGap.toFixed(2),
            progressPercent: progressPercent.toFixed(1),
            readiness,
            predictedScore: predictedScore.toFixed(1),
        };
    }, [mocks]);

    /* ── per-subject averages (FIXED — each subject uses its own scores) ── */
    const subjectAverages = useMemo(() => {
        if (!mocks.length) return [];
        const n = mocks.length;
        const quant =
            mocks.reduce((s, m) => s + Number(m.quantScore || 0), 0) / n;
        const reasoning =
            mocks.reduce((s, m) => s + Number(m.reasoningScore || 0), 0) / n;
        const english =
            mocks.reduce((s, m) => s + Number(m.englishScore || 0), 0) / n;
        const gk = mocks.reduce((s, m) => s + Number(m.gkScore || 0), 0) / n;
        return [
            { subject: 'Quant', score: quant.toFixed(1) },
            { subject: 'Reasoning', score: reasoning.toFixed(1) },
            { subject: 'English', score: english.toFixed(1) },
            { subject: 'GK', score: gk.toFixed(1) },
        ];
    }, [mocks]);

    /* ── chart data (score / accuracy / percentile over time) ── */
    const chartData = useMemo(
        () =>
            [...mocks]
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((m, i) => ({
                    attempt: i + 1,
                    date: m.date,
                    score: Number(m.totalScore || 0),
                    accuracy: Number(m.accuracy || 0),
                    percentile: Number(m.percentile || 0),
                    rank: m.rank,
                })),
        [mocks]
    );

    /* ── subject trend over time ── */
    const subjectTrend = useMemo(
        () =>
            [...mocks]
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((m, i) => ({
                    attempt: i + 1,
                    date: m.date,
                    platform: m.platform,
                    quant: Number(m.quantScore || 0),
                    reasoning: Number(m.reasoningScore || 0),
                    english: Number(m.englishScore || 0),
                    gk: Number(m.gkScore || 0),
                })),
        [mocks]
    );

    /* ── weekly / monthly mini-reports ── */
    const weeklyReport = useMemo(() => {
        const weekMocks = mocks.filter(
            (m) => (Date.now() - new Date(m.date)) / 864e5 <= 7
        );
        return buildReport(weekMocks);
    }, [mocks]);

    const monthlyReport = useMemo(() => {
        const monthMocks = mocks.filter(
            (m) => (Date.now() - new Date(m.date)) / 864e5 <= 30
        );
        return buildReport(monthMocks);
    }, [mocks]);

    return {
        loading,
        mocks,
        stats,
        chartData,
        subjectAverages,
        subjectTrend,
        weeklyReport,
        monthlyReport,
        TARGET_SCORE,
    };
}

/* ── helpers ── */

function buildReport(data) {
    if (!data.length) return { mocks: 0, avgScore: 0, avgAccuracy: 0 };
    return {
        mocks: data.length,
        avgScore: (
            data.reduce((s, m) => s + Number(m.totalScore || 0), 0) /
            data.length
        ).toFixed(2),
        avgAccuracy: (
            data.reduce((s, m) => s + Number(m.accuracy || 0), 0) / data.length
        ).toFixed(2),
    };
}

function calculateStreaks(sorted) {
    if (!sorted.length) return { current: 0, best: 0 };
    const dates = sorted.map((m) => new Date(m.date).toDateString());
    let best = 1,
        current = 1;
    for (let i = 1; i < dates.length; i++) {
        const diff = (new Date(dates[i]) - new Date(dates[i - 1])) / 864e5;
        if (diff === 1) {
            current++;
            best = Math.max(best, current);
        } else current = 1;
    }
    return { current, best };
}
