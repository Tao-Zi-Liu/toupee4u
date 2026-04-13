// pages/DigestPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookMarked, ChevronDown, ChevronRight, Loader, Newspaper,
  Play, Pause, SkipBack, SkipForward, Mic, Calendar,
  TrendingUp, Microscope, BarChart2, Brain
} from 'lucide-react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase.config';

interface MonthlyDigest {
  id: string;
  period: string;
  year: number;
  month: number;
  title: string;
  summary: string;
  sections: {
    topStories: string;
    materialsTech: string;
    marketDynamics: string;
    expertInsights: string;
  };
  articleCount: number;
  audioUrl: string;
  audioDuration: number;
  status: string;
  createdAt: any;
}

function formatMonthYear(year: number, month: number): string {
  return new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ── Mini Audio Player ─────────────────────────────────────────────────────────
const DigestAudioPlayer: React.FC<{ audioUrl: string; duration: number }> = ({ audioUrl, duration }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [actualDuration, setActualDuration] = useState(duration);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setActualDuration(audio.duration);
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

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch (err) {
        console.error('Playback failed:', err);
      }
    }
  };

  const skip = (secs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(actualDuration, audio.currentTime + secs));
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  const progress = actualDuration > 0 ? (currentTime / actualDuration) * 100 : 0;

  return (
    <div className="bg-dark-700/60 border border-dark-600 rounded-2xl p-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="flex items-center gap-2 mb-3">
        <Mic className="w-4 h-4 text-brand-purple flex-shrink-0" />
        <span className="text-xs font-bold text-white">Monthly Review Podcast</span>
        <span className="text-[10px] text-slate-500 ml-auto font-mono">~{Math.round(actualDuration / 60)} min</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => skip(-15)} className="text-slate-400 hover:text-white transition-colors p-1">
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-brand-purple hover:bg-brand-purple/80 flex items-center justify-center flex-shrink-0 transition-all shadow-lg shadow-brand-purple/20"
        >
          {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
        </button>
        <button onClick={() => skip(15)} className="text-slate-400 hover:text-white transition-colors p-1">
          <SkipForward className="w-4 h-4" />
        </button>
        <div className="flex-1 space-y-1">
          <div className="relative h-1.5 bg-dark-600 rounded-full">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full transition-all"
              style={{ width: `${progress}%` }} />
            <input type="range" min={0} max={actualDuration || 100} value={currentTime}
              onChange={seek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(Math.floor(actualDuration))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Section Block ─────────────────────────────────────────────────────────────
const SECTION_CONFIG = {
  topStories:     { label: 'Top Stories',          icon: Newspaper,  color: 'text-brand-blue',   bg: 'bg-brand-blue/10 border-brand-blue/20' },
  materialsTech:  { label: 'Materials & Technology', icon: Microscope, color: 'text-brand-purple', bg: 'bg-brand-purple/10 border-brand-purple/20' },
  marketDynamics: { label: 'Market Dynamics',       icon: BarChart2,  color: 'text-emerald-400',  bg: 'bg-emerald-400/10 border-emerald-400/20' },
  expertInsights: { label: 'Expert Insights',        icon: Brain,      color: 'text-amber-400',    bg: 'bg-amber-400/10 border-amber-400/20' },
};

const SectionBlock: React.FC<{ sectionKey: keyof typeof SECTION_CONFIG; content: string }> = ({ sectionKey, content }) => {
  const cfg = SECTION_CONFIG[sectionKey];
  const paragraphs = content.split('\n').filter(p => p.trim().length > 0);

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border w-fit ${cfg.bg} ${cfg.color}`}>
        <cfg.icon className="w-3.5 h-3.5" />
        {cfg.label}
      </div>
      <div className="space-y-3">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-sm text-slate-300 leading-relaxed">{para}</p>
        ))}
      </div>
    </div>
  );
};

// ── Digest Detail Modal ───────────────────────────────────────────────────────
const DigestModal: React.FC<{ digest: MonthlyDigest; onClose: () => void }> = ({ digest, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-3xl max-h-[90vh] bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden flex flex-col"
      onClick={e => e.stopPropagation()}
    >
      <div className="h-1 bg-gradient-to-r from-brand-purple via-brand-blue to-emerald-500 flex-shrink-0" />

      <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookMarked className="w-4 h-4 text-brand-purple" />
            <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">Monthly Digest</span>
          </div>
          <h2 className="text-lg font-bold text-white leading-snug">{digest.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-dark-700 transition-all flex-shrink-0 ml-4"
        >
          ✕
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-6 space-y-8">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatMonthYear(digest.year, digest.month)}
          </span>
          <span className="flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5" />
            {digest.articleCount} articles analysed
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            ~{Math.round(digest.audioDuration / 60)} min podcast
          </span>
        </div>

        {/* Executive Summary */}
        <div className="bg-dark-700/50 rounded-2xl p-4 border border-dark-600">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Executive Summary</p>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">{digest.summary}</p>
        </div>

        {/* Audio Player */}
        {digest.audioUrl && (
          <DigestAudioPlayer audioUrl={digest.audioUrl} duration={digest.audioDuration} />
        )}

        {/* Sections */}
        {(Object.keys(SECTION_CONFIG) as Array<keyof typeof SECTION_CONFIG>).map(key => (
          digest.sections[key] && (
            <SectionBlock key={key} sectionKey={key} content={digest.sections[key]} />
          )
        ))}
      </div>
    </div>
  </div>
);

// ── Digest Card ───────────────────────────────────────────────────────────────
const DigestCard: React.FC<{ digest: MonthlyDigest; onClick: () => void }> = ({ digest, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer group bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden hover:border-brand-purple/50 transition-all"
  >
    <div className="h-1 bg-gradient-to-r from-brand-purple to-brand-blue" />
    <div className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">
          {formatMonthYear(digest.year, digest.month)}
        </span>
        <span className="text-[10px] text-slate-500">{digest.articleCount} articles</span>
      </div>
      <h3 className="font-bold text-white text-sm leading-snug group-hover:text-brand-purple transition-colors line-clamp-2">
        {digest.title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{digest.summary}</p>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Mic className="w-3 h-3" />
          <span>~{Math.round(digest.audioDuration / 60)} min podcast</span>
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-brand-purple group-hover:gap-2 transition-all">
          Read digest <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
export const DigestPage: React.FC = () => {
  const navigate = useNavigate();
  const [digests, setDigests] = useState<MonthlyDigest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDigest, setSelectedDigest] = useState<MonthlyDigest | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'monthlyDigests'),
          orderBy('period', 'desc'),
          limit(24)
        );
        const snap = await getDocs(q);
        setDigests(snap.docs.map(d => ({ id: d.id, ...d.data() } as MonthlyDigest)));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {selectedDigest && (
        <DigestModal digest={selectedDigest} onClose={() => setSelectedDigest(null)} />
      )}

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <BookMarked className="w-4 h-4" />
          <span>Industry Intelligence</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Monthly Digest</h1>
        <p className="text-slate-400 max-w-xl">
          In-depth monthly analysis of the hair replacement industry — trends, technology, markets, and expert insights. Published on the 1st of each month.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader className="w-8 h-8 text-brand-purple animate-spin" />
        </div>
      ) : digests.length === 0 ? (
        <div className="text-center py-32 text-slate-500 space-y-3">
          <BookMarked className="w-12 h-12 mx-auto opacity-30" />
          <p className="text-sm">No digests published yet.</p>
          <p className="text-xs text-slate-600">The first digest will be generated on the 1st of next month.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Latest digest featured */}
          {digests[0] && (
            <div
              onClick={() => navigate(`/digest/${digests[0].period}`)}
              className="cursor-pointer group bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden hover:border-brand-purple/50 transition-all"
            >
              <div className="h-1.5 bg-gradient-to-r from-brand-purple via-brand-blue to-emerald-500" />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
                    Latest Issue
                  </span>
                  <span className="text-xs text-slate-500">{formatMonthYear(digests[0].year, digests[0].month)}</span>
                  <span className="text-xs text-slate-500">{digests[0].articleCount} articles analysed</span>
                </div>
                <h2 className="text-xl font-bold text-white leading-snug group-hover:text-brand-purple transition-colors">
                  {digests[0].title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{digests[0].summary}</p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5" /> ~{Math.round(digests[0].audioDuration / 60)} min podcast</span>
                    <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> 4 sections</span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-bold text-brand-purple group-hover:gap-2 transition-all">
                    Read full digest <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Past issues */}
          {digests.length > 1 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Past Issues</span>
                <div className="flex-1 h-px bg-dark-700" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {digests.slice(1).map(digest => (
                  <DigestCard key={digest.id} digest={digest} onClick={() => navigate(`/digest/${digest.period}`)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
