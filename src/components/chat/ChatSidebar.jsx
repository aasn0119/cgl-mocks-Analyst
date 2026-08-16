import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaComments,
    FaUserClock,
    FaUserPlus,
    FaSearch,
    FaCheck,
    FaTimes,
    FaPaperPlane,
} from 'react-icons/fa';

const Avatar = ({ src, name, size = 'w-11 h-11', online }) => {
    const initials = (name || '?')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className={`relative shrink-0 ${size}`}>
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className={`${size} rounded-full object-cover ring-2 ring-white/50 dark:ring-slate-800`}
                />
            ) : (
                <div
                    className={`${size} rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm ring-2 ring-white/50 dark:ring-slate-800`}
                >
                    {initials}
                </div>
            )}
            {online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
            )}
        </div>
    );
};

const TABS = [
    { id: 'chats', label: 'Chats', icon: FaComments },
    { id: 'requests', label: 'Requests', icon: FaUserClock },
    { id: 'people', label: 'Find People', icon: FaUserPlus },
];

const ChatSidebar = ({
    chats,
    currentUser,
    incoming,
    otherUsers,
    usersLoading,
    relationshipMap,
    selectedChatId,
    onSelectChat,
    onSendRequest,
    onAccept,
    onDecline,
}) => {
    const [tab, setTab] = useState('chats');
    const [search, setSearch] = useState('');

    const filteredPeople = useMemo(() => {
        const q = search.trim().toLowerCase();
        return otherUsers.filter((u) =>
            (u.displayName || '').toLowerCase().includes(q)
        );
    }, [otherUsers, search]);

    const otherOf = (chat) =>
        chat.participants.find((p) => p !== currentUser?.uid);

    return (
        <div className="flex flex-col h-full">
            {/* TABS */}
            <div className="flex gap-1 p-2 border-b border-slate-200/70 dark:border-slate-800">
                {TABS.map((t) => {
                    const Icon = t.icon;
                    const isActive = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className="relative flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="chat-tab-pill"
                                    className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span
                                className={`relative z-10 flex items-center gap-1.5 ${
                                    isActive
                                        ? 'text-white'
                                        : 'text-slate-500 dark:text-slate-400'
                                }`}
                            >
                                <Icon />
                                {t.id === 'requests' && incoming.length > 0 && (
                                    <span className="absolute -top-2 -right-3 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center animate-pulse">
                                        {incoming.length}
                                    </span>
                                )}
                            </span>
                            <span
                                className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
                            >
                                {t.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {tab === 'chats' && (
                        <motion.div
                            key="chats"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.15 }}
                            className="divide-y divide-slate-100 dark:divide-slate-800/70"
                        >
                            {chats.length === 0 ? (
                                <EmptyState
                                    icon={<FaComments size={28} />}
                                    text="No conversations yet. Find people and send a request to start chatting."
                                />
                            ) : (
                                chats.map((chat) => {
                                    const uid = otherOf(chat);
                                    const info = chat.participantInfo?.[uid];
                                    const isSelected =
                                        chat.id === selectedChatId;
                                    return (
                                        <motion.button
                                            key={chat.id}
                                            onClick={() =>
                                                onSelectChat(chat.id)
                                            }
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                                isSelected
                                                    ? 'bg-indigo-50 dark:bg-indigo-500/10'
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                            }`}
                                        >
                                            <Avatar
                                                src={info?.photo}
                                                name={info?.name}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">
                                                    {info?.name || 'Student'}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    {chat.lastMessage ||
                                                        'Say hello 👋'}
                                                </p>
                                            </div>
                                        </motion.button>
                                    );
                                })
                            )}
                        </motion.div>
                    )}

                    {tab === 'requests' && (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.15 }}
                            className="divide-y divide-slate-100 dark:divide-slate-800/70"
                        >
                            {incoming.length === 0 ? (
                                <EmptyState
                                    icon={<FaUserClock size={28} />}
                                    text="No pending requests right now."
                                />
                            ) : (
                                incoming.map((req) => (
                                    <div
                                        key={req.id}
                                        className="flex items-center gap-3 px-4 py-3"
                                    >
                                        <Avatar
                                            src={req.fromPhoto}
                                            name={req.fromName}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">
                                                {req.fromName}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                wants to chat
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => onAccept(req)}
                                                className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition"
                                                title="Accept"
                                            >
                                                <FaCheck size={12} />
                                            </motion.button>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => onDecline(req)}
                                                className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300 flex items-center justify-center hover:bg-rose-200 dark:hover:bg-rose-500/25 transition"
                                                title="Decline"
                                            >
                                                <FaTimes size={12} />
                                            </motion.button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {tab === 'people' && (
                        <motion.div
                            key="people"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.15 }}
                        >
                            <div className="p-3 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search students..."
                                        className="w-full pl-9 pr-3 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-400 outline-none text-slate-700 dark:text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
                                {usersLoading ? (
                                    <EmptyState text="Loading students..." />
                                ) : filteredPeople.length === 0 ? (
                                    <EmptyState text="No students found." />
                                ) : (
                                    filteredPeople.map((u) => {
                                        const rel =
                                            relationshipMap[u.uid] || 'none';
                                        return (
                                            <div
                                                key={u.uid}
                                                className="flex items-center gap-3 px-4 py-3"
                                            >
                                                <Avatar
                                                    src={u.photoURL}
                                                    name={u.displayName}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">
                                                        {u.displayName}
                                                    </p>
                                                </div>
                                                <RequestActionButton
                                                    status={rel}
                                                    onClick={() =>
                                                        onSendRequest(u)
                                                    }
                                                />
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const RequestActionButton = ({ status, onClick }) => {
    if (status === 'friends')
        return (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                Connected
            </span>
        );

    if (status === 'pending_sent')
        return (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                Requested
            </span>
        );

    if (status === 'pending_received')
        return (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                Check Requests
            </span>
        );

    return (
        <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={onClick}
            className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-shadow"
        >
            <FaPaperPlane size={9} />
            Add
        </motion.button>
    );
};

const EmptyState = ({ icon, text }) => (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
        {icon && (
            <div className="text-slate-300 dark:text-slate-600">{icon}</div>
        )}
        <p className="text-sm text-slate-400 dark:text-slate-500">{text}</p>
    </div>
);

export default ChatSidebar;
export { Avatar };
