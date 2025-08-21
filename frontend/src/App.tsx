import React, { useEffect, useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import type { TelemetryData } from './types/Telemetry';
import LiveStats from './components/LiveStats';
import MapView from './components/MapView';
import AltitudeChart from './components/AltitudeChart';
import BatteryChart from './components/BatteryChart';
import FaultLog from './components/FaultLog';
import MissionControl from './components/MissionControl';
import SimulationControls from './components/SimulationControls';
import CommandLog from './components/CommandLog';

function App() {
  const { telemetry, connected } = useWebSocket('ws://localhost:8000/ws/telemetry');
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const [homeCoords, setHomeCoords] = useState<{ lat: number; lon: number }>({ lat: 0, lon: 0 });
  const [targetCoords, setTargetCoords] = useState<{ lat: number; lon: number }>({ lat: 0, lon: 0 });
  const [startTime, setStartTime] = useState<number | null>(null);

  const [running, setRunning] = useState(false);
  const [displayTelemetry, setDisplayTelemetry] = useState<TelemetryData | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/mission-config')
      .then((res) => res.json())
      .then((data) => {
        setHomeCoords({ lat: data.home_lat, lon: data.home_lon });
        setTargetCoords({ lat: data.target_lat, lon: data.target_lon });
        setStartTime(data.start_time ?? null);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (running && telemetry) {
      setDisplayTelemetry(telemetry);
      setHistory((prev) => [...prev, telemetry].slice(-100));
    }
  }, [telemetry, running]);

  return (
    <div className="min-h-screen bg-[#111] text-white p-4 font-mono w-full">
      <h1 className="text-base !text-base font-semibold mb-6 text-center tracking-wider">UAV Similator + Mission Control Dashboard</h1>

      {!connected && (
        <div className="bg-yellow-900 text-yellow-300 text-center p-2 mb-4 rounded animate-pulse">
          Disconnected from WebSocket
        </div>
      )}

      {telemetry?.system_status === 'WARNING' && (
        <div className="bg-red-900 text-red-200 text-center p-2 mb-4 rounded animate-pulse">
          SYSTEM WARNING: Critical fault detected
        </div>
      )}

      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        <AltitudeChart history={history} />
        <BatteryChart history={history} />
      </div>

      {/* Middle Row */}
      <div className="flex gap-4 px-4 mt-4 h-[400px]">
        <div className="w-1/3 h-full">
          <LiveStats telemetry={telemetry} home={homeCoords} target={targetCoords} startTime={startTime} />
        </div>
        <div className="w-1/3 h-full">
          <MapView telemetry={displayTelemetry} history={history} />
        </div>
        <div className="w-1/3 h-full">
          <FaultLog history={history} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex gap-4 px-4 mt-4" style={{ height: '360px' }}>
        <div className="w-1/4 h-full">
          <SimulationControls
          onStart={(home, target) => {
            // 1) Hard reset the UI for a clean run
            setHistory([]);             // clears the red polyline
            setLog([]);                 // clears Command Log
            setStartTime(null);
            setDisplayTelemetry(null);  // blanks map/marker until running resumes

            // 2) Update LiveStats coordinates immediately (no need to wait for re-fetch)
            setHomeCoords({ lat: home.lat, lon: home.lng });
            setTargetCoords({ lat: target.lat, lon: target.lng });

            // 3) Tell backend to start the mission
            fetch('http://localhost:8000/set-coordinates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ home_coordinates: home, target_coordinates: target }),
            })
              .then((res) => res.json())
              .then(() => {
                // Optional: sync start time with backend if it sets one
                // Re-fetch mission-config to get server start_time/home/target truth
                return fetch('http://localhost:8000/mission-config')
                  .then((r) => r.json())
                  .then((cfg) => {
                    setStartTime(cfg.start_time ?? Math.floor(Date.now() / 1000));
                    setHomeCoords({ lat: cfg.home_lat, lon: cfg.home_lon });
                    setTargetCoords({ lat: cfg.target_lat, lon: cfg.target_lon });
                    setRunning(true);    // start collecting history + displayTelemetry
                  });
              })
              .catch(console.error);
          }}
          onEnd={() => {
            fetch('http://localhost:8000/end-simulation', { method: 'POST' })
              .then((res) => res.json())
              .then(() => {
                // Full UI clear on stop
                setRunning(false);
                setHistory([]);          // clears the red polyline
                setLog([]);              // clears Command Log
                setStartTime(null);      // LiveStats shows N/A
                setDisplayTelemetry(null); // blanks map/marker
              })
              .catch(console.error);
          }}
        />

        </div>
        <div className="w-1/2 h-full">
          <MissionControl onCommandSent={(entry) => setLog((prev) => [entry, ...prev])} />
        </div>
        <div className="w-1/4 h-full">
          <CommandLog log={log} />
        </div>
      </div>
    </div>
  );
}

export default App;
