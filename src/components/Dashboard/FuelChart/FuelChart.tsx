import {useTranslations} from "next-intl";
import {ChartOptions} from "chart.js";
import {Line} from "react-chartjs-2";

export default function FuelChart() {
    const t = useTranslations('Dashboard');

    const labels = Array.from({ length: 4 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (3 - i));
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    });

    const data = {
        labels,
        datasets: [
            {
                label: 'DAF 0074',
                data: [380, 360, 520, 410],
                borderColor: '#8b5cf6',
                backgroundColor: '#8b5cf6',
                tension: 0.4,
            },
            {
                label: 'MAN 5284',
                data: [1650, 1700, 1680, 1500],
                borderColor: '#16a34a',
                backgroundColor: '#16a34a',
                tension: 0.4,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0,
                max: 2200,
                ticks: {
                    stepSize: 550,
                    callback: (value) => `${value} ${t('litre')}`,
                },
            },
        },
        plugins: {
            legend: {
                position: 'right',
            },
            tooltip: {
                callbacks: {
                    label: (ctx) =>
                        `${ctx.dataset.label}: ${ctx.parsed.y} ${t('litre')}`,
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-lg shadow h-[360px] flex flex-col">
            <div className="flex justify-between items-center bg-[#065F46] rounded-tr-xl rounded-tl-xl px-4 py-2">
                <h3 className="text-lg font-semibold text-white">
                    {t('fuel-level')}
                </h3>
                <p className="text-sm text-white">{t('online-data')}</p>
            </div>

            <div className="flex-1 p-3">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
