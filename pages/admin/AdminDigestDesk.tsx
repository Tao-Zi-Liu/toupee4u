// pages/admin/AdminDigestDesk.tsx
import React, { useState, useEffect } from 'react';
import {
  BookMarked, Loader, Sparkles, RefreshCw,
  Calendar, Newspaper, Mic, CheckCircle, AlertTriangle
} from 'lucide-react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../../firebase.config';

interface MonthlyDigest {
  id: string;
  period: string;
  year: number;
  month: number;
  title: string;
  summary: string;
  articleCount: number;
  audioDuration: number;
  status: string;
  createdAt: any;
}

function formatMonthYear(year: number, month: number): string {
  return new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export const AdminDigestDesk: React.FC = () => {
  const [digests, setDigests] = useState<MonthlyDigest[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generateMsg, setGenerateMsg] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() === 0 ? 12 : new Date().getMonth());

  const functions = getFunctions();

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'monthlyDigests'), orderBy('period', 'desc'), limit(24));
      const snap = await getDocs(q);
      setDigests(snap.docs.map(d => ({ id: d.id, ...d.data() } as MonthlyDigest)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateMsg('');
    try {
      const fn = httpsCallable(functions, 'generateMonthlyDigestManual');
      const result: any = await fn({ year, month });
      if (result.data?.skipped) {
        setGenerateMsg(`⚠️ Digest already exists for ${year}-${String(month).padStart(2, '0')}.`);
      } else {
        setGenerateMsg(`✅ Generated digest for ${formatMonthYear(year, month)}: ${result.data?.articleCount} articles, ~${Math.round(result.data?.duration / 60)} min podcast.`);
        await load();
      }
    } catch (err: any) {
      setGenerateMsg(`❌ ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookMarked className="w-6 h-6 text-brand-purple" /> Monthly Digest Desk
          </h1>
          <p className="text-slate-500 text-sm mt-1">Generate and manage monthly industry digests</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-dark-800 border border-dark-700 hover:border-dark-500 text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Generate Panel */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-4">
        <p className="text-xs font-bold text-white uppercase tracking-widest">Manual Generation</p>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="bg-dark-900 border border-dark-600 focus:border-brand-purple rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
          >
            {MONTHS.map((m, i) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="bg-dark-900 border border-dark-600 focus:border-brand-purple rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2 bg-brand-purple hover:bg-brand-purple/80 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all"
          >
            {generating ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating...' : 'Generate Digest'}
          </button>
        </div>
        {generating && (
          <p className="text-xs text-slate-400">This may take 2-3 minutes — generating long-form content + podcast audio...</p>
        )}
        {generateMsg && (
          <div className={`flex items-start gap-2 text-sm px-4 py-3 rounded-xl border ${
            generateMsg.startsWith('✅')
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : generateMsg.startsWith('⚠️')
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {generateMsg.startsWith('✅') ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
            <span>{generateMsg}</span>
          </div>
        )}
      </div>

      {/* Digest List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-8 h-8 text-brand-purple animate-spin" />
        </div>
      ) : digests.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <BookMarked className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No digests generated yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {digests.map(digest => (
            <div key={digest.id} className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
                      {formatMonthYear(digest.year, digest.month)}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Newspaper className="w-3 h-3" /> {digest.articleCount} articles
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Mic className="w-3 h-3" /> ~{Math.round(digest.audioDuration / 60)} min podcast
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Calendar className="w-3 h-3" /> {digest.period}
                    </span>
                  </div>
                  <p className="font-bold text-white text-sm">{digest.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{digest.summary}</p>
                </div>
                <span className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full border bg-emerald-400/10 border-emerald-400/20 text-emerald-400">
                  {digest.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
