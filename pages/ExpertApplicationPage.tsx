
import React, { useState } from 'react';
// Fixing react-router-dom named imports
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, Briefcase, GraduationCap, Linkedin, Globe } from 'lucide-react';
import { ArrowRight, ShieldCheck, AlertCircle, FileText, User } from 'lucide-react';

export const ExpertApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    title: '',
    specialties: '',
    yearsExperience: '',
    bio: '',
    linkedin: '',
    website: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      window.scrollTo(0, 0);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-dark-800 border border-dark-700 rounded-3xl p-8 md:p-12 max-w-lg text-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-brand-purple"></div>
           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
             <CheckCircle className="w-10 h-10" />
           </div>
           <h1 className="text-3xl font-bold text-white mb-4">Application Received</h1>
           <p className="text-slate-300 mb-8">
             Thank you, {formData.fullName}. Your credentials have been securely transmitted to our review board. We typically process verification requests within 48-72 hours.
           </p>
           <div className="bg-dark-900 rounded-xl p-4 mb-8 text-sm text-slate-500 border border-dark-600">
             Reference ID: <span className="font-mono text-brand-blue">EXP-{Date.now().toString().slice(-6)}</span>
           </div>
           <button 
             onClick={() => navigate('/')}
             className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
           >
             Return to Home
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/experts" className="text-sm text-slate-500 hover:text-white flex items-center gap-2 mb-4 transition-colors">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Directory
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">Apply for Verification</h1>
        <p className="text-slate-300">Join the Toupee4U Directorate and contribute to the "Physics of Hair" knowledge base.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Benefits & Context */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 border border-brand-blue/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-brand-blue/20 rounded-full blur-3xl"></div>
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <ShieldCheck className="w-6 h-6 text-brand-blue" />
                 Why Join?
              </h2>

              <ul className="space-y-4">
                 <li className="flex gap-3">
                    <div className="bg-dark-900 p-2 rounded-lg h-fit border border-dark-600">
                       <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-sm">Verification Badge</h3>
                       <p className="text-xs text-slate-300 mt-1">Stand out in the forum and comments with a "Verified Expert" shield.</p>
                    </div>
                 </li>
                 <li className="flex gap-3">
                    <div className="bg-dark-900 p-2 rounded-lg h-fit border border-dark-600">
                       <Briefcase className="w-4 h-4 text-brand-purple" />
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-sm">Client Leads</h3>
                       <p className="text-xs text-slate-300 mt-1">List your consultation services directly on the platform (0% commission).</p>
                    </div>
                 </li>
                 <li className="flex gap-3">
                    <div className="bg-dark-900 p-2 rounded-lg h-fit border border-dark-600">
                       <FileText className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-sm">Publish Research</h3>
                       <p className="text-xs text-slate-300 mt-1">Author official Knowledge Base articles credited to your profile.</p>
                    </div>
                 </li>
              </ul>
           </div>

           <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Who we are looking for</h3>
              <div className="flex flex-wrap gap-2">
                 {['Dermatologists', 'Chemical Engineers', 'Master Barbers', 'Trichologists', 'System Manufacturers'].map(role => (
                    <span key={role} className="px-3 py-1 bg-dark-900 border border-dark-600 rounded-lg text-xs text-slate-300">
                       {role}
                    </span>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column: Application Form */}
        <div className="lg:col-span-2">
           <form onSubmit={handleSubmit} className="bg-dark-800 border border-dark-700 rounded-2xl p-6 md:p-8 space-y-8 shadow-xl">
              
              {/* Section 1: Personal Info */}
              <div className="space-y-4">
                 <h3 className="text-lg font-bold text-white border-b border-dark-700 pb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-slate-500" /> Professional Identity
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                       <input 
                          required
                          type="text" 
                          placeholder="Dr. Jane Doe"
                          value={formData.fullName}
                          onChange={e => setFormData({...formData, fullName: e.target.value})}
                          className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Email</label>
                       <input 
                          required
                          type="email" 
                          placeholder="jane@clinic.com"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-all"
                       />
                    </div>
                 </div>
              </div>

              {/* Section 2: Credentials */}
              <div className="space-y-4">
                 <h3 className="text-lg font-bold text-white border-b border-dark-700 pb-2 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-slate-500" /> Credentials
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Title / Role</label>
                       <select 
                          className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-all appearance-none"
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                       >
                          <option value="">Select Role...</option>
                          <option value="Dermatologist">Dermatologist (MD/DO)</option>
                          <option value="Chemical Engineer">Chemical Engineer (PhD/MSc)</option>
                          <option value="Master Stylist">Master Stylist / Barber</option>
                          <option value="Manufacturer">System Manufacturer</option>
                          <option value="Other">Other</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Years of Experience</label>
                       <input 
                          type="number" 
                          placeholder="e.g. 12"
                          value={formData.yearsExperience}
                          onChange={e => setFormData({...formData, yearsExperience: e.target.value})}
                          className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Core Specialties (Comma separated)</label>
                    <input 
                       type="text" 
                       placeholder="Adhesive Chemistry, Lace Repair, Traction Alopecia..."
                       value={formData.specialties}
                       onChange={e => setFormData({...formData, specialties: e.target.value})}
                       className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-all"
                    />
                 </div>
              </div>

              {/* Section 3: Digital Presence */}
              <div className="space-y-4">
                 <h3 className="text-lg font-bold text-white border-b border-dark-700 pb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-slate-500" /> Digital Presence (For Verification)
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <Linkedin className="w-3 h-3" /> LinkedIn Profile
                       </label>
                       <input 
                          type="url" 
                          placeholder="https://linkedin.com/in/..."
                          value={formData.linkedin}
                          onChange={e => setFormData({...formData, linkedin: e.target.value})}
                          className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website / Portfolio</label>
                       <input 
                          type="url" 
                          placeholder="https://..."
                          value={formData.website}
                          onChange={e => setFormData({...formData, website: e.target.value})}
                          className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-all"
                       />
                    </div>
                 </div>
              </div>

              {/* Section 4: Proof of Credential */}
              <div className="space-y-4">
                 <h3 className="text-lg font-bold text-white border-b border-dark-700 pb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-500" /> Documentation
                 </h3>
                 <div className="bg-dark-900 border-2 border-dashed border-dark-600 rounded-xl p-8 text-center hover:border-brand-blue hover:bg-dark-900/80 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-blue group-hover:text-white transition-colors text-slate-500">
                        <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-slate-300 font-medium">Upload License or Certification</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                    <input type="file" className="hidden" />
                 </div>
                 <div className="flex items-start gap-2 text-xs text-yellow-600 bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/10">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Your documents are encrypted and only viewable by our internal compliance team. They are deleted 30 days after verification.</span>
                 </div>
              </div>

              {/* Section 5: Bio */}
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Bio & Methodology</label>
                 <textarea 
                    placeholder="Tell us about your approach to hair replacement systems..."
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    className="w-full h-32 bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-all resize-none"
                 ></textarea>
              </div>

              <div className="pt-4 border-t border-dark-700 flex justify-end">
                 <button 
                    type="submit"
                    className="px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                 >
                    Submit Application <ArrowRight className="w-4 h-4" />
                 </button>
              </div>

           </form>
        </div>
      </div>
    </div>
  );
};
