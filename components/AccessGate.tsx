import React, { useState, useEffect } from 'react';
import { Shield, Terminal, ArrowRight, AlertCircle, Cpu } from 'lucide-react';

interface AccessGateProps {
  children: React.ReactNode;
}

export const AccessGate: React.FC<AccessGateProps> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const ACCESS_KEY = 'quantum2025';

  useEffect(() => {
    const accessGrant = localStorage.getItem('toupee_access_granted');
    if (accessGrant === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || isProcessing) return;
    
    setError(false);
    setIsProcessing(true);

    setTimeout(() => {
      if (password === ACCESS_KEY) {
        localStorage.setItem('toupee_access_granted', 'true');
        setIsUnlocked(true);
      } else {
        setError(true);
        setIsProcessing(false);
        setPassword('');
      }
    }, 1000);
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[10000] bg-dark-900 flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background Visuals - pointer-events-none is crucial here */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Decorative Hexagon */}
        <div className="absolute -top-12 -left-12 opacity-20 text-brand-blue animate-spin-slow pointer-events-none">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5L93.3013 30V80L50 95L6.69873 80V30L50 5Z" stroke="currentColor" strokeWidth="1"/>
            </svg>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-dark-900 border border-dark-700 mb-6 shadow-inner relative group">
              <div className="absolute inset-0 bg-brand-blue/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Shield className={`w-10 h-10 transition-colors ${error ? 'text-red-500' : 'text-brand-blue'}`} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Restricted Signal</h1>
            <p className="text-slate-300 text-sm leading-relaxed">
                The Toupee4U Knowledge Base is under <span className="text-brand-blue font-bold">Quantum Encrypt</span>. Enter the deployment key.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Security Key</label>
                <span className="text-[10px] font-mono text-brand-blue opacity-50">v1.0.5-FINAL</span>
              </div>
              <div className="relative">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <input 
                  type="password" 
                  autoFocus
                  autoComplete="off"
                  placeholder="Enter access code..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isProcessing}
                  className={`w-full bg-dark-900 border ${error ? 'border-red-500/50 animate-shake' : 'border-dark-600'} rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all font-mono tracking-widest relative z-20`}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold mt-2 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>Invalid Protocol Key. Try: quantum2025</span>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isProcessing || !password}
              className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative z-20"
            >
              {isProcessing ? (
                <>
                  <Cpu className="w-5 h-5 animate-spin" />
                  <span>Decrypting...</span>
                </>
              ) : (
                <>
                  <span>Verify Credentials</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-dark-700/50">
             <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   Status: Secure
                </div>
                <span>AES-256</span>
             </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] mt-6 uppercase font-bold tracking-widest">
            Unauthorized access attempt logged.
        </p>
      </div>
    </div>
  );
};