import React from 'react';

interface Props {
  log: string[];
}

const CommandLog: React.FC<Props> = ({ log }) => {
  return (
    <div className="bg-[#111] border border-gray-700 rounded p-4 h-[363px] flex flex-col">
      <h2 className="text-white text-xl font-bold mb-2">Command Log</h2>
      <div className="overflow-y-auto flex-1 pr-1">
        {log.map((entry, idx) => (
          <div
            key={idx}
            className="bg-[#222] p-2 rounded text-gray-200 font-mono text-xs break-words mb-1"
          >
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
};


export default CommandLog;
