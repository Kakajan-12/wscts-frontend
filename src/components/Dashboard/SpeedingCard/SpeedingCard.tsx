'use client';

import { useState, useRef, useEffect } from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import {useTranslations} from "next-intl";

type SpeedOption = {
    id: string;
    labelKey: string;
    total: number;
    vehicles: { name: string; count: number }[];
};

const OPTIONS: SpeedOption[] = [
    {
        id: 'all',
        labelKey: 'speed-all',
        total: 192,
        vehicles: [],
    },
    {
        id: '10-20',
        labelKey: 'speed-10-20',
        total: 25,
        vehicles: [
            { name: 'DAF 154', count: 12 },
            { name: 'Грузовик 455', count: 7 },
            { name: 'Сиенна 6767', count: 6 },
        ],
    },
    {
        id: '20-40',
        labelKey: 'speed-20-40',
        total: 26,
        vehicles: [
            { name: 'DAF 154', count: 45 },
            { name: 'Грузовик 455', count: 6 },
            { name: 'Сиенна 6767', count: 6 },
        ],
    },
    {
        id: '40+',
        labelKey: 'speed-40-plus',
        total: 95,
        vehicles: [
            { name: 'DAF 154', count: 60 },
            { name: 'MAN 245', count: 35 },
        ],
    },
];

export default function SpeedingCard() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<SpeedOption>(OPTIONS[2]);
    const ref = useRef<HTMLDivElement>(null);
    const t = useTranslations('Dashboard')
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow relative" ref={ref}>
            <div className="flex items-center justify-between bg-[#065F46] rounded-t-xl px-4 py-2">
                <h3 className="text-white font-semibold">{t('speeding')}</h3>
                <span className="text-white text-sm">{t('online-data')}</span>
            </div>

            <div className="relative px-4 pt-3">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full border rounded-md px-3 py-2 flex items-center justify-between text-sm bg-white"
                >
          <span>
            {t(selected.labelKey)} ({selected.total})
          </span>
                    {open ? <IoChevronUp /> : <IoChevronDown />}
                </button>

                {open && (
                    <div className="absolute left-4 right-4 top-full mt-1 bg-[#6fb8a1] rounded-md z-50 overflow-hidden shadow-lg">
                        {OPTIONS.map((opt) => (
                            <div
                                key={opt.id}
                                onClick={() => {
                                    setSelected(opt);
                                    setOpen(false);
                                }}
                                className="px-3 py-2 text-white text-sm cursor-pointer hover:bg-[#5aa890]"
                            >
                                {t(opt.labelKey)} ({opt.total})
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="px-4 py-3 space-y-2">
                {selected.vehicles.length === 0 && (
                    <div className="text-sm text-gray-500">{t('no-data')}</div>
                )}

                {selected.vehicles.map((v, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between border-b pb-2 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <span>🚚</span>
                            <span>{v.name}</span>
                        </div>
                        <span className="font-medium">{v.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
