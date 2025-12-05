import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { TopicPage } from './pages/TopicPage';
import { ArticlePage } from './pages/ArticlePage';
import { ConsultationsPage } from './pages/ConsultationsPage';
import { MembershipPage } from './pages/MembershipPage';
import { ForumPage } from './pages/ForumPage';
import { CreateDiscussionPage } from './pages/CreateDiscussionPage';
import { ProfilePage } from './pages/ProfilePage';
import { ExpertsPage } from './pages/ExpertsPage';
import { ExpertProfilePage } from './pages/ExpertProfilePage';
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
import { AdminArticles } from './pages/admin/AdminArticles';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminYouTubeCrawler } from './pages/admin/AdminYouTubeCrawler';
import { AiAssistant } from './components/AiAssistant';
import { Menu, Search, Bell, User, LogIn, LogOut, Crown, Rocket } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showGovernanceModal, setShowGovernanceModal] = useState(true);
  const [highlightGovernance, setHighlightGovernance] = useState(false);

  const handleCloseGovernance = () => {
    setShowGovernanceModal(false);
    // Open sidebar on mobile so they can see the highlight
    setIsSidebarOpen(true);
    // Trigger highlight animation
    setHighlightGovernance(true);
    // Remove highlight after 3 seconds
    setTimeout(() => setHighlightGovernance(false), 3000);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex text-slate-300 font-sans">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        highlightGovernance={highlightGovernance}
      />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Governance Modal Overlay */}
      {showGovernanceModal && (
        <GovernanceModal onClose={handleCloseGovernance} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-dark-900 border-b border-dark-700 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center text-slate-400 bg-dark-800 px-3 py-2 rounded-xl border border-dark-700 w-64 focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue transition-all">
              <Search className="w-4 h-4 mr-2" />
              <input 
                type="text" 
                placeholder="Search topics..." 
                className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-brand-blue rounded-full border-2 border-dark-900"></span>
            </button>
            
            {/* User Dropdown Menu */}
            <div className="relative group py-2">
                <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple p-[2px] cursor-pointer hover:scale-105 transition-transform block">
                    <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center overflow-hidden">
                        <img src="https://placehold.co/100x100/333/fff?text=ME" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </button>

                {/* Dropdown Content */}
                <div className="absolute right-0 top-full mt-0 pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-dark-800 border border-dark-700 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5">
                        <div className="p-4 border-b border-dark-700 bg-dark-900/50">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-white font-bold text-sm">Alex Mercer</p>
                                <p className="text-slate-500 text-xs">@amercer_diy</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {/* Subscription Badge */}
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-brand-purple/10 border border-brand-purple/20 text-[10px] font-bold text-brand-purple uppercase tracking-wider">
                                    <Crown className="w-3 h-3" /> Quantum
                                </div>
                                {/* Forum Level Badge */}
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-bold text-yellow-500 uppercase tracking-wider">
                                    <Rocket className="w-3 h-3" /> Lvl 3
                                </div>
                            </div>
                        </div>
                        <div className="p-2 space-y-1">
                            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white rounded-lg transition-colors">
                                <User className="w-4 h-4" /> My Profile
                            </Link>
                            <Link to="/login" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white rounded-lg transition-colors">
                                <LogIn className="w-4 h-4" /> Login
                            </Link>
                            <div className="h-px bg-dark-700 my-1"></div>
                            <Link to="/login" className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors">
                                <LogOut className="w-4 h-4" /> Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      <AiAssistant />
    </div>
  );
};

// Extracted App Routes for cleanliness and Layout wrapping
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forum" element={<ForumPage />} />
      <Route path="/forum/new" element={<CreateDiscussionPage />} />
      <Route path="/lab" element={<LabPage />} />
      <Route path="/news" element={<IndustryNewsPage />} />
      <Route path="/knowledge-map" element={<KnowledgeMapPage />} />
      <Route path="/kb/glossary" element={<GlossaryPage />} />
      
      {/* Updated KB Routes */}
      <Route path="/kb/:categoryId" element={<CategoryPage />} />
      <Route path="/kb/:categoryId/:topicId" element={<TopicPage />} />
      <Route path="/kb/:categoryId/:topicId/:articleId" element={<ArticlePage />} />
      
      <Route path="/consultations" element={<ConsultationsPage />} />
      <Route path="/membership" element={<MembershipPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/experts" element={<ExpertsPage />} />
      <Route path="/experts/:id" element={<ExpertProfilePage />} />
      <Route path="/governance" element={<GovernancePage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/experts" element={<AdminExperts />} />
      <Route path="/admin/articles" element={<AdminArticles />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/youtube-crawler" element={<AdminYouTubeCrawler />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <DataProvider>
        <Routes>
          {/* Public Routes (No Layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected/App Routes (Wrapped in Layout) */}
          <Route path="/*" element={
            <Layout>
              <AppRoutes />
            </Layout>
          } />
        </Routes>
      </DataProvider>
    </HashRouter>
  );
};

export default App;
