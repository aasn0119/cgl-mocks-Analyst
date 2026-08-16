import {
    collection,
    doc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    limit,
} from 'firebase/firestore';
import { db } from './firebase';

// ─────────────────────────────────────────────────────────────
// Chat between any two users, gated by a request/accept flow:
//   1. User A sends a request to User B  → `chatRequests` doc
//   2. User B accepts                    → `chats` doc created
//   3. Either side can now message freely → `chats/{id}/messages`
//
// Chat doc id is deterministic: the two uids sorted and joined,
// so there's only ever one thread between any pair of users.
// ─────────────────────────────────────────────────────────────

export const getChatId = (uidA, uidB) => [uidA, uidB].sort().join('_');

// ── Requests ────────────────────────────────────────────────

export const sendChatRequest = async (fromUser, toUser) => {
    const chatId = getChatId(fromUser.uid, toUser.uid);

    await addDoc(collection(db, 'chatRequests'), {
        chatId,
        fromUid: fromUser.uid,
        fromName: fromUser.displayName,
        fromPhoto: fromUser.photoURL || null,
        toUid: toUser.uid,
        toName: toUser.displayName,
        toPhoto: toUser.photoURL || null,
        status: 'pending',
        createdAt: serverTimestamp(),
    });
};

// Firestore doesn't support OR queries across two different fields
// in older SDKs cleanly, so we listen to incoming + outgoing
// separately and let the UI merge them.
export const listenToIncomingRequests = (uid, callback) => {
    const q = query(
        collection(db, 'chatRequests'),
        where('toUid', '==', uid),
        where('status', '==', 'pending')
    );
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
};

export const listenToOutgoingRequests = (uid, callback) => {
    const q = query(
        collection(db, 'chatRequests'),
        where('fromUid', '==', uid)
    );
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
};

export const respondToRequest = async (request, accept) => {
    const reqRef = doc(db, 'chatRequests', request.id);

    await updateDoc(reqRef, {
        status: accept ? 'accepted' : 'declined',
        respondedAt: serverTimestamp(),
    });

    if (accept) {
        const chatId = getChatId(request.fromUid, request.toUid);
        const chatRef = doc(db, 'chats', chatId);

        await setDoc(
            chatRef,
            {
                participants: [request.fromUid, request.toUid],
                participantInfo: {
                    [request.fromUid]: {
                        name: request.fromName,
                        photo: request.fromPhoto,
                    },
                    [request.toUid]: {
                        name: request.toName,
                        photo: request.toPhoto,
                    },
                },
                lastMessage: '',
                lastMessageAt: serverTimestamp(),
                createdAt: serverTimestamp(),
            },
            { merge: true }
        );
    }
};

// ── Chats ───────────────────────────────────────────────────

export const listenToMyChats = (uid, callback) => {
    const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', uid)
    );

    return onSnapshot(q, (snap) => {
        const chats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort client-side (avoids needing a composite index for
        // array-contains + orderBy)
        chats.sort((a, b) => {
            const at = a.lastMessageAt?.toMillis?.() || 0;
            const bt = b.lastMessageAt?.toMillis?.() || 0;
            return bt - at;
        });
        callback(chats);
    });
};

export const listenToMessages = (chatId, callback) => {
    const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('createdAt', 'asc'),
        limit(500)
    );

    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
};

export const sendMessage = async (chatId, senderId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId,
        text: trimmed,
        createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: trimmed,
        lastMessageAt: serverTimestamp(),
    });
};

// ── Remove a friend ─────────────────────────────────────────
// Deletes the whole thread: every message, then the chat doc
// itself. Either participant can do this (e.g. WhatsApp-style
// "remove contact"). The two users can send a fresh request to
// reconnect later — a new chat doc will be created on accept.
export const removeFriend = async (chatId) => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const snap = await getDocs(messagesRef);

    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
    await deleteDoc(doc(db, 'chats', chatId));
};
