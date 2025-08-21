import React from 'react';
import { extractFaults } from '../types/faultUtils';
import type { TelemetryData } from '../types/Telemetry';

interface Props {
  history: TelemetryData[];
}

const FaultLog: React.FC<Props> = ({ history }) => {
  const faults = extractFaults(history);

  return (
    <div className="bg-[#111] border border-gray-700 rounded p-4 h-full flex flex-col">
      <h2 className="text-white text-xl font-semibold mb-2">Fault Log</h2>
      <div className="overflow-y-auto flex-1 pr-1" style={{ maxHeight: '250px' }}>
        {faults.length === 0 ? (
          <p className="text-gray-400">No faults recorded.</p>
        ) : (
          <ul className="text-sm">
            {faults
              .slice()
              .reverse()
              .map((fault, idx) => (
                <li key={idx} className="mb-1">
                  <span className="text-red-300">
                    [{new Date(fault.timestamp * 1000).toLocaleTimeString()}] {fault.message}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FaultLog;
