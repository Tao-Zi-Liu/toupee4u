
import React, { useState, useRef, useEffect } from 'react';
// Fixing react-router-dom named imports
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
  Users 
} from 'lucide-react';

// Default Mock User Data
const DEFAULT_USER = {
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

// --- MOCK DATA FOR EXPERTS ---
const EXPERT_APPOINTMENTS = [
    { id: 1, client: "Michael Chen", type: "Troubleshooting", time: "Today, 2:00 PM EST", status: "Upcoming", duration: "30 min" },
    { id: 2, client: "Sarah Jones", type: "Style Design", time: "Today, 4:30 PM EST", status: "Upcoming", duration: "45 min" },
    { id: 3, client: "David Smith", type: "Emergency", time: "Tomorrow, 10:00 AM EST", status: "Confirmed", duration: "15 min" }
];

const EXPERT_ARTICLES = [
    { id: 1, title: "The pH Balance of Scalp Protectors", status: "Published", views: "12.5k", date: "Oct 12, 2023" },
    { id: 2, title: "Adhesive Toxicity Reports Q3", status: "Draft", views: "-", date: "Last Edited: 2 hours ago" },
    { id: 3, title: "Polymer Degradation in UV Light", status: "Review", views: "-", date: "Submitted: Yesterday" }
];

const EXPERT_FLAGS = [
    { id: 1, topic: "Dangerous advice regarding superglue", reporter: "Automod", time: "1 hour ago", status: "Pending" },
    { id: 2, topic: "Harassment in 'Newbie' thread", reporter: "User Report", time: "3 hours ago", status: "Pending" }
];

// Activity Log Data
const ACTIVITY_LOG = [
  { id: 1, type: 'reply', title: 'Replied to "Hairline lifting after gym?"', context: 'Troubleshooting', time: '2 hours ago', points: '+5', icon: MessageSquare, color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20' },
  { id: 2, type: 'badge', title: 'Earned Badge: "Adhesive Expert"', context: 'Achievements', time: '1 day ago', points: '+50', icon: Award, color: 'text-brand-purple bg-brand-purple/10 border-brand-purple/20' },
  { id: 3, type: 'post', title: 'Published "Guide: Waterproofing for Swimmers"', context: 'Tutorials', time: '3 days ago', points: '+25', icon: Edit3, color: 'text-green-500 bg-green-500/10 border-green-500/20' },
  { id: 4, type: 'like', title: 'Liked "Walker Tape Review"', context: 'Community', time: '5 days ago', points: null, icon: ThumbsUp, color: 'text-slate-300 bg-dark-800 border-dark-700' },
  { id: 5, type: 'sub', title: 'Upgraded to Quantum State', context: 'Billing', time: '1 week ago', points: null, icon: Crown, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' }
];

// Billing History
const BILLING_HISTORY = [
  { id: 'INV-2023-001', date: 'Oct 01, 2023', description: 'Quantum State Membership - Monthly', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2023-002', date: 'Sep 01, 2023', description: 'Quantum State Membership - Monthly', amount: '$29.00', status: 'Paid' }
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" /> Observer
        </span>
      );
  }
};

const TierBanner: React.FC<{ tier: UserTier; isExpert?: boolean }> = ({ tier, isExpert }) => {
  let gradient = "bg-gradient-to-r from-slate-800 to-slate-900";
  if (tier === UserTier.KINETIC) gradient = "bg-gradient-to-r from-blue-900 to-brand-blue/40";
  if (tier === UserTier.QUANTUM) gradient = "bg-gradient-to-r from-indigo-900 via-purple-900 to-brand-purple/40";
  if (isExpert) gradient = "bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-600/40";

  return (
    <div className={`h-48 w-full rounded-t-3xl relative overflow-hidden ${gradient}`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      {isExpert && (
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/50"></div>
      )}
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(DEFAULT_USER);
  const [isExpert, setIsExpert] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Profile Image State
  const [banner, setBanner] = useState<string | null>(null);
  const [avatar, setAvatar] = useState(user.avatar);
  
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatar(user.avatar);
  }, [user]);

  // Check login state on mount
  useEffect(() => {
    const userType = localStorage.getItem('toupee_auth');
    if (userType === 'expert') {
        setIsExpert(true);
        setActiveTab('dashboard'); // Expert default tab
        setUser({
            name: "Dr. Test Account",
            handle: "@sys_validator",
            email: "123@456.com",
            tier: UserTier.QUANTUM,
            avatar: "https://placehold.co/400x400/10b981/FFF?text=TEST",
            stats: {
                joined: "Oct 2023",
                reputation: 9999,
                posts: 120,
                solutions: 85
            },
            systemSpecs: {
                base: "Reference Node",
                density: "Standard",
                color: "#000",
                contour: "Universal",
                adhesive: "N/A",
                lifestyle: "System Admin"
            }
        });
    }
  }, []);

  // Tabs Configuration
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
                <TierBanner tier={user.tier} isExpert={isExpert} />
            )}
            
            <button 
                onClick={() => bannerInputRef.current?.click()}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md flex items-center gap-2 border border-white/10 opacity-0 group-hover/banner:opacity-100 transition-all transform translate-y-2 group-hover/banner:translate-y-0"
            >
                <Camera className="w-4 h-4" /> Edit Cover
            </button>
            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" />
        </div>
        
        <div className="px-8 pb-0 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
            
            {/* Avatar Section */}
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
              <p className="text-slate-300 font-medium">{user.handle} {isExpert && "• System Validator"}</p>
            </div>

            <div className="flex gap-4 mb-2 md:mb-0">
               {!isExpert && (
                   <>
                        <div className="text-center bg-dark-900/50 p-3 rounded-2xl border border-dark-700 backdrop-blur-sm">
                            <div className="text-lg font-bold text-white">{user.stats.reputation}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Reputation</div>
                        </div>
                        <div className="text-center bg-dark-900/50 p-3 rounded-2xl border border-dark-700 backdrop-blur-sm">
                            <div className="text-lg font-bold text-white">{user.stats.posts}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Posts</div>
                        </div>
                   </>
               )}
               {isExpert && (
                   <div className="flex items-center gap-2 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                       <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Available</span>
                   </div>
               )}
               <button 
                  onClick={() => setActiveTab('settings')}
                  className="h-full px-4 bg-dark-700 text-slate-300 rounded-2xl hover:bg-dark-600 border border-dark-600 transition-colors" 
                  title="Settings"
               >
                  <Settings className="w-5 h-5" />
               </button>
               <button 
                  onClick={handleLogout}
                  className="h-full px-4 bg-dark-900 text-red-400 rounded-2xl border border-dark-700 hover:border-red-500/50 hover:bg-red-500/10 transition-colors flex items-center justify-center" title="Logout"
                >
                  <LogOut className="w-5 h-5" />
               </button>
            </div>
          </div>

          {/* Functional Tabs */}
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

      {/* --- EXPERT CONTENT SWITCHER --- */}
      {isExpert ? (
          <div className="animate-in slide-in-from-bottom-2 duration-500">
              
              {/* DASHBOARD TAB */}
              {activeTab === 'dashboard' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 flex flex-col justify-between h-40">
                          <div className="flex justify-between items-start">
                              <div>
                                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Consultations</p>
                                  <h3 className="text-3xl font-bold text-white mt-2">1,240</h3>
                              </div>
                              <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue">
                                  <Users className="w-6 h-6" />
                              </div>
                          </div>
                          <div className="text-xs text-slate-300">+12 this week</div>
                      </div>

                      <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 flex flex-col justify-between h-40">
                          <div className="flex justify-between items-start">
                              <div>
                                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Revenue (Mo)</p>
                                  <h3 className="text-3xl font-bold text-white mt-2">$4,250</h3>
                              </div>
                              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                  <DollarSign className="w-6 h-6" />
                              </div>
                          </div>
                          <div className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                              <Activity className="w-3 h-3" /> +8.5% vs last month
                          </div>
                      </div>

                      <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 flex flex-col justify-between h-40">
                          <div className="flex justify-between items-start">
                              <div>
                                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Article Reads</p>
                                  <h3 className="text-3xl font-bold text-white mt-2">45.2k</h3>
                              </div>
                              <div className="p-3 bg-brand-purple/10 rounded-xl text-brand-purple">
                                  <FileText className="w-6 h-6" />
                              </div>
                          </div>
                          <div className="text-xs text-slate-300">Top: "Adhesive Chemistry"</div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-900 to-dark-800 p-6 rounded-2xl border border-emerald-500/30 flex flex-col justify-between h-40 relative overflow-hidden group cursor-pointer hover:border-emerald-500/50 transition-colors">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                          <div className="relative z-10">
                              <div className="flex justify-between items-start mb-2">
                                  <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider">Next Session</p>
                                  <span className="animate-pulse w-2 h-2 bg-emerald-400 rounded-full"></span>
                              </div>
                              <h3 className="text-lg font-bold text-white">Michael Chen</h3>
                              <p className="text-emerald-200 text-sm">Troubleshooting • 2:00 PM</p>
                          </div>
                          <button className="relative z-10 w-full py-2 bg-white text-emerald-900 font-bold text-xs rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors">
                              <Video className="w-3 h-3" /> Join Waiting Room
                          </button>
                      </div>
                  </div>
              )}

              {/* SCHEDULE TAB */}
              {activeTab === 'schedule' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                          <div className="flex items-center justify-between">
                              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                  <CalendarCheck className="w-5 h-5 text-brand-blue" /> Upcoming Sessions
                              </h2>
                              <button className="text-xs bg-dark-800 hover:bg-dark-700 border border-dark-600 px-3 py-1.5 rounded-lg text-slate-300 transition-colors">
                                  Sync Google Calendar
                              </button>
                          </div>

                          <div className="space-y-3">
                              {EXPERT_APPOINTMENTS.map(apt => (
                                  <div key={apt.id} className="bg-dark-800 border border-dark-700 rounded-xl p-5 flex items-center justify-between group hover:border-brand-blue/50 transition-colors">
                                      <div className="flex items-center gap-4">
                                          <div className="bg-dark-900 p-3 rounded-xl border border-dark-600 text-slate-300 group-hover:text-white transition-colors">
                                              <Clock className="w-6 h-6" />
                                          </div>
                                          <div>
                                              <h3 className="font-bold text-white">{apt.client}</h3>
                                              <div className="flex items-center gap-2 text-xs text-slate-300">
                                                  <span className="bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded border border-brand-blue/20">{apt.type}</span>
                                                  <span>•</span>
                                                  <span>{apt.time}</span>
                                                  <span>•</span>
                                                  <span>{apt.duration}</span>
                                              </div>
                                          </div>
                                      </div>
                                      <button className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                                          Join Call
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Availability Sidebar */}
                      <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                          <h3 className="font-bold text-white mb-4">Availability Settings</h3>
                          <div className="space-y-4">
                              <div className="flex justify-between items-center text-sm">
                                  <span className="text-slate-300">Instant Book</span>
                                  <div className="w-10 h-5 bg-emerald-500/20 rounded-full border border-emerald-500/30 relative cursor-pointer">
                                      <div className="w-3 h-3 bg-emerald-500 rounded-full absolute top-1 right-1"></div>
                                  </div>
                              </div>
                              <div className="border-t border-dark-700 pt-4">
                                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Weekly Blocks</p>
                                  <div className="space-y-2 text-sm text-slate-300">
                                      <div className="flex justify-between"><span>Mon - Fri</span> <span>09:00 - 17:00</span></div>
                                      <div className="flex justify-between"><span>Saturday</span> <span>10:00 - 14:00</span></div>
                                      <div className="flex justify-between text-slate-600"><span>Sunday</span> <span>Closed</span></div>
                                  </div>
                                  <button className="w-full mt-4 py-2 bg-dark-900 border border-dark-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-colors">
                                      Edit Hours
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* ARTICLES (COLUMNS) TAB */}
              {activeTab === 'columns' && (
                  <div className="space-y-6">
                      <div className="flex justify-between items-center">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                              <PenTool className="w-5 h-5 text-brand-purple" /> Knowledge Base Contributions
                          </h2>
                          <button className="px-4 py-2 bg-brand-purple hover:bg-purple-600 text-white rounded-lg flex items-center gap-2 font-bold text-sm shadow-lg shadow-purple-500/20 transition-colors">
                              <PlusCircle className="w-4 h-4" /> Write New Column
                          </button>
                      </div>

                      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-dark-900 text-xs text-slate-500 uppercase font-bold tracking-wider">
                                  <tr>
                                      <th className="p-5">Title</th>
                                      <th className="p-5">Status</th>
                                      <th className="p-5">Views</th>
                                      <th className="p-5">Date</th>
                                      <th className="p-5 text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-dark-700">
                                  {EXPERT_ARTICLES.map(article => (
                                      <tr key={article.id} className="hover:bg-dark-700/50 transition-colors">
                                          <td className="p-5 font-bold text-white">{article.title}</td>
                                          <td className="p-5">
                                              <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${
                                                  article.status === 'Published' 
                                                  ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                  : article.status === 'Draft' 
                                                      ? 'bg-dark-900 text-slate-300 border-dark-600'
                                                      : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                              }`}>
                                                  {article.status}
                                              </span>
                                          </td>
                                          <td className="p-5 text-sm text-slate-300">{article.views}</td>
                                          <td className="p-5 text-sm text-slate-500">{article.date}</td>
                                          <td className="p-5 text-right">
                                              <div className="flex items-center justify-end gap-2">
                                                  <button className="p-2 text-slate-300 hover:text-white hover:bg-dark-600 rounded-lg"><Eye className="w-4 h-4" /></button>
                                                  <button className="p-2 text-slate-300 hover:text-brand-blue hover:bg-dark-600 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {/* COMMUNITY TAB */}
              {activeTab === 'community' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                          <h3 className="font-bold text-white flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-yellow-500" /> Moderation Queue
                          </h3>
                          <div className="space-y-3">
                              {EXPERT_FLAGS.map(flag => (
                                  <div key={flag.id} className="bg-dark-800 border border-dark-700 rounded-xl p-4 hover:border-yellow-500/30 transition-colors">
                                      <div className="flex justify-between items-start mb-2">
                                          <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">Flagged</span>
                                          <span className="text-xs text-slate-500">{flag.time}</span>
                                      </div>
                                      <p className="text-sm font-medium text-white mb-1">"{flag.topic}"</p>
                                      <p className="text-xs text-slate-300 mb-3">Reported by: {flag.reporter}</p>
                                      <div className="flex gap-2">
                                          <button className="flex-1 py-1.5 bg-dark-900 border border-dark-600 hover:bg-dark-700 text-xs font-bold text-slate-300 rounded-lg transition-colors">Dismiss</button>
                                          <button className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-xs font-bold text-white rounded-lg transition-colors">Action</button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="space-y-4">
                          <h3 className="font-bold text-white flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-brand-blue" /> Direct Questions
                          </h3>
                          <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 text-center text-slate-500">
                              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-dark-600" />
                              <p>You're all caught up!</p>
                              <p className="text-xs mt-1">No pending direct mentions in the forum.</p>
                          </div>
                      </div>
                  </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                  <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 space-y-6">
                      <h2 className="text-xl font-bold text-white">Account Settings</h2>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Name</label>
                              <input type="text" value={user.name} className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none" readOnly />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                              <input type="email" value={user.email} className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none" readOnly />
                          </div>
                          <div className="pt-4">
                              <button className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl">Save Changes</button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      ) : (

      /* --- STANDARD USER CONTENT --- */
          <div className="animate-in slide-in-from-bottom-2 duration-500">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                            
                            <div className="mt-6 flex items-start gap-3 text-xs text-slate-300 bg-brand-blue/5 p-3 rounded-lg border border-brand-blue/10">
                            <div className="mt-0.5"><Activity className="w-4 h-4 text-brand-blue" /></div>
                            <p>
                                The "Truth Engine" AI uses these specs to provide personalized advice. For example, it knows <strong>Ghost Bond</strong> (Water-based) requires different removal protocols than acrylics for your <strong>Lace</strong> base.
                            </p>
                            </div>
                        </div>

                        <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                            <h3 className="text-lg font-bold text-white mb-6">Recent Highlights</h3>
                            <div className="space-y-6">
                            {ACTIVITY_LOG.slice(0, 2).map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${item.color}`}>
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <div className="w-px h-full bg-dark-700 my-2"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm">{item.title}</h4>
                                        <p className="text-slate-300 text-xs mt-1 mb-2">{item.time} in <span className="text-brand-blue">{item.context}</span></p>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className={`rounded-2xl border p-6 ${user.tier === UserTier.QUANTUM ? 'bg-gradient-to-b from-indigo-900/50 to-dark-800 border-brand-purple/30' : 'bg-dark-800 border-dark-700'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">Membership</h3>
                                <Crown className={`w-5 h-5 ${user.tier === UserTier.QUANTUM ? 'text-brand-purple' : 'text-slate-300'}`} />
                            </div>
                            
                            <div className="mb-6">
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Current Tier</div>
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
                                    <button 
                                        onClick={() => setActiveTab('billing')}
                                        className="w-full mt-4 py-2 bg-dark-900 hover:bg-dark-950 text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-brand-purple/20 transition-colors"
                                    >
                                        Manage Subscription
                                    </button>
                                </div>
                            ) : (
                                <button className="w-full py-2 bg-brand-purple hover:bg-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-purple-900/20 transition-colors">
                                    Upgrade Now
                                </button>
                            )}
                        </div>
                        
                        <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                            <h3 className="text-sm font-bold text-white mb-4">Saved Articles</h3>
                            <div className="space-y-3">
                                <a href="#" className="block p-3 rounded-xl bg-dark-900 border border-dark-700 hover:border-brand-blue transition-colors group">
                                    <div className="text-xs text-slate-500 mb-1">Foundations</div>
                                    <div className="text-sm font-medium text-slate-300 group-hover:text-white truncate">How to achieve an undetectable hairline</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {activeTab === 'billing' && (
                  <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                      <h2 className="text-xl font-bold text-white mb-6">Billing History</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-900 text-xs text-slate-500 uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {BILLING_HISTORY.map(inv => (
                                    <tr key={inv.id}>
                                        <td className="p-4 text-slate-300 text-sm">{inv.date}</td>
                                        <td className="p-4 text-slate-300 text-sm">{inv.description}</td>
                                        <td className="p-4 text-white font-bold text-sm">{inv.amount}</td>
                                        <td className="p-4"><span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">{inv.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                      </div>
                  </div>
              )}

              {/* Settings for User */}
              {activeTab === 'settings' && (
                  <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 space-y-6">
                      <h2 className="text-xl font-bold text-white">Account Settings</h2>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Name</label>
                              <input type="text" value={user.name} className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none" readOnly />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                              <input type="email" value={user.email} className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none" readOnly />
                          </div>
                          <div className="pt-4">
                              <button className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl">Save Changes</button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      )}

    </div>
  );
};
