import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrafficCone, 
  Bell, 
  PlayCircle, 
  AlertTriangle, 
  User,
  LogOut,
  Settings,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Signal Management', path: '/signals', icon: TrafficCone },
    { name: 'Incidents & Alerts', path: '/alerts', icon: Bell },
    { name: 'Traffic Simulation', path: '/simulation', icon: PlayCircle },
    { name: 'Fault Reporting', path: '/report-issue', icon: AlertTriangle },
    { name: 'Account Settings', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#0D1B2E] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl">
      <div className="p-6 border-b border-slate-800 bg-[#0A1624]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent flex items-center justify-center rounded-sm">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">
              SmartTraffic
            </h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">
              Management Portal
            </p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-6 overflow-y-auto">
        <p className="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
          Navigation
        </p>
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-6 py-3 text-sm transition-all
                ${isActive 
                  ? 'bg-accent/10 text-white border-l-4 border-accent font-medium' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-8 px-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
              Resources
            </p>
            <div className="space-y-3">
                <a href="#" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    System Documentation
                </a>
                <a href="#" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    Network Status
                </a>
            </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-slate-800 bg-[#0A1624]">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-sm transition-all text-xs font-semibold uppercase tracking-wider"
        >
          <LogOut size={16} />
          <span>User Logout</span>
        </button>
        <div className="mt-4 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" />
                <span className="text-[10px] text-slate-500 font-bold">CONNECTED</span>
            </div>
            <span className="text-[10px] text-slate-600 font-mono">v4.2.0-STABLE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
