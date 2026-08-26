import { useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { useTier } from '../contexts/TierContext';

import {
    listenToSyllabusProgress,
    toggleSyllabusTopic,
} from '../services/syllabusService';

import {
    getSyllabusForTier,
    getTopicsForSubject,
    getTotalTopicCount,
} from '../config/syllabus';

const LEGACY_TOPIC_ALIASES = {
    'natural numbers': 'number-system',
};

const getStoredTopics = (value) => {
    if (Array.isArray(value)) return value;

    if (value && typeof value === 'object') {
        const entries = Object.entries(value);
        const hasBooleanValues = entries.some(
            ([, storedValue]) => typeof storedValue === 'boolean'
        );

        if (hasBooleanValues) {
            return entries
                .filter(([, storedValue]) => storedValue === true)
                .map(([key]) => key);
        }

        return entries
            .sort(([firstKey], [secondKey]) => {
                const firstNumber = Number(firstKey);
                const secondNumber = Number(secondKey);

                if (Number.isNaN(firstNumber) || Number.isNaN(secondNumber)) {
                    return firstKey.localeCompare(secondKey);
                }

                return firstNumber - secondNumber;
            })
            .map(([, storedValue]) => storedValue);
    }

    return [];
};

const getStoredSubjectProgress = (progress, tier, subjectKey) => {
    return (
        progress?.[tier]?.[subjectKey] ??
        progress?.[`${tier}.${subjectKey}`] ??
        progress?.[subjectKey]
    );
};

const getCompletedTopicIds = (storedValue, topics) => {
    const topicIdsByLabel = new Map(
        topics.map((topic) => [topic.label.trim().toLowerCase(), topic.id])
    );

    return getStoredTopics(storedValue).map((storedTopic) => {
        if (topics.some((topic) => topic.id === storedTopic)) {
            return storedTopic;
        }

        return (
            topicIdsByLabel.get(String(storedTopic).trim().toLowerCase()) ||
            LEGACY_TOPIC_ALIASES[String(storedTopic).trim().toLowerCase()] ||
            storedTopic
        );
    });
};

const normalizeProgressForTier = (data, tier, pattern) => {
    const nextProgress = { ...(data || {}) };
    const nextTier = {
        ...(nextProgress[tier] || {}),
    };

    Object.values(pattern).forEach((subject) => {
        const topics = getTopicsForSubject(tier, subject.key);

        nextTier[subject.key] = getCompletedTopicIds(
            getStoredSubjectProgress(data, tier, subject.key),
            topics
        );
    });

    nextProgress[tier] = nextTier;

    return nextProgress;
};

const applyPendingChanges = (data, pendingChanges, acknowledge = false) => {
    const nextProgress = { ...(data || {}) };

    pendingChanges.forEach(
        ({ tier, subjectKey, topicId, isNowComplete }, changeKey) => {
            const nextTier = {
                ...(nextProgress[tier] || {}),
            };

            const serverTopics = new Set(getStoredTopics(nextTier[subjectKey]));

            const isAcknowledged = isNowComplete
                ? serverTopics.has(topicId)
                : !serverTopics.has(topicId);

            if (acknowledge && isAcknowledged) {
                pendingChanges.delete(changeKey);
                return;
            }

            if (isNowComplete) {
                serverTopics.add(topicId);
            } else {
                serverTopics.delete(topicId);
            }

            nextTier[subjectKey] = [...serverTopics];
            nextProgress[tier] = nextTier;
        }
    );

    return nextProgress;
};

// ─────────────────────────────────────────────────────────────
// useSyllabus
// ─────────────────────────────────────────────────────────────
//
// Central brain of the syllabus tracker.
//
// UI components should NOT calculate progress themselves.
// Everything comes from this hook.
//
// ─────────────────────────────────────────────────────────────

export default function useSyllabus() {
    const { user } = useAuth();
    const { tier } = useTier();

    const pattern = useMemo(() => getSyllabusForTier(tier), [tier]);

    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const pendingChanges = useRef(new Map());
    const nextMutationId = useRef(0);

    // ─────────────────────────────────────────────────────────
    // FIRESTORE LISTENER
    // ─────────────────────────────────────────────────────────

    useEffect(() => {
        pendingChanges.current.clear();

        if (!user) {
            return;
        }

        setLoading(true);

        const unsubscribe = listenToSyllabusProgress(
            user.uid,
            (data, error, metadata) => {
                if (error) {
                    setLoading(false);
                    return;
                }

                setProgress(() =>
                    applyPendingChanges(
                        normalizeProgressForTier(data || {}, tier, pattern),
                        pendingChanges.current,
                        !metadata?.hasPendingWrites
                    )
                );
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [pattern, tier, user]);

    // ─────────────────────────────────────────────────────────
    // CURRENT TIER PROGRESS
    // ─────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────
    // COMPLETED SETS
    // ─────────────────────────────────────────────────────────
    //
    // Set gives us O(1) lookup:
    //
    // completed.has(topicId)
    //
    // ─────────────────────────────────────────────────────────

    const completedSets = useMemo(() => {
        const result = {};

        Object.values(pattern).forEach((subject) => {
            const topics = getTopicsForSubject(tier, subject.key);

            result[subject.key] = new Set(
                getCompletedTopicIds(
                    getStoredSubjectProgress(progress, tier, subject.key),
                    topics
                )
            );
        });

        return result;
    }, [pattern, progress, tier]);

    // ─────────────────────────────────────────────────────────
    // SUBJECT STATISTICS
    // ─────────────────────────────────────────────────────────

    const subjectStats = useMemo(() => {
        return Object.values(pattern).map((subject) => {
            const completedSet = completedSets[subject.key] || new Set();

            const chapters = subject.chapters.map((chapter) => {
                const topics = chapter.topics || [];

                const completedCount = topics.filter((topic) =>
                    completedSet.has(topic.id)
                ).length;

                const totalCount = topics.length;

                const percent = totalCount
                    ? Math.round((completedCount / totalCount) * 100)
                    : 0;

                return {
                    ...chapter,
                    completedCount,
                    totalCount,
                    percent,
                    isComplete: totalCount > 0 && completedCount === totalCount,
                };
            });

            const topics = getTopicsForSubject(tier, subject.key);

            const completedCount = topics.filter((topic) =>
                completedSet.has(topic.id)
            ).length;

            const totalCount = topics.length;

            const percent = totalCount
                ? Math.round((completedCount / totalCount) * 100)
                : 0;

            return {
                ...subject,

                chapters,

                topics,

                completedSet,

                completedCount,

                totalCount,

                percent,

                isComplete: totalCount > 0 && completedCount === totalCount,
            };
        });
    }, [pattern, completedSets, tier]);

    // ─────────────────────────────────────────────────────────
    // OVERALL PROGRESS
    // ─────────────────────────────────────────────────────────

    const overall = useMemo(() => {
        const totalTopics = getTotalTopicCount(tier);

        const totalCompleted = subjectStats.reduce(
            (sum, subject) => sum + subject.completedCount,
            0
        );

        const totalChapters = subjectStats.reduce(
            (sum, subject) => sum + subject.chapters.length,
            0
        );

        const completedChapters = subjectStats.reduce(
            (sum, subject) =>
                sum +
                subject.chapters.filter((chapter) => chapter.isComplete).length,
            0
        );

        const completedSubjects = subjectStats.filter(
            (subject) => subject.isComplete
        ).length;

        const percent = totalTopics
            ? Math.round((totalCompleted / totalTopics) * 100)
            : 0;

        return {
            totalTopics,
            totalCompleted,

            totalChapters,
            completedChapters,

            totalSubjects: subjectStats.length,

            completedSubjects,

            percent,
        };
    }, [subjectStats, tier]);

    // ─────────────────────────────────────────────────────────
    // ACHIEVEMENTS
    // ─────────────────────────────────────────────────────────

    const achievements = useMemo(() => {
        const list = [];

        if (overall.totalCompleted >= 1) {
            list.push({
                id: 'first-topic',
                icon: '🌱',
                title: 'First Step',
                description: 'You completed your first topic.',
            });
        }

        if (overall.percent >= 25) {
            list.push({
                id: 'quarter',
                icon: '🔥',
                title: 'Quarter Master',
                description: '25% of the syllabus completed.',
            });
        }

        if (overall.percent >= 50) {
            list.push({
                id: 'halfway',
                icon: '⚡',
                title: 'Halfway Hero',
                description: 'You crossed the 50% milestone.',
            });
        }

        if (overall.percent >= 75) {
            list.push({
                id: 'almost-there',
                icon: '🚀',
                title: 'Almost There',
                description: '75% of the syllabus completed.',
            });
        }

        if (overall.percent === 100) {
            list.push({
                id: 'complete',
                icon: '🏆',
                title: 'Syllabus Champion',
                description: 'You completed the entire syllabus.',
            });
        }

        subjectStats.forEach((subject) => {
            if (subject.isComplete) {
                list.push({
                    id: `subject-${subject.key}`,
                    icon: '🏅',
                    title: `${subject.shortLabel} Master`,
                    description: `Completed ${subject.label}.`,
                });
            }
        });

        return list;
    }, [overall, subjectStats]);

    // ─────────────────────────────────────────────────────────
    // TOGGLE TOPIC
    // ─────────────────────────────────────────────────────────

    const toggleTopic = (subjectKey, topicId, isNowComplete) => {
        if (!user) return;

        const mutationId = nextMutationId.current + 1;
        nextMutationId.current = mutationId;
        const changeKey = `${tier}.${subjectKey}.${topicId}`;

        pendingChanges.current.set(changeKey, {
            mutationId,
            tier,
            subjectKey,
            topicId,
            isNowComplete,
        });

        // Optimistic UI update.
        setProgress((previous) => {
            const previousTier = {
                ...(previous[tier] || {}),
            };

            const current = new Set(getStoredTopics(previousTier[subjectKey]));

            if (isNowComplete) {
                current.add(topicId);
            } else {
                current.delete(topicId);
            }

            previousTier[subjectKey] = [...current];

            return {
                ...previous,
                [tier]: previousTier,
            };
        });

        toggleSyllabusTopic(
            user.uid,
            tier,
            subjectKey,
            topicId,
            isNowComplete
        ).catch((error) => {
            console.error('Failed to save syllabus progress:', error);

            const pendingChange = pendingChanges.current.get(changeKey);

            if (pendingChange?.mutationId !== mutationId) return;

            pendingChanges.current.delete(changeKey);

            setProgress((previous) => {
                const previousTier = {
                    ...(previous[tier] || {}),
                };
                const topics = new Set(
                    getStoredTopics(previousTier[subjectKey])
                );

                if (isNowComplete) {
                    topics.delete(topicId);
                } else {
                    topics.add(topicId);
                }

                previousTier[subjectKey] = [...topics];

                return {
                    ...previous,
                    [tier]: previousTier,
                };
            });
        });
    };

    return {
        loading: user ? loading : false,

        tier,

        pattern,

        subjectStats,

        overall,

        achievements,

        toggleTopic,
    };
}
