import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import type { TelemetryData } from '../types/Telemetry';
import 'leaflet/dist/leaflet.css';

interface Props {
  telemetry: TelemetryData | null;
  history: TelemetryData[];
}

const customIcon = new L.Icon({
  iconUrl: '/drone.png', // Place this image in the /public folder
  iconSize: [80, 80],
  iconAnchor: [42, 58],
  popupAnchor: [0, -40],
});

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

const MapView: React.FC<Props> = ({ telemetry, history }) => {
  if (!telemetry) return null;

  const { latitude, longitude } = telemetry;

  return (
    <div className="h-[400px] border border-gray-700 rounded overflow-hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Grayscale basemap */}
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />

        {/* UAV marker */}
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>
            Lat: {latitude.toFixed(5)}<br />
            Lon: {longitude.toFixed(5)}
          </Popup>
        </Marker>

        <RecenterMap lat={latitude} lon={longitude} />
      </MapContainer>
    </div>
  );
};

export default MapView;
