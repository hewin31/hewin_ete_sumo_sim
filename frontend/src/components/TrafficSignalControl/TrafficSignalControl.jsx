import React from 'react';
import { TrafficCone } from 'lucide-react';

const TrafficSignalControl = ({ signalState, timer }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-primary rounded-2xl text-white relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <TrafficCone size={80} />
      </div>
      <p className="text-xs uppercase opacity-60 font-bold mb-4 tracking-widest text-center">CURRENT PHASE</p>
      <div className="space-y-3 mb-6">
        <div className={`w-12 h-12 rounded-full border-4 ${signalState === 'Red' ? 'bg-red-500 border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-red-500/10 border-transparent'}`}></div>
        <div className={`w-12 h-12 rounded-full border-4 ${signalState === 'Yellow' ? 'bg-yellow-400 border-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'bg-yellow-400/10 border-transparent'}`}></div>
        <div className={`w-12 h-12 rounded-full border-4 ${signalState === 'Green' ? 'bg-green-500 border-green-300 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-green-500/10 border-transparent'}`}></div>
      </div>
      <div className="text-center">
        <p className="text-4xl font-black">{timer}s</p>
        <p className="text-[10px] uppercase opacity-40 font-bold mt-1 tracking-tighter">Remaining Time</p>
      </div>
    </div>
  );
};

export default TrafficSignalControl;
