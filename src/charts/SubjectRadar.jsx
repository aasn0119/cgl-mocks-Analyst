import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const SubjectRadar = ({ data }) => {
    if (!data) return null;

    const chartData = {
        labels: ['English', 'Reasoning', 'Quant', 'GK'],

        datasets: [
            {
                label: 'Subject Performance',

                data: [
                    data.englishScore,
                    data.reasoningScore,
                    data.quantScore,
                    data.gkScore,
                ],

                backgroundColor: 'rgba(99,102,241,0.15)',

                borderColor: '#6366F1',

                borderWidth: 2,

                pointBackgroundColor: '#6366F1',

                pointBorderColor: '#fff',

                pointBorderWidth: 2,

                pointRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false,
            },

            tooltip: {
                backgroundColor: '#1E293B',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 10,
            },
        },

        scales: {
            r: {
                angleLines: {
                    color: 'rgba(148,163,184,0.2)',
                },

                grid: {
                    color: 'rgba(148,163,184,0.2)',
                },

                pointLabels: {
                    color: '#64748B',
                    font: {
                        size: 12,
                        weight: 'bold',
                    },
                },

                ticks: {
                    backdropColor: 'transparent',
                    color: '#94A3B8',
                },
            },
        },
    };

    const total =
        data.englishScore +
        data.reasoningScore +
        data.quantScore +
        data.gkScore;

    return (
        <div>
            {/* RADAR CHART */}
            <div className="h-[340px]">
                <Radar data={chartData} options={options} />
            </div>

            {/* FOOTER STATS */}
            <div className="mt-4 grid grid-cols-4 text-center text-xs text-slate-500 dark:text-slate-400">
                <div>
                    <p className="font-semibold text-slate-700 dark:text-white">
                        {data.englishScore}
                    </p>
                    English
                </div>

                <div>
                    <p className="font-semibold text-slate-700 dark:text-white">
                        {data.reasoningScore}
                    </p>
                    Reasoning
                </div>

                <div>
                    <p className="font-semibold text-slate-700 dark:text-white">
                        {data.quantScore}
                    </p>
                    Quant
                </div>

                <div>
                    <p className="font-semibold text-slate-700 dark:text-white">
                        {data.gkScore}
                    </p>
                    GK
                </div>
            </div>
        </div>
    );
};

export default SubjectRadar;
