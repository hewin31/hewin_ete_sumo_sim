import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrafficCone, Lock, User, Eye, EyeOff, ShieldCheck, UserPlus, RefreshCw } from 'lucide-react';
import { authService } from '../../services/api';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('CRITICAL: PASSWORD CONFIRMATION MISMATCH');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('CRITICAL: PASSWORD MUST BE AT LEAST 6 CHARACTERS');
      setIsLoading(false);
      return;
    }

    try {
      // Dummy registration - always succeeds
      const dummyUser = {
        id: 1,
        username: formData.username || 'admin',
        email: formData.email || 'admin@roadzen.ai',
        role: 'operator'
      };
      onLogin(dummyUser);
      navigate('/');
    } catch (err) {
      setError('CRITICAL: REGISTRATION FAILURE - ' + (err.response?.data?.error || 'UNKNOWN ERROR'));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-6 font-sans antialiased">
      <div className="w-full max-w-sm bg-white border border-slate-300 shadow-md">
        {/* Header Section */}
        <div className="p-8 border-b border-slate-200 bg-slate-50 text-center">
          <div className="w-12 h-12 bg-[#1B365D] flex items-center justify-center mx-auto mb-4 rounded-sm shadow-sm">
            <UserPlus size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">SmartTraffic Portal</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">New Personnel Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 text-rose-700 p-4 border border-rose-200 text-[10px] font-bold uppercase tracking-wider leading-relaxed">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Personnel Identifier</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field pl-10 h-10 font-semibold"
                placeholder="tm-operator-01"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Identity UID</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10 h-10 font-semibold"
                placeholder="operator@roadzen.ai"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
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

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field pl-10 pr-10 h-10 font-semibold tracking-widest"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-11 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-sm ${
                isLoading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'btn-primary'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
            ) : (
              <>
                <UserPlus size={16} />
                Initialize Personnel Account
              </>
            )}
          </button>
        </form>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Already have access? <Link to="/login" className="text-primary hover:underline">Authenticate Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;