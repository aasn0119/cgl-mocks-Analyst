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

const SubjectTrendChart = ({ subjectTrend }) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
                margin: '14px 0',
            }}
        >
            <ChartCard
                title="Subject Performance Trend"
                icon="📚"
                legend={[
                    { label: 'Quant', color: C.purple },
                    { label: 'Reasoning', color: C.amber },
                ]}
            >
                {/* Paste existing subject LineChart block */}
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                        data={subjectTrend}
                        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.06)"
                        />
                        <XAxis
                            dataKey="attempt"
                            tick={{ fontSize: 10, fill: '#666' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#666' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="quant"
                            name="Quant"
                            stroke={C.purple}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="reasoning"
                            name="Reasoning"
                            stroke={C.amber}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                            strokeDasharray="5 3"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard
                title="English & GK"
                icon="📚"
                legend={[
                    { color: C.teal, label: 'English' },
                    { color: C.red, label: 'GK' },
                ]}
            >
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                        data={subjectTrend}
                        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.06)"
                        />
                        <XAxis
                            dataKey="attempt"
                            tick={{ fontSize: 10, fill: '#666' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#666' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="english"
                            name="English"
                            stroke={C.teal}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="gk"
                            name="GK"
                            stroke={C.red}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                            strokeDasharray="5 3"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
};

export default SubjectTrendChart;
