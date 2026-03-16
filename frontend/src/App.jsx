import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Signals from './pages/Signals/Signals';
import Alerts from './pages/Alerts/Alerts';
import Simulation from './pages/Simulation/Simulation';
import ReportIssue from './pages/ReportIssue/ReportIssue';
import Profile from './pages/Profile/Profile';

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

const AppContent = ({ isAuthenticated, onLogin, onLogout }) => {
  const title = usePageTitle();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login onLogin={onLogin} /> : <Navigate to="/" />} />
      
      <Route element={<Layout isAuthenticated={isAuthenticated} onLogout={onLogout} title={title} />}>
        <Route path="/" element={<Home />} />
        <Route path="/signals" element={<Signals />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/profile" element={<Profile onLogout={onLogout} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Router>
      <AppContent 
        isAuthenticated={isAuthenticated} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
    </Router>
  );
}

export default App;
