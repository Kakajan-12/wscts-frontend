'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TrackerDevice } from '@/types/vehicle';
import { trackersApi } from '@/lib/api/trackers';
import { format } from 'date-fns';

const ONLINE_TIMEOUT = 5 * 60 * 1000;

export default function UnregisteredTrackersPage() {
    const [trackers, setTrackers] = useState<TrackerDevice[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const lastSeenTime = useRef<Map<string, number>>(new Map());

    const updateOnlineStatus = useCallback(() => {
        const now = Date.now();
        setTrackers(prev =>
            prev.map(tracker => {
                const lastSeen = lastSeenTime.current.get(tracker.imei) ?? new Date(tracker.lastSeenAt).getTime();
                const isOnline = now - lastSeen < ONLINE_TIMEOUT;
                return { ...tracker, isOnline };
            })
        );
    }, []);

    useEffect(() => {
        async function load() {
            try {
                const data = await trackersApi.getUnregistered({ withLocation: true });
                // Инициализируем lastSeenTime
                data.forEach(t => {
                    const time = new Date(t.lastSeenAt).getTime();
                    lastSeenTime.current.set(t.imei, time);
                });
                // Сортируем по lastSeenAt (сначала новые)
                const sorted = [...data].sort(
                    (a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime()
                );
                setTrackers(sorted);
            } catch (error) {
                console.error('Failed to load unregistered trackers:', error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    useEffect(() => {
        if (loading) return;

        const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'location') {
                const imei: string = msg.imei;
                const lat: number = msg.data.latitude;
                const lng: number = msg.data.longitude;
                const now = Date.now();

                lastSeenTime.current.set(imei, now);

                setTrackers(prev => {
                    const index = prev.findIndex(t => t.imei === imei);
                    if (index === -1) return prev;

                    const updated = { ...prev[index] };
                    updated.lastLatitude = lat;
                    updated.lastLongitude = lng;
                    updated.lastSeenAt = new Date(now).toISOString();

                    const newTrackers = [...prev];
                    newTrackers[index] = updated;
                    // Пересортировываем, чтобы обновлённый трекер поднялся вверх
                    return newTrackers.sort(
                        (a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime()
                    );
                });
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error', error);
        };

        return () => ws.close();
    }, [loading]);

    useEffect(() => {
        const interval = setInterval(updateOnlineStatus, 10000);
        return () => clearInterval(interval);
    }, [updateOnlineStatus]);

    useEffect(() => {
        if (!loading) updateOnlineStatus();
    }, [loading, updateOnlineStatus]);

    const handleCreateVehicle = (imei: string) => {
        router.push(`/vehicles/new?imei=${encodeURIComponent(imei)}`);
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Unregistered Trackers</h1>
            {trackers.length === 0 ? (
                <p className="text-gray-500">No unregistered trackers found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">IMEI</th>
                            <th className="px-4 py-2 text-left">Latitude</th>
                            <th className="px-4 py-2 text-left">Longitude</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Last Seen</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {trackers.map((tracker) => {
                            const lastSeen = lastSeenTime.current.get(tracker.imei) ?? new Date(tracker.lastSeenAt).getTime();
                            const isOnline = Date.now() - lastSeen < ONLINE_TIMEOUT;

                            return (
                                <tr key={tracker.imei} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2 font-mono">{tracker.imei}</td>
                                    <td className="px-4 py-2">
                                        {tracker.lastLatitude ? parseFloat(tracker.lastLatitude.toString()).toFixed(6) : '—'}
                                    </td>
                                    <td className="px-4 py-2">
                                        {tracker.lastLongitude ? parseFloat(tracker.lastLongitude.toString()).toFixed(6) : '—'}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {isOnline ? 'Online' : 'Offline'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        {tracker.lastSeenAt ? format(new Date(tracker.lastSeenAt), 'dd.MM.yyyy HH:mm:ss') : 'Never'}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleCreateVehicle(tracker.imei)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                        >
                                            Create Vehicle
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}