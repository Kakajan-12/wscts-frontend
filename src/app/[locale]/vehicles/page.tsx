'use client';

import { useEffect, useState } from 'react';
import { Vehicle, TrackerDevice } from '@/types/vehicle';
import { vehiclesApi } from '@/lib/api/vehicles';
import { trackersApi } from '@/lib/api/trackers';

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [unregisteredTrackers, setUnregisteredTrackers] = useState<TrackerDevice[]>([]);
    const [showUnregistered, setShowUnregistered] = useState(false);
    const [loadingTrackers, setLoadingTrackers] = useState(false);

    async function reload() {
        const data = await vehiclesApi.getVehicles();
        setVehicles(data);
    }

    useEffect(() => {
        reload();
    }, []);

    async function handleShowUnregistered() {
        setLoadingTrackers(true);
        try {
            const data = await trackersApi.getUnregistered();
            setUnregisteredTrackers(data);
            setShowUnregistered(true);
        } catch (error) {
            console.error('Failed to fetch unregistered trackers', error);
        } finally {
            setLoadingTrackers(false);
        }
    }

    return (
        <div className="p-6 space-y-4">
            <div className="flex gap-4">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add vehicle
                </button>
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={handleShowUnregistered}
                    disabled={loadingTrackers}
                >
                    {loadingTrackers ? 'Loading...' : 'Show unregistered IMEIs'}
                </button>
            </div>

            {showUnregistered && (
                <div className="border rounded p-4 bg-gray-50">
                    <h3 className="font-semibold mb-2">Unregistered trackers (IMEIs):</h3>
                    {unregisteredTrackers.length === 0 ? (
                        <p className="text-gray-500">No unregistered trackers found.</p>
                    ) : (
                        <ul className="list-disc pl-5 space-y-1">
                            {unregisteredTrackers.map((t) => (
                                <li key={t.id}>
                                    <span className="font-mono">{t.imei}</span>
                                    {t.manufacturer && ` (${t.manufacturer} ${t.model})`}
                                    {t.lastConnectedTime && ` - last seen: ${new Date(t.lastConnectedTime).toLocaleString()}`}
                                </li>
                            ))}
                        </ul>
                    )}
                    <button
                        className="mt-2 text-sm text-gray-600 underline"
                        onClick={() => setShowUnregistered(false)}
                    >
                        Close
                    </button>
                </div>
            )}

            {vehicles.length === 0 ? (
                <p className="text-gray-500">No vehicles found</p>
            ) : (
                vehicles.map((v) => (
                    <div key={v.id} className="border p-3 rounded flex justify-between items-center">
                        <span>
                            {v.make || 'Unknown'} {v.model || ''} — {v.plateNumber || 'No plate'}
                        </span>
                        <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => vehiclesApi.deleteVehicle(v.id).then(reload)}
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}