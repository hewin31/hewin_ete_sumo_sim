import React from 'react';
import { Bell, MapPin, Clock, AlertTriangle, XCircle, Zap, ShieldCheck, ChevronRight, FileText, MoreVertical } from 'lucide-react';

const AlertCard = ({ alert }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'Accident': return <AlertTriangle size={20} className="text-rose-600" />;
      case 'Road Block': return <XCircle size={20} className="text-slate-600" />;
      case 'Emergency Vehicle': return <Zap size={20} className="text-amber-600" />;
      default: return <Bell size={20} className="text-primary" />;
    }
  };

  return (
    <div className="card !p-0 overflow-hidden flex flex-col group hover:border-slate-400 transition-all border border-border">
      <div className="px-6 py-4 border-b border-border bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 bg-white border border-border rounded-sm`}>
            {getAlertIcon(alert.type)}
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{alert.id}</span>
        </div>
        <div className={`status-pill ${
          alert.status === 'Active' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        }`}>
          {alert.status}
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 uppercase italic tracking-tight">{alert.type} Identified</h3>
          <div className="flex items-center gap-2 mt-2">
            <MapPin size={14} className="text-slate-400" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{alert.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-slate-400" />
            <span className="text-[11px] font-bold text-slate-500 tabular-nums">{alert.timestamp}</span>
          </div>
          
          <div className="flex gap-2">
             <button className="p-2 text-slate-400 hover:text-primary transition-colors border border-border rounded-sm bg-slate-50">
                <FileText size={16} />
             </button>
             <button className="btn-primary py-1 px-4 text-[10px] uppercase tracking-widest">
                Review Cam
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
