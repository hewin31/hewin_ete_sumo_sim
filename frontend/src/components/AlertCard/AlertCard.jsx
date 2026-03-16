import React from 'react';
import { Bell, MapPin, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const AlertCard = ({ alert }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'Accident': return <AlertTriangle />;
      case 'Road Block': return <XCircle />;
      case 'Emergency Vehicle': return <Bell />;
      default: return <Bell />;
    }
  };

  const getAlertColor = (color) => {
    const colors = {
      purple: 'from-purple-500 to-purple-600',
      black: 'from-gray-800 to-black',
      blue: 'from-blue-500 to-blue-600',
    };
    return colors[color] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="card p-0 overflow-hidden flex flex-col sm:flex-row group">
      <div className={`sm:w-32 flex items-center justify-center bg-gradient-to-br ${getAlertColor(alert.typeColor)} p-6 text-white`}>
         <div className="transform group-hover:scale-110 transition-transform">
           {React.cloneElement(getAlertIcon(alert.type), { size: 40 })}
         </div>
      </div>
      
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{alert.id}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${alert.status === 'Active' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {alert.status.toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-bold text-text">{alert.type} Detected</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={16} className="text-gray-400" />
            <span className="truncate">{alert.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} className="text-gray-400" />
            <span>{alert.timestamp}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">JD</div>
            <div className="w-8 h-8 rounded-full bg-secondary border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">AS</div>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 text-xs font-bold bg-background text-text rounded-lg hover:bg-gray-200 transition-colors">Dispatch</button>
             <button className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:shadow-lg transition-all">View Cam</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
