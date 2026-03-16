import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Power,
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  BarChart3, 
  Camera, 
  Shield,
  Search,
  History,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { YOLO_API_BASE, YOLO_WS_BASE, trafficService } from '../../services/api';

const Simulation = () => {
  const [isSystemOn, setIsSystemOn] = useState(false);
  const [viewMode, setViewMode] = useState('Object Detection');
  const [detectionData, setDetectionData] = useState({ detections: [], fps: 0 });
  const [streamUrl, setStreamUrl] = useState(''); 
  const [availableVideos, setAvailableVideos] = useState({ uploads: [], demo: [] });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const wsRef = useRef(null);
  const cycleIntervalRef = useRef(null);
  const lastPushRef = useRef(0);
  
  // Push statistics to backend every 5 seconds
  useEffect(() => {
    if (isSystemOn && detectionData.detections.length > 0) {
      const now = Date.now();
      if (now - lastPushRef.current > 5000) {
        lastPushRef.current = now;
        
        const current_vehicles = detectionData.detections.length;
        const current_density = Math.min(100, Math.round((current_vehicles / 20) * 100)); // Normalized density
        const has_emergency = detectionData.detections.some(d => d.label === 'ambulance' || d.label === 'fire truck');
        
        trafficService.updateSimulationStats({
          current_vehicles,
          current_density,
          has_emergency
        });
      }
    }
  }, [isSystemOn, detectionData]);
  
  // Reconnect logic for WebSocket
  const connectWebSocket = () => {
    if (wsRef.current) wsRef.current.close();
    
    const ws = new WebSocket(`${YOLO_WS_BASE}/ws/live-detection`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetectionData(data);
    };
    
    ws.onclose = () => {
      if (isSystemOn) {
        setTimeout(connectWebSocket, 3000);
      }
    };
    
    wsRef.current = ws;
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${YOLO_API_BASE}/list-videos`);
      setAvailableVideos(response.data);
      
      // Set initial video if none selected
      if (!streamUrl && response.data.uploads.length > 0) {
        setStreamUrl(`uploads/${response.data.uploads[0]}`);
      } else if (!streamUrl && response.data.demo.length > 0) {
        setStreamUrl(response.data.demo[0]);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    };
  }, []);

  // Handle Auto-Cycling through videos
  useEffect(() => {
    if (isSystemOn && availableVideos.uploads.length > 0) {
      cycleIntervalRef.current = setInterval(() => {
        setCurrentVideoIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % availableVideos.uploads.length;
          setStreamUrl(`uploads/${availableVideos.uploads[nextIndex]}`);
          return nextIndex;
        });
      }, 20000); // Cycle every 20 seconds
    } else {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    }

    return () => {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    };
  }, [isSystemOn, availableVideos.uploads]);

  useEffect(() => {
    if (isSystemOn) {
      connectWebSocket();
    } else {
      if (wsRef.current) wsRef.current.close();
      setDetectionData({ detections: [], fps: 0 });
    }
  }, [isSystemOn]);

  const toggleSystem = () => {
    const newState = !isSystemOn;
    setIsSystemOn(newState);
    if (newState && availableVideos.uploads.length > 0) {
      // Start with the first video when turning on
      setStreamUrl(`uploads/${availableVideos.uploads[0]}`);
      setCurrentVideoIndex(0);
    }
  };

  const videoSrc = isSystemOn && streamUrl
    ? `${YOLO_API_BASE}/live-stream?url=${encodeURIComponent(streamUrl)}` 
    : '';

  const objectCounts = detectionData.detections.reduce((acc, det) => {
    acc[det.label] = (acc[det.label] || 0) + 1;
    return acc;
  }, {});

  const totalObjects = detectionData.detections.length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-text">AI Traffic Analytics</h2>
          <p className="text-gray-500 mt-1">Smart Traffic Enforcement & Optimization</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {/* System Power Toggle */}
           <button 
             onClick={toggleSystem}
             className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${
               isSystemOn 
               ? 'bg-red-500 text-white hover:bg-red-600 scale-105' 
               : 'bg-green-500 text-white hover:bg-green-600'
             }`}
           >
             <Power size={20} className={isSystemOn ? 'animate-pulse' : ''} />
             {isSystemOn ? 'STOP SYSTEM' : 'START SYSTEM'}
           </button>

           <div className="relative group w-64">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <select 
               className="input-field pl-10 text-sm appearance-none cursor-pointer pr-10"
               value={streamUrl}
               disabled={isSystemOn}
               onChange={(e) => setStreamUrl(e.target.value)}
             >
               {availableVideos.uploads.length > 0 && (
                 <optgroup label="Uploaded Monitoring Feeds">
                   {availableVideos.uploads.map(v => <option key={v} value={`uploads/${v}`}>{v}</option>)}
                 </optgroup>
               )}
               <optgroup label="System Demo Content">
                 {availableVideos.demo.map(v => <option key={v} value={v}>{v}</option>)}
               </optgroup>
             </select>
           </div>

           <div className="flex bg-white rounded-xl border border-border p-1 shadow-sm">
             {['Standard', 'Object Detection'].map(mode => (
               <button 
                 key={mode}
                 onClick={() => setViewMode(mode)}
                 className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === mode ? 'bg-secondary text-white' : 'text-gray-500 hover:text-text'}`}
               >
                 {mode === 'Standard' ? 'Normal' : 'AI View'}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          {/* Video Feed Area */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-900 aspect-video flex items-center justify-center group">
            {isSystemOn ? (
              <img 
                src={videoSrc} 
                alt="AI Detection Stream" 
                className="w-full h-full object-contain"
                onError={() => setIsSystemOn(false)}
              />
            ) : (
              <div className="flex flex-col items-center gap-6 text-white/10 text-center">
                <div className="relative">
                  <Camera size={100} strokeWidth={1} />
                  <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                </div>
                <div>
                    <p className="text-xl font-black uppercase tracking-widest text-white/20">System Standby</p>
                    <p className="text-sm text-white/10 mt-2 max-w-xs">Initializing neural networks... Waiting for activation command.</p>
                </div>
              </div>
            )}
            
            {/* AI Bounding Boxes (CSS Overlay) */}
            {viewMode === 'Object Detection' && isSystemOn && detectionData.detections.map((det, idx) => (
              <div 
                key={`${det.id || idx}`}
                className="absolute border-2 border-accent bg-accent/5 rounded pointer-events-none transition-all duration-75 ring-1 ring-white/30"
                style={{
                  left: `${det.box[0] * 100}%`,
                  top: `${det.box[1] * 100}%`,
                  width: `${det.box[2] * 100}%`,
                  height: `${det.box[3] * 100}%`,
                }}
              >
                <div className="absolute -top-6 left-0 flex items-center gap-1.5 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-t-lg shadow-lg">
                  <span className="capitalize">{det.label}</span>
                  <span className="opacity-60">{(det.conf * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}

            <div className="absolute inset-0 border-[20px] border-black/5 pointer-events-none" />
            
            {isSystemOn && (
                <div className="absolute top-8 left-8 flex items-center gap-3">
                    <div className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        LIVE FEED
                    </div>
                </div>
            )}
          </div>

          {/* Metric Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="card bg-primary text-white border-none relative overflow-hidden group">
                <Activity size={80} className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform" />
                <p className="text-white/60 text-xs uppercase font-bold tracking-widest">Active Objects</p>
                <h4 className="text-5xl font-black mt-1">{isSystemOn ? totalObjects : '--'}</h4>
                <p className="text-xs text-white/40 mt-3 font-medium flex items-center gap-2">
                    <Shield size={14} className="text-accent" /> Neural Tracking Active
                </p>
             </div>

             <div className="card border-l-4 border-accent relative overflow-hidden group">
                <RefreshCw size={80} className="absolute -right-4 -bottom-4 text-accent/5 group-hover:rotate-45 transition-transform" />
                <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Inference Speed</p>
                <h4 className="text-5xl font-black text-text mt-1">{isSystemOn ? detectionData.fps : '0'}</h4>
                <p className="text-xs text-gray-500 mt-3 font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" /> GPU Optimized (FP16)
                </p>
             </div>

             <div className="card border-l-4 border-secondary relative overflow-hidden">
                <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Video Source</p>
                <div className="flex items-center gap-3 mt-1 truncate">
                    <h4 className="text-2xl font-black text-text truncate max-w-[180px]">
                        {streamUrl.split('/').pop() || 'None Selected'}
                    </h4>
                </div>
                <p className="text-xs text-secondary font-bold mt-4">Local Loop: Enabled</p>
             </div>
          </div>
        </div>

        {/* Breakdown Sidebar */}
        <div className="space-y-6">
          <div className="card">
             <h3 className="font-bold text-lg text-text mb-6 flex items-center gap-2 border-b border-border pb-4">
               <BarChart3 size={20} className="text-primary" />
               Object Breakdown
             </h3>
             <div className="space-y-6">
               {['car', 'motorcycle', 'truck', 'bus', 'person'].map(label => {
                 const count = objectCounts[label] || 0;
                 const percentage = totalObjects > 0 ? (count / totalObjects) * 100 : 0;
                 return (
                   <div key={label} className="space-y-2 group">
                     <div className="flex justify-between text-sm font-semibold">
                       <span className="text-gray-400 capitalize group-hover:text-text transition-colors">{label}s</span>
                       <span className="text-text">{count}</span>
                     </div>
                     <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                       <div 
                        className={`h-full transition-all duration-700 ease-out py-1 ${
                            label === 'truck' ? 'bg-secondary' : 
                            label === 'motorcycle' ? 'bg-accent' : 
                            label === 'car' ? 'bg-primary' : 'bg-slate-400'
                        }`} 
                        style={{width: isSystemOn ? `${percentage}%` : '0%'}}
                       />
                     </div>
                   </div>
                 );
               })}
             </div>
             {totalObjects === 0 && isSystemOn && (
               <div className="mt-10 py-6 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                 <p className="text-xs text-slate-400 font-medium">Scanning video frames...</p>
                 <div className="flex gap-1 justify-center mt-3">
                    <div className="w-1 h-1 bg-accent rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                 </div>
               </div>
             )}
          </div>

          <div className="card bg-slate-50/50 border-dashed border-2">
             <h3 className="font-bold text-lg text-text mb-5 flex items-center gap-2">
               <History size={20} className="text-slate-400" />
               Detection Log
             </h3>
             <div className="space-y-4">
                {[
                  { label: 'Swerve', time: '2m', color: 'bg-red-500' },
                  { label: 'U-Turn', time: '15m', color: 'bg-yellow-400' },
                  { label: 'Overspeed', time: '1h', color: 'bg-orange-500' }
                ].map((log, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
                    <div className={`w-2.5 h-2.5 ${log.color} rounded-full flex-shrink-0 animate-pulse`} />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-text truncate">{log.label} Detected</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase font-letter">HD-FEEDS • {log.time} ago</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="card bg-blue-50 border-blue-100 flex items-start gap-4">
            <AlertTriangle size={24} className="text-blue-600 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-blue-900 text-sm">AI Configuration</h3>
                <p className="text-[11px] text-blue-700 leading-relaxed mt-1">
                    Running YOLOv8 with ByteTrack. CUDA backend active on RTX 3050.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
