// components/AltitudeChart.tsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import type { TelemetryData } from '../types/Telemetry';

interface Props {
  history: TelemetryData[];
}

const AltitudeChart: React.FC<Props> = ({ history }) => {
  const gpsLostTimestamps = history
    .filter(d => d.gps_status === 'LOST')
    .map(d => d.timestamp);

  return (
    <div className="bg-[#111] p-4 border border-gray-700 rounded">
      <h2 className="text-xl font-bold mb-2">Altitude Over Time</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(ts) => new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,})}
            stroke="#ccc"
            interval={Math.floor(history.length / 6)}
          />
          <YAxis stroke="#ccc" domain={['auto', 'auto']} tickFormatter={(val) => val.toFixed(1)}/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="altitude" stroke="#56ccf2" name="Altitude (ft)" dot={false} />
          {gpsLostTimestamps.map((ts, i) => (
            <ReferenceLine key={i} x={ts} stroke="red" strokeDasharray="3 3" label="GPS LOST" />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AltitudeChart;
