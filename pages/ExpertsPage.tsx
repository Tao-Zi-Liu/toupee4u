import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Search, Filter, ArrowUpRight, Star, Hexagon, Zap, Clock, ShieldCheck, Calendar } from 'lucide-react';

export const ExpertsPage: React.FC = () => {
  const { experts } = useData();
  const [filter, setFilter] = useState('All');

  const filteredExperts = filter === 'All' 
    ? experts 
    : experts.filter(e => e.role.includes(filter) || e.specialties.some(s => s.includes(filter)));

  const getGradient = (theme: string) => {
    switch(theme) {
      case 'purple': return 'from-purple-500 to-indigo-600';
      case 'blue': return 'from-blue-500 to-cyan-600';
      case 'teal': return 'from-teal-500 to-emerald-600';
      case 'pink': return 'from-pink-500 to-rose-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getThemeTextColor = (theme: string) => {
    switch(theme) {
      case 'purple': return 'text-purple-400';
      case 'blue': return 'text-blue-400';
      case 'teal': return 'text-teal-400';
      case 'pink': return 'text-pink-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-12">
      {/* Header with improved typography and spacing */}
      <div className="relative border-b border-dark-700 pb-8 overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Hexagon className="w-64 h-64 text-brand-blue" strokeWidth={0.5} />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-[10px] font-bold uppercase tracking-widest">
                  Scientific Directorate
               </span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Contributing Experts</h1>
            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
               Access specialized intelligence. Our network consists of verified chemists, engineers, and master stylists dedicated to the physics of hair replacement.
            </p>
         </div>
      </div>

      {/* Filter Bar - Tech Style */}
      <div className="flex flex-wrap gap-2">
         {['All', 'Chemist', 'Stylist', 'Ventilation', 'Dermatologist'].map(role => (
           <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden group ${
                filter === role 
                  ? 'bg-white text-dark-900 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'bg-dark-800 text-slate-400 border border-dark-700 hover:border-slate-500 hover:text-white'
              }`}
           >
             <span className="relative z-10">{role}</span>
             {filter === role && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-blue"></div>}
           </button>
         ))}
      </div>

      {/* Modern Dossier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExperts.map(expert => (
          <Link 
            to={`/experts/${expert.id}`} 
            key={expert.id}
            className="group relative bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden hover:border-brand-blue/50 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-blue/10 flex flex-col sm:flex-row min-h-[220px]"
          >
            {/* Left: Visual Identity */}
            <div className="w-full sm:w-1/3 bg-dark-900/50 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-dark-700 relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
               
               <div className="relative w-24 h-24 mb-4 group-hover:scale-105 transition-transform duration-500">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getGradient(expert.colorTheme)} opacity-20 group-hover:opacity-40 transition-opacity blur-xl`}></div>
                  <img src={expert.image} alt={expert.name} className="w-full h-full rounded-2xl object-cover border border-dark-600 relative z-10 bg-dark-900" />
                  {expert.availability === 'Available' && (
                      <div className="absolute -bottom-1 -right-1 z-20 bg-dark-900 border border-dark-600 rounded-full p-1" title="Available Now">
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                  )}
               </div>
               
               <div className="text-center relative z-10">
                   <div className="flex items-center justify-center gap-1 mb-1">
                       <Star className="w-3 h-3 text-yellow-500 fill-current" />
                       <span className="text-white font-bold text-sm">{expert.stats.rating}</span>
                   </div>
                   <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{expert.stats.consultations} Consults</div>
               </div>
            </div>

            {/* Right: Data & Bio */}
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-brand-blue transition-colors">{expert.name}</h3>
                        <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${getThemeTextColor(expert.colorTheme)}`}>{expert.role}</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                    {expert.bio}
                </p>

                {/* Specialties "Chips" */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {expert.specialties.slice(0, 3).map((spec, i) => (
                        <span key={i} className="text-[10px] font-bold bg-dark-900 border border-dark-600 text-slate-300 px-2 py-1 rounded-md">
                            {spec}
                        </span>
                    ))}
                    {expert.specialties.length > 3 && (
                        <span className="text-[10px] font-bold bg-dark-900 border border-dark-600 text-slate-500 px-2 py-1 rounded-md">
                            +{expert.specialties.length - 3}
                        </span>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-dark-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{expert.stats.experience} Exp</span>
                    </div>
                    <span className="text-xs font-bold text-white group-hover:underline flex items-center gap-1">
                        View Dossier
                    </span>
                </div>
            </div>
          </Link>
        ))}

        {/* Recruitment Card */}
        <div className="bg-dark-800/50 rounded-3xl border border-dashed border-dark-600 p-6 flex flex-col items-center justify-center text-center hover:bg-dark-800 transition-colors group cursor-pointer min-h-[220px]">
            <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-dark-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Search className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Join the Directorate</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-4">
                Are you a qualified professional in dermatology, chemistry, or cosmetology?
            </p>
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider group-hover:underline">Apply for Verification</span>
        </div>
      </div>
    </div>
  );
};