import axios from 'axios';
import { junctions, alerts, trafficStats, systemOverview } from '../data/mockTrafficData';

// Placeholder for real API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const YOLO_API_BASE = import.meta.env.VITE_YOLO_API_URL || 'http://localhost:8000';
export const YOLO_WS_BASE = import.meta.env.VITE_YOLO_WS_URL || 'ws://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Authentication services
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user } = response.data;
      return { user };
    } catch (err) {
      throw err.response?.data?.error || 'Login failed';
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      throw err.response?.data?.error || 'Registration failed';
    }
  },

  logout: () => {
    // No tokens to clear in simple auth
  }
};

// Real API Services
export const trafficService = {
  getJunctions: async () => {
    try {
      const response = await api.get('/signals/junctions');
      return response.data;
    } catch (err) {
      console.error("Failed to fetch junctions:", err);
      // Fallback to mock data if API fails
      return junctions;
    }
  },

  getAlerts: async () => {
    try {
      const response = await api.get('/alerts');
      return response.data;
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      // Fallback to mock data if API fails
      return alerts;
    }
  },

  createAlert: async (alertData) => {
    try {
      const response = await api.post('/alerts', alertData);
      return response.data;
    } catch (err) {
      throw err.response?.data?.error || 'Failed to create alert';
    }
  },

  updateAlert: async (id, status) => {
    try {
      const response = await api.put(`/alerts/${id}`, { status });
      return response.data;
    } catch (err) {
      throw err.response?.data?.error || 'Failed to update alert';
    }
  },

  deleteAlert: async (id) => {
    try {
      const response = await api.delete(`/alerts/${id}`);
      return response.data;
    } catch (err) {
      throw err.response?.data?.error || 'Failed to delete alert';
    }
  },

  getTrafficStats: async () => {
    try {
      const response = await api.get('/stats/history');
      return response.data;
    } catch (err) {
      console.error("Failed to fetch traffic history:", err);
      return []; // Return empty array instead of mock
    }
  },

  getSystemOverview: async () => {
    try {
      const response = await api.get('/stats/overview');
      return response.data;
    } catch (err) {
      console.error("Failed to fetch system overview:", err);
      return {}; // Return empty object instead of mock
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
    try {
      const response = await api.post('/issues', issueData);
      return response.data;
    } catch (err) {
      throw err.response?.data?.error || 'Failed to report issue';
    }
  },

  getReportedIssues: async () => {
    try {
      const response = await api.get('/issues');
      return response.data;
    } catch (err) {
      console.error("Failed to fetch issues:", err);
      return [];
    }
  },

  updateIssueStatus: async (id, status) => {
    try {
      const response = await api.put(`/issues/${id}`, { status });
      return response.data;
    } catch (err) {
      throw err.response?.data?.error || 'Failed to update issue';
    }
  },

  getSignalOverrides: async (junctionId) => {
    try {
      const response = await api.get(`/signals/${junctionId}`);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch signal overrides:", err);
      return [];
    }
  },

  createSignalOverride: async (junctionId, overrides) => {
    try {
      const response = await api.post('/signals/override', { junction_id: junctionId, overrides });
      return response.data;
    } catch (err) {
      throw err.response?.data?.error || 'Failed to create signal override';
    }
  }
};

export default api;
