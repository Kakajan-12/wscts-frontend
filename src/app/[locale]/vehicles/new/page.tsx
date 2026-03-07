'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { vehiclesApi } from '@/lib/api/vehicles';

export default function NewVehiclePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prefillImei = searchParams.get('imei') || '';

    const [formData, setFormData] = useState({
        make: '',
        model: '',
        plateNumber: '',
        engineNumber: '',
        registrationNumber: '',
        year: new Date().getFullYear(),
        color: '',
        capacity: '',
        capacityUnit: 'm3',
        registrationDate: '',
        registrationExpiry: '',
        insuranceExpiry: '',
        status: 'AVAILABLE',
        notes: '',
        trackerImei: prefillImei,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Подготавливаем данные для отправки на бэкенд
            const payload: any = {
                make: formData.make,
                model: formData.model,
                plateNumber: formData.plateNumber,
                engineNumber: formData.engineNumber,
                registrationNumber: formData.registrationNumber,
                year: formData.year ? parseInt(formData.year.toString()) : undefined,
                color: formData.color,
                capacity: formData.capacity ? parseFloat(formData.capacity) : undefined,
                capacityUnit: formData.capacityUnit,
                registrationDate: formData.registrationDate || undefined,
                registrationExpiry: formData.registrationExpiry || undefined,
                insuranceExpiry: formData.insuranceExpiry || undefined,
                status: formData.status,
                notes: formData.notes,
            };

            // Если указан IMEI трекера, добавляем trackerDevice
            if (formData.trackerImei) {
                payload.trackerDevice = {
                    imei: formData.trackerImei,
                    // Можно добавить другие поля, если нужно
                };
            }

            await vehiclesApi.createVehicle(payload);
            router.push('/vehicles'); // Возвращаемся к списку машин
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create vehicle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Vehicle</h1>
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Make *</label>
                        <input
                            type="text"
                            name="make"
                            value={formData.make}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Model *</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Plate Number *</label>
                        <input
                            type="text"
                            name="plateNumber"
                            value={formData.plateNumber}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Engine Number</label>
                        <input
                            type="text"
                            name="engineNumber"
                            value={formData.engineNumber}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Registration Number</label>
                        <input
                            type="text"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Year</label>
                        <input
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Color</label>
                        <input
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Capacity</label>
                        <input
                            type="number"
                            step="0.1"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Capacity Unit</label>
                        <select
                            name="capacityUnit"
                            value={formData.capacityUnit}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="m3">m³</option>
                            <option value="L">L</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Registration Date</label>
                        <input
                            type="date"
                            name="registrationDate"
                            value={formData.registrationDate}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Registration Expiry</label>
                        <input
                            type="date"
                            name="registrationExpiry"
                            value={formData.registrationExpiry}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Insurance Expiry</label>
                        <input
                            type="date"
                            name="insuranceExpiry"
                            value={formData.insuranceExpiry}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="IN_USE">In Use</option>
                            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                            <option value="OUT_OF_SERVICE">Out of Service</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Tracker IMEI</label>
                        <input
                            type="text"
                            name="trackerImei"
                            value={formData.trackerImei}
                            onChange={handleChange}
                            placeholder="IMEI of tracker to assign"
                            className="w-full border p-2 rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            If empty, vehicle will be created without tracker. You can assign later.
                        </p>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Creating...' : 'Create Vehicle'}
                    </button>
                </div>
            </form>
        </div>
    );
}