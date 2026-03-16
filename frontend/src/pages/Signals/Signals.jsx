import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  MapPin, 
  Clock, 
  Settings, 
  Cpu, 
  Hand, 
  AlertCircle,
  Car
} from 'lucide-react';
import { trafficService } from '../../services/api';
import JunctionCard from '../../components/JunctionCard/JunctionCard';
import JunctionDropdown from '../../components/JunctionDropdown/JunctionDropdown';
import TrafficSignalControl from '../../components/TrafficSignalControl/TrafficSignalControl';

const Signals = () => {
  const [junctions, setJunctions] = useState([]);
  const [selectedJunction, setSelectedJunction] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await trafficService.getJunctions();
      setJunctions(data);
      if (data.length > 0) setSelectedJunction(data[0]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleJunctionSelect = (junction) => {
    setSelectedJunction(junction);
  };

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

  if (isLoading) return <div className="animate-pulse">Loading signals...</div>;

  return (
    <div className="space-y-8">
      {/* Top Section - Controls & Selected Junction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection & Info */}
        <div className="card lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <JunctionDropdown 
              junctions={junctions} 
              selectedId={selectedJunction?.id} 
              onSelect={handleJunctionSelect} 
            />
            
            <div className="flex bg-background p-1 rounded-xl border border-border">
              <button 
                onClick={() => setIsManual(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!isManual ? 'bg-white shadow-sm text-secondary' : 'text-gray-500 hover:text-text'}`}
              >
                <Cpu size={16} /> AI Control
              </button>
              <button 
                onClick={() => setIsManual(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isManual ? 'bg-white shadow-sm text-secondary' : 'text-gray-500 hover:text-text'}`}
              >
                <Hand size={16} /> Manual
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-xl">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Junction ID</p>
                <p className="text-lg font-mono text-primary flex items-center gap-2 mt-1">
                  {selectedJunction?.id} <span className="text-[10px] bg-primary/10 px-2 py-0.5 rounded-full">ACTIVE</span>
                </p>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Density</p>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                     <div className="bg-secondary h-full" style={{width: `${selectedJunction?.density}%`}}></div>
                   </div>
                   <span className="text-sm font-bold text-text">{selectedJunction?.density}%</span>
                </div>
              </div>
            </div>

            <TrafficSignalControl 
               signalState={selectedJunction?.signalState} 
               timer={selectedJunction?.timer} 
            />

            <div className="space-y-4">
               <div className="p-4 bg-background rounded-xl">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Vehicle Count</p>
                <p className="text-2xl font-black text-text mt-1">{selectedJunction?.vehicleCount}</p>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</p>
                <div className="flex items-center gap-2 mt-2">
                   <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedJunction?.statusColor)}`}></div>
                   <span className="text-sm font-bold text-text">{selectedJunction?.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="card bg-gray-50/50">
          <h3 className="font-bold text-lg text-text mb-6 flex items-center gap-2">
            <Settings size={20} className="text-secondary" />
            Control Actions
          </h3>
          <div className="space-y-6">
            {!isManual ? (
              <div className="p-6 bg-white rounded-2xl border border-secondary/20 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 text-secondary">
                  <Cpu />
                  <p className="font-bold">Machine Learning Optimized</p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  The AI is currently managing this junction based on real-time vehicle flow and historical patterns. Manual overrides are disabled.
                </p>
                <div className="pt-4 border-t border-border mt-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">AI Confidence</span>
                    <span className="font-bold text-accent">98.4%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-accent h-full w-[98%]"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <button className="p-4 bg-red-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/20 transition-all active:scale-95">RED</button>
                  <button className="p-4 bg-yellow-400 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-400/20 transition-all active:scale-95">YEL</button>
                  <button className="p-4 bg-green-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-95">GRN</button>
                </div>
                <div className="p-4 bg-white rounded-xl border border-border">
                   <label className="text-xs font-bold text-gray-400 uppercase">Set Timer (Seconds)</label>
                   <input type="range" className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-secondary mt-4" min="5" max="120" step="1" />
                   <div className="flex justify-between mt-2 text-sm font-mono text-gray-500">
                     <span>5s</span>
                     <span className="font-bold text-secondary">60s</span>
                     <span>120s</span>
                   </div>
                </div>
                <button className="w-full btn-secondary py-4 shadow-lg shadow-secondary/20">Apply Manual Changes</button>
              </div>
            )}
            
            <button className="w-full group bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between hover:bg-red-600 hover:border-red-600 transition-all">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-red-500 text-white rounded-lg">
                   <AlertCircle size={20} />
                 </div>
                 <span className="font-bold text-red-600 group-hover:text-white">Emergency Lockout</span>
               </div>
               <div className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100">CRITICAL</div>
            </button>
          </div>
        </div>
      </div>

      {/* Junctions Grid */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-text">Network Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {junctions.map(j => (
            <JunctionCard 
              key={j.id} 
              junction={j} 
              isSelected={selectedJunction?.id === j.id} 
              onClick={handleJunctionSelect} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Signals;
