import api from '@/lib/axios';
import { Vehicle, ApiResponse } from '@/types/vehicle';

export const vehiclesApi = {
    getVehicles: async (): Promise<Vehicle[]> => {
        const response = await api.get<ApiResponse<Vehicle>>('/vehicles');
        const data = response.data;
        return Array.isArray(data) ? data : data.data || [];
    },

    deleteVehicle: async (id: number): Promise<void> => {
        await api.delete(`/vehicles/${id}`);
    },

};