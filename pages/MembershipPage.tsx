
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserTier } from '../types';
import { Check, Minus, Crown, Zap, Shield, Scale, Info, Sparkles, Orbit } from 'lucide-react';
import { GovernancePage } from './GovernancePage';

const FEATURES = [
  { name: 'Knowledge Base Access', nebula: 'Limited (101s)', nova: 'Full Access', galaxy: 'Full Access', supernova: 'Full Access' },
  { name: 'Forum Permissions', nebula: 'Read Only', nova: 'Posting Rights', galaxy: 'Posting Rights', supernova: 'Moderation Priority' },
  { name: 'AI "Truth Engine" Usage', nebula: '5 / day', nova: 'Unlimited', galaxy: 'Unlimited + High Speed', supernova: 'Dedicated Instance' },
  { name: '"Rate My Hairline" Feedback', nebula: false, nova: true, galaxy: true, supernova: 'Direct Expert Review' },
  { name: 'Masterclass Video Series', nebula: false, nova: false, galaxy: true, supernova: 'Full Archive' },
  { name: 'Live Expert Q&A', nebula: false, nova: 'Monthly', galaxy: 'Weekly', supernova: 'On-Demand (Monthly)' },
  { name: '1-on-1 Consultation', nebula: false, nova: false, galaxy: '1 / Quarter', supernova: 'Monthly Strategy' },
  { name: 'Vendor Discounts', nebula: false, nova: '5%', galaxy: '15-20%', supernova: 'Wholesale Access' },
];

export const MembershipPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'governance'>('plans');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/governance') {
      setActiveTab('governance');
    } else {
      setActiveTab('plans');
    }
  }, [location.pathname]);

  const renderCell = (value: string | boolean) => {
    if (value === true) return <Check className="w-5 h-5 text-green-500" />;
    if (value === false) return <Minus className="w-5 h-5 text-slate-600" />;
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Secondary Navigation */}
      <div className="sticky top-16 z-20 bg-dark-900/80 backdrop-blur-md border-b border-dark-700 -mx-6 md:-mx-8 px-6 md:px-8 py-2">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setActiveTab('plans')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'plans' ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' : 'text-slate-500 hover:text-white'}`}
            >
                <Crown className="w-4 h-4" />
                Membership Plans
            </button>
            <button 
                onClick={() => setActiveTab('governance')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'governance' ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' : 'text-slate-500 hover:text-white'}`}
            >
                <Scale className="w-4 h-4" />
                Community Governance
            </button>
        </div>
      </div>

      {activeTab === 'plans' ? (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-bold text-white tracking-tight">The Astronomical Economy</h1>
            <p className="text-slate-300 text-lg">
              Knowledge is the best defense against failure. Choose your coordinate and join the Directorate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Nebula (Tier 1) */}
            <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 flex flex-col gap-6 hover:border-slate-500 transition-colors shadow-xl">
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Nebula</h3>
                <div className="text-3xl font-bold text-white mb-4">Free</div>
                <p className="text-xs text-slate-500 leading-relaxed">For the "Curious Observer". Basic access to understand foundational physics.</p>
              </div>
              <ul className="space-y-4 flex-1">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Limited "101" Modules</span>
                </li>
                 <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Read-only Forum</span>
                </li>
              </ul>
              <button className="w-full py-4 border border-dark-600 rounded-2xl font-bold text-slate-300 hover:bg-dark-700 transition-colors uppercase tracking-widest text-[10px]">
                Current Signal
              </button>
            </div>

            {/* Nova (Tier 2) */}
            <div className="bg-dark-800 rounded-3xl border-2 border-brand-blue p-8 flex flex-col gap-6 relative shadow-2xl shadow-brand-blue/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                Most Active
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-blue mb-2">Nova</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-white">$9</span>
                  <span className="text-slate-500 ml-1 font-bold text-sm">/mo</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">For the "Active DIYer". Actionable advice to prevent system decay.</p>
              </div>
              <ul className="space-y-4 flex-1">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-brand-blue mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Full KB Access</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-brand-blue mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Full Forum Rights</span>
                </li>
              </ul>
              <button className="w-full py-4 bg-brand-blue hover:bg-blue-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-[10px]">
                Ignite Nova
              </button>
            </div>

            {/* Galaxy (Tier 3) */}
            <div className="bg-gradient-to-b from-dark-800 to-dark-900 rounded-3xl border border-brand-purple/30 p-8 flex flex-col gap-6 shadow-xl hover:border-brand-purple transition-colors">
              <div>
                <h3 className="text-lg font-semibold text-brand-purple mb-2">Galaxy</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-white">$29</span>
                  <span className="text-slate-500 ml-1 font-bold text-sm">/mo</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">For the "Perfectionist". Expansive support and priority synthesis.</p>
              </div>
              <ul className="space-y-4 flex-1">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-brand-purple mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Masterclass Videos</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-brand-purple mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">1 Free Consult / Qtr</span>
                </li>
              </ul>
              <button className="w-full py-4 bg-brand-purple hover:bg-purple-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/20 uppercase tracking-widest text-[10px]">
                Expand to Galaxy
              </button>
            </div>

            {/* Supernova (Tier 4) */}
            <div className="bg-gradient-to-br from-dark-950 via-dark-800 to-amber-900/20 rounded-3xl border-2 border-amber-500/30 p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Orbit className="w-16 h-16 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-amber-500">Supernova</h3>
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-white">$99</span>
                  <span className="text-slate-500 ml-1 font-bold text-sm">/mo</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">The "Elite Directorate". Absolute mastery and direct expert channels.</p>
              </div>
              <ul className="space-y-4 flex-1">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Monthly Strategy Calls</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Dedicated AI Instance</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">Direct Expert Messaging</span>
                </li>
              </ul>
              <button className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest text-[10px]">
                Become Supernova
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-dark-700 bg-dark-900/50 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white">Compare Access Protocols</h3>
                    <p className="text-slate-300 text-sm mt-1">Detailed feature breakdown for astronomical analysis.</p>
                </div>
                <Info className="w-6 h-6 text-slate-500" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-dark-900/30">
                            <th className="p-6 border-b border-dark-700 text-slate-500 font-bold text-xs uppercase tracking-widest">Capability</th>
                            <th className="p-6 border-b border-dark-700 text-slate-400 font-bold text-sm">Nebula</th>
                            <th className="p-6 border-b border-dark-700 text-brand-blue font-bold text-sm">Nova</th>
                            <th className="p-6 border-b border-dark-700 text-brand-purple font-bold text-sm">Galaxy</th>
                            <th className="p-6 border-b border-dark-700 text-amber-500 font-bold text-sm">Supernova</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                        {FEATURES.map((feature, idx) => (
                            <tr key={idx} className="hover:bg-dark-700/20 transition-colors group">
                                <td className="p-6 text-slate-300 font-medium text-sm group-hover:text-white">{feature.name}</td>
                                <td className="p-6 text-slate-500">{renderCell(feature.nebula)}</td>
                                <td className="p-6 text-slate-400">{renderCell(feature.nova)}</td>
                                <td className="p-6 text-slate-200">{renderCell(feature.galaxy)}</td>
                                <td className="p-6 text-white font-bold">{renderCell(feature.supernova)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <GovernancePage />
        </div>
      )}
    </div>
  );
};
