import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Briefcase, 
  MapPin, 
  Shield, 
  Edit2, 
  LogOut, 
  Key, 
  Bell, 
  Languages,
  ArrowRight
} from 'lucide-react';

const Profile = ({ onLogout }) => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    employeeId: 'TM-7829-45',
    department: 'Metropolitan Traffic Control',
    email: 'john.doe@traffic.gov',
    position: 'Regional Operations Manager',
    location: 'New York Command Center',
    shift: '08:00 AM - 04:00 PM'
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Card */}
        <div className="w-full md:w-80 space-y-6">
          <div className="card text-center p-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary to-secondary"></div>
             <div className="relative z-10">
                <div className="w-24 h-24 bg-white rounded-2xl mx-auto p-1 shadow-xl -mt-4">
                   <div className="w-full h-full bg-secondary/10 rounded-xl flex items-center justify-center text-secondary text-3xl font-black">
                      JD
                   </div>
                </div>
                <h3 className="text-xl font-bold text-text mt-4">{profile.name}</h3>
                <p className="text-sm text-gray-500">{profile.position}</p>
                <div className="inline-flex mt-4 bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                   Level 4 clearance
                </div>
             </div>
             
             <div className="mt-8 pt-8 border-t border-border space-y-4">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-background text-text rounded-xl font-bold hover:bg-gray-200 transition-all border border-border"
                >
                   <Edit2 size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
                >
                   <LogOut size={16} /> Logout System
                </button>
             </div>
          </div>

          <div className="card">
             <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Quick Stats</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-background rounded-xl">
                   <p className="text-xl font-bold text-text">124</p>
                   <p className="text-[10px] text-gray-400 uppercase">Issues Solved</p>
                </div>
                <div className="text-center p-3 bg-background rounded-xl">
                   <p className="text-xl font-bold text-text">42d</p>
                   <p className="text-[10px] text-gray-400 uppercase">Uptime Streak</p>
                </div>
             </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="flex-1 space-y-6">
          <div className="card">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-text flex items-center gap-2">
                   <User className="text-secondary" /> Personal Information
                </h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  { label: 'Employee ID', value: profile.employeeId, icon: Shield, name: 'employeeId' },
                  { label: 'Department', value: profile.department, icon: Briefcase, name: 'department' },
                  { label: 'Email Address', value: profile.email, icon: Mail, name: 'email' },
                  { label: 'Primary Location', value: profile.location, icon: MapPin, name: 'location' },
                ].map(field => (
                  <div key={field.label} className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                        <field.icon size={12} /> {field.label}
                     </label>
                     {isEditing ? (
                       <input 
                         type="text" 
                         className="input-field" 
                         defaultValue={field.value}
                       />
                     ) : (
                       <p className="text-lg font-semibold text-text">{field.value}</p>
                     )}
                  </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="card group hover:border-secondary transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-secondary/10 text-secondary rounded-xl group-hover:bg-secondary group-hover:text-white transition-all">
                      <Key size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-text">Security Settings</h4>
                      <p className="text-sm text-gray-500">2FA, Password & Keys</p>
                   </div>
                   <ArrowRight className="ml-auto text-gray-300" />
                </div>
             </div>
             
             <div className="card group hover:border-secondary transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:bg-accent group-hover:text-white transition-all">
                      <Bell size={24} />
                   </div>
                   <div>
                      <h4 className="font-bold text-text">Notification Prefs</h4>
                      <p className="text-sm text-gray-500">Alert triggers & sounds</p>
                   </div>
                   <ArrowRight className="ml-auto text-gray-300" />
                </div>
             </div>
          </div>

          <div className="card bg-gray-50/50 border-dashed">
             <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-6">Regional Settings</h4>
             <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-border shadow-sm">
                   <Languages size={16} className="text-gray-400" />
                   <span className="text-sm font-bold">English (US)</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-border shadow-sm">
                   <Clock size={16} className="text-gray-400" />
                   <span className="text-sm font-bold">GMT -5 (EST)</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
