import axios from 'axios';
import { junctions, alerts, trafficStats, systemOverview } from '../data/mockTrafficData';

// Placeholder for real API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const YOLO_API_BASE = import.meta.env.VITE_YOLO_API_URL || 'http://localhost:8000';
export const YOLO_WS_BASE = import.meta.env.VITE_YOLO_WS_URL || 'ws://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Mock services that return mock data with a slight delay to simulate network
export const trafficService = {
  getJunctions: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(junctions), 500);
    });
  },
  
  getAlerts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(alerts), 500);
    });
  },
  
  getTrafficStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(trafficStats), 500);
    });
  },
  
  getSystemOverview: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(systemOverview), 500);
    });
  },

  reportIssue: async (issueData) => {
    console.log('Reporting issue:', issueData);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  }
};

export default api;
