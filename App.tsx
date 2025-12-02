import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { ConsultationsPage } from './pages/ConsultationsPage';
import { MembershipPage } from './pages/MembershipPage';
import { ForumPage } from './pages/ForumPage';
import { ProfilePage } from './pages/ProfilePage';
import { ExpertsPage } from './pages/ExpertsPage';
import { ExpertProfilePage } from './pages/ExpertProfilePage';
import { LabPage } from './pages/LabPage';
import { AiAssistant } from './components/AiAssistant';
import { Menu, Search, Bell } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900 flex text-slate-300 font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
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
            
            <Link to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple p-[2px] cursor-pointer hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center overflow-hidden">
                    <img src="https://placehold.co/100x100/333/fff?text=ME" alt="Profile" className="w-full h-full object-cover" />
                </div>
            </Link>
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

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/kb/:categoryId" element={<CategoryPage />} />
          <Route path="/consultations" element={<ConsultationsPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/experts" element={<ExpertsPage />} />
          <Route path="/experts/:id" element={<ExpertProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
