import { useEffect, useState } from 'react';
import { listenToMessages, sendMessage } from '../services/chatService';

export default function useMessages(chatId) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!chatId) return;
        const unsub = listenToMessages(chatId, (msgs) => {
            setMessages(msgs);
            setLoading(false);
        });
        return () => unsub();
    }, [chatId]);

    const send = async (senderId, text) => {
        if (!chatId) return;
        await sendMessage(chatId, senderId, text);
    };

    return { messages: chatId ? messages : [], loading, send };
}
