import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, ShieldCheck, BarChart3,
  Settings, Rocket, LogOut, Cpu, Database, Globe, Newspaper,Video
} from 'lucide-react';

interface AdminSidebarProps {
  onLogout?: () => void;
  collapsed?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  onLogout,
  collapsed = false,
}) => {
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-black border-r border-dark-700 h-screen sticky top-0 flex flex-col z-50 transition-all duration-300 overflow-hidden`}>

      <div className="h-16 flex items-center px-4 border-b border-dark-800 flex-shrink-0">
        <Link to="/admin" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Cpu className="w-5 h-5 text-black" />
          </div>
          {!collapsed && (
            <span className="font-bold text-white tracking-widest text-xs uppercase truncate">
              Staff Portal
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 py-6 px-2 space-y-6 overflow-y-auto custom-scrollbar">
        <div>
          {!collapsed && <h3 className="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-3">Operations</h3>}
          <nav className="space-y-1">
            <AdminNavItem to="/admin" icon={LayoutDashboard} label="Mission Control" collapsed={collapsed} end />
            <AdminNavItem to="/admin/analytics" icon={BarChart3} label="Analytics" collapsed={collapsed} />
            <AdminNavItem to="/admin/deployment" icon={Rocket} label="Live Console" collapsed={collapsed} />
          </nav>
        </div>

        <div className="border-t border-dark-800 mx-2" />

        <div>
          {!collapsed && <h3 className="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-3">Management</h3>}
          <nav className="space-y-1">
            <AdminNavItem to="/admin/users" icon={Users} label="User Registry" collapsed={collapsed} />
            <AdminNavItem to="/admin/experts" icon={ShieldCheck} label="Expert Directorate" collapsed={collapsed} />
            <AdminNavItem to="/admin/articles" icon={FileText} label="Content Matrix" collapsed={collapsed} />
            <AdminNavItem to="/admin/news" icon={Newspaper} label="News Desk" collapsed={collapsed} />
            <AdminNavItem to="/admin/youtube-crawler" icon={Database} label="Signal Scraper" collapsed={collapsed} />
            <AdminNavItem to="/admin/videos" icon={Video} label="Video Desk" collapsed={collapsed} />
          </nav>
        </div>

        <div className="border-t border-dark-800 mx-2" />

        <div>
          {!collapsed && <h3 className="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-3">System</h3>}
          <nav className="space-y-1">
            <AdminNavItem to="/admin/settings" icon={Settings} label="Infrastructure" collapsed={collapsed} />
            <AdminNavItem to="/" icon={Globe} label="Public Site" collapsed={collapsed} />
          </nav>
        </div>
      </div>

      <div className="p-3 border-t border-dark-800 flex-shrink-0">
        {collapsed ? (
          <button onClick={onLogout} className="w-full flex items-center justify-center py-2 text-red-500 hover:text-red-400 transition-colors" title="Terminate Session">
            <LogOut className="w-4 h-4" />
          </button>
        ) : (
          <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 flex-shrink-0 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold text-[10px]">AD</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">Admin_Root</p>
                <p className="text-[10px] text-slate-500">Level 4 Access</p>
              </div>
            </div>
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest">
              <LogOut className="w-3 h-3" /> Terminate Session
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

const AdminNavItem: React.FC<{ to: string; icon: any; label: string; collapsed?: boolean; end?: boolean }> = ({ to, icon: Icon, label, collapsed, end }) => (
  <NavLink
    to={to}
    end={end}
    title={collapsed ? label : undefined}
    className={({ isActive }) =>
      `flex items-center gap-3 px-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${collapsed ? 'justify-center' : ''} ${
        isActive
          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
          : 'text-slate-400 hover:bg-dark-800 hover:text-white border border-transparent'
      }`
    }
  >
    <Icon className="w-4 h-4 flex-shrink-0" />
    {!collapsed && <span className="tracking-wide truncate">{label}</span>}
  </NavLink>
);
