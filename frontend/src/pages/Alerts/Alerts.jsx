import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  MapPin, 
  Clock, 
  Search,
  Zap,
  ShieldCheck,
  Filter,
  FileText,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  Download,
  Activity
} from 'lucide-react';
import { trafficService } from '../../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await trafficService.getAlerts();
      setAlerts(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredAlerts = alerts.filter(a => {
    const matchesFilter = filter === 'All' ? true : a.status === filter;
    const matchesSearch = a.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh] text-slate-400">
        <Activity size={24} className="animate-spin mr-3" />
        <span className="text-sm font-semibold uppercase tracking-widest">Querying Incident Logs...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Active Incident Registry</h2>
          <p className="text-sm text-slate-500 uppercase font-medium tracking-wider">Historical and real-time anomaly detection</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2">
                <Download size={14} /> Export CSV
            </button>
            <button className="btn-primary flex items-center gap-2">
                <FileText size={14} /> Archive Selected
            </button>
        </div>
      </div>

      {/* Structured Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card border-l-4 border-l-rose-500">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Alerts</p>
            <p className="text-3xl font-black tabular-nums">{alerts.filter(a => a.status === 'Active').length}</p>
        </div>
        <div className="card border-l-4 border-l-emerald-500">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Resolved (24h)</p>
            <p className="text-3xl font-black tabular-nums">{alerts.filter(a => a.status === 'Resolved').length}</p>
        </div>
        <div className="card border-l-4 border-l-primary">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Registry</p>
            <p className="text-3xl font-black tabular-nums">{alerts.length}</p>
        </div>
        <div className="card border-l-4 border-l-accent">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Response Latency</p>
            <p className="text-3xl font-black tabular-nums">4.2m</p>
        </div>
      </div>

      <div className="card !p-0">
        <div className="p-6 border-b border-border bg-slate-50 flex flex-wrap items-center justify-between gap-6">
            <div className="flex bg-white p-1 rounded-sm border border-border">
                {['All', 'Active', 'Resolved'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${filter === tab ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="relative group w-full md:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Filter by location or type..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-border rounded-sm pl-10 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-accent" 
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-border text-slate-500 font-bold bg-slate-50/50">
                        <th className="px-6 py-4 uppercase text-[10px] tracking-widest">ID</th>
                        <th className="px-6 py-4 uppercase text-[10px] tracking-widest">Type</th>
                        <th className="px-6 py-4 uppercase text-[10px] tracking-widest">Status</th>
                        <th className="px-6 py-4 uppercase text-[10px] tracking-widest">Location</th>
                        <th className="px-6 py-4 uppercase text-[10px] tracking-widest">Timestamp</th>
                        <th className="px-6 py-4 uppercase text-[10px] tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {filteredAlerts.length > 0 ? filteredAlerts.map((alert, i) => (
                        <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{alert.id}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-sm ${
                                        alert.type === 'Accident' ? 'bg-rose-100 text-rose-700' : 
                                        alert.type === 'Emergency Vehicle' ? 'bg-amber-100 text-amber-700' : 
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        <AlertTriangle size={14} />
                                    </div>
                                    <span className="font-bold text-slate-900">{alert.type} Recognized</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`status-pill ${
                                    alert.status === 'Active' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                }`}>
                                    {alert.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-600">{alert.location}</td>
                            <td className="px-6 py-4 tabular-nums text-slate-500">{alert.timestamp}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                        <FileText size={16} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-20 text-center">
                                <Bell size={40} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Operational Anomalies Recorded</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        <div className="p-4 border-t border-border bg-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Showing {filteredAlerts.length} of {alerts.length} records
            </p>
            <div className="flex gap-1">
                <button className="px-3 py-1 bg-white border border-border text-xs font-bold text-slate-400 hover:text-slate-600">Prev</button>
                <button className="px-3 py-1 bg-primary text-white text-xs font-bold border border-primary">1</button>
                <button className="px-3 py-1 bg-white border border-border text-xs font-bold text-slate-400 hover:text-slate-600">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
