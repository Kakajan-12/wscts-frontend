import api from '@/lib/axios';
import { TrackerDevice, ApiResponse } from '@/types/vehicle';

interface GetUnregisteredParams {
    firstSeenAfter?: string;
    firstSeenBefore?: string;
    withLocation?: boolean;
}

export const trackersApi = {
    getUnregistered: async (params?: GetUnregisteredParams): Promise<TrackerDevice[]> => {
        const queryParams = new URLSearchParams();
        queryParams.append('registered', 'false');
        if (params?.firstSeenAfter) queryParams.append('firstSeenAfter', params.firstSeenAfter);
        if (params?.firstSeenBefore) queryParams.append('firstSeenBefore', params.firstSeenBefore);
        if (params?.withLocation) queryParams.append('withLocation', 'true');

        const response = await api.get<ApiResponse<TrackerDevice>>(`/trackers?${queryParams.toString()}`);
        const data = response.data;
        return Array.isArray(data) ? data : data.data || [];
    },
};