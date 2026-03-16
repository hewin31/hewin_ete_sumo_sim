import React from 'react';
import { MapPin, Car, Activity, AlertCircle } from 'lucide-react';

const JunctionCard = ({ junction, isSelected, onClick }) => {
  const getStatusColor = (color) => {
    const colors = {
      green: 'bg-traffic-green',
      yellow: 'bg-traffic-yellow',
      orange: 'bg-traffic-orange',
      red: 'bg-traffic-red',
      purple: 'bg-traffic-purple',
      black: 'bg-traffic-black',
      blue: 'bg-traffic-blue',
    };
    return colors[color] || 'bg-gray-400';
  };

  return (
    <div 
      onClick={() => onClick(junction)}
      className={`card cursor-pointer transform hover:-translate-y-1 transition-all ${isSelected ? 'border-secondary ring-2 ring-secondary/10 shadow-lg' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-gray-400 tracking-widest">{junction.id}</span>
        <div className={`traffic-dot ${getStatusColor(junction.statusColor)} shadow-sm shadow-${junction.statusColor}`}></div>
      </div>
      <h4 className="font-bold text-text mb-4 truncate" title={junction.name}>{junction.name}</h4>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Car size={14} />
          <span>{junction.vehicleCount}</span>
        </div>
        <div className="flex gap-1.5">
           {junction.emergency && <div className="p-1 px-1.5 bg-blue-100 text-blue-600 rounded-md"><Activity size={12} /></div>}
           {junction.accident && <div className="p-1 px-1.5 bg-purple-100 text-purple-600 rounded-md"><AlertCircle size={12} /></div>}
           <div className={`p-1 px-1.5 rounded-md text-[10px] font-bold ${
             junction.signalState === 'Green' ? 'bg-green-100 text-green-600' : 
             junction.signalState === 'Red' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
           }`}>{junction.signalState}</div>
        </div>
      </div>
    </div>
  );
};

export default JunctionCard;
