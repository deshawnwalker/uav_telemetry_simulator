export interface TelemetryData {
  timestamp: number;
  altitude: number;
  battery_temp: number;
  gps_status: string;
  system_status: string;
  latitude: number;
  longitude: number;
  speed_mph: number;
  distance_to_target: number;
}
