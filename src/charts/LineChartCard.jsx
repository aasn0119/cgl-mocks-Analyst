// components/charts/LineChartCard.jsx
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const LineChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700">
            <p className="text-xs text-slate-400">Mock #{data.attempt}</p>
            <p className="text-xs text-slate-400 mb-2">{data.date}</p>

            {payload.map((p, i) => (
                <p key={i} className="text-sm font-semibold">
                    <span className="text-slate-300">{p.name}:</span>{' '}
                    <span className="text-white">{p.value}</span>
                </p>
            ))}
        </div>
    );
};

export default function LineChartCard({
    title,
    data,
    dataKey,
    color = '#6366f1',
    gradientId = 'lineGradient',
    yDomain = [0, 50],
    yTicks = [0, 10, 20, 30, 40, 50],
}) {
    return (
        <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 shadow-md">
            <h2 className="text-sm font-semibold mb-3">{title}</h2>

            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data}>
                    <defs>
                        <linearGradient
                            id={gradientId}
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                        >
                            <stop offset="0%" stopColor={color} />
                            <stop
                                offset="100%"
                                stopColor={color}
                                stopOpacity={0.6}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

                    <XAxis
                        dataKey="attempt"
                        tick={{ fontSize: 11 }}
                        label={{
                            value: 'Attempt',
                            position: 'insideBottom',
                            offset: -5,
                        }}
                    />

                    <YAxis tick={{ fontSize: 11 }} />

                    <Tooltip content={<LineChartTooltip />} />

                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={`url(#${gradientId})`}
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
