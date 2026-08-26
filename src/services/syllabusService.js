import {
    doc,
    deleteField,
    onSnapshot,
    setDoc,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore';

import { db } from './firebase';

// ─────────────────────────────────────────────────────────────
// SYLLABUS PROGRESS SERVICE
// ─────────────────────────────────────────────────────────────
//
// Firestore:
//
// syllabusProgress/{uid}
//
// {
//     tier1: {
//         quantScore: ['percentage', 'average'],
//         reasoningScore: ['analogy'],
//         englishScore: [],
//         gkScore: []
//     },
//
//     tier2: {
//         ...
//     }
// }
//
// We intentionally store only completed leaf-topic IDs.
//
// Chapters and subjects are derived by the frontend.
// This keeps Firestore simple and prevents duplicated state.
// ─────────────────────────────────────────────────────────────

const syllabusDocRef = (uid) => doc(db, 'syllabusProgress', uid);

// ─────────────────────────────────────────────────────────────
// REAL-TIME LISTENER
// ─────────────────────────────────────────────────────────────

export const listenToSyllabusProgress = (uid, callback) => {
    return onSnapshot(
        syllabusDocRef(uid),
        { includeMetadataChanges: true },
        (snap) => {
            callback(
                snap.exists() ? snap.data() : {},
                undefined,
                snap.metadata
            );
        },
        (error) => {
            console.error('Syllabus progress listener failed:', error);

            callback(undefined, error);
        }
    );
};

// ─────────────────────────────────────────────────────────────
// TOGGLE TOPIC
// ─────────────────────────────────────────────────────────────

export const toggleSyllabusTopic = async (
    uid,
    tier,
    subjectKey,
    topicId,
    isNowComplete
) => {
    const fieldPath = `${tier}.${subjectKey}`;

    await setDoc(
        syllabusDocRef(uid),
        {
            userId: uid,
            [fieldPath]: isNowComplete
                ? arrayUnion(topicId)
                : arrayRemove(topicId),
        },
        {
            merge: true,
        }
    );
};

// ─────────────────────────────────────────────────────────────
// RESET SUBJECT
// ─────────────────────────────────────────────────────────────

export const resetSubjectProgress = async (uid, tier, subjectKey) => {
    const fieldPath = `${tier}.${subjectKey}`;

    await setDoc(
        syllabusDocRef(uid),
        {
            userId: uid,
            [fieldPath]: [],
        },
        {
            merge: true,
        }
    );
};

// ─────────────────────────────────────────────────────────────
// RESET ENTIRE TIER
// ─────────────────────────────────────────────────────────────

export const resetTierProgress = async (uid, tier) => {
    await setDoc(
        syllabusDocRef(uid),
        {
            userId: uid,
            [tier]: deleteField(),
        },
        {
            merge: true,
        }
    );
};
