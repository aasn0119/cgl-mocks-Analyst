import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from 'recharts';

import ChartCard from './ChartCard';
import CustomTooltip from './CustomTooltip';
import { C, PLATFORM_COLORS } from './constants';

const RadarChartComponent = ({ radarData }) => {
    return (
        <ChartCard
            title="Skill Radar"
            icon="🎯"
            legend={[{ color: C.purple, label: 'Subject avg' }]}
        >
            <ResponsiveContainer width="100%" height={220}>
                <RadarChart
                    data={radarData}
                    margin={{ top: 4, right: 24, left: 24, bottom: 4 }}
                >
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 12, fill: '#aaa' }}
                    />
                    <PolarRadiusAxis tick={{ fontSize: 9, fill: '#555' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Radar
                        dataKey="value"
                        name="Score"
                        stroke={C.purple}
                        fill={C.purple}
                        fillOpacity={0.35}
                        strokeWidth={2}
                        dot={{ r: 4, fill: C.purple }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default RadarChartComponent;
