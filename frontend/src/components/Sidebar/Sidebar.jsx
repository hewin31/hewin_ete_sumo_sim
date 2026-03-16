import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrafficCone, 
  Bell, 
  PlayCircle, 
  AlertTriangle, 
  User,
  LogOut
} from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Signals', path: '/signals', icon: TrafficCone },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'Simulation', path: '/simulation', icon: PlayCircle },
    { name: 'Report Issue', path: '/report-issue', icon: AlertTriangle },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
            <TrafficCone size={20} className="text-white" />
          </div>
          SmartTraffic
        </h1>
        <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">Control Center</p>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-secondary text-white shadow-lg' 
                : 'text-white/70 hover:bg-white/5 hover:text-white'}
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
