import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PlatformChart = ({ data }) => {
    const platformMap = {};

    data.forEach((m) => {
        if (!platformMap[m.platform]) {
            platformMap[m.platform] = [];
        }

        platformMap[m.platform].push(Number(m.totalScore || 0));
    });

    const labels = Object.keys(platformMap);

    const values = labels.map((platform) => {
        const scores = platformMap[platform];

        return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    });

    const chartData = {
        labels,

        datasets: [
            {
                label: 'Average Score',

                data: values,

                backgroundColor: [
                    '#6366F1',
                    '#8B5CF6',
                    '#06B6D4',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#EC4899',
                    '#14B8A6',
                ],

                borderRadius: 12,

                borderSkipped: false,
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
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default PlatformChart;
