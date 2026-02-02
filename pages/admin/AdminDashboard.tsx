
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Activity, 
  Shield, 
  Settings, 
  ArrowRight, 
  Youtube, 
  TrendingUp, 
  Cpu, 
  Database, 
  Globe, 
  AlertCircle,
  Zap,
  Rocket
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { experts, categories, consultations } = useData();
  const navigate = useNavigate();

  const totalArticles = categories.reduce((acc, cat) => {
    return acc + cat.topics.reduce((tAcc, topic) => tAcc + topic.articles.length, 0);
  }, 0);

  const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
    <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 flex flex-col justify-between relative overflow-hidden group hover:border-dark-500 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')} ${color} ring-1 ring-inset ring-white/5`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <TrendingUp className="w-3 h-3" /> {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-dark-700 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
                 <Shield className="w-5 h-5 text-brand-blue" />
              </div>
              <h4 className="text-xs font-bold text-brand-blue uppercase tracking-widest">System Directorate</h4>
           </div>
           <h1 className="text-4xl font-bold text-white tracking-tight">Operation Command</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Uptime</span>
                <span className="text-emerald-500 font-mono text-sm">99.998%</span>
            </div>
            <div className="h-10 w-px bg-dark-700"></div>
            <Link to="/admin/deployment" className="p-2 bg-dark-800 rounded-xl border border-dark-700 flex items-center gap-2 hover:border-brand-blue transition-colors group">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white">Live State</span>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Verified Experts" value={experts.length} color="text-brand-blue" trend="+2" />
        <StatCard icon={FileText} label="Synthesized KB" value={totalArticles} color="text-brand-purple" trend="+12%" />
        <StatCard icon={Activity} label="Active Bonds" value={consultations.length} color="text-yellow-500" trend="+4" />
        <StatCard icon={Cpu} label="AI Inferences" value="1.2k" color="text-cyan-500" trend="Active" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-dark-800 rounded-2xl border border-dark-700 p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                 <Zap className="w-64 h-64 text-brand-blue" />
              </div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <Database className="w-5 h-5 text-brand-blue" /> Core Infrastructure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Link to="/admin/experts" className="group p-5 bg-dark-900 border border-dark-700 rounded-2xl hover:border-brand-blue hover:bg-dark-900/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                       <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-xl ring-1 ring-brand-blue/20">
                          <Users className="w-5 h-5" />
                       </div>
                       <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-blue transition-all group-hover:translate-x-1" />
                    </div>
                    <h4 className="font-bold text-white group-hover:text-brand-blue transition-colors">Expert Directorate</h4>
                    <p className="text-xs text-slate-500 mt-1">Manage verification status and professional credentials.</p>
                 </Link>
                 
                 <Link to="/admin/articles" className="group p-5 bg-dark-900 border border-dark-700 rounded-2xl hover:border-brand-purple hover:bg-dark-900/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                       <div className="p-2.5 bg-brand-purple/10 text-brand-purple rounded-xl ring-1 ring-brand-purple/20">
                          <FileText className="w-5 h-5" />
                       </div>
                       <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-purple transition-all group-hover:translate-x-1" />
                    </div>
                    <h4 className="font-bold text-white group-hover:text-brand-purple transition-colors">Knowledge CMS</h4>
                    <p className="text-xs text-slate-500 mt-1">Direct access to Level 2 and Level 3 physics modules.</p>
                 </Link>

                 <Link to="/admin/youtube-crawler" className="group p-5 bg-dark-900 border border-dark-700 rounded-2xl hover:border-red-500 hover:bg-dark-900/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                       <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl ring-1 ring-red-500/20">
                          <Youtube className="w-5 h-5" />
                       </div>
                       <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-red-500 transition-all group-hover:translate-x-1" />
                    </div>
                    <h4 className="font-bold text-white group-hover:text-red-500 transition-colors">Signal Synthesis</h4>
                    <p className="text-xs text-slate-500 mt-1">Crawl frequencies and convert raw signals into KB assets.</p>
                 </Link>

                 <Link to="/admin/deployment" className="group p-5 bg-dark-900 border border-dark-700 rounded-2xl hover:border-emerald-500 hover:bg-dark-900/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                       <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl ring-1 ring-emerald-500/20">
                          <Rocket className="w-5 h-5" />
                       </div>
                       <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                    </div>
                    <h4 className="font-bold text-white group-hover:text-emerald-500 transition-colors">Launch Console</h4>
                    <p className="text-xs text-slate-500 mt-1">Execute global deployments and manage platform uptime.</p>
                 </Link>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                 <Activity className="w-4 h-4 text-emerald-500" /> System Log
              </h3>
              <div className="space-y-4">
                 {[
                    { event: "New Expert Verified", time: "2m ago", icon: Shield, color: "text-emerald-500" },
                    { event: "Gemini Synthesis Success", time: "15m ago", icon: Cpu, color: "text-brand-blue" },
                    { event: "High Latency Warning", time: "1h ago", icon: AlertCircle, color: "text-yellow-500" },
                    { event: "Database Backup Complete", time: "3h ago", icon: Database, color: "text-slate-500" }
                 ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between text-xs border-b border-dark-700/50 pb-3 last:border-0 last:pb-0">
                       <div className="flex items-center gap-3">
                          <log.icon className={`w-3.5 h-3.5 ${log.color}`} />
                          <span className="text-slate-300 font-medium">{log.event}</span>
                       </div>
                       <span className="text-slate-500 font-mono">{log.time}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 rounded-2xl border border-brand-blue/30 p-6 shadow-xl flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-dark-900 rounded-xl flex items-center justify-center border border-brand-blue/30 mb-4 shadow-lg">
                 <Globe className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="font-bold text-white mb-1">Global Coverage</h3>
              <p className="text-xs text-slate-400 mb-6 px-4">The Truth Engine is currently serving requests across 12 regions.</p>
              <button className="w-full py-2 bg-dark-900 border border-brand-blue/20 text-brand-blue text-xs font-bold rounded-lg hover:bg-brand-blue/10 transition-colors">
                 Check Regional Latency
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
