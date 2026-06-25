const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const { date, platform } = payload[0].payload;

    // Format "2026-06-25" → "25 Jun 2026"
    const formattedDate = date
        ? new Date(date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })
        : null;

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
            {/* Header: date + platform */}
            <p style={{ fontWeight: 600, marginBottom: 2, color: '#aaa' }}>
                {formattedDate}
            </p>
            {platform && (
                <p style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>
                    {platform}
                </p>
            )}

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
