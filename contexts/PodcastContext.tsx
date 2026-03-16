// contexts/PodcastContext.tsx
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, X } from 'lucide-react';

export interface Podcast {
  id?: string;
  title: string;
  description: string;
  audioUrl: string;
  duration?: number;
  coverImage?: string;
  generatedDate?: string;
  publishedAt?: any;
  status?: string;
  tags?: string[];
  episodeNumber?: number | null;
  transcript?: string;
  script?: any[];
}

interface PodcastContextType {
  floatingPodcast: Podcast | null;
  openFloating: (podcast: Podcast) => void;
  closeFloating: () => void;
}

const PodcastContext = createContext<PodcastContextType>({
  floatingPodcast: null,
  openFloating: () => {},
  closeFloating: () => {},
});

export const usePodcast = () => useContext(PodcastContext);

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const FloatingPlayer: React.FC<{ podcast: Podcast; onClose: () => void }> = ({ podcast, onClose }) => {
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
      <div className="relative h-1 bg-dark-700 cursor-pointer">
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-blue to-purple-500 transition-all"
          style={{ width: `${progress}%` }} />
        <input type="range" min={0} max={duration || 100} value={currentTime}
          onChange={seek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      </div>
      <div className="flex items-center gap-4 px-4 py-3 max-w-7xl mx-auto">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-blue/30 to-purple-500/30 border border-dark-500 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {podcast.coverImage
            ? <img src={podcast.coverImage} alt="" className="w-full h-full object-cover" />
            : <Mic className="w-4 h-4 text-brand-blue" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{podcast.title}</p>
          <p className="text-[10px] text-slate-500 font-mono">{formatTime(currentTime)} / {formatTime(duration)}</p>
        </div>
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
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-dark-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const PodcastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [floatingPodcast, setFloatingPodcast] = useState<Podcast | null>(null);

  return (
    <PodcastContext.Provider value={{
      floatingPodcast,
      openFloating: setFloatingPodcast,
      closeFloating: () => setFloatingPodcast(null),
    }}>
      {children}
      {floatingPodcast && (
        <FloatingPlayer
          key={floatingPodcast.id}
          podcast={floatingPodcast}
          onClose={() => setFloatingPodcast(null)}
        />
      )}
    </PodcastContext.Provider>
  );
};
