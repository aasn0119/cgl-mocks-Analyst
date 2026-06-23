import ChartCard from './ChartCard';
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
import CustomTooltip from './CustomTooltip';
import { C } from './constants';

const SubjectAverageChart = ({ subjectAverages }) => {
    return (
        <ChartCard
            title="Subject Average"
            icon="📊"
            style={{ marginBottom: 14 }}
        >
            {/* Existing chart */}
            <ResponsiveContainer width="100%" height={200}>
                <BarChart
                    data={subjectAverages}
                    margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                    />
                    <XAxis
                        dataKey="subject"
                        tick={{ fontSize: 11, fill: '#666' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#666' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="score" name="Avg Score" radius={[6, 6, 0, 0]}>
                        {subjectAverages.map((_, i) => (
                            <Cell
                                key={i}
                                fill={[C.purple, C.amber, C.teal, C.red][i % 4]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default SubjectAverageChart;
