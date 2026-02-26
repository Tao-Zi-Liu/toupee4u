
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard,Users,FileText,ShieldCheck,BarChart3,Settings,Rocket,LogOut,ChevronLeft,Cpu,Database,Globe} from 'lucide-react';

interface AdminSidebarProps {
    onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  return (
    <aside className="w-64 bg-black border-r border-dark-700 h-screen sticky top-0 flex flex-col z-50">
      <div className="h-16 flex items-center px-6 border-b border-dark-800">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Cpu className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-white tracking-widest text-xs uppercase">Staff Portal</span>
        </Link>
      </div>

      <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <h3 className="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">Operations</h3>
          <nav className="space-y-1">
            <AdminNavItem to="/admin" icon={LayoutDashboard} label="Mission Control" end />
            <AdminNavItem to="/admin/analytics" icon={BarChart3} label="Analytics" />
            <AdminNavItem to="/admin/deployment" icon={Rocket} label="Live Console" />
          </nav>
        </div>

        <div>
          <h3 className="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">Management</h3>
          <nav className="space-y-1">
            <AdminNavItem to="/admin/users" icon={Users} label="User Registry" />
            <AdminNavItem to="/admin/experts" icon={ShieldCheck} label="Expert Directorate" />
            <AdminNavItem to="/admin/articles" icon={FileText} label="Content Matrix" />
            <AdminNavItem to="/admin/youtube-crawler" icon={Database} label="Signal Scraper" />
          </nav>
        </div>

        <div>
          <h3 className="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">System</h3>
          <nav className="space-y-1">
            <AdminNavItem to="/admin/settings" icon={Settings} label="Infrastructure" />
            <AdminNavItem to="/" icon={Globe} label="Public Site" />
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-dark-800">
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold text-[10px]">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Admin_Root</p>
              <p className="text-[10px] text-slate-500">Level 4 Access</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
          >
            <LogOut className="w-3 h-3" /> Terminate Session
          </button>
        </div>
      </div>
    </aside>
  );
};

const AdminNavItem: React.FC<{ to: string; icon: any; label: string; end?: boolean }> = ({ to, icon: Icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => 
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
        isActive 
          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
          : 'text-slate-400 hover:bg-dark-800 hover:text-white border border-transparent'
      }`
    }
  >
    <Icon className="w-4 h-4" />
    <span className="tracking-wide">{label}</span>
  </NavLink>
);
