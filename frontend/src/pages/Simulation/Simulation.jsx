import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Activity, 
  BarChart3, 
  Camera, 
  Info,
  Shield,
  Layers,
  Search,
  History,
  AlertTriangle,
  Upload,
  CheckCircle,
  X
} from 'lucide-react';
import { YOLO_API_BASE, YOLO_WS_BASE } from '../../services/api';

const Simulation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('Standard');
  const [detectionData, setDetectionData] = useState({ detections: [], fps: 0 });
  const [streamUrl, setStreamUrl] = useState('traffic.mp4'); 
  const [availableVideos, setAvailableVideos] = useState({ uploads: [], demo: [] });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const wsRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Reconnect logic for WebSocket
  const connectWebSocket = () => {
    if (wsRef.current) wsRef.current.close();
    
    const ws = new WebSocket(`${YOLO_WS_BASE}/ws/live-detection`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetectionData(data);
    };
    
    ws.onclose = () => {
      console.log('WS Disconnected. Reconnecting...');
      setTimeout(connectWebSocket, 3000);
    };
    
    wsRef.current = ws;
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${YOLO_API_BASE}/list-videos`);
      setAvailableVideos(response.data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    connectWebSocket();
    fetchVideos();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post(`${YOLO_API_BASE}/upload-video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      console.log('Upload success:', response.data);
      await fetchVideos(); // Refresh list
      setStreamUrl(response.data.url); // Select new video
      setIsPlaying(true); // Auto-play
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Connection might be broken.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const videoSrc = isPlaying 
    ? `${YOLO_API_BASE}/live-stream?url=${encodeURIComponent(streamUrl)}` 
    : '';

  const objectCounts = detectionData.detections.reduce((acc, det) => {
    acc[det.label] = (acc[det.label] || 0) + 1;
    return acc;
  }, {});

  const totalObjects = detectionData.detections.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">AI Traffic Simulation</h2>
          <p className="text-gray-500 mt-1">Live YOLOv8 Object Detection & Analytics</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative group w-64">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <select 
               className="input-field pl-10 text-sm appearance-none cursor-pointer pr-10"
               value={streamUrl}
               onChange={(e) => {
                 setStreamUrl(e.target.value);
                 setIsPlaying(false);
               }}
             >
               <optgroup label="Demo Content">
                 {availableVideos.demo.map(v => <option key={v} value={v}>{v}</option>)}
               </optgroup>
               {availableVideos.uploads.length > 0 && (
                 <optgroup label="Uploaded Files">
                   {availableVideos.uploads.map(v => <option key={v} value={`uploads/${v}`}>{v}</option>)}
                 </optgroup>
               )}
             </select>
           </div>
           
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="video/*"
             onChange={handleFileUpload} 
           />
           
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="btn-primary flex items-center gap-2 whitespace-nowrap"
             disabled={isUploading}
           >
             {isUploading ? (
               <>
                 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Uploading {uploadProgress}%
               </>
             ) : (
               <>
                 <Upload size={18} />
                 Upload Video
               </>
             )}
           </button>

           <div className="flex bg-white rounded-xl border border-border p-1 shadow-sm">
             {['Standard', 'Object Detection'].map(mode => (
               <button 
                 key={mode}
                 onClick={() => setViewMode(mode)}
                 className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === mode ? 'bg-secondary text-white shadow-md' : 'text-gray-500 hover:text-text'}`}
               >
                 {mode}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-black aspect-video flex items-center justify-center">
            {isPlaying ? (
              <img 
                src={videoSrc} 
                alt="Live Traffic Stream" 
                className="w-full h-full object-contain"
                onError={() => setIsPlaying(false)}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-white/20">
                <Camera size={80} strokeWidth={1} className="animate-pulse" />
                <p className="text-sm font-medium uppercase tracking-widest">Stream Paused</p>
              </div>
            )}
            
            {/* View Mode Overlays */}
            {viewMode === 'Object Detection' && isPlaying && detectionData.detections.map((det, idx) => (
              <div 
                key={`${det.id || idx}`}
                className="absolute border-2 border-accent bg-accent/10 rounded pointer-events-none transition-all duration-75"
                style={{
                  left: `${det.box[0] * 100}%`,
                  top: `${det.box[1] * 100}%`,
                  width: `${det.box[2] * 100}%`,
                  height: `${det.box[3] * 100}%`,
                }}
              >
                <div className="absolute -top-6 left-0 flex items-center gap-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-t shadow-sm">
                  <span>{det.label.toUpperCase()}</span>
                  <span className="opacity-70">{(det.conf * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}

            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary transform hover:scale-110 active:scale-95 transition-all shadow-xl"
                >
                  {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>
                <div className="space-y-1">
                  <p className="text-white font-bold text-shadow text-lg">Junction HD-CAM 08</p>
                  <p className="text-white/60 text-xs flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                    {isPlaying ? 'LIVE STREAMING' : 'IDLE'} • {streamUrl}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white">
                <button className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"><RotateCcw size={22} /></button>
                <button className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"><Maximize size={22} /></button>
              </div>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="card bg-primary text-white border-none shadow-primary/20">
                <p className="text-white/60 text-xs uppercase font-bold tracking-widest">Active Objects</p>
                <h4 className="text-4xl font-black mt-1">{isPlaying ? totalObjects : '--'}</h4>
                <div className="flex items-center gap-2 text-xs text-white/40 mt-2">
                   <Activity size={12} className="text-accent" /> 
                   <span>Real-time tracking enabled</span>
                </div>
             </div>
             <div className="card border-l-4 border-accent">
                <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Inference FPS</p>
                <h4 className="text-4xl font-black text-text mt-1">{isPlaying ? detectionData.fps : '0'}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                   <Shield size={12} className="text-accent" /> 
                   <span>High performance optimized</span>
                </div>
             </div>
             <div className="card border-l-4 border-secondary">
                <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Stream State</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`} />
                  <h4 className="text-3xl font-black text-text">{isPlaying ? 'CONNECTED' : 'STANDBY'}</h4>
                </div>
                <p className="text-xs text-gray-500 mt-2">Latency: ~40ms</p>
             </div>
          </div>
        </div>

        {/* Breakdown Sidebar */}
        <div className="space-y-6">
          <div className="card">
             <h3 className="font-bold text-lg text-text mb-6 flex items-center gap-2">
               <BarChart3 size={20} className="text-primary" />
               Current Breakdown
             </h3>
             <div className="space-y-5">
               {['car', 'motorcycle', 'truck', 'bus', 'person'].map(label => {
                 const count = objectCounts[label] || 0;
                 const percentage = totalObjects > 0 ? (count / totalObjects) * 100 : 0;
                 return (
                   <div key={label} className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500 capitalize">{label}s</span>
                       <span className="font-black text-text">{count}</span>
                     </div>
                     <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                       <div 
                        className={`h-full transition-all duration-500 ${label === 'truck' ? 'bg-secondary' : label === 'motorcycle' ? 'bg-accent' : 'bg-primary'}`} 
                        style={{width: `${percentage}%`}}
                       />
                     </div>
                   </div>
                 );
               })}
             </div>
             {totalObjects === 0 && isPlaying && (
               <div className="mt-8 py-3 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                 <p className="text-xs text-gray-400">Waiting for detections...</p>
               </div>
             )}
          </div>

          <div className="card bg-gray-50/10 border-dashed border-2">
             <h3 className="font-bold text-lg text-text mb-4 flex items-center gap-2">
               <History size={20} className="text-gray-400" />
               Recent Anomalies
             </h3>
             <div className="space-y-4">
                <div className="bg-white p-3 rounded-xl border border-border shadow-sm flex gap-3">
                  <div className="w-1.5 h-10 bg-red-500 rounded-full flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-text">Swerve Detected</p>
                    <p className="text-[10px] text-gray-400">J-001 • 2 mins ago</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-border shadow-sm flex gap-3 opacity-60">
                   <div className="w-1.5 h-10 bg-yellow-400 rounded-full flex-shrink-0" />
                   <div>
                    <p className="text-sm font-bold text-text">illegal U-Turn</p>
                    <p className="text-[10px] text-gray-400">J-001 • 15 mins ago</p>
                  </div>
                </div>
                <button className="w-full py-3 text-xs font-bold text-secondary text-center hover:underline">
                  View Full Event Log
                </button>
             </div>
          </div>

          <div className="card bg-orange-50 border-orange-100">
            <h3 className="font-bold text-orange-800 flex items-center gap-2 text-sm mb-2">
              <AlertTriangle size={16} /> Technical Warning
            </h3>
            <p className="text-[10px] text-orange-700 leading-relaxed">
              Detection accuracy may be reduced during low-light conditions. Recommend switching to thermal IR feed for Junction-001.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
