'use client';

import { useEffect, useRef, useState } from 'react';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
} from 'chart.js';

import OnlineCard from './OnlineCard/OnlineCard';
import TopFuel from './TopFuel/TopFuel';
import TopMileage from './TopMileage/TopMileage';
import FuelChart from './FuelChart/FuelChart';

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
);

export default function DashboardStats() {
    const [totalVehicles, setTotalVehicles] = useState<number>(0);
    const [onlineCount, setOnlineCount] = useState<number>(0);
    const lastSeen = useRef<Record<string, number>>({});

    // Загрузка списка машин через наше API
    useEffect(() => {
        async function loadVehicles() {
            try {
                const res = await fetch('/api/vehicles');
                const vehicles = await res.json();
                setTotalVehicles(vehicles.length);
            } catch (e) {
                console.error('vehicles error', e);
            }
        }

        loadVehicles();
    }, []);

    // WebSocket для realtime
    useEffect(() => {
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'location') {
                lastSeen.current[msg.imei] = Date.now();
            }
        };

        const interval = setInterval(() => {
            const now = Date.now();
            const online = Object.keys(lastSeen.current).filter(
                imei => now - lastSeen.current[imei] < 60000
            ).length;
            setOnlineCount(online);
        }, 5000);

        return () => {
            ws.close();
            clearInterval(interval);
        };
    }, []);

    // Загрузка статистики (если нужна)
    useEffect(() => {
        async function loadStats() {
            try {
                await fetch('/api/dashboard/stats');
                // можно обработать данные, если нужно
            } catch (e) {
                console.error('stats error', e);
            }
        }

        loadStats();
    }, []);

    const offlineCount = Math.max(totalVehicles - onlineCount, 0);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 pt-6">
                <OnlineCard
                    connectedCount={onlineCount}
                    disconnectedCount={offlineCount}
                />
                <TopFuel />
                <TopMileage />
            </div>
            <FuelChart />
        </div>
    );
}