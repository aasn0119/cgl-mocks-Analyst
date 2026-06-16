import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div
            className="
      bg-white dark:bg-slate-800
      border border-slate-200 dark:border-slate-700
      shadow-lg
      rounded-xl
      px-3 py-2
      text-sm
    "
        >
            <p className="text-slate-500 text-xs mb-1">{label}</p>
            <p className="font-semibold text-slate-800 dark:text-white">
                {payload[0].value}
            </p>
        </div>
    );
};

const CustomBarChart = ({ data = [], dataKey, xKey, color = '#10b981' }) => {
    if (!data.length) return null;

    // safer fallback than Object.keys()
    const resolvedXKey = xKey || Object.keys(data[0])[0];

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    {/* GRID */}
                    <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="rgba(148,163,184,0.2)"
                    />

                    {/* X AXIS */}
                    <XAxis
                        dataKey={resolvedXKey}
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                    />

                    {/* Y AXIS */}
                    <YAxis
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                    />

                    {/* TOOLTIP */}
                    <Tooltip content={<CustomTooltip />} />

                    {/* BAR */}
                    <Bar
                        dataKey={dataKey}
                        fill={color}
                        radius={[8, 8, 0, 0]}
                        barSize={28}
                        style={{
                            filter: `drop-shadow(0px 4px 6px ${color}33)`,
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomBarChart;
