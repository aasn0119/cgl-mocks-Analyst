import { C } from './constants';

const GoalTracker = ({ stats, TARGET_SCORE }) => {
    const achieved = stats.goalGap <= 0;
    const overshoot = Math.abs(stats.goalGap); // pts above target, if achieved
    const displayPercent = Math.min(stats.progressPercent, 100); // cap bar width
    const actualPercent = stats.progressPercent; // real number, could be >100

    return (
        <div
            style={{
                background: 'var(--card)',
                border: achieved
                    ? `1px solid ${C.teal}55`
                    : '1px solid var(--border)',
                borderRadius: 20,
                padding: '20px 24px',
                marginBottom: 24,
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
            }}
        >
            {/* Subtle celebratory glow in the background when achieved */}
            {achieved && (
                <div
                    style={{
                        position: 'absolute',
                        top: -40,
                        right: -40,
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${C.teal}22, transparent 70%)`,
                        pointerEvents: 'none',
                    }}
                />
            )}

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    flexWrap: 'wrap',
                    gap: 8,
                    position: 'relative',
                }}
            >
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                    {achieved ? '🏆' : '🎯'} Goal Tracker — Target:{' '}
                    {TARGET_SCORE}
                </span>

                {achieved ? (
                    <span
                        style={{
                            fontSize: 13,
                            color: C.teal,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        ✅ Goal Achieved
                        {overshoot > 0 && (
                            <span
                                style={{
                                    background: `${C.teal}22`,
                                    color: C.teal,
                                    borderRadius: 20,
                                    padding: '2px 8px',
                                    fontSize: 11.5,
                                    fontWeight: 700,
                                }}
                            >
                                +{overshoot} pts above target
                            </span>
                        )}
                    </span>
                ) : (
                    <span style={{ fontSize: 13, color: '#888' }}>
                        Gap:{' '}
                        <b style={{ color: C.amber }}>{stats.goalGap} pts</b> ·{' '}
                        Progress:{' '}
                        <b style={{ color: C.teal }}>
                            {stats.progressPercent}%
                        </b>
                    </span>
                )}
            </div>

            <div
                style={{
                    height: 10,
                    background: 'rgba(255,255,255,0.07)',
                    borderRadius: 5,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${displayPercent}%`,
                        borderRadius: 5,
                        background: achieved
                            ? `linear-gradient(90deg, ${C.teal}, ${C.teal})`
                            : `linear-gradient(90deg, ${C.red}, ${C.amber}, ${C.teal})`,
                        boxShadow: achieved ? `0 0 10px ${C.teal}88` : 'none',
                        transition: 'width 1.2s ease, box-shadow 0.4s ease',
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
                <span>{Math.round(TARGET_SCORE * 0.5)}</span>
                <span>{Math.round(TARGET_SCORE * 0.75)}</span>
                <span style={{ color: achieved ? C.teal : '#666' }}>
                    {TARGET_SCORE} {achieved && '✓'}
                </span>
            </div>

            {achieved && actualPercent > 100 && (
                <div
                    style={{
                        marginTop: 10,
                        fontSize: 11.5,
                        color: 'rgba(255,255,255,0.45)',
                        textAlign: 'right',
                    }}
                >
                    You're performing at{' '}
                    <b style={{ color: C.teal }}>{actualPercent}%</b> of your
                    target — keep it up!
                </div>
            )}
        </div>
    );
};

export default GoalTracker;
