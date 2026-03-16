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
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
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
  }, []);

  if (!stats) return <div className="animate-pulse">Loading dashboard...</div>;

  const barData = [
    { name: 'Junction A', value: 400, color: '#22C55E' },
    { name: 'Junction B', value: 300, color: '#EAB308' },
    { name: 'Junction C', value: 200, color: '#F97316' },
    { name: 'Junction D', value: 150, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Total Junctions" value={stats.totalJunctions} icon={MapPin} color="bg-primary" />
        <StatCard title="Active Signals" value={stats.activeSignals} icon={Activity} color="bg-secondary" trend={2} />
        <StatCard title="Emergency" value={stats.emergencyVehicles} icon={Users} color="bg-traffic-blue" />
        <StatCard title="Accidents" value={stats.detectedAccidents} icon={AlertCircle} color="bg-traffic-purple" />
        <StatCard title="Road Blocks" value={stats.roadBlocks} icon={Car} color="bg-traffic-black" />
        <StatCard title="Congestion" value={stats.overallCongestion} icon={TrendingUp} color="bg-traffic-orange" trend={-5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Traffic Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-text">Traffic Volume & Density</h3>
              <p className="text-sm text-gray-500">Real-time system-wide statistics</p>
            </div>
            <select className="bg-background border-none rounded-lg px-3 py-1.5 text-sm outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="density" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorDensity)" 
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
            {activeAlerts.map(alert => (
              <div key={alert.id} className="flex gap-4 p-3 rounded-lg bg-background hover:bg-gray-100 transition-colors cursor-pointer group">
                <div className={`w-2 h-10 rounded-full flex-shrink-0 ${
                  alert.type === 'Accident' ? 'bg-traffic-purple' : 
                  alert.type === 'Road Block' ? 'bg-traffic-black' : 'bg-traffic-blue'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-text truncate">{alert.type}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate flex items-center gap-1">
                    <MapPin size={10} /> {alert.location}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> Just now
                  </p>
                </div>
                <button className="self-center p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={14} className="text-gray-400" />
                </button>
              </div>
            ))}
            <button className="w-full py-3 text-sm text-secondary font-semibold hover:underline border-t border-border mt-2">
              View All Alerts
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="font-bold text-lg text-text mb-6">Congestion by Zone</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-text mb-2">Efficiency Rating</h3>
            <p className="text-sm text-gray-500 mb-6">AI Optimization performance</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-primary">A+</span>
              <span className="text-green-500 font-bold mb-1 flex items-center gap-1">
                <TrendingUp size={16} /> 12.5%
              </span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-[92%]"></div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-background rounded-xl text-center">
              <p className="text-xs text-gray-400 uppercase tracking-tighter">Delay Reduced</p>
              <p className="text-xl font-bold text-text">14.2m</p>
            </div>
            <div className="p-4 bg-background rounded-xl text-center">
              <p className="text-xs text-gray-400 uppercase tracking-tighter">CO2 Saved</p>
              <p className="text-xl font-bold text-text">2.4t</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
