
import React from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Bell, Search, Shield, Zap, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const handleTerminate = () => {
      localStorage.removeItem('staff_session_token');
      localStorage.removeItem('toupee_auth');
      navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-300 font-sans selection:bg-emerald-500 selection:text-black">
      <AdminSidebar onLogout={handleTerminate} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-black/80 backdrop-blur-md border-b border-dark-800 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Root Directorate</span>
            </div>
            <div className="h-4 w-px bg-dark-700"></div>
            <div className="flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer text-xs gap-2">
                <Search className="w-4 h-4" />
                <span className="hidden md:inline font-medium">Search system registry (⌘K)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-4 mr-4">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">System Uptime</p>
                    <p className="text-xs font-mono text-emerald-500">99.999%</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Active Nodes</p>
                    <p className="text-xs font-mono text-white">12/12</p>
                </div>
             </div>
             <button className="p-2 text-slate-500 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-black"></span>
             </button>
             <button 
                onClick={handleTerminate}
                className="w-8 h-8 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                title="Log Out"
             >
                <LogOut className="w-4 h-4" />
             </button>
          </div>
        </header>

        <main className="flex-1 p-8 md:p-12 overflow-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/[0.03] via-transparent to-transparent">
           <div className="max-w-7xl mx-auto">
                {children}
           </div>
        </main>
      </div>
    </div>
  );
};
