// components/XPLeaderboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Loader, Trophy } from 'lucide-react';
import { getLeaderboard, LeaderboardPeriod } from '../services/leaderboard.service';
import { LeaderboardEntry } from '../types';
import { getCurrentUser } from '../services/auth.service';

const TIER_COLORS: Record<string, string> = {
  SUPERNOVA: 'text-amber-400',
  GALAXY:    'text-purple-400',
  NOVA:      'text-blue-400',
  NEBULA:    'text-slate-400',
};

const RANK_STYLES = [
  'text-amber-400 font-extrabold',  // 1st
  'text-slate-300 font-bold',       // 2nd
  'text-amber-600 font-bold',       // 3rd
];

const TABS: { id: LeaderboardPeriod; label: string }[] = [
  { id: 'all',   label: 'All Time' },
  { id: 'month', label: 'Month'    },
  { id: 'week',  label: 'Week'     },
];

export const XPLeaderboard: React.FC = () => {
  const [period, setPeriod] = useState<LeaderboardPeriod>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    setLoading(true);
    getLeaderboard(period, 10).then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, [period]);

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-dark-700">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-white font-bold text-sm">XP Leaderboard</h3>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 bg-dark-900 rounded-lg p-0.5">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                period === tab.id
                  ? 'bg-dark-700 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="p-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="w-5 h-5 text-brand-blue animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-slate-600 text-xs py-8">No data yet</p>
        ) : (
          <div className="space-y-1">
            {entries.map((entry, i) => {
              const isCurrentUser = entry.userId === currentUser?.uid;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-all ${
                    isCurrentUser
                      ? 'bg-brand-blue/10 border border-brand-blue/20'
                      : 'hover:bg-dark-700'
                  }`}
                >
                  {/* Rank */}
                  <span className={`w-5 text-center text-xs flex-shrink-0 ${RANK_STYLES[i] ?? 'text-slate-600 font-medium'}`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : entry.rank}
                  </span>

                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden bg-dark-600 flex items-center justify-center">
                    {entry.photoURL ? (
                      <img src={entry.photoURL} alt={entry.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-slate-300">
                        {entry.displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Name + tier */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${isCurrentUser ? 'text-brand-blue' : 'text-white'}`}>
                      {entry.displayName}{isCurrentUser && ' (you)'}
                    </p>
                    <p className={`text-[10px] font-bold uppercase ${TIER_COLORS[entry.galaxyLevel] ?? 'text-slate-500'}`}>
                      {entry.galaxyLevel}
                    </p>
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-extrabold text-amber-400">{entry.xp.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <Link
          to="/profile"
          className="block text-center text-xs text-slate-600 hover:text-slate-400 transition-colors"
        >
          View your XP stats →
        </Link>
      </div>
    </div>
  );
};
