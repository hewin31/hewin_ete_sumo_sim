import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  MapPin, 
  Clock, 
  Cpu, 
  Hand, 
  AlertOctagon,
  Car,
  ChevronDown,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Info,
  Layers3,
  Terminal,
  Save,
  RotateCcw,
  RefreshCw,
  Settings
} from 'lucide-react';
import { trafficService } from '../../services/api';
import { useSimulation } from '../../context/SimulationContext';

const SignalControl = ({ direction, state, label, onManualSet, isManual, isEmergencyActive }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-border group">
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-sm ${isManual ? 'bg-slate-200 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                <Terminal size={16} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-900 uppercase italic leading-none">{direction}</p>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 tabular-nums text-lg font-bold text-slate-700">
                <Clock size={16} className="text-slate-400" />
                {state.timer}s
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-sm border border-border">
                {['red', 'yellow', 'green'].map(color => (
                    <button
                        key={color}
                        disabled={!isManual || isEmergencyActive}
                        onClick={() => onManualSet(direction, color)}
                        className={`w-8 h-8 flex items-center justify-center transition-all ${
                            state.color === color
                                ? (color === 'red' ? 'bg-rose-600' : color === 'yellow' ? 'bg-amber-500' : 'bg-emerald-600')
                                : 'hover:bg-slate-200'
                        }`}
                    >
                        <div className={`w-3 h-3 rounded-full border border-black/10 ${
                            state.color === color ? 'bg-white' : (
                                color === 'red' ? 'bg-rose-500/20' : color === 'yellow' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
                            )
                        }`} />
                    </button>
                ))}
            </div>
        </div>
    </div>
);

const Signals = () => {
  const { isSystemOn } = useSimulation();
  const [junctions, setJunctions] = useState([]);
  const [selectedJunction, setSelectedJunction] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  
  const [signalStates, setSignalStates] = useState({
    North: { color: 'red', timer: 30 },
    South: { color: 'red', timer: 30 },
    East: { color: 'green', timer: 45 },
    West: { color: 'green', timer: 45 }
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await trafficService.getJunctions();
      setJunctions(data);
      if (data.length > 0) setSelectedJunction(data[0]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isManual && !isEmergencyActive && selectedJunction) {
      const interval = setInterval(() => {
        setSignalStates(prev => {
          const isNorthSouthGo = prev.North.color === 'green';
          return {
            North: { color: isNorthSouthGo ? 'red' : 'green', timer: isNorthSouthGo ? 30 : 45 },
            South: { color: isNorthSouthGo ? 'red' : 'green', timer: isNorthSouthGo ? 30 : 45 },
            East: { color: isNorthSouthGo ? 'green' : 'red', timer: isNorthSouthGo ? 45 : 30 },
            West: { color: isNorthSouthGo ? 'green' : 'red', timer: isNorthSouthGo ? 45 : 30 }
          };
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isManual, isEmergencyActive, selectedJunction]);

  const toggleEmergency = () => {
    const newState = !isEmergencyActive;
    setIsEmergencyActive(newState);
    if (newState) {
      setSignalStates({
        North: { color: 'red', timer: 0 },
        South: { color: 'red', timer: 0 },
        East: { color: 'red', timer: 0 },
        West: { color: 'red', timer: 0 }
      });
      setIsManual(true);
    }
  };

  const setManualColor = (direction, color) => {
    if (!isManual || isEmergencyActive) return;
    setSignalStates(prev => ({
      ...prev,
      [direction]: { ...prev[direction], color }
    }));
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh] text-slate-400">
        <RefreshCw size={24} className="animate-spin mr-3" />
        <span className="text-sm font-semibold uppercase tracking-widest">Accessing Signal Processor...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Signal Management Console</h2>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-medium">Terminal Hub: Node-Alpha-09</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-sm border border-border">
                <button 
                  onClick={() => { setIsManual(false); setIsEmergencyActive(false); }}
                  className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${!isManual ? 'bg-white text-primary shadow-sm ring-1 ring-border' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Automated AI
                </button>
                <button 
                  onClick={() => setIsManual(true)}
                  className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${isManual && !isEmergencyActive ? 'bg-white text-primary shadow-sm ring-1 ring-border' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Manual Override
                </button>
            </div>
            <button 
                onClick={toggleEmergency}
                className={`flex items-center gap-2 px-6 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    isEmergencyActive 
                    ? 'bg-rose-600 text-white border-rose-700' 
                    : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50'
                }`}
            >
                <ShieldAlert size={14} /> Emergency Stop
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
            {/* Visual Monitoring Board */}
            <div className="card bg-slate-50 relative min-h-[600px] flex items-center justify-center border-dashed border-2">
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Visualization</p>
                    <div className="flex items-center gap-4">
                         <MapPin size={16} className="text-primary" />
                         <span className="text-sm font-bold text-slate-900">{selectedJunction?.name.toUpperCase()}</span>
                    </div>
                </div>

                {/* Simplified Road Intersection Map */}
                <div className="relative w-full max-w-2xl h-[400px]">
                    <div className="absolute left-1/2 -translate-x-1/2 w-40 h-full bg-white border-x border-border shadow-inner" />
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-40 bg-white border-y border-border shadow-inner" />
                    
                    {/* Signal Status Dots on Map */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-full mb-4">
                        <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md ${
                            signalStates.North.color === 'red' ? 'bg-rose-600' : signalStates.North.color === 'yellow' ? 'bg-amber-400' : 'bg-emerald-600'
                        }`} />
                    </div>
                    <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-full mt-4">
                        <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md ${
                            signalStates.South.color === 'red' ? 'bg-rose-600' : signalStates.South.color === 'yellow' ? 'bg-amber-400' : 'bg-emerald-600'
                        }`} />
                    </div>
                    <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-full mr-4">
                        <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md ${
                            signalStates.West.color === 'red' ? 'bg-rose-600' : signalStates.West.color === 'yellow' ? 'bg-amber-400' : 'bg-emerald-600'
                        }`} />
                    </div>
                    <div className="absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-full ml-4">
                        <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md ${
                            signalStates.East.color === 'red' ? 'bg-rose-600' : signalStates.East.color === 'yellow' ? 'bg-amber-400' : 'bg-emerald-600'
                        }`} />
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900 flex items-center justify-center text-white font-black text-xs">
                        CORE
                    </div>
                </div>

                {isEmergencyActive && (
                    <div className="absolute inset-0 bg-rose-900/10 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white border-2 border-rose-600 p-10 text-center space-y-4 shadow-2xl">
                             <AlertOctagon size={48} className="text-rose-600 mx-auto" />
                             <h4 className="text-xl font-black text-rose-600 uppercase tracking-tighter">Emergency Lockdown Active</h4>
                             <p className="text-xs text-rose-900/60 font-bold uppercase tracking-wider">All signal nodes are currently locked on RED phase</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center py-8">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cycle Throughput</p>
                    <p className="text-3xl font-black tabular-nums">{selectedJunction?.vehicleCount} <span className="text-xs opacity-40 font-bold">U/M</span></p>
                </div>
                <div className="card text-center py-8">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Phase Efficiency</p>
                    <p className="text-3xl font-black tabular-nums text-emerald-600">94.2%</p>
                </div>
                <div className="card text-center py-8">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Engine Prediction</p>
                    <p className="text-3xl font-black uppercase text-primary">Stable</p>
                </div>
            </div>
        </div>

        {/* Tactical Control Sidebar */}
        <div className="space-y-6">
            <div className="card">
                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-border pb-4 flex items-center gap-2">
                    <Settings size={14} /> Node Configuration
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Input Source Selection</label>
                        <select 
                            className="input-field cursor-pointer font-bold"
                            value={selectedJunction?.id}
                            onChange={(e) => setSelectedJunction(junctions.find(j => j.id === e.target.value))}
                        >
                            {junctions.map(j => (
                                <option key={j.id} value={j.id}>{j.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="card !p-0">
                <div className="p-4 border-b border-border bg-slate-50">
                    <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={14} /> Manual Phase Override
                    </h3>
                </div>
                <div className="divide-y divide-border">
                    <SignalControl direction="North" state={signalStates.North} label="Vector-A" onManualSet={setManualColor} isManual={isManual} isEmergencyActive={isEmergencyActive} />
                    <SignalControl direction="South" state={signalStates.South} label="Vector-B" onManualSet={setManualColor} isManual={isManual} isEmergencyActive={isEmergencyActive} />
                    <SignalControl direction="East" state={signalStates.East} label="Vector-C" onManualSet={setManualColor} isManual={isManual} isEmergencyActive={isEmergencyActive} />
                    <SignalControl direction="West" state={signalStates.West} label="Vector-D" onManualSet={setManualColor} isManual={isManual} isEmergencyActive={isEmergencyActive} />
                </div>
                <div className="p-4 bg-slate-50">
                    <button className="w-full btn-primary flex items-center justify-center gap-2">
                        <Save size={16} /> COMMIT CHANGES
                    </button>
                    <button className="w-full btn-secondary mt-2 flex items-center justify-center gap-2">
                        <RotateCcw size={16} /> RESET SYNC
                    </button>
                </div>
            </div>

            <div className="card bg-slate-100 border-border">
                <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Info size={14} /> Technical Info
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Manual override mode partitions the neural engine from the signal array. Operational responsibility resides with the authorized operator during active override.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Signals;
