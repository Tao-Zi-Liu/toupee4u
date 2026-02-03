import React, { useState } from 'react';
import { Shield, Users, Bot, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { ShieldAlert, MessageSquare, Crown, Clock, X, Check } from 'lucide-react';

export const GovernanceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [openSection, setOpenSection] = useState<string | null>('rules');

  const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-dark-900 w-full max-w-4xl max-h-[85vh] rounded-3xl border border-brand-blue/30 shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-dark-700 bg-dark-800 flex items-center justify-between sticky top-0 z-10">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue border border-brand-blue/20">
                 <Shield className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white">Community Governance</h2>
                 <p className="text-xs text-slate-300">Please review our protocols before proceeding.</p>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-dark-900">
            {/* Section I: Rules */}
            <Section 
                id="rules" 
                title="I. Core Community Rules" 
                subtitle="Safety & Tone Protocols"
                icon={Scale}
                isOpen={openSection === 'rules'} 
                toggle={toggle}
            >
                <div className="bg-dark-900 rounded-xl overflow-hidden border border-dark-700">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-dark-800 text-xs text-slate-500 uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-4 border-b border-dark-700">Rule Title</th>
                                <th className="p-4 border-b border-dark-700">Enforcement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            <tr className="bg-red-500/5">
                                <td className="p-4 text-red-400 font-bold text-sm">Zero-Tolerance Harassment</td>
                                <td className="p-4 text-sm text-slate-300">
                                    <span className="text-xs text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                                        ⚠️ Automatic Suspension
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 text-white font-bold text-sm">Constructive Feedback Only</td>
                                <td className="p-4 text-sm text-slate-300">
                                    Manual Review / Warning
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Section>

            {/* Section II: Hierarchy */}
            <Section 
                id="hierarchy" 
                title="II. Community Hierarchy" 
                subtitle="Gamification Structure"
                icon={Crown}
                isOpen={openSection === 'hierarchy'} 
                toggle={toggle}
            >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <LevelCard icon="🐣" title="New Particle" subtitle="Read-only" />
                    <LevelCard icon="🔬" title="Atom Smasher" subtitle="Full Access" />
                    <LevelCard icon="🚀" title="Quantum" subtitle="Voting Rights" isHighlight />
                    <LevelCard icon="🎓" title="Expert" subtitle="Mentorship" />
                    <LevelCard icon="🌌" title="Super" subtitle="Admin Board" />
                </div>
            </Section>

            {/* Section III: AI Moderation */}
            <Section 
                id="ai" 
                title="III. AI Moderation" 
                subtitle="Automated Enforcement"
                icon={Bot}
                isOpen={openSection === 'ai'} 
                toggle={toggle}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-4 text-center">
                        <div className="text-brand-blue font-bold text-sm mb-2 flex items-center justify-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Path A: Low Severity
                        </div>
                        <div className="text-xs text-slate-300">Manual Review Queue (24h)</div>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-center">
                        <div className="text-red-500 font-bold text-sm mb-2 flex items-center justify-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> Path B: Zero-Tolerance
                        </div>
                        <div className="text-xs text-slate-300">Automatic Suspension</div>
                    </div>
                </div>
            </Section>

             {/* Section IV: Accountability */}
            <Section 
                id="accountability" 
                title="IV. Moderator Accountability" 
                subtitle="Oversight"
                icon={Users}
                isOpen={openSection === 'accountability'} 
                toggle={toggle}
            >
                <div className="bg-dark-900 p-4 rounded-xl border border-dark-700 flex items-center gap-3">
                    <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-500">
                        <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-slate-300">
                        Moderators inactive for <span className="text-white font-bold">7 days</span> are automatically rotated out.
                    </p>
                </div>
            </Section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-700 bg-dark-800 flex justify-end">
            <button 
                onClick={onClose}
                className="w-full md:w-auto px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
                <Check className="w-5 h-5" /> I Understand & Accept
            </button>
        </div>
      </div>
    </div>
  );
};

// Internal components (Matched to GovernancePage)
const Section = ({ id, title, subtitle, icon: Icon, isOpen, toggle, children }: any) => (
    <div className={`bg-dark-800 rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-brand-blue shadow-lg shadow-brand-blue/5' : 'border-dark-700 hover:border-dark-600'}`}>
        <button 
            onClick={() => toggle(id)}
            className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isOpen ? 'bg-dark-800' : 'hover:bg-dark-700/50'}`}
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-brand-blue text-white' : 'bg-dark-900 text-slate-500 border border-dark-700'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className={`text-base font-bold ${isOpen ? 'text-white' : 'text-slate-300'}`}>{title}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{subtitle}</p>
                </div>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5 text-brand-blue" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>
        {isOpen && (
            <div className="p-6 border-t border-dark-700/50 bg-dark-800/50">
                {children}
            </div>
        )}
    </div>
);

const LevelCard = ({ icon, title, subtitle, isHighlight }: any) => (
    <div className={`p-3 rounded-xl text-center border flex flex-col items-center justify-center h-full transition-all duration-300 ${
        isHighlight 
            ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.1)]' 
            : 'bg-dark-900 border-dark-700'
    }`}>
        <div className="text-2xl mb-2">{icon}</div>
        <div className={`text-xs font-bold mb-1 ${isHighlight ? 'text-yellow-500' : 'text-white'}`}>{title}</div>
        <div className="text-[10px] text-slate-500 leading-tight">{subtitle}</div>
    </div>
);