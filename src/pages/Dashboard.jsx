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
