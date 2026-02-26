
import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  Terminal, 
  Globe, 
  Shield, 
  Cpu, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Activity,
  Server,
  Cloud,
  ChevronRight,
  ArrowLeft,
  Github,
  GitBranch,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDeployment: React.FC = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'IDLE' | 'BUILDING' | 'PUSHING' | 'LIVE'>('IDLE');
  const [githubSynced, setGithubSynced] = useState(false);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const executeDeployment = () => {
    setIsDeploying(true);
    setProgress(0);
    setStatus('BUILDING');
    setGithubSynced(false);
    setLogs(["INITIATING DEPLOYMENT SEQUENCE V1.0.6...", "ESTABLISHING SSH HANDSHAKE WITH GITHUB.COM..."]);

    const buildSteps = [
      { progress: 5, log: "Authenticating via Personal Access Token (PAT)... SUCCESS" },
      { progress: 15, log: "Checking remote status... 'origin/main' is behind local branch." },
      { progress: 25, log: "git add . && git commit -m 'System Update: Quantum Logic V2'" },
      { progress: 35, log: "Pushing commits to GitHub repository... [====================] 100%" },
      { progress: 45, log: "GitHub Sync Complete. Deployment Triggered via Webhook." },
      { progress: 55, log: "Minifying Physics Engine assets..." },
      { progress: 65, log: "Compiling Knowledge Base GraphQL schemas..." },
      { progress: 75, log: "Synthesizing 142 Markdown articles to static HTML..." },
      { progress: 85, log: "Running Truth Engine inference sanity checks..." },
      { progress: 95, log: "Pushing to Global CDN (12 regions)..." },
      { progress: 100, log: "Deployment Complete. Purging Edge Cache." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < buildSteps.length) {
        const step = buildSteps[currentStep];
        setProgress(step.progress);
        addLog(step.log);
        if (step.progress === 45) setGithubSynced(true);
        if (step.progress === 85) setStatus('PUSHING');
        currentStep++;
      } else {
        clearInterval(interval);
        setStatus('LIVE');
        setIsDeploying(false);
        addLog("SYSTEM STATE: OPERATIONAL. ALL NODES SYNCED WITH GITHUB.");
      }
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-dark-700 pb-8">
        <div className="flex items-center gap-5">
           <Link to="/admin" className="p-2 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors border border-dark-700">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
           </Link>
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <Rocket className="w-4 h-4 text-brand-blue" />
                 <h4 className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.2em]">Deployment Directorate</h4>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Launch Console</h1>
           </div>
        </div>
        
        <div className="flex items-center gap-4 bg-dark-800 p-3 rounded-2xl border border-dark-700">
           <div className="text-right px-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Environment</p>
              <p className="text-emerald-500 font-bold text-sm">PRODUCTION</p>
           </div>
           <div className="h-8 w-px bg-dark-700"></div>
           <div className="flex items-center gap-3 px-2">
              <div className={`w-2.5 h-2.5 rounded-full ${status === 'LIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
              <span className="text-xs font-bold text-white">{status}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Terminal Section */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-dark-950 rounded-3xl border border-dark-700 overflow-hidden shadow-2xl relative">
              <div className="bg-dark-900 px-6 py-4 border-b border-dark-800 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-mono font-bold text-slate-300">build@toupee4u:~/quantum-core</span>
                 </div>
                 <div className="flex gap-1.5 text-slate-500 text-[10px] font-mono">
                    <Github className="w-3 h-3" /> main
                 </div>
              </div>
              
              <div className="p-6 h-[450px] overflow-y-auto font-mono text-[11px] leading-relaxed custom-scrollbar bg-black/40">
                 {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-4">
                        <Github className="w-12 h-12 opacity-20" />
                        <div className="text-center">
                            <p className="italic">Local repository is ahead of 'origin/main' by 4 commits.</p>
                            <p className="text-[10px] mt-1 uppercase tracking-widest opacity-50">Awaiting push command...</p>
                        </div>
                    </div>
                 ) : (
                    <div className="space-y-1">
                       {logs.map((log, i) => (
                          <div key={i} className="animate-in fade-in slide-in-from-left-1 duration-300">
                             <span className="text-emerald-500 mr-2">$</span>
                             <span className={log.includes('SUCCESS') || log.includes('Complete') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>{log}</span>
                          </div>
                       ))}
                       {isDeploying && <div className="w-2 h-4 bg-emerald-500 animate-pulse inline-block align-middle ml-1"></div>}
                       <div ref={logEndRef}></div>
                    </div>
                 )}
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-dark-800">
                 <div 
                   className="h-full bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500 ease-out"
                   style={{ width: `${progress}%` }}
                 ></div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-dark-800 rounded-2xl border border-dark-700 gap-4">
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-xl transition-colors ${githubSynced ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'} border`}>
                    <Github className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-white text-sm">GitHub Integration</h4>
                    <p className="text-xs text-slate-500">Repository: <span className="text-slate-300">toupee4u/quantum-engine</span></p>
                 </div>
              </div>
              <button 
                onClick={executeDeployment}
                disabled={isDeploying}
                className={`px-8 py-3 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center gap-2 w-full md:w-auto justify-center ${
                  isDeploying 
                  ? 'bg-dark-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-brand-blue hover:bg-blue-600 text-white shadow-brand-blue/20'
                }`}
              >
                {isDeploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
                {isDeploying ? 'Processing Commit...' : 'Push & Deploy to GitHub'}
              </button>
           </div>
        </div>

        {/* Status Sidebar */}
        <div className="space-y-6">
           <div className="bg-dark-800 rounded-3xl border border-dark-700 p-6 shadow-xl">
              <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                 <GitBranch className="w-4 h-4 text-brand-blue" /> Version Control
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs p-3 bg-dark-900 border border-dark-700 rounded-xl">
                    <span className="text-slate-500">Active Branch</span>
                    <span className="text-white font-mono bg-dark-800 px-2 py-0.5 rounded">main</span>
                 </div>
                 <div className="flex items-center justify-between text-xs p-3 bg-dark-900 border border-dark-700 rounded-xl">
                    <span className="text-slate-500">Last Hash</span>
                    <span className="text-brand-blue font-mono">#92a4f02</span>
                 </div>
                 <div className="flex items-center justify-between text-xs p-3 bg-dark-900 border border-dark-700 rounded-xl">
                    <span className="text-slate-500">GitHub Sync</span>
                    <span className={`font-bold ${githubSynced ? 'text-emerald-500' : 'text-yellow-500'}`}>
                        {githubSynced ? 'UP-TO-DATE' : 'OUTDATED'}
                    </span>
                 </div>
              </div>
           </div>

           <div className="bg-dark-800 rounded-3xl border border-dark-700 p-6 shadow-xl">
              <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                 <Lock className="w-4 h-4 text-brand-purple" /> Auth Protocols
              </h3>
              <div className="p-4 bg-dark-900 rounded-2xl border border-dark-700 space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">GitHub PAT</span>
                    <span className="text-emerald-500 font-bold uppercase tracking-wider">VALID</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">SSH Key</span>
                    <span className="text-emerald-500 font-bold uppercase tracking-wider">ACTIVE</span>
                 </div>
                 <button className="w-full py-2 border border-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-brand-purple/10 transition-colors">
                    Re-Verify GitHub Link
                 </button>
              </div>
           </div>

           <div className="bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 rounded-3xl border border-brand-blue/30 p-6 flex flex-col items-center text-center group cursor-pointer hover:border-brand-blue/60 transition-all">
              <Activity className="w-8 h-8 text-brand-blue mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-sm">Health Dashboard</h4>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Global Node Status: Optimal</p>
           </div>
        </div>
      </div>
    </div>
  );
};
