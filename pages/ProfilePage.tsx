
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserTier } from '../types';
import { 
  Shield, 
  Zap, 
  Crown, 
  Settings, 
  Edit3, 
  Droplet, 
  Layers, 
  Scissors,
  Activity, 
  Award, 
  LogOut, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle,
  Clock, 
  AlertTriangle, 
  User, 
  Camera, 
  FileText, 
  Video, 
  CalendarCheck,
  PlusCircle, 
  Eye, 
  DollarSign, 
  PenTool, 
  ShieldCheck, 
  Users,
  Orbit,
  Sparkles
} from 'lucide-react';

const DEFAULT_USER = {
  name: "Alex Mercer",
  handle: "@amercer_diy",
  email: "alex@example.com",
  tier: UserTier.GALAXY,
  avatar: "https://placehold.co/200x200/3b82f6/white?text=AM",
  stats: { joined: "Aug 2023", reputation: 1250, posts: 42, solutions: 15 },
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
    case UserTier.SUPERNOVA:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <Sparkles className="w-3.5 h-3.5" /> Supernova
        </span>
      );
    case UserTier.GALAXY:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <Orbit className="w-3.5 h-3.5" /> Galaxy
        </span>
      );
    case UserTier.NOVA:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue border border-brand-blue/30 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" /> Nova
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" /> Nebula
        </span>
      );
  }
};

const TierBanner: React.FC<{ tier: UserTier; isExpert?: boolean }> = ({ tier, isExpert }) => {
  let gradient = "bg-gradient-to-r from-slate-800 to-slate-900";
  if (tier === UserTier.NOVA) gradient = "bg-gradient-to-r from-blue-900 to-brand-blue/40";
  if (tier === UserTier.GALAXY) gradient = "bg-gradient-to-r from-indigo-900 via-purple-900 to-brand-purple/40";
  if (tier === UserTier.SUPERNOVA) gradient = "bg-gradient-to-r from-amber-900 via-amber-700 to-amber-600/40";
  if (isExpert) gradient = "bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-600/40";

  return (
    <div className={`h-48 w-full rounded-t-3xl relative overflow-hidden ${gradient}`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(DEFAULT_USER);
  const [isExpert, setIsExpert] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [avatar, setAvatar] = useState(user.avatar);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userType = localStorage.getItem('toupee_auth');
    if (userType === 'expert') {
        setIsExpert(true);
        setActiveTab('dashboard');
        setUser({
            ...DEFAULT_USER,
            name: "Dr. Test Account",
            handle: "@sys_validator",
            email: "123@456.com",
            tier: UserTier.SUPERNOVA,
            avatar: "https://placehold.co/400x400/10b981/FFF?text=TEST",
        });
    }
  }, []);

  const TABS = isExpert 
    ? [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'schedule', label: 'Schedule' },
        { id: 'columns', label: 'Columns' },
        { id: 'community', label: 'Community' },
        { id: 'settings', label: 'Settings' }
      ]
    : [
        { id: 'overview', label: 'Overview' },
        { id: 'activity', label: 'Activity' },
        { id: 'billing', label: 'Billing' },
        { id: 'settings', label: 'Settings' }
      ];

  const handleLogout = () => {
      localStorage.removeItem('toupee_auth');
      navigate('/login');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="bg-dark-800 rounded-3xl border border-dark-700 shadow-xl overflow-hidden relative group">
        <div className="relative group/banner">
            <TierBanner tier={user.tier} isExpert={isExpert} />
            <button 
                onClick={() => bannerInputRef.current?.click()}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md flex items-center gap-2 border border-white/10 opacity-0 group-hover/banner:opacity-100 transition-all"
            >
                <Camera className="w-4 h-4" /> Edit Cover
            </button>
            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" />
        </div>
        
        <div className="px-8 pb-0 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
            <div className="relative group/avatar">
              <img 
                src={avatar} 
                alt={user.name} 
                className={`w-32 h-32 rounded-3xl border-4 shadow-2xl bg-dark-900 object-cover ${isExpert ? 'border-emerald-500/50' : 'border-dark-800'}`}
              />
              <div className="absolute -bottom-2 -right-2 bg-dark-900 rounded-xl p-1.5 border border-dark-700 shadow-lg">
                 {isExpert ? <ShieldCheck className="w-5 h-5 text-emerald-500" /> : <User className="w-5 h-5 text-brand-blue" />}
              </div>
            </div>
            
            <div className="flex-1 mb-2">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                {isExpert ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                        Verified Expert
                    </span>
                ) : (
                    <TierBadge tier={user.tier} />
                )}
              </div>
              <p className="text-slate-300 font-medium">{user.handle}</p>
            </div>

            <div className="flex gap-4 mb-2 md:mb-0">
               {!isExpert && (
                   <>
                        <div className="text-center bg-dark-900/50 p-3 rounded-2xl border border-dark-700 backdrop-blur-sm">
                            <div className="text-lg font-bold text-white">{user.stats.reputation}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Reputation</div>
                        </div>
                   </>
               )}
               <button 
                  onClick={() => setActiveTab('settings')}
                  className="h-full px-4 bg-dark-700 text-slate-300 rounded-2xl hover:bg-dark-600 border border-dark-600 transition-colors" 
               >
                  <Settings className="w-5 h-5" />
               </button>
               <button 
                  onClick={handleLogout}
                  className="h-full px-4 bg-dark-900 text-red-400 rounded-2xl border border-dark-700 hover:border-red-500/50 hover:bg-red-500/10 transition-colors flex items-center justify-center"
                >
                  <LogOut className="w-5 h-5" />
               </button>
            </div>
          </div>

          <div className="flex gap-8 border-b border-dark-700 overflow-x-auto">
            {TABS.map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 font-semibold transition-colors border-b-2 capitalize whitespace-nowrap ${
                        activeTab === tab.id 
                        ? (isExpert ? 'border-emerald-500 text-emerald-500' : 'border-brand-blue text-brand-blue') 
                        : 'border-transparent text-slate-300 hover:text-white'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
          </div>
        </div>
      </div>

      <div className="animate-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 relative overflow-hidden">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                            <Layers className="w-5 h-5 text-brand-blue" />
                            Current System Blueprint
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Base Material</div>
                                <div className="text-slate-200 font-medium">{user.systemSpecs.base}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`rounded-2xl border p-6 ${user.tier === UserTier.GALAXY ? 'bg-gradient-to-b from-indigo-900/50 to-dark-800 border-brand-purple/30' : 'bg-dark-800 border-dark-700'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Membership</h3>
                            <TierBadge tier={user.tier} />
                        </div>
                        <div className="mb-6">
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Current Coordinate</div>
                            <div className={`text-2xl font-bold ${user.tier === UserTier.GALAXY ? 'text-brand-purple' : user.tier === UserTier.SUPERNOVA ? 'text-amber-500' : 'text-white'}`}>
                                {user.tier}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Renews Oct 12, 2023</div>
                        </div>
                        <button className="w-full py-2 bg-brand-purple hover:bg-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors">
                            Manage Subscription
                        </button>
                    </div>
                </div>
            </div>
          )}
      </div>
    </div>
  );
};
