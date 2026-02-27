
import { ForYouPage } from './pages/ForYouPage';
import { onAuthChange, getCompleteUserProfile, getCurrentUser } from './services/auth.service';
import { subscribeToNotifications, markAsRead, markAllAsRead } from './services/notification.service';
import { UserRole, GalaxyLevel, MembershipTier } from './types';
import { dailyCheckin, getUserXPStats } from './services/xp.service';
import { logoutUser } from './services/auth.service';
import { AiAssistant } from './components/AiAssistant';
import { AccessGate } from './components/AccessGate';
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { TopicPage } from './pages/TopicPage';
import { ArticlePage } from './pages/ArticlePage';
import { ConsultationsPage } from './pages/ConsultationsPage';
import { MembershipPage } from './pages/MembershipPage';
import { ForumPage } from './pages/ForumPage';
import { PostDetailPage } from './pages/PostDetailPage'; 
import { CreateDiscussionPage } from './pages/CreateDiscussionPage';
import { ProfilePage } from './pages/ProfilePage';
import { ExpertsPage } from './pages/ExpertsPage';
import { ExpertProfilePage } from './pages/ExpertProfilePage';
import { ExpertApplicationPage } from './pages/ExpertApplicationPage';
import { LabPage } from './pages/LabPage';
import { GovernancePage } from './pages/GovernancePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { KnowledgeMapPage } from './pages/KnowledgeMapPage';
import { IndustryNewsPage } from './pages/IndustryNewsPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { GovernanceModal } from './components/GovernanceModal';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminExperts } from './pages/admin/AdminExperts';
import { AdminKB } from './pages/admin/AdminKB';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminYouTubeCrawler } from './pages/admin/AdminYouTubeCrawler';
import { AdminDeployment } from './pages/admin/AdminDeployment';
import { AdminPortal } from './pages/admin/AdminPortal';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminUsers } from './pages/admin/AdminUsers';
import { CommandPalette } from './components/CommandPalette';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Menu, Search, Bell, User, LogIn, LogOut, Crown, Rocket, ShieldAlert } from 'lucide-react';
import { SelectRolePage } from './pages/SelectRolePage';
import { VoyagerQuizPage } from './pages/VoyagerQuizPage';
import { ProfessionalSetupPage } from './pages/ProfessionalSetupPage';
import { KBMigration } from './components/KBMigration';

// SECRET URL FOR STAFF ONLY
const SECRET_ADMIN_URL = "/terminal/x92-quantum-override";

// STAFF GATE PROTECTION
const StaffGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isStaff = localStorage.getItem('staff_session_token') === 'authorized_master';
  
  if (!isStaff) {
    return <Navigate to={SECRET_ADMIN_URL} replace />;
  }

  return <AdminPortal>{children}</AdminPortal>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showGovernanceModal, setShowGovernanceModal] = useState(true);
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState({
    name: "Loading...",
    handle: "@loading",
    avatar: "https://placehold.co/100x100/333/fff?text=?",
    isExpert: false,
    role: 'VOYAGER' as UserRole,
    galaxyLevel: 'NEBULA' as GalaxyLevel,
    membershipTier: 'free' as MembershipTier
});
  const [checkinModal, setCheckinModal] = useState<{
    show: boolean;
    xpEarned: number;
    consecutiveDays: number;
    isZombie: boolean;
    currentXP: number;
  }>({ show: false, xpEarned: 0, consecutiveDays: 0, isZombie: false, currentXP: 0 });

useEffect(() => {
    // 监听Firebase认证状态
    const unsubscribe = onAuthChange(async (firebaseUser) => {
        if (firebaseUser) {
            // 用户已登录，从Firestore获取完整档案
            const completeProfile = await getCompleteUserProfile(firebaseUser.uid);
            
            if (completeProfile) {
                setUserProfile({
                    name: completeProfile.displayName,
                    handle: `@${completeProfile.displayName.toLowerCase().replace(/\s/g, '_')}`,
                    avatar: completeProfile.photoURL,
                    isExpert: completeProfile.role === 'ARCHITECT' || completeProfile.role === 'SOURCE',
                    role: completeProfile.role,
                    galaxyLevel: completeProfile.galaxyLevel,
                    membershipTier: completeProfile.membershipTier
                });

                // 登录时触发每日签到
                try {
                    const checkin = await dailyCheckin(firebaseUser.uid);
                    const stats = await getUserXPStats(firebaseUser.uid);
                    if (checkin.success) {
                        // 今天首次登录，显示签到弹窗
                        setCheckinModal({
                            show: true,
                            xpEarned: checkin.xpEarned,
                            consecutiveDays: checkin.consecutiveDays,
                            isZombie: checkin.isZombie,
                            currentXP: stats?.availableXp ?? 0
                        });
                    }
                } catch (e) {
                    // 签到失败不影响登录流程
                }
            }
        } else {
            // 用户未登录
            setUserProfile({
                name: "Guest",
                handle: "@guest",
                avatar: "https://placehold.co/100x100/333/fff?text=G",
                isExpert: false,
                role: 'VOYAGER',
                galaxyLevel: 'NEBULA',
                membershipTier: 'free'
            });
        }
    });
    return () => unsubscribe();
}, []);


            // 监听通知（依赖 userProfile）
              useEffect(() => {
                const currentUser = getCurrentUser();
                
                if (currentUser && userProfile.name !== "Loading..." && userProfile.name !== "Guest") {
                  const unsubscribe = subscribeToNotifications(currentUser.uid, (notifs) => {
                    setNotifications(notifs);
                    const unread = notifs.filter(n => !n.isRead).length;
                    setUnreadCount(unread);
                  });
                  
                  return () => {
                    unsubscribe();
                  };
                } else {
                }
              }, [userProfile]);  // 依赖 userProfile，当用户登录后重新执行

  const handleCloseGovernance = () => {
    // Simply close the modal without triggering sidebar side effects
    setShowGovernanceModal(false);
  };

  const handleLogout = async () => {
  try {
    await logoutUser();
    localStorage.removeItem('toupee_auth');
    window.location.href = '#/login';
    window.location.reload();
  } catch (error) {
    console.error('Logout error:', error);
    // 即使失败也清除本地状态
    localStorage.removeItem('toupee_auth');
    window.location.href = '#/login';
    window.location.reload();
  }
};

  const triggerSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
  };

  // If it's an admin route, we completely bypass this public layout
  if (location.pathname.startsWith('/admin')) {
      return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-dark-900 flex text-slate-300 font-sans">
      {/* 每日签到弹窗 */}
      {checkinModal.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-dark-800 border-2 border-brand-blue/30 rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl animate-pulse-once">
            <div className="text-5xl mb-4">
              {checkinModal.isZombie ? '😴' : checkinModal.consecutiveDays >= 7 ? '🔥' : '⚡'}
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              {checkinModal.isZombie ? 'Welcome Back!' : 'Daily Check-in!'}
            </h3>
            {checkinModal.isZombie ? (
              <p className="text-slate-400 text-sm mb-4">
                Good to see you again! Start engaging to earn XP on your next check-in.
              </p>
            ) : (
              <>
                <p className="text-slate-400 text-sm mb-2">
                  You earned <span className="text-brand-blue font-bold text-lg">+{checkinModal.xpEarned} XP</span>
                </p>
                {checkinModal.consecutiveDays > 1 && (
                  <p className="text-amber-400 text-sm font-medium mb-2">
                    🔥 {checkinModal.consecutiveDays} day streak!
                  </p>
                )}
                <p className="text-slate-500 text-xs mb-4">
                  Total XP: <span className="text-white font-bold">{checkinModal.currentXP}</span>
                </p>
              </>
            )}
            <button
              onClick={() => setCheckinModal(prev => ({ ...prev, show: false }))}
              className="w-full py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-colors text-sm"
            >
              Let's Go!
            </button>
          </div>
        </div>
      )}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {showGovernanceModal && (
        <GovernanceModal onClose={handleCloseGovernance} />
      )}

      <CommandPalette />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-dark-900 border-b border-dark-700 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-slate-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center text-slate-300 bg-dark-800 px-3 py-2 rounded-xl border border-dark-700 w-64 focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue transition-all cursor-pointer group" onClick={triggerSearch}>
              <Search className="w-4 h-4 mr-2" />
              <div className="text-sm w-full text-slate-500 font-medium">Search protocols...</div>
              <div className="flex items-center gap-1 ml-auto">
                 <span className="px-1 py-0.5 rounded bg-dark-900 text-[10px] font-bold text-slate-600 border border-dark-700 group-hover:text-brand-blue transition-colors">⌘K</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Button */}
            <button 
              onClick={triggerSearch}
              className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-slate-300 hover:text-white relative transition-colors p-2"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Panel - 稍后添加完整面板 */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl z-50 max-h-[500px] overflow-hidden">
                    <div className="p-4 border-b border-dark-700 flex items-center justify-between">
                      <h3 className="font-bold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={async () => {
                            const currentUser = getCurrentUser();
                            if (currentUser) {
                              await markAllAsRead(currentUser.uid);
                            }
                          }}
                          className="text-xs text-brand-blue hover:text-blue-400"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    
                    <div className="overflow-y-auto max-h-[400px]">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-dark-700 hover:bg-dark-700 transition-colors cursor-pointer ${
                              !notif.isRead ? 'bg-dark-900' : ''
                            }`}
                            onClick={async () => {
                              await markAsRead(notif.id);
                              setShowNotifications(false);
                              window.location.href = `#/forum/post/${notif.targetId}`;
                            }}
                          >
                            <div className="flex gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {notif.senderName?.split(' ').map((n: string) => n[0]).join('') || '?'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-300">
                                  <span className="font-semibold text-white">{notif.senderName}</span>
                                  {notif.type === 'comment' && ' commented on '}
                                  {notif.type === 'like' && ' liked '}
                                  <span className="text-brand-blue">{notif.targetTitle}</span>
                                </p>
                                {notif.content && (
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                    {notif.content}
                                  </p>
                                )}
                                <p className="text-xs text-slate-600 mt-1">
                                  {notif.createdAt?.toDate ? new Date(notif.createdAt.toDate()).toLocaleString() : 'Just now'}
                                </p>
                              </div>
                              {!notif.isRead && (
                                <div className="w-2 h-2 bg-brand-blue rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            
            <div className="relative group py-2">
                <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple p-[2px] cursor-pointer hover:scale-105 transition-transform block">
                    <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center overflow-hidden">
                        <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </button>

                <div className="absolute right-0 top-full mt-0 pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-dark-800 border border-dark-700 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5">
                        <div className="p-4 border-b border-dark-700 bg-dark-900/50">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-white font-bold text-sm">{userProfile.name}</p>
                                <p className="text-slate-500 text-xs">{userProfile.handle}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                  userProfile.galaxyLevel === 'SUPERNOVA' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                  userProfile.galaxyLevel === 'GALAXY' ? 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple' :
                                  userProfile.galaxyLevel === 'NOVA' ? 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue' :
                                  'bg-slate-700/50 border-slate-600 text-slate-400'
                                }`}>
                                    <Crown className="w-3 h-3" /> {userProfile.galaxyLevel}
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-bold text-yellow-500 uppercase tracking-wider">
                                    <Rocket className="w-3 h-3" /> {userProfile.role}
                                </div>
                            </div>
                        </div>
                        <div className="p-2 space-y-1">
                            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white rounded-lg transition-colors">
                                <User className="w-4 h-4" /> My Profile
                            </Link>
                            {!userProfile.isExpert && (
                                <Link to="/login" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white rounded-lg transition-colors">
                                    <LogIn className="w-4 h-4" /> Switch Account
                                </Link>
                            )}
                            <div className="h-px bg-dark-700 my-1"></div>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      <MobileBottomNav />
      <AiAssistant />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forum" element={<ForumPage />} />
      <Route path="/forum/post/:postId" element={<PostDetailPage />} />
      <Route path="/forum/new" element={<CreateDiscussionPage />} />
      <Route path="/lab" element={<LabPage />} />
      <Route path="/news" element={<IndustryNewsPage />} />
      <Route path="/knowledge-map" element={<KnowledgeMapPage />} />
      <Route path="/kb/glossary" element={<GlossaryPage />} />
      <Route path="/kb/:categoryId" element={<CategoryPage />} />
      <Route path="/kb/:categoryId/:topicId" element={<TopicPage />} />
      <Route path="/kb/:categoryId/:topicId/:articleId" element={<ArticlePage />} />
      <Route path="/consultations" element={<ConsultationsPage />} />
      <Route path="/membership" element={<MembershipPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/for-you" element={<ForYouPage />} />
      <Route path="/experts" element={<ExpertsPage />} />
      <Route path="/experts/apply" element={<ExpertApplicationPage />} />
      <Route path="/experts/:id" element={<ExpertProfilePage />} />
      <Route path="/governance" element={<GovernancePage />} />
      <Route path="/kb-migrate" element={<KBMigration />} />
      
      {/* PROTECTED ADMIN ROUTES */}
      <Route path="/admin" element={<StaffGate><AdminDashboard /></StaffGate>} />
      <Route path="/admin/experts" element={<StaffGate><AdminExperts /></StaffGate>} />
      <Route path="/admin/articles" element={<StaffGate><AdminKB /></StaffGate>} />
      <Route path="/admin/settings" element={<StaffGate><AdminSettings /></StaffGate>} />
      <Route path="/admin/youtube-crawler" element={<StaffGate><AdminYouTubeCrawler /></StaffGate>} />
      <Route path="/admin/deployment" element={<StaffGate><AdminDeployment /></StaffGate>} />
      <Route path="/admin/analytics" element={<StaffGate><AdminAnalytics /></StaffGate>} />
      <Route path="/admin/users" element={<StaffGate><AdminUsers /></StaffGate>} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/onboarding/voyager-quiz" element={<VoyagerQuizPage />} />
      <Route path="/onboarding/professional-setup" element={<ProfessionalSetupPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <DataProvider>
        <AccessGate>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/onboarding/select-role" element={<SelectRolePage />} />
            
            {/* SECRET LOGIN PATH */}
            <Route path="/terminal/x92-quantum-override" element={<LoginPage isStaffTerminal={true} />} />

            <Route path="/*" element={
              <Layout>
                <AppRoutes />
              </Layout>
            } />
          </Routes>
        </AccessGate>
      </DataProvider>
    </HashRouter>
  );
};

export default App;