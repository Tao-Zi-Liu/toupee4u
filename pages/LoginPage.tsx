
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Hexagon, AlertCircle, Cpu, Terminal } from 'lucide-react';
import { loginUser } from '../services/auth.service';

interface LoginPageProps {
  isStaffTerminal?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ isStaffTerminal = false }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  /* Fix: Use setIsLoading instead of setLoading */
  setIsLoading(true);

  try {
    // 使用真实的Firebase登录
    const userProfile = await loginUser(email, password);
    
    // 如果是管理员登录页面
    if (isStaffTerminal) {
      localStorage.setItem('staff_session_token', 'authorized_master');
      navigate('/admin');
    } else {
      // 普通用户登录
      navigate('/');
    }
  } catch (err: any) {
    setError(err.message || 'Login failed');
  } finally {
    /* Fix: Use setIsLoading instead of setLoading */
    setIsLoading(false);
  }
};

  return (
    <div className={`min-h-screen ${isStaffTerminal ? 'bg-black staff-selection font-mono' : 'bg-dark-900 font-sans'} flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-700`}>
      
      {/* Background Decor */}
      {!isStaffTerminal ? (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-emerald/20 animate-pulse"></div>
            <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-emerald/5 rounded-full blur-[120px]"></div>
        </div>
      )}

      <div className={`w-full max-w-md ${isStaffTerminal ? 'bg-dark-950 border-brand-emerald/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]' : 'bg-dark-800 border-dark-700 shadow-2xl'} border rounded-3xl p-8 relative z-10 transition-all`}>
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${isStaffTerminal ? 'bg-dark-900 border-brand-emerald/40 text-brand-emerald' : 'bg-dark-900 border-dark-700 text-brand-blue'} border mb-6 shadow-inner`}>
            {isStaffTerminal ? (
                <Terminal className="w-8 h-8" />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
            )}
          </div>
          <h1 className={`text-2xl font-bold ${isStaffTerminal ? 'text-brand-emerald tracking-widest uppercase' : 'text-white'} mb-2`}>
            {isStaffTerminal ? 'Staff Terminal' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 text-sm">
            {isStaffTerminal ? 'Root Directorate Authentication Required' : 'Access the Truth Engine and your personal lab.'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
            <div className={`mb-6 p-4 border rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2 ${isStaffTerminal ? 'bg-red-900/20 border-red-500/50 text-red-500 font-bold' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}

        {/* Form */}
        {/* Fix: Use handleEmailLogin instead of handleLogin */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1">
            <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${isStaffTerminal ? 'text-brand-emerald/70' : 'text-slate-500'}`}>Identity Vector (Email)</label>
            <div className="relative group">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isStaffTerminal ? 'text-brand-emerald/40 group-focus-within:text-brand-emerald' : 'text-slate-500 group-focus-within:text-brand-blue'}`} />
              <input 
                type="email" 
                required
                placeholder={isStaffTerminal ? 'root_admin@internal' : 'doctor@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-dark-900 border rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-700 focus:outline-none transition-all ${isStaffTerminal ? 'border-brand-emerald/20 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald font-mono' : 'border-dark-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue'}`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between ml-1">
               <label className={`text-[10px] font-bold uppercase tracking-wider ${isStaffTerminal ? 'text-brand-emerald/70' : 'text-slate-500'}`}>Security Key</label>
               {!isStaffTerminal && <a href="#" className="text-xs font-bold text-brand-blue hover:text-white transition-colors">Forgot?</a>}
            </div>
            <div className="relative group">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isStaffTerminal ? 'text-brand-emerald/40 group-focus-within:text-brand-emerald' : 'text-slate-500 group-focus-within:text-brand-blue'}`} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-dark-900 border rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-700 focus:outline-none transition-all ${isStaffTerminal ? 'border-brand-emerald/20 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald font-mono tracking-widest' : 'border-dark-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue'}`}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed ${isStaffTerminal ? 'bg-brand-emerald hover:bg-emerald-400 text-black shadow-emerald-500/20' : 'bg-brand-blue hover:bg-blue-600 text-white shadow-blue-500/20'}`}
          >
            {isLoading ? (
                <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 animate-spin" />
                    <span>{isStaffTerminal ? 'HANDSHAKING...' : 'Processing...'}</span>
                </div>
            ) : (
                <>
                    {isStaffTerminal ? 'AUTHORIZE OVERRIDE' : 'Sign In to Protocol'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        {/* Social / Divider */}
        {!isStaffTerminal && (
            <>
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
                    <Link to="/onboarding/select-role" className="text-brand-blue font-bold hover:text-white transition-colors">
                      Initialize Sequence
                    </Link>
                </p>
                </div>
            </>
        )}

        {isStaffTerminal && (
            <div className="mt-8 pt-6 border-t border-brand-emerald/10 text-center">
                 <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
                    System State: Encrypted
                 </p>
            </div>
        )}
      </div>
    </div>
  );
};