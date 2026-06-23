const ChartCard = ({ title, icon, children, legend }) => (
    <div
        style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '20px 20px 14px',
        }}
    >
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
            }}
        >
            <span style={{ fontSize: 18 }}>{icon}</span>

            <span
                style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: 'var(--text)',
                }}
            >
                {title}
            </span>
        </div>

        {legend && (
            <div
                style={{
                    display: 'flex',
                    gap: 14,
                    flexWrap: 'wrap',
                    marginBottom: 12,
                    marginTop: 6,
                }}
            >
                {legend.map((l, i) => (
                    <span
                        key={i}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 11,
                            color: '#888',
                        }}
                    >
                        <span
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: l.color,
                                display: 'inline-block',
                            }}
                        />
                        {l.label}
                    </span>
                ))}
            </div>
        )}

        {children}
    </div>
);

export default ChartCard;
