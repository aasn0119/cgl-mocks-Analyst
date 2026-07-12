import StatCard from './StatCard';
import { C } from './constants';

const StatsGrid = ({ stats, TARGET_SCORE }) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 12,
                marginBottom: 24,
            }}
        >
            <StatCard
                icon="📋"
                label="Total Mocks"
                value={stats.totalMocks}
                sub="attempts recorded"
                color={C.purple}
                progress={Math.min((stats.totalMocks / 200) * 100, 100)}
            />

            <StatCard
                icon="📊"
                label="Avg Score"
                value={stats.avgScore}
                sub="across all mocks"
                color={C.blue}
                progress={Number(stats.progressPercent)}
            />

            <StatCard
                icon="🏆"
                label="Best Score"
                value={stats.bestScore}
                sub="personal best"
                color={C.amber}
                progress={Math.min((stats.bestScore / 200) * 100, 100)}
            />

            <StatCard
                icon="🎯"
                label="Accuracy"
                value={`${stats.avgAccuracy}%`}
                sub="avg correct"
                color={C.teal}
                progress={Number(stats.avgAccuracy)}
            />

            <StatCard
                icon="📈"
                label="Percentile"
                value={`${stats.avgPercentile}`}
                sub="avg rank"
                color={C.pink}
                progress={Number(stats.avgPercentile)}
            />

            <StatCard
                icon="⚡"
                label="Improvement"
                value={`${stats.improvement}%`}
                sub="since first mock"
                color={C.coral}
                progress={Math.min(
                    Math.abs(parseFloat(stats.improvement)),
                    100
                )}
            />

            <StatCard
                icon="🔮"
                label="Predicted"
                value={stats.predictedScore}
                sub="next attempt"
                color={C.purple}
                progress={(stats.predictedScore / TARGET_SCORE) * 100}
            />

            <StatCard
                icon="🔥"
                label="Best Streak"
                value={`${stats.bestStreak}d`}
                sub="consecutive days"
                color={C.amber}
                progress={Math.min(stats.bestStreak * 5, 100)}
            />
        </div>
    );
};

export default StatsGrid;
