import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EXPERTS } from '../constants';
import { Search, Filter, ArrowUpRight, Star, Hexagon } from 'lucide-react';

export const ExpertsPage: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const filteredExperts = filter === 'All' 
    ? EXPERTS 
    : EXPERTS.filter(e => e.role.includes(filter) || e.specialties.some(s => s.includes(filter)));

  const getGradient = (theme: string) => {
    switch(theme) {
      case 'purple': return 'from-purple-500 to-indigo-600';
      case 'blue': return 'from-blue-500 to-cyan-600';
      case 'teal': return 'from-teal-500 to-emerald-600';
      case 'pink': return 'from-pink-500 to-rose-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-dark-700 pb-8">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Hexagon className="w-5 h-5 text-brand-blue" />
              <h4 className="text-xs font-bold text-brand-blue uppercase tracking-widest">The Research Team</h4>
           </div>
           <h1 className="text-4xl font-bold text-white mb-2">Subject Matter Experts</h1>
           <p className="text-slate-400 max-w-xl">
             Access specialized intelligence. These are not just stylists; they are chemists, engineers, and dermatologists dedicated to the science of hair replacement.
           </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           {['All', 'Chemist', 'Stylist', 'Ventilation', 'Dermatologist'].map(role => (
             <button
                key={role}
                onClick={() => setFilter(role)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === role 
                    ? 'bg-white text-dark-900 shadow-lg shadow-white/10' 
                    : 'bg-dark-800 text-slate-400 border border-dark-700 hover:border-slate-500'
                }`}
             >
               {role}
             </button>
           ))}
        </div>
      </div>

      {/* Expert Grid - Non-Traditional Card Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredExperts.map(expert => (
          <Link 
            to={`/experts/${expert.id}`} 
            key={expert.id}
            className="group relative bg-dark-800 rounded-3xl overflow-hidden border border-dark-700 hover:border-dark-500 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-blue/10 flex flex-col h-[400px]"
          >
            {/* Background Gradient Splash */}
            <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${getGradient(expert.colorTheme)} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
            
            {/* Content Container */}
            <div className="relative p-6 flex-1 flex flex-col">
               
               {/* Header: Role & Status */}
               <div className="flex justify-between items-start mb-6">
                 <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border bg-dark-900/50 backdrop-blur-sm border-white/10 text-white`}>
                   {expert.role}
                 </span>
                 <div className={`w-2 h-2 rounded-full ${expert.availability === 'Available' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
               </div>

               {/* Avatar - Centered & Large */}
               <div className="mx-auto relative w-24 h-24 mb-4">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getGradient(expert.colorTheme)} blur-md opacity-50 group-hover:opacity-80 transition-opacity`}></div>
                  <img src={expert.image} alt={expert.name} className="w-full h-full rounded-full object-cover border-2 border-dark-800 relative z-10" />
               </div>

               {/* Name & Stats */}
               <div className="text-center mb-6">
                 <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-blue transition-colors">{expert.name}</h3>
                 <div className="flex items-center justify-center gap-1 text-yellow-500 text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    {expert.stats.rating} Rating
                 </div>
               </div>

               {/* Specialties Tags */}
               <div className="flex flex-wrap justify-center gap-2 mb-4">
                 {expert.specialties.slice(0, 2).map((spec, i) => (
                   <span key={i} className="text-xs text-slate-400 bg-dark-900 px-2 py-1 rounded border border-dark-700">
                     {spec}
                   </span>
                 ))}
                 {expert.specialties.length > 2 && (
                   <span className="text-xs text-slate-500 px-1 py-1">+ {expert.specialties.length - 2}</span>
                 )}
               </div>

               {/* Action Footer */}
               <div className="mt-auto flex items-center justify-between pt-4 border-t border-dark-700/50">
                  <span className="text-xs text-slate-500 font-mono">ID: {expert.id.split('-')[0].toUpperCase()}</span>
                  <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-white group-hover:bg-brand-blue group-hover:scale-110 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
               </div>
            </div>
          </Link>
        ))}

        {/* Call to Action Card */}
        <div className="rounded-3xl border border-dashed border-dark-600 p-6 flex flex-col items-center justify-center text-center h-[400px] hover:bg-dark-800/50 transition-colors cursor-pointer group">
           <div className="w-16 h-16 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-slate-500" />
           </div>
           <h3 className="text-white font-bold mb-2">Apply as Expert</h3>
           <p className="text-slate-400 text-sm px-4">Are you a scientist or stylist? Join the Toupee4U research board.</p>
        </div>
      </div>
    </div>
  );
};
