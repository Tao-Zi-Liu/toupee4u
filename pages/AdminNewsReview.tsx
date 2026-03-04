// pages/admin/AdminNewsReview.tsx
import React, { useState, useEffect } from 'react';
import {
  Newspaper, RefreshCw, Play, CheckCircle, XCircle, ExternalLink,
  AlertTriangle, ShieldAlert, Loader, ChevronDown, ChevronUp,
  Link2, Link2Off, Clock, Calendar, Tag, Filter, Sparkles,
  Eye, EyeOff, MessageSquare
} from 'lucide-react';
import {
  collection, query, orderBy, getDocs, where
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../../firebase.config';
import { NewsArticle, NewsStatus, MarketingFlag } from '../../types';

// ── 常量 ─────────────────────────────────────
const STATUS_CONFIG: Record<NewsStatus, { label: string; color: string; dot: string }> = {
  PENDING:   { label: 'Pending Review', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',   dot: 'bg-amber-400 animate-pulse' },
  PUBLISHED: { label: 'Published',      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', dot: 'bg-emerald-400' },
  REJECTED:  { label: 'Rejected',       color: 'text-red-400 bg-red-400/10 border-red-400/20',          dot: 'bg-red-400' },
};

const MARKETING_FLAG_CONFIG: Record<string, { label: string; color: string }> = {
  BRAND_PR:              { label: 'Brand PR',          color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  PROMOTIONAL:           { label: 'Promotional',       color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  SOFT_AD:               { label: 'Soft Ad',           color: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
  CONFLICT_OF_INTEREST:  { label: 'Conflict of Interest', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
};

const CATEGORY_COLORS: Record<string, string> = {
  'Market Trends': 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
  'Technology':    'text-brand-purple bg-brand-purple/10 border-brand-purple/20',
  'Products':      'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'Industry':      'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Research':      'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
};

type FilterStatus = 'ALL' | NewsStatus;

// ── 主组件 ────────────────────────────────────
export const AdminNewsReview: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('PENDING');
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  const functions = getFunctions();

  const loadArticles = async () => {
    setLoading(true);
    try {
      let q;
      if (filterStatus === 'ALL') {
        q = query(collection(db, 'newsArticles'), orderBy('createdAt', 'desc'));
      } else {
        q = query(
          collection(db, 'newsArticles'),
          where('status', '==', filterStatus),
          orderBy('createdAt', 'desc')
        );
      }
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsArticle));
      setArticles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadArticles(); }, [filterStatus]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const fn = httpsCallable(functions, 'generateNewsManual');
      const result: any = await fn({});
      alert(`✅ Generated ${result.data.count} articles. Refreshing...`);
      setFilterStatus('PENDING');
      await loadArticles();
    } catch (err: any) {
      alert(`❌ Generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleVerifyUrl = async (article: NewsArticle) => {
    if (!article.id) return;
    setActionLoading(true);
    try {
      const fn = httpsCallable(functions, 'verifyNewsUrl');
      const result: any = await fn({ articleId: article.id, url: article.sourceUrl });
      const updated = { ...article, urlVerified: result.data.accessible, urlStatusCode: result.data.statusCode };
      setArticles(prev => prev.map(a => a.id === article.id ? updated : a));
      if (selectedArticle?.id === article.id) setSelectedArticle(updated);
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async (article: NewsArticle) => {
    if (!article.id) return;
    setActionLoading(true);
    try {
      const fn = httpsCallable(functions, 'publishNewsArticle');
      await fn({ articleId: article.id, adminNote });
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: 'PUBLISHED' as NewsStatus } : a));
      setSelectedArticle(null);
      setAdminNote('');
    } catch (err: any) {
      alert(`Publish failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (article: NewsArticle) => {
    if (!article.id || !rejectNote.trim()) return;
    setActionLoading(true);
    try {
      const fn = httpsCallable(functions, 'rejectNewsArticle');
      await fn({ articleId: article.id, adminNote: rejectNote });
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: 'REJECTED' as NewsStatus } : a));
      setSelectedArticle(null);
      setRejectNote('');
      setShowRejectInput(false);
    } catch (err: any) {
      alert(`Reject failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const pending = articles.filter(a => a.status === 'PENDING').length;
  const published = articles.filter(a => a.status === 'PUBLISHED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-brand-blue" /> News Desk
          </h1>
          <p className="text-slate-500 text-sm mt-1">AI-generated industry briefs — review before publishing</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadArticles} disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-dark-800 border border-dark-700 hover:border-dark-500 text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleGenerate} disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all">
            {generating ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating...' : 'Generate Now'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Review', value: pending, color: 'text-amber-400', icon: Clock },
          { label: 'Published', value: published, color: 'text-emerald-400', icon: CheckCircle },
          { label: 'Total', value: articles.length, color: 'text-slate-300', icon: Newspaper },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4 flex items-center gap-4">
            <s.icon className={`w-8 h-8 ${s.color} opacity-80`} />
            <div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 w-fit">
        {(['ALL', 'PENDING', 'PUBLISHED', 'REJECTED'] as FilterStatus[]).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === s ? 'bg-dark-700 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}>
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex gap-5 min-h-0">
        {/* List */}
        <div className="flex-1 min-w-0 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 text-brand-blue animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No articles found. Click "Generate Now" to fetch the latest news.</p>
            </div>
          ) : articles.map(article => {
            const sc = STATUS_CONFIG[article.status];
            const isSelected = selectedArticle?.id === article.id;
            return (
              <div key={article.id} onClick={() => { setSelectedArticle(article); setShowRejectInput(false); setRejectNote(''); setAdminNote(''); }}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  isSelected ? 'border-brand-blue bg-brand-blue/5' : 'border-dark-700 bg-dark-800 hover:border-dark-500'
                }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[article.category] || 'text-slate-400 bg-dark-700 border-dark-600'}`}>
                        {article.category}
                      </span>
                      {!article.isClean && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border text-orange-400 bg-orange-400/10 border-orange-400/20">
                          <ShieldAlert className="w-3 h-3" /> Marketing
                        </span>
                      )}
                      {article.urlVerified === true && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                          <Link2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                      {article.urlVerified === false && article.urlVerifiedAt && (
                        <span className="flex items-center gap-1 text-[10px] text-red-400">
                          <Link2Off className="w-3 h-3" /> Dead Link
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-white text-sm line-clamp-2">{article.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{article.sourceName} · {article.generatedDate}</p>
                  </div>
                  <span className={`flex-shrink-0 flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full border ${sc.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selectedArticle && (
          <div className="w-[420px] flex-shrink-0">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
              {/* Panel Header */}
              <div className="p-4 border-b border-dark-700 flex items-center justify-between">
                <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full border ${STATUS_CONFIG[selectedArticle.status].color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selectedArticle.status].dot}`} />
                  {STATUS_CONFIG[selectedArticle.status].label}
                </span>
                <button onClick={() => setSelectedArticle(null)} className="text-slate-600 hover:text-white text-xs">✕</button>
              </div>

              {/* Panel Content */}
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">

                {/* Title & Category */}
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[selectedArticle.category] || 'text-slate-400 bg-dark-700 border-dark-600'}`}>
                    {selectedArticle.category}
                  </span>
                  <h3 className="font-bold text-white text-sm mt-2 leading-snug">{selectedArticle.title}</h3>
                </div>

                {/* Summary */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Summary</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{selectedArticle.summary}</p>
                </div>

                {/* Editorial Note */}
                {selectedArticle.editorialNote && (
                  <div className="bg-dark-700/50 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-bold text-brand-purple uppercase tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Editorial Analysis
                    </p>
                    {selectedArticle.editorialNote.standpoint && (
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">Source Standpoint</p>
                        <p className="text-xs text-slate-300">{selectedArticle.editorialNote.standpoint}</p>
                      </div>
                    )}
                    {selectedArticle.editorialNote.significance && (
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">Why It Matters</p>
                        <p className="text-xs text-slate-300">{selectedArticle.editorialNote.significance}</p>
                      </div>
                    )}
                    {selectedArticle.editorialNote.caution && (
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">Points of Caution</p>
                        <p className="text-xs text-amber-400">{selectedArticle.editorialNote.caution}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Marketing Flags */}
                {selectedArticle.marketingFlags?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Marketing Flags Detected
                    </p>
                    <div className="space-y-1.5">
                      {selectedArticle.marketingFlags.map((flag: MarketingFlag, i: number) => (
                        <div key={i} className="flex items-start gap-2 bg-orange-400/5 border border-orange-400/15 rounded-lg p-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${MARKETING_FLAG_CONFIG[flag.type]?.color || 'text-slate-400 bg-dark-700 border-dark-600'}`}>
                            {MARKETING_FLAG_CONFIG[flag.type]?.label || flag.type}
                          </span>
                          <p className="text-xs text-slate-400">{flag.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedArticle.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArticle.tags.map((tag: string) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 bg-dark-700 border border-dark-600 rounded-full text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Source */}
                <div className="bg-dark-700/50 rounded-xl p-3 space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Source</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{selectedArticle.sourceName}</p>
                      {selectedArticle.sourceDate && (
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> {selectedArticle.sourceDate}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* URL 验证状态 */}
                      {selectedArticle.urlVerified === true ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                          <Link2 className="w-3 h-3" /> Verified
                        </span>
                      ) : selectedArticle.urlVerified === false && selectedArticle.urlVerifiedAt ? (
                        <span className="flex items-center gap-1 text-[10px] text-red-400">
                          <Link2Off className="w-3 h-3" /> Dead Link
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-600">Unverified</span>
                      )}
                      <button onClick={() => handleVerifyUrl(selectedArticle)} disabled={actionLoading}
                        className="text-[10px] font-bold px-2 py-1 bg-dark-600 hover:bg-dark-500 border border-dark-500 rounded-lg text-slate-300 transition-all disabled:opacity-50">
                        {actionLoading ? '...' : 'Check'}
                      </button>
                    </div>
                  </div>
                  <a href={selectedArticle.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-brand-blue hover:underline truncate"
                    onClick={e => e.stopPropagation()}>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{selectedArticle.sourceUrl}</span>
                  </a>
                </div>

                {/* Admin Note */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Admin Note (optional)</label>
                  <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} rows={2}
                    placeholder="Add a note before publishing..."
                    className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none resize-none" />
                </div>
              </div>

              {/* Actions */}
              {selectedArticle.status === 'PENDING' && (
                <div className="p-4 border-t border-dark-700 space-y-2">
                  <button onClick={() => handlePublish(selectedArticle)} disabled={actionLoading}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                    {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Publish Article
                  </button>

                  {!showRejectInput ? (
                    <button onClick={() => setShowRejectInput(true)}
                      className="w-full py-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 text-slate-400 hover:text-red-400 font-bold rounded-xl text-sm transition-all">
                      Reject
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} rows={2}
                        placeholder="Rejection reason (required)..."
                        className="w-full bg-dark-900 border border-red-500/30 focus:border-red-500 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none resize-none" />
                      <div className="flex gap-2">
                        <button onClick={() => handleReject(selectedArticle)} disabled={!rejectNote.trim() || actionLoading}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all">
                          Confirm Reject
                        </button>
                        <button onClick={() => { setShowRejectInput(false); setRejectNote(''); }}
                          className="px-4 py-2 bg-dark-700 text-slate-400 font-bold rounded-xl text-sm transition-all">
                          Cancel
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
    </div>
  );
};
