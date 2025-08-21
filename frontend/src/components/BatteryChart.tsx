import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import type { TelemetryData } from '../types/Telemetry';

interface Props {
  history: TelemetryData[];
}

export const BatteryChart: React.FC<Props> = ({ history }) => {
  const overheatTimestamps = history
    .filter(d => d.battery_temp > 110)
    .map(d => d.timestamp);

  return (
    <div className="bg-[#111] p-4 border border-gray-700 rounded">
      <h2 className="text-xl font-bold mb-2">Battery Temp Over Time</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={ts => new Date(ts * 1000).toLocaleTimeString().split(" ")[0]}
            stroke="#ccc"
            interval={Math.floor(history.length / 6)}
          />
          <YAxis stroke="#ccc" domain={['auto', 'auto']} tickFormatter={(val) => val.toFixed(2)} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="battery_temp" stroke="#bb6bd9" name="Battery Temp (°F)" dot={false} />
          {overheatTimestamps.map((ts, i) => (
            <ReferenceLine key={i} x={ts} stroke="red" strokeDasharray="3 3" label="OVERHEAT" />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BatteryChart;