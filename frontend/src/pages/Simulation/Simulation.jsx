import React, { useRef } from 'react';
import { 
  Power,
  Activity, 
  BarChart3, 
  Camera, 
  Shield,
  Search,
  History,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Monitor,
  Zap,
  BoxSelect,
  ChevronRight,
  Database,
  Terminal,
  Grid,
  FileText,
  Settings
} from 'lucide-react';
import { YOLO_API_BASE } from '../../services/api';
import { useSimulation } from '../../context/SimulationContext';

const Simulation = () => {
  const {
    isSystemOn,
    toggleSystem,
    viewMode,
    setViewMode,
    detectionData,
    streamUrl,
    setStreamUrl,
    availableVideos
  } = useSimulation();
  
  const videoSrc = isSystemOn && streamUrl
    ? `${YOLO_API_BASE}/live-stream?url=${encodeURIComponent(streamUrl)}` 
    : '';

  const objectCounts = detectionData.detections.reduce((acc, det) => {
    acc[det.label] = (acc[det.label] || 0) + 1;
    return acc;
  }, {});

  const totalObjects = detectionData.detections.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Video Metadata Processing Core</h2>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-medium">Instance: YOLO-V8-INF-01 // Sector GRID-7A</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-sm border border-border">
                {['Standard', 'Object Detection'].map(mode => (
                    <button 
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-white text-primary shadow-sm ring-1 ring-border' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {mode === 'Standard' ? 'RAW FEED' : 'AI OVERLAY'}
                    </button>
                ))}
            </div>

            <button 
                onClick={toggleSystem}
                className={`flex items-center gap-2 px-6 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    isSystemOn 
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
            >
                <Power size={14} />
                {isSystemOn ? 'SYSTEM SHUTDOWN' : 'ACTIVATE CORE'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
            {/* Main Processing Viewport */}
            <div className="card !p-2 bg-slate-900 aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/50 text-white text-[9px] font-bold tracking-widest uppercase border border-white/10 backdrop-blur-sm">
                        <Terminal size={12} className="text-accent" />
                        CONSOLE-STATED: LIVE-INF
                    </div>
                </div>

                {isSystemOn ? (
                    <img 
                        src={videoSrc} 
                        alt="AI Metadata Stream" 
                        className="w-full h-full object-contain"
                        onError={toggleSystem}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-6 text-slate-700">
                        <Camera size={64} strokeWidth={1} />
                        <div className="text-center space-y-2">
                            <p className="text-sm font-bold uppercase tracking-widest">Awaiting Command Initialization</p>
                            <p className="text-[10px] uppercase font-medium tracking-tight opacity-60">Select sector source and engage processing core</p>
                        </div>
                    </div>
                )}
                
                {/* AI Bounding Boxes (CSS Overlay) */}
                {viewMode === 'Object Detection' && isSystemOn && detectionData.detections.map((det, idx) => (
                    <div 
                        key={`${det.id || idx}`}
                        className="absolute border border-white bg-white/5 pointer-events-none transition-all duration-300"
                        style={{
                            left: `${det.box[0] * 100}%`,
                            top: `${det.box[1] * 100}%`,
                            width: `${det.box[2] * 100}%`,
                            height: `${det.box[3] * 100}%`,
                        }}
                    >
                        <div className="absolute -top-6 left-0 flex items-center gap-2 bg-white text-black text-[9px] font-bold px-2 py-0.5 border border-black shadow-sm">
                            <span className="uppercase tracking-widest">{det.label}</span>
                            <span className="opacity-60 tabular-nums">{(det.conf * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                ))}
                
                {/* Diagnostic HUD */}
                {isSystemOn && (
                    <div className="absolute bottom-6 right-6 flex gap-4 text-white/40 font-mono text-[9px]">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            LATENCY: {(1000/detectionData.fps).toFixed(1)}ms
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            THROUGHPUT: {detectionData.fps} FPS
                        </div>
                    </div>
                )}
            </div>

            {/* Hardware Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center py-6">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Detected Volume</p>
                    <p className="text-3xl font-black tabular-nums">{isSystemOn ? totalObjects : '00'}</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSystemOn ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">INF-ACTIVE</span>
                    </div>
                </div>
                <div className="card text-center py-6">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Processing Mode</p>
                    <p className="text-3xl font-black uppercase text-primary tracking-tighter italic">FP16-OPT</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <Cpu size={12} className="text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">CUDA CORE SYNC</span>
                    </div>
                </div>
                <div className="card text-center py-6">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Link Reliability</p>
                    <p className="text-3xl font-black tabular-nums text-emerald-600">99.98%</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <Database size={12} className="text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">DATA-PARITY-ON</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Configuration Sidebar */}
        <div className="space-y-6">
            <div className="card">
                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-border pb-4 flex items-center gap-2">
                    <Settings size={14} /> Source Config
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Input Metadata Feed</label>
                        <select 
                            className="input-field cursor-pointer font-bold"
                            value={streamUrl}
                            disabled={isSystemOn}
                            onChange={(e) => setStreamUrl(e.target.value)}
                        >
                            {availableVideos.uploads.length > 0 && (
                                <optgroup label="User Defined Feeds">
                                    {availableVideos.uploads.map(v => <option key={v} value={`uploads/${v}`}>{v}</option>)}
                                </optgroup>
                            )}
                            <optgroup label="System Benchmarks">
                                {availableVideos.demo.map(v => <option key={v} value={v}>{v}</option>)}
                            </optgroup>
                        </select>
                    </div>
                    <div className="p-4 bg-slate-50 border border-border mt-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Status</span>
                            <span className={`text-[10px] font-bold uppercase ${isSystemOn ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {isSystemOn ? 'CONNECTED' : 'STANDBY'}
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                            <div className={`h-full bg-accent transition-all duration-1000 ${isSystemOn ? 'w-full' : 'w-0'}`} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-8 border-b border-border pb-4 flex items-center gap-2">
                    <BarChart3 size={14} /> Taxonomy Grid
                </h3>
                <div className="space-y-5">
                    {['car', 'motorcycle', 'truck', 'bus', 'person'].map(label => {
                        const count = objectCounts[label] || 0;
                        const percentage = totalObjects > 0 ? (count / totalObjects) * 100 : 0;
                        return (
                            <div key={label} className="space-y-2 pt-1">
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{label} Instances</span>
                                    <span className="text-sm font-bold tabular-nums italic">{count}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-sm overflow-hidden border border-border">
                                    <div 
                                        className="h-full bg-primary transition-all duration-700 ease-out" 
                                        style={{width: isSystemOn ? `${percentage}%` : '0%'}}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                {isSystemOn && totalObjects > 0 && (
                    <button className="w-full mt-10 btn-secondary flex items-center justify-center gap-2">
                        <FileText size={14} /> EXPORT TELEMETRY
                    </button>
                )}
            </div>

            <div className="card bg-slate-900 border-none text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 relative z-10 italic">
                    <Terminal size={12} className="text-accent" /> ENGINE_LOG
                </h4>
                <div className="space-y-2 font-mono text-[9px] relative z-10">
                    <p className="text-emerald-500 opacity-80">{">"} GPU Core engaged at 52°C</p>
                    <p className="text-slate-500">{">"} Pre-processing image buffer...</p>
                    <p className="text-slate-500">{">"} Mapping neural vectors...</p>
                    <p className="text-amber-500 animate-pulse">{">"} INF-LOOP-ACTIVE</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
