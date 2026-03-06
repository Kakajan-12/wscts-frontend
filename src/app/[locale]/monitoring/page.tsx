'use client';
import dynamic from 'next/dynamic';
const MapOffline = dynamic(() => import('@/components/Map/MapOffline'), {ssr: false});
export default function Monitoring() {

    return (
        <div  className="w-full"
              style={{ height: 'calc(100vh - 88px)' }}>
            <MapOffline/>
        </div>
    );
}