import React, { useState } from 'react';

interface Props {
  onStart: (home: { lat: number; lng: number }, target: { lat: number; lng: number }) => void;
  onEnd: () => void;
}

const SimulationControls: React.FC<Props> = ({ onStart, onEnd }) => {
  const [homeLat, setHomeLat] = useState('');
  const [homeLng, setHomeLng] = useState('');
  const [targetLat, setTargetLat] = useState('');
  const [targetLng, setTargetLng] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    if (homeLat && homeLng && targetLat && targetLng) {
      onStart(
        { lat: parseFloat(homeLat), lng: parseFloat(homeLng) },
        { lat: parseFloat(targetLat), lng: parseFloat(targetLng) }
      );
      setShowForm(false);
    } else {
      alert('Please fill in all coordinate fields.');
    }
  };

  return (
    <div className="bg-[#111] p-4 border border-gray-700 rounded">
      <div>
        <h2 className="text-white text-xl font-bold mb-2">Simulation Control</h2>

        <button
          className="w-full bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded mb-2"
          onClick={() => setShowForm(true)}
        >
          Start
        </button>

        <button
          className="w-full bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={onEnd}
        >
          End
        </button>
      </div>

      {showForm && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="text-gray-300">Home Coordinates</div>
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={homeLat}
              onChange={(e) => setHomeLat(e.target.value)}
              className="w-1/2 px-2 py-1 bg-gray-800 text-white rounded"
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={homeLng}
              onChange={(e) => setHomeLng(e.target.value)}
              className="w-1/2 px-2 py-1 bg-gray-800 text-white rounded"
            />
          </div>

          <div className="text-gray-300">Target Coordinates</div>
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={targetLat}
              onChange={(e) => setTargetLat(e.target.value)}
              className="w-1/2 px-2 py-1 bg-gray-800 text-white rounded"
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={targetLng}
              onChange={(e) => setTargetLng(e.target.value)}
              className="w-1/2 px-2 py-1 bg-gray-800 text-white rounded"
            />
          </div>

          <button
            className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded"
            onClick={handleSubmit}
          >
            Confirm Coordinates
          </button>
        </div>
      )}
    </div>
  );
};

export default SimulationControls;
