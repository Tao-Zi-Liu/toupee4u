import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Hexagon } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
      </div>

      <div className="w-full max-w-md bg-dark-800 border border-dark-700 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dark-900 border border-dark-700 mb-6 shadow-inner text-brand-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Access the Truth Engine and your personal lab.</p>
        </div>

        {/* Form */}
        <form className="space-y-4">
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
            <div className="flex justify-between ml-1">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
               <a href="#" className="text-xs font-bold text-brand-blue hover:text-white transition-colors">Forgot?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
              />
            </div>
          </div>

          <button className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group">
            Sign In to Protocol
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Social / Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-600"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-dark-800 px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-slate-300 hover:text-white hover:border-dark-500 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-dark-900 border border-dark-600 rounded-xl text-slate-300 hover:text-white hover:border-dark-500 transition-colors">
            <Hexagon className="w-4 h-4 fill-current" />
            SAML
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-blue font-bold hover:text-white transition-colors">
              Initialize Sequence
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
