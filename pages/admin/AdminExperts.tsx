// pages/admin/AdminExperts.tsx
import React, { useState, useEffect } from 'react';
import {
  Star, Clock, CheckCircle, XCircle, ChevronRight,
  MapPin, Briefcase, Search, Eye, AlertCircle,
  User, Award, Camera, FileText, Loader, RefreshCw,
  Users, TrendingUp
} from 'lucide-react';
import {
  getAllApplications, approveStep1, approveExpert, rejectApplication, getAllExperts
} from '../../services/expert.service';
import {
  ExpertApplication, ExpertProfile,
  ExpertApplicationStatus, EXPERT_TYPE_LABELS, EXPERT_SPECIALTY_LABELS
} from '../../types';

// ── 状态配置 ──────────────────────────────────
const STATUS_CONFIG: Record<ExpertApplicationStatus, { label: string; color: string; dot: string }> = {
  DRAFT:     { label: 'Draft',      color: 'text-slate-400 bg-slate-400/10 border-slate-400/20',   dot: 'bg-slate-400' },
  STEP1:     { label: 'Pending',    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',   dot: 'bg-amber-400 animate-pulse' },
  STEP2:     { label: 'Step 2',     color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',      dot: 'bg-blue-400 animate-pulse' },
  REVIEWING: { label: 'Reviewing',  color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', dot: 'bg-purple-400 animate-pulse' },
  APPROVED:  { label: 'Approved',   color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', dot: 'bg-emerald-400' },
  REJECTED:  { label: 'Rejected',   color: 'text-red-400 bg-red-400/10 border-red-400/20',         dot: 'bg-red-400' },
};

const TABS: { key: 'applications' | 'experts'; label: string; icon: React.ElementType }[] = [
  { key: 'applications', label: 'Applications', icon: Clock },
  { key: 'experts',      label: 'Active Experts', icon: Users },
];

// ── 主组件 ────────────────────────────────────
export const AdminExperts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'experts'>('applications');
  const [applications, setApplications] = useState<ExpertApplication[]>([]);
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExpertApplicationStatus | 'ALL'>('ALL');
  const [selectedApp, setSelectedApp] = useState<ExpertApplication | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [consultationPrice, setConsultationPrice] = useState('80');

  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, exps] = await Promise.all([getAllApplications(), getAllExperts()]);
      setApplications(apps);
      setExperts(exps);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ── 审核操作 ────────────────────────────────
  const handleApproveStep1 = async (app: ExpertApplication) => {
    if (!app.id) return;
    setActionLoading(true);
    try {
      await approveStep1(app.id);
      await loadData();
      setSelectedApp(prev => prev?.id === app.id ? { ...prev, status: 'STEP2' } : prev);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveExpert = async (app: ExpertApplication) => {
    if (!app.id) return;
    setActionLoading(true);
    try {
      await approveExpert(app.id, Number(consultationPrice) || 80);
      await loadData();
      setSelectedApp(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (app: ExpertApplication) => {
    if (!app.id || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await rejectApplication(app.id, rejectReason);
      await loadData();
      setSelectedApp(null);
      setRejectReason('');
      setShowRejectInput(false);
    } finally {
      setActionLoading(false);
    }
  };

  // ── 过滤 ────────────────────────────────────
  const filteredApps = applications.filter(app => {
    const matchSearch = app.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        app.serviceCity?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = applications.filter(a => ['STEP1', 'REVIEWING'].includes(a.status)).length;

  // ── 统计 ────────────────────────────────────
  const stats = [
    { label: 'Total Applications', value: applications.length, icon: FileText, color: 'text-blue-400' },
    { label: 'Pending Review',     value: pendingCount,         icon: Clock,     color: 'text-amber-400' },
    { label: 'Active Experts',     value: experts.length,       icon: Star,      color: 'text-emerald-400' },
    { label: 'Rejected',           value: applications.filter(a => a.status === 'REJECTED').length, icon: XCircle, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400" /> Expert Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review applications and manage verified experts</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 text-slate-300 hover:text-white rounded-xl transition-all text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </div>
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
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.key === 'applications' && pendingCount > 0 && (
              <span className="w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-8 h-8 text-brand-blue animate-spin" />
        </div>
      ) : (
        <>
          {/* ── Applications Tab ── */}
          {activeTab === 'applications' && (
            <div className="flex gap-4 min-h-0">
              {/* List */}
              <div className="flex-1 min-w-0 space-y-4">
                {/* Filters */}
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search by name or city..."
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue text-sm"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-blue"
                  >
                    <option value="ALL">All Status</option>
                    {(Object.keys(STATUS_CONFIG) as ExpertApplicationStatus[]).map(s => (
                      <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                  </select>
                </div>

                {/* Application cards */}
                {filteredApps.length === 0 ? (
                  <div className="bg-dark-800 border border-dark-700 rounded-2xl p-12 text-center text-slate-500">
                    No applications found
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredApps.map(app => {
                      const cfg = STATUS_CONFIG[app.status];
                      const isSelected = selectedApp?.id === app.id;
                      return (
                        <button
                          key={app.id}
                          onClick={() => setSelectedApp(isSelected ? null : app)}
                          className={`w-full text-left bg-dark-800 border rounded-2xl p-4 transition-all ${
                            isSelected ? 'border-brand-blue' : 'border-dark-700 hover:border-dark-500'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold flex-shrink-0">
                              {app.displayName?.charAt(0)?.toUpperCase() || app.email?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{app.displayName || app.email}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cfg.color}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                  {cfg.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-3 h-3" />
                                  {EXPERT_TYPE_LABELS[app.expertType] || app.expertType}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {app.serviceCity}, {app.serviceCountry}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Detail Panel */}
              {selectedApp && (
                <div className="w-80 flex-shrink-0 space-y-4">
                  <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-5 border-b border-dark-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-lg">
                          {selectedApp.displayName?.charAt(0)?.toUpperCase() || selectedApp.email?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{selectedApp.displayName || selectedApp.email}</h3>
                          <p className="text-xs text-slate-500">{selectedApp.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_CONFIG[selectedApp.status].color}`}>
                        {STATUS_CONFIG[selectedApp.status].label}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
                      <InfoRow label="Type" value={EXPERT_TYPE_LABELS[selectedApp.expertType] || selectedApp.expertType} />
                      <InfoRow label="Experience" value={`${selectedApp.yearsOfExperience} years`} />
                      <InfoRow label="Location" value={`${selectedApp.serviceCity}, ${selectedApp.serviceCountry}`} />

                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specialties</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedApp.specialties?.map(s => (
                            <span key={s} className="text-[10px] px-2 py-0.5 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full">
                              {EXPERT_SPECIALTY_LABELS[s] || s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{selectedApp.bio}</p>
                      </div>

                      {selectedApp.credentials && (
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Credentials</p>
                          <p className="text-sm text-slate-300">{selectedApp.credentials}</p>
                        </div>
                      )}

                      {/* Portfolio */}
                      {selectedApp.portfolioImages?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Portfolio ({selectedApp.portfolioImages.length} images)
                          </p>
                          <div className="grid grid-cols-3 gap-1.5">
                            {selectedApp.portfolioImages.map((url, i) => (
                              <a key={i} href={url} target="_blank" rel="noreferrer">
                                <img src={url} alt={`Portfolio ${i+1}`} className="aspect-square rounded-lg object-cover hover:opacity-80 transition-opacity" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sample Article */}
                      {selectedApp.sampleArticleTitle && (
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sample Article</p>
                          <p className="text-sm font-semibold text-white mb-1">{selectedApp.sampleArticleTitle}</p>
                          <p className="text-xs text-slate-400 line-clamp-4">{selectedApp.sampleArticleContent}</p>
                        </div>
                      )}

                      {/* Rejection reason */}
                      {selectedApp.status === 'REJECTED' && selectedApp.rejectionReason && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                          <p className="text-xs font-bold text-red-400 mb-1">Rejection Reason</p>
                          <p className="text-xs text-slate-300">{selectedApp.rejectionReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {!['APPROVED', 'REJECTED'].includes(selectedApp.status) && (
                      <div className="p-4 border-t border-dark-700 space-y-3">
                        {/* Step 1 approval */}
                        {selectedApp.status === 'STEP1' && (
                          <button
                            onClick={() => handleApproveStep1(selectedApp)}
                            disabled={actionLoading}
                            className="w-full py-2.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                          >
                            {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Approve Step 1 → Request Portfolio
                          </button>
                        )}

                        {/* Final approval */}
                        {selectedApp.status === 'REVIEWING' && (
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <label className="text-xs text-slate-400 whitespace-nowrap">Consultation price ($)</label>
                              <input
                                type="number"
                                value={consultationPrice}
                                onChange={e => setConsultationPrice(e.target.value)}
                                className="flex-1 bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                              />
                            </div>
                            <button
                              onClick={() => handleApproveExpert(selectedApp)}
                              disabled={actionLoading}
                              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                            >
                              {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                              Approve as Expert
                            </button>
                          </div>
                        )}

                        {/* Reject */}
                        {!showRejectInput ? (
                          <button
                            onClick={() => setShowRejectInput(true)}
                            className="w-full py-2.5 bg-dark-700 hover:bg-red-500/10 border border-dark-600 hover:border-red-500/30 text-slate-400 hover:text-red-400 font-bold rounded-xl text-sm transition-all"
                          >
                            Reject Application
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <textarea
                              value={rejectReason}
                              onChange={e => setRejectReason(e.target.value)}
                              placeholder="Reason for rejection..."
                              rows={3}
                              className="w-full bg-dark-900 border border-dark-600 focus:border-red-500 rounded-xl px-3 py-2 text-white placeholder-slate-600 text-sm focus:outline-none resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                                className="flex-1 py-2 bg-dark-700 text-slate-400 rounded-xl text-sm font-bold"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReject(selectedApp)}
                                disabled={!rejectReason.trim() || actionLoading}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1"
                              >
                                {actionLoading ? <Loader className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                Confirm
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Active Experts Tab ── */}
          {activeTab === 'experts' && (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
              {experts.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No active experts yet</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-dark-900 text-xs text-slate-500 uppercase tracking-wider border-b border-dark-700">
                    <tr>
                      <th className="px-5 py-3">Expert</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Location</th>
                      <th className="px-5 py-3">Articles</th>
                      <th className="px-5 py-3">Consultations</th>
                      <th className="px-5 py-3">Booking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {experts.map(expert => (
                      <tr key={expert.userId} className="hover:bg-dark-700/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {expert.displayName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm">{expert.displayName}</p>
                              <p className="text-xs text-slate-500">{expert.yearsOfExperience}y exp</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-300">{EXPERT_TYPE_LABELS[expert.expertType] || expert.expertType}</td>
                        <td className="px-5 py-4 text-sm text-slate-400">{expert.serviceCity}, {expert.serviceCountry}</td>
                        <td className="px-5 py-4 text-sm text-white font-semibold">{expert.publishedArticleCount}</td>
                        <td className="px-5 py-4 text-sm text-white font-semibold">{expert.totalConsultations}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                            expert.consultationEnabled
                              ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                              : 'text-slate-500 bg-slate-500/10 border-slate-500/20'
                          }`}>
                            {expert.consultationEnabled ? 'Open' : 'Closed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── 辅助组件 ──────────────────────────────────
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm text-slate-300">{value}</p>
  </div>
);
