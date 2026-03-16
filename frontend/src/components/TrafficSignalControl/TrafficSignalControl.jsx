import React from 'react';
import { TrafficCone, Terminal } from 'lucide-react';

const TrafficSignalControl = ({ signalState, timer }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-border rounded-sm shadow-sm relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Terminal size={64} className="text-slate-200" />
      </div>
      
      <p className="text-[10px] uppercase font-bold text-slate-500 mb-6 tracking-[0.2em] text-center border-b border-border pb-4 w-full">
        LOGICAL PHASE STATE
      </p>

      <div className="flex flex-col gap-4 mb-8 bg-slate-50 p-6 border border-border rounded-sm">
        <div className={`w-10 h-10 border-2 flex items-center justify-center transition-all ${
            signalState === 'Red' ? 'bg-rose-600 border-rose-700 shadow-sm' : 'bg-slate-200 border-slate-300 opacity-20'
        }`}>
            {signalState === 'Red' && <div className="w-4 h-4 rounded-full bg-white shadow-inner" />}
        </div>
        <div className={`w-10 h-10 border-2 flex items-center justify-center transition-all ${
            signalState === 'Yellow' ? 'bg-amber-400 border-amber-500 shadow-sm' : 'bg-slate-200 border-slate-300 opacity-20'
        }`}>
            {signalState === 'Yellow' && <div className="w-4 h-4 rounded-full bg-white shadow-inner" />}
        </div>
        <div className={`w-10 h-10 border-2 flex items-center justify-center transition-all ${
            signalState === 'Green' ? 'bg-emerald-600 border-emerald-700 shadow-sm' : 'bg-slate-200 border-slate-300 opacity-20'
        }`}>
            {signalState === 'Green' && <div className="w-4 h-4 rounded-full bg-white shadow-inner" />}
        </div>
      </div>

      <div className="text-center px-6 py-4 bg-[#1B365D] text-white w-full rounded-sm">
        <p className="text-3xl font-black tabular-nums tracking-tighter">{timer}s</p>
        <p className="text-[9px] uppercase font-bold mt-1 tracking-widest text-slate-300">Phase Segment Timer</p>
      </div>
    </div>
  );
};

export default TrafficSignalControl;
