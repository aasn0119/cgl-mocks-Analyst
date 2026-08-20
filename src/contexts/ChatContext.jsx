import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { fetchUsers } from '../services/leaderboardService';
import {
    listenToIncomingRequests,
    listenToOutgoingRequests,
    listenToMyChats,
    sendChatRequest,
    respondToRequest,
    removeFriend as removeFriendService,
    retractRequest as retractRequestService,
    markRequestsSeen as markRequestsSeenService,
    markChatRead as markChatReadService,
} from '../services/ChatService';
import toast from 'react-hot-toast';

// Tracks which other users this browser has already "seen" in the
// Find People list, purely client-side (no schema change needed)
// so a "new student joined" badge can be shown and cleared.
const NEW_USERS_STORAGE_KEY = 'chat_seen_user_ids';

const ChatContext = createContext(null);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();

    const [allUsers, setAllUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [chats, setChats] = useState([]);
    const [seenVersion, setSeenVersion] = useState(0);

    useEffect(() => {
        fetchUsers()
            .then(setAllUsers)
            .finally(() => setUsersLoading(false));
    }, []);

    useEffect(() => {
        if (!user) return;
        const unsub1 = listenToIncomingRequests(user.uid, setIncoming);
        const unsub2 = listenToOutgoingRequests(user.uid, setOutgoing);
        const unsub3 = listenToMyChats(user.uid, setChats);
        return () => {
            unsub1();
            unsub2();
            unsub3();
        };
    }, [user]);

    // People, excluding yourself
    const otherUsers = useMemo(
        () => allUsers.filter((u) => u.uid !== user?.uid),
        [allUsers, user]
    );

    // uid -> relationship status: 'friends' | 'pending_sent' | 'pending_received' | 'none'
    const relationshipMap = useMemo(() => {
        const map = {};

        chats.forEach((c) => {
            const otherUid = c.participants.find((p) => p !== user?.uid);
            if (otherUid) map[otherUid] = 'friends';
        });

        outgoing.forEach((r) => {
            if (r.status === 'pending' && !map[r.toUid]) {
                map[r.toUid] = 'pending_sent';
            }
        });

        incoming.forEach((r) => {
            if (r.status === 'pending' && !map[r.fromUid]) {
                map[r.fromUid] = 'pending_received';
            }
        });

        return map;
    }, [chats, outgoing, incoming, user]);

    // "New user" tracking — purely derived from localStorage + the
    // live user list, recomputed whenever markUsersSeen() bumps
    // seenVersion. No effect needed since localStorage reads have
    // no side effects.
    const seenUserIds = useMemo(() => {
        try {
            return new Set(
                JSON.parse(localStorage.getItem(NEW_USERS_STORAGE_KEY) || '[]')
            );
        } catch {
            return new Set();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seenVersion]);

    const newUsers = useMemo(
        () => otherUsers.filter((u) => !seenUserIds.has(u.uid)),
        [otherUsers, seenUserIds]
    );

    const unseenRequests = useMemo(
        () => incoming.filter((r) => !r.seenByRecipient),
        [incoming]
    );

    const outgoingPending = useMemo(
        () => outgoing.filter((r) => r.status === 'pending'),
        [outgoing]
    );

    const totalUnreadMessages = useMemo(
        () =>
            chats.reduce(
                (sum, c) => sum + (c.unreadCount?.[user?.uid] || 0),
                0
            ),
        [chats, user]
    );

    const totalNotifications =
        unseenRequests.length + totalUnreadMessages + newUsers.length;

    // ── Actions ─────────────────────────────────────────────

    const sendRequest = async (targetUser) => {
        if (!user) return;
        try {
            await sendChatRequest(
                {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                },
                targetUser
            );
            toast.success(`Request sent to ${targetUser.displayName}`);
        } catch (err) {
            console.error(err);
            toast.error('Could not send request. Try again.');
        }
    };

    const acceptRequest = async (request) => {
        try {
            await respondToRequest(request, true);
            toast.success(`You're now connected with ${request.fromName}`);
        } catch (err) {
            console.error(err);
            toast.error('Could not accept request.');
        }
    };

    const declineRequest = async (request) => {
        try {
            await respondToRequest(request, false);
        } catch (err) {
            console.error(err);
            toast.error('Could not decline request.');
        }
    };

    // Cancel a request you sent by mistake, while it's still pending.
    const retractRequest = async (request) => {
        try {
            await retractRequestService(request.id);
            toast.success('Request cancelled.');
        } catch (err) {
            console.error(err);
            toast.error('Could not cancel request.');
        }
    };

    const removeFriend = async (chatId) => {
        try {
            await removeFriendService(chatId);
            toast.success('Removed from your chats.');
        } catch (err) {
            console.error(err);
            toast.error('Could not remove this chat. Try again.');
        }
    };

    // Clears this chat's unread badge for the current user — call
    // on select, and again whenever new messages arrive while open.
    const markChatRead = async (chatId) => {
        if (!chatId || !user) return;
        try {
            await markChatReadService(chatId, user.uid);
        } catch (err) {
            console.error(err);
        }
    };

    const markRequestsSeen = async () => {
        const ids = unseenRequests.map((r) => r.id);
        if (!ids.length) return;
        try {
            await markRequestsSeenService(ids);
        } catch (err) {
            console.error(err);
        }
    };

    const markUsersSeen = () => {
        const allIds = [
            ...new Set([...seenUserIds, ...otherUsers.map((u) => u.uid)]),
        ];
        localStorage.setItem(NEW_USERS_STORAGE_KEY, JSON.stringify(allIds));
        setSeenVersion((v) => v + 1);
    };

    const value = {
        currentUser: user,
        otherUsers,
        usersLoading,
        incoming,
        outgoing,
        outgoingPending,
        chats,
        relationshipMap,
        markChatRead,
        sendRequest,
        acceptRequest,
        declineRequest,
        retractRequest,
        removeFriend,
        unseenRequestCount: unseenRequests.length,
        totalUnreadMessages,
        newUsers,
        newUsersCount: newUsers.length,
        totalNotifications,
        markRequestsSeen,
        markUsersSeen,
    };

    return (
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
    );
};
