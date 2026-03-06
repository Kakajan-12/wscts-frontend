'use client';
import { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    LayersControl,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';

import MarkerClusterGroup from 'react-leaflet-markercluster';
import '@/styles/marker-cluster.css';

import carImg from '../../../public/excavator.webp';
import api from '@/lib/axios';
import { Vehicle, ApiResponse } from '@/types/vehicle';

const { BaseLayer } = LayersControl;

interface VehicleData {
    position: [number, number];
    status: 'online' | 'offline';
}


const createClusterIcon = (cluster: L.MarkerCluster): L.DivIcon => {
    const count = cluster.getChildCount();
    const size = count < 10 ? 'small' : count < 100 ? 'medium' : 'large';

    return L.divIcon({
        html: `<div class="cluster-${size}">${count}</div>`,
        className: 'custom-cluster-icon',
        iconSize: L.point(40, 40)
    });
};

const createVehicleIcon = (isOnline: boolean): L.DivIcon => {
    const svg = `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="38" cy="10" r="6" fill="${isOnline ? '#22c55e' : '#ef4444'}" stroke="white" stroke-width="2"/>
            <g transform="translate(4, 12)">
                ${carImg.src ? `<image href="${carImg.src}" width="32" height="32" />` : ''}
            </g>
        </svg>
    `;

    return L.divIcon({
        html: svg,
        className: 'vehicle-marker',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24]
    });
};

const VehicleMarker = ({
                           position,
                           isOnline,
                       }: {
    imei: string;
    position: [number, number];
    isOnline: boolean;
}) => {
    const markerRef = useRef<L.Marker>(null);
    const [icon] = useState<L.DivIcon>(() => createVehicleIcon(isOnline));

    useEffect(() => {
        markerRef.current?.setLatLng(position);
    }, [position]);

    useEffect(() => {
        markerRef.current?.setIcon(createVehicleIcon(isOnline));
    }, [isOnline]);

    return (
        <Marker
            ref={markerRef}
            position={position}
            icon={icon}
        />
    );
};

export default function MapOffline() {
    const [vehicles, setVehicles] = useState<Record<string, VehicleData>>({});
    const lastSeen = useRef<Record<string, number>>({});
    const allowedImeisRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        async function fetchUserVehicles() {
            try {
                const response = await api.get<ApiResponse<Vehicle>>('/vehicles');
                const vehiclesData = response.data;
                const vehiclesArray = Array.isArray(vehiclesData)
                    ? vehiclesData
                    : vehiclesData?.data || [];

                const imeiSet = new Set<string>();
                vehiclesArray.forEach((vehicle: Vehicle) => {
                    if (vehicle.defaultTrackerDevice?.imei) {
                        imeiSet.add(vehicle.defaultTrackerDevice.imei);
                    }
                });

                allowedImeisRef.current = imeiSet;
            } catch (e) {
            }
        }
        fetchUserVehicles();
    }, []);


    useEffect(() => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);

        ws.onmessage = (event: MessageEvent) => {
            const msg = JSON.parse(event.data);

            if (msg.type === 'location') {
                const imei: string = msg.imei;
                if (!allowedImeisRef.current.has(imei)) return;

                const lat: number = msg.data.latitude;
                const lng: number = msg.data.longitude;
                const now = Date.now();

                lastSeen.current[imei] = now;

                setVehicles(prev => {
                    const existing = prev[imei];
                    const newPosition: [number, number] = [lat, lng];

                    if (existing &&
                        existing.position[0] === lat &&
                        existing.position[1] === lng &&
                        existing.status === 'online') {
                        return prev;
                    }

                    return {
                        ...prev,
                        [imei]: {
                            position: newPosition,
                            status: 'online'
                        }
                    };
                });
            }
        };

        return () => ws.close();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const OFFLINE_TIMEOUT = 15 * 60 * 1000;

            setVehicles(prev => {
                let changed = false;
                const updated = { ...prev };

                Object.entries(updated).forEach(([imei, data]) => {
                    const lastSeenTime = lastSeen.current[imei];

                    if (lastSeenTime) {
                        const timeSinceLastSeen = now - lastSeenTime;

                        if (timeSinceLastSeen > OFFLINE_TIMEOUT && data.status === 'online') {
                            updated[imei] = {
                                ...data,
                                status: 'offline'
                            };
                            changed = true;
                            console.log(`🚗 Vehicle ${imei} went offline`);
                        }
                    }
                });

                return changed ? updated : prev;
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full" style={{ height: 'calc(100vh - 65px)' }}>
            <MapContainer
                center={[38.99218, 59.270815]}
                zoom={7}
                minZoom={3}
                maxZoom={18}
                zoomControl={false}
                style={{ width: '100%', height: '100%' }}
                maxBoundsViscosity={0.5}
                attributionControl={false}
            >
                <LayersControl position="bottomright">
                    <BaseLayer checked name="Satellite">
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            maxZoom={20}
                            attribution=""
                        />
                    </BaseLayer>

                    <BaseLayer name="Offline Map">
                        <TileLayer
                            key="offline-osm"
                            url={`http://84.252.75.46:8080/styles/basic-preview/{z}/{x}/{y}.png`}
                            maxZoom={19}
                            attribution="Offline OSM"
                        />
                    </BaseLayer>
                </LayersControl>

                <MarkerClusterGroup
                    iconCreateFunction={createClusterIcon}
                    showCoverageOnHover={true}
                    spiderfyDistanceMultiplier={2}
                    maxClusterRadius={80}
                >
                    {Object.entries(vehicles).map(([imei, data]) => (
                        <VehicleMarker
                            key={imei}
                            imei={imei}
                            position={data.position}
                            isOnline={data.status === 'online'}
                        />
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}