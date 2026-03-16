import axios from 'axios';
import { junctions, alerts, trafficStats, systemOverview } from '../data/mockTrafficData';

// Placeholder for real API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const YOLO_API_BASE = import.meta.env.VITE_YOLO_API_URL || 'http://localhost:8000';
export const YOLO_WS_BASE = import.meta.env.VITE_YOLO_WS_URL || 'ws://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Real API Services
export const trafficService = {
  getJunctions: async () => {
    // Keep junctions mock for now as we don't have a DB table for them yet
    return new Promise((resolve) => {
      setTimeout(() => resolve(junctions), 300);
    });
  },
  
  getAlerts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(alerts), 300);
    });
  },
  
  getTrafficStats: async () => {
    try {
      const response = await api.get('/stats/history');
      return response.data;
    } catch (err) {
      console.error("Failed to fetch traffic history:", err);
      return trafficStats; // Fallback to mock
    }
  },
  
  getSystemOverview: async () => {
    try {
      const response = await api.get('/stats/overview');
      return response.data;
    } catch (err) {
      console.error("Failed to fetch system overview:", err);
      return systemOverview; // Fallback to mock
    }
  },

  updateSimulationStats: async (data) => {
    try {
      await api.post('/stats/update', data);
    } catch (err) {
      console.error("Failed to update simulation stats:", err);
    }
  },

  reportIssue: async (issueData) => {
    console.log('Reporting issue:', issueData);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  }
};

export default api;
