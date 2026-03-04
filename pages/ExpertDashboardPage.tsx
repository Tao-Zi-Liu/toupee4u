// pages/ExpertDashboardPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, BookOpen, Settings, ChevronRight, Plus,
  FileText, Clock, CheckCircle, XCircle, Trash2,
  Eye, Edit3, Send, ToggleLeft, ToggleRight,
  Save, Loader, AlertCircle, Award, Video,
  Phone, MessageSquare, Users
} from 'lucide-react';
import { getCurrentUser } from '../services/auth.service';
import {
  getExpertProfile, updateExpertProfile,
  getExpertDrafts, saveExpertDraft,
  submitDraftForReview, deleteExpertDraft
} from '../services/expert.service';
import { ExpertProfile, ExpertDraft, ExpertDraftStatus, ConsultationMode } from '../types';

// ── 常量 ─────────────────────────────────────
const DRAFT_STATUS_CONFIG: Record<ExpertDraftStatus, { label: string; color: string }> = {
  DRAFT:          { label: 'Draft',          color: 'text-slate-400 bg-slate-400/10 border-slate-400/20' },
  PENDING_REVIEW: { label: 'Under Review',   color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  PUBLISHED:      { label: 'Published',      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  REJECTED:       { label: 'Rejected',       color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

const CONSULTATION_MODE_CONFIG: Record<ConsultationMode, { label: string; icon: React.ElementType; color: string }> = {
  VIDEO:     { label: 'Video Call',   icon: Video,         color: 'text-brand-blue' },
  VOICE:     { label: 'Voice Call',   icon: Phone,         color: 'text-emerald-400' },
  TEXT:      { label: 'Text Chat',    icon: MessageSquare, color: 'text-brand-purple' },
  IN_PERSON: { label: 'In Person',    icon: Users,         color: 'text-amber-400' },
};

const TABS = [
  { key: 'overview',  label: 'Overview',  icon: Star },
  { key: 'articles',  label: 'Articles',  icon: BookOpen },
  { key: 'settings',  label: 'Settings',  icon: Settings },
] as const;

type TabKey = typeof TABS[number]['key'];

// ── 主组件 ────────────────────────────────────
export const ExpertDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [drafts, setDrafts] = useState<ExpertDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser();
      if (!user) return;
      setCurrentUserId(user.uid);
      const [prof, draftList] = await Promise.all([
        getExpertProfile(user.uid),
        getExpertDrafts(user.uid),
      ]);
      setProfile(prof);
      setDrafts(draftList);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4 px-4">
        <Star className="w-16 h-16 text-amber-400 mx-auto opacity-50" />
        <h2 className="text-2xl font-bold text-white">Not an Expert Yet</h2>
        <p className="text-slate-400">Your expert profile hasn't been set up. Apply first.</p>
        <Link to="/expert/apply" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-all">
          Apply as Expert <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Hero */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-amber-500/20 via-brand-blue/20 to-brand-purple/20" />
        <div className="px-6 pb-6 -mt-10 flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-dark-800 flex-shrink-0">
              {profile.displayName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white">{profile.displayName}</h1>
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Star className="w-3 h-3 fill-amber-400" /> Verified Expert
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-0.5">
                {profile.serviceCity}, {profile.serviceCountry} · {profile.yearsOfExperience}y exp
              </p>
            </div>
          </div>
          <Link
            to={`/expert/${currentUserId}`}
            className="flex items-center gap-2 px-4 py-2 bg-dark-700 border border-dark-600 text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-all"
          >
            <Eye className="w-4 h-4" /> View Public Profile
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Articles Published', value: profile.publishedArticleCount, icon: BookOpen, color: 'text-brand-blue' },
          { label: 'Consultations', value: profile.totalConsultations, icon: Users, color: 'text-emerald-400' },
          { label: 'Booking Status', value: profile.consultationEnabled ? 'Open' : 'Closed', icon: Star, color: profile.consultationEnabled ? 'text-emerald-400' : 'text-slate-500' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4 text-center">
            <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.key ? 'bg-dark-700 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <OverviewTab profile={profile} drafts={drafts} />
      )}
      {activeTab === 'articles' && (
        <ArticlesTab
          userId={currentUserId!}
          drafts={drafts}
          setDrafts={setDrafts}
        />
      )}
      {activeTab === 'settings' && (
        <SettingsTab
          profile={profile}
          setProfile={setProfile}
          userId={currentUserId!}
        />
      )}
    </div>
  );
};

// ── Overview Tab ──────────────────────────────
const OverviewTab: React.FC<{ profile: ExpertProfile; drafts: ExpertDraft[] }> = ({ profile, drafts }) => {
  const published = drafts.filter(d => d.status === 'PUBLISHED').length;
  const pending = drafts.filter(d => d.status === 'PENDING_REVIEW').length;
  const draftCount = drafts.filter(d => d.status === 'DRAFT').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Article summary */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-blue" /> Article Summary
        </h3>
        {[
          { label: 'Published', value: published, color: 'text-emerald-400' },
          { label: 'Under Review', value: pending, color: 'text-amber-400' },
          { label: 'Drafts', value: draftCount, color: 'text-slate-400' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-sm text-slate-400">{item.label}</span>
            <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Consultation status */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> Consultation Info
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Booking</span>
          <span className={`text-sm font-bold ${profile.consultationEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
            {profile.consultationEnabled ? 'Open' : 'Closed'}
          </span>
        </div>
        {profile.consultationPrice && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Rate</span>
            <span className="text-sm font-bold text-white">${profile.consultationPrice}/session</span>
          </div>
        )}
        <div>
          <span className="text-xs text-slate-500 block mb-2">Modes</span>
          <div className="flex flex-wrap gap-2">
            {profile.consultationModes?.map(mode => {
              const cfg = CONSULTATION_MODE_CONFIG[mode];
              return (
                <span key={mode} className="flex items-center gap-1 text-xs px-2 py-1 bg-dark-700 rounded-lg text-slate-300">
                  <cfg.icon className={`w-3 h-3 ${cfg.color}`} /> {cfg.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent drafts */}
      <div className="md:col-span-2 bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-purple" /> Recent Articles
          </h3>
        </div>
        {drafts.length === 0 ? (
          <p className="text-slate-500 text-sm py-4 text-center">No articles yet. Start writing!</p>
        ) : (
          drafts.slice(0, 4).map(draft => {
            const cfg = DRAFT_STATUS_CONFIG[draft.status];
            return (
              <div key={draft.id} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl">
                <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{draft.title || 'Untitled'}</p>
                  <p className="text-xs text-slate-500">{draft.category}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ── Articles Tab ──────────────────────────────
const ArticlesTab: React.FC<{
  userId: string;
  drafts: ExpertDraft[];
  setDrafts: React.Dispatch<React.SetStateAction<ExpertDraft[]>>;
}> = ({ userId, drafts, setDrafts }) => {
  const [editing, setEditing] = useState<ExpertDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const emptyDraft: Omit<ExpertDraft, 'id' | 'authorId' | 'createdAt' | 'updatedAt'> = {
    title: '', content: '', category: '', tags: [], status: 'DRAFT'
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const { id, authorId, createdAt, updatedAt, ...data } = editing as any;
      const savedId = await saveExpertDraft(userId, data, editing.id);
      const updated = { ...editing, id: savedId };
      setDrafts(prev => {
        const exists = prev.find(d => d.id === savedId);
        return exists ? prev.map(d => d.id === savedId ? updated : d) : [updated, ...prev];
      });
      setEditing(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!editing?.id) { await handleSave(); return; }
    setSubmitting(true);
    try {
      await submitDraftForReview(editing.id);
      const updated = { ...editing, status: 'PENDING_REVIEW' as ExpertDraftStatus };
      setDrafts(prev => prev.map(d => d.id === editing.id ? updated : d));
      setEditing(updated);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteExpertDraft(id);
    setDrafts(prev => prev.filter(d => d.id !== id));
    if (editing?.id === id) setEditing(null);
    setConfirmDelete(null);
  };

  return (
    <div className="flex gap-5 min-h-0">
      {/* List */}
      <div className="w-72 flex-shrink-0 space-y-3">
        <button
          onClick={() => setEditing({ ...emptyDraft } as any)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>

        {drafts.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-8">No articles yet</p>
        )}

        {drafts.map(draft => {
          const cfg = DRAFT_STATUS_CONFIG[draft.status];
          const isSelected = editing?.id === draft.id;
          return (
            <div
              key={draft.id}
              onClick={() => setEditing(draft)}
              className={`cursor-pointer p-3 rounded-xl border transition-all ${
                isSelected ? 'border-brand-blue bg-brand-blue/5' : 'border-dark-700 bg-dark-800 hover:border-dark-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-white line-clamp-2 flex-1">
                  {draft.title || 'Untitled'}
                </p>
                {confirmDelete === draft.id ? (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); handleDelete(draft.id!); }} className="text-[10px] px-2 py-0.5 bg-red-500 text-white rounded font-bold">Del</button>
                    <button onClick={e => { e.stopPropagation(); setConfirmDelete(null); }} className="text-[10px] px-2 py-0.5 bg-dark-600 text-slate-300 rounded font-bold">No</button>
                  </div>
                ) : (
                  draft.status === 'DRAFT' && (
                    <button
                      onClick={e => { e.stopPropagation(); setConfirmDelete(draft.id!); }}
                      className="text-slate-600 hover:text-red-400 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )
                )}
              </div>
              <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Editor */}
      {editing ? (
        <div className="flex-1 min-w-0 bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-dark-700">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-bold text-white">
                {editing.id ? 'Edit Article' : 'New Article'}
              </span>
              {editing.status && editing.status !== 'DRAFT' && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DRAFT_STATUS_CONFIG[editing.status as ExpertDraftStatus]?.color}`}>
                  {DRAFT_STATUS_CONFIG[editing.status as ExpertDraftStatus]?.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving || editing.status === 'PENDING_REVIEW' || editing.status === 'PUBLISHED'}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-700 hover:bg-dark-600 disabled:opacity-40 text-slate-300 rounded-lg text-sm font-bold transition-all"
              >
                {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </button>
              {(editing.status === 'DRAFT' || !editing.id) && (
                <button
                  onClick={handleSubmit}
                  disabled={!editing.title?.trim() || !editing.content?.trim() || submitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-40 text-white rounded-lg text-sm font-bold transition-all"
                >
                  {submitting ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Submit for Review
                </button>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            {editing.status === 'REJECTED' && editing.adminNote && (
              <div className="flex gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-400 mb-0.5">Rejected by Admin</p>
                  <p className="text-xs text-slate-300">{editing.adminNote}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Title *</label>
              <input
                value={editing.title || ''}
                onChange={e => setEditing({ ...editing, title: e.target.value })}
                disabled={editing.status === 'PENDING_REVIEW' || editing.status === 'PUBLISHED'}
                placeholder="Article title..."
                className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white placeholder-slate-600 text-sm focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Category</label>
              <select
                value={editing.category || ''}
                onChange={e => setEditing({ ...editing, category: e.target.value })}
                disabled={editing.status === 'PENDING_REVIEW' || editing.status === 'PUBLISHED'}
                className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white text-sm focus:outline-none disabled:opacity-50 appearance-none"
              >
                <option value="">Select category...</option>
                <option value="Fundamentals">Fundamentals</option>
                <option value="Materials">Materials</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Adhesives">Adhesives & Bonding</option>
                <option value="Styling">Styling & Cutting</option>
                <option value="Scalp Care">Scalp Care</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Content * <span className="text-slate-600 font-normal normal-case">(Markdown supported)</span></label>
              <textarea
                value={editing.content || ''}
                onChange={e => setEditing({ ...editing, content: e.target.value })}
                disabled={editing.status === 'PENDING_REVIEW' || editing.status === 'PUBLISHED'}
                placeholder="Write your article content here... Markdown is supported."
                rows={16}
                className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white placeholder-slate-600 text-sm focus:outline-none font-mono resize-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <div className="text-center space-y-2">
            <FileText className="w-12 h-12 mx-auto opacity-30" />
            <p className="text-sm">Select an article or create a new one</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Settings Tab ──────────────────────────────
const SettingsTab: React.FC<{
  profile: ExpertProfile;
  setProfile: React.Dispatch<React.SetStateAction<ExpertProfile | null>>;
  userId: string;
}> = ({ profile, setProfile, userId }) => {
  const [bio, setBio] = useState(profile.bio || '');
  const [credentials, setCredentials] = useState(profile.credentials || '');
  const [consultationEnabled, setConsultationEnabled] = useState(profile.consultationEnabled);
  const [modes, setModes] = useState<ConsultationMode[]>(profile.consultationModes || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleMode = (mode: ConsultationMode) => {
    setModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateExpertProfile(userId, {
        bio, credentials, consultationEnabled, consultationModes: modes,
      });
      setProfile(prev => prev ? { ...prev, bio, credentials, consultationEnabled, consultationModes: modes } : prev);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Consultation toggle */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> Consultation Settings
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Accept Bookings</p>
            <p className="text-xs text-slate-500 mt-0.5">Allow members to book consultations with you</p>
          </div>
          <button onClick={() => setConsultationEnabled(!consultationEnabled)} className="flex-shrink-0">
            {consultationEnabled
              ? <ToggleRight className="w-10 h-10 text-emerald-400" />
              : <ToggleLeft className="w-10 h-10 text-slate-600" />
            }
          </button>
        </div>

        {profile.consultationPrice && (
          <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl">
            <span className="text-sm text-slate-400">Session Rate (set by admin)</span>
            <span className="text-sm font-bold text-white">${profile.consultationPrice}</span>
          </div>
        )}

        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Available Modes</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(CONSULTATION_MODE_CONFIG) as ConsultationMode[]).map(mode => {
              const cfg = CONSULTATION_MODE_CONFIG[mode];
              const active = modes.includes(mode);
              return (
                <button
                  key={mode}
                  onClick={() => toggleMode(mode)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-semibold ${
                    active ? 'border-brand-blue bg-brand-blue/10 text-white' : 'border-dark-600 text-slate-500 hover:border-dark-500'
                  }`}
                >
                  <cfg.icon className={`w-4 h-4 ${active ? cfg.color : 'text-slate-600'}`} />
                  {cfg.label}
                  {active && <CheckCircle className="w-3.5 h-3.5 text-brand-blue ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile settings */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" /> Profile Info
        </h3>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white text-sm focus:outline-none resize-none"
          />
          <p className="text-xs text-slate-600 mt-1 text-right">{bio.length}/500</p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Credentials</label>
          <textarea
            value={credentials}
            onChange={e => setCredentials(e.target.value)}
            rows={3}
            maxLength={300}
            className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white text-sm focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-3.5 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
          saved
            ? 'bg-emerald-600 text-white'
            : 'bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white'
        }`}
      >
        {saving ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <><CheckCircle className="w-4 h-4" /> Saved!</>
        ) : (
          <><Save className="w-4 h-4" /> Save Changes</>
        )}
      </button>
    </div>
  );
};