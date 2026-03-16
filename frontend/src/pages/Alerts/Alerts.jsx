import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Filter,
  Search
} from 'lucide-react';
import { trafficService } from '../../services/api';
import AlertCard from '../../components/AlertCard/AlertCard';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await trafficService.getAlerts();
      setAlerts(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredAlerts = filter === 'All' ? alerts : alerts.filter(a => a.status === filter);

  if (isLoading) return <div className="animate-pulse">Loading alerts...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">System Alerts</h2>
          <p className="text-gray-500 mt-1">Real-time incidents and traffic anomalies</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Search locations..." className="input-field pl-10" />
          </div>
          <div className="flex bg-white rounded-xl border border-border p-1">
            {['All', 'Active', 'Resolved'].map(tab => (
              <button 
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === tab ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-text'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        )) : (
          <div className="col-span-2 py-20 text-center space-y-4 bg-gray-50 rounded-2xl border-2 border-dashed border-border text-gray-400">
             <Bell size={48} className="mx-auto opacity-20" />
             <p className="font-semibold">No {filter !== 'All' ? filter.toLowerCase() : ''} alerts found at the moment.</p>
          </div>
        )}
      </div>

      {alerts.length > 0 && (
         <div className="flex justify-center mt-8">
            <button className="text-gray-500 hover:text-primary font-bold flex items-center gap-2 transition-colors">
              Load Older Alerts
              <Clock size={16} />
            </button>
         </div>
      )}
    </div>
  );
};

export default Alerts;
