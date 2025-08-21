import React, { useEffect, useState } from 'react';
import type { TelemetryData } from '../types/Telemetry';

interface Props {
  telemetry: TelemetryData | null;
  home: { lat: number; lon: number };
  target: { lat: number; lon: number };
  startTime: number | null;
}

const LiveStats: React.FC<Props> = ({ telemetry, home, target, startTime }) => {
  const [runtime, setRuntime] = useState<string>('N/A');

  const formattedStartTime = startTime
    ? new Date(startTime * 1000).toLocaleTimeString()
    : 'N/A';

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime * 1000) / 1000);

      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;

      setRuntime(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  if (!telemetry) {
    return (
      <div className="bg-[#111] border border-gray-700 rounded p-4 h-full text-sm text-gray-400">
        Waiting for telemetry...
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-gray-700 rounded p-4 h-full flex flex-col">
      <h2 className="text-white text-xl font-semibold mb-2">Live Stats</h2>
      <div className="overflow-y-auto flex-1 pr-1 text-sm" style={{ maxHeight: '250px' }}>
        <div>Start Time: {formattedStartTime}</div>
        <div>Runtime: {runtime}</div>
        <div>Home: {home.lat.toFixed(3)}, {home.lon.toFixed(3)}</div>
        <div>Target: {target.lat.toFixed(4)}, {target.lon.toFixed(4)}</div>
        <div>Current Location: {telemetry.latitude.toFixed(3)}, {telemetry.longitude.toFixed(3)}</div>
        <div>Distance to Target: {telemetry.distance_to_target.toFixed(2)} mi</div>
        <br />
        <div>Altitude: {telemetry.altitude.toFixed(1)} ft</div>
        <div>Speed: {telemetry.speed_mph.toFixed(1)} mph</div>
        <div>Battery Temp: {telemetry.battery_temp.toFixed(1)} °F</div>
        <div>GPS Status: {telemetry.gps_status}</div>
        <div>System Status: {telemetry.system_status}</div>
      </div>
    </div>
  );
};

export default LiveStats;
