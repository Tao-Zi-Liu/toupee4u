
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserTier } from '../types';
import { getCurrentUser, getCompleteUserProfile } from '../services/auth.service';
import { CompleteUserProfile } from '../types';
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
import { logoutUser } from '../services/auth.service';

const DEFAULT_USER = {
  name: "Loading...",
  handle: "@loading",
  email: "loading@example.com",
  tier: UserTier.NEBULA,
  avatar: "https://placehold.co/200x200/3b82f6/white?text=?",
  stats: { joined: "Loading...", reputation: 0, posts: 0, solutions: 0 },
  systemSpecs: {
    base: "Not configured",
    density: "Not configured",
    color: "Not configured",
    contour: "Not configured",
    adhesive: "Not configured",
    lifestyle: "Not configured"
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
  const [profile, setProfile] = useState<CompleteUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpert, setIsExpert] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [avatar, setAvatar] = useState(user.avatar);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      const currentUser = getCurrentUser();
      if (currentUser) {
        const completeProfile = await getCompleteUserProfile(currentUser.uid);
        
        if (completeProfile) {
          setProfile(completeProfile);
          
          // 判断是否是专家
          const isExpertUser = completeProfile.role === 'ARCHITECT' || completeProfile.role === 'SOURCE';
          setIsExpert(isExpertUser);
          
          // 映射galaxyLevel到UserTier
          const tierMap = {
            'NEBULA': UserTier.NEBULA,
            'NOVA': UserTier.NOVA,
            'GALAXY': UserTier.GALAXY,
            'SUPERNOVA': UserTier.SUPERNOVA
          };
          
          // 更新用户显示信息
          setUser({
            name: completeProfile.displayName,
            handle: `@${completeProfile.displayName.toLowerCase().replace(/\s/g, '_')}`,
            email: completeProfile.email,
            tier: tierMap[completeProfile.galaxyLevel],
            avatar: completeProfile.photoURL,
            stats: {
              joined: new Date(completeProfile.createdAt?.toDate?.() || completeProfile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              reputation: completeProfile.xp || 0,
              posts: 0, // 可以后续从其他collection查询
              solutions: 0
            },
            systemSpecs: {
              base: completeProfile.voyagerProfile?.hairPattern || "Not configured",
              density: "Not configured",
              color: "Not configured",
              contour: "Not configured",
              adhesive: "Not configured",
              lifestyle: completeProfile.voyagerProfile?.activityLevel || "Not configured"
            }
          });
          
          setAvatar(completeProfile.photoURL);
          
          // 如果是专家，默认显示dashboard
          if (isExpertUser) {
            setActiveTab('dashboard');
          }
        }
      }
      setLoading(false);
    }
    
    loadProfile();
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

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('toupee_auth');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

    // 如果未登录，重定向到登录页
    if (!loading && !profile) {
      navigate('/login');
      return null;
    }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading profile...</div>
      </div>
    );
  }

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
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">XP</div>
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
                                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Hair Pattern</div>
                                <div className="text-slate-200 font-medium">{user.systemSpecs.base}</div>
                            </div>
                            <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-700">
                                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Activity Level</div>
                                <div className="text-slate-200 font-medium">{user.systemSpecs.lifestyle}</div>
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
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Current Level</div>
                            <div className={`text-2xl font-bold ${user.tier === UserTier.GALAXY ? 'text-brand-purple' : user.tier === UserTier.SUPERNOVA ? 'text-amber-500' : 'text-white'}`}>
                                {user.tier}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Member since {user.stats.joined}</div>
                        </div>
                        <button 
                          onClick={() => navigate('/membership')}
                          className="w-full py-2 bg-brand-purple hover:bg-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                        >
                          Upgrade Membership
                        </button>
                    </div>
                </div>
            </div>
          )}
      </div>
    </div>
  );
};