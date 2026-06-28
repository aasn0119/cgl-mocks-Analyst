import { useState, useMemo } from 'react';
import ScorePill from './ScorePill';
import Delta from './Delta';
import { C } from './constants';

const ITEMS_PER_PAGE = 10;

const RecentMocksTable = ({ recentMocks, formatDate }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPlatform, setSelectedPlatform] = useState('All');

    // Build platform counts from all mocks
    const platformCounts = useMemo(() => {
        const counts = {};
        recentMocks.forEach((m) => {
            const p = m.platform || 'Unknown';
            counts[p] = (counts[p] || 0) + 1;
        });
        return counts;
    }, [recentMocks]);

    const platforms = useMemo(
        () => ['All', ...Object.keys(platformCounts)],
        [platformCounts]
    );

    // Filter mocks by selected platform
    const filteredMocks = useMemo(() => {
        if (selectedPlatform === 'All') return recentMocks;
        return recentMocks.filter(
            (m) => (m.platform || 'Unknown') === selectedPlatform
        );
    }, [recentMocks, selectedPlatform]);

    const totalPages = Math.ceil(filteredMocks.length / ITEMS_PER_PAGE);

    const paginatedMocks = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredMocks.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredMocks, currentPage]);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handlePlatformSelect = (platform) => {
        setSelectedPlatform(platform);
        setCurrentPage(1);
    };

    // Assign a distinct tint color per platform (cycles through a palette)
    const PLATFORM_COLORS = [
        {
            bg: 'rgba(83,74,183,0.15)',
            color: C.purple ?? '#7F77DD',
            border: 'rgba(83,74,183,0.35)',
        },
        {
            bg: 'rgba(29,158,117,0.15)',
            color: C.teal ?? '#1D9E75',
            border: 'rgba(29,158,117,0.35)',
        },
        {
            bg: 'rgba(186,117,23,0.15)',
            color: C.amber ?? '#BA7517',
            border: 'rgba(186,117,23,0.35)',
        },
        {
            bg: 'rgba(212,83,126,0.15)',
            color: C.red ?? '#E24B4A',
            border: 'rgba(212,83,126,0.35)',
        },
        {
            bg: 'rgba(55,138,221,0.15)',
            color: '#378ADD',
            border: 'rgba(55,138,221,0.35)',
        },
        {
            bg: 'rgba(99,153,34,0.15)',
            color: '#639922',
            border: 'rgba(99,153,34,0.35)',
        },
    ];

    const platformColorMap = useMemo(() => {
        const map = {};
        Object.keys(platformCounts).forEach((p, i) => {
            map[p] = PLATFORM_COLORS[i % PLATFORM_COLORS.length];
        });
        return map;
    }, [platformCounts]);

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
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>
                📋 Recent Attempts
            </p>

            {/* Platform filter pills */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginBottom: 16,
                }}
            >
                {platforms.map((p) => {
                    const isActive = selectedPlatform === p;
                    const count =
                        p === 'All'
                            ? recentMocks.length
                            : (platformCounts[p] ?? 0);
                    const col = platformColorMap[p];

                    return (
                        <button
                            key={p}
                            onClick={() => handlePlatformSelect(p)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '5px 12px',
                                borderRadius: 20,
                                border: isActive
                                    ? `1.5px solid ${p === 'All' ? 'rgba(255,255,255,0.4)' : col.border}`
                                    : '1px solid rgba(255,255,255,0.1)',
                                background: isActive
                                    ? p === 'All'
                                        ? 'rgba(255,255,255,0.12)'
                                        : col.bg
                                    : 'transparent',
                                color: isActive
                                    ? p === 'All'
                                        ? '#fff'
                                        : col.color
                                    : '#666',
                                fontSize: 12,
                                fontWeight: isActive ? 600 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {p}
                            <span
                                style={{
                                    background: isActive
                                        ? p === 'All'
                                            ? 'rgba(255,255,255,0.2)'
                                            : col.border
                                        : 'rgba(255,255,255,0.07)',
                                    color: isActive
                                        ? p === 'All'
                                            ? '#fff'
                                            : col.color
                                        : '#555',
                                    borderRadius: 10,
                                    padding: '1px 7px',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    lineHeight: '16px',
                                }}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

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

                            const prev = filteredMocks[globalIndex + 1];

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

                        {!filteredMocks.length && (
                            <tr>
                                <td
                                    colSpan={11}
                                    style={{
                                        padding: '24px 0',
                                        textAlign: 'center',
                                        color: '#555',
                                    }}
                                >
                                    No mocks recorded for this platform.
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
                            filteredMocks.length
                        )}{' '}
                        of {filteredMocks.length} mocks
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
