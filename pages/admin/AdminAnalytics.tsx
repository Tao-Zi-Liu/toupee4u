
import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  MousePointer2, 
  Globe,
  ArrowUpRight,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const StatItem = ({ label, value, trend, isPositive }: any) => (
    <div className="bg-dark-900 border border-dark-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-all group">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          isPositive ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-dark-800 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                 <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Platform Intelligence</h4>
           </div>
           <h1 className="text-4xl font-bold text-white tracking-tight">Analytics Suite</h1>
        </div>
        <div className="flex gap-2">
            <select className="bg-dark-900 border border-dark-800 rounded-lg px-4 py-2 text-xs font-bold text-white outline-none focus:border-emerald-500 transition-colors">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>All Time</option>
            </select>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-500/20">Export PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem label="Total Page Views" value="452,102" trend="+12.4%" isPositive={true} />
        <StatItem label="Unique Sessions" value="82,440" trend="+8.2%" isPositive={true} />
        <StatItem label="Avg. Stay Duration" value="6m 12s" trend="-2.1%" isPositive={false} />
        <StatItem label="Conversion Rate" value="3.42%" trend="+0.5%" isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart Area */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h3 className="font-bold text-white text-lg">Traffic Distribution</h3>
                    <p className="text-xs text-slate-500 mt-1">Real-time incoming signal volume by hour.</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold text-slate-400">Desktop</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500/30"></div>
                        <span className="text-[10px] font-bold text-slate-400">Mobile</span>
                    </div>
                 </div>
              </div>
              
              {/* Simulated Chart Bars */}
              <div className="h-64 flex items-end justify-between gap-1">
                 {[40, 60, 45, 80, 55, 90, 70, 100, 85, 65, 50, 75, 40, 60, 45, 80, 55, 90, 70, 100, 85, 65, 50, 75].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-0.5 group/bar">
                       <div 
                         style={{ height: `${h * 0.3}%` }} 
                         className="bg-emerald-500/20 rounded-t-sm group-hover/bar:bg-emerald-500/40 transition-colors"
                       ></div>
                       <div 
                         style={{ height: `${h * 0.6}%` }} 
                         className="bg-emerald-500 rounded-t-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover/bar:bg-emerald-400 transition-colors"
                       ></div>
                    </div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                 <span>00:00</span>
                 <span>06:00</span>
                 <span>12:00</span>
                 <span>18:00</span>
                 <span>23:59</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-500" /> Geographic Origin
                 </h4>
                 <div className="space-y-4">
                    {[
                        { country: "United States", val: "42%", count: "12,400" },
                        { country: "United Kingdom", val: "18%", count: "5,200" },
                        { country: "Germany", val: "12%", count: "3,100" },
                        { country: "Canada", val: "8%", count: "2,050" }
                    ].map((geo, i) => (
                        <div key={i} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-300">{geo.country}</span>
                                <span className="text-white">{geo.count}</span>
                            </div>
                            <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: geo.val }}></div>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>

              <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-emerald-500" /> Device Segments
                 </h4>
                 <div className="flex flex-col gap-6 justify-center h-full pb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Monitor className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-300">Desktop</span>
                        </div>
                        <span className="text-emerald-500 font-mono text-sm">62.4%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-300">Mobile</span>
                        </div>
                        <span className="text-emerald-500 font-mono text-sm">31.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Tablet className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-300">Tablet</span>
                        </div>
                        <span className="text-emerald-500 font-mono text-sm">6.4%</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Top Content Sidebar */}
        <div className="space-y-6">
            <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6">
                <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-500" /> Viral Assets
                </h3>
                <div className="space-y-4">
                    {[
                        { title: "Adhesive pH Analysis", views: "12.4k", color: "text-emerald-500" },
                        { title: "Swiss Lace Durability", views: "8.1k", color: "text-blue-500" },
                        { title: "The Swimmers Protocol", views: "6.5k", color: "text-purple-500" },
                        { title: "Plucking Masterclass", views: "5.2k", color: "text-amber-500" },
                        { title: "Solvent Reaction Guide", views: "4.8k", color: "text-red-500" }
                    ].map((art, i) => (
                        <div key={i} className="group p-3 rounded-xl hover:bg-dark-800 transition-colors border border-transparent hover:border-dark-700">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{art.title}</h4>
                                <span className="text-[10px] font-mono text-emerald-500">{art.views}</span>
                            </div>
                            <div className="w-full h-1 bg-dark-800 rounded-full overflow-hidden">
                                <div className={`h-full ${art.color.replace('text-', 'bg-')}`} style={{ width: `${100 - i * 15}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-emerald-500 rounded-3xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] text-black">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Executive Summary</h4>
                <p className="text-sm font-bold leading-relaxed mb-6">
                    "Platform growth has reached a critical mass in the US-EAST region. We recommend scaling the Truth Engine GPU instances by 15% to maintain sub-200ms latency."
                </p>
                <button className="w-full py-3 bg-black text-emerald-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform">
                    Authorize Scaling
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
