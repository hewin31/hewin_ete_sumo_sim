import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

const JunctionDropdown = ({ junctions, selectedId, onSelect }) => {
  return (
    <div className="flex items-center gap-3 bg-white border border-border px-3 py-1.5 shadow-sm">
      <div className="p-1.5 bg-slate-100 text-slate-500 rounded-sm">
        <MapPin size={16} />
      </div>
      <div className="relative flex items-center">
        <select 
          className="bg-transparent border-none text-sm font-bold text-slate-900 focus:ring-0 outline-none cursor-pointer appearance-none pr-8 py-0"
          value={selectedId}
          onChange={(e) => {
            const junction = junctions.find(j => j.id === e.target.value);
            onSelect(junction);
          }}
        >
          {junctions.map(j => (
            <option key={j.id} value={j.id} className="font-sans font-medium">{j.name.toUpperCase()}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-0 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default JunctionDropdown;
