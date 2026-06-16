import { useMemo, useState } from 'react';

const PAGE_SIZE = 10;

const RecordsTable = ({ mocks }) => {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [page, setPage] = useState(1);

    const filteredData = useMemo(() => {
        const term = search.toLowerCase();

        const filtered = mocks.filter((m) => {
            return (
                m.mockId?.toLowerCase().includes(term) ||
                m.platform?.toLowerCase().includes(term) ||
                m.date?.toLowerCase().includes(term)
            );
        });

        filtered.sort((a, b) => {
            let A = a[sortField];
            let B = b[sortField];

            if (sortField === 'date') {
                A = new Date(A);
                B = new Date(B);
            }

            return sortDirection === 'asc' ? A - B : B - A;
        });

        return filtered;
    }, [mocks, search, sortField, sortDirection]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

    const paginated = filteredData.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection((p) => (p === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const SubjectBadge = ({ value, color }) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${color}`}>
            {value ?? '-'}
        </span>
    );

    return (
        <div className="mt-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
                {/* HEADER */}
                <div className="p-5 border-b border-slate-200/60 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            📋 Mock Records
                        </h2>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search mock, platform..."
                            className="
                                px-4 py-2.5
                                rounded-xl
                                border border-slate-200/70 dark:border-slate-700
                                bg-slate-50 dark:bg-slate-800
                                text-slate-800 dark:text-white
                                focus:outline-none
                                focus:ring-2 focus:ring-indigo-500/50
                                w-full md:w-72
                            "
                        />
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                        Showing {filteredData.length} results
                    </p>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <Th
                                    label="Date"
                                    onClick={() => handleSort('date')}
                                />
                                <Th
                                    label="Mock ID"
                                    onClick={() => handleSort('mockId')}
                                />
                                <Th
                                    label="Platform"
                                    onClick={() => handleSort('platform')}
                                />
                                <Th
                                    label="Score"
                                    onClick={() => handleSort('totalScore')}
                                />

                                {/* SUBJECT HEADERS */}
                                <Th label="Quant" />
                                <Th label="Reasoning" />
                                <Th label="English" />
                                <Th label="GK" />

                                <Th
                                    label="Accuracy"
                                    onClick={() => handleSort('accuracy')}
                                />
                                <Th
                                    label="Rank"
                                    onClick={() => handleSort('rank')}
                                />
                            </tr>
                        </thead>

                        <tbody>
                            {paginated.map((m) => {
                                const accuracy = Number(m.accuracy || 0);

                                const badge =
                                    accuracy >= 75
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : accuracy >= 50
                                          ? 'bg-amber-100 text-amber-700'
                                          : 'bg-rose-100 text-rose-700';

                                return (
                                    <tr
                                        key={m.id}
                                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                                    >
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                            {m.date}
                                        </td>

                                        <td className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-300">
                                            {m.mockId}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-semibold">
                                                {m.platform}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">
                                            {m.totalScore}
                                        </td>

                                        {/* SUBJECTS */}
                                        <td className="px-4 py-3">
                                            <SubjectBadge
                                                value={m.quantScore}
                                                color="bg-blue-100 text-blue-700"
                                            />
                                        </td>

                                        <td className="px-4 py-3">
                                            <SubjectBadge
                                                value={m.reasoningScore}
                                                color="bg-purple-100 text-purple-700"
                                            />
                                        </td>

                                        <td className="px-4 py-3">
                                            <SubjectBadge
                                                value={m.englishScore}
                                                color="bg-emerald-100 text-emerald-700"
                                            />
                                        </td>

                                        <td className="px-4 py-3">
                                            <SubjectBadge
                                                value={m.gkScore}
                                                color="bg-orange-100 text-orange-700"
                                            />
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${badge}`}
                                            >
                                                {accuracy}%
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                            {m.rank}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-between items-center p-4 border-t border-slate-200/60 dark:border-slate-800">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-4 py-2 rounded-xl bg-indigo-500 text-white disabled:opacity-50"
                        disabled={page === 1}
                    >
                        Prev
                    </button>

                    <span className="text-slate-600 dark:text-slate-300">
                        Page {page} / {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        className="px-4 py-2 rounded-xl bg-indigo-500 text-white disabled:opacity-50"
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

const Th = ({ label, onClick }) => (
    <th
        onClick={onClick}
        className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:text-indigo-500 transition"
    >
        {label}
    </th>
);

export default RecordsTable;
