import React from 'react';
import { UserTier } from '../types';
import { Check, Minus } from 'lucide-react';

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

export const MembershipPage: React.FC = () => {
  const renderCell = (value: string | boolean) => {
    if (value === true) return <Check className="w-5 h-5 text-green-500" />;
    if (value === false) return <Minus className="w-5 h-5 text-slate-600" />;
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="space-y-12 py-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">The Membership Economy</h1>
        <p className="text-slate-400">
          Investing in knowledge prevents the cost of failure. A single ruined hair system costs $300+. Our membership costs less than a Netflix subscription.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tier 1 */}
        <div className="bg-dark-800 rounded-2xl shadow-sm border border-dark-700 p-8 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-400 mb-2">Potential Energy</h3>
          <div className="text-3xl font-bold text-white mb-6">Free</div>
          <p className="text-sm text-slate-500 mb-8">For the "Curious Skeptic". Basic access to understand the fundamentals.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-slate-300">Limited "101" Articles</span>
            </li>
             <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-slate-300">Read-only Forum Access</span>
            </li>
          </ul>
          <button className="w-full py-3 border border-dark-600 rounded-xl font-medium text-slate-300 hover:bg-dark-700 transition-colors">
            Current Plan
          </button>
        </div>

        {/* Tier 2 */}
        <div className="bg-dark-800 rounded-2xl shadow-xl border-2 border-brand-blue p-8 flex flex-col relative transform scale-105 z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Most Popular
          </div>
          <h3 className="text-lg font-semibold text-brand-blue mb-2">Kinetic Force</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold text-white">$9</span>
            <span className="text-slate-500 ml-1">/mo</span>
          </div>
          <p className="text-sm text-slate-400 mb-8">For the "Active DIYer". Actionable advice to prevent disaster.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-blue mr-2 flex-shrink-0" />
              <span className="text-sm text-slate-300 font-medium">Full Knowledge Base Access</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-blue mr-2 flex-shrink-0" />
              <span className="text-sm text-slate-300">Full Forum Posting Rights</span>
            </li>
             <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-blue mr-2 flex-shrink-0" />
              <span className="text-sm text-slate-300">"Rate My Hairline" Feedback</span>
            </li>
          </ul>
          <button className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20">
            Upgrade to Kinetic
          </button>
        </div>

        {/* Tier 3 */}
        <div className="bg-gradient-to-b from-dark-800 to-dark-900 rounded-2xl shadow-xl border border-brand-purple/30 p-8 flex flex-col">
          <h3 className="text-lg font-semibold text-brand-purple mb-2">Quantum State</h3>
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold text-white">$29</span>
            <span className="text-slate-500 ml-1">/mo</span>
          </div>
          <p className="text-sm text-slate-400 mb-8">For the "Perfectionist". Concierge-level support and exclusives.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-purple mr-2 flex-shrink-0" />
              <span className="text-sm text-slate-300">"Masterclass" Video Series</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-purple mr-2 flex-shrink-0" />
              <span className="text-sm text-slate-300">Priority "Quantum Lab" Support</span>
            </li>
             <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-purple mr-2 flex-shrink-0" />
              <span className="text-sm text-slate-300">1 Free 15-min Consult / Quarter</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-purple mr-2 flex-shrink-0" />
              <span className="text-sm text-slate-300">15-20% Vendor Discounts</span>
            </li>
          </ul>
          <button className="w-full py-3 bg-brand-purple hover:bg-purple-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-purple-500/20">
            Join the Elite
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden shadow-sm mt-16">
        <div className="p-6 border-b border-dark-700 bg-dark-900/50">
            <h3 className="text-xl font-bold text-white">Compare Plans</h3>
            <p className="text-slate-400 text-sm mt-1">Detailed feature breakdown per tier.</p>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr className="bg-dark-900/30">
                        <th className="p-5 border-b border-dark-700 text-slate-400 font-medium text-sm w-1/4">Feature</th>
                        <th className="p-5 border-b border-dark-700 text-white font-bold text-sm w-1/4">Observer</th>
                        <th className="p-5 border-b border-dark-700 text-brand-blue font-bold text-sm w-1/4">Kinetic Force</th>
                        <th className="p-5 border-b border-dark-700 text-brand-purple font-bold text-sm w-1/4">Quantum State</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                    {FEATURES.map((feature, idx) => (
                        <tr key={idx} className="hover:bg-dark-700/20 transition-colors">
                            <td className="p-5 text-slate-300 font-medium text-sm">{feature.name}</td>
                            <td className="p-5 text-slate-400">{renderCell(feature.observer)}</td>
                            <td className="p-5 text-slate-200">{renderCell(feature.kinetic)}</td>
                            <td className="p-5 text-white">{renderCell(feature.quantum)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
       </div>
    </div>
  );
};
