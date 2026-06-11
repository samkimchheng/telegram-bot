'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  userLocation: { lat: number; lng: number } | null;
  officeLocation: { lat: number; lng: number };
  radius: number;
}

export default function Map({ userLocation, officeLocation, radius }: MapProps) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden z-0 relative border border-slate-200">
      <MapContainer
        center={[officeLocation.lat, officeLocation.lng]}
        zoom={userLocation ? 16 : 15}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Office Marker */}
        <Marker position={[officeLocation.lat, officeLocation.lng]}>
          <Popup>Office Location</Popup>
        </Marker>
        
        {/* Geofence Circle */}
        <Circle
          center={[officeLocation.lat, officeLocation.lng]}
          radius={radius}
          pathOptions={{ color: 'indigo', fillColor: 'indigo', fillOpacity: 0.1 }}
        />

        {/* User Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
