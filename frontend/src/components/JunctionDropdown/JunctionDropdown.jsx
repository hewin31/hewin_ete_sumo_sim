import React from 'react';
import { MapPin } from 'lucide-react';

const JunctionDropdown = ({ junctions, selectedId, onSelect }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
        <MapPin size={20} />
      </div>
      <select 
        className="bg-transparent border-none text-xl font-bold text-text focus:ring-0 outline-none cursor-pointer"
        value={selectedId}
        onChange={(e) => {
          const junction = junctions.find(j => j.id === e.target.value);
          onSelect(junction);
        }}
      >
        {junctions.map(j => (
          <option key={j.id} value={j.id}>{j.name}</option>
        ))}
      </select>
    </div>
  );
};

export default JunctionDropdown;
