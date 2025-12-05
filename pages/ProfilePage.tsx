import React, { useState, useRef } from 'react';
import { UserTier } from '../types';
import { 
  Shield, Zap, Crown, Settings, Edit3, Droplet, Layers, Scissors, 
  Activity, Award, LogOut, MessageSquare, ThumbsUp, CreditCard, 
  CheckCircle, Clock, Download, AlertTriangle, Calendar, ChevronRight,
  Bell, Lock, Trash2, Save, User, Mail, Smartphone, Camera, Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock User Data
const MOCK_USER = {
  name: "Alex Mercer",
  handle: "@amercer_diy",
  email: "alex@example.com",
  tier: UserTier.QUANTUM,
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

// Mock Activity Data
const ACTIVITY_LOG = [
  { id: 1, type: 'reply', title: 'Replied to "Hairline lifting after gym?"', context: 'Troubleshooting', time: '2 hours ago', points: '+5', icon: MessageSquare, color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20' },
  { id: 2, type: 'badge', title: 'Earned Badge: "Adhesive Expert"', context: 'Achievements', time: '1 day ago', points: '+50', icon: Award, color: 'text-brand-purple bg-brand-purple/10 border-brand-purple/20' },
  { id: 3, type: 'post', title: 'Published "Guide: Waterproofing for Swimmers"', context: 'Tutorials', time: '3 days ago', points: '+25', icon: Edit3, color: 'text-green-500 bg-green-500/10 border-green-500/20' },
  { id: 4, type: 'like', title: 'Liked "Walker Tape Review"', context: 'Community', time: '5 days ago', points: null, icon: ThumbsUp, color: 'text-slate-400 bg-dark-800 border-dark-700' },
  { id: 5, type: 'sub', title: 'Upgraded to Quantum State', context: 'Billing', time: '1 week ago', points: null, icon: Crown, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' }
];

// Mock Billing Data
const BILLING_HISTORY = [
  { id: 'INV-2023-001', date: 'Oct 01, 2023', description: 'Quantum State Membership - Monthly', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2023-002', date: 'Sep 01, 2023', description: 'Quantum State Membership - Monthly', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2023-003', date: 'Aug 01, 2023', description: 'Kinetic Force Membership - Monthly', amount: '$9.00', status: 'Paid' },
  { id: 'INV-2023-004', date: 'Jul 01, 2023', description: 'Kinetic Force Membership - Monthly', amount: '$9.00', status: 'Paid' },
];

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
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'billing' | 'settings'>('overview');
  const user = MOCK_USER;

  // Profile Image State
  const [banner, setBanner] = useState<string | null>(null);
  const [avatar, setAvatar] = useState(MOCK_USER.avatar);
  
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'avatar') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'banner') setBanner(url);
      if (type === 'avatar') setAvatar(url);
    }
  };

  // Settings Form State
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    handle: user.handle,
    bio: "DIY enthusiast trying to master the art of the undetectable hairline.",
  });

  const [specsForm, setSpecsForm] = useState({
    base: "French Lace Center / Poly Perimeter",
    density: "95% (Light-Medium)",
    color: "#2 ASH",
    adhesive: "Ghost Bond Platinum",
  });

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    replyAlerts: true,
    marketing: false,
  });

  const handleSaveSettings = () => {
    // Simulate save
    const btn = document.getElementById('save-btn');
    if(btn) {
        btn.innerHTML = '<span class="flex items-center gap-2"><div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</span>';
        setTimeout(() => {
            btn.innerHTML = '<span class="flex items-center gap-2">Changes Saved</span>';
            setTimeout(() => {
                btn.innerHTML = '<span class="flex items-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Changes</span>';
            }, 2000);
        }, 1000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header Card */}
      <div className="bg-dark-800 rounded-3xl border border-dark-700 shadow-xl overflow-hidden relative group">
        
        {/* Banner Section */}
        <div className="relative group/banner">
            {banner ? (
                <div className="h-48 w-full rounded-t-3xl relative overflow-hidden">
                    <img src={banner} alt="Profile Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover/banner:bg-black/40 transition-colors"></div>
                </div>
            ) : (
                <TierBanner tier={user.tier} />
            )}
            
            {/* Edit Cover Trigger */}
            <button 
                onClick={() => bannerInputRef.current?.click()}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md flex items-center gap-2 border border-white/10 opacity-0 group-hover/banner:opacity-100 transition-all transform translate-y-2 group-hover/banner:translate-y-0"
            >
                <Camera className="w-4 h-4" /> Edit Cover
            </button>
            <input 
                type="file" 
                ref={bannerInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'banner')}
            />
        </div>
        
        <div className="px-8 pb-0 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
            
            {/* Avatar Section */}
            <div className="relative group/avatar">
              <img 
                src={avatar} 
                alt={user.name} 
                className="w-32 h-32 rounded-3xl border-4 border-dark-800 shadow-2xl bg-dark-900 object-cover"
              />
              {/* Avatar Upload Overlay */}
              <div 
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 rounded-3xl bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer border-4 border-transparent z-10"
              >
                 <Camera className="w-8 h-8 text-white opacity-90" />
              </div>
              
              <button 
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-2 right-2 p-2 bg-dark-900 text-white rounded-xl border border-dark-700 hover:bg-brand-blue hover:border-brand-blue transition-colors shadow-lg z-20"
                title="Change Avatar"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <input 
                type="file" 
                ref={avatarInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'avatar')}
              />
            </div>
            
            <div className="flex-1 mb-2">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <TierBadge tier={user.tier} />
              </div>
              <p className="text-slate-400 font-medium">{user.handle}</p>
            </div>

            <div className="flex gap-4 mb-2 md:mb-0">
               <div className="text-center bg-dark-900/50 p-3 rounded-2xl border border-dark-700 backdrop-blur-sm">
                  <div className="text-lg font-bold text-white">{user.stats.reputation}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Reputation</div>
               </div>
               <div className="text-center bg-dark-900/50 p-3 rounded-2xl border border-dark-700 backdrop-blur-sm">
                  <div className="text-lg font-bold text-white">{user.stats.posts}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Posts</div>
               </div>
               <button 
                  onClick={() => setActiveTab('settings')}
                  className="h-full px-4 bg-dark-700 text-slate-300 rounded-2xl hover:bg-dark-600 border border-dark-600 transition-colors" 
                  title="Settings"
               >
                  <Settings className="w-5 h-5" />
               </button>
               <Link to="/login" className="h-full px-4 bg-dark-900 text-red-400 rounded-2xl border border-dark-700 hover:border-red-500/50 hover:bg-red-500/10 transition-colors flex items-center justify-center" title="Logout">
                  <LogOut className="w-5 h-5" />
               </Link>
            </div>
          </div>

          {/* Functional Tabs */}
          <div className="flex gap-8 border-b border-dark-700 overflow-x-auto">
            {['overview', 'activity', 'billing', 'settings'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 font-semibold transition-colors border-b-2 capitalize whitespace-nowrap ${activeTab === tab ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                    {tab}
                </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- OVERVIEW TAB CONTENT --- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 duration-500">
            
            {/* Left Column - System Specs */}
            <div className="lg:col-span-2 space-y-6">
            <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-brand-blue" />
                    Current System Blueprint
                </h3>
                <button onClick={() => setActiveTab('settings')} className="text-xs text-brand-blue hover:text-white font-medium">Edit Specs</button>
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

            {/* Recent Contributions (Mini) */}
            <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                <h3 className="text-lg font-bold text-white mb-6">Recent Highlights</h3>
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
                        "Since you're using Ghost Bond, make sure you're waiting for the glue to turn completely clear (approx 7 mins)..."
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
                        <button 
                            onClick={() => setActiveTab('billing')}
                            className="w-full mt-4 py-2 bg-dark-900 hover:bg-dark-950 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-brand-purple/20 transition-colors"
                        >
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
      )}

      {/* --- ACTIVITY TAB CONTENT --- */}
      {activeTab === 'activity' && (
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-2 duration-500">
           
           <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-white">Action History</h2>
               <div className="flex gap-2">
                   <select className="bg-dark-800 border border-dark-700 text-sm text-slate-400 rounded-lg p-2 focus:outline-none focus:border-brand-blue">
                       <option>All Activity</option>
                       <option>Posts & Replies</option>
                       <option>Achievements</option>
                   </select>
               </div>
           </div>

           <div className="space-y-8 relative">
               {/* Timeline Line */}
               <div className="absolute left-6 top-8 bottom-8 w-px bg-dark-700"></div>

               {ACTIVITY_LOG.map((item) => (
                   <div key={item.id} className="relative flex gap-6 group">
                       {/* Icon */}
                       <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg flex-shrink-0 ${item.color}`}>
                           <item.icon className="w-5 h-5" />
                       </div>

                       {/* Card */}
                       <div className="flex-1 bg-dark-800 rounded-2xl border border-dark-700 p-5 hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5 transition-all">
                           <div className="flex justify-between items-start mb-2">
                               <div className="flex items-center gap-2">
                                   <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.context}</span>
                                   <span className="w-1 h-1 rounded-full bg-dark-600"></span>
                                   <span className="text-xs text-slate-500">{item.time}</span>
                               </div>
                               {item.points && (
                                   <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                                       {item.points} Rep
                                   </span>
                               )}
                           </div>
                           <h3 className="text-base font-bold text-white mb-1 group-hover:text-brand-blue transition-colors">
                               {item.title}
                           </h3>
                           <p className="text-sm text-slate-400">
                               Action recorded on protocol chain. Verified by community consensus.
                           </p>
                       </div>
                   </div>
               ))}
           </div>
           
           <div className="mt-8 flex justify-center">
               <button className="px-6 py-2 bg-dark-800 border border-dark-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-colors text-sm">
                   Load Previous Cycles
               </button>
           </div>
        </div>
      )}

      {/* --- BILLING TAB CONTENT --- */}
      {activeTab === 'billing' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Plan Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 to-dark-800 rounded-2xl border border-brand-purple/30 p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30 text-xs font-bold uppercase tracking-wider mb-4">
                                <Crown className="w-3.5 h-3.5" /> Active Subscription
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Quantum State</h2>
                            <p className="text-indigo-200 text-sm mb-6">
                                The highest tier of knowledge access. Concierge support enabled.
                            </p>
                            <div className="flex items-center gap-6">
                                <div>
                                    <div className="text-xs text-indigo-300 uppercase font-bold tracking-wider">Price</div>
                                    <div className="text-xl font-bold text-white">$29.00 <span className="text-sm text-indigo-300 font-normal">/ mo</span></div>
                                </div>
                                <div className="w-px h-8 bg-brand-purple/30"></div>
                                <div>
                                    <div className="text-xs text-indigo-300 uppercase font-bold tracking-wider">Next Billing</div>
                                    <div className="text-xl font-bold text-white">Oct 12, 2023</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <button className="px-6 py-3 bg-white text-brand-purple font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                                Change Plan
                            </button>
                            <button className="px-6 py-3 bg-black/20 text-indigo-200 font-medium rounded-xl hover:bg-black/40 hover:text-white transition-colors border border-white/10">
                                Cancel Subscription
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-dark-800 rounded-2xl border border-dark-700 p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Payment Method</h3>
                        <div className="bg-dark-900 rounded-xl p-4 border border-dark-600 flex items-center gap-4 mb-4">
                            <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center text-white text-xs font-bold">
                                VISA
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-bold text-white">•••• •••• •••• 4242</div>
                                <div className="text-xs text-slate-500">Expires 12/25</div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    </div>
                    <button className="w-full py-3 border border-dark-600 rounded-xl text-slate-300 hover:text-white hover:bg-dark-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                        <CreditCard className="w-4 h-4" /> Update Card
                    </button>
                </div>
            </div>

            {/* Invoice History */}
            <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Invoice History</h3>
                    <button className="text-xs font-bold text-brand-blue hover:text-white transition-colors">Download All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-dark-900 text-xs text-slate-500 uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-5">Invoice ID</th>
                                <th className="p-5">Date</th>
                                <th className="p-5">Description</th>
                                <th className="p-5">Amount</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {BILLING_HISTORY.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-dark-700/50 transition-colors group">
                                    <td className="p-5 font-mono text-xs text-slate-400">{invoice.id}</td>
                                    <td className="p-5 text-sm text-white flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-slate-500" /> {invoice.date}
                                    </td>
                                    <td className="p-5 text-sm text-slate-300">{invoice.description}</td>
                                    <td className="p-5 text-sm font-bold text-white">{invoice.amount}</td>
                                    <td className="p-5">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold uppercase tracking-wider">
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button className="p-2 text-slate-500 hover:text-white hover:bg-dark-600 rounded-lg transition-colors">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alert / Notice */}
            <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-yellow-600/80 text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                    Your next invoice will include a prorated adjustment for the mid-month upgrade to Quantum State. 
                    If you have any questions, please contact <a href="#" className="underline hover:text-yellow-500">Billing Support</a>.
                </p>
            </div>

        </div>
      )}

      {/* --- SETTINGS TAB CONTENT --- */}
      {activeTab === 'settings' && (
        <div className="animate-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column: Account & Notifications */}
                <div className="space-y-8">
                    {/* Account Preferences */}
                    <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                            <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Account Profile</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
                                <input 
                                    type="text" 
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                    className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Community Handle</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">@</span>
                                    <input 
                                        type="text" 
                                        value={profileForm.handle.replace('@','')}
                                        onChange={(e) => setProfileForm({...profileForm, handle: `@${e.target.value}`})}
                                        className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 pl-8 text-white focus:border-brand-blue outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input 
                                        type="email" 
                                        value={profileForm.email}
                                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                        className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 pl-10 text-white focus:border-brand-blue outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio / Status</label>
                                <textarea 
                                    value={profileForm.bio}
                                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                                    className="w-full h-24 bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                                <Bell className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Notifications</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-dark-900 rounded-xl border border-dark-600">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-200">Email Digest</span>
                                </div>
                                <button 
                                    onClick={() => setNotifications({...notifications, emailDigest: !notifications.emailDigest})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.emailDigest ? 'bg-brand-blue' : 'bg-dark-700'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.emailDigest ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-dark-900 rounded-xl border border-dark-600">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-200">Reply Alerts</span>
                                </div>
                                <button 
                                    onClick={() => setNotifications({...notifications, replyAlerts: !notifications.replyAlerts})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.replyAlerts ? 'bg-brand-blue' : 'bg-dark-700'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.replyAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-dark-900 rounded-xl border border-dark-600">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-200">Marketing & Offers</span>
                                </div>
                                <button 
                                    onClick={() => setNotifications({...notifications, marketing: !notifications.marketing})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.marketing ? 'bg-brand-blue' : 'bg-dark-700'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.marketing ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: System DNA & Danger Zone */}
                <div className="space-y-8">
                    {/* System Specs (The DNA) */}
                    <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-lg relative overflow-hidden">
                        {/* Background Effect */}
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Layers className="w-48 h-48 text-brand-purple" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                                <div className="p-2 bg-brand-purple/10 rounded-lg text-brand-purple">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">System DNA</h2>
                                    <p className="text-xs text-slate-400">Used by the Truth Engine for AI advice.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Base Architecture</label>
                                    <select 
                                        value={specsForm.base}
                                        onChange={(e) => setSpecsForm({...specsForm, base: e.target.value})}
                                        className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-purple outline-none appearance-none"
                                    >
                                        <option>French Lace Center / Poly Perimeter</option>
                                        <option>Full Swiss Lace</option>
                                        <option>0.03mm Ultra Thin Skin</option>
                                        <option>0.06mm Thin Skin</option>
                                        <option>Fine Monofilament</option>
                                    </select>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Density</label>
                                        <select 
                                            value={specsForm.density}
                                            onChange={(e) => setSpecsForm({...specsForm, density: e.target.value})}
                                            className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-purple outline-none appearance-none"
                                        >
                                            <option>80% (Light)</option>
                                            <option>90% (Light-Medium)</option>
                                            <option>95% (Light-Medium)</option>
                                            <option>100% (Medium)</option>
                                            <option>110% (Medium-Heavy)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Color Code</label>
                                        <input 
                                            type="text" 
                                            value={specsForm.color}
                                            onChange={(e) => setSpecsForm({...specsForm, color: e.target.value})}
                                            className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-purple outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Adhesive</label>
                                    <select 
                                        value={specsForm.adhesive}
                                        onChange={(e) => setSpecsForm({...specsForm, adhesive: e.target.value})}
                                        className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-purple outline-none appearance-none"
                                    >
                                        <option>Ghost Bond Platinum</option>
                                        <option>Ghost Bond Classic</option>
                                        <option>Walker Ultra Hold (Liquid)</option>
                                        <option>Walker Tape (Minis)</option>
                                        <option>Got2B Glued (Daily)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <h2 className="text-lg font-bold text-white">Danger Zone</h2>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">Permanently delete your account and all data.</p>
                            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-lg transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Action Bar */}
            <div className="sticky bottom-4 mt-8 flex justify-end">
                <div className="bg-dark-900 border border-dark-600 rounded-2xl p-2 shadow-2xl flex gap-3">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        id="save-btn"
                        onClick={handleSaveSettings}
                        className="px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all min-w-[160px] justify-center"
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
