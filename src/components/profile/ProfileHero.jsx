const ProfileHero = ({
    userData,
    initials,
    stats,
    readinessColor,
    formatDate,
}) => {
    return (
        <div
            style={{
                background:
                    'linear-gradient(135deg, #26215C 0%, #534AB7 50%, #185FA5 100%)',
                borderRadius: 24,
                padding: '28px 32px',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 220,
                    height: 220,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    bottom: -70,
                    right: 120,
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                    pointerEvents: 'none',
                }}
            />

            {userData?.photoURL ? (
                <img
                    src={userData.photoURL}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 16,
                        border: '2px solid rgba(255,255,255,0.25)',
                        objectFit: 'cover',
                        flexShrink: 0,
                    }}
                    alt="avatar"
                />
            ) : (
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 16,
                        border: '2px solid rgba(255,255,255,0.25)',
                        background: 'rgba(255,255,255,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        fontWeight: 700,
                        color: '#fff',
                        flexShrink: 0,
                    }}
                >
                    {initials}
                </div>
            )}

            <div>
                <h1
                    style={{
                        fontSize: 26,
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: 4,
                    }}
                >
                    {userData?.displayName || 'Student'}
                </h1>

                <p
                    style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: 13,
                        marginBottom: 12,
                    }}
                >
                    📅 Joined {formatDate(userData?.joinedAt)}
                </p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                        {
                            label: `🔥 ${stats.currentStreak}-day streak`,
                            bg: 'rgba(239,159,39,0.25)',
                            color: '#FAC775',
                        },
                        {
                            label: `🎯 ${stats.readiness}`,
                            bg: readinessColor + '33',
                            color:
                                readinessColor === '#378ADD'
                                    ? '#85B7EB'
                                    : readinessColor,
                        },
                        {
                            label: `📋 ${stats.totalMocks} mocks`,
                            bg: 'rgba(127,119,221,0.3)',
                            color: '#AFA9EC',
                        },
                    ].map((b, i) => (
                        <span
                            key={i}
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                padding: '4px 12px',
                                borderRadius: 99,
                                background: b.bg,
                                color: b.color,
                            }}
                        >
                            {b.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileHero;
