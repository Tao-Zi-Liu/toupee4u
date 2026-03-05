// pages/admin/AdminUserDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, Shield, Zap, Sparkles, Orbit,
  Star, Ban, CheckCircle2, Save, Loader, RefreshCw,
  Mail, Calendar, Clock, MessageSquare, BookOpen,
  TrendingUp, Edit3, AlertTriangle, Plus, Minus,
  FileText, Award, ChevronDown, ChevronUp, X
} from 'lucide-react';
import {
  doc, getDoc, collection, query, where, orderBy,
  limit, getDocs, updateDoc, addDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase.config';

// ── Types ─────────────────────────────────────
interface UserRecord {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: string;
  galaxyLevel: string;
  xp: number;
  membershipTier: string;
  isExpert?: boolean;
  isAdmin?: boolean;
  isBanned?: boolean;
  bio?: string;
  createdAt: any;
  lastLoginAt?: any;
}

interface XPRecord {
  id: string;
  action: string;
  delta: number;
  targetId?: string;
  createdAt: any;
}

interface PostRecord {
  id: string;
  title: string;
  status: string;
  createdAt: any;
  likeCount?: number;
  commentCount?: number;
}

const TIER_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  SUPERNOVA: { icon: Sparkles, color: 'text-amber-400',    bg: 'bg-amber-400/10 border-amber-400/20' },
  GALAXY:    { icon: Orbit,    color: 'text-brand-purple', bg: 'bg-brand-purple/10 border-brand-purple/20' },
  NOVA:      { icon: Zap,      color: 'text-brand-blue',   bg: 'bg-brand-blue/10 border-brand-blue/20' },
  NEBULA:    { icon: Shield,   color: 'text-slate-400',    bg: 'bg-dark-700 border-dark-600' },
};

const XP_ACTION_LABELS: Record<string, string> = {
  DAILY_CHECKIN:   'Daily Check-in',
  VIEW_POST:       'Viewed Post',
  LIKE_POST:       'Liked Post',
  COMMENT:         'Commented',
  READ_KB_ARTICLE: 'Read KB Article',
  RECEIVED_LIKE:   'Received Like',
  CREATE_POST:     'Created Post',
  ADMIN_ADJUST:    'Admin Adjustment',
};

// ── Helper ────────────────────────────────────
const formatDate = (ts: any, withTime = false) => {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    if (withTime) return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return '—'; }
};

// ── Section Card ──────────────────────────────
const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }> = ({
  title, icon: Icon, children, defaultOpen = true
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-dark-700/30 transition-all">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-brand-blue" />
          <span className="font-bold text-white text-sm">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
};

// ── Main Page ─────────────────────────────────
export const AdminUserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserRecord | null>(null);
  const [xpRecords, setXpRecords] = useState<XPRecord[]>([]);
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit states
  const [editLevel, setEditLevel] = useState('');
  const [editMembership, setEditMembership] = useState('');
  const [editRole, setEditRole] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [xpAdjust, setXpAdjust] = useState('');
  const [xpNote, setXpNote] = useState('');
  const [savingXp, setSavingXp] = useState(false);

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // User profile
      const userSnap = await getDoc(doc(db, 'users', userId));
      if (!userSnap.exists()) { navigate('/admin/users'); return; }
      const userData = userSnap.data() as UserRecord;
      setUser(userData);
      setEditLevel(userData.galaxyLevel || 'NEBULA');
      setEditMembership(userData.membershipTier || 'free');
      setEditRole(userData.role || 'VOYAGER');

      // XP records
      const xpSnap = await getDocs(query(
        collection(db, 'xpRecords'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      ));
      setXpRecords(xpSnap.docs.map(d => ({ id: d.id, ...d.data() } as XPRecord)));

      // Posts
      const postsSnap = await getDocs(query(
        collection(db, 'posts'),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(10)
      ));
      setPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() } as PostRecord)));

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [userId]);

  const handleSaveProfile = async () => {
    if (!user || !userId) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', userId), {
        galaxyLevel: editLevel,
        membershipTier: editMembership,
        role: editRole,
      });
      setUser(prev => prev ? { ...prev, galaxyLevel: editLevel, membershipTier: editMembership, role: editRole } : null);
      alert('✅ Profile updated');
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBanToggle = async () => {
    if (!user || !userId) return;
    if (!window.confirm(user.isBanned ? `Unban ${user.displayName}?` : `Ban ${user.displayName}? They will lose access.`)) return;
    const newVal = !user.isBanned;
    await updateDoc(doc(db, 'users', userId), { isBanned: newVal });
    setUser(prev => prev ? { ...prev, isBanned: newVal } : null);
  };

  const handleXpAdjust = async () => {
    if (!userId || !xpAdjust) return;
    const delta = parseInt(xpAdjust);
    if (isNaN(delta)) return;
    setSavingXp(true);
    try {
      // Add XP record
      await addDoc(collection(db, 'xpRecords'), {
        userId,
        action: 'ADMIN_ADJUST',
        delta,
        targetId: xpNote || 'Admin manual adjustment',
        createdAt: serverTimestamp(),
      });
      // Update user XP
      await updateDoc(doc(db, 'users', userId), {
        xp: (user?.xp || 0) + delta,
      });
      setUser(prev => prev ? { ...prev, xp: (prev.xp || 0) + delta } : null);
      setXpAdjust('');
      setXpNote('');
      // Reload XP records
      const xpSnap = await getDocs(query(
        collection(db, 'xpRecords'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      ));
      setXpRecords(xpSnap.docs.map(d => ({ id: d.id, ...d.data() } as XPRecord)));
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setSavingXp(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader className="w-8 h-8 text-brand-blue animate-spin" />
    </div>
  );

  if (!user) return null;

  const tierCfg = TIER_CONFIG[user.galaxyLevel] || TIER_CONFIG.NEBULA;
  const TierIcon = tierCfg.icon;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <button onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to User Registry
      </button>

      {/* Hero */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
        <div className="flex items-start gap-5 flex-wrap">
          {/* Avatar */}
          <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-dark-700 border border-dark-600">
            {user.photoURL
              ? <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-500">
                  {user.displayName?.[0]?.toUpperCase() || '?'}
                </div>
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
              {user.isExpert && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  <Star className="w-2.5 h-2.5" /> Expert
                </span>
              )}
              {user.isAdmin && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <Shield className="w-2.5 h-2.5" /> Admin
                </span>
              )}
              {user.isBanned && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
                  <Ban className="w-2.5 h-2.5" /> Banned
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
            <p className="text-slate-600 text-xs font-mono mt-1">{user.userId}</p>
            {user.bio && <p className="text-slate-400 text-sm mt-2 italic">"{user.bio}"</p>}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-2">
            {[
              { label: 'XP', value: (user.xp || 0).toLocaleString(), color: 'text-brand-blue' },
              { label: 'Level', value: user.galaxyLevel || 'NEBULA', color: tierCfg.color },
              { label: 'Joined', value: formatDate(user.createdAt), color: 'text-slate-300' },
              { label: 'Last Login', value: formatDate(user.lastLoginAt), color: 'text-slate-300' },
            ].map(s => (
              <div key={s.label} className="bg-dark-700/50 rounded-xl p-3">
                <p className="text-[10px] text-slate-500 mb-0.5">{s.label}</p>
                <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Left Column */}
        <div className="space-y-5">

          {/* Account Settings */}
          <Section title="Account Settings" icon={Edit3}>
            <div className="space-y-3 mt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Galaxy Level</label>
                <select value={editLevel} onChange={e => setEditLevel(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                  {['NEBULA', 'NOVA', 'GALAXY', 'SUPERNOVA'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Membership Tier</label>
                <select value={editMembership} onChange={e => setEditMembership(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                  {['free', 'nova', 'galaxy', 'supernova'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Role</label>
                <select value={editRole} onChange={e => setEditRole(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                  {['VOYAGER', 'ARCHITECT', 'SOURCE'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button onClick={handleSaveProfile} disabled={saving}
                className="w-full py-2.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </Section>

          {/* XP Adjustment */}
          <Section title="XP Adjustment" icon={TrendingUp}>
            <div className="space-y-3 mt-1">
              <div className="flex items-center gap-3 bg-dark-700/50 rounded-xl p-3">
                <TrendingUp className="w-5 h-5 text-brand-blue" />
                <div>
                  <p className="text-[10px] text-slate-500">Current XP</p>
                  <p className="text-lg font-bold text-white font-mono">{(user.xp || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input value={xpAdjust} onChange={e => setXpAdjust(e.target.value)}
                  placeholder="e.g. 100 or -50"
                  className="flex-1 bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none font-mono" />
                <button onClick={() => setXpAdjust(v => v.startsWith('-') ? v.slice(1) : '-' + v)}
                  className="px-3 py-2 bg-dark-700 border border-dark-600 text-slate-400 hover:text-white rounded-xl text-sm transition-all">
                  ±
                </button>
              </div>
              <input value={xpNote} onChange={e => setXpNote(e.target.value)}
                placeholder="Reason (optional)"
                className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none" />
              <button onClick={handleXpAdjust} disabled={savingXp || !xpAdjust}
                className="w-full py-2.5 bg-dark-700 hover:bg-dark-600 border border-dark-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                {savingXp ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {savingXp ? 'Applying...' : 'Apply XP Adjustment'}
              </button>
            </div>
          </Section>

          {/* Moderation */}
          <Section title="Moderation" icon={AlertTriangle}>
            <div className="space-y-2 mt-1">
              <button onClick={handleBanToggle}
                className={`w-full py-2.5 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                  user.isBanned
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                }`}>
                {user.isBanned
                  ? <><CheckCircle2 className="w-4 h-4" /> Unban User</>
                  : <><Ban className="w-4 h-4" /> Ban User</>
                }
              </button>
              <p className="text-[10px] text-slate-600 text-center">
                {user.isBanned ? 'User is currently banned from the platform.' : 'Banning will prevent login and all activity.'}
              </p>
            </div>
          </Section>
        </div>

        {/* Right Column */}
        <div className="space-y-5">

          {/* XP History */}
          <Section title={`XP History (last 20)`} icon={TrendingUp}>
            {xpRecords.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No XP records yet.</p>
            ) : (
              <div className="space-y-1 mt-1 max-h-64 overflow-y-auto pr-1">
                {xpRecords.map(record => (
                  <div key={record.id} className="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0">
                    <div>
                      <p className="text-xs font-bold text-slate-300">
                        {XP_ACTION_LABELS[record.action] || record.action}
                      </p>
                      <p className="text-[10px] text-slate-600">{formatDate(record.createdAt, true)}</p>
                    </div>
                    <span className={`text-sm font-bold font-mono ${record.delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {record.delta >= 0 ? '+' : ''}{record.delta}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Posts */}
          <Section title={`Posts (last 10)`} icon={FileText}>
            {posts.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No posts yet.</p>
            ) : (
              <div className="space-y-2 mt-1">
                {posts.map(post => (
                  <div key={post.id} className="flex items-start justify-between gap-3 py-2 border-b border-dark-700/50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-300 line-clamp-1">{post.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-slate-600">{formatDate(post.createdAt)}</span>
                        {post.likeCount !== undefined && (
                          <span className="text-[10px] text-slate-600">❤️ {post.likeCount}</span>
                        )}
                        {post.commentCount !== undefined && (
                          <span className="text-[10px] text-slate-600">💬 {post.commentCount}</span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${
                      post.status === 'PUBLISHED' || !post.status
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        : 'border-red-500/20 bg-red-500/10 text-red-400'
                    }`}>{post.status || 'Active'}</span>
                  </div>
                ))}
              </div>
            )}
          </Section>

        </div>
      </div>
    </div>
  );
};
