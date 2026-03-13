// pages/PodcastPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  Clock, Calendar, Loader, Radio, X, List
} from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Podcast {
  id?: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number; // seconds
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt?: any;
  publishedAt?: any;
  transcript?: string;
  tags?: string[];
  episodeNumber?: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(val: any): string {
  if (!val) return '';
  const d = val?.toDate ? val.toDate() : new Date(val);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

// ── Floating Bottom Player ─────────────────────────────────────────────────────

interface FloatingPlayerProps {
  podcast: Podcast;
  onClose: () => void;
}

const FloatingPlayer: React.FC<FloatingPlayerProps> = ({ podcast, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(podcast.duration || 0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); } else { audio.play(); }
    setPlaying(!playing);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  const skip = (secs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + secs));
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-xl border-t border-dark-600/60 shadow-2xl">
      <audio ref={audioRef} src={podcast.audioUrl} preload="metadata" />
      {/* Progress bar */}
      <div className="relative h-1 bg-dark-700 cursor-pointer">
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-blue to-purple-500 transition-all"
          style={{ width: `${progress}%` }} />
        <input type="range" min={0} max={duration || 100} value={currentTime}
          onChange={seek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      </div>
      <div className="flex items-center gap-4 px-4 py-3 max-w-7xl mx-auto">
        {/* Cover */}
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-blue/30 to-purple-500/30 border border-dark-500 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {podcast.coverImage
            ? <img src={podcast.coverImage} alt="" className="w-full h-full object-cover" />
            : <Mic className="w-4 h-4 text-brand-blue" />}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{podcast.title}</p>
          <p className="text-[10px] text-slate-500 font-mono">{formatTime(currentTime)} / {formatTime(duration)}</p>
        </div>
        {/* Controls */}
        <div className="flex items-center gap-2">
          <button onClick={() => skip(-15)}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-dark-700">
            <SkipBack className="w-4 h-4" />
          </button>
          <button onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-brand-blue hover:bg-brand-blue/80 flex items-center justify-center transition-all shadow-lg shadow-brand-blue/20">
            {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
          </button>
          <button onClick={() => skip(15)}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-dark-700">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors">
            {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (audioRef.current) audioRef.current.volume = v;
              setVolume(v);
              setMuted(v === 0);
            }}
            className="w-20 accent-brand-blue cursor-pointer" />
        </div>
        {/* Close */}
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-dark-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Embedded Player ────────────────────────────────────────────────────────────

interface EmbeddedPlayerProps {
  podcast: Podcast;
  onPlay: () => void;
}

const EmbeddedPlayer: React.FC<EmbeddedPlayerProps> = ({ podcast, onPlay }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(podcast.duration || 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); } else { audio.play(); onPlay(); }
    setPlaying(!playing);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-dark-700/60 border border-dark-600 rounded-2xl p-4">
      <audio ref={audioRef} src={podcast.audioUrl} preload="metadata" />
      <div className="flex items-center gap-3 mb-3">
        <button onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-brand-blue hover:bg-brand-blue/80 flex items-center justify-center flex-shrink-0 transition-all shadow-lg shadow-brand-blue/20">
          {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
        </button>
        <div className="flex-1">
          <div className="relative h-1.5 bg-dark-600 rounded-full cursor-pointer mb-1">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-blue to-purple-500 rounded-full transition-all"
              style={{ width: `${progress}%` }} />
            <input type="range" min={0} max={duration || 100} value={currentTime}
              onChange={seek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Episode Card ───────────────────────────────────────────────────────────────

interface EpisodeCardProps {
  podcast: Podcast;
  selected: boolean;
  onClick: () => void;
  onFloatPlay: () => void;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ podcast, selected, onClick, onFloatPlay }) => (
  <div onClick={onClick}
    className={`group cursor-pointer rounded-2xl border p-4 transition-all ${
      selected
        ? 'bg-dark-700 border-brand-blue/40 shadow-lg shadow-brand-blue/10'
        : 'bg-dark-800/60 border-dark-600/60 hover:border-dark-500 hover:bg-dark-700/50'
    }`}>
    <div className="flex items-start gap-3">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-blue/20 to-purple-500/20 border border-dark-500 flex-shrink-0 flex items-center justify-center overflow-hidden">
        {podcast.coverImage
          ? <img src={podcast.coverImage} alt="" className="w-full h-full object-cover" />
          : <Mic className="w-5 h-5 text-brand-blue/60" />}
      </div>
      <div className="flex-1 min-w-0">
        {podcast.episodeNumber && (
          <p className="text-[10px] font-bold text-brand-blue/70 uppercase tracking-wider mb-0.5">EP {podcast.episodeNumber}</p>
        )}
        <p className="text-sm font-bold text-white line-clamp-2 leading-snug">{podcast.title}</p>
        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
          {podcast.publishedAt && (
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(podcast.publishedAt)}</span>
          )}
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(podcast.duration)}</span>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onFloatPlay(); }}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-dark-600 hover:bg-brand-blue border border-dark-500 hover:border-brand-blue flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
        <Play className="w-3.5 h-3.5 text-white ml-0.5" />
      </button>
    </div>
    {selected && (
      <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">{podcast.description}</p>
    )}
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────

export const PodcastPage: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Podcast | null>(null);
  const [floating, setFloating] = useState<Podcast | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(
          collection(db, 'podcasts'),
          where('status', '==', 'PUBLISHED'),
          orderBy('publishedAt', 'desc')
        );
        const snap = await getDocs(q);
        const items = snap.docs.map(d => {
          const data = d.data();
          if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate().toISOString();
          if (data.publishedAt?.toDate) data.publishedAt = data.publishedAt.toDate().toISOString();
          return { id: d.id, ...data } as Podcast;
        });
        setPodcasts(items);
        if (items.length > 0) setSelected(items[0]);
      } catch (e) {
        console.error('Failed to load podcasts:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-dark-700/60">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center">
              <Radio className="w-4 h-4 text-brand-blue" />
            </div>
            <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">Toupee4U Podcast</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">The Hair System Podcast</h1>
          <p className="text-slate-400 text-sm">AI-generated conversations on hair replacement, confidence, and community.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader className="w-6 h-6 text-brand-blue animate-spin" />
          </div>
        ) : podcasts.length === 0 ? (
          <div className="text-center py-24">
            <Mic className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No episodes published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Episode List */}
            <div className="lg:col-span-2 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                <List className="w-3.5 h-3.5" /> {podcasts.length} Episodes
              </p>
              {podcasts.map(p => (
                <EpisodeCard
                  key={p.id}
                  podcast={p}
                  selected={selected?.id === p.id}
                  onClick={() => setSelected(p)}
                  onFloatPlay={() => { setSelected(p); setFloating(p); }}
                />
              ))}
            </div>

            {/* Detail + Embedded Player */}
            {selected && (
              <div className="lg:col-span-3">
                <div className="sticky top-4 bg-dark-800/60 border border-dark-600/60 rounded-2xl p-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-purple-500/20 border border-dark-500 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {selected.coverImage
                        ? <img src={selected.coverImage} alt="" className="w-full h-full object-cover" />
                        : <Mic className="w-7 h-7 text-brand-blue/50" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      {selected.episodeNumber && (
                        <p className="text-[10px] font-bold text-brand-blue uppercase tracking-wider mb-1">Episode {selected.episodeNumber}</p>
                      )}
                      <h2 className="text-lg font-bold text-white leading-snug mb-1">{selected.title}</h2>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        {selected.publishedAt && (
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(selected.publishedAt)}</span>
                        )}
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(selected.duration)}</span>
                      </div>
                    </div>
                  </div>

                  <EmbeddedPlayer key={selected.id} podcast={selected} onPlay={() => setFloating(null)} />

                  <button onClick={() => setFloating(selected)}
                    className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-brand-blue transition-colors py-1">
                    <Play className="w-3 h-3" /> Open in mini player
                  </button>

                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">About this episode</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{selected.description}</p>
                  </div>

                  {selected.tags && selected.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selected.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-dark-700 border border-dark-600 rounded-full text-slate-400">#{tag}</span>
                      ))}
                    </div>
                  )}

                  {selected.transcript && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Transcript</p>
                      <div className="bg-dark-900/60 rounded-xl p-4 max-h-48 overflow-y-auto">
                        <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{selected.transcript}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {floating && (
        <FloatingPlayer key={floating.id} podcast={floating} onClose={() => setFloating(null)} />
      )}
    </div>
  );
};
