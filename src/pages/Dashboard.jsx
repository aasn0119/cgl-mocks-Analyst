// import { useEffect, useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { db } from '../services/firebase';

// import { collection, query, where, onSnapshot } from 'firebase/firestore';

// const Dashboard = () => {
//     const { user } = useAuth();
//     const [mocks, setMocks] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!user) return;

//         const q = query(
//             collection(db, 'mocks'),
//             where('userId', '==', user.uid)
//         );

//         const unsub = onSnapshot(q, (snapshot) => {
//             const data = snapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));

//             setMocks(data);
//             setLoading(false);
//         });

//         return () => unsub();
//     }, [user]);

//     // ================= SAFE CALCULATIONS =================

//     const totalMocks = mocks.length;

//     const avgScore =
//         totalMocks > 0
//             ? (
//                   mocks.reduce((sum, m) => sum + Number(m.totalScore || 0), 0) /
//                   totalMocks
//               ).toFixed(2)
//             : 0;

//     const bestScore =
//         totalMocks > 0
//             ? Math.max(...mocks.map((m) => Number(m.totalScore || 0)))
//             : 0;

//     const avgAccuracy =
//         totalMocks > 0
//             ? (
//                   mocks.reduce((sum, m) => sum + Number(m.accuracy || 0), 0) /
//                   totalMocks
//               ).toFixed(2)
//             : 0;

//     // FIXED DATE SORTING
//     const recentMocks = [...mocks]
//         .sort((a, b) => new Date(b.date) - new Date(a.date))
//         .slice(0, 5);

//     console.log('Recent Mocks:', recentMocks); // Debugging line
//     // ================= LOADING STATE =================

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-[60vh] text-gray-500">
//                 Loading dashboard...
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* HEADER */}
//             <div className="mb-8">
//                 <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 shadow-2xl text-white">
//                     <h1 className="text-4xl font-extrabold">Welcome Back 👋</h1>

//                     <p className="mt-2 text-indigo-100">
//                         Track your mock test performance and growth.
//                     </p>
//                 </div>
//             </div>

//             {/* STATS CARDS */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <Card
//                     title="Total Mocks"
//                     value={totalMocks}
//                     color="from-blue-500 to-cyan-500"
//                 />

//                 <Card
//                     title="Average Score"
//                     value={avgScore}
//                     color="from-purple-500 to-pink-500"
//                 />

//                 <Card
//                     title="Best Score"
//                     value={bestScore}
//                     color="from-emerald-500 to-green-500"
//                 />

//                 <Card
//                     title="Accuracy"
//                     value={`${avgAccuracy}%`}
//                     color="from-orange-500 to-red-500"
//                 />
//             </div>

//             {/* RECENT MOCKS */}
//             <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 rounded-3xl shadow-xl p-6">
//                 <div className="flex items-center gap-3 mb-6">
//                     <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
//                         📈
//                     </div>

//                     <div>
//                         <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
//                             Recent Mocks
//                         </h2>

//                         <p className="text-sm text-slate-500 dark:text-slate-400">
//                             Latest performance snapshots
//                         </p>
//                     </div>
//                 </div>

//                 {recentMocks.length === 0 ? (
//                     <div className="text-center py-10">
//                         <div className="text-5xl mb-3">📊</div>

//                         <p className="text-slate-500">
//                             No mock tests added yet.
//                         </p>

//                         <p className="text-sm text-slate-400 mt-2">
//                             Start adding your scores to track progress.
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="space-y-3">
//                         {recentMocks.map((m) => (
//                             <div
//                                 key={m.id}
//                                 className="
//                                     flex items-center justify-between
//                                     p-4 rounded-2xl
//                                     bg-gradient-to-r from-white to-blue-50
//                                     dark:from-slate-800 dark:to-slate-700
//                                     shadow-md hover:shadow-xl
//                                     hover:scale-[1.02]
//                                     transition-all duration-300
//                                 "
//                             >
//                                 <div>
//                                     <p className="font-semibold text-slate-800 dark:text-white">
//                                         {m.platform}
//                                     </p>

//                                     <p className="text-sm text-slate-500">
//                                         {m.date}
//                                     </p>
//                                 </div>

//                                 <div className="flex gap-6">
//                                     <div>
//                                         <p className="text-xs text-gray-500">
//                                             Score
//                                         </p>

//                                         <p className="font-bold text-indigo-600">
//                                             {m.totalScore}
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <p className="text-xs text-gray-500">
//                                             Accuracy
//                                         </p>

//                                         <p className="font-bold text-green-600">
//                                             {m.accuracy}%
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// // ===== CARD COMPONENT =====
// const Card = ({ title, value, color }) => {
//     return (
//         <div
//             className={`
//                 bg-gradient-to-r ${color}
//                 rounded-2xl p-6
//                 text-white shadow-lg
//                 hover:scale-105 hover:shadow-2xl
//                 transition-all duration-300
//             `}
//         >
//             <p className="text-sm opacity-90">{title}</p>

//             <h2 className="text-4xl font-bold mt-3">{value}</h2>
//         </div>
//     );
// };

// export default Dashboard;

import useDashboardStats from '../hooks/useDashboardStats';

import HeroSection from '../components/dashboard/HeroSection';
import TargetTracker from '../components/dashboard/TargetTracker';
import StatsGrid from '../components/dashboard/StatsGrid';
import SubjectAverages from '../components/dashboard/SubjectAverages';
import PerformanceCharts from '../components/dashboard/PerformanceCharts';
import RecentMocks from '../components/dashboard/RecentMocks';
import ReportsSection from '../components/dashboard/ReportsSection';
import RecordsTable from '../components/dashboard/RecordsTable';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    // console.log('User:', user); // Debugging line
    const {
        loading,
        mocks,
        stats,
        chartData,
        subjectTrend,
        subjectAverages,
        weeklyReport,
        monthlyReport,
        TARGET_SCORE,
    } = useDashboardStats();

    if (loading) {
        return (
            <div className="h-[70vh] flex items-center justify-center text-slate-500">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="space-y-10 p-4 md:p-8">
            {/* HERO */}
            <HeroSection
                userName={user?.displayName || ''}
                totalMocks={stats.totalMocks}
                readiness={stats.readiness}
                userId={user?.uid || ''}
            />

            {/* TARGET TRACKER */}
            <TargetTracker
                currentScore={stats.currentScore}
                avgScore={stats.avgScore}
                progressPercent={stats.progressPercent}
                goalGap={stats.goalGap}
                targetScore={TARGET_SCORE}
            />

            {/* STATS GRID */}
            <StatsGrid stats={stats} />

            {/* SUBJECT AVERAGES */}
            <SubjectAverages subjectAverages={subjectAverages} />

            {/* CHARTS */}
            <PerformanceCharts
                chartData={chartData}
                subjectAverages={subjectAverages}
                mocks={mocks}
                subjectTrend={subjectTrend}
            />

            {/* RECENT MOCKS */}
            <RecentMocks mocks={mocks} />

            {/* REPORTS */}
            <ReportsSection
                weeklyReport={weeklyReport}
                monthlyReport={monthlyReport}
                mocks={mocks}
            />

            {/* RECORDS TABLE */}
            {/* <RecordsTable mocks={mocks} /> */}
        </div>
    );
};

export default Dashboard;
