import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Upload, 
  Send, 
  CheckCircle2, 
  X,
  FileText,
  Info,
  ShieldAlert,
  ChevronRight,
  ClipboardList,
  RefreshCw
} from 'lucide-react';
import { trafficService } from '../../services/api';

const ReportIssue = () => {
  const [junctions, setJunctions] = useState([]);
  const [formData, setFormData] = useState({
    junctionId: '',
    issueType: 'System Malfunction',
    description: '',
    urgency: 'Medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await trafficService.getJunctions();
      setJunctions(data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await trafficService.reportIssue(formData);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        junctionId: '',
        issueType: 'System Malfunction',
        description: '',
        urgency: 'Medium'
      });
      setImagePreview(null);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3 lowercase first-letter:uppercase">
            <ClipboardList size={24} className="text-primary" />
            Infrastructure Fault Documentation
          </h2>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-medium">Internal System Deficiency Report Terminal</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-border text-slate-500 font-bold text-[10px] uppercase tracking-widest">
            Protocol: SF-902-12
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target Junction Assignment</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select 
                    name="junctionId"
                    value={formData.junctionId}
                    onChange={handleChange}
                    className="input-field pl-10 h-10 font-medium"
                    required
                  >
                    <option value="">SELECT DESIGNATED LOCATION...</option>
                    {junctions.map(j => (
                      <option key={j.id} value={j.id}>{j.name.toUpperCase()} (ID: {j.id})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Classification of Anomaly</label>
                <select 
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  className="input-field h-10 font-medium cursor-pointer"
                >
                  <option>System Malfunction</option>
                  <option>Signal Hardware Failure</option>
                  <option>Camera/Sensor Fault</option>
                  <option>Network Latency</option>
                  <option>Pavement/Road Damage</option>
                  <option>Other / Unclassified</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Technical Briefing (Detailed Analysis)</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field min-h-[160px] resize-none font-medium leading-relaxed"
                placeholder="Include precise details regarding the anomaly, observer observations, and immediate impacts."
                required
              ></textarea>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Telemetric Evidence (Static Image Buffer)</label>
              <div className="flex flex-wrap gap-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-sm overflow-hidden border border-border group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute inset-0 bg-slate-900/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-32 border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all text-slate-400 group">
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    <Upload size={24} className="group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold mt-2 uppercase tracking-widest">Upload File</span>
                  </label>
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex gap-1 bg-slate-50 p-1 border border-border">
                 {['Low', 'Medium', 'High', 'Critical'].map(level => (
                   <label key={level} className="flex items-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name="urgency" 
                        value={level} 
                        checked={formData.urgency === level}
                        onChange={handleChange}
                        className="hidden" 
                      />
                      <span className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        formData.urgency === level 
                          ? (level === 'Critical' ? 'bg-rose-600 text-white shadow-sm' : 'bg-primary text-white shadow-sm')
                          : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                      }`}>
                        {level}
                      </span>
                   </label>
                 ))}
               </div>
               
               <button 
                type="submit" 
                disabled={isSubmitting || isSuccess}
                className={`flex items-center gap-3 h-10 px-8 font-bold uppercase text-[11px] tracking-widest transition-all ${isSuccess ? 'bg-emerald-600 text-white' : 'btn-primary'}`}
              >
                {isSubmitting ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={16} />
                    Transmission Received
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    SUBMIT FORM
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card bg-[#1B365D] text-white">
             <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <Info size={18} className="text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Documentation Guidelines</h3>
             </div>
             <ul className="space-y-4">
               {[
                 'Ensure Sector Localization (J-ID parity)',
                 'Verify Hardware Interface status',
                 'Document Chromatic deviations',
                 'Critical flags trigger immediate review'
               ].map((rule, i) => (
                 <li key={i} className="flex items-start gap-3">
                   <div className="w-1.5 h-1.5 bg-accent-light rounded-sm mt-1 flex-shrink-0" />
                   <p className="text-[11px] font-medium leading-relaxed text-slate-200 uppercase tracking-tight">{rule}</p>
                 </li>
               ))}
             </ul>
             <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    By submitting this form, you certify that the analysis provided is accurate as per operational telemetry.
                </p>
             </div>
          </div>

          <div className="card !p-0">
             <div className="p-4 border-b border-border bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-widest">Submission History</h3>
                <span className="text-[10px] font-mono text-slate-400">LOG-REGS-24H</span>
             </div>
             <div className="divide-y divide-border">
                <div className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                   <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-slate-800 text-xs">SENSOR DRIFT (J-004)</span>
                     <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 border border-border">QUEUED</span>
                   </div>
                   <div className="flex items-center justify-between mt-2">
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">14:02 // OPERATOR: A.ZEN</p>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                   </div>
                </div>
                <div className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                   <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-slate-800 text-xs">HARDWARE FAILURE (J-002)</span>
                     <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 border border-emerald-100">RESOLVED</span>
                   </div>
                   <div className="flex items-center justify-between mt-2">
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">10:55 // OPERATOR: B.SYS</p>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                   </div>
                </div>
             </div>
             <button className="w-full h-10 text-primary text-[10px] font-bold uppercase tracking-widest bg-slate-50 border-t border-border hover:bg-slate-100 transition-colors">
                Open Directory Archives
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
