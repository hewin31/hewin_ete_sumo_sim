import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  AlertCircle, 
  TrendingUp, 
  Car,
  Clock,
  Shield,
  Power,
  Database,
  Grid,
  List,
  RefreshCw,
  FileText
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
import { useSimulation } from '../../context/SimulationContext';

const SummaryItem = ({ label, value, icon: Icon, colorClass }) => (
    <div className="flex items-center gap-4 p-4 border-r border-border last:border-r-0 flex-1">
        <div className={`p-2 rounded-sm ${colorClass} bg-opacity-10 text-current`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{value}</p>
        </div>
    </div>
);

const Home = () => {
  const [dbStats, setDbStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const { isSystemOn, toggleSystem, detectionData } = useSimulation();

  const fetchStats = async () => {
    try {
      const overview = await trafficService.getSystemOverview();
      setDbStats(overview);
    } catch (err) {
      console.error("Stats Sync Error:", err);
    }
  };

  const fetchChartData = async () => {
    try {
      const history = await trafficService.getTrafficStats();
      setChartData(history);
    } catch (err) {
      console.error("Chart Sync Error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchChartData();
    const statsInterval = setInterval(fetchStats, 5000);
    return () => clearInterval(statsInterval);
  }, []);

  if (!dbStats) return (
    <div className="flex items-center justify-center h-[60vh] text-slate-400">
        <RefreshCw size={24} className="animate-spin mr-3" />
        <span className="text-sm font-semibold uppercase tracking-widest">Awaiting System Data...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Operational Overview</h2>
          <p className="text-sm text-slate-500">Real-time infrastructure monitoring and traffic analytics</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2">
                <FileText size={16} /> Generate Report
            </button>
            <button 
                onClick={toggleSystem}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border transition-all ${
                    isSystemOn 
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
            >
                <Power size={16} />
                {isSystemOn ? 'SYSTEM SHUTDOWN' : 'ACTIVATE ENGINE'}
            </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="card !p-0 flex flex-wrap shadow-sm">
        <SummaryItem 
            label="Total Volume" 
            value={dbStats.total_vehicles_detected || '0'} 
            icon={Car} 
            colorClass="text-primary" 
        />
        <SummaryItem 
            label="Active Sensors" 
            value={isSystemOn ? '12' : '0'} 
            icon={Database} 
            colorClass="text-accent" 
        />
        <SummaryItem 
            label="Emergency Priority" 
            value={dbStats.emergency_vehicles || '0'} 
            icon={Shield} 
            colorClass="text-rose-600" 
        />
        <SummaryItem 
            label="Network Health" 
            value="99.8%" 
            icon={Activity} 
            colorClass="text-emerald-600" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Analytics Grid */}
        <div className="xl:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    Throughput Analysis (Hourly)
                </h3>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="w-3 h-3 bg-primary bg-opacity-20 border border-primary border-opacity-30 rounded-full" />
                    Vehicle Density
                </div>
            </div>
            
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 11, fontWeight: 500}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 11, fontWeight: 500}} 
                  />
                  <Tooltip 
                    contentStyle={{
                      borderRadius: '0px', 
                      border: '1px solid #E2E8F0', 
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#1B365D', fontWeight: '700', fontSize: '12px' }}
                    labelStyle={{ color: '#64748B', marginBottom: '8px', fontSize: '10px', fontWeight: '600' }}
                  />
                  <Area 
                    type="stepAfter" 
                    dataKey="vehicles" 
                    stroke="#1B365D" 
                    strokeWidth={2}
                    fill="#1B365D" 
                    fillOpacity={0.05} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Regional Capacity Status</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-border bg-slate-50">
                            <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Location ID</th>
                            <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Sector Name</th>
                            <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Capacity</th>
                            <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Flow Status</th>
                            <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Efficiency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { id: 'J-001', name: 'Downtown Central', capacity: '82%', status: 'Nominal', efficiency: '94.2%' },
                            { id: 'J-002', name: 'West Bridge Port', capacity: '45%', status: 'Low', efficiency: '98.5%' },
                            { id: 'J-003', name: 'Industrial Parkway', capacity: '91%', status: 'Critical', efficiency: '81.0%' },
                            { id: 'J-004', name: 'North Residential', capacity: '12%', status: 'Optimal', efficiency: '99.9%' },
                        ].map((row, i) => (
                            <tr key={i} className="border-b border-border hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                                <td className="px-4 py-3 font-semibold">{row.name}</td>
                                <td className="px-4 py-3 tabular-nums">{row.capacity}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm ${
                                        row.status === 'Critical' ? 'bg-rose-100 text-rose-700' : 
                                        row.status === 'Nominal' ? 'bg-blue-100 text-blue-700' : 
                                        'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 tabular-nums text-slate-500">{row.efficiency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div className="space-y-6">
            <div className="card">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-border pb-4">Incident Log</h3>
                <div className="space-y-4">
                    {[
                        { label: 'Lane Obstruction', time: '14:22', type: 'Warning' },
                        { label: 'Signal Malfunction', time: '13:45', type: 'Critical' },
                        { label: 'Heavy Congestion', time: '12:10', type: 'Info' }
                    ].map((log, i) => (
                        <div key={i} className="flex gap-4 p-3 border border-border rounded-sm hover:border-slate-300 transition-colors">
                            <div className={`w-1 h-auto ${log.type === 'Critical' ? 'bg-rose-500' : log.type === 'Warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                            <div>
                                <p className="text-sm font-bold text-slate-800">{log.label}</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">{log.time} // SECTOR-7G</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 py-2 text-xs font-bold text-primary hover:underline uppercase tracking-widest bg-slate-50 border border-border">
                    View Complete Log
                </button>
            </div>

            <div className="card bg-slate-900 text-white">
                <div className="flex items-center gap-3 mb-6">
                    <Database size={20} className="text-accent" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Storage & API</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Database Engine</span>
                        <span className="font-mono">PostgreSQL 14.x</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Storage Usage</span>
                        <span className="font-mono tabular-nums">4.2 GB / 10 GB</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                        <div className="bg-accent h-full w-[42%]" />
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Connected Instances</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-sm border border-emerald-500/20">YOLO-NODE-01</span>
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-sm border border-emerald-500/20">SUMO-SIM-04</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
