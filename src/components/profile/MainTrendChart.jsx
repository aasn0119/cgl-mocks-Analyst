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

const MainTrendChart = ({ chartData }) => {
    return (
        <ChartCard
            title="Score Trend"
            icon="📈"
            legend={[
                { label: 'Total Score', color: C.purple },
                { label: 'Predicted Trend', color: C.teal },
            ]}
        >
            {/* Paste your existing ResponsiveContainer + LineChart block here */}
            <ResponsiveContainer width="100%" height={260}>
                <LineChart
                    data={chartData}
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
