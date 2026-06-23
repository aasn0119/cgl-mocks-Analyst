const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div
            style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 12,
                color: 'var(--text)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
        >
            <p style={{ fontWeight: 600, marginBottom: 6, color: '#aaa' }}>
                {label}
            </p>

            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color, margin: '2px 0' }}>
                    {p.name}:{' '}
                    <b>
                        {typeof p.value === 'number'
                            ? p.value.toFixed(1)
                            : p.value}
                    </b>
                </p>
            ))}
        </div>
    );
};

export default CustomTooltip;
