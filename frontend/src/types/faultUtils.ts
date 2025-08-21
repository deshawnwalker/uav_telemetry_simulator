import type { TelemetryData } from '../types/Telemetry';

export interface FaultEntry {
  timestamp: number;
  message: string;
}

export function extractFaults(history: TelemetryData[]): FaultEntry[] {
  const faults: FaultEntry[] = [];

  history.forEach((data) => {
    if (data.gps_status === 'LOST') {
      faults.push({ timestamp: data.timestamp, message: 'GPS LOST' });
    }
    if (data.battery_temp > 110) {
      faults.push({ timestamp: data.timestamp, message: 'OVERHEAT' });
    }
  });

  return faults;
}
