import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { YOLO_API_BASE, YOLO_WS_BASE, trafficService } from '../services/api';

const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
  const [isSystemOn, setIsSystemOn] = useState(false);
  const [viewMode, setViewMode] = useState('Object Detection');
  const [detectionData, setDetectionData] = useState({ detections: [], fps: 0 });
  const [streamUrl, setStreamUrl] = useState('');
  const [availableVideos, setAvailableVideos] = useState({ uploads: [], demo: [] });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const wsRef = useRef(null);
  const cycleIntervalRef = useRef(null);
  const lastPushRef = useRef(0);

  const connectWebSocket = () => {
    if (wsRef.current) wsRef.current.close();
    const ws = new WebSocket(`${YOLO_WS_BASE}/ws/live-detection`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetectionData(data);
    };
    ws.onclose = () => {
      if (isSystemOn) setTimeout(connectWebSocket, 3000);
    };
    wsRef.current = ws;
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${YOLO_API_BASE}/list-videos`);
      setAvailableVideos(response.data);
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

  useEffect(() => {
    if (isSystemOn) {
      connectWebSocket();
    } else {
      if (wsRef.current) wsRef.current.close();
      setDetectionData({ detections: [], fps: 0 });
    }
  }, [isSystemOn]);

  // Push statistics to backend
  useEffect(() => {
    if (isSystemOn && detectionData.detections.length > 0) {
      const now = Date.now();
      if (now - lastPushRef.current > 5000) {
        lastPushRef.current = now;
        const current_vehicles = detectionData.detections.length;
        const current_density = Math.min(100, Math.round((current_vehicles / 20) * 100));
        const has_emergency = detectionData.detections.some(d => d.label === 'ambulance' || d.label === 'fire truck');
        
        trafficService.updateSimulationStats({
          current_vehicles,
          current_density,
          has_emergency
        });
      }
    }
  }, [isSystemOn, detectionData]);

  // Handle Auto-Cycling
  useEffect(() => {
    if (isSystemOn && availableVideos.uploads.length > 0) {
      cycleIntervalRef.current = setInterval(() => {
        setCurrentVideoIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % availableVideos.uploads.length;
          setStreamUrl(`uploads/${availableVideos.uploads[nextIndex]}`);
          return nextIndex;
        });
      }, 20000);
    } else {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    }
    return () => {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    };
  }, [isSystemOn, availableVideos.uploads]);

  const toggleSystem = () => {
    const newState = !isSystemOn;
    setIsSystemOn(newState);
    if (newState && availableVideos.uploads.length > 0 && !streamUrl) {
      setStreamUrl(`uploads/${availableVideos.uploads[0]}`);
      setCurrentVideoIndex(0);
    }
  };

  return (
    <SimulationContext.Provider value={{
      isSystemOn,
      toggleSystem,
      viewMode,
      setViewMode,
      detectionData,
      streamUrl,
      setStreamUrl,
      availableVideos,
      fetchVideos
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => useContext(SimulationContext);
