import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-dark-800 border border-dark-700 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple mb-6 shadow-lg shadow-brand-blue/20 text-white">
            <Zap className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Join the Collective</h1>
          <p className="text-slate-300 text-sm">Begin your journey from Observer to Quantum State.</p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-blue transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Alex"
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                  />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Mercer"
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-4 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                  />
                </div>
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="email" 
                placeholder="doctor@example.com"
                className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Set Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 py-2">
             <div className="flex items-center h-5">
               <input id="terms" type="checkbox" className="w-4 h-4 rounded border-dark-600 bg-dark-900 text-brand-blue focus:ring-brand-blue" />
             </div>
             <label htmlFor="terms" className="text-xs text-slate-300 leading-snug">
                I agree to the <a href="#" className="text-white hover:underline">Terms of Service</a> and acknowledge the "Physics of Hair" methodology.
             </label>
          </div>

          <button className="w-full bg-gradient-to-r from-brand-blue to-brand-purple hover:to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 group">
            Create Account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-300 text-sm">
            Already a member?{' '}
            <Link to="/login" className="text-brand-blue font-bold hover:text-white transition-colors">
              Access Protocol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};