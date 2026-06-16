import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';

import { collection, query, where, onSnapshot } from 'firebase/firestore';

const TARGET_SCORE = 160;

export default function useDashboardStats() {
    const { user } = useAuth();

    const [mocks, setMocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setMocks([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'mocks'),
            where('userId', '==', user.uid)
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setMocks(data);
            setLoading(false);
        });

        return () => unsub();
    }, [user]);

    const stats = useMemo(() => {
        if (!mocks.length) {
            return {
                totalMocks: 0,
                avgScore: 0,
                bestScore: 0,
                currentScore: 0,
                avgAccuracy: 0,
                avgPercentile: 0,
                improvement: 0,
                currentStreak: 0,
                bestStreak: 0,
                goalGap: TARGET_SCORE,
                progressPercent: 0,
                readiness: 'Needs Work',
                predictedScore: 0,
            };
        }

        const sorted = [...mocks].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

        const totalMocks = sorted.length;

        const avgScore =
            sorted.reduce(
                (sum, item) => sum + Number(item.totalScore || 0),
                0
            ) / totalMocks;

        const avgAccuracy =
            sorted.reduce((sum, item) => sum + Number(item.accuracy || 0), 0) /
            totalMocks;

        const avgPercentile =
            sorted.reduce(
                (sum, item) => sum + Number(item.percentile || 0),
                0
            ) / totalMocks;

        const bestScore = Math.max(
            ...sorted.map((m) => Number(m.totalScore || 0))
        );

        const currentScore = sorted[sorted.length - 1]?.totalScore || 0;

        const firstScore = sorted[0]?.totalScore || currentScore;

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

        let readiness = 'Needs Work';

        if (avgScore >= 160) {
            readiness = 'Exam Ready';
        } else if (avgScore >= 140) {
            readiness = 'Competitive';
        } else if (avgScore >= 120) {
            readiness = 'Improving';
        }

        const lastFive = sorted.slice(-5);

        let predictedScore = currentScore;

        if (lastFive.length >= 2) {
            const growth =
                (lastFive[lastFive.length - 1].totalScore -
                    lastFive[0].totalScore) /
                (lastFive.length - 1);

            predictedScore = currentScore + growth;
        }

        const streaks = calculateStreaks(sorted);

        return {
            totalMocks,
            avgScore: avgScore.toFixed(2),
            bestScore,
            currentScore,
            avgAccuracy: avgAccuracy.toFixed(2),
            avgPercentile: avgPercentile.toFixed(2),
            improvement: improvement,
            currentStreak: streaks.current,
            bestStreak: streaks.best,
            goalGap: goalGap.toFixed(2),
            progressPercent: progressPercent.toFixed(1),
            readiness,
            predictedScore: predictedScore.toFixed(1),
        };
    }, [mocks]);

    const subjectAverages = useMemo(() => {
        if (!mocks.length) return [];

        const count = mocks.length;

        const quant =
            mocks.reduce((sum, m) => sum + Number(m.quantScore || 0), 0) /
            count;

        const reasoning =
            mocks.reduce((sum, m) => sum + Number(m.reasoningScore || 0), 0) /
            count;

        const english =
            mocks.reduce((sum, m) => sum + Number(m.englishScore || 0), 0) /
            count;

        const gk =
            mocks.reduce((sum, m) => sum + Number(m.gkScore || 0), 0) / count;

        return [
            { subject: 'Quant', score: quant.toFixed(1) },
            { subject: 'Reasoning', score: reasoning.toFixed(1) },
            { subject: 'English', score: english.toFixed(1) },
            { subject: 'GK', score: gk.toFixed(1) },
        ];
    }, [mocks]);

    const chartData = useMemo(() => {
        return [...mocks]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((m) => ({
                date: m.date,
                score: m.totalScore,
                accuracy: m.accuracy,
                percentile: m.percentile,
                rank: m.rank,
            }));
    }, [mocks]);

    const weeklyReport = useMemo(() => {
        const now = new Date();

        const weekMocks = mocks.filter((m) => {
            const d = new Date(m.date);
            return (now - d) / (1000 * 60 * 60 * 24) <= 7;
        });

        return buildReport(weekMocks);
    }, [mocks]);

    const monthlyReport = useMemo(() => {
        const now = new Date();

        const monthMocks = mocks.filter((m) => {
            const d = new Date(m.date);
            return (now - d) / (1000 * 60 * 60 * 24) <= 30;
        });

        return buildReport(monthMocks);
    }, [mocks]);

    return {
        loading,
        mocks,
        stats,
        chartData,
        subjectAverages,
        weeklyReport,
        monthlyReport,
        TARGET_SCORE,
    };
}

function buildReport(data) {
    if (!data.length) {
        return {
            mocks: 0,
            avgScore: 0,
            avgAccuracy: 0,
        };
    }

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
    const dates = sorted.map((m) => new Date(m.date).toDateString());

    let best = 1;
    let current = 1;

    for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);

        const diff = (curr - prev) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
            current++;
            best = Math.max(best, current);
        } else {
            current = 1;
        }
    }

    return {
        current: sorted.length ? current : 0,
        best: sorted.length ? best : 0,
    };
}
