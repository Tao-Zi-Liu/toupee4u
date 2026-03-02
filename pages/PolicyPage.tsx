import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare, Crown, Zap, Shield, ChevronRight, ArrowLeft,
  AlertTriangle, CheckCircle, XCircle, Clock, Star, Lock
} from 'lucide-react';

type Section = 'forum' | 'membership' | 'xp' | 'moderation';

const sections: { id: Section; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'forum',      label: 'Forum Rules',         icon: MessageSquare, color: 'text-brand-blue'   },
  { id: 'membership', label: 'Membership Tiers',    icon: Crown,         color: 'text-amber-400'    },
  { id: 'xp',         label: 'XP & Points',         icon: Zap,           color: 'text-green-400'    },
  { id: 'moderation', label: 'Content Moderation',  icon: Shield,        color: 'text-purple-400'   },
];

export const PolicyPage: React.FC = () => {
  const [active, setActive] = useState<Section>('forum');

  return (
    <div className="max-w-5xl mx-auto pb-20">

      {/* Header */}
      <div className="mb-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-brand-blue" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Community Policies</h1>
        </div>
        <p className="text-slate-400 text-sm max-w-xl">
          These policies govern how Toupee4U operates. They exist to keep our community safe, fair, and valuable for everyone.
        </p>
        <p className="text-slate-600 text-xs mt-2">Last updated: February 2026</p>
      </div>

      <div className="flex gap-8">

        {/* Sidebar Nav */}
        <aside className="w-48 flex-shrink-0 hidden md:block">
          <nav className="sticky top-6 space-y-1">
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    active === s.id
                      ? 'bg-dark-700 text-white border border-dark-600'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-dark-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active === s.id ? s.color : ''}`} />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden w-full mb-6 flex gap-2 overflow-x-auto pb-2">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  active === s.id ? 'bg-dark-700 text-white border border-dark-600' : 'bg-dark-800 text-slate-500'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active === s.id ? s.color : ''}`} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0">

          {/* ── Forum Rules ── */}
          {active === 'forum' && (
            <div className="space-y-6">
              <SectionHeader icon={MessageSquare} color="text-brand-blue" title="Forum Rules" subtitle="Rules that apply to all posts and comments in the community." />

              <PolicyCard title="Posting Requirements" icon={Lock} iconColor="text-amber-400">
                <RuleRow icon="⚡" label="XP Threshold">
                  You must earn at least <strong>100 XP</strong> before you can create a new post. This ensures that contributors have genuinely engaged with the community first. Earn XP by reading articles, commenting, and checking in daily.
                </RuleRow>
                <RuleRow icon="📌" label="Stay On Topic">
                  All posts must be relevant to hair systems, toupees, hairpieces, adhesives, maintenance, or related lifestyle topics. Off-topic posts will be removed without notice.
                </RuleRow>
                <RuleRow icon="🔍" label="Search Before Posting">
                  Use the search function before creating a new thread. Duplicate posts may be merged or removed by moderators.
                </RuleRow>
              </PolicyCard>

              <PolicyCard title="Prohibited Content" icon={XCircle} iconColor="text-red-400">
                <RuleRow icon="🚫" label="No Advertising">
                  Unsolicited promotion of products, services, or external websites is strictly prohibited. Vendor accounts must contact us for partnership arrangements.
                </RuleRow>
                <RuleRow icon="🚫" label="No Personal Attacks">
                  Harassment, bullying, hate speech, or personal attacks against any member will result in immediate removal and potential account suspension.
                </RuleRow>
                <RuleRow icon="🚫" label="No Unverified Medical Advice">
                  Do not share medical claims or advice presented as fact. Personal experiences are welcome — presenting them as professional medical guidance is not.
                </RuleRow>
                <RuleRow icon="🚫" label="No Spam or Low-Effort Content">
                  Repeated low-effort posts or comments exist to game the XP system and will be penalized. Posting costs 5 XP — use it wisely.
                </RuleRow>
              </PolicyCard>

              <PolicyCard title="Comment Guidelines" icon={CheckCircle} iconColor="text-green-400">
                <RuleRow icon="✅" label="Be Constructive">
                  Criticism is welcome; cruelty is not. If you disagree, explain why thoughtfully.
                </RuleRow>
                <RuleRow icon="✅" label="Credit Sources">
                  If you share information from another source, link or credit it appropriately.
                </RuleRow>
                <RuleRow icon="✅" label="Respect Privacy">
                  Do not share personal information about other members without their explicit consent.
                </RuleRow>
              </PolicyCard>
            </div>
          )}

          {/* ── Membership Tiers ── */}
          {active === 'membership' && (
            <div className="space-y-6">
              <SectionHeader icon={Crown} color="text-amber-400" title="Membership Tiers" subtitle="What each tier includes and how to qualify." />

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-sm text-amber-300">
                <strong>Important:</strong> Upgrading to a paid tier requires <em>both</em> a subscription payment <em>and</em> the minimum XP threshold. This ensures premium tiers are filled with active, engaged members.
              </div>

              {[
                {
                  name: 'Nebula', price: 'Free', xp: null,
                  color: 'border-slate-600', badge: 'bg-slate-700 text-slate-300',
                  features: [
                    'Access to community forums (after 100 XP)',
                    'Basic Knowledge Base articles',
                    'Standard community support',
                    'View all discussions and expert profiles',
                  ]
                },
                {
                  name: 'Nova', price: '$9 / month', xp: 200,
                  color: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-300',
                  features: [
                    'Everything in Nebula',
                    'Advanced Knowledge Base articles',
                    'Priority support response',
                    'Expert Q&A access',
                    'Ad-free browsing experience',
                  ]
                },
                {
                  name: 'Galaxy', price: '$19 / month', xp: 800,
                  color: 'border-purple-500/30', badge: 'bg-purple-500/20 text-purple-300',
                  features: [
                    'Everything in Nova',
                    'Premium & exclusive KB content',
                    '1-on-1 expert consultation sessions',
                    'Early access to new platform features',
                    'Custom Galaxy profile badge',
                  ]
                },
                {
                  name: 'Supernova', price: '$49 / month', xp: 2000,
                  color: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-300',
                  features: [
                    'Everything in Galaxy',
                    'Unlimited expert access & sessions',
                    'Exclusive research reports',
                    'Private community channels',
                    'Priority feature request consideration',
                  ]
                },
              ].map(tier => (
                <div key={tier.name} className={`bg-dark-800 border ${tier.color} rounded-2xl p-5`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${tier.badge}`}>{tier.name}</span>
                      <span className="text-white font-bold">{tier.price}</span>
                    </div>
                    {tier.xp && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                        <Zap className="w-3 h-3" /> {tier.xp} XP required
                      </div>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <PolicyCard title="Downgrade Policy" icon={AlertTriangle} iconColor="text-amber-400">
                <RuleRow icon="📋" label="Content Preservation">
                  If you downgrade, all your posts and contributions remain visible. You lose access to premium features but retain your community history.
                </RuleRow>
                <RuleRow icon="📋" label="XP Retention">
                  Your XP is never lost when downgrading. If you re-upgrade later, your existing XP will count toward the threshold.
                </RuleRow>
                <RuleRow icon="📋" label="Refund Policy">
                  Payments are non-refundable once a billing cycle has started. Cancellations take effect at the end of the current billing period.
                </RuleRow>
              </PolicyCard>
            </div>
          )}

          {/* ── XP Rules ── */}
          {active === 'xp' && (
            <div className="space-y-6">
              <SectionHeader icon={Zap} color="text-green-400" title="XP & Points System" subtitle="How XP is earned, spent, and protected against abuse." />

              <PolicyCard title="Earning XP" icon={Star} iconColor="text-green-400">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { action: 'Daily Check-in',       xp: '+2',  note: 'Zombie prevention applies'     },
                    { action: 'View a Post',           xp: '+1',  note: 'Once per post, max 5 XP/day'  },
                    { action: 'Like a Post',           xp: '+2',  note: 'Max 10 XP/day'                },
                    { action: 'Leave a Comment',       xp: '+8',  note: 'No daily limit'               },
                    { action: 'Read a KB Article',     xp: '+10', note: 'Must read to completion'      },
                    { action: 'Receive a Like',        xp: '+5',  note: 'Quality signal reward'        },
                    { action: 'Create a Post',         xp: '−5',  note: 'Encourages quality posting'   },
                  ].map(row => (
                    <div key={row.action} className="flex items-start justify-between p-3 bg-dark-900 rounded-xl border border-dark-700">
                      <div>
                        <p className="text-white text-sm font-medium">{row.action}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{row.note}</p>
                      </div>
                      <span className={`text-sm font-extrabold ml-3 flex-shrink-0 ${row.xp.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {row.xp}
                      </span>
                    </div>
                  ))}
                </div>
              </PolicyCard>

              <PolicyCard title="XP Thresholds & Rewards" icon={Crown} iconColor="text-amber-400">
                {[
                  { xp: '100 XP',  reward: 'Forum posting unlocked',           color: 'text-brand-blue'  },
                  { xp: '200 XP',  reward: 'Eligible to upgrade to Nova',       color: 'text-blue-400'    },
                  { xp: '500 XP',  reward: '50% discount on Nova subscription', color: 'text-blue-400'    },
                  { xp: '800 XP',  reward: 'Eligible to upgrade to Galaxy',     color: 'text-purple-400'  },
                  { xp: '2000 XP', reward: 'Eligible for Supernova + 50% off Galaxy', color: 'text-amber-400' },
                ].map(row => (
                  <div key={row.xp} className="flex items-center gap-4 py-2.5 border-b border-dark-700 last:border-0">
                    <span className="text-green-400 font-extrabold text-sm w-20 flex-shrink-0">{row.xp}</span>
                    <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span className={`text-sm font-medium ${row.color}`}>{row.reward}</span>
                  </div>
                ))}
              </PolicyCard>

              <PolicyCard title="Anti-Abuse Protections" icon={Shield} iconColor="text-red-400">
                <RuleRow icon="🧟" label="Zombie Check-in Prevention">
                  If you have not meaningfully interacted with the platform (views, likes, comments, articles) for 3 or more consecutive days, your daily check-in will award 0 XP until you engage again.
                </RuleRow>
                <RuleRow icon="❄️" label="Inactivity Freeze">
                  Accounts inactive for 180 days will have their XP frozen. XP will unfreeze automatically once you return and engage.
                </RuleRow>
                <RuleRow icon="🔒" label="Daily Caps">
                  View XP is capped at 5 per day. Like XP is capped at 10 per day. These limits reset at midnight.
                </RuleRow>
                <RuleRow icon="⚠️" label="Abuse Consequences">
                  Attempts to artificially inflate XP through coordinated liking, bot activity, or other manipulation will result in XP resets and account suspension.
                </RuleRow>
              </PolicyCard>
            </div>
          )}

          {/* ── Moderation ── */}
          {active === 'moderation' && (
            <div className="space-y-6">
              <SectionHeader icon={Shield} color="text-purple-400" title="Content Moderation" subtitle="How content is reviewed and what happens when rules are broken." />

              <PolicyCard title="Review Process" icon={Clock} iconColor="text-brand-blue">
                <RuleRow icon="🤖" label="AI Initial Review">
                  All posts and comments are automatically screened by our AI moderation system for prohibited content including hate speech, spam, and medical misinformation.
                </RuleRow>
                <RuleRow icon="👤" label="Human Review">
                  Flagged content is escalated to human moderators for final judgment. Moderators aim to review escalated content within 24 hours.
                </RuleRow>
                <RuleRow icon="🚩" label="Community Flagging">
                  Members can flag content they believe violates these policies. Flagged posts are placed in a review queue and may be temporarily hidden pending review.
                </RuleRow>
              </PolicyCard>

              <PolicyCard title="Enforcement Actions" icon={AlertTriangle} iconColor="text-amber-400">
                <div className="space-y-3">
                  {[
                    { level: 'Warning',          color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',  desc: 'First-time or minor violations. A notice is sent explaining the issue. No immediate action taken.' },
                    { level: 'Content Removal',  color: 'bg-orange-500/10 border-orange-500/20 text-orange-400', desc: 'The offending post or comment is removed. Issued for clear rule violations or after prior warnings.' },
                    { level: 'Temporary Suspension', color: 'bg-red-500/10 border-red-500/20 text-red-400',   desc: 'Account access is restricted for 3–30 days depending on severity. Repeat or serious violations.' },
                    { level: 'Permanent Ban',    color: 'bg-red-900/20 border-red-800/30 text-red-500',         desc: 'Permanent removal from the platform. Reserved for severe violations, hate speech, or repeated offenses.' },
                  ].map(item => (
                    <div key={item.level} className={`p-4 rounded-xl border ${item.color.split(' ').slice(0,2).join(' ')}`}>
                      <p className={`text-xs font-extrabold uppercase tracking-wider mb-1 ${item.color.split(' ')[2]}`}>{item.level}</p>
                      <p className="text-slate-300 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </PolicyCard>

              <PolicyCard title="Appeals Process" icon={CheckCircle} iconColor="text-green-400">
                <RuleRow icon="📬" label="How to Appeal">
                  If you believe a moderation decision was made in error, you may submit an appeal through your profile settings within 14 days of the action.
                </RuleRow>
                <RuleRow icon="⏱️" label="Review Timeline">
                  Appeals are reviewed by a senior moderator within 5 business days. You will be notified of the outcome via in-app notification.
                </RuleRow>
                <RuleRow icon="⚖️" label="Final Decisions">
                  Appeal decisions are final. Repeated frivolous appeals may themselves be considered a violation of community standards.
                </RuleRow>
              </PolicyCard>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

// ── Sub-components ──────────────────────────────────

const SectionHeader: React.FC<{
  icon: React.ElementType; color: string; title: string; subtitle: string;
}> = ({ icon: Icon, color, title, subtitle }) => (
  <div className="flex items-start gap-4 pb-6 border-b border-dark-700">
    <div className="w-12 h-12 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center flex-shrink-0">
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <h2 className="text-2xl font-extrabold text-white">{title}</h2>
      <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
    </div>
  </div>
);

const PolicyCard: React.FC<{
  title: string; icon: React.ElementType; iconColor: string; children: React.ReactNode;
}> = ({ title, icon: Icon, iconColor, children }) => (
  <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <h3 className="text-white font-bold">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const RuleRow: React.FC<{
  icon: string; label: string; children: React.ReactNode;
}> = ({ icon, label, children }) => (
  <div className="flex gap-3">
    <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
    <div>
      <p className="text-white text-sm font-semibold mb-0.5">{label}</p>
      <p className="text-slate-400 text-sm leading-relaxed">{children}</p>
    </div>
  </div>
);
