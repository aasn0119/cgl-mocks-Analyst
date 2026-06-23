import { useState, useMemo } from 'react';
import ScorePill from './ScorePill';
import Delta from './Delta';
import { C } from './constants';

const ITEMS_PER_PAGE = 10;

const RecentMocksTable = ({ recentMocks, formatDate }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(recentMocks.length / ITEMS_PER_PAGE);

    const paginatedMocks = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;

        return recentMocks.slice(start, start + ITEMS_PER_PAGE);
    }, [recentMocks, currentPage]);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div
            style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '20px 24px',
                marginTop: 14,
            }}
        >
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
                📋 Recent Attempts
            </p>

            <div style={{ overflowX: 'auto' }}>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: 13,
                    }}
                >
                    <thead>
                        <tr>
                            {[
                                'Date',
                                'Platform',
                                'MockID / Name',
                                'Score',
                                'Quant',
                                'Reasoning',
                                'English',
                                'GK',
                                'Accuracy',
                                'Percentile',
                                'Δ Score',
                            ].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        textAlign: 'left',
                                        color: '#666',
                                        fontWeight: 500,
                                        fontSize: 11,
                                        paddingBottom: 10,
                                        borderBottom:
                                            '1px solid rgba(255,255,255,0.07)',
                                        paddingRight: 12,
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedMocks.map((m, i) => {
                            const globalIndex =
                                (currentPage - 1) * ITEMS_PER_PAGE + i;

                            const prev = recentMocks[globalIndex + 1];

                            const delta = prev
                                ? Number(m.totalScore) - Number(prev.totalScore)
                                : null;

                            return (
                                <tr
                                    key={m.id}
                                    style={{
                                        borderBottom:
                                            '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    <td
                                        style={{
                                            padding: '11px 12px 11px 0',
                                            color: '#999',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {formatDate(m.date)}
                                    </td>

                                    <td
                                        style={{
                                            paddingRight: 12,
                                        }}
                                    >
                                        <span
                                            style={{
                                                background:
                                                    'rgba(255,255,255,0.07)',
                                                borderRadius: 6,
                                                padding: '3px 8px',
                                                fontSize: 11,
                                                color: '#aaa',
                                            }}
                                        >
                                            {m.platform || '—'}
                                        </span>
                                    </td>

                                    <td
                                        style={{
                                            paddingRight: 12,
                                        }}
                                    >
                                        <span
                                            style={{
                                                background:
                                                    'rgba(255,255,255,0.07)',
                                                borderRadius: 6,
                                                padding: '3px 8px',
                                                fontSize: 11,
                                                color: C.teal,
                                            }}
                                        >
                                            {m.mockId || '—'}
                                        </span>
                                    </td>

                                    <td
                                        style={{
                                            paddingRight: 12,
                                        }}
                                    >
                                        <ScorePill
                                            score={Number(m.totalScore)}
                                        />
                                    </td>

                                    <td
                                        style={{
                                            paddingRight: 12,
                                            color: C.purple,
                                        }}
                                    >
                                        {m.quantScore ?? '—'}
                                    </td>

                                    <td
                                        style={{
                                            paddingRight: 12,
                                            color: C.amber,
                                        }}
                                    >
                                        {m.reasoningScore ?? '—'}
                                    </td>

                                    <td
                                        style={{
                                            paddingRight: 12,
                                            color: C.teal,
                                        }}
                                    >
                                        {m.englishScore ?? '—'}
                                    </td>

                                    <td
                                        style={{
                                            paddingRight: 12,
                                            color: C.red,
                                        }}
                                    >
                                        {m.gkScore ?? '—'}
                                    </td>

                                    <td
                                        style={{
                                            paddingRight: 12,
                                            color: '#888',
                                        }}
                                    >
                                        {m.accuracy
                                            ? `${Number(m.accuracy).toFixed(
                                                  1
                                              )}%`
                                            : '—'}
                                    </td>

                                    <td
                                        style={{
                                            paddingRight: 12,
                                            color: '#888',
                                        }}
                                    >
                                        {m.percentile
                                            ? `${m.percentile}%`
                                            : '—'}
                                    </td>

                                    <td>
                                        {delta !== null ? (
                                            <Delta val={delta} />
                                        ) : (
                                            <span
                                                style={{
                                                    color: '#555',
                                                }}
                                            >
                                                —
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {!recentMocks.length && (
                            <tr>
                                <td
                                    colSpan={11}
                                    style={{
                                        padding: '24px 0',
                                        textAlign: 'center',
                                        color: '#555',
                                    }}
                                >
                                    No mocks recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 16,
                        flexWrap: 'wrap',
                        gap: 10,
                    }}
                >
                    <span
                        style={{
                            fontSize: 12,
                            color: '#777',
                        }}
                    >
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                        {' - '}
                        {Math.min(
                            currentPage * ITEMS_PER_PAGE,
                            recentMocks.length
                        )}{' '}
                        of {recentMocks.length} mocks
                    </span>

                    <div
                        style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                        }}
                    >
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: '6px 12px',
                                borderRadius: 8,
                                border: '1px solid var(--border)',
                                background: 'var(--card)',
                                color:
                                    currentPage === 1 ? '#555' : 'var(--text)',
                                cursor:
                                    currentPage === 1
                                        ? 'not-allowed'
                                        : 'pointer',
                            }}
                        >
                            ← Prev
                        </button>

                        <span
                            style={{
                                fontSize: 12,
                                color: '#888',
                                minWidth: 80,
                                textAlign: 'center',
                            }}
                        >
                            Page {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '6px 12px',
                                borderRadius: 8,
                                border: '1px solid var(--border)',
                                background: 'var(--card)',
                                color:
                                    currentPage === totalPages
                                        ? '#555'
                                        : 'var(--text)',
                                cursor:
                                    currentPage === totalPages
                                        ? 'not-allowed'
                                        : 'pointer',
                            }}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecentMocksTable;
