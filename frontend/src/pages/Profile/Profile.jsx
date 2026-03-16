import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Zap,
  Globe,
  Settings,
  Clock,
  ExternalLink,
  ChevronRight,
  Database,
  Terminal,
  FileText,
  RefreshCw,
  X
} from 'lucide-react';
import { authService } from '../../services/api';

const ProfileField = ({ label, value, icon: Icon, isEditing }) => (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 rounded-sm text-slate-500">
                <Icon size={16} />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest min-w-[140px]">{label}</span>
        </div>
        <div className="flex-1 text-right">
            {isEditing ? (
                <input 
                    type="text" 
                    defaultValue={value} 
                    className="bg-white border border-border px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-accent outline-none w-full max-w-sm text-right"
                />
            ) : (
                <span className="text-sm font-semibold text-slate-900">{value}</span>
            )}
        </div>
    </div>
);

const Profile = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.username,
        employeeId: 'RZ-HQ-001', // Could be made dynamic
        department: 'Metropolitan Traffic Intelligence',
        email: user.email,
        position: 'Lead System Architecture',
        location: 'Central Command Hub',
        shift: '08:00 AM - 04:00 PM',
        clearance: 'Level 5 Full Admin',
        role: user.role,
        created_at: user.created_at,
        last_login: user.last_login
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    // Profile editing disabled in simple auth mode
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-400">
        <RefreshCw size={24} className="animate-spin mr-3" />
        <span className="text-sm font-semibold uppercase tracking-widest">Loading Profile...</span>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">User Directory Record</h2>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-medium">ID: {profile.employeeId} // Personnel Cluster</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                disabled={isSaving}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
                {isSaving ? (
                    <RefreshCw size={14} className="animate-spin" />
                ) : (
                    <Edit2 size={14} />
                )}
                {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Modify Record')}
            </button>
            <button 
                onClick={() => {
                    if (isEditing) {
                        setIsEditing(false);
                        fetchProfile(); // Reset changes
                    } else {
                        authService.logout();
                        onLogout();
                    }
                }}
                className={`flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    isEditing 
                        ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
            >
                {isEditing ? (
                    <>
                        <X size={14} /> Cancel
                    </>
                ) : (
                    <>
                        <LogOut size={14} /> Terminate Session
                    </>
                )}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Primary Identity Section */}
        <div className="xl:col-span-1 space-y-6">
            <div className="card text-center py-10">
                <div className="w-24 h-24 bg-slate-100 border border-border rounded-sm mx-auto mb-6 flex items-center justify-center text-slate-400">
                    <User size={48} strokeWidth={1} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">{profile.name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2 mb-4">Lead Systems Analyst</p>
                </div>
                <div className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-widest">
                    <ShieldCheck size={12} className="mr-2" /> Clearance Level 5
                </div>
            </div>

            <div className="card bg-slate-900 text-white">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4">Session Telemetry</h4>
                <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Login Timestamp</span>
                        <span className="text-sm font-mono tabular-nums">2026-03-16 09:42:12 UTC</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inference Node</span>
                        <span className="text-sm font-mono uppercase">Node-Alpha-HQ-01</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cluster Peer IP</span>
                        <span className="text-sm font-mono tracking-widest tabular-nums">192.168.1.104</span>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Synchronized</span>
                    </div>
                    <Zap size={14} className="text-emerald-500" />
                </div>
            </div>
        </div>

        {/* Detailed Administrative Data */}
        <div className="xl:col-span-2 space-y-6">
            <div className="card !p-0">
                <div className="p-4 border-b border-border bg-slate-50 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Database size={14} /> Personnel Data Attributes
                    </h3>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">REG-PF-004-A</span>
                </div>
                <div className="p-8 space-y-1">
                    <ProfileField label="Registry Full Name" value={profile.name} icon={User} isEditing={isEditing} />
                    <ProfileField label="Employee ID / UID" value={profile.employeeId} icon={Shield} isEditing={isEditing} />
                    <ProfileField label="Authorized Email" value={profile.email} icon={Mail} isEditing={isEditing} />
                    <ProfileField label="Department/Org" value={profile.department} icon={Briefcase} isEditing={isEditing} />
                    <ProfileField label="Operational Position" value={profile.position} icon={Terminal} isEditing={isEditing} />
                    <ProfileField label="Assigned Station" value={profile.location} icon={MapPin} isEditing={isEditing} />
                    <ProfileField label="Scheduled Shift" value={profile.shift} icon={Clock} isEditing={isEditing} />
                </div>
                {isEditing && (
                    <div className="p-4 bg-slate-50 border-t border-border flex justify-end gap-3">
                        <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel Edit</button>
                        <button className="btn-primary" onClick={() => setIsEditing(false)}>Save Directory Entries</button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card hover:border-primary transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-100 rounded-sm text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Key size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Security Credentials</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Multi-Factor & RSA Settings</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                    </div>
                </div>
                <div className="card hover:border-primary transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-100 rounded-sm text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">System Alerts Config</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Notification Thresholds</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                    </div>
                </div>
            </div>

            <div className="card bg-slate-50 border-dashed border-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-border text-slate-400">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight italic">Generate Personnel Log Summary</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Export full activity history for current cycle</p>
                    </div>
                </div>
                <button className="btn-secondary flex items-center gap-2">
                    Initialize Report <ExternalLink size={14} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
