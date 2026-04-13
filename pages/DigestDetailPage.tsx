// pages/DigestDetailPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookMarked, ChevronLeft, ChevronRight, Calendar,
  Newspaper, Mic, TrendingUp, Microscope, BarChart2, Brain,
  Play, Pause, SkipBack, SkipForward, Loader, ArrowLeft
} from 'lucide-react';
import { doc, getDoc, collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
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
}

function formatMonthYear(year: number, month: number): string {
  return new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const SECTIONS = [
  { key: 'topStories',     label: 'Top Stories',            icon: Newspaper,  color: 'text-brand-blue',   bg: 'bg-brand-blue/10 border-brand-blue/20',     id: 'top-stories' },
  { key: 'materialsTech',  label: 'Materials & Technology',  icon: Microscope, color: 'text-brand-purple', bg: 'bg-brand-purple/10 border-brand-purple/20', id: 'materials-tech' },
  { key: 'marketDynamics', label: 'Market Dynamics',         icon: BarChart2,  color: 'text-emerald-400',  bg: 'bg-emerald-400/10 border-emerald-400/20',   id: 'market-dynamics' },
  { key: 'expertInsights', label: 'Expert Insights',          icon: Brain,      color: 'text-amber-400',    bg: 'bg-amber-400/10 border-amber-400/20',       id: 'expert-insights' },
] as const;

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
    if (playing) { audio.pause(); setPlaying(false); }
    else { try { await audio.play(); setPlaying(true); } catch (e) { console.error(e); } }
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
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center flex-shrink-0">
          <Mic className="w-5 h-5 text-brand-purple" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Monthly Review Podcast</p>
          <p className="text-[10px] text-slate-500">Deep-dive analysis · ~{Math.round(actualDuration / 60)} min</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="relative h-1.5 bg-dark-600 rounded-full">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full transition-all"
            style={{ width: `${progress}%` }} />
          <input type="range" min={0} max={actualDuration || 100} value={currentTime}
            onChange={seek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">{formatDuration(Math.floor(currentTime))}</span>
          <div className="flex items-center gap-3">
            <button onClick={() => skip(-15)} className="text-slate-400 hover:text-white transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-brand-purple hover:bg-brand-purple/80 flex items-center justify-center transition-all shadow-lg shadow-brand-purple/20">
              {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
            </button>
            <button onClick={() => skip(15)} className="text-slate-400 hover:text-white transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{formatDuration(Math.floor(actualDuration))}</span>
        </div>
      </div>
    </div>
  );
};

export const DigestDetailPage: React.FC = () => {
  const { period } = useParams<{ period: string }>();
  const navigate = useNavigate();
  const [digest, setDigest] = useState<MonthlyDigest | null>(null);
  const [loading, setLoading] = useState(true);
  const [adjacentPeriods, setAdjacentPeriods] = useState<{ prev: string | null; next: string | null }>({ prev: null, next: null });
  const [activeSection, setActiveSection] = useState('top-stories');

  useEffect(() => {
    const load = async () => {
      if (!period) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'monthlyDigests', period);
        const snap = await getDoc(docRef);
        if (!snap.exists()) { navigate('/digest'); return; }
        setDigest({ id: snap.id, ...snap.data() } as MonthlyDigest);
        const allSnap = await getDocs(query(collection(db, 'monthlyDigests'), orderBy('period', 'desc'), limit(24)));
        const periods = allSnap.docs.map(d => d.id);
        const idx = periods.indexOf(period);
        setAdjacentPeriods({
          next: idx > 0 ? periods[idx - 1] : null,
          prev: idx < periods.length - 1 ? periods[idx + 1] : null,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  // Scroll spy — 用 scroll 事件监听滚动容器
  useEffect(() => {
    if (!digest) return;

    const handleScroll = () => {
      const threshold = window.innerHeight * 0.35;
      // 从后往前找第一个顶部已经进入视口上半段的 section
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            setActiveSection(SECTIONS[i].id);
            return;
          }
        }
      }
      // 如果所有 section 都在视口下方，激活第一个
      setActiveSection(SECTIONS[0].id);
    };

    // 找到实际滚动容器（main 或 window）
    const scrollEl = document.querySelector('.overflow-auto.h-screen') || window;
    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    // 初始化
    setTimeout(handleScroll, 100);
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, [digest]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader className="w-8 h-8 text-brand-purple animate-spin" />
    </div>
  );

  if (!digest) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Back button */}
      <Link to="/digest" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to All Issues
      </Link>

      {/* Hero - full width */}
      <div className="space-y-4 pb-8 border-b border-dark-700">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
            <BookMarked className="w-3 h-3" /> Monthly Digest
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {formatMonthYear(digest.year, digest.month)}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5" /> {digest.articleCount} articles analysed
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight">{digest.title}</h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">{digest.summary}</p>
      </div>

      {/* Main layout: sidebar + content */}
      <div className="flex gap-10 items-start">

        {/* Left sidebar */}
        <div className="hidden lg:flex flex-col gap-5 w-56 flex-shrink-0 self-start"
          style={{ position: 'sticky', top: '1rem', alignSelf: 'flex-start' }}>

          {/* TOC */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Contents</p>
            <nav className="space-y-1">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                    activeSection === s.id
                      ? `${s.bg} ${s.color} border`
                      : 'text-slate-500 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {s.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Audio Player */}
          {digest.audioUrl && (
            <DigestAudioPlayer audioUrl={digest.audioUrl} duration={digest.audioDuration} />
          )}

          {/* Prev / Next */}
          <div className="space-y-2">
            {adjacentPeriods.prev && (
              <Link to={`/digest/${adjacentPeriods.prev}`}
                className="flex items-center gap-2 px-3 py-2.5 bg-dark-800 border border-dark-700 hover:border-dark-500 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all">
                <ChevronLeft className="w-4 h-4" /> Previous Issue
              </Link>
            )}
            {adjacentPeriods.next && (
              <Link to={`/digest/${adjacentPeriods.next}`}
                className="flex items-center gap-2 px-3 py-2.5 bg-dark-800 border border-dark-700 hover:border-dark-500 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all">
                Next Issue <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Right: Article content */}
        <div className="flex-1 min-w-0 space-y-16">

          {/* Mobile audio player */}
          {digest.audioUrl && (
            <div className="lg:hidden">
              <DigestAudioPlayer audioUrl={digest.audioUrl} duration={digest.audioDuration} />
            </div>
          )}

          {SECTIONS.map(s => {
            const content = digest.sections[s.key as keyof typeof digest.sections];
            if (!content) return null;
            const paragraphs = content.split('\n').filter(p => p.trim().length > 0);
            return (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 rounded-xl border ${s.bg}`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{s.label}</h2>
                </div>
                <div className="space-y-5">
                  {paragraphs.map((para, i) => (
                    <p key={i} className="text-slate-300 leading-relaxed text-base">{para}</p>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Bottom navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-dark-700">
            {adjacentPeriods.prev ? (
              <Link to={`/digest/${adjacentPeriods.prev}`}
                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous Issue
              </Link>
            ) : <div />}
            <Link to="/digest" className="text-xs text-slate-500 hover:text-white transition-colors">
              All Issues
            </Link>
            {adjacentPeriods.next ? (
              <Link to={`/digest/${adjacentPeriods.next}`}
                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                Next Issue <ChevronRight className="w-4 h-4" />
              </Link>
            ) : <div />}
          </div>

        </div>
      </div>
    </div>
  );
};
