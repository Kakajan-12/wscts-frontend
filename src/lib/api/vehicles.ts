// src/lib/api/vehicles.ts
import api from '@/lib/axios';
import { Vehicle, CreateVehicleResponse } from '@/types/vehicle';

export interface CreateVehiclePayload {
    make?: string;
    model?: string;
    plateNumber?: string;
    engineNumber?: string;
    registrationNumber?: string;
    year?: number;
    color?: string;
    capacity?: number;
    capacityUnit?: string;
    registrationDate?: string;
    registrationExpiry?: string;
    insuranceExpiry?: string;
    status?: string;
    notes?: string;
    trackerDevice?: {
        imei: string;
        manufacturer?: string;
        model?: string;
        simNumber?: string;
        status?: string;
        notes?: string;
    };
}

export const vehiclesApi = {
    getVehicles: async (): Promise<Vehicle[]> => {
        const response = await api.get<{ data: Vehicle[]; count?: number; success?: boolean }>('/vehicles');
        return response.data.data || [];
    },

    deleteVehicle: async (id: number): Promise<void> => {
        await api.delete(`/vehicles/${id}`);
    },

    createVehicle: async (vehicleData: CreateVehiclePayload): Promise<Vehicle> => {
        const response = await api.post<CreateVehicleResponse>('/vehicles', vehicleData);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to create vehicle');
        }
        return response.data.data;
    },
};