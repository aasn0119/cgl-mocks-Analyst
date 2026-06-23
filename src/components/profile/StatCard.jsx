const StatCard = ({ icon, label, value, sub, color, progress }) => (
    <div
        style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '16px',
            transition: 'transform 0.2s',
            cursor: 'default',
        }}
        onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'translateY(-3px)')
        }
        onMouseLeave={(e) =>
            (e.currentTarget.style.transform = 'translateY(0)')
        }
    >
        <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>

        <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{label}</p>

        <h2 style={{ fontSize: 24, fontWeight: 700, color }}>{value}</h2>

        {sub && (
            <p style={{ fontSize: 11, color, opacity: 0.75, marginTop: 2 }}>
                {sub}
            </p>
        )}

        {progress !== undefined && (
            <div
                style={{
                    height: 4,
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    marginTop: 10,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: color,
                        borderRadius: 2,
                        transition: 'width 1s ease',
                    }}
                />
            </div>
        )}
    </div>
);

export default StatCard;
