
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Search, Users, Star, MessageCircle, Filter, CheckCircle, Briefcase } from 'lucide-react';

export const ExpertsPage: React.FC = () => {
  const { experts } = useData();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExperts = [];
  for (let i = 0; i < experts.length; i++) {
    const e = experts[i];
    let matchesFilter = filter === 'All' || e.role.includes(filter);
    if (!matchesFilter) {
      for (let j = 0; j < e.specialties.length; j++) {
        if (e.specialties[j].includes(filter)) {
          matchesFilter = true;
          break;
        }
      }
    }
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.role.toLowerCase().includes(searchTerm.toLowerCase());
    if (matchesFilter && matchesSearch) {
      filteredExperts.push(e);
    }
  }

  const getGradient = (theme: string) => {
    switch(theme) {
      case 'purple': return 'from-indigo-600 to-purple-600';
      case 'blue': return 'from-blue-600 to-cyan-600';
      case 'teal': return 'from-teal-600 to-emerald-600';
      case 'pink': return 'from-rose-600 to-pink-600';
      default: return 'from-slate-600 to-slate-500';
    }
  };

  const renderFilterButtons = () => {
    const roles = ['All', 'Chemist', 'Stylist', 'Ventilation', 'Dermatologist'];
    const buttons = [];
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      buttons.push(
        <button
          key={role}
          onClick={() => setFilter(role)}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
            filter === role ? 'bg-brand-blue text-white' : 'bg-dark-900 text-slate-300 border-dark-600'
          }`}
        >
          {role}
        </button>
      );
    }
    return buttons;
  };

  const renderExpertCards = () => {
    const cards = [];
    for (let i = 0; i < filteredExperts.length; i++) {
      const expert = filteredExperts[i];
      const specItems = [];
      for (let j = 0; j < Math.min(expert.specialties.length, 3); j++) {
        specItems.push(
          <span key={j} className="px-2 py-1 bg-dark-900 border border-dark-600 rounded text-[10px] text-slate-300 font-medium">{expert.specialties[j]}</span>
        );
      }

      cards.push(
        <div key={expert.id} className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden flex flex-col hover:shadow-xl transition-shadow group">
            <div className={`h-24 bg-gradient-to-r ${getGradient(expert.colorTheme)} relative overflow-hidden`}>
                <div className="absolute top-3 right-3">
                    <button className="bg-black/20 hover:bg-black/40 text-white/80 p-1.5 rounded-full"><MessageCircle className="w-4 h-4" /></button>
                </div>
            </div>
            <div className="px-5 pb-5 flex-1 flex flex-col items-center -mt-12 text-center relative">
                 <Link to={`/experts/${expert.id}`} className="relative mb-3 inline-block">
                     <div className="w-24 h-24 rounded-full p-1 bg-dark-800 relative z-10">
                        <img src={expert.image} alt={expert.name} className="w-full h-full rounded-full object-cover border-2 border-dark-600 group-hover:border-brand-blue transition-colors bg-dark-900" />
                     </div>
                     {expert.availability === 'Available' && <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-dark-800 rounded-full z-20"></div>}
                 </Link>
                 <Link to={`/experts/${expert.id}`} className="group-hover:text-brand-blue transition-colors">
                     <h3 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">{expert.name} <CheckCircle className="w-4 h-4 text-brand-blue fill-current text-dark-800" /></h3>
                 </Link>
                 <p className="text-sm text-slate-300 mb-2 font-medium">{expert.role}</p>
                 <div className="text-xs text-slate-500 flex items-center gap-3 mb-4 bg-dark-900/50 py-1.5 px-3 rounded-full border border-dark-700">
                     <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-current" /> <span className="text-slate-300 font-bold">{expert.stats.rating}</span></span>
                     <span className="w-0.5 h-3 bg-dark-600"></span>
                     <span><span className="text-slate-300 font-bold">{expert.stats.consultations}</span> Consults</span>
                 </div>
                 <p className="text-xs text-slate-300 line-clamp-2 mb-4 px-2 leading-relaxed">{expert.bio}</p>
                 <div className="flex flex-wrap justify-center gap-1.5 mb-6">{specItems}</div>
                 <div className="mt-auto w-full flex flex-col gap-2">
                     <Link to={`/experts/${expert.id}`} className="w-full py-2 rounded-full bg-brand-blue hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/10">View Profile</Link>
                     <button className="w-full py-2 rounded-full border border-brand-blue text-brand-blue hover:bg-brand-blue/10 text-sm font-bold transition-colors">Book Consultation</button>
                 </div>
            </div>
        </div>
      );
    }
    return cards;
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 mb-8 shadow-sm">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Expert Network</h1>
                    <p className="text-slate-300 text-sm">Connect with verified professionals in hair replacement science.</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-dark-900 px-4 py-2 rounded-lg border border-dark-600 text-xs text-slate-300">
                    <Users className="w-4 h-4 text-brand-blue" />
                    <span className="font-bold text-white">{experts.length}</span> Verified Experts
                </div>
             </div>
             <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-600 rounded-lg text-white text-sm focus:outline-none focus:border-brand-blue transition-all" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 items-center">
                    <Filter className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
                    {renderFilterButtons()}
                </div>
             </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderExpertCards()}
            <Link to="/experts/apply" className="bg-dark-800/50 rounded-xl border border-dashed border-dark-600 flex flex-col hover:bg-dark-800 transition-colors group">
                 <div className="h-24 bg-dark-900/50 flex items-center justify-center"></div>
                 <div className="px-5 pb-5 flex-1 flex flex-col items-center -mt-12 text-center relative">
                    <div className="w-24 h-24 rounded-full p-1 bg-dark-800 relative z-10 mb-3">
                         <div className="w-full h-full rounded-full bg-dark-900 border-2 border-dashed border-dark-600 flex items-center justify-center group-hover:border-slate-500 transition-colors">
                             <Briefcase className="w-8 h-8 text-slate-500 group-hover:text-white transition-colors" />
                         </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Are you an expert?</h3>
                    <p className="text-sm text-slate-300 mb-4 font-medium">Join the Directorate</p>
                    <div className="mt-auto w-full"><span className="block w-full py-2 rounded-full bg-dark-700 hover:bg-dark-600 text-slate-300 hover:text-white text-sm font-bold transition-colors">Apply for Verification</span></div>
                 </div>
            </Link>
        </div>
    </div>
  );
};
