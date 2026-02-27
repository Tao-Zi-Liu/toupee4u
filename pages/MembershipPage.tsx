import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Crown, Check, Sparkles, Orbit, ArrowRight, Loader } from 'lucide-react';
import { getCurrentUser, getCompleteUserProfile} from '../services/auth.service';
import { getUserXPStats, checkDiscountEligibility, useDiscount } from '../services/xp.service';
import { UserXPStats, XP_POST_THRESHOLD, XP_DISCOUNT_THRESHOLDS } from '../types';
import { UserTier } from '../types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

// XP 门槛：付费 + XP 双重条件才能升级
const XP_UNLOCK_THRESHOLDS: Partial<Record<UserTier, number>> = {
  [UserTier.NOVA]: 200,
  [UserTier.GALAXY]: 800,
  [UserTier.SUPERNOVA]: 2000,
};

// ✅ 修复：键名使用 UserTier 枚举值（'Nebula'、'Nova' 等），而不是 'NEBULA'、'NOVA'
const TIER_CONFIG: Record<UserTier, {
  name: string;
  price: string;
  icon: React.ElementType;
  colorClass: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  features: string[];
}> = {
  [UserTier.NEBULA]: {
    name: 'Nebula',
    price: 'Free',
    icon: Shield,
    colorClass: 'slate',
    bgGradient: 'from-slate-600 to-slate-800',
    borderColor: 'border-slate-500',
    textColor: 'text-slate-400',
    features: [
      'Access to community forums',
      'Basic knowledge base articles',
      'Standard support',
      'View all discussions'
    ]
  },
  [UserTier.NOVA]: {
    name: 'Nova',
    price: '$9/month',
    icon: Zap,
    colorClass: 'blue',
    bgGradient: 'from-blue-500 to-blue-700',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400',
    features: [
      'Everything in Nebula',
      'Advanced KB articles',
      'Priority support',
      'Expert Q&A access',
      'Ad-free experience'
    ]
  },
  [UserTier.GALAXY]: {
    name: 'Galaxy',
    price: '$19/month',
    icon: Orbit,
    colorClass: 'purple',
    bgGradient: 'from-purple-500 to-purple-700',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    features: [
      'Everything in Nova',
      'Premium KB content',
      '1-on-1 expert consultations',
      'Early access to new features',
      'Custom profile badge'
    ]
  },
  [UserTier.SUPERNOVA]: {
    name: 'Supernova',
    price: '$49/month',
    icon: Sparkles,
    colorClass: 'amber',
    bgGradient: 'from-amber-500 to-amber-700',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-400',
    features: [
      'Everything in Galaxy',
      'Unlimited expert access',
      'Exclusive research reports',
      'Private community channels',
      'Priority feature requests'
    ]
  }
};

export const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTier, setCurrentTier] = useState<UserTier>(UserTier.NEBULA);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<UserTier | null>(null);
  const [xpStats, setXpStats] = useState<UserXPStats | null>(null);
  const [discountEligibility, setDiscountEligibility] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const user = getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const profile = await getCompleteUserProfile(user.uid);
      if (profile) {
        const tierMap: { [k: string]: UserTier } = {
          'NEBULA': UserTier.NEBULA,
          'NOVA': UserTier.NOVA,
          'GALAXY': UserTier.GALAXY,
          'SUPERNOVA': UserTier.SUPERNOVA
        };
        setCurrentTier(tierMap[profile.galaxyLevel] || UserTier.NEBULA);
      }
      // 加载XP积分和折扣资格
      const [stats, discount] = await Promise.all([
        getUserXPStats(user.uid),
        checkDiscountEligibility(user.uid)
      ]);
      setXpStats(stats);
      setDiscountEligibility(discount);
      setLoading(false);
    }
    loadProfile();
  }, [navigate]);

  // 计算折扣后价格
  const getDiscountedPrice = (tier: UserTier): { original: string; discounted: string | null; hasDiscount: boolean } => {
    const prices: Record<string, number> = { Nova: 9, Galaxy: 19, Supernova: 49 };
    const name = TIER_CONFIG[tier].name;
    const base = prices[name];
    if (!base) return { original: TIER_CONFIG[tier].price, discounted: null, hasDiscount: false };

    if (name === 'Nova' && discountEligibility?.novaDiscount) {
      return { original: `$${base}/month`, discounted: `$${base / 2}/month`, hasDiscount: true };
    }
    if (name === 'Galaxy' && discountEligibility?.galaxyDiscount) {
      return { original: `$${base}/month`, discounted: `$${base / 2}/month`, hasDiscount: true };
    }
    return { original: TIER_CONFIG[tier].price, discounted: null, hasDiscount: false };
  };

  const handleUpgrade = async (tier: UserTier) => {
    const user = getCurrentUser();
    if (!user) return;

    setSelectedTier(tier);
    setUpgrading(true);

    try {
      // 模拟支付处理延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 标记折扣已使用
      const tierName = TIER_CONFIG[tier].name;
      if (tierName === 'Nova' && discountEligibility?.novaDiscount) {
        await useDiscount(user.uid, 'NOVA_HALF_PRICE');
      } else if (tierName === 'Galaxy' && discountEligibility?.galaxyDiscount) {
        await useDiscount(user.uid, 'GALAXY_HALF_PRICE');
      }

      // 直接更新用户等级
      await setDoc(doc(db, 'users', user.uid), {
        galaxyLevel: tier
      }, { merge: true });

      setCurrentTier(tier);
      setSelectedTier(null);
      alert(`Successfully upgraded to ${TIER_CONFIG[tier].name}!`);
      window.location.reload();
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Upgrade failed. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  const tierOrder = [UserTier.NEBULA, UserTier.NOVA, UserTier.GALAXY, UserTier.SUPERNOVA];
  const currentTierIndex = tierOrder.indexOf(currentTier);

  // 检查某个等级的 XP 是否达标
  const getXPStatus = (tier: UserTier): { required: number; current: number; met: boolean; needed: number } => {
    const required = XP_UNLOCK_THRESHOLDS[tier] ?? 0;
    const current = xpStats?.totalXp ?? 0;
    return { required, current, met: current >= required, needed: Math.max(0, required - current) };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-brand-blue text-sm font-bold">
          <Crown className="w-4 h-4" />
          Membership Plans
        </div>
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          Unlock Your Full Potential
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Choose the plan that fits your journey. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Current Tier Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-dark-800 border border-dark-700 rounded-2xl">
          <span className="text-slate-400 text-sm">Current Plan:</span>
          <span className={`font-bold ${TIER_CONFIG[currentTier].textColor}`}>
            {TIER_CONFIG[currentTier].name}
          </span>
        </div>
      </div>

      {/* XP 积分横幅 */}
      {xpStats && (
        <div className="max-w-2xl mx-auto bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span className="text-white font-bold">Your XP</span>
              <span className="text-2xl font-extrabold text-white ml-1">{xpStats.availableXp}</span>
            </div>
            <div className="text-right">
              {discountEligibility?.novaDiscount && (
                <span className="px-3 py-1 bg-brand-blue/20 border border-brand-blue/30 text-brand-blue text-xs font-bold rounded-full mr-2">Nova 50% OFF</span>
              )}
              {discountEligibility?.galaxyDiscount && (
                <span className="px-3 py-1 bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-xs font-bold rounded-full">Galaxy 50% OFF</span>
              )}
              {!discountEligibility?.novaDiscount && !discountEligibility?.galaxyDiscount && (
                <span className="text-slate-500 text-xs">Earn 500 XP for Nova discount</span>
              )}
            </div>
          </div>
          <div className="h-1.5 bg-dark-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-blue rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (xpStats.availableXp / XP_DISCOUNT_THRESHOLDS.NOVA_HALF_PRICE) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>0</span>
            <span>500 XP → Nova 50% off</span>
            <span>2000 XP → Galaxy 50% off</span>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tierOrder.map((tier, index) => {
          const config = TIER_CONFIG[tier];
          const Icon = config.icon;
          const isCurrent = tier === currentTier;
          const isUpgrade = index > currentTierIndex;
          const xpStatus = getXPStatus(tier);
          const xpMet = tier === UserTier.NEBULA || xpStatus.met;
          const canChange = !isCurrent && tier !== UserTier.NEBULA && xpMet;

          return (
            <div
              key={tier}
              className={`relative rounded-3xl p-8 border-2 transition-all ${
                isCurrent
                  ? `${config.borderColor} bg-${config.colorClass}-500/5`
                  : 'border-dark-700 bg-dark-800 hover:border-dark-600'
              }`}
            >
              {isCurrent && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r ${config.bgGradient} text-white text-xs font-bold rounded-full shadow-lg`}>
                  CURRENT PLAN
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.bgGradient} flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{config.name}</h3>
                {(() => {
                  const priceInfo = getDiscountedPrice(tier);
                  return priceInfo.hasDiscount ? (
                    <div>
                      <div className="text-lg line-through text-slate-600">{priceInfo.original}</div>
                      <div className="text-3xl font-extrabold text-green-400">{priceInfo.discounted}</div>
                      <div className="text-xs font-bold text-green-500 mt-1">🎉 50% XP Discount Applied</div>
                    </div>
                  ) : (
                    <div className="text-3xl font-extrabold text-white">
                      {config.price.split('/')[0]}
                      {config.price.includes('/') && (
                        <span className="text-sm text-slate-500">/{config.price.split('/')[1]}</span>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* XP 门槛要求 */}
              {tier !== UserTier.NEBULA && (
                <div className={`mb-5 p-3 rounded-xl border ${xpMet ? 'border-green-500/20 bg-green-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">⚡ XP Required</span>
                    <span className={`text-xs font-bold ${xpMet ? 'text-green-400' : 'text-amber-400'}`}>
                      {xpStatus.current} / {xpStatus.required} XP
                    </span>
                  </div>
                  <div className="h-1.5 bg-dark-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${xpMet ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, (xpStatus.current / xpStatus.required) * 100)}%` }}
                    />
                  </div>
                  {!xpMet && (
                    <p className="text-amber-400 text-xs mt-1.5 font-medium">
                      Need {xpStatus.needed} more XP to unlock
                    </p>
                  )}
                  {xpMet && (
                    <p className="text-green-400 text-xs mt-1.5 font-medium">✓ XP requirement met!</p>
                  )}
                </div>
              )}

              <ul className="space-y-3 mb-8">
                {config.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => canChange ? handleUpgrade(tier) : null}
                disabled={!canChange || upgrading}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-dark-700 text-slate-500 cursor-not-allowed'
                    : tier === UserTier.NEBULA
                    ? 'bg-dark-700 text-slate-500 cursor-not-allowed'
                    : !xpMet
                    ? 'bg-dark-700 text-amber-500/70 cursor-not-allowed border border-amber-500/20'
                    : upgrading
                    ? 'bg-dark-700 text-slate-500 cursor-not-allowed'
                    : isUpgrade
                    ? `bg-gradient-to-r ${config.bgGradient} text-white hover:opacity-90 shadow-lg`
                    : 'bg-dark-700 text-slate-300 hover:bg-dark-600'
                }`}
              >
                {upgrading && selectedTier === tier ? (
                  <><Loader className="w-4 h-4 animate-spin" /> Processing...</>
                ) : isCurrent ? (
                  'Current Plan'
                ) : tier === UserTier.NEBULA ? (
                  'Free Tier'
                ) : !xpMet ? (
                  <>⚡ Need {xpStatus.needed} more XP</>
                ) : isUpgrade ? (
                  <>Upgrade Now <ArrowRight className="w-4 h-4" /></>
                ) : (
                  'Downgrade'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-1">Why do I need XP to upgrade?</h4>
            <p className="text-slate-400 text-sm">We believe great communities are built by engaged members. XP requirements ensure that premium tiers are available to members who actively contribute — Nova requires 200 XP, Galaxy 800 XP, and Supernova 2000 XP. Earn XP by reading articles, commenting, and participating daily.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-1">Can I cancel anytime?</h4>
            <p className="text-slate-400 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-1">What payment methods do you accept?</h4>
            <p className="text-slate-400 text-sm">Currently using simulated payments. Real payment integration coming soon.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-1">What happens to my content if I downgrade?</h4>
            <p className="text-slate-400 text-sm">Your posts and contributions remain accessible. You'll only lose access to premium features.</p>
          </div>
        </div>
      </div>
    </div>
  );
};