import { useEffect, useState, useRef } from 'react';
import type { TelemetryData } from '../types/Telemetry';

export function useWebSocket(url: string) {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('[WS] Connected');
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTelemetry(data);
      } catch (err) {
        console.error('[WS] Invalid data:', event.data);
      }
    };

    socket.onclose = () => {
      console.log('[WS] Disconnected');
      setConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  return { telemetry, connected };
}
