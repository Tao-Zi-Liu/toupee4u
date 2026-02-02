
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { KB_CATEGORIES } from '../constants';
import { 
  Home, 
  Users, 
  Plus, 
  MessageSquare, 
  Microscope,
  FlaskConical, 
  Shield, 
  Scale, 
  Newspaper, 
  ChevronLeft,
  ChevronRight, 
  Crown, 
  BookA 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  highlightGovernance?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, highlightGovernance }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const baseClasses = `fixed inset-y-0 left-0 z-50 bg-dark-900 text-slate-400 transform transition-all duration-300 ease-in-out border-r border-dark-700 flex flex-col`;
  const mobileClasses = `${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64`;
  const desktopClasses = `lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderKbNav = () => {
    const items = [];
    for (let i = 0; i < KB_CATEGORIES.length; i++) {
      const category = KB_CATEGORIES[i];
      items.push(
        <NavItem 
          key={category.id}
          to={`/kb/${category.id}`} 
          icon={category.icon} 
          label={category.name} 
          isCollapsed={isCollapsed} 
        />
      );
    }
    return items;
  };

  return (
    <aside className={`${baseClasses} ${mobileClasses} ${desktopClasses}`}>
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-dark-700 transition-all duration-300`}>
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white overflow-hidden whitespace-nowrap">
          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-brand-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
          </div>
          <span className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            Toupee4U
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6 custom-scrollbar">
        <Link 
          to="/forum/new" 
          className={`w-full bg-gradient-to-r from-brand-blue to-blue-600 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap ${isCollapsed ? 'p-3 aspect-square' : 'py-3 px-4'}`}
          title="New Post"
        >
            <Plus className="w-5 h-5 flex-shrink-0" />
            <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
              New Post
            </span>
        </Link>

        <div>
          {!isCollapsed && (
            <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 animate-in fade-in duration-300">
              Community
            </p>
          )}
          <nav className="space-y-1">
            <NavItem to="/" icon={Home} label="Toupee For You" isCollapsed={isCollapsed} />
            <NavItem to="/news" icon={Newspaper} label="Industry News" isCollapsed={isCollapsed} />
            <NavItem to="/lab" icon={FlaskConical} label="The Lab" isCollapsed={isCollapsed} badge="Beta" />
            <NavItem to="/forum" icon={MessageSquare} label="Forums" isCollapsed={isCollapsed} />
            <NavItem to="/experts" icon={Microscope} label="Contributing Experts" isCollapsed={isCollapsed} />
            <NavItem to="/governance" icon={Scale} label="Governance" isCollapsed={isCollapsed} highlight={highlightGovernance} />
          </nav>
        </div>

        <div>
          {!isCollapsed && (
            <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 animate-in fade-in duration-300">
              Knowledge Base
            </p>
          )}
          <nav className="space-y-1">
            {renderKbNav()}
            <NavItem to="/kb/glossary" icon={BookA} label="Glossary" isCollapsed={isCollapsed} />
          </nav>
        </div>

        <div>
          {!isCollapsed && (
            <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 animate-in fade-in duration-300">
              Premium
            </p>
          )}
          <nav className="space-y-1">
            <NavItem to="/consultations" icon={Users} label="Consultations" isCollapsed={isCollapsed} />
            <NavItem to="/membership" icon={Crown} label="Membership" isCollapsed={isCollapsed} />
          </nav>
        </div>

        {/* ADMIN PANEL LINK REMOVED FOR SECURITY */}
      </div>

      <div className="hidden lg:flex p-4 border-t border-dark-700">
        <button 
          onClick={toggleCollapse}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'} p-2 rounded-lg text-slate-400 hover:bg-dark-800 hover:text-white transition-colors`}
        >
           {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  isCollapsed: boolean;
  badge?: string;
  highlight?: boolean;
}> = ({ to, icon: Icon, label, isCollapsed, badge, highlight }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden whitespace-nowrap ${
          isActive 
            ? 'bg-dark-800 text-brand-blue' 
            : 'text-slate-400 hover:bg-dark-800 hover:text-white'
        } ${highlight ? 'bg-brand-blue/20 text-white ring-2 ring-brand-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]' : ''} ${isCollapsed ? 'justify-center' : ''}`
      }
      title={isCollapsed ? label : ''}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isCollapsed ? '' : 'mr-3'}`} />
      
      <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 flex-1'}`}>
        {label}
      </span>

      {badge && !isCollapsed && (
         <span className="ml-2 text-[10px] font-bold uppercase bg-brand-purple/20 text-brand-purple px-1.5 py-0.5 rounded border border-brand-purple/30">
            {badge}
         </span>
      )}
      
      {highlight && !isCollapsed && (
        <span className="ml-2 w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
      )}
    </NavLink>
  );
};
