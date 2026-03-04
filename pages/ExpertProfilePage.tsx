// pages/ExpertProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, Star, Zap, BookOpen, MessageSquare,
  Video, Phone, MessageCircle, Store, ChevronRight,
  Scissors, Briefcase, Truck, User, Award, Lock, Loader,
  Calendar, CheckCircle, ArrowLeft
} from 'lucide-react';
import { getExpertProfile } from '../services/expert.service';
import { getCurrentUser } from '../services/auth.service';
import { ExpertProfile, ExpertType, ConsultationMode, EXPERT_TYPE_LABELS, EXPERT_SPECIALTY_LABELS } from '../types';

// ── 常量/辅助 ──────────────────────────────────

const TYPE_ICONS: Record<ExpertType, React.ElementType> = {
  SALON_OWNER:      Store,
  STYLIST:          Scissors,
  MANUFACTURER_REP: Briefcase,
  DISTRIBUTOR:      Truck,
  INDEPENDENT:      User,
};

const MODE_CONFIG: Record<ConsultationMode, { icon: React.ElementType; label: string; color: string }> = {
  VIDEO:     { icon: Video,          label: 'Video Call',   color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  VOICE:     { icon: Phone,          label: 'Voice Call',   color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  TEXT:      { icon: MessageCircle,  label: 'Text Chat',    color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  IN_PERSON: { icon: Store,          label: 'In-Person',    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
};

// ── 主组件 ─────────────────────────────────────

export const ExpertProfilePage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'articles'>('about');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // 权限检查：仅 Nova+ 可见
  const userTier = (currentUser as any)?.galaxyLevel || 'NEBULA';
  const canView = ['NOVA', 'GALAXY', 'SUPERNOVA'].includes(userTier);

  useEffect(() => {
    if (!uid) return;
    getExpertProfile(uid).then(p => {
      setExpert(p);
      setLoading(false);
    });
  }, [uid]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader className="w-8 h-8 text-brand-blue animate-spin" />
    </div>
  );

  // ── 权限门控 ────────────────────────────────
  if (!currentUser) return (
    <GatePage
      icon={<Lock className="w-10 h-10 text-slate-500" />}
      title="Sign in to view expert profiles"
      action={{ label: 'Sign In', to: '/login' }}
    />
  );

  if (!canView) return (
    <GatePage
      icon={<Star className="w-10 h-10 text-amber-400" />}
      title="Nova membership required"
      desc="Upgrade to Nova or above to access expert profiles and book consultations."
      action={{ label: 'View Plans', to: '/membership' }}
      tier
    />
  );

  if (!expert) return (
    <GatePage
      icon={<User className="w-10 h-10 text-slate-500" />}
      title="Expert not found"
      desc="This expert profile doesn't exist or has been deactivated."
      action={{ label: 'Go Back', to: '/consultations' }}
    />
  );

  const TypeIcon = TYPE_ICONS[expert.expertType] || User;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 px-4">

      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> All Experts
      </button>

      {/* ── Hero Card ── */}
      <div className="bg-dark-800 border border-dark-700 rounded-3xl overflow-hidden">

        {/* Banner */}
        <div className="h-32 md:h-48 bg-gradient-to-br from-brand-blue/20 via-brand-purple/20 to-dark-900 relative">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f620 0%, transparent 60%), radial-gradient(circle at 80% 20%, #8b5cf620 0%, transparent 60%)' }}
          />
          {/* Expert badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Verified Expert</span>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-dark-800 overflow-hidden bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center flex-shrink-0 shadow-xl">
                {expert.photoURL ? (
                  <img src={expert.photoURL} alt={expert.displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-white">{expert.displayName.charAt(0)}</span>
                )}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{expert.displayName}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <TypeIcon className="w-4 h-4" />
                    <span>{EXPERT_TYPE_LABELS[expert.expertType]}</span>
                  </div>
                  <span className="text-slate-700">·</span>
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{expert.serviceCity}, {expert.serviceCountry}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Book CTA */}
            <div className="sm:pb-1">
              {expert.consultationEnabled ? (
                <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm">
                  <Calendar className="w-4 h-4" /> Book Consultation
                  {expert.consultationPrice && (
                    <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      ${expert.consultationPrice}
                    </span>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-dark-700 border border-dark-600 text-slate-500 rounded-xl text-sm">
                  <Calendar className="w-4 h-4" /> Bookings Unavailable
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-dark-900 border border-dark-700 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">{expert.yearsOfExperience}</div>
              <div className="text-xs text-slate-500 mt-0.5">Years Exp.</div>
            </div>
            <div className="bg-dark-900 border border-dark-700 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">{expert.publishedArticleCount}</div>
              <div className="text-xs text-slate-500 mt-0.5">Articles</div>
            </div>
            <div className="bg-dark-900 border border-dark-700 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">{expert.totalConsultations}</div>
              <div className="text-xs text-slate-500 mt-0.5">Consultations</div>
            </div>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-2 mb-6">
            {expert.specialties.map(s => (
              <span key={s} className="px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-xs font-semibold text-brand-blue">
                {EXPERT_SPECIALTY_LABELS[s] || s}
              </span>
            ))}
          </div>

          {/* Consultation modes */}
          <div className="flex flex-wrap gap-2">
            {expert.consultationModes.map(m => {
              const cfg = MODE_CONFIG[m];
              const Icon = cfg.icon;
              return (
                <span key={m} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.color}`}>
                  <Icon className="w-3 h-3" /> {cfg.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-2xl p-1">
        {(['about', 'portfolio', 'articles'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl capitalize transition-all ${
              activeTab === tab ? 'bg-dark-700 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── About Tab ── */}
      {activeTab === 'about' && (
        <div className="space-y-5">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">About</h3>
            <p className="text-slate-300 leading-relaxed">{expert.bio}</p>
          </div>
          {expert.credentials && (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Credentials & Certifications
              </h3>
              <p className="text-slate-300 leading-relaxed">{expert.credentials}</p>
            </div>
          )}
          {/* Consultation booking CTA box */}
          <div className="bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 border border-brand-blue/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="text-white font-bold mb-1">Book a Consultation</h3>
              <p className="text-slate-400 text-sm">Get personalized advice directly from {expert.displayName.split(' ')[0]}.</p>
            </div>
            {expert.consultationEnabled ? (
              <button className="flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all whitespace-nowrap shadow-lg shadow-blue-500/20">
                <Calendar className="w-4 h-4" /> Book Now
              </button>
            ) : (
              <div className="text-slate-500 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> Currently unavailable
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Portfolio Tab ── */}
      {activeTab === 'portfolio' && (
        <div>
          {expert.portfolioImages.length === 0 ? (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-12 text-center text-slate-500">
              No portfolio images yet
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {expert.portfolioImages.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxImg(url)}
                  className="aspect-square rounded-2xl overflow-hidden group relative"
                >
                  <img src={url} alt={`Work ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Articles Tab ── */}
      {activeTab === 'articles' && (
        <div>
          {expert.publishedArticleCount === 0 ? (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-12 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-slate-500">No published articles yet</p>
            </div>
          ) : (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">{expert.publishedArticleCount} article{expert.publishedArticleCount !== 1 ? 's' : ''} published</p>
              <Link to="/kb" className="flex items-center gap-2 mt-4 text-brand-blue hover:text-blue-400 text-sm font-semibold transition-colors">
                Browse Knowledge Base <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <img
            src={lightboxImg}
            alt="Portfolio"
            className="max-w-full max-h-full rounded-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

// ── Gate 组件 ─────────────────────────────────

const GatePage: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc?: string;
  action: { label: string; to: string };
  tier?: boolean;
}> = ({ icon, title, desc, action, tier }) => (
  <div className="max-w-md mx-auto py-20 text-center space-y-5 px-4">
    <div className="w-20 h-20 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center mx-auto">
      {icon}
    </div>
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    {desc && <p className="text-slate-400">{desc}</p>}
    {tier && (
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
        <Star className="w-4 h-4 text-amber-400" />
        Nova · Galaxy · Supernova members only
      </div>
    )}
    <Link
      to={action.to}
      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all"
    >
      {action.label} <ChevronRight className="w-4 h-4" />
    </Link>
  </div>
);
