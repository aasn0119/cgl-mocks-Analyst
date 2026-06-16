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

const AccuracyTrend = ({ data }) => {
    const chartData = {
        labels: data.map((m) => m.date),

        datasets: [
            {
                label: 'Accuracy %',

                data: data.map((m) => m.accuracy),

                borderColor: '#10B981',

                backgroundColor: 'rgba(16,185,129,0.15)',

                fill: true,

                tension: 0.4,

                pointRadius: 5,

                pointHoverRadius: 8,

                pointBackgroundColor: '#10B981',

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
                titleColor: '#fff',
                bodyColor: '#fff',
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
                beginAtZero: true,
                max: 100,

                grid: {
                    color: 'rgba(148,163,184,0.15)',
                },

                ticks: {
                    color: '#64748B',
                    callback: (value) => `${value}%`,
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

export default AccuracyTrend;
