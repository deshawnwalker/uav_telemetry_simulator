import React, { useState } from 'react';

interface Props {
  onCommandSent?: (entry: string) => void;
}

const MissionControl: React.FC<Props> = ({ onCommandSent }) => {
  const [speed, setSpeed] = useState(25);
  const [altitudeMode, setAltitudeMode] = useState<'ASCENT' | 'DESCENT' | 'CRUISE'>('CRUISE');
  const [missionMode, setMissionMode] = useState<'ACTIVE' | 'HOME'>('ACTIVE');

  const sendCommand = async () => {
    const command = {
      speed_mph: speed,
      altitude_mode: altitudeMode,
      mode: missionMode,
    };

    try {
      await fetch('http://localhost:8000/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
      });

      const entry = `[${new Date().toLocaleTimeString()}] Sent: ${JSON.stringify(command)}`;
      if (onCommandSent) onCommandSent(entry);
    } catch (err) {
      console.error('Command failed:', err);
    }
  };

  return (
    <div className="bg-[#111] p-3 border border-gray-700 rounded">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-white text-xl font-bold mb-2">Mission Control</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-300">Speed: {speed} mph</label>
          <input
            type="range"
            min={0}
            max={100}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-1 text-gray-300">Altitude Mode</p>
          <div className="flex gap-4">
            {['ASCENT', 'DESCENT', 'CRUISE'].map((mode) => (
              <label key={mode} className="flex items-center gap-1 text-white">
                <input
                  type="radio"
                  value={mode}
                  checked={altitudeMode === mode}
                  onChange={() => setAltitudeMode(mode as any)}
                />
                {mode}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-1 text-gray-300">Mission Mode</p>
          <div className="flex gap-4">
            {['ACTIVE', 'HOME'].map((mode) => (
              <label key={mode} className="flex items-center gap-1 text-white">
                <input
                  type="radio"
                  value={mode}
                  checked={missionMode === mode}
                  onChange={() => setMissionMode(mode as any)}
                />
                {mode}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 flex justify-end">
        <button
          onClick={sendCommand}
          className="bg-[#111] text-white px-4 py-2 rounded border border-gray-600 hover:bg-[#111] hover:border-gray-400x active:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-0"
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
          }} >
          Send Command
        </button>
      </div>
    </div>
  );
};

export default MissionControl;
