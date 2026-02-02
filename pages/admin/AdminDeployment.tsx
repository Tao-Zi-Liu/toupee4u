
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
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDeployment: React.FC = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'IDLE' | 'BUILDING' | 'PUSHING' | 'LIVE'>('IDLE');
  
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
    setLogs(["INITIATING DEPLOYMENT SEQUENCE V1.0.5..."]);

    const buildSteps = [
      { progress: 10, log: "Minifying Physics Engine assets..." },
      { progress: 25, log: "Compiling Knowledge Base GraphQL schemas..." },
      { progress: 40, log: "Synthesizing 142 Markdown articles to static HTML..." },
      { progress: 55, log: "Compressing 2.4GB of high-fidelity Expert Video assets..." },
      { progress: 70, log: "Running Truth Engine inference sanity checks..." },
      { progress: 85, log: "Pushing to Global CDN (12 regions)..." },
      { progress: 100, log: "Deployment Complete. Purging Edge Cache." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < buildSteps.length) {
        const step = buildSteps[currentStep];
        setProgress(step.progress);
        addLog(step.log);
        if (step.progress === 85) setStatus('PUSHING');
        currentStep++;
      } else {
        clearInterval(interval);
        setStatus('LIVE');
        setIsDeploying(false);
        addLog("SYSTEM STATE: OPERATIONAL");
      }
    }, 1200);
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
              <p className="text-[10px] font-bold text-slate-500 uppercase">Current Environment</p>
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
                    <span className="text-xs font-mono font-bold text-slate-300">build@toupee4u:~/deploy-pipeline</span>
                 </div>
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30"></div>
                 </div>
              </div>
              
              <div className="p-6 h-[400px] overflow-y-auto font-mono text-[11px] leading-relaxed custom-scrollbar bg-black/40">
                 {logs.length === 0 ? (
                    <div className="text-slate-600 italic">No active deployment logs. Ready for initialization.</div>
                 ) : (
                    <div className="space-y-1">
                       {logs.map((log, i) => (
                          <div key={i} className="animate-in fade-in slide-in-from-left-1 duration-300">
                             <span className="text-emerald-500 mr-2">$</span>
                             <span className="text-slate-300">{log}</span>
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

           <div className="flex items-center justify-between p-6 bg-dark-800 rounded-2xl border border-dark-700">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue border border-brand-blue/20">
                    <Cloud className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-white text-sm">Deployment Strategy</h4>
                    <p className="text-xs text-slate-500">Rolling Update: 1.0.5 -> 1.0.6 (Distroless)</p>
                 </div>
              </div>
              <button 
                onClick={executeDeployment}
                disabled={isDeploying}
                className={`px-8 py-3 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center gap-2 ${
                  isDeploying 
                  ? 'bg-dark-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-brand-blue hover:bg-blue-600 text-white shadow-brand-blue/20'
                }`}
              >
                {isDeploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                {isDeploying ? 'Deploying...' : 'Initiate Quantum Launch'}
              </button>
           </div>
        </div>

        {/* Status Sidebar */}
        <div className="space-y-6">
           <div className="bg-dark-800 rounded-3xl border border-dark-700 p-6 shadow-xl">
              <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                 <Globe className="w-4 h-4 text-brand-blue" /> CDN Status Matrix
              </h3>
              <div className="space-y-4">
                 {[
                    { region: "US-EAST-1 (N. Virginia)", status: "Active", latency: "22ms" },
                    { region: "EU-WEST-1 (Dublin)", status: "Active", latency: "38ms" },
                    { region: "AP-NORTHEAST-1 (Tokyo)", status: "Active", latency: "145ms" },
                    { region: "SA-EAST-1 (São Paulo)", status: "Pending", latency: "-" }
                 ].map((node, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-3 bg-dark-900 border border-dark-700 rounded-xl">
                       <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-700 animate-pulse'}`}></div>
                          <span className="text-slate-300 font-medium">{node.region}</span>
                       </div>
                       <span className="text-slate-500 font-mono">{node.latency}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-dark-800 rounded-3xl border border-dark-700 p-6 shadow-xl">
              <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                 <Shield className="w-4 h-4 text-brand-purple" /> Security Access
              </h3>
              <div className="p-4 bg-dark-900 rounded-2xl border border-dark-700 space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Access Gate</span>
                    <span className="text-emerald-500 font-bold uppercase tracking-wider">Enabled</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Active Key</span>
                    <span className="text-white font-mono bg-dark-800 px-1.5 rounded">quantum****</span>
                 </div>
                 <button className="w-full py-2 border border-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-brand-purple/10 transition-colors">
                    Rotate Security Key
                 </button>
              </div>
           </div>

           <div className="bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 rounded-3xl border border-brand-blue/30 p-6 flex items-center justify-between group cursor-pointer hover:border-brand-blue/60 transition-all">
              <div>
                 <h4 className="font-bold text-white text-sm">Health Dashboard</h4>
                 <p className="text-[10px] text-slate-400 mt-1">Monitor CPU & Memory usage</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-all group-hover:translate-x-1" />
           </div>
        </div>
      </div>
    </div>
  );
};
