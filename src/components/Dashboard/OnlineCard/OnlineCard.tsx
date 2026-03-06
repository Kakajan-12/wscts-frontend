'use client';

import { useTranslations } from "next-intl";

/**
 * Single circle diagram
 */
const CircleDiagram = ({
                           connected,
                           total,
                           label,
                       }: {
    connected: number;
    total: number;
    label: string;
}) => {

    const percentage =
        total === 0 ? 0 : Math.min((connected / total) * 100, 100);

    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    const offset =
        circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">

            <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90">

                    {/* background */}
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                    />

                    {/* progress */}
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>

                {/* center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold">
                            {connected}
                        </div>
                        <div className="text-xs text-gray-500">
                            / {total}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-2 text-sm text-gray-700">
                {label}
            </div>

        </div>
    );
};

/**
 * Online Card
 */
export default function OnlineCard({
                                       connectedCount = 0,
                                       disconnectedCount = 0,
                                   }: {
    connectedCount?: number;
    disconnectedCount?: number;
}) {

    const t = useTranslations("Dashboard");

    const total = connectedCount + disconnectedCount;

    return (
        <div className="bg-white rounded-xl shadow flex flex-col">

            <div className="flex items-center justify-between bg-[#065F46] rounded-t-xl px-4 py-1">
                <h3 className="text-lg font-semibold text-white">
                    {t('gps-status')}
                </h3>

                <p className="text-sm text-white">
                    {t('online-data')}
                </p>
            </div>

            <div className="flex-1 flex items-center justify-center py-6">

                <CircleDiagram
                    connected={connectedCount}
                    total={total}
                    label={t('connected')}
                />

            </div>
        </div>
    );
}