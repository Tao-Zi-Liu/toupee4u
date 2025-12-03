import React from 'react';
import { UserTier } from '../types';
import { Shield, Zap, Crown, Settings, Edit3, Droplet, Layers, Scissors, Activity, Award, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock User Data - In a real app, this comes from context/API
const MOCK_USER = {
  name: "Alex Mercer",
  handle: "@amercer_diy",
  email: "alex@example.com",
  tier: UserTier.QUANTUM, // Change this to OBSERVER or KINETIC to test different visuals
  avatar: "https://placehold.co/200x200/3b82f6/white?text=AM",
  stats: {
    joined: "Aug 2023",
    reputation: 1250,
    posts: 42,
    solutions: 15
  },
  systemSpecs: {
    base: "French Lace Center / Poly Perimeter",
    density: "95% (Light-Medium)",
    color: "#2 ASH (Darkest Brown Ash)",
    contour: "CC (Standard)",
    adhesive: "Ghost Bond Platinum",
    lifestyle: "Active / Swimmer"
  }
};

const TierBadge: React.FC<{ tier: UserTier }> = ({ tier }) => {
  switch (tier) {
    case UserTier.QUANTUM:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <Crown className="w-3.5 h-3.5" /> Quantum State
        </span>
      );
    case UserTier.KINETIC:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue border border-brand-blue/30 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Zap className="w-3.5 h-3.5" /> Kinetic Force
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" /> Observer
        </span>
      );
  }
};

const TierBanner: React.FC<{ tier: UserTier }> = ({ tier }) => {
  let gradient = "bg-gradient-to-r from-slate-800 to-slate-900";
  if (tier === UserTier.KINETIC) gradient = "bg-gradient-to-r from-blue-900 to-brand-blue/40";
  if (tier === UserTier.QUANTUM) gradient = "bg-gradient-to-r from-indigo-900 via-purple-900 to-brand-purple/40";

  return (
    <div className={`h-48 w-full rounded-t-3xl relative overflow-hidden ${gradient}`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      {tier === UserTier.QUANTUM && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/30 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
      )}
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const user = MOCK_USER;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header Card */}
      <div className="bg-dark-800 rounded-3xl border border-dark-700 shadow-xl overflow-hidden relative group">
        <TierBanner tier={user.tier} />
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-32 h-32 rounded-3xl border-4 border-dark-800 shadow-2xl bg-dark-900 object-cover"
              />
              <button className="absolute bottom-2 right-2 p-2 bg-dark-900 text-white rounded-xl border border-dark-700 hover:bg-brand-blue hover:border-brand-blue transition-colors shadow-lg">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 mb-2">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <TierBadge tier={user.tier} />
              </div>
              <p className="text-slate-400 font-medium">{user.handle}</p>
            </div>

            <div className="flex gap-4">
               <div className="text-center bg-dark-900/50 p-3 rounded-2xl border border-dark-700 backdrop-blur-sm">
                  <div className="text-lg font-bold text-white">{user.stats.reputation}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Reputation</div>
               </div>
               <div className="text-center bg-dark-900/50 p-3 rounded-2xl border border-dark-700 backdrop-blur-sm">
                  <div className="text-lg font-bold text-white">{user.stats.posts}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Posts</div>
               </div>
               <button className="h-full px-4 bg-dark-700 text-slate-300 rounded-2xl hover:bg-dark-600 border border-dark-600 transition-colors" title="Settings">
                  <Settings className="w-5 h-5" />
               </button>
               <Link to="/login" className="h-full px-4 bg-dark-900 text-red-400 rounded-2xl border border-dark-700 hover:border-red-500/50 hover:bg-red-500/10 transition-colors flex items-center justify-center" title="Logout">
                  <LogOut className="w-5 h-5" />
               </Link>
            </div>
          </div>

          {/* Tabs (Visual only) */}
          <div className="flex gap-8 border-b border-dark-700">
            <button className="pb-4 text-brand-blue font-semibold border-b-2 border-brand-blue">Overview</button>
            <button className="pb-4 text-slate-400 hover:text-white font-medium transition-colors">Activity</button>
            <button className="pb-4 text-slate-400 hover:text-white font-medium transition-colors">Billing</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - System Specs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-blue" />
                Current System Blueprint
              </h3>
              <button className="text-xs text-brand-blue hover:text-white font-medium">Edit Specs</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-2">
                    <Layers className="w-3 h-3" /> Base Material
                  </div>
                  <div className="text-slate-200 font-medium">{user.systemSpecs.base}</div>
               </div>
               <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Density
                  </div>
                  <div className="text-slate-200 font-medium">{user.systemSpecs.density}</div>
               </div>
               <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-2">
                    <Scissors className="w-3 h-3" /> Color Code
                  </div>
                  <div className="text-slate-200 font-medium flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#3B2F2F] border border-white/20"></span>
                    {user.systemSpecs.color}
                  </div>
               </div>
               <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center gap-2">
                    <Droplet className="w-3 h-3" /> Adhesive Protocol
                  </div>
                  <div className="text-slate-200 font-medium">{user.systemSpecs.adhesive}</div>
               </div>
            </div>
            
            {/* Context Notice */}
            <div className="mt-6 flex items-start gap-3 text-xs text-slate-400 bg-brand-blue/5 p-3 rounded-lg border border-brand-blue/10">
              <div className="mt-0.5"><Activity className="w-4 h-4 text-brand-blue" /></div>
              <p>
                The "Truth Engine" AI uses these specs to provide personalized advice. For example, it knows <strong>Ghost Bond</strong> (Water-based) requires different removal protocols than acrylics for your <strong>Lace</strong> base.
              </p>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
            <h3 className="text-lg font-bold text-white mb-6">Recent Contributions</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center border border-dark-600 text-slate-400">
                       <Activity className="w-4 h-4" />
                    </div>
                    <div className="w-px h-full bg-dark-700 my-2"></div>
                 </div>
                 <div>
                    <h4 className="text-white font-medium text-sm">Replied to "Hairline lifting after gym?"</h4>
                    <p className="text-slate-400 text-xs mt-1 mb-2">2 hours ago in <span className="text-brand-blue">Troubleshooting</span></p>
                    <p className="text-slate-400 text-sm italic border-l-2 border-dark-600 pl-3">
                       "Since you're using Ghost Bond, make sure you're waiting for the glue to turn completely clear (approx 7 mins) before pressing the system down. White glue means it's still wet..."
                    </p>
                 </div>
              </div>
              
              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center border border-brand-purple/30 text-brand-purple">
                       <Award className="w-4 h-4" />
                    </div>
                 </div>
                 <div>
                    <h4 className="text-white font-medium text-sm">Earned Badge: "Adhesive Expert"</h4>
                    <p className="text-slate-400 text-xs mt-1">Yesterday</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Membership Info */}
        <div className="space-y-6">
           <div className={`rounded-2xl border p-6 ${user.tier === UserTier.QUANTUM ? 'bg-gradient-to-b from-indigo-900/50 to-dark-800 border-brand-purple/30' : 'bg-dark-800 border-dark-700'}`}>
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold text-white">Membership</h3>
                 {user.tier === UserTier.QUANTUM ? (
                   <Crown className="w-5 h-5 text-brand-purple" />
                 ) : (
                   <Shield className="w-5 h-5 text-slate-400" />
                 )}
              </div>
              
              <div className="mb-6">
                 <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Current Tier</div>
                 <div className={`text-2xl font-bold ${user.tier === UserTier.QUANTUM ? 'text-brand-purple' : 'text-white'}`}>
                    {user.tier}
                 </div>
                 <div className="text-xs text-slate-500 mt-1">Renews Oct 12, 2023</div>
              </div>

              {user.tier === UserTier.QUANTUM ? (
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-purple"></div>
                       Priority AI Processing
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-purple"></div>
                       Concierge Support Active
                    </div>
                    <button className="w-full mt-4 py-2 bg-dark-900 hover:bg-dark-950 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-brand-purple/20 transition-colors">
                       Manage Subscription
                    </button>
                 </div>
              ) : (
                <div>
                   <p className="text-sm text-slate-400 mb-4">Upgrade to <strong>Quantum State</strong> to unlock 1-on-1 stylist chats and vendor discounts.</p>
                   <button className="w-full py-2 bg-brand-purple hover:bg-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-purple-900/20 transition-colors">
                      Upgrade Now
                   </button>
                </div>
              )}
           </div>

           <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
              <h3 className="text-sm font-bold text-white mb-4">Saved Articles</h3>
              <div className="space-y-3">
                 <a href="#" className="block p-3 rounded-xl bg-dark-900 border border-dark-700 hover:border-brand-blue transition-colors group">
                    <div className="text-xs text-slate-500 mb-1">Foundations</div>
                    <div className="text-sm font-medium text-slate-300 group-hover:text-white truncate">How to achieve an undetectable hairline</div>
                 </a>
                 <a href="#" className="block p-3 rounded-xl bg-dark-900 border border-dark-700 hover:border-brand-blue transition-colors group">
                    <div className="text-xs text-slate-500 mb-1">Maintenance</div>
                    <div className="text-sm font-medium text-slate-300 group-hover:text-white truncate">Is C-22 safe for Swiss Lace?</div>
                 </a>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};