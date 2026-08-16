import { motion } from 'framer-motion';
import { FaComments } from 'react-icons/fa';
import useChat from '../hooks/useChat';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';

const Chat = () => {
    const {
        currentUser,
        otherUsers,
        usersLoading,
        incoming,
        chats,
        relationshipMap,
        selectedChat,
        selectedChatId,
        setSelectedChatId,
        sendRequest,
        acceptRequest,
        declineRequest,
        removeFriend,
    } = useChat();

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 shadow-2xl text-white"
            >
                <motion.div
                    className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute right-16 bottom-0 w-24 h-24 rounded-full bg-white/10"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.5,
                    }}
                />

                <div className="relative flex items-center gap-3">
                    <FaComments className="text-3xl" />
                    <h1 className="text-4xl font-extrabold">
                        Study Buddy Chat
                    </h1>
                </div>
                <p className="relative mt-2 text-indigo-100">
                    Connect with fellow SSC aspirants — send a request, get
                    accepted, and chat freely.
                </p>
            </motion.div>

            {/* CHAT PANEL */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-[340px_1fr] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl"
                style={{ height: '72vh', minHeight: 520 }}
            >
                <div className="border-b md:border-b-0 md:border-r border-slate-200/70 dark:border-slate-800 h-full overflow-hidden">
                    <ChatSidebar
                        chats={chats}
                        currentUser={currentUser}
                        incoming={incoming}
                        otherUsers={otherUsers}
                        usersLoading={usersLoading}
                        relationshipMap={relationshipMap}
                        selectedChatId={selectedChatId}
                        onSelectChat={setSelectedChatId}
                        onSendRequest={sendRequest}
                        onAccept={acceptRequest}
                        onDecline={declineRequest}
                    />
                </div>

                <div className="hidden md:flex h-full overflow-hidden">
                    <ChatWindow
                        key={selectedChat?.id || 'empty'}
                        chat={selectedChat}
                        currentUser={currentUser}
                        onRemoveFriend={removeFriend}
                    />
                </div>

                {/* Mobile: show chat window only once a chat is selected */}
                {selectedChat && (
                    <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-2 p-3 border-b border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => setSelectedChatId(null)}
                                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 px-2"
                            >
                                ← Back
                            </button>
                        </div>
                        <div className="h-[calc(100%-52px)]">
                            <ChatWindow
                                key={selectedChat.id}
                                chat={selectedChat}
                                currentUser={currentUser}
                                onRemoveFriend={removeFriend}
                            />
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Chat;
