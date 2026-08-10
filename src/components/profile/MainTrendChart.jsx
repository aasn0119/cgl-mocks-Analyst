import { useState, useMemo } from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

import ChartCard from './ChartCard';
import CustomTooltip from './CustomTooltip';
import { C } from './constants';

const PRESETS = [
    { label: 'All', value: 'all' },
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 },
];

const MainTrendChart = ({ chartData }) => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [activePreset, setActivePreset] = useState('all');

    const filteredData = useMemo(() => {
        if (activePreset !== 'all' && typeof activePreset === 'number') {
            const latestDate = chartData.reduce((max, item) => {
                const d = new Date(item.date);
                return d > max ? d : max;
            }, new Date(0));

            const cutoff = new Date(latestDate);
            cutoff.setDate(cutoff.getDate() - (activePreset - 1));
            cutoff.setHours(0, 0, 0, 0);

            return chartData.filter((item) => new Date(item.date) >= cutoff);
        }

        if (!fromDate && !toDate) return chartData;

        return chartData.filter((item) => {
            const itemDate = new Date(item.date);
            if (fromDate && itemDate < new Date(fromDate)) return false;
            if (toDate && itemDate > new Date(toDate)) return false;
            return true;
        });
    }, [chartData, fromDate, toDate, activePreset]);

    const handlePresetClick = (value) => {
        setActivePreset(value);
        setFromDate('');
        setToDate('');
    };

    const handleDateChange = (setter) => (e) => {
        setter(e.target.value);
        setActivePreset('custom');
    };

    const handleClear = () => {
        setFromDate('');
        setToDate('');
        setActivePreset('all');
    };

    const isFiltered = fromDate || toDate || activePreset !== 'all';

    return (
        <ChartCard
            title="Score Trend"
            icon="📈"
            legend={[
                { label: 'Total Score', color: C.purple },
                { label: 'Accuracy ', color: C.teal },
                { label: 'Percentile ', color: C.amber },
            ]}
        >
            {/* Filter toolbar */}
            {/* Filter toolbar — shared across both charts below */}
            <div
                style={{
                    marginBottom: 14,
                    padding: '10px 12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10,
                }}
            >
                {/* Header row */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        <span style={{ fontSize: 13 }}>📅</span>
                        <span
                            style={{
                                fontSize: 12.5,
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.8)',
                                letterSpacing: 0.2,
                            }}
                        >
                            Filter by Date
                        </span>
                    </div>

                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: 'rgba(255,255,255,0.4)',
                        }}
                    >
                        {activePreset === 'all' && !fromDate && !toDate
                            ? 'Showing all attempts'
                            : activePreset !== 'all' &&
                                activePreset !== 'custom'
                              ? `Showing last ${activePreset} days`
                              : fromDate && toDate
                                ? `Showing ${fromDate} → ${toDate}`
                                : fromDate
                                  ? `Showing from ${fromDate}`
                                  : `Showing until ${toDate}`}
                    </span>
                </div>

                {/* Controls row */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    {/* Segmented preset control */}
                    <div
                        style={{
                            display: 'inline-flex',
                            background: 'rgba(0,0,0,0.25)',
                            borderRadius: 8,
                            padding: 3,
                            gap: 2,
                        }}
                    >
                        {PRESETS.map((preset) => {
                            const active = activePreset === preset.value;
                            return (
                                <button
                                    key={preset.label}
                                    onClick={() =>
                                        handlePresetClick(preset.value)
                                    }
                                    style={{
                                        background: active
                                            ? C.purple
                                            : 'transparent',
                                        color: active
                                            ? '#fff'
                                            : 'rgba(255,255,255,0.55)',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '5px 12px',
                                        cursor: 'pointer',
                                        fontSize: 11.5,
                                        fontWeight: active ? 600 : 500,
                                        letterSpacing: 0.2,
                                        transition: 'all 0.18s ease',
                                        boxShadow: active
                                            ? '0 1px 4px rgba(0,0,0,0.25)'
                                            : 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!active)
                                            e.currentTarget.style.color =
                                                'rgba(255,255,255,0.85)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active)
                                            e.currentTarget.style.color =
                                                'rgba(255,255,255,0.55)';
                                    }}
                                >
                                    {preset.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Custom date range */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 10.5,
                                    fontWeight: 600,
                                    letterSpacing: 0.4,
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.35)',
                                }}
                            >
                                From
                            </span>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={handleDateChange(setFromDate)}
                                style={{
                                    background: 'rgba(0,0,0,0.25)',
                                    color: '#e2e2e2',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 6,
                                    padding: '4px 8px',
                                    fontSize: 11.5,
                                    colorScheme: 'dark',
                                    outline: 'none',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>

                        <span
                            style={{
                                color: 'rgba(255,255,255,0.25)',
                                fontSize: 12,
                            }}
                        >
                            →
                        </span>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 10.5,
                                    fontWeight: 600,
                                    letterSpacing: 0.4,
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.35)',
                                }}
                            >
                                To
                            </span>
                            <input
                                type="date"
                                value={toDate}
                                onChange={handleDateChange(setToDate)}
                                style={{
                                    background: 'rgba(0,0,0,0.25)',
                                    color: '#e2e2e2',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 6,
                                    padding: '4px 8px',
                                    fontSize: 11.5,
                                    colorScheme: 'dark',
                                    outline: 'none',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>

                        {isFiltered && (
                            <button
                                onClick={handleClear}
                                style={{
                                    background: 'transparent',
                                    color: 'rgba(255,255,255,0.4)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 6,
                                    padding: '4px 10px',
                                    cursor: 'pointer',
                                    fontSize: 11,
                                    fontWeight: 500,
                                    transition: 'all 0.18s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color =
                                        'rgba(255,255,255,0.75)';
                                    e.currentTarget.style.borderColor =
                                        'rgba(255,255,255,0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color =
                                        'rgba(255,255,255,0.4)';
                                    e.currentTarget.style.borderColor =
                                        'rgba(255,255,255,0.12)';
                                }}
                            >
                                ✕ Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
                <LineChart
                    data={filteredData}
                    margin={{ top: 4, right: 10, left: -10, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                    />
                    <XAxis
                        dataKey="attempt"
                        tick={{ fontSize: 11, fill: '#666' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#666' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="score"
                        name="Score"
                        stroke={C.purple}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: C.purple }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="accuracy"
                        name="Accuracy %"
                        stroke={C.teal}
                        strokeWidth={2}
                        dot={{ r: 3, fill: C.teal }}
                        activeDot={{ r: 5 }}
                        strokeDasharray="6 3"
                    />
                    <Line
                        type="monotone"
                        dataKey="percentile"
                        name="Percentile"
                        stroke={C.amber}
                        strokeWidth={2}
                        dot={{ r: 3, fill: C.amber }}
                        activeDot={{ r: 5 }}
                        strokeDasharray="2 4"
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default MainTrendChart;
