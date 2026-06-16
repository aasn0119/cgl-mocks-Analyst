import { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const COLORS = [
    '#6366f1', // indigo
    '#06b6d4', // cyan
    '#f97316', // orange
    '#10b981', // green
    '#ef4444', // red
];

export default function SubjectComparisonPanel({
    selectedUsers,
    users,
    getUserMocks,
}) {
    // ================= SUBJECT DATA =================
    const getSubjectData = (uid) => {
        console.log('getSubjectData called with uid:', uid);
        const mocks = getUserMocks(uid);

        return mocks.map((m, index) => ({
            mock: index + 1,
            english: Number(m.englishScore || 0),
            reasoning: Number(m.reasoningScore || 0),
            quant: Number(m.quantScore || 0),
            gk: Number(m.gkScore || 0),
        }));
    };

    const subjectData = useMemo(() => {
        return selectedUsers.map((uid) => ({
            uid,
            name: users.find((u) => u.uid === uid)?.displayName || 'User',
            data: getSubjectData(uid),
        }));
    }, [selectedUsers, users]);

    // ================= SUBJECT STATS =================
    const getTotals = (mocks) => {
        return mocks.reduce(
            (acc, m) => {
                acc.english += Number(m.englishScore || 0);
                acc.reasoning += Number(m.reasoningScore || 0);
                acc.quant += Number(m.quantScore || 0);
                acc.gk += Number(m.gkScore || 0);
                return acc;
            },
            { english: 0, reasoning: 0, quant: 0, gk: 0 }
        );
    };

    const getBestSubject = (mocks) =>
        Object.entries(getTotals(mocks)).sort((a, b) => b[1] - a[1])[0][0];

    const getWeakSubject = (mocks) =>
        Object.entries(getTotals(mocks)).sort((a, b) => a[1] - b[1])[0][0];

    const insights = useMemo(() => {
        return selectedUsers.map((uid) => {
            const mocks = getUserMocks(uid);

            return {
                name: users.find((u) => u.uid === uid)?.displayName,
                best: getBestSubject(mocks),
                weak: getWeakSubject(mocks),
            };
        });
    }, [selectedUsers, users]);

    // ================= UI =================
    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div
                className="
        bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500
        text-white p-6 rounded-2xl shadow-xl
      "
            >
                <h2 className="text-2xl font-bold">
                    Subject Performance Analysis
                </h2>
                <p className="text-white/80 text-sm">
                    Compare strengths and weaknesses across students
                </p>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid md:grid-cols-2 gap-6">
                {['english', 'reasoning', 'quant', 'gk'].map((subject, idx) => (
                    <div
                        key={subject}
                        className="
              bg-white
              rounded-2xl p-5 shadow-lg
              border border-slate-100
              hover:shadow-xl transition
            "
                    >
                        <h3
                            className="
              text-lg font-semibold mb-4
              text-transparent bg-clip-text
              bg-gradient-to-r from-indigo-600 to-cyan-500
            "
                        >
                            {subject.toUpperCase()} Comparison
                        </h3>

                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart>
                                <XAxis dataKey="mock" />
                                <YAxis />
                                <Tooltip />

                                {subjectData.map((u, i) => (
                                    <Line
                                        key={u.uid}
                                        data={u.data}
                                        dataKey={subject}
                                        stroke={COLORS[i % COLORS.length]}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ))}
            </div>

            {/* INSIGHTS */}
            <div
                className="
        bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500
        text-white p-6 rounded-2xl shadow-xl
      "
            >
                <h2 className="text-xl font-bold mb-4">Subject Insights</h2>

                <div className="space-y-3">
                    {insights.map((u, i) => (
                        <div
                            key={i}
                            className="bg-white/10 p-3 rounded-xl backdrop-blur"
                        >
                            <p className="font-semibold">{u.name}</p>
                            <p>🔥 Strong: {u.best}</p>
                            <p>⚠️ Weak: {u.weak}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
