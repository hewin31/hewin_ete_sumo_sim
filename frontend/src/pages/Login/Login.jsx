import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrafficCone, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Dummy login - always succeeds
      const dummyUser = {
        id: 1,
        username: 'admin',
        email: 'admin@roadzen.ai',
        role: 'operator'
      };
      onLogin(dummyUser);
      navigate('/');
    } catch (err) {
      setError('CRITICAL: AUTHENTICATION FAILURE - INVALID CREDENTIALS PROVIDED');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-6 font-sans antialiased">
      <div className="w-full max-w-sm bg-white border border-slate-300 shadow-md">
        {/* Header Section */}
        <div className="p-8 border-b border-slate-200 bg-slate-50 text-center">
          <div className="w-12 h-12 bg-[#1B365D] flex items-center justify-center mx-auto mb-4 rounded-sm shadow-sm">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">SmartTraffic Portal</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Authorized Personnel Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 text-rose-700 p-4 border border-rose-200 text-[10px] font-bold uppercase tracking-wider leading-relaxed">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Identity UID</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10 h-10 font-semibold"
                placeholder="tm-admin-01"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Password Pad</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10 h-10 font-semibold tracking-widest"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
            <label className="flex items-center gap-2 text-slate-500 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="w-3.5 h-3.5 border border-slate-300 rounded-sm text-primary focus:ring-0" />
              Persist Login
            </label>
            <a href="#" className="text-primary hover:underline">Reset Link</a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-11 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-sm ${
                isLoading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'btn-primary'
            }`}
          >
            {isLoading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              "Initialize System Session"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
            >
              New User Registration
            </button>
          </div>
        </form>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Security Kernel v4.2.0-STABLE // ROOT-AUTH
          </p>
        </div>
      </div>
    </div>
  );
};

// Add helper icon if missing in imports
import { RefreshCw } from 'lucide-react';

export default Login;
