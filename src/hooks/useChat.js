import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUsers } from '../services/leaderboardService';
import {
    listenToIncomingRequests,
    listenToOutgoingRequests,
    listenToMyChats,
    sendChatRequest,
    respondToRequest,
    removeFriend as removeFriendService,
    getChatId,
} from '../services/ChatService';
import toast from 'react-hot-toast';

export default function useChat() {
    const { user } = useAuth();

    const [allUsers, setAllUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);

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
            setSelectedChatId(getChatId(request.fromUid, request.toUid));
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

    const removeFriend = async (chatId) => {
        try {
            await removeFriendService(chatId);
            if (selectedChatId === chatId) setSelectedChatId(null);
            toast.success('Removed from your chats.');
        } catch (err) {
            console.error(err);
            toast.error('Could not remove this chat. Try again.');
        }
    };

    const selectedChat = useMemo(
        () => chats.find((c) => c.id === selectedChatId) || null,
        [chats, selectedChatId]
    );

    return {
        currentUser: user,
        otherUsers,
        usersLoading,
        incoming,
        outgoing,
        chats,
        relationshipMap,
        selectedChat,
        selectedChatId,
        setSelectedChatId,
        sendRequest,
        acceptRequest,
        declineRequest,
        removeFriend,
    };
}
