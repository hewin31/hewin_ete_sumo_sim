import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Signals from './pages/Signals/Signals';
import Alerts from './pages/Alerts/Alerts';
import Simulation from './pages/Simulation/Simulation';
import ReportIssue from './pages/ReportIssue/ReportIssue';
import Profile from './pages/Profile/Profile';
import { authService } from './services/api';

// Helper to get Page Title based on route
const usePageTitle = () => {
  const location = useLocation();
  const titles = {
    '/': 'System Overview',
    '/signals': 'Signal Control Center',
    '/alerts': 'Active Alerts & Incidents',
    '/simulation': 'YOLO Simulation Lab',
    '/report-issue': 'Report Infrastructure Issue',
    '/profile': 'Manager Profile'
  };
  return titles[location.pathname] || 'SmartTraffic';
};

const AppContent = ({ isAuthenticated, user, onLogin, onLogout }) => {
  const title = usePageTitle();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login onLogin={onLogin} /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register onLogin={onLogin} /> : <Navigate to="/" />} />
      
      <Route element={<Layout isAuthenticated={isAuthenticated} onLogout={onLogout} title={title} />}>
        <Route path="/" element={<Home />} />
        <Route path="/signals" element={<Signals />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/profile" element={<Profile user={user} onLogout={onLogout} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

import { SimulationProvider } from './context/SimulationContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({
    id: 1,
    username: 'admin',
    email: 'admin@roadzen.ai',
    role: 'operator'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Initializing System...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ThemeProvider>
        <SimulationProvider>
          <AppContent 
            isAuthenticated={isAuthenticated} 
            user={user}
            onLogin={handleLogin} 
            onLogout={handleLogout} 
          />
        </SimulationProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
