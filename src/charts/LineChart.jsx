import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active) return null;

    return (
        <div
            className="
      bg-white dark:bg-slate-800
      border border-slate-200 dark:border-slate-700
      p-2 rounded-lg shadow
    "
        >
            <p className="text-xs text-slate-500">{label}</p>
            <p className="font-semibold">{payload?.[0]?.value}</p>
        </div>
    );
};

const CustomLineChart = ({ data, dataKey, color = '#6366f1' }) => {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                />

                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />

                <Tooltip content={<CustomTooltip />} />

                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CustomLineChart;
