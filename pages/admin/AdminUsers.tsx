
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Shield, 
  Zap, 
  Crown, 
  AlertTriangle,
  Mail,
  Calendar,
  Filter,
  ArrowDownUp,
  Ban,
  CheckCircle2,
  Sparkles,
  Orbit
} from 'lucide-react';

const MOCK_USERS = [
  { id: 'U-9021', name: 'Alex Mercer', email: 'alex@mercer.diy', tier: 'Galaxy', status: 'Active', joined: 'Aug 2023', reputation: 1250 },
  { id: 'U-8824', name: 'Sarah Jenkins', email: 'sarah.dr@gmail.com', tier: 'Nova', status: 'Active', joined: 'Oct 2023', reputation: 840 },
  { id: 'U-1102', name: 'Michael Chen', email: 'mchen88@yahoo.com', tier: 'Nebula', status: 'Flagged', joined: 'Oct 2023', reputation: 15 },
  { id: 'U-4431', name: 'Kevin Taylor', email: 'kevin.stylist@pro.com', tier: 'Supernova', status: 'Active', joined: 'Sep 2023', reputation: 2100 },
];

export const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTier, setActiveTier] = useState('All');

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'Supernova': return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'Galaxy': return <Orbit className="w-3.5 h-3.5 text-brand-purple" />;
      case 'Nova': return <Zap className="w-3.5 h-3.5 text-brand-blue" />;
      default: return <Shield className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
     const styles = status === 'Active' 
        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
        : 'bg-red-500/10 text-red-500 border-red-500/20';
     return (
        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${styles}`}>
            {status}
        </span>
     );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-dark-800 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                 <Users className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Database Administration</h4>
           </div>
           <h1 className="text-3xl font-bold text-white tracking-tight">User Registry</h1>
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-2xl">
         <div className="p-6 border-b border-dark-800 flex flex-col lg:flex-row gap-4 justify-between bg-black/40 backdrop-blur-md">
            <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search by UUID, Name, or Email..." 
                    className="w-full bg-black border border-dark-700 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
               <Filter className="w-4 h-4 text-slate-600 mr-2" />
               {['All', 'Nebula', 'Nova', 'Galaxy', 'Supernova'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setActiveTier(t)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                        activeTier === t ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-dark-800 text-slate-500 border-dark-700 hover:border-slate-500'
                    }`}
                  >
                    {t}
                  </button>
               ))}
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-black/20 text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]">
                    <tr>
                        <th className="p-6">User Identity</th>
                        <th className="p-6">Tier Coordinate</th>
                        <th className="p-6">Reputation</th>
                        <th className="p-6">Status</th>
                        <th className="p-6 text-right">Operations</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dark-800">
                    {MOCK_USERS.map(user => (
                        <tr key={user.id} className="hover:bg-emerald-500/[0.02] transition-colors group">
                            <td className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-slate-500">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{user.name}</div>
                                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                    {getTierIcon(user.tier)}
                                    {user.tier}
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="text-sm font-mono text-slate-400">{user.reputation.toLocaleString()}</div>
                            </td>
                            <td className="p-6">
                                {getStatusBadge(user.status)}
                            </td>
                            <td className="p-6 text-right">
                                <button className="p-2 text-slate-500 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
