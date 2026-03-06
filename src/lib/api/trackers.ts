import api from '@/lib/axios';
import { TrackerDevice } from '@/types/vehicle';

export const trackersApi = {
    getUnregistered: async (): Promise<TrackerDevice[]> => {
        const response = await api.get('/trackers?registered=false');
        const data = response.data;
        // API может возвращать массив или объект с полем data
        return Array.isArray(data) ? data : data.data || [];
    },
};