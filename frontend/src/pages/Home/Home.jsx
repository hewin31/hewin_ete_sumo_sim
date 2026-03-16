import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  AlertCircle, 
  TrendingUp, 
  MapPin, 
  Car,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { trafficService } from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="card flex items-center justify-between group">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-text mt-1">{value}</h3>
      {trend && (
        <p className={`text-xs mt-2 flex items-center gap-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
          <span>{Math.abs(trend)}% from last hour</span>
        </p>
      )}
    </div>
    <div className={`p-4 rounded-xl ${color} text-white shadow-lg`}>
      <Icon size={24} />
    </div>
  </div>
);

const Home = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const overview = await trafficService.getSystemOverview();
      const currentStats = await trafficService.getTrafficStats();
      const alerts = await trafficService.getAlerts();
      
      setStats(overview);
      setChartData(currentStats);
      setActiveAlerts(alerts.filter(a => a.status === 'Active'));
    };
    fetchData();

    // Auto-refresh every 10 seconds to show incremental YOLO detections
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="animate-pulse flex items-center justify-center h-screen text-primary font-bold">Synchronizing Neural Data...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        <StatCard title="Total Junctions" value={stats.total_junctions} icon={MapPin} color="bg-primary" />
        <StatCard title="Active Signals" value={stats.active_signals} icon={Activity} color="bg-secondary" />
        <StatCard title="Total Vehicles" value={stats.total_vehicles_detected} icon={Car} color="bg-indigo-600" />
        <StatCard title="Emergency" value={stats.emergency_vehicles} icon={Users} color="bg-traffic-blue" />
        <StatCard title="Accidents" value={stats.detected_accidents} icon={AlertCircle} color="bg-traffic-purple" />
        <StatCard title="Road Blocks" value={stats.road_blocks} icon={Car} color="bg-traffic-black" />
        <StatCard title="Congestion" value={stats.overall_congestion || 'Low'} icon={TrendingUp} color="bg-traffic-orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Traffic Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-text">Live Traffic Analytics</h3>
              <p className="text-sm text-gray-500">Real-time detection synchronization</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-50 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                POLLING ACTIVE
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.2)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="density" 
                  name="Density (%)"
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorDensity)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="vehicles" 
                  name="Vehicles"
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVehicles)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Alerts Sidebar */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-text">Live Incidents</h3>
            <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">LIVE</span>
          </div>
          <div className="space-y-4">
            {activeAlerts.length > 0 ? activeAlerts.map(alert => (
              <div key={alert.id} className="flex gap-4 p-3 rounded-lg bg-background hover:bg-gray-100 transition-colors cursor-pointer group border border-transparent hover:border-border">
                <div className={`w-2 h-10 rounded-full flex-shrink-0 ${
                  alert.type === 'Accident' ? 'bg-traffic-purple' : 
                  alert.type === 'Road Block' ? 'bg-traffic-black' : 'bg-traffic-blue'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-text truncate">{alert.type}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate flex items-center gap-1">
                    <MapPin size={10} /> {alert.location}
                  </p>
                </div>
                <button className="self-center p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={14} className="text-gray-400" />
                </button>
              </div>
            )) : (
                <div className="py-10 text-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Shield className="text-slate-300" size={24} />
                    </div>
                    <p className="text-sm text-slate-400 font-medium">No critical incidents detected.</p>
                </div>
            )}
            <button className="w-full py-4 text-xs text-secondary font-black uppercase tracking-widest hover:underline border-t border-border mt-4">
              Access Full Archive
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card group">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg text-text">System Performance</h3>
                <TrendingUp className="text-green-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-8">
                <div>
                     <div className="flex justify-between items-end mb-2">
                        <p className="text-sm font-bold text-slate-500">AI Optimization Efficiency</p>
                        <span className="text-3xl font-black text-primary">A+</span>
                     </div>
                     <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[94%] transition-all duration-1000"></div>
                     </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-slate-100">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Inference State</p>
                        <p className="text-xl font-bold text-text">OPTIMIZED</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-slate-100">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Backend Hub</p>
                        <p className="text-xl font-bold text-text">SYNCED</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="card bg-primary text-white border-none relative overflow-hidden flex flex-col justify-center py-10">
            <Car size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
            <div className="relative z-10 text-center px-10">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 mb-2">Traffic Enforcement Active</h4>
                <p className="text-4xl font-black mb-6 leading-tight">Securing 24 monitored junctions across the network.</p>
                <div className="flex justify-center gap-4">
                    <div className="px-6 py-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                        <p className="text-[10px] font-black opacity-50 uppercase">Network Health</p>
                        <p className="text-lg font-bold">100.0%</p>
                    </div>
                    <div className="px-6 py-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                        <p className="text-[10px] font-black opacity-50 uppercase">Active Alerts</p>
                        <p className="text-lg font-bold">{activeAlerts.length}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Simple Shield icon for the placeholder
const Shield = (props) => (
    <svg 
        {...props} 
        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
)

export default Home;
