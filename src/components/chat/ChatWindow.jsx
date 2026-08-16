import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaComments } from 'react-icons/fa';
import { Avatar } from './ChatSidebar';
import useMessages from '../../hooks/useMessages';

const formatTime = (ts) => {
    if (!ts?.toDate) return '';
    return ts.toDate().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatDayLabel = (ts) => {
    if (!ts?.toDate) return '';
    const d = ts.toDate();
    const today = new Date();
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);

    const sameDay = (a, b) => a.toDateString() === b.toDateString();

    if (sameDay(d, today)) return 'Today';
    if (sameDay(d, yest)) return 'Yesterday';
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const ChatWindow = ({ chat, currentUser }) => {
    const { messages, send } = useMessages(chat?.id);
    const [text, setText] = useState('');
    const bottomRef = useRef(null);

    // Precompute which messages need a "Today / Yesterday / ..."
    // separator above them — built purely functionally (no mutation
    // of a captured variable) so it plays nicely with React's
    // memoization/compiler rules.
    const enrichedMessages = useMemo(() => {
        const { results } = messages.reduce(
            (state, m) => {
                const dayLabel = formatDayLabel(m.createdAt);
                const showDaySeparator =
                    Boolean(dayLabel) && dayLabel !== state.lastLabel;
                return {
                    lastLabel: dayLabel || state.lastLabel,
                    results: [
                        ...state.results,
                        { ...m, dayLabel, showDaySeparator },
                    ],
                };
            },
            { lastLabel: null, results: [] }
        );
        return results;
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [enrichedMessages.length, chat?.id]);

    if (!chat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl shadow-xl"
                >
                    <FaComments />
                </motion.div>
                <div>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-white">
                        Select a conversation
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs">
                        Pick a chat from the left, or find a student and send a
                        request to start a new one.
                    </p>
                </div>
            </div>
        );
    }

    const otherUid = chat.participants.find((p) => p !== currentUser?.uid);
    const otherInfo = chat.participantInfo?.[otherUid];

    const handleSend = () => {
        if (!text.trim()) return;
        send(currentUser.uid, text);
        setText('');
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            {/* HEADER */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                <Avatar src={otherInfo?.photo} name={otherInfo?.name} online />
                <div>
                    <p className="font-bold text-slate-800 dark:text-white">
                        {otherInfo?.name || 'Student'}
                    </p>
                    <p className="text-xs text-emerald-500 font-medium">
                        Connected
                    </p>
                </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
                <AnimatePresence initial={false}>
                    {enrichedMessages.map((m) => {
                        const mine = m.senderId === currentUser?.uid;

                        return (
                            <div key={m.id}>
                                {m.showDaySeparator && (
                                    <div className="flex items-center justify-center my-4">
                                        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                            {m.dayLabel}
                                        </span>
                                    </div>
                                )}
                                <motion.div
                                    layout
                                    initial={{
                                        opacity: 0,
                                        y: 12,
                                        scale: 0.96,
                                    }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                    className={`flex ${mine ? 'justify-end' : 'justify-start'} mb-1.5`}
                                >
                                    <div
                                        className={`max-w-[75%] sm:max-w-[60%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                            mine
                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-br-sm'
                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm border border-slate-100 dark:border-slate-700'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap break-words">
                                            {m.text}
                                        </p>
                                        <p
                                            className={`text-[10px] mt-1 ${mine ? 'text-indigo-100' : 'text-slate-400'}`}
                                        >
                                            {formatTime(m.createdAt)}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>

            {/* COMPOSER */}
            <div className="p-3 border-t border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 rounded-full text-sm bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 outline-none text-slate-700 dark:text-slate-200"
                    />
                    <motion.button
                        whileTap={{ scale: 0.85, rotate: -15 }}
                        whileHover={{ scale: 1.08 }}
                        onClick={handleSend}
                        disabled={!text.trim()}
                        className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                        <FaPaperPlane size={14} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
