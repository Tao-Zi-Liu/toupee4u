
import { getPosts, getRelativeTime } from '../services/post.service';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserTier, CompleteUserProfile } from '../types';
import { getCurrentUser, getCompleteUserProfile, logoutUser, updateUserProfile } from '../services/auth.service';
import {
  Shield, Zap, Crown, Settings, Edit3, Droplet, Layers, Scissors, Activity, Award,
  LogOut, MessageSquare, ThumbsUp, CheckCircle, Clock, AlertTriangle, User, Camera, FileText, Video, CalendarCheck, PlusCircle, Eye, DollarSign, PenTool, ShieldCheck, Users, Orbit, Sparkles,
  Bookmark as BookmarkIcon
} from 'lucide-react';
import { uploadPostImage } from '../services/image.service';
import { getUserBookmarks, Bookmark as BookmarkRecord } from '../services/bookmark.service';
import { getUserReadingStats } from '../services/progress.service';
import { useData } from '../contexts/DataContext';
import { BookOpen, UserPlus, UserCheck, UserMinus } from 'lucide-react';
import { followUser, unfollowUser, checkIsFollowing, getFollowing, getFollowers, FollowUser } from '../services/follow.service';
import { getUserXPStats, getXPHistory, dailyCheckin, checkDiscountEligibility } from '../services/xp.service';
import { UserXPStats, XPRecord, XP_POST_THRESHOLD, XP_DISCOUNT_THRESHOLDS } from '../types';

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
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [readingStats, setReadingStats] = useState<any>(null);
  const [readingStatsLoading, setReadingStatsLoading] = useState(false);
  const { categories } = useData();
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [followCounts, setFollowCounts] = useState({ followingCount: 0, followersCount: 0 });
  const [followLoading, setFollowLoading] = useState(false);
  const [xpStats, setXpStats] = useState<UserXPStats | null>(null);
  const [xpHistory, setXpHistory] = useState<XPRecord[]>([]);
  const [xpLoading, setXpLoading] = useState(false);
  const [checkinDone, setCheckinDone] = useState(false);
  const [discountEligibility, setDiscountEligibility] = useState<any>(null);
  const [followTab, setFollowTab] = useState<'following' | 'followers'>('following');

  const loadXPData = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    setXpLoading(true);
    try {
      const [stats, history, discount] = await Promise.all([
        getUserXPStats(currentUser.uid),
        getXPHistory(currentUser.uid, 15),
        checkDiscountEligibility(currentUser.uid)
      ]);
      setXpStats(stats);
      setXpHistory(history);
      setDiscountEligibility(discount);
    } catch (error) {
      console.error("Failed to load XP data:", error);
    } finally {
      setXpLoading(false);
    }
  };

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
          // 初始化Settings state
          setEditDisplayName(completeProfile.displayName);
          // Fixed syntax error: added missing closing parenthesis and addressed missing bio property on User
          setEditBio(completeProfile.bio || '');
          
          // 如果是专家，默认显示dashboard
          if (isExpertUser) {
            setActiveTab('dashboard');
          }
        }
      }
      await loadUserPosts();
      await loadBookmarks();
      await loadReadingStats();
      await loadFollowData();
      await loadXPData();
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
        { id: 'bookmarks', label: 'Saved' },
        { id: 'learning', label: 'Learning' },
        { id: 'following', label: 'Following' },
        { id: 'xp', label: '⚡ XP' },
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

  // 保存个人资料
    const handleSaveProfile = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      
      if (!editDisplayName.trim()) {
        setSettingsError('Display name cannot be empty');
        return;
      }
      
      setSettingsLoading(true);
      setSettingsError('');
      setSettingsSuccess(false);
      
      try {
        await updateUserProfile(currentUser.uid, {
          displayName: editDisplayName.trim(),
          bio: editBio.trim()
        });
        
        // 更新本地状态
        setUser(prev => ({ ...prev, name: editDisplayName.trim() }));
        setSettingsSuccess(true);
        
        setTimeout(() => setSettingsSuccess(false), 3000);
      } catch (error) {
        setSettingsError('Failed to update profile. Please try again.');
      } finally {
        setSettingsLoading(false);
      }
    };

    // 加载用户帖子
      const loadUserPosts = async () => {
        const currentUser = getCurrentUser();
        if (!currentUser) return;
        
        setPostsLoading(true);
        try {
          const allPosts = await getPosts(50);
          const filtered = allPosts.filter(post => post.authorId === currentUser.uid);
          setUserPosts(filtered);
        } catch (error) {
          console.error('Failed to load user posts:', error);
        } finally {
          setPostsLoading(false);
        }
      };

      const loadBookmarks = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      
      setBookmarksLoading(true);
      try {
        const userBookmarks = await getUserBookmarks(currentUser.uid);
        setBookmarks(userBookmarks);
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      } finally {
        setBookmarksLoading(false);
      }
    };
    const loadReadingStats = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      setReadingStatsLoading(true);
      try {
        const stats = await getUserReadingStats(currentUser.uid, categories as any);
        setReadingStats(stats);
      } catch (error) {
        console.error('Failed to load reading stats:', error);
      } finally {
        setReadingStatsLoading(false);
      }
    };

    const loadFollowData = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      try {
        const [followingList, followersList] = await Promise.all([
          getFollowing(currentUser.uid),
          getFollowers(currentUser.uid)
        ]);
        setFollowing(followingList);
        setFollowers(followersList);
        setFollowCounts({
          followingCount: followingList.length,
          followersCount: followersList.length
        });
      } catch (error) {
        console.error('Failed to load follow data:', error);
      }
    };

    // 上传头像
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      
      setAvatarUploading(true);
      
      try {
        const result = await uploadPostImage(currentUser.uid, file);
        
        await updateUserProfile(currentUser.uid, {
          photoURL: result.url
        });
        
        setAvatar(result.url);
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        setSettingsError('Failed to upload avatar. Please try again.');
      } finally {
        setAvatarUploading(false);
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
                          <div className="text-lg font-bold text-white">{xpStats?.availableXp ?? user.stats.reputation}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">XP</div>
                      </div>
                      <button
                        onClick={() => setActiveTab('following')}
                        className="text-center bg-dark-900/50 p-3 rounded-2xl border border-dark-700 backdrop-blur-sm hover:border-brand-blue/50 transition-colors"
                      >
                        <div className="text-lg font-bold text-white">{followCounts.followingCount}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Following</div>
                      </button>
                      <button
                        onClick={() => setActiveTab('following')}
                        className="text-center bg-dark-900/50 p-3 rounded-2xl border border-dark-700 backdrop-blur-sm hover:border-brand-blue/50 transition-colors"
                      >
                        <div className="text-lg font-bold text-white">{followCounts.followersCount}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Followers</div>
                      </button>
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

                    {/* XP 积分卡片 */}
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">⚡ XP Points</h3>
                        <button
                          onClick={() => setActiveTab("xp")}
                          className="text-xs text-brand-blue hover:text-blue-400 font-medium transition-colors"
                        >View History</button>
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{xpStats?.availableXp ?? 0}</div>
                      <div className="text-xs text-slate-500 mb-3">of {XP_POST_THRESHOLD} needed to post</div>
                      <div className="h-2 bg-dark-900 rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${(xpStats?.availableXp ?? 0) >= XP_POST_THRESHOLD ? "bg-green-500" : "bg-brand-blue"}`}
                          style={{ width: `${Math.min(100, ((xpStats?.availableXp ?? 0) / XP_POST_THRESHOLD) * 100)}%` }}
                        />
                      </div>
                      {(xpStats?.availableXp ?? 0) >= XP_POST_THRESHOLD ? (
                        <p className="text-green-400 text-xs font-medium">✓ Posting unlocked</p>
                      ) : (
                        <p className="text-slate-500 text-xs">Browse, like, comment & read KB articles to earn XP.</p>
                      )}
                      {discountEligibility?.novaDiscount && (
                        <div className="mt-3 p-2 bg-brand-blue/10 border border-brand-blue/20 rounded-lg text-xs text-brand-blue font-medium">🎉 500 XP reached! Nova 50% discount available.</div>
                      )}
                      {discountEligibility?.galaxyDiscount && (
                        <div className="mt-2 p-2 bg-brand-purple/10 border border-brand-purple/20 rounded-lg text-xs text-brand-purple font-medium">🚀 2000 XP reached! Galaxy 50% discount available.</div>
                      )}
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              
              {/* 头像设置 */}
              <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-brand-blue" /> Profile Photo
                </h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-2xl border-2 border-dark-600 object-cover"
                    />
                    {avatarUploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                        <div className="text-white text-xs">Uploading...</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={avatarUploading}
                      className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {avatarUploading ? 'Uploading...' : 'Change Photo'}
                    </button>
                    <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* 基本信息设置 */}
              <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-brand-blue" /> Basic Information
                </h3>
                
                {settingsError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {settingsError}
                  </div>
                )}
                
                {settingsSuccess && (
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Profile updated successfully!
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:border-brand-blue focus:outline-none transition-colors"
                      placeholder="Your display name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Bio
                    </label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={4}
                      className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:border-brand-blue focus:outline-none transition-colors resize-none"
                      placeholder="Tell the community about yourself..."
                    />
                    <p className="text-xs text-slate-500 mt-1">{editBio.length}/200 characters</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full bg-dark-900/50 border border-dark-700 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveProfile}
                    disabled={settingsLoading}
                    className="px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {settingsLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* 危险区域 */}
              <div className="bg-dark-800 rounded-2xl border border-red-500/20 p-6">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">Log out of your account</p>
                    <p className="text-slate-500 text-xs mt-1">You will need to log in again to access your account</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </div>

            </div>
          )}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">My Posts</h3>
                <span className="text-sm text-slate-500">{userPosts.length} posts</span>
              </div>
              
              {postsLoading ? (
                <div className="text-center py-12 text-slate-500">
                  Loading posts...
                </div>
              ) : userPosts.length === 0 ? (
                <div className="bg-dark-800 rounded-2xl border border-dark-700 border-dashed p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No posts yet</p>
                  <p className="text-slate-500 text-sm mt-1">Start a discussion in the forum!</p>
                  <button
                    onClick={() => navigate('/forum/new')}
                    className="mt-4 px-6 py-2 bg-brand-blue hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Create Post
                  </button>
                </div>
              ) : (
                userPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/forum/post/${post.id}`)}
                    className="bg-dark-800 rounded-xl border border-dark-700 hover:border-brand-blue/50 p-5 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold group-hover:text-brand-blue transition-colors truncate">
                          {post.title}
                        </h4>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs px-2 py-1 rounded bg-dark-900 text-slate-400 border border-dark-600">
                            {post.category}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getRelativeTime(post.createdAt)}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" /> {post.likes || 0}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> {post.comments || 0}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {post.views || 0}
                          </span>
                        </div>
                      </div>
                      {post.images && post.images.length > 0 && (
                        <img
                          src={post.images[0]}
                          alt="Post thumbnail"
                          className="w-16 h-16 rounded-lg object-cover border border-dark-600 flex-shrink-0"
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Saved Posts</h3>
                <span className="text-sm text-slate-500">{bookmarks.length} saved</span>
              </div>
              
              {bookmarksLoading ? (
                <div className="text-center py-12 text-slate-500">
                  Loading saved posts...
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="bg-dark-800 rounded-2xl border border-dark-700 border-dashed p-12 text-center">
                  <BookmarkIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No saved posts yet</p>
                  <p className="text-slate-500 text-sm mt-1">Save posts to read them later!</p>
                  <button
                    onClick={() => navigate('/forum')}
                    className="mt-4 px-6 py-2 bg-brand-blue hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Browse Forum
                  </button>
                </div>
              ) : (
                bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    onClick={() => navigate(`/forum/post/${bookmark.postId}`)}
                    className="bg-dark-800 rounded-xl border border-dark-700 hover:border-amber-500/50 p-5 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold group-hover:text-amber-500 transition-colors truncate">
                          {bookmark.postTitle}
                        </h4>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                          {bookmark.postExcerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs px-2 py-1 rounded bg-dark-900 text-slate-400 border border-dark-600">
                            {bookmark.postCategory}
                          </span>
                          <span className="text-xs text-slate-500">
                            by {bookmark.postAuthorName}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getRelativeTime(bookmark.createdAt)}
                          </span>
                        </div>
                      </div>
                      {bookmark.postImages && bookmark.postImages.length > 0 && (
                        <img
                          src={bookmark.postImages[0]}
                          alt="Post thumbnail"
                          className="w-16 h-16 rounded-lg object-cover border border-dark-600 flex-shrink-0"
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">Learning Progress</h3>
                {readingStats && (
                  <span className="text-sm text-slate-500">
                    {readingStats.totalArticlesRead} articles completed
                  </span>
                )}
              </div>

              {readingStatsLoading ? (
                <div className="text-center py-12 text-slate-500">Loading stats...</div>
              ) : !readingStats ? (
                <div className="bg-dark-800 rounded-2xl border border-dark-700 border-dashed p-12 text-center">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No reading activity yet</p>
                  <p className="text-slate-500 text-sm mt-1">Start reading articles in the Knowledge Base!</p>
                  <button
                    onClick={() => navigate('/knowledge-map')}
                    className="mt-4 px-6 py-2 bg-brand-blue hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Go to Knowledge Base
                  </button>
                </div>
              ) : (
                <>
                  {/* 总体统计 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dark-800 rounded-xl border border-dark-700 p-5 text-center">
                      <p className="text-3xl font-bold text-white">{readingStats.totalArticlesRead}</p>
                      <p className="text-slate-500 text-sm mt-1">Articles Read</p>
                    </div>
                    <div className="bg-dark-800 rounded-xl border border-dark-700 p-5 text-center">
                      <p className="text-3xl font-bold text-white">
                        {readingStats.totalReadTimeSeconds < 60
                          ? `${readingStats.totalReadTimeSeconds}s`
                          : `${Math.round(readingStats.totalReadTimeSeconds / 60)}m`}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">Time Reading</p>
                    </div>
                  </div>

                  {/* 分类进度 */}
                  <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 space-y-5">
                    <h4 className="text-white font-bold">Category Progress</h4>
                    {readingStats.categoryProgress.map((cat: any) => (
                      <div key={cat.categoryId}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-300 text-sm font-medium">{cat.categoryName}</span>
                          <span className="text-slate-500 text-xs">
                            {cat.readArticles}/{cat.totalArticles} · {cat.percentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-blue rounded-full transition-all duration-700"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {readingStats.categoryProgress.length === 0 && (
                      <p className="text-slate-500 text-sm text-center py-4">No progress yet</p>
                    )}
                  </div>

                  {/* 最近阅读 */}
                  {readingStats.recentlyRead.length > 0 && (
                    <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                      <h4 className="text-white font-bold mb-4">Recently Read</h4>
                      <div className="space-y-3">
                        {readingStats.recentlyRead.map((item: any) => (
                          <div
                            key={item.articleId}
                            onClick={() => navigate(`/kb/${item.categoryId}/${item.topicId}/${item.articleId}`)}
                            className="flex items-center gap-3 p-3 bg-dark-900 rounded-xl border border-dark-700 hover:border-brand-blue/50 cursor-pointer transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate group-hover:text-brand-blue transition-colors">
                                {item.articleTitle}
                              </p>
                              <p className="text-slate-500 text-xs mt-0.5">{item.categoryName}</p>
                            </div>
                            <span className="text-slate-600 text-xs flex-shrink-0">
                              {item.readTimeSeconds < 60
                                ? `${item.readTimeSeconds}s`
                                : `${Math.round(item.readTimeSeconds / 60)}m`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="space-y-6">
              {/* 切换关注/粉丝 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFollowTab('following')}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${followTab === 'following' ? 'bg-brand-blue text-white' : 'bg-dark-800 text-slate-400 hover:text-white border border-dark-700'}`}
                >
                  Following ({followCounts.followingCount})
                </button>
                <button
                  onClick={() => setFollowTab('followers')}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${followTab === 'followers' ? 'bg-brand-blue text-white' : 'bg-dark-800 text-slate-400 hover:text-white border border-dark-700'}`}
                >
                  Followers ({followCounts.followersCount})
                </button>
              </div>

              {/* 列表 */}
              <div className="space-y-3">
                {(followTab === 'following' ? following : followers).length === 0 ? (
                  <div className="bg-dark-800 rounded-2xl border border-dark-700 border-dashed p-12 text-center">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">
                      {followTab === 'following' ? 'Not following anyone yet' : 'No followers yet'}
                    </p>
                  </div>
                ) : (
                  (followTab === 'following' ? following : followers).map((u) => (
                    <div key={u.userId} className="flex items-center gap-4 p-4 bg-dark-800 border border-dark-700 rounded-xl hover:border-dark-600 transition-colors">
                      <img
                        src={u.photoURL || `https://placehold.co/40x40/3b82f6/white?text=${u.displayName?.[0] || '?'}`}
                        alt={u.displayName}
                        className="w-10 h-10 rounded-xl object-cover border border-dark-600 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{u.displayName || 'Unknown User'}</p>
                        <p className="text-slate-500 text-xs mt-0.5">@{(u.displayName || 'user').toLowerCase().replace(/\s/g, '_')}</p>
                      </div>
                      {followTab === 'following' && (
                        <button
                          onClick={async () => {
                            const currentUser = getCurrentUser();
                            if (!currentUser) return;
                            setFollowLoading(true);
                            await unfollowUser(currentUser.uid, u.userId);
                            await loadFollowData();
                            setFollowLoading(false);
                          }}
                          disabled={followLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-700 border border-dark-600 text-slate-300 hover:border-red-500/50 hover:text-red-400 rounded-lg text-xs font-medium transition-colors"
                        >
                          <UserMinus className="w-3.5 h-3.5" /> Unfollow
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "xp" && (
            <div className="space-y-6">
              {/* 签到按钮 */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold mb-1">Daily Check-in</h3>
                  <p className="text-slate-500 text-sm">+2 XP · Streak: {xpStats?.consecutiveCheckinDays ?? 0} days</p>
                </div>
                <button
                  onClick={async () => {
                    const currentUser = getCurrentUser();
                    if (!currentUser) return;
                    const result = await dailyCheckin(currentUser.uid);
                    if (result.success) {
                      setCheckinDone(true);
                      await loadXPData();
                    }
                  }}
                  disabled={checkinDone || xpStats?.lastCheckinDate === new Date().toISOString().slice(0,10)}
                  className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-sm"
                >
                  {xpStats?.lastCheckinDate === new Date().toISOString().slice(0,10) ? "✓ Done" : "Check In"}
                </button>
              </div>

              {/* XP 概览 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-bold text-white">{xpStats?.availableXp ?? 0}</div>
                  <div className="text-slate-500 text-xs mt-1">Available XP</div>
                </div>
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-bold text-white">{xpStats?.totalXp ?? 0}</div>
                  <div className="text-slate-500 text-xs mt-1">Total Earned</div>
                </div>
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 text-center">
                  <div className={`text-3xl font-bold ${xpStats?.isFrozen ? "text-red-400" : "text-green-400"}`}>
                    {xpStats?.isFrozen ? "❄️" : "✓"}
                  </div>
                  <div className="text-slate-500 text-xs mt-1">{xpStats?.isFrozen ? "Frozen" : "Active"}</div>
                </div>
              </div>

              {/* 折扣资格 */}
              {(discountEligibility?.novaDiscount || discountEligibility?.galaxyDiscount) && (
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-3">
                  <h4 className="text-white font-bold">🎁 Available Discounts</h4>
                  {discountEligibility?.novaDiscount && (
                    <div className="flex items-center justify-between p-3 bg-brand-blue/10 border border-brand-blue/20 rounded-xl">
                      <div>
                        <p className="text-brand-blue font-semibold text-sm">Nova 50% Off</p>
                        <p className="text-slate-500 text-xs">Reached 500 XP milestone</p>
                      </div>
                      <button onClick={() => navigate("/membership")} className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors">Redeem</button>
                    </div>
                  )}
                  {discountEligibility?.galaxyDiscount && (
                    <div className="flex items-center justify-between p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-xl">
                      <div>
                        <p className="text-brand-purple font-semibold text-sm">Galaxy 50% Off</p>
                        <p className="text-slate-500 text-xs">Reached 2000 XP milestone</p>
                      </div>
                      <button onClick={() => navigate("/membership")} className="px-4 py-2 bg-brand-purple hover:bg-purple-600 text-white text-xs font-bold rounded-lg transition-colors">Redeem</button>
                    </div>
                  )}
                </div>
              )}

              {/* XP 历史 */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                <h4 className="text-white font-bold mb-4">Recent Activity</h4>
                {xpLoading ? (
                  <div className="text-center py-8 text-slate-500">Loading...</div>
                ) : xpHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">No XP activity yet. Start browsing and engaging!</div>
                ) : (
                  <div className="space-y-2">
                    {xpHistory.map((record, i) => (
                      <div key={record.id || i} className="flex items-center justify-between py-2.5 border-b border-dark-700 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                            record.delta > 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                          }`}>
                            {record.delta > 0 ? "+" : ""}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {record.action === "DAILY_CHECKIN" ? "Daily Check-in" :
                               record.action === "VIEW_POST" ? "Viewed Post" :
                               record.action === "LIKE_POST" ? "Liked Post" :
                               record.action === "COMMENT" ? "Posted Comment" :
                               record.action === "READ_KB_ARTICLE" ? "Read KB Article" :
                               record.action === "RECEIVED_LIKE" ? "Received Like" :
                               record.action === "CREATE_POST" ? "Created Post" : record.action}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {record.createdAt?.toDate ? new Date(record.createdAt.toDate()).toLocaleDateString() : "Recently"}
                            </p>
                          </div>
                        </div>
                        <span className={`font-bold text-sm ${record.delta > 0 ? "text-green-400" : "text-red-400"}`}>
                          {record.delta > 0 ? "+" : ""}{record.delta} XP
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

      </div>
    </div>
  );
};  