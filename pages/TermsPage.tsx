import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, User, CreditCard, Shield, BookOpen, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

type Section = 'acceptance' | 'accounts' | 'membership' | 'conduct' | 'ip' | 'disclaimers' | 'termination' | 'changes';

const sections: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'acceptance',   label: 'Acceptance of Terms',     icon: FileText      },
  { id: 'accounts',     label: 'User Accounts',           icon: User          },
  { id: 'membership',   label: 'Membership & Payments',   icon: CreditCard    },
  { id: 'conduct',      label: 'Prohibited Conduct',      icon: Shield        },
  { id: 'ip',           label: 'Intellectual Property',   icon: BookOpen      },
  { id: 'disclaimers',  label: 'Disclaimers & Liability', icon: AlertTriangle },
  { id: 'termination',  label: 'Termination',             icon: XCircle       },
  { id: 'changes',      label: 'Changes to Terms',        icon: RefreshCw     },
];

export const TermsPage: React.FC = () => {
  const [active, setActive] = useState<Section>('acceptance');

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-brand-blue" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        </div>
        <p className="text-slate-400 text-sm max-w-xl">
          Please read these terms carefully before using Toupee4U. By accessing or using our platform, you agree to be bound by these terms.
        </p>
        <p className="text-slate-600 text-xs mt-2">Effective date: February 1, 2026 · Last updated: February 2026</p>
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
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active === s.id ? 'text-brand-blue' : ''}`} />
                  <span className="text-xs">{s.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-6 pt-4 border-t border-dark-700 space-y-2">
            <Link to="/policy" className="block text-xs text-slate-600 hover:text-slate-400 transition-colors">Community Policy</Link>
            <Link to="/privacy" className="block text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacy Policy</Link>
          </div>
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden w-full mb-6 flex gap-2 overflow-x-auto pb-2">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  active === s.id ? 'bg-dark-700 text-white border border-dark-600' : 'bg-dark-800 text-slate-500'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0 space-y-0">

          {active === 'acceptance' && (
            <Section title="Acceptance of Terms" icon={FileText}>
              <P>By accessing or using Toupee4U ("the Platform", "we", "us", or "our"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</P>
              <P>These Terms apply to all visitors, users, and others who access or use the Platform. By creating an account, you represent that you are at least 18 years of age and have the legal capacity to enter into a binding agreement.</P>
              <P>Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes. It is your responsibility to check these Terms periodically for updates.</P>
              <Callout type="info">If you are using the Platform on behalf of an organization, you represent that you have authority to bind that organization to these Terms.</Callout>
            </Section>
          )}

          {active === 'accounts' && (
            <Section title="User Accounts & Responsibilities" icon={User}>
              <P>To access certain features of the Platform, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</P>
              <H3>Account Creation</H3>
              <P>When creating an account, you agree to provide accurate, current, and complete information. You must not impersonate any person or entity or misrepresent your affiliation with any person or entity.</P>
              <H3>Account Security</H3>
              <P>You are solely responsible for safeguarding your password. You agree to notify us immediately of any unauthorized use of your account. We cannot and will not be liable for any loss or damage arising from your failure to comply with this requirement.</P>
              <H3>Account Termination</H3>
              <P>We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or have been inactive for an extended period. You may delete your account at any time through your profile settings.</P>
              <Callout type="warning">You may not transfer, sell, or otherwise assign your account to another person without our prior written consent.</Callout>
            </Section>
          )}

          {active === 'membership' && (
            <Section title="Membership & Payments" icon={CreditCard}>
              <P>Toupee4U offers both free and paid membership tiers. Paid memberships provide access to additional features and content as described on our Membership page.</P>
              <H3>Billing</H3>
              <P>Paid subscriptions are billed on a monthly basis. By providing payment information, you authorize us to charge the applicable fees to your payment method. All fees are in USD and are non-refundable except as required by law.</P>
              <H3>XP Requirements</H3>
              <P>Upgrading to paid tiers requires both a subscription payment and a minimum XP threshold. The XP requirements are clearly displayed on the Membership page before any purchase. We reserve the right to modify these thresholds with reasonable notice.</P>
              <H3>Cancellations & Refunds</H3>
              <P>You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period — you retain access to paid features until that date. We do not provide prorated refunds for partial billing periods.</P>
              <H3>Price Changes</H3>
              <P>We reserve the right to modify subscription prices with at least 30 days' notice. Continued use of paid features after a price change constitutes acceptance of the new pricing.</P>
              <Callout type="info">Discounts earned through XP milestones are one-time use only and cannot be combined with other promotional offers.</Callout>
            </Section>
          )}

          {active === 'conduct' && (
            <Section title="Prohibited Conduct" icon={Shield}>
              <P>You agree not to engage in any of the following activities while using the Platform:</P>
              <H3>Content Violations</H3>
              <ul className="space-y-2 text-slate-400 text-sm ml-4">
                {[
                  'Posting spam, unsolicited advertising, or repetitive low-effort content',
                  'Sharing false, misleading, or unverified medical information presented as fact',
                  'Uploading content that infringes on intellectual property rights',
                  'Posting content that is harassing, threatening, defamatory, or discriminatory',
                  'Sharing explicit sexual content or content involving minors',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <H3>Platform Abuse</H3>
              <ul className="space-y-2 text-slate-400 text-sm ml-4">
                {[
                  'Attempting to artificially inflate XP through bots, scripts, or coordinated activity',
                  'Creating multiple accounts to circumvent bans or restrictions',
                  'Attempting to access restricted areas of the Platform without authorization',
                  'Reverse engineering, decompiling, or disassembling any part of the Platform',
                  'Interfering with or disrupting the integrity or performance of the Platform',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Callout type="warning">Violations may result in immediate account suspension or permanent ban without refund of any prepaid subscription fees.</Callout>
            </Section>
          )}

          {active === 'ip' && (
            <Section title="Intellectual Property" icon={BookOpen}>
              <H3>Our Content</H3>
              <P>The Platform and its original content, features, and functionality are owned by Toupee4U and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</P>
              <H3>User Content</H3>
              <P>By posting content on the Platform, you grant Toupee4U a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display that content in connection with operating and improving the Platform.</P>
              <P>You retain ownership of any content you submit. You represent and warrant that you own or have the necessary rights to the content you post, and that posting it does not violate any third party's rights.</P>
              <H3>Knowledge Base Content</H3>
              <P>All Knowledge Base articles, guides, and educational materials produced by Toupee4U are proprietary. You may not reproduce, distribute, or create derivative works from this content without our explicit written permission.</P>
              <Callout type="info">If you believe content on the Platform infringes your intellectual property rights, please contact us with a detailed description of the alleged infringement.</Callout>
            </Section>
          )}

          {active === 'disclaimers' && (
            <Section title="Disclaimers & Limitation of Liability" icon={AlertTriangle}>
              <H3>No Medical Advice</H3>
              <P>The Platform provides general information and community discussion related to hair systems and related products. Nothing on this Platform constitutes professional medical advice. Always consult a qualified healthcare professional for medical concerns.</P>
              <H3>Disclaimer of Warranties</H3>
              <P>The Platform is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components.</P>
              <H3>Limitation of Liability</H3>
              <P>To the maximum extent permitted by law, Toupee4U shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, even if we have been advised of the possibility of such damages.</P>
              <P>Our total liability to you for all claims arising from your use of the Platform shall not exceed the amount you paid us in the twelve months preceding the claim.</P>
              <Callout type="warning">Some jurisdictions do not allow the exclusion of certain warranties or limitations on liability. In such cases, our liability will be limited to the fullest extent permitted by applicable law.</Callout>
            </Section>
          )}

          {active === 'termination' && (
            <Section title="Termination" icon={XCircle}>
              <H3>Termination by You</H3>
              <P>You may stop using the Platform at any time. You can delete your account through your profile settings. Upon deletion, your personal data will be removed within 30 days, except where retention is required by law.</P>
              <H3>Termination by Us</H3>
              <P>We may suspend or permanently terminate your access to the Platform at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, third parties, or the integrity of the Platform.</P>
              <H3>Effect of Termination</H3>
              <P>Upon termination, your right to use the Platform will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.</P>
              <P>We are not obligated to retain or provide copies of your content after account termination. We recommend exporting any content you wish to keep before closing your account.</P>
              <Callout type="info">Paid subscription fees are non-refundable upon termination for violations of these Terms.</Callout>
            </Section>
          )}

          {active === 'changes' && (
            <Section title="Changes to Terms" icon={RefreshCw}>
              <P>We reserve the right to modify these Terms at any time. When we make material changes, we will notify you through the Platform or by email at least 14 days before the changes take effect.</P>
              <P>Your continued use of the Platform after the effective date of the revised Terms constitutes your acceptance of the changes. If you do not agree to the new Terms, you must stop using the Platform before they take effect.</P>
              <H3>Governing Law</H3>
              <P>These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts.</P>
              <H3>Contact Us</H3>
              <P>If you have any questions about these Terms of Service, please contact us through the Platform's support channels or visit our Community Policy page for additional guidelines.</P>
              <div className="flex gap-3 mt-4">
                <Link to="/policy" className="px-4 py-2 bg-dark-700 border border-dark-600 text-slate-300 hover:text-white text-sm font-medium rounded-xl transition-colors">
                  Community Policy
                </Link>
                <Link to="/privacy" className="px-4 py-2 bg-dark-700 border border-dark-600 text-slate-300 hover:text-white text-sm font-medium rounded-xl transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </Section>
          )}

        </main>
      </div>
    </div>
  );
};

// ── Sub-components ──────────────────────────────────
const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-start gap-4 pb-6 border-b border-dark-700">
      <div className="w-12 h-12 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-brand-blue" />
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-white">{title}</h2>
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-slate-400 text-sm leading-relaxed">{children}</p>
);

const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-white font-bold text-base mt-6 mb-2">{children}</h3>
);

const Callout: React.FC<{ type: 'info' | 'warning'; children: React.ReactNode }> = ({ type, children }) => (
  <div className={`p-4 rounded-xl border text-sm mt-4 ${
    type === 'info'
      ? 'bg-brand-blue/5 border-brand-blue/20 text-blue-300'
      : 'bg-amber-500/5 border-amber-500/20 text-amber-300'
  }`}>
    {children}
  </div>
);
