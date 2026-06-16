// import { useEffect, useMemo, useState } from 'react';
// import { collection, onSnapshot } from 'firebase/firestore';
// import { db } from '../services/firebase';

import WorkInProgress from './WorkInProgress';

// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     Tooltip,
//     ResponsiveContainer,
// } from 'recharts';
// import SubjectComparisonPanel from './subjectWiseComp';
// import { getUserMocks } from '../utils/mockHelpers';

// const COLORS = [
//     '#3B82F6', // blue
//     '#F97316', // orange
//     '#10B981', // green
//     '#EF4444', // red
//     '#A855F7', // purple
// ];

// export default function CompareUsers() {
//     const [users, setUsers] = useState([]);
//     const [mocks, setMocks] = useState([]);
//     const [selectedUsers, setSelectedUsers] = useState([]);

//     // ================= DATA =================
//     useEffect(() => {
//         const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
//             setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() })));
//         });

//         const unsubMocks = onSnapshot(collection(db, 'mocks'), (snap) => {
//             setMocks(snap.docs.map((d) => d.data()));
//         });

//         return () => {
//             unsubUsers();
//             unsubMocks();
//         };
//     }, []);

//     const userMap = useMemo(() => {
//         const map = {};
//         users.forEach((u) => (map[u.uid] = u));
//         return map;
//     }, [users]);

//     const mockMap = useMemo(() => {
//         const map = {};

//         mocks.forEach((m) => {
//             if (!m.userId) return;

//             if (!map[m.userId]) map[m.userId] = [];

//             map[m.userId].push({
//                 score: Number(m.totalScore || 0),
//                 accuracy: Number(m.accuracy || 0),
//                 date: m.date?.toDate ? m.date.toDate() : new Date(m.date),
//             });
//         });

//         Object.values(map).forEach((arr) =>
//             arr.sort((a, b) => a.date - b.date)
//         );

//         return map;
//     }, [mocks]);

//     // ================= TOGGLE =================
//     const toggleUser = (uid) => {
//         setSelectedUsers((prev) =>
//             prev.includes(uid)
//                 ? prev.filter((id) => id !== uid)
//                 : prev.length < 5
//                   ? [...prev, uid]
//                   : prev
//         );
//     };

//     // ================= CHART DATA =================
//     const chartData = useMemo(() => {
//         let max = 0;

//         const series = selectedUsers.map((uid) => {
//             const data = mockMap[uid] || [];
//             max = Math.max(max, data.length);

//             return { uid, data };
//         });

//         return Array.from({ length: max }, (_, i) => {
//             const row = { mock: i + 1 };

//             series.forEach((s) => {
//                 row[s.uid] = s.data[i]?.score ?? null;
//             });

//             return row;
//         });
//     }, [selectedUsers, mockMap]);

//     // ================= INSIGHTS =================
//     const insights = useMemo(() => {
//         if (!selectedUsers.length) return [];

//         const stats = selectedUsers.map((uid) => {
//             const data = mockMap[uid] || [];

//             const avg =
//                 data.reduce((s, m) => s + m.score, 0) / (data.length || 1);

//             const best = Math.max(...data.map((m) => m.score), 0);

//             return {
//                 uid,
//                 name: userMap[uid]?.displayName || 'Unknown',
//                 avg,
//                 best,
//                 count: data.length,
//             };
//         });

//         const top = [...stats].sort((a, b) => b.avg - a.avg)[0];
//         const best = [...stats].sort((a, b) => b.best - a.best)[0];
//         const most = [...stats].sort((a, b) => b.count - a.count)[0];

//         return [
//             `🏆 Best Average Performer: ${top?.name}`,
//             `🔥 Highest Peak Score: ${best?.name}`,
//             `📊 Most Consistent Practice: ${most?.name}`,
//         ];
//     }, [selectedUsers, mockMap, userMap]);

//     console.log('Mocks:', mocks);
//     console.log('Users:', users);
//     console.log('Selected Users:', selectedUsers);
//     console.log('Mock Map:', mockMap);

//     // ================= UI =================
//     return (
//         <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 space-y-6">
//             {/* HEADER */}
//             <div className="rounded-2xl p-6 text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 shadow-lg">
//                 <h1 className="text-2xl font-bold">Compare Students</h1>
//                 <p className="text-white/80 text-sm mt-1">
//                     Select users to compare their performance trends
//                 </p>
//             </div>

//             {/* USER SELECT */}
//             <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {users.map((u) => {
//                     const active = selectedUsers.includes(u.uid);

//                     return (
//                         <div
//                             key={u.uid}
//                             onClick={() => toggleUser(u.uid)}
//                             className={`
//                                 flex items-center gap-3 p-3 rounded-xl cursor-pointer
//                                 border transition-all duration-200
//                                 ${
//                                     active
//                                         ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
//                                         : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:shadow-md'
//                                 }
//                             `}
//                         >
//                             {u.photoURL ? (
//                                 <img
//                                     src={u.photoURL}
//                                     className="w-10 h-10 rounded-full object-cover border"
//                                 />
//                             ) : (
//                                 <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
//                                     {u.displayName?.[0] || 'U'}
//                                 </div>
//                             )}

//                             <span className="font-medium">{u.displayName}</span>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* CHART */}
//             <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl">
//                 <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
//                     Score Comparison
//                 </h2>

//                 <ResponsiveContainer width="100%" height={380}>
//                     <LineChart data={chartData}>
//                         <XAxis dataKey="mock" />
//                         <YAxis />
//                         <Tooltip />

//                         {selectedUsers.map((uid, idx) => (
//                             <Line
//                                 key={uid}
//                                 type="monotone"
//                                 dataKey={uid}
//                                 stroke={COLORS[idx % COLORS.length]}
//                                 strokeWidth={3}
//                                 dot={false}
//                             />
//                         ))}
//                     </LineChart>
//                 </ResponsiveContainer>
//             </div>

//             {/* INSIGHTS */}
//             <div className="rounded-2xl p-6 text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
//                 <h2 className="text-lg font-bold mb-3">Insights</h2>

//                 <div className="space-y-2">
//                     {insights.map((i, idx) => (
//                         <div
//                             key={idx}
//                             className="bg-white/10 p-2 rounded-lg text-sm"
//                         >
//                             {i}
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <SubjectComparisonPanel
//                 selectedUsers={selectedUsers}
//                 users={users}
//                 getUserMocks={mockMap}
//             />
//         </div>
//     );
// }

const Reports = () => {
    return (
        <WorkInProgress
            title="Reports Dashboard"
            subtitle="Advanced analytics dashboard coming soon"
        />
    );
};

export default Reports;
