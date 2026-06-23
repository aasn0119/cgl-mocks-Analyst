import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from 'recharts';

import ChartCard from './ChartCard';
import CustomTooltip from './CustomTooltip';
import { C, PLATFORM_COLORS } from './constants';

const PlatformPerformanceChart = ({ platformData }) => {
    return (
        <ChartCard
            title="Platform Performance"
            icon="🏢"
            legend={[{ label: 'Average Score', color: C.blue }]}
        >
            <ResponsiveContainer width="100%" height={220}>
                <BarChart
                    data={platformData}
                    margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                    />
                    <XAxis
                        dataKey="platform"
                        tick={{ fontSize: 10, fill: '#666' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: '#666' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="avgScore"
                        name="Avg Score"
                        radius={[6, 6, 0, 0]}
                    >
                        {platformData.map((_, i) => (
                            <Cell
                                key={i}
                                fill={
                                    PLATFORM_COLORS[i % PLATFORM_COLORS.length]
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default PlatformPerformanceChart;
