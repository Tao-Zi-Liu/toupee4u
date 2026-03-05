// pages/admin/AdminUsers.tsx
import React, { useState, useEffect } from 'react';
import {
  Users, Search, Shield, Zap, Sparkles, Orbit,
  Filter, Loader, RefreshCw, ChevronDown, ChevronUp,
  Mail, Calendar, Crown, Ban, CheckCircle2, Eye,
  Star, AlertTriangle, X, ExternalLink, Edit3, Save
} from 'lucide-react';
import {
  collection, query, orderBy, getDocs, doc,
  updateDoc, where, getCountFromServer
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useNavigate } from 'react-router-dom';

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
  createdAt: any;
  lastLoginAt?: any;
}

type SortKey = 'createdAt' | 'xp' | 'displayName';
type SortDir = 'asc' | 'desc';

const TIER_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  SUPERNOVA: { icon: Sparkles, color: 'text-amber-400',   bg: 'bg-amber-400/10 border-amber-400/20' },
  GALAXY:    { icon: Orbit,    color: 'text-brand-purple', bg: 'bg-brand-purple/10 border-brand-purple/20' },
  NOVA:      { icon: Zap,      color: 'text-brand-blue',   bg: 'bg-brand-blue/10 border-brand-blue/20' },
  NEBULA:    { icon: Shield,   color: 'text-slate-400',    bg: 'bg-dark-700 border-dark-600' },
};

const MEMBERSHIP_CONFIG: Record<string, { label: string; color: string }> = {
  supernova: { label: 'Supernova', color: 'text-amber-400' },
  galaxy:    { label: 'Galaxy',    color: 'text-purple-400' },
  nova:      { label: 'Nova',      color: 'text-brand-blue' },
  free:      { label: 'Free',      color: 'text-slate-500' },
};

// ── User Detail Panel ─────────────────────────
const UserDetailPanel: React.FC<{
  user: UserRecord;
  onClose: () => void;
  onUpdate: (userId: string, data: Partial<UserRecord>) => void;
}> = ({ user, onClose, onUpdate }) => {
  const [editTier, setEditTier] = useState(user.galaxyLevel);
  const [editMembership, setEditMembership] = useState(user.membershipTier);
  const [saving, setSaving] = useState(false);

  const tierCfg = TIER_CONFIG[user.galaxyLevel] || TIER_CONFIG.NEBULA;
  const TierIcon = tierCfg.icon;

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(user.userId, { galaxyLevel: editTier, membershipTier: editMembership });
    setSaving(false);
  };

  const handleBanToggle = async () => {
    if (!window.confirm(user.isBanned ? `Unban ${user.displayName}?` : `Ban ${user.displayName}?`)) return;
    await onUpdate(user.userId, { isBanned: !user.isBanned });
  };

  const formatDate = (ts: any) => {
    if (!ts) return 'Unknown';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return 'Unknown'; }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-dark-700 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Profile</span>
        <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
      </div>

      <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-dark-700 border border-dark-600 flex-shrink-0">
            {user.photoURL
              ? <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-lg">
                  {user.displayName?.[0]?.toUpperCase() || '?'}
                </div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white truncate">{user.displayName}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <p className="text-[10px] font-mono text-slate-600 mt-0.5">{user.userId}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-dark-700/50 rounded-xl p-3">
            <p className="text-[10px] text-slate-500 mb-0.5">XP</p>
            <p className="text-sm font-bold text-white font-mono">{(user.xp || 0).toLocaleString()}</p>
          </div>
          <div className="bg-dark-700/50 rounded-xl p-3">
            <p className="text-[10px] text-slate-500 mb-0.5">Role</p>
            <p className="text-sm font-bold text-white">{user.role || 'VOYAGER'}</p>
          </div>
          <div className="bg-dark-700/50 rounded-xl p-3">
            <p className="text-[10px] text-slate-500 mb-0.5">Joined</p>
            <p className="text-xs font-bold text-white">{formatDate(user.createdAt)}</p>
          </div>
          <div className="bg-dark-700/50 rounded-xl p-3">
            <p className="text-[10px] text-slate-500 mb-0.5">Last Login</p>
            <p className="text-xs font-bold text-white">{formatDate(user.lastLoginAt)}</p>
          </div>
        </div>

        {/* Edit Galaxy Level */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Galaxy Level</label>
          <select value={editTier} onChange={e => setEditTier(e.target.value)}
            className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
            {['NEBULA', 'NOVA', 'GALAXY', 'SUPERNOVA'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Edit Membership */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Membership Tier</label>
          <select value={editMembership} onChange={e => setEditMembership(e.target.value)}
            className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
            {['free', 'nova', 'galaxy', 'supernova'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button onClick={handleSave} disabled={saving}
            className="w-full py-2.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={handleBanToggle}
            className={`w-full py-2 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
              user.isBanned
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
            }`}>
            {user.isBanned ? <><CheckCircle2 className="w-4 h-4" /> Unban User</> : <><Ban className="w-4 h-4" /> Ban User</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────
export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState<string>('ALL');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, experts: 0, banned: 0 });
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
      const data = snap.docs.map(d => ({ ...d.data() } as UserRecord));
      setUsers(data);
      setStats({
        total: data.length,
        active: data.filter(u => !u.isBanned).length,
        experts: data.filter(u => u.isExpert).length,
        banned: data.filter(u => u.isBanned).length,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUpdate = async (userId: string, data: Partial<UserRecord>) => {
    await updateDoc(doc(db, 'users', userId), data);
    setUsers(prev => prev.map(u => u.userId === userId ? { ...u, ...data } : u));
    if (selectedUser?.userId === userId) setSelectedUser(prev => prev ? { ...prev, ...data } : null);
    setStats(prev => ({
      ...prev,
      banned: users.filter(u => (u.userId === userId ? data.isBanned : u.isBanned)).length,
      experts: users.filter(u => (u.userId === userId ? data.isExpert : u.isExpert)).length,
    }));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = users
    .filter(u => {
      const matchSearch = !search ||
        u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.userId?.toLowerCase().includes(search.toLowerCase());
      const matchTier = filterTier === 'ALL' || u.galaxyLevel === filterTier;
      const matchRole = filterRole === 'ALL' || u.role === filterRole;
      return matchSearch && matchTier && matchRole;
    })
    .sort((a, b) => {
      let av: any, bv: any;
      if (sortKey === 'createdAt') { av = a.createdAt?.seconds || 0; bv = b.createdAt?.seconds || 0; }
      else if (sortKey === 'xp') { av = a.xp || 0; bv = b.xp || 0; }
      else { av = a.displayName || ''; bv = b.displayName || ''; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const SortBtn: React.FC<{ k: SortKey; label: string }> = ({ k, label }) => (
    <button onClick={() => handleSort(k)}
      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
        sortKey === k ? 'text-white' : 'text-slate-600 hover:text-slate-400'
      }`}>
      {label}
      {sortKey === k ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null}
    </button>
  );

  const formatDate = (ts: any) => {
    if (!ts) return '—';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return '—'; }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-400" /> User Registry
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage all registered users</p>
        </div>
        <button onClick={load} disabled={loading}
          className="p-2 bg-dark-800 border border-dark-700 text-slate-400 hover:text-white rounded-xl transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',  value: stats.total,   color: 'text-white' },
          { label: 'Active',       value: stats.active,  color: 'text-emerald-400' },
          { label: 'Experts',      value: stats.experts, color: 'text-amber-400' },
          { label: 'Banned',       value: stats.banned,  color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or user ID..."
            className="w-full bg-dark-800 border border-dark-700 focus:border-brand-blue rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Galaxy Level */}
          <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
            {['ALL', 'NEBULA', 'NOVA', 'GALAXY', 'SUPERNOVA'].map(t => (
              <button key={t} onClick={() => setFilterTier(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  filterTier === t ? 'bg-dark-700 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}>{t === 'ALL' ? 'All Levels' : t.charAt(0) + t.slice(1).toLowerCase()}</button>
            ))}
          </div>
          {/* Role */}
          <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
            {['ALL', 'VOYAGER', 'ARCHITECT', 'SOURCE'].map(r => (
              <button key={r} onClick={() => setFilterRole(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  filterRole === r ? 'bg-dark-700 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}>{r === 'ALL' ? 'All Roles' : r.charAt(0) + r.slice(1).toLowerCase()}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-blue animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500 space-y-2">
              <Users className="w-12 h-12 mx-auto opacity-30" />
              <p>No users found.</p>
            </div>
          ) : (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-dark-700 bg-dark-900/50">
                <SortBtn k="displayName" label="User" />
                <SortBtn k="xp" label="XP" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Level</span>
                <SortBtn k="createdAt" label="Joined" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Actions</span>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-dark-700">
                {filtered.map(user => {
                  const tierCfg = TIER_CONFIG[user.galaxyLevel] || TIER_CONFIG.NEBULA;
                  const TierIcon = tierCfg.icon;
                  const isSelected = selectedUser?.userId === user.userId;
                  const memberCfg = MEMBERSHIP_CONFIG[user.membershipTier] || MEMBERSHIP_CONFIG.free;

                  return (
                    <div key={user.userId}
                      onClick={() => setSelectedUser(isSelected ? null : user)}
                      className={`grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center cursor-pointer transition-all ${
                        isSelected ? 'bg-brand-blue/5 border-l-2 border-brand-blue' : 'hover:bg-dark-700/30'
                      } ${user.isBanned ? 'opacity-50' : ''}`}>

                      {/* User */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg overflow-hidden bg-dark-700 border border-dark-600">
                          {user.photoURL
                            ? <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                                {user.displayName?.[0]?.toUpperCase() || '?'}
                              </div>
                          }
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-white truncate">{user.displayName || 'Unknown'}</p>
                            {user.isExpert && <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                            {user.isBanned && <Ban className="w-3 h-3 text-red-400 flex-shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* XP */}
                      <div className="text-sm font-mono text-slate-400">
                        {(user.xp || 0).toLocaleString()}
                      </div>

                      {/* Level */}
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${tierCfg.color}`}>
                        <TierIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="hidden sm:inline">{user.galaxyLevel || 'NEBULA'}</span>
                      </div>

                      {/* Joined */}
                      <div className="text-xs text-slate-500">{formatDate(user.createdAt)}</div>

                      {/* Membership dot */}
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold ${memberCfg.color}`}>{memberCfg.label}</span>
                        <button onClick={e => { e.stopPropagation(); navigate(`/admin/users/${user.userId}`); }}
                          className="text-[10px] px-2 py-1 bg-dark-700 hover:bg-dark-600 border border-dark-600 text-slate-400 hover:text-white rounded-lg transition-all font-bold">
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-dark-700 text-xs text-slate-500">
                Showing {filtered.length} of {users.length} users
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedUser && (
          <div className="w-72 flex-shrink-0">
            <UserDetailPanel
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onUpdate={handleUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
};
