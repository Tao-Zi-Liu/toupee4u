import React from 'react';
import { NavLink } from 'react-router-dom';
import { KB_CATEGORIES } from '../constants';
import { Home, Users, BookOpen, Crown, Plus, MessageSquare, Microscope, FlaskConical } from 'lucide-react';

export const Sidebar: React.FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => {
  const baseClasses = `fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 text-slate-400 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`;
  const translateClass = isOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <aside className={`${baseClasses} ${translateClass} flex flex-col border-r border-dark-700`}>
      <div className="h-16 flex items-center px-6 border-b border-dark-700">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
          </div>
          Toupee4U
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-8">
        
        <button className="w-full bg-gradient-to-r from-brand-blue to-blue-600 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            New Post
        </button>

        <div>
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Community & Tools
          </p>
          <nav className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-dark-800 text-brand-blue' : 'text-slate-400 hover:bg-dark-800 hover:text-white'
                }`
              }
            >
              <Home className="mr-3 h-5 w-5" />
              Overview
            </NavLink>
            <NavLink
              to="/lab"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-dark-800 text-brand-blue' : 'text-slate-400 hover:bg-dark-800 hover:text-white'
                }`
              }
            >
              <FlaskConical className="mr-3 h-5 w-5" />
              <span className="flex-1">The Lab</span>
              <span className="ml-2 text-[10px] font-bold uppercase bg-brand-purple/20 text-brand-purple px-1.5 py-0.5 rounded border border-brand-purple/30">Beta</span>
            </NavLink>
            <NavLink
              to="/forum"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-dark-800 text-brand-blue' : 'text-slate-400 hover:bg-dark-800 hover:text-white'
                }`
              }
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              Forums
            </NavLink>
            <NavLink
              to="/experts"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-dark-800 text-brand-blue' : 'text-slate-400 hover:bg-dark-800 hover:text-white'
                }`
              }
            >
              <Microscope className="mr-3 h-5 w-5" />
              Research Team
            </NavLink>
          </nav>
        </div>

        <div>
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Knowledge Base
          </p>
          <nav className="space-y-1">
            {KB_CATEGORIES.map((category) => (
              <NavLink
                key={category.id}
                to={`/kb/${category.id}`}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-dark-800 text-brand-blue' : 'text-slate-400 hover:bg-dark-800 hover:text-white'
                  }`
                }
              >
                <category.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">{category.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Premium Services
          </p>
          <nav className="space-y-1">
            <NavLink
              to="/consultations"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-dark-800 text-brand-blue' : 'text-slate-400 hover:bg-dark-800 hover:text-white'
                }`
              }
            >
              <Users className="mr-3 h-5 w-5" />
              Expert Consultations
            </NavLink>
             <NavLink
              to="/membership"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-dark-800 text-brand-blue' : 'text-slate-400 hover:bg-dark-800 hover:text-white'
                }`
              }
            >
              <Crown className="mr-3 h-5 w-5" />
              Membership Tiers
            </NavLink>
          </nav>
        </div>
      </div>
    </aside>
  );
};
