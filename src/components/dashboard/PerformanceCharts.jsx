import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    Bar,
} from 'recharts';

/* ================= CUSTOM TOOLTIP ================= */

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">{label}</p>

            {payload.map((p, i) => (
                <p key={i} className="text-sm font-semibold">
                    <span className="text-slate-300">{p.name}: </span>
                    <span className="text-white">{p.value}</span>
                </p>
            ))}
        </div>
    );
};

/* ================= MAIN COMPONENT ================= */

const PerformanceCharts = ({ chartData, subjectAverages, mocks }) => {
    const platformData = buildPlatformData(mocks);
    const subjectTrendData = buildSubjectTrendData(mocks);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ================= SUBJECT TRENDS ================= */}

            <ChartCard title="🔢 Quant Trend">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={subjectTrendData}>
                        <defs>
                            <linearGradient
                                id="quant"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#22d3ee" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />

                        <Line
                            type="monotone"
                            dataKey="quantScore"
                            stroke="url(#quant)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="🧠 Reasoning Trend">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={subjectTrendData}>
                        <defs>
                            <linearGradient
                                id="reasoning"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#fbbf24" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />

                        <Line
                            type="monotone"
                            dataKey="reasoningScore"
                            stroke="url(#reasoning)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="📖 English Trend">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={subjectTrendData}>
                        <defs>
                            <linearGradient
                                id="english"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#34d399" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />

                        <Line
                            type="monotone"
                            dataKey="englishScore"
                            stroke="url(#english)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="🌍 GK Trend">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={subjectTrendData}>
                        <defs>
                            <linearGradient id="gk" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="100%" stopColor="#f472b6" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />

                        <Line
                            type="monotone"
                            dataKey="gkScore"
                            stroke="url(#gk)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ================= MAIN TRENDS ================= */}

            <ChartCard title="📈 Score Trend">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={chartData}>
                        <defs>
                            <linearGradient
                                id="score"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#22d3ee" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />

                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="url(#score)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="🎯 Accuracy Trend">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={chartData}>
                        <defs>
                            <linearGradient
                                id="accuracy"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#34d399" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />

                        <Line
                            type="monotone"
                            dataKey="accuracy"
                            stroke="url(#accuracy)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ================= PLATFORM ================= */}

            <ChartCard title="🏢 Platform Comparison">
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={platformData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />

                        <Bar
                            dataKey="average"
                            fill="#14b8a6"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
};

/* ================= CHART CARD ================= */

function ChartCard({ title, children }) {
    return (
        <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300">
            {/* glow effects */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full" />

            <div className="relative">
                <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
                    {title}
                </h2>

                {children}
            </div>
        </div>
    );
}

/* ================= SUBJECT TREND ================= */

function buildSubjectTrendData(mocks) {
    return [...mocks]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((m) => ({
            date: m.date,
            quantScore: m.quantScore || 0,
            reasoningScore: m.reasoningScore || 0,
            englishScore: m.englishScore || 0,
            gkScore: m.gkScore || 0,
        }));
}

/* ================= PLATFORM ================= */

function buildPlatformData(mocks) {
    const grouped = {};

    mocks.forEach((mock) => {
        const platform = mock.platform || 'Unknown';

        if (!grouped[platform]) {
            grouped[platform] = { total: 0, count: 0 };
        }

        grouped[platform].total += Number(mock.totalScore || 0);
        grouped[platform].count += 1;
    });

    return Object.entries(grouped).map(([platform, values]) => ({
        platform,
        average: Number((values.total / values.count).toFixed(2)),
    }));
}

export default PerformanceCharts;
