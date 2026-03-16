import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Upload, 
  Send, 
  CheckCircle2, 
  X,
  Plus
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
    
    // Reset form after 3 seconds
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text">Report System Issue</h2>
        <p className="text-gray-500 mt-1">Submit infrastructure faults or technical anomalies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text ml-1">Select Junction</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    name="junctionId"
                    value={formData.junctionId}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  >
                    <option value="">Choose location...</option>
                    {junctions.map(j => (
                      <option key={j.id} value={j.id}>{j.name} ({j.id})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text ml-1">Issue Type</label>
                <select 
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option>System Malfunction</option>
                  <option>Signal Hardware Failure</option>
                  <option>Camera/Sensor Fault</option>
                  <option>Network Latency</option>
                  <option>Pavement/Road Damage</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text ml-1">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field min-h-[150px] resize-none"
                placeholder="Describe the issue in detail..."
                required
              ></textarea>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-text ml-1 block">Evidence (Optional)</label>
              <div className="flex flex-wrap gap-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-md group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-secondary transition-all text-gray-400 hover:text-secondary">
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    <Upload size={24} />
                    <span className="text-[10px] font-bold mt-2">UPLOAD</span>
                  </label>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
               <div className="flex gap-4">
                 {['Low', 'Medium', 'High', 'Critical'].map(level => (
                   <label key={level} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="urgency" 
                        value={level} 
                        checked={formData.urgency === level}
                        onChange={handleChange}
                        className="hidden" 
                      />
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formData.urgency === level 
                          ? (level === 'Critical' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-primary text-white shadow-lg shadow-primary/20')
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                      }`}>
                        {level}
                      </span>
                   </label>
                 ))}
               </div>
               <button 
                type="submit" 
                disabled={isSubmitting || isSuccess}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${isSuccess ? 'bg-green-500 text-white' : 'btn-primary'}`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={20} />
                    Report Submitted
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card bg-primary text-white overflow-hidden relative">
             <div className="absolute -right-8 -bottom-8 p-4 opacity-10">
                <AlertTriangle size={160} />
             </div>
             <h3 className="text-xl font-bold relative z-10">Submission Protocol</h3>
             <ul className="mt-6 space-y-4 relative z-10">
               {[
                 'Ensure accurate location ID',
                 'Include timestamp if historical',
                 'Clear photos of hardware damage',
                 'Critical issues trigger auto-alert'
               ].map((rule, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                   <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                   {rule}
                 </li>
               ))}
             </ul>
          </div>

          <div className="card">
             <h3 className="font-bold text-lg text-text mb-4">Recent Reports</h3>
             <div className="space-y-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg border border-border">
                   <div className="flex justify-between items-start mb-1">
                     <span className="font-bold text-text">Faulty Camera</span>
                     <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">PENDING</span>
                   </div>
                   <p className="text-gray-500 text-xs">J-004 Lexington Ave</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-border">
                   <div className="flex justify-between items-start mb-1">
                     <span className="font-bold text-text">Signal Drift</span>
                     <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">FIXED</span>
                   </div>
                   <p className="text-gray-500 text-xs">J-002 Broadway</p>
                </div>
             </div>
             <button className="w-full mt-4 text-secondary text-sm font-bold hover:underline">View History</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
