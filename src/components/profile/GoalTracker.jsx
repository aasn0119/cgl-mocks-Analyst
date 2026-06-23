import { C } from './constants';

const GoalTracker = ({ stats, TARGET_SCORE }) => {
    return (
        <div
            style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '20px 24px',
                marginBottom: 24,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    flexWrap: 'wrap',
                    gap: 8,
                }}
            >
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                    🎯 Goal Tracker — Target: {TARGET_SCORE}
                </span>

                <span style={{ fontSize: 13, color: '#888' }}>
                    Gap: <b style={{ color: C.amber }}>{stats.goalGap} pts</b> ·{' '}
                    Progress:{' '}
                    <b style={{ color: C.teal }}>{stats.progressPercent}%</b>
                </span>
            </div>

            <div
                style={{
                    height: 10,
                    background: 'rgba(255,255,255,0.07)',
                    borderRadius: 5,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${stats.progressPercent}%`,
                        borderRadius: 5,
                        background: `linear-gradient(90deg, ${C.red}, ${C.amber}, ${C.teal})`,
                        transition: 'width 1.2s ease',
                    }}
                />
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: '#666',
                    marginTop: 6,
                }}
            >
                <span>0</span>
                <span>80</span>
                <span>120</span>
                <span>{TARGET_SCORE}</span>
            </div>
        </div>
    );
};

export default GoalTracker;
