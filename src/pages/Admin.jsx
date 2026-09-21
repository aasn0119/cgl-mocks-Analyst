import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    BookOpenCheck,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    Clock3,
    FileText,
    Filter,
    MessageSquareText,
    Gauge,
    Layers3,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    Trash2,
    Trophy,
    Users,
    X,
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import {
    createAdminUser,
    deleteAdminUser,
    updateAdminUser,
} from '../services/adminService';
import {
    listenToFeedback,
    updateFeedbackStatus,
} from '../services/feedbackService';

const DAY = 24 * 60 * 60 * 1000;

const toDate = (value) => {
    if (!value) return null;
    if (typeof value.toDate === 'function') return value.toDate();

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
    const date = toDate(value);
    if (!date) return 'No date';

    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const formatRelative = (value) => {
    const date = toDate(value);
    if (!date) return 'Unknown time';

    const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / DAY));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
};

const getScore = (mock) => Number(mock.totalScore || 0);
const getTier = (mock) => (mock.tier === 'tier2' ? 'tier2' : 'tier1');

const ADMIN_TABS = ['Overview', 'Users', 'Activity', 'Feedback'];

const Admin = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [mocks, setMocks] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [feedbackFilter, setFeedbackFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('Overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [userForm, setUserForm] = useState(null);
    const [userActionError, setUserActionError] = useState('');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const unsubscribeUsers = onSnapshot(
            collection(db, 'users'),
            (snapshot) => {
                setUsers(
                    snapshot.docs.map((item) => ({
                        uid: item.id,
                        ...item.data(),
                    }))
                );
                setLoading(false);
            },
            () => {
                setError(true);
                setLoading(false);
            }
        );

        const unsubscribeMocks = onSnapshot(
            collection(db, 'mocks'),
            (snapshot) => {
                setMocks(
                    snapshot.docs.map((item) => ({
                        id: item.id,
                        ...item.data(),
                    }))
                );
            },
            () => setError(true)
        );

        const unsubscribeFeedback = listenToFeedback(
            (snapshot) => {
                setFeedback(
                    snapshot.docs.map((item) => ({
                        id: item.id,
                        ...item.data(),
                    }))
                );
            },
            () => setError(true)
        );

        return () => {
            unsubscribeUsers();
            unsubscribeMocks();
            unsubscribeFeedback();
        };
    }, []);

    const userMap = useMemo(
        () => new Map(users.map((user) => [user.uid, user])),
        [users]
    );

    const filteredMocks = useMemo(
        () =>
            mocks.filter(
                (mock) => tierFilter === 'all' || getTier(mock) === tierFilter
            ),
        [mocks, tierFilter]
    );

    const metrics = useMemo(() => {
        const recentCutoff = Date.now() - 30 * DAY;
        const recentMocks = filteredMocks.filter((mock) => {
            const date = toDate(mock.date || mock.createdAt);
            return date && date.getTime() >= recentCutoff;
        });
        const totalScore = filteredMocks.reduce(
            (sum, mock) => sum + getScore(mock),
            0
        );
        const activeUserIds = new Set(
            recentMocks.map((mock) => mock.userId).filter(Boolean)
        );

        return {
            totalUsers: users.length,
            activeUsers: activeUserIds.size,
            totalMocks: filteredMocks.length,
            recentMocks: recentMocks.length,
            averageScore: filteredMocks.length
                ? Math.round(totalScore / filteredMocks.length)
                : 0,
        };
    }, [filteredMocks, users.length]);

    const tierStats = useMemo(() => {
        const values = ['tier1', 'tier2'].map((tier) => {
            const tierMocks = mocks.filter((mock) => getTier(mock) === tier);
            const score = tierMocks.reduce(
                (sum, mock) => sum + getScore(mock),
                0
            );

            return {
                tier,
                count: tierMocks.length,
                average: tierMocks.length
                    ? Math.round(score / tierMocks.length)
                    : 0,
            };
        });

        const max = Math.max(...values.map((item) => item.count), 1);
        return values.map((item) => ({
            ...item,
            width: (item.count / max) * 100,
        }));
    }, [mocks]);

    const platformStats = useMemo(() => {
        const counts = filteredMocks.reduce((result, mock) => {
            const platform = mock.platform || 'Other';
            result[platform] = (result[platform] || 0) + 1;
            return result;
        }, {});

        const values = Object.entries(counts)
            .sort(([, first], [, second]) => second - first)
            .slice(0, 4);
        const max = Math.max(...values.map(([, count]) => count), 1);

        return values.map(([platform, count]) => ({
            platform,
            count,
            width: (count / max) * 100,
        }));
    }, [filteredMocks]);

    const userRows = useMemo(() => {
        const rows = users.map((user) => {
            const userMocks = filteredMocks.filter(
                (mock) => mock.userId === user.uid
            );
            const total = userMocks.reduce(
                (sum, mock) => sum + getScore(mock),
                0
            );
            const lastMock = userMocks
                .map((mock) => ({
                    mock,
                    date: toDate(mock.date || mock.createdAt),
                }))
                .sort(
                    (first, second) =>
                        (second.date?.getTime() || 0) -
                        (first.date?.getTime() || 0)
                )[0];

            return {
                ...user,
                mocks: userMocks.length,
                average: userMocks.length
                    ? Math.round(total / userMocks.length)
                    : 0,
                lastActive: lastMock?.date,
            };
        });

        return rows
            .filter((user) => {
                const query = search.trim().toLowerCase();
                return (
                    !query ||
                    user.displayName?.toLowerCase().includes(query) ||
                    user.email?.toLowerCase().includes(query)
                );
            })
            .sort((first, second) => second.mocks - first.mocks);
    }, [filteredMocks, search, users]);

    const recentActivity = useMemo(
        () =>
            [...filteredMocks]
                .sort(
                    (first, second) =>
                        (toDate(second.date || second.createdAt)?.getTime() ||
                            0) -
                        (toDate(first.date || first.createdAt)?.getTime() || 0)
                )
                .slice(0, 7),
        [filteredMocks]
    );

    const filteredFeedback = useMemo(
        () =>
            [...feedback]
                .filter(
                    (item) =>
                        feedbackFilter === 'all' ||
                        item.status === feedbackFilter
                )
                .sort(
                    (first, second) =>
                        (toDate(second.createdAt)?.getTime() || 0) -
                        (toDate(first.createdAt)?.getTime() || 0)
                ),
        [feedback, feedbackFilter]
    );

    const changeFeedbackStatus = async (item, status) => {
        try {
            await updateFeedbackStatus(item.id, status);
        } catch {
            setError(true);
        }
    };

    const openCreateUser = () => {
        setUserActionError('');
        setUserForm({
            isNew: true,
            uid: '',
            displayName: '',
            email: '',
            role: 'student',
        });
    };

    const openEditUser = (user) => {
        setUserActionError('');
        setUserForm({
            isNew: false,
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email || '',
            role: user.role === 'admin' ? 'admin' : 'student',
        });
    };

    const saveUser = async (event) => {
        event.preventDefault();
        setUserActionError('');

        try {
            if (!userForm.displayName.trim() || !userForm.email.trim()) {
                throw new Error('Name and email are required.');
            }

            if (!userForm.uid.trim()) {
                throw new Error('A Firebase user UID is required.');
            }

            if (!userForm.isNew) {
                await updateAdminUser(userForm.uid, {
                    displayName: userForm.displayName.trim(),
                    email: userForm.email.trim().toLowerCase(),
                    role: userForm.role,
                });
            } else {
                await createAdminUser(userForm);
            }

            setUserForm(null);
        } catch (actionError) {
            setUserActionError(actionError.message || 'Could not save user.');
        }
    };

    const removeUser = async (user) => {
        if (user.uid === currentUser?.uid) {
            setUserActionError(
                'The signed-in admin profile cannot be deleted.'
            );
            return;
        }

        if (
            !window.confirm(
                `Delete the profile for ${user.displayName || user.email}?`
            )
        )
            return;

        try {
            await deleteAdminUser(user.uid);
        } catch (actionError) {
            setUserActionError(actionError.message || 'Could not delete user.');
        }
    };

    const tabs = activeTab === 'Overview' ? 'grid' : 'hidden';

    return (
        <div className="min-h-[calc(100vh-5rem)] space-y-6 pb-10">
            <motion.section
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/10 md:p-8"
            >
                <div className="absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-cyan-400/15 to-transparent" />
                <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div>
                        <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                            <ShieldCheck size={15} /> Admin workspace
                        </div>
                        <h1 className="max-w-2xl text-3xl font-black tracking-tight md:text-5xl">
                            Command center for your learning network.
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                            A live view of learner activity, mock performance,
                            and the places that need attention.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
                        <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-emerald-300">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{' '}
                            Live data
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                            {formatDate(new Date())}
                        </span>
                    </div>
                </div>
            </motion.section>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    {ADMIN_TABS.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${activeTab === tab ? 'bg-slate-950 text-white shadow-md dark:bg-white dark:text-slate-950' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
                    <Filter size={15} className="ml-2 text-slate-400" />
                    {['all', 'tier1', 'tier2'].map((tier) => (
                        <button
                            key={tier}
                            type="button"
                            onClick={() => setTierFilter(tier)}
                            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${tierFilter === tier ? 'bg-cyan-500 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            {tier === 'all'
                                ? 'All tiers'
                                : tier === 'tier1'
                                  ? 'Tier 1'
                                  : 'Tier 2'}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                    <CircleAlert size={18} /> Live data could not be loaded.
                    Check your Firestore admin permissions.
                </div>
            )}

            <div
                className={`${tabs} grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4`}
            >
                <MetricCard
                    icon={Users}
                    label="Learners"
                    value={metrics.totalUsers}
                    detail={`${metrics.activeUsers} active in 30 days`}
                    accent="cyan"
                />
                <MetricCard
                    icon={FileText}
                    label="Mocks recorded"
                    value={metrics.totalMocks}
                    detail={`${metrics.recentMocks} submitted this month`}
                    accent="violet"
                />
                <MetricCard
                    icon={Gauge}
                    label="Average score"
                    value={metrics.averageScore}
                    detail="Across filtered attempts"
                    accent="amber"
                />
                <MetricCard
                    icon={Activity}
                    label="Network pulse"
                    value={`${metrics.totalUsers ? Math.round((metrics.activeUsers / metrics.totalUsers) * 100) : 0}%`}
                    detail="30-day learner activity"
                    accent="emerald"
                />
            </div>

            {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
                    <Panel
                        title="Attempt volume"
                        subtitle="Mock submissions by exam tier"
                        icon={BarChart3}
                    >
                        <div className="space-y-5 pt-4">
                            {tierStats.map((item, index) => (
                                <motion.div
                                    key={item.tier}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-bold text-slate-700 dark:text-slate-200">
                                            {item.tier === 'tier1'
                                                ? 'Tier 1'
                                                : 'Tier 2'}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {item.count} attempts ·{' '}
                                            {item.average} avg
                                        </span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${item.width}%`,
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                delay: index * 0.1,
                                            }}
                                            className={`h-full rounded-full ${item.tier === 'tier1' ? 'bg-cyan-500' : 'bg-violet-500'}`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                            {!mocks.length && (
                                <EmptyState label="No mock attempts yet" />
                            )}
                        </div>
                    </Panel>

                    <Panel
                        title="Platform mix"
                        subtitle="Where learners practice"
                        icon={Layers3}
                    >
                        <div className="space-y-4 pt-4">
                            {platformStats.map((item, index) => (
                                <div key={item.platform}>
                                    <div className="mb-1.5 flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                                        <span>{item.platform}</span>
                                        <span>{item.count}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${item.width}%`,
                                            }}
                                            transition={{
                                                duration: 0.7,
                                                delay: index * 0.08,
                                            }}
                                            className="h-full rounded-full bg-slate-950 dark:bg-cyan-400"
                                        />
                                    </div>
                                </div>
                            ))}
                            {!platformStats.length && (
                                <EmptyState label="Platform data will appear here" />
                            )}
                        </div>
                    </Panel>
                </div>
            )}

            {activeTab === 'Users' && (
                <UserPanel
                    rows={userRows}
                    search={search}
                    setSearch={setSearch}
                    navigate={navigate}
                    loading={loading}
                    onCreate={openCreateUser}
                    onEdit={openEditUser}
                    onDelete={removeUser}
                />
            )}

            {activeTab === 'Activity' && (
                <ActivityPanel activity={recentActivity} userMap={userMap} />
            )}

            {activeTab === 'Feedback' && (
                <FeedbackPanel
                    feedback={filteredFeedback}
                    filter={feedbackFilter}
                    setFilter={setFeedbackFilter}
                    onStatusChange={changeFeedbackStatus}
                />
            )}

            {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                    <UserPanel
                        rows={userRows.slice(0, 6)}
                        search={search}
                        setSearch={setSearch}
                        navigate={navigate}
                        loading={loading}
                        compact
                        onCreate={openCreateUser}
                        onEdit={openEditUser}
                        onDelete={removeUser}
                    />
                    <ActivityPanel
                        activity={recentActivity.slice(0, 5)}
                        userMap={userMap}
                    />
                </div>
            )}

            {userForm && (
                <UserFormModal
                    form={userForm}
                    setForm={setUserForm}
                    error={userActionError}
                    onSubmit={saveUser}
                    onClose={() => setUserForm(null)}
                />
            )}
        </div>
    );
};

const MetricCard = ({ icon: Icon, label, value, detail, accent }) => {
    const colors = {
        cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300',
        violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
        emerald:
            'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
    };

    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
            <div className="flex items-start justify-between">
                <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${colors[accent]}`}
                >
                    <Icon size={19} />
                </span>
                <ArrowUpRight size={17} className="text-slate-300" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <p className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {value}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {detail}
            </p>
        </motion.div>
    );
};

const Panel = ({ title, subtitle, icon: Icon, children }) => (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
        <div className="flex items-start justify-between gap-4">
            <div>
                <h2 className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                    <Icon size={18} className="text-cyan-500" />
                    {title}
                </h2>
                <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
            </div>
            <button
                type="button"
                title="Refresh data"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            >
                <RefreshCw size={16} />
            </button>
        </div>
        {children}
    </section>
);

const UserPanel = ({
    rows,
    search,
    setSearch,
    navigate,
    loading,
    compact = false,
    onCreate,
    onEdit,
    onDelete,
}) => (
    <Panel
        title="Learner health"
        subtitle="Practice intensity and average scores"
        icon={Users}
    >
        <div className="mt-4 flex gap-2">
            <div className="relative min-w-0 flex-1">
                <Search
                    size={16}
                    className="absolute left-3 top-2.5 text-slate-400"
                />
                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name or email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-cyan-900"
                />
            </div>
            <button
                type="button"
                onClick={onCreate}
                title="Create learner profile"
                className="flex shrink-0 items-center gap-1 rounded-xl bg-cyan-500 px-3 text-xs font-black text-white transition hover:bg-cyan-600"
            >
                <Plus size={15} /> Add
            </button>
        </div>
        <div className="mt-4 space-y-1">
            {loading && <EmptyState label="Loading learners..." />}
            {!loading && !rows.length && (
                <EmptyState label="No learners match this view" />
            )}
            {rows.map((user) => (
                <div
                    key={user.uid}
                    className="group flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/70"
                >
                    {user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt=""
                            className="h-9 w-9 rounded-xl object-cover"
                        />
                    ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-xs font-black text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300">
                            {(user.displayName || 'U')
                                .slice(0, 1)
                                .toUpperCase()}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => navigate(`/profile/${user.uid}`)}
                        className="min-w-0 flex-1 text-left"
                    >
                        <span className="block truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                            {user.displayName || 'Unknown learner'}
                        </span>
                        <span className="block truncate text-xs text-slate-400">
                            {user.mocks
                                ? `${user.mocks} mocks · last ${formatRelative(user.lastActive)}`
                                : 'No attempts yet'}
                        </span>
                    </button>
                    <span className="text-right">
                        <span className="block text-sm font-black text-slate-800 dark:text-white">
                            {user.average || '—'}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">
                            avg score
                        </span>
                    </span>
                    <button
                        type="button"
                        onClick={() => onEdit(user)}
                        title="Edit learner"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-cyan-500/10"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(user)}
                        title="Delete learner profile"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                    >
                        <Trash2 size={14} />
                    </button>
                    <ChevronRight
                        size={16}
                        className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-cyan-500"
                    />
                </div>
            ))}
        </div>
        {compact && rows.length > 0 && (
            <p className="mt-3 text-center text-xs text-slate-400">
                Showing the most active learners
            </p>
        )}
    </Panel>
);

const UserFormModal = ({ form, setForm, error, onSubmit, onClose }) => (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
        <motion.form
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onSubmit={onSubmit}
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-500">
                        Profile CRUD
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                        {form.uid ? 'Edit learner' : 'Create learner profile'}
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <X size={18} />
                </button>
            </div>
            <div className="mt-5 space-y-3">
                <label className="block text-xs font-bold text-slate-500">
                    Firebase UID
                    <input
                        required={!form.uid}
                        disabled={Boolean(form.uid)}
                        value={form.uid}
                        onChange={(event) =>
                            setForm({ ...form, uid: event.target.value.trim() })
                        }
                        placeholder="User document ID"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white disabled:opacity-60"
                    />
                </label>
                <label className="block text-xs font-bold text-slate-500">
                    Display name
                    <input
                        required
                        value={form.displayName}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                displayName: event.target.value,
                            })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                </label>
                <label className="block text-xs font-bold text-slate-500">
                    Email
                    <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                            setForm({ ...form, email: event.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                </label>
                <label className="block text-xs font-bold text-slate-500">
                    Role
                    <select
                        value={form.role}
                        onChange={(event) =>
                            setForm({ ...form, role: event.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                </label>
            </div>
            {error && (
                <p className="mt-3 text-xs font-semibold text-rose-600">
                    {error}
                </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-600 dark:bg-white dark:text-slate-950"
                >
                    <Pencil size={14} /> Save profile
                </button>
            </div>
        </motion.form>
    </div>
);

const ActivityPanel = ({ activity, userMap }) => (
    <Panel
        title="Recent activity"
        subtitle="Latest mock submissions"
        icon={Clock3}
    >
        <div className="mt-4 space-y-1">
            {!activity.length && (
                <EmptyState label="Activity will appear after the first mock" />
            )}
            {activity.map((mock) => {
                const user = userMap.get(mock.userId);
                return (
                    <div
                        key={mock.id}
                        className="flex items-center gap-3 rounded-2xl px-2 py-3"
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-cyan-300">
                            <BookOpenCheck size={16} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                                {user?.displayName || 'Unknown learner'}{' '}
                                submitted a mock
                            </p>
                            <p className="text-xs text-slate-400">
                                {formatRelative(mock.date || mock.createdAt)} ·{' '}
                                {mock.platform || 'Other'}
                            </p>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-black text-emerald-600">
                            <Trophy size={13} />
                            {getScore(mock)}
                        </span>
                    </div>
                );
            })}
        </div>
    </Panel>
);

const FeedbackPanel = ({ feedback, filter, setFilter, onStatusChange }) => (
    <Panel
        title="Learner feedback"
        subtitle="Reviews, ideas, and reported issues from the app"
        icon={MessageSquareText}
    >
        <div className="mt-4 flex flex-wrap gap-2">
            {['all', 'open', 'reviewed', 'resolved'].map((value) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold capitalize transition ${filter === value ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-500 hover:text-cyan-600 dark:bg-slate-800 dark:text-slate-400'}`}
                >
                    {value === 'all' ? 'All feedback' : value}
                </button>
            ))}
        </div>
        <div className="mt-5 space-y-3">
            {!feedback.length && (
                <EmptyState label="No feedback matches this filter" />
            )}
            {feedback.map((item) => (
                <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-950/40"
                >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">
                                    {item.userName || 'Student'}
                                </h3>
                                <span className="text-xs text-slate-400">
                                    {item.userEmail}
                                </span>
                                <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                                    {item.category}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-400">
                                {formatRelative(item.createdAt)} ·{' '}
                                {'★'.repeat(Number(item.rating || 0))}
                            </p>
                        </div>
                        <select
                            value={item.status || 'open'}
                            onChange={(event) =>
                                onStatusChange(item, event.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold capitalize text-slate-600 outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        >
                            <option value="open">Open</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {item.message}
                    </p>
                </article>
            ))}
        </div>
    </Panel>
);

const EmptyState = ({ label }) => (
    <div className="flex items-center justify-center gap-2 py-8 text-xs font-semibold text-slate-400">
        <CheckCircle2 size={15} />
        {label}
    </div>
);

export default Admin;
