import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPaperPlane,
    FaComments,
    FaEllipsisV,
    FaUserSlash,
    FaExclamationTriangle,
    FaTrashAlt,
} from 'react-icons/fa';
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

const ChatWindow = ({ chat, currentUser, onRemoveFriend, onMarkRead }) => {
    const { messages, send } = useMessages(chat?.id);
    const [text, setText] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const bottomRef = useRef(null);

    // "Delete for me" — purely local, per-device hide. Doesn't touch
    // Firestore, so the other person still sees the message; this
    // just removes it from your own view. Scoped per chat + user.
    const hiddenKey = `hiddenMsgs_${chat?.id}_${currentUser?.uid}`;
    const [hiddenIds, setHiddenIds] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem(hiddenKey) || '[]'));
        } catch {
            return new Set();
        }
    });

    const hideMessage = (id) => {
        setHiddenIds((prev) => {
            const next = new Set(prev);
            next.add(id);
            try {
                localStorage.setItem(hiddenKey, JSON.stringify([...next]));
            } catch {
                // localStorage unavailable — hide still works for this session
            }
            return next;
        });
    };

    // Precompute which messages need a "Today / Yesterday / ...":
    // separator above them — built purely functionally (no mutation
    // of a captured variable) so it plays nicely with React's
    // memoization/compiler rules. Hidden (locally-deleted) messages
    // are filtered out before the day-separator pass so separators
    // stay consistent with what's actually shown.
    const enrichedMessages = useMemo(() => {
        const visible = messages.filter((m) => !hiddenIds.has(m.id));
        const { results } = visible.reduce(
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
    }, [messages, hiddenIds]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [enrichedMessages.length, chat?.id]);

    // Keep the unread badge cleared while this conversation is
    // actively open, even as new messages stream in.
    useEffect(() => {
        if (chat?.id) onMarkRead?.(chat.id);
    }, [chat?.id, messages.length, onMarkRead]);

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
        send(currentUser.uid, text, otherUid);
        setText('');
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            {/* HEADER */}
            <div className="relative flex items-center gap-3 px-5 py-3.5 border-b border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                <Avatar src={otherInfo?.photo} name={otherInfo?.name} online />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white truncate">
                        {otherInfo?.name || 'Student'}
                    </p>
                    <p className="text-xs text-emerald-500 font-medium">
                        Connected
                    </p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setMenuOpen((o) => !o)}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Chat options"
                    >
                        <FaEllipsisV size={14} />
                    </button>

                    <AnimatePresence>
                        {menuOpen && (
                            <>
                                {/* click-away layer */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setMenuOpen(false)}
                                />
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -6,
                                        scale: 0.95,
                                    }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute right-0 top-11 z-20 w-52 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                                >
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setConfirmOpen(true);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                                    >
                                        <FaUserSlash />
                                        Remove Friend
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* REMOVE FRIEND CONFIRMATION */}
            <AnimatePresence>
                {confirmOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
                        onClick={() => setConfirmOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 12 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 25,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl mb-4">
                                <FaExclamationTriangle />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                Remove {otherInfo?.name || 'this student'}?
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                This will permanently delete your entire
                                conversation with {otherInfo?.name || 'them'}.
                                You'll need to send a new request to chat again.
                            </p>
                            <div className="flex items-center gap-3 mt-6">
                                <button
                                    onClick={() => setConfirmOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => {
                                        setConfirmOpen(false);
                                        onRemoveFriend?.(chat.id);
                                    }}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-red-500 hover:shadow-lg transition-shadow"
                                >
                                    Remove
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                    className={`group flex items-center gap-1.5 ${mine ? 'justify-end' : 'justify-start'} mb-1.5`}
                                >
                                    {mine && (
                                        <button
                                            onClick={() => hideMessage(m.id)}
                                            title="Delete for me"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-500 shrink-0"
                                        >
                                            <FaTrashAlt size={11} />
                                        </button>
                                    )}
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
                                    {!mine && (
                                        <button
                                            onClick={() => hideMessage(m.id)}
                                            title="Delete for me"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-500 shrink-0"
                                        >
                                            <FaTrashAlt size={11} />
                                        </button>
                                    )}
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
