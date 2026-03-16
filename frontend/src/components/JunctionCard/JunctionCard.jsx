import React from 'react';
import { MapPin, Car, Activity, AlertCircle, ChevronRight, Terminal } from 'lucide-react';

const JunctionCard = ({ junction, isSelected, onClick }) => {
  const getStatusBg = (color) => {
    const colors = {
      green: 'bg-emerald-600',
      yellow: 'bg-amber-500',
      orange: 'bg-orange-600',
      red: 'bg-rose-600',
      purple: 'bg-purple-600',
      black: 'bg-slate-900',
      blue: 'bg-blue-600',
    };
    return colors[color] || 'bg-slate-400';
  };

  return (
    <div 
      onClick={() => onClick(junction)}
      className={`card cursor-pointer !p-0 border transition-all relative group ${
        isSelected 
        ? 'ring-2 ring-primary border-primary bg-slate-50' 
        : 'hover:border-slate-400 hover:shadow-md'
      }`}
    >
      <div className="p-4 border-b border-border bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Terminal size={14} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 font-mono tracking-tighter uppercase">{junction.id}</span>
        </div>
        <div className={`w-2.5 h-2.5 rounded-sm ${getStatusBg(junction.statusColor)}`} />
      </div>

      <div className="p-6">
        <h4 className="font-bold text-slate-900 mb-6 truncate text-base uppercase italic tracking-tight" title={junction.name}>
          {junction.name}
        </h4>
        
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 mt-2">
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Volume</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold tabular-nums">
                    <Car size={14} className="text-primary" />
                    {junction.vehicleCount}
                </div>
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phase</p>
                <div className={`inline-flex px-2 py-0.5 text-[9px] font-bold uppercase rounded-sm border ${
                    junction.signalState === 'Green' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                    junction.signalState === 'Red' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                    {junction.signalState}
                </div>
            </div>
        </div>
      </div>

      {(junction.emergency || junction.accident) && (
          <div className="absolute top-12 right-6 flex gap-1">
              {junction.emergency && (
                  <div className="w-6 h-6 bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center rounded-sm">
                      <Activity size={12} />
                  </div>
              )}
              {junction.accident && (
                  <div className="w-6 h-6 bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center rounded-sm">
                      <AlertCircle size={12} />
                  </div>
              )}
          </div>
      )}

      {isSelected && (
          <div className="absolute bottom-2 right-4 flex items-center gap-1 text-primary animate-pulse">
              <span className="text-[8px] font-bold uppercase tracking-widest">Selected Node</span>
              <ChevronRight size={10} />
          </div>
      )}
    </div>
  );
};

export default JunctionCard;
