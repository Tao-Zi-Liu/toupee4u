import React, { useState } from 'react';
import { Shield, Users, Bot, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { ShieldAlert, MessageSquare, Crown, Clock } from 'lucide-react';

export const GovernancePage: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('rules');

  const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center border-b border-dark-700 pb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-blue/10 text-brand-blue mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Shield className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Community Governance</h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Fostering an ecosystem of trust, growth, and constructive discourse through transparent protocols.
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-6">
        
        {/* Section I: Rules */}
        <Section 
            id="rules" 
            title="I. Core Community Rules" 
            subtitle="Safety & Tone Protocols"
            icon={Scale}
            isOpen={openSection === 'rules'} 
            toggle={toggle}
        >
            <p className="text-sm text-slate-300 mb-6 border-l-2 border-brand-blue pl-4">
                Our governance philosophy is built on two tiers: absolute Safety Guardrails and the promotion of a Supportive Tone.
            </p>
            <div className="bg-dark-900 rounded-xl overflow-hidden border border-dark-700 shadow-inner">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-dark-800 text-xs text-slate-500 uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-5 border-b border-dark-700">Tier</th>
                            <th className="p-5 border-b border-dark-700">Rule Title</th>
                            <th className="p-5 border-b border-dark-700">Description & Enforcement</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                        <tr className="bg-red-500/5">
                            <td className="p-5 text-red-500 font-bold text-sm">Safety Guardrails</td>
                            <td className="p-5 text-red-400 font-bold text-sm">Zero-Tolerance Harassment</td>
                            <td className="p-5 text-sm text-slate-300 leading-relaxed">
                                Any direct threat, hate speech, or targeted, repeated harassment is prohibited.
                                <div className="mt-2 text-xs text-yellow-500 font-bold bg-yellow-500/10 inline-block px-2 py-1 rounded border border-yellow-500/20">
                                    ⚠️ Violation leads to Automatic Suspension
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="p-5 text-brand-blue font-bold text-sm">Supportive Tone</td>
                            <td className="p-5 text-white font-bold text-sm">Constructive Feedback Only</td>
                            <td className="p-5 text-sm text-slate-300 leading-relaxed">
                                Maintain professional respect. Personal attacks or unproductive negativity are subject to warning/mute.
                                <div className="mt-2 text-xs text-slate-500 font-medium bg-dark-800 inline-block px-2 py-1 rounded border border-dark-600">
                                    Violation leads to Manual Review
                                </div>
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
            subtitle="5-Level Gamification Structure"
            icon={Crown}
            isOpen={openSection === 'hierarchy'} 
            toggle={toggle}
        >
            <p className="text-sm text-slate-300 mb-8 max-w-3xl">
                Progress through our 5-Level Hierarchy to unlock advanced features and governance input. Each level represents a verifiable commitment to the collective knowledge base.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <LevelCard icon="🐣" title="New Particle" subtitle="First 24 hrs. Read-only access to policies." />
                <LevelCard icon="🔬" title="Atom Smasher" subtitle="10 contributions. Full feature access." />
                <LevelCard icon="🚀" title="Quantum Leaper" subtitle="50 contributions. Governance voting rights." isHighlight />
                <LevelCard icon="🎓" title="Theoretical Expert" subtitle="100 contributions. Moderator mentorship." />
                <LevelCard icon="🌌" title="Super-Symmetry" subtitle="200+ contributions. Administrative review board." />
            </div>
        </Section>

        {/* Section III: AI Moderation */}
        <Section 
            id="ai" 
            title="III. Technical Policy" 
            subtitle="LLM/AI Moderation System"
            icon={Bot}
            isOpen={openSection === 'ai'} 
            toggle={toggle}
        >
            <p className="text-sm text-slate-300 mb-8">
                Our LLM (Large Language Model) runs continuous analysis, classifying content severity into two distinct pathways to ensure rapid and fair enforcement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Path A */}
                <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-6 text-center hover:bg-brand-blue/10 transition-colors">
                    <div className="text-brand-blue font-bold text-lg mb-3 flex items-center justify-center gap-2">
                        <MessageSquare className="w-5 h-5" /> Path A: Potential Violations
                    </div>
                    <p className="text-sm text-slate-300 mb-6 min-h-[40px]">
                        Content flagged for Supportive Tone issues or low-severity rule breaches.
                    </p>
                    <div className="text-2xl text-slate-600 mb-4 animate-bounce">⬇️</div>
                    <div className="inline-block px-4 py-2 bg-dark-900 border border-brand-blue/30 rounded-full text-xs font-bold text-slate-200 uppercase tracking-wide">
                        Manual Review Queue (24h SLA)
                    </div>
                </div>

                {/* Path B */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-center hover:bg-red-500/10 transition-colors">
                    <div className="text-red-500 font-bold text-lg mb-3 flex items-center justify-center gap-2">
                        <ShieldAlert className="w-5 h-5" /> Path B: Zero-Tolerance
                    </div>
                    <p className="text-sm text-slate-300 mb-6 min-h-[40px]">
                        Content flagged for Safety Guardrails breaches (threats, hate speech).
                    </p>
                    <div className="text-2xl text-slate-600 mb-4 animate-bounce">⬇️</div>
                    <div className="inline-block px-4 py-2 bg-red-600 text-white border border-red-500 rounded-full text-xs font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                        Automatic Suspension
                    </div>
                </div>
            </div>
        </Section>

        {/* Section IV: Accountability */}
        <Section 
            id="accountability" 
            title="IV. Moderator Accountability" 
            subtitle="Oversight & Audit Protocols"
            icon={Users}
            isOpen={openSection === 'accountability'} 
            toggle={toggle}
        >
             <p className="text-sm text-slate-300 mb-6">
                Administrative oversight ensures our moderation team maintains high standards of fairness and activity.
            </p>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <li className="bg-dark-900 p-6 rounded-2xl border border-dark-700 flex flex-col gap-4 hover:border-yellow-500/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-500">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h4 className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Inactivity Policy</h4>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Moderators failing to complete assigned queue reviews for <span className="text-white font-bold">7 consecutive days</span> will be automatically rotated out of the active team.
                    </p>
                </li>
                <li className="bg-dark-900 p-6 rounded-2xl border border-dark-700 flex flex-col gap-4 hover:border-red-500/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-500/10 p-2 rounded-lg text-red-500">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <h4 className="text-red-500 font-bold text-sm uppercase tracking-wider">Abuse of Power</h4>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Clear evidence of bias or arbitrary enforcement results in <span className="text-white font-bold">immediately revocation of privileges</span> and a permanent ban from the community.
                    </p>
                </li>
             </ul>
        </Section>

      </div>
    </div>
  );
};

// --- Sub-Components ---

const Section = ({ id, title, subtitle, icon: Icon, isOpen, toggle, children }: any) => (
    <div className={`bg-dark-800 rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-brand-blue shadow-lg shadow-brand-blue/5' : 'border-dark-700 hover:border-dark-600'}`}>
        <button 
            onClick={() => toggle(id)}
            className={`w-full flex items-center justify-between p-6 text-left transition-colors ${isOpen ? 'bg-dark-800' : 'hover:bg-dark-700/50'}`}
        >
            <div className="flex items-center gap-5">
                <div className={`p-3 rounded-xl transition-colors ${isOpen ? 'bg-brand-blue text-white' : 'bg-dark-900 text-slate-500 border border-dark-700'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className={`text-xl font-bold ${isOpen ? 'text-white' : 'text-slate-300'}`}>{title}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">{subtitle}</p>
                </div>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5 text-brand-blue" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>
        {isOpen && (
            <div className="p-8 border-t border-dark-700/50 bg-dark-800/50">
                {children}
            </div>
        )}
    </div>
);

const LevelCard = ({ icon, title, subtitle, isHighlight }: any) => (
    <div className={`p-5 rounded-2xl text-center border flex flex-col items-center justify-center h-full transition-all duration-300 ${
        isHighlight 
            ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)] transform md:-translate-y-2' 
            : 'bg-dark-900 border-dark-700 hover:border-dark-500'
    }`}>
        <div className="text-4xl mb-3">{icon}</div>
        <div className={`text-sm font-bold mb-2 ${isHighlight ? 'text-yellow-500' : 'text-white'}`}>{title}</div>
        <div className="text-[10px] text-slate-500 leading-relaxed font-medium">{subtitle}</div>
    </div>
);