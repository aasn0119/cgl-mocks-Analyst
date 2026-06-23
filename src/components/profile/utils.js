export const getTimestamp = (mock) => {
    const ts = mock.createdAt;

    if (!ts) return new Date(mock.date).getTime();

    if (typeof ts.toMillis === 'function') return ts.toMillis();

    return ts.seconds * 1000 + (ts.nanoseconds || 0) / 1000000;
};

export const formatDate = (t) => {
    if (!t) return 'N/A';

    if (t?.toDate)
        return t.toDate().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

    return new Date(t).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};
