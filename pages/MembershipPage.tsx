import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserTier } from '../types';
import { Check, Minus, Crown, Zap, Shield, Scale, Info } from 'lucide-react';
import { GovernancePage } from './GovernancePage';

const FEATURES = [
  { name: 'Knowledge Base Access', observer: 'Limited (101s)', kinetic: 'Full Access', quantum: 'Full Access' },
  { name: 'Forum Permissions', observer: 'Read Only', kinetic: 'Posting Rights', quantum: 'Posting Rights + Moderation' },
  { name: 'AI "Truth Engine" Usage', observer: '5 / day', kinetic: 'Unlimited', quantum: 'Unlimited + Priority' },
  { name: '"Rate My Hairline" Feedback', observer: false, kinetic: true, quantum: true },
  { name: 'Masterclass Video Series', observer: false, kinetic: false, quantum: true },
  { name: 'Live Expert Q&A', observer: false, kinetic: 'Monthly', quantum: 'Weekly' },
  { name: '1-on-1 Consultation', observer: false, kinetic: false, quantum: '1 Free / Quarter' },
  { name: 'Vendor Discounts', observer: false, kinetic: '5%', quantum: '15-20%' },
];

const SPACING_SCALE = {
  xs: 'gap-2',   // 8px  - 紧密相关元素
  sm: 'gap-3',   // 12px - 相关元素
  md: 'gap-4',   // 16px - 卡片内部
  lg: 'gap-6',   // 24px - 区块之间
  xl: 'gap-8',   // 32px - 主要区块
};

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
    <div className={`flex flex-col ${SPACING_SCALE.xl} pb-12`}>
      {/* Secondary Navigation */}
      <div className="sticky top-16 z-20 bg-dark-900/80 backdrop-blur-md border-b border-dark-700 -mx-6 md:-mx-8 px-6 md:px-8 py-2">
        <div className={`flex items-center ${SPACING_SCALE.md}`}>
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
        <div className={`flex flex-col ${SPACING_SCALE.xl} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-bold text-white tracking-tight">The Membership Economy</h1>
            <p className="text-slate-300 text-lg">
              Investing in knowledge prevents the cost of failure. A single ruined hair system costs $300+. Our membership costs less than a Netflix subscription.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 ${SPACING_SCALE.xl}`}>
            {/* Tier 1 */}
            <div className={`bg-dark-800 rounded-3xl border border-dark-700 p-8 flex flex-col ${SPACING_SCALE.lg} hover:border-slate-500 transition-colors shadow-xl`}>
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Potential Energy</h3>
                <div className="text-3xl font-bold text-white mb-4">Free</div>
                <p className="text-sm text-slate-500">For the "Curious Skeptic". Basic access to understand the fundamentals.</p>
              </div>
              <ul className={`space-y-4 flex-1`}>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-300">Limited "101" Articles</span>
                </li>
                 <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-300">Read-only Forum Access</span>
                </li>
              </ul>
              <button className="w-full py-4 border border-dark-600 rounded-2xl font-bold text-slate-300 hover:bg-dark-700 transition-colors uppercase tracking-widest text-xs">
                Current Plan
              </button>
            </div>

            {/* Tier 2 */}
            <div className={`bg-dark-800 rounded-3xl border-2 border-brand-blue p-8 flex flex-col ${SPACING_SCALE.lg} relative transform md:scale-105 z-10 shadow-2xl shadow-brand-blue/10`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-blue mb-2">Kinetic Force</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-white">$9</span>
                  <span className="text-slate-500 ml-1 font-bold">/mo</span>
                </div>
                <p className="text-sm text-slate-300">For the "Active DIYer". Actionable advice to prevent disaster.</p>
              </div>
              <ul className={`space-y-4 flex-1`}>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-brand-blue mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-300 font-medium">Full Knowledge Base Access</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-brand-blue mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-300">Full Forum Posting Rights</span>
                </li>
                 <li className="flex items-start">
                  <Check className="w-5 h-5 text-brand-blue mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-300">"Rate My Hairline" Feedback</span>
                </li>
              </ul>
              <button className="w-full py-4 bg-brand-blue hover:bg-blue-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs">
                Upgrade to Kinetic
              </button>
            </div>

            {/* Tier 3 */}
            <div className={`bg-gradient-to-b from-dark-800 to-dark-900 rounded-3xl border border-brand-purple/30 p-8 flex flex-col ${SPACING_SCALE.lg} shadow-xl hover:border-brand-purple transition-colors`}>
              <div>
                <h3 className="text-lg font-semibold text-brand-purple mb-2">Quantum State</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-slate-500 ml-1 font-bold">/mo</span>
                </div>
                <p className="text-sm text-slate-300">For the "Perfectionist". Concierge-level support and exclusives.</p>
              </div>
              <ul className={`space-y-4 flex-1`}>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-brand-purple mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-300">"Masterclass" Video Series</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-brand-purple mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-300">Priority "Quantum Lab" Support</span>
                </li>
                 <li className="flex items-start">
                  <Check className="w-5 h-5 text-brand-purple mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-300">1 Free 15-min Consult / Quarter</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-brand-purple mr-3 flex-shrink-0" />
                  <span className="text-sm text-slate-300">15-20% Vendor Discounts</span>
                </li>
              </ul>
              <button className="w-full py-4 bg-brand-purple hover:bg-purple-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/20 uppercase tracking-widest text-xs">
                Join the Elite
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-dark-700 bg-dark-900/50 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white">Compare Access Protocols</h3>
                    <p className="text-slate-300 text-sm mt-1">Detailed feature breakdown for cross-sectional analysis.</p>
                </div>
                <Info className="w-6 h-6 text-slate-500" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-dark-900/30">
                            <th className="p-6 border-b border-dark-700 text-slate-500 font-bold text-xs uppercase tracking-widest w-1/4">Capability</th>
                            <th className="p-6 border-b border-dark-700 text-white font-bold text-sm w-1/4">Observer</th>
                            <th className="p-6 border-b border-dark-700 text-brand-blue font-bold text-sm w-1/4">Kinetic Force</th>
                            <th className="p-6 border-b border-dark-700 text-brand-purple font-bold text-sm w-1/4">Quantum State</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                        {FEATURES.map((feature, idx) => (
                            <tr key={idx} className="hover:bg-dark-700/20 transition-colors group">
                                <td className="p-6 text-slate-300 font-medium text-sm group-hover:text-white">{feature.name}</td>
                                <td className="p-6 text-slate-300">{renderCell(feature.observer)}</td>
                                <td className="p-6 text-slate-200">{renderCell(feature.kinetic)}</td>
                                <td className="p-6 text-white">{renderCell(feature.quantum)}</td>
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