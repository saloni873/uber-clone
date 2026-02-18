// frontend/src/components/LiveTracking.jsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon not showing up in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to keep the map centered on the car
const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) map.setView([position.ltd, position.lng], 15);
    }, [position, map]);
    return null;
};

const LiveTracking = ({ captainLocation }) => {
    const defaultPos = [21.1702, 72.8311]; // Default (Surat)

    return (
        <MapContainer 
            center={defaultPos} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            {captainLocation && (
                <>
                    <Marker position={[captainLocation.ltd, captainLocation.lng]} />
                    <RecenterMap position={captainLocation} />
                </>
            )}
        </MapContainer>
    );
};

export default LiveTracking;