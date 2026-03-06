
export interface TrackerDevice {
    id: number;
    imei: string;
    manufacturer: string;
    model: string;
    simNumber: string;
    status: 'ACTIVE' | 'INACTIVE' | 'FAULTY';
    notes: string | null;
    isConnected: boolean;
    lastConnectedTime: string | null; // ISO date
    lastDisconnectedTime: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Depot {
    id: number;
    name: string;
    code: string;
}

export interface Vehicle {
    id: number;
    createdAt: string;
    updatedAt: string;
    make: string | null;
    model: string | null;
    engineNumber: string | null;
    plateNumber: string | null;
    registrationNumber: string | null;
    year: number | null;
    color: string | null;
    capacity: number | null;
    capacityUnit: string | null;
    registrationDate: string | null;
    registrationExpiry: string | null;
    insuranceExpiry: string | null;
    lastMaintenanceDate: string | null;
    maintenanceType: string | null;
    maintenanceDescription: string | null;
    maintenanceServiceProvider: string | null;
    maintenanceCompletedDate: string | null;
    nextMaintenanceDate: string | null;
    status: string;
    active: boolean;
    notes: string | null;
    defaultTrackerDevice: TrackerDevice | null;
    depot: Depot;
}

export type ApiResponse<T> = T[] | { data: T[]; count?: number; success?: boolean };