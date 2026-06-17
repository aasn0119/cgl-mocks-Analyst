// components/charts/BarChartCard.jsx
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const BarChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">{label}</p>

            {payload.map((p, i) => (
                <p key={i} className="text-sm font-semibold">
                    <span className="text-slate-300">{p.name}:</span>{' '}
                    <span className="text-white">{p.value}</span>
                </p>
            ))}
        </div>
    );
};

export default function BarChartCard({
    title,
    data,
    dataKey,
    color = '#14b8a6',
    barSize = 40,
}) {
    return (
        <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 shadow-md">
            <h2 className="text-sm font-semibold mb-3">{title}</h2>

            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={Array.isArray(data) ? data : []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

                    <XAxis dataKey="platform" tick={{ fontSize: 11 }} />

                    <YAxis tick={{ fontSize: 11 }} />

                    <Tooltip content={<BarChartTooltip />} />

                    <Bar
                        dataKey={dataKey}
                        fill={color}
                        radius={[6, 6, 0, 0]}
                        barSize={barSize}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
