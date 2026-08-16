import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    listenToIncomingRequests,
    listenToMyChats,
    listenToChatNotificationState,
    markIncomingRequestsSeen,
} from '../services/ChatService';

export default function useChatNotifications() {
    const { user } = useAuth();

    const [incoming, setIncoming] = useState([]);
    const [chats, setChats] = useState([]);
    const [notificationState, setNotificationState] = useState({});

    useEffect(() => {
        if (!user?.uid) {
            setIncoming([]);
            setChats([]);
            setNotificationState({});
            return undefined;
        }

        const unsubIncoming = listenToIncomingRequests(user.uid, setIncoming);

        const unsubChats = listenToMyChats(user.uid, setChats);

        const unsubNotificationState = listenToChatNotificationState(
            user.uid,
            setNotificationState
        );

        return () => {
            unsubIncoming();
            unsubChats();
            unsubNotificationState();
        };
    }, [user?.uid]);

    const requestSeenAt = notificationState?.chatRequestSeenAt || null;

    const newRequestCount = useMemo(() => {
        if (!incoming.length) return 0;

        return incoming.filter((request) => {
            // If no previous seen timestamp exists, all current pending
            // requests are considered new.
            if (!requestSeenAt) return true;

            // serverTimestamp() may temporarily be unresolved.
            // Such a request should still be treated as new.
            if (!request.createdAt?.toMillis) return true;

            return request.createdAt.toMillis() > requestSeenAt.toMillis();
        }).length;
    }, [incoming, requestSeenAt]);

    const unreadByChat = useMemo(() => {
        const result = {};

        chats.forEach((chat) => {
            result[chat.id] = Number(chat.unreadCount?.[user?.uid] || 0);
        });

        return result;
    }, [chats, user?.uid]);

    const totalUnreadMessages = useMemo(
        () =>
            Object.values(unreadByChat).reduce((sum, count) => sum + count, 0),
        [unreadByChat]
    );

    const totalNotifications = newRequestCount + totalUnreadMessages;

    const markRequestsSeen = async () => {
        if (!user?.uid) return;

        try {
            await markIncomingRequestsSeen(user.uid);
        } catch (error) {
            console.error('Failed to mark chat requests as seen:', error);
        }
    };

    return {
        newRequestCount,
        totalUnreadMessages,
        totalNotifications,
        unreadByChat,
        markRequestsSeen,
    };
}
