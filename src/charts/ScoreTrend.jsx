import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler
);

const ScoreTrend = ({ data }) => {
    const chartData = {
        labels: data.map((m) => m.date),

        datasets: [
            {
                label: 'Total Score',

                data: data.map((m) => m.totalScore),

                borderColor: '#6366F1',

                backgroundColor: 'rgba(99,102,241,0.15)',

                fill: true,

                tension: 0.4,

                pointRadius: 5,

                pointHoverRadius: 8,

                pointBackgroundColor: '#6366F1',

                pointBorderColor: '#fff',

                pointBorderWidth: 2,
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
                padding: 12,
                cornerRadius: 10,
            },
        },

        scales: {
            x: {
                grid: {
                    display: false,
                },

                ticks: {
                    color: '#64748B',
                },
            },

            y: {
                grid: {
                    color: 'rgba(148,163,184,0.15)',
                },

                ticks: {
                    color: '#64748B',
                },
            },
        },
    };

    return (
        <div>
            <div className="h-[320px]">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default ScoreTrend;
