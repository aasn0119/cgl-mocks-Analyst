import DashboardCard from './DashboardCard';

const StatsGrid = ({ stats }) => {
    const cards = [
        {
            title: 'Total Mocks',
            value: stats.totalMocks,
            icon: '📚',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Best Score',
            value: stats.bestScore,
            icon: '🏆',
            color: 'from-emerald-500 to-green-500',
        },
        {
            title: 'Avg Accuracy',
            value: `${stats.avgAccuracy}%`,
            icon: '✅',
            color: 'from-cyan-500 to-sky-500',
        },
        {
            title: 'Improvement',
            value: `${stats.improvement}%`,
            icon: '🚀',
            color: 'from-fuchsia-500 to-purple-600',
        },
        {
            title: 'Current Streak',
            value: stats.currentStreak,
            icon: '🔥',
            color: 'from-amber-500 to-orange-500',
        },
        {
            title: 'Best Streak',
            value: stats.bestStreak,
            icon: '🏅',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            title: 'Readiness',
            value: stats.readiness,
            icon: '🎓',
            color: 'from-teal-500 to-emerald-500',
        },
        {
            title: 'Predicted Score',
            value: stats.predictedScore,
            icon: '🔮',
            color: 'from-violet-500 to-indigo-600',
        },
        {
            title: 'Avg Percentile',
            value: `${stats.avgPercentile}%`,
            icon: '⭐',
            color: 'from-sky-500 to-indigo-500',
        },
    ];

    return (
        <div
            className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-5
      "
        >
            {cards.map((card) => (
                <DashboardCard key={card.title} {...card} />
            ))}
        </div>
    );
};

export default StatsGrid;
