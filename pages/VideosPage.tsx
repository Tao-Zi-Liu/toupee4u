// pages/VideosPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Video, Play, X, ExternalLink, Star, Search,
  Loader, Filter, Youtube
} from 'lucide-react';
import { getPublishedVideos } from '../services/video.service';
import { VideoPost, VideoPlatform, VideoCategory, VIDEO_PLATFORM_CONFIG } from '../types';

const CATEGORIES: (VideoCategory | 'All')[] = ['All', 'Tutorial', 'Review', 'News', 'Transformation', 'Maintenance', 'Community'];

// ── 嵌入播放器 ────────────────────────────────
const VideoEmbed: React.FC<{ video: VideoPost; onClose: () => void }> = ({ video, onClose }) => {
  const isShorts = video.platform === 'YOUTUBE_SHORTS' || video.platform === 'TIKTOK' || video.platform === 'INSTAGRAM';
  const aspectClass = isShorts ? 'aspect-[9/16] max-w-sm' : 'aspect-video w-full';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`relative ${isShorts ? 'w-full max-w-sm' : 'w-full max-w-4xl'}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0 pr-4">
            <p className="font-bold text-white text-sm truncate">{video.title}</p>
            {video.channelName && <p className="text-xs text-slate-400">{video.channelName}</p>}
          </div>
          <div className="flex items-center gap-2">
            <a href={video.originalUrl} target="_blank" rel="noopener noreferrer"
              className="p-2 bg-dark-800 border border-dark-700 text-slate-400 hover:text-white rounded-lg transition-all">
              <ExternalLink className="w-4 h-4" />
            </a>
            <button onClick={onClose} className="p-2 bg-dark-800 border border-dark-700 text-slate-400 hover:text-white rounded-lg transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className={`${aspectClass} mx-auto bg-black rounded-2xl overflow-hidden`}>
          <iframe
            src={video.embedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={video.title}
          />
        </div>
        {video.platform === 'INSTAGRAM' && (
          <p className="text-xs text-slate-500 text-center mt-2">
            Instagram may require login to play. <a href={video.originalUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Open on Instagram →</a>
          </p>
        )}
      </div>
    </div>
  );
};

// ── 视频卡片 ──────────────────────────────────
const VideoCard: React.FC<{ video: VideoPost; onClick: () => void }> = ({ video, onClick }) => {
  const pCfg = VIDEO_PLATFORM_CONFIG[video.platform];
  const isShorts = video.platform === 'YOUTUBE_SHORTS' || video.platform === 'TIKTOK' || video.platform === 'INSTAGRAM';

  return (
    <div onClick={onClick}
      className="group cursor-pointer bg-dark-800 border border-dark-700 hover:border-dark-500 rounded-2xl overflow-hidden transition-all hover:scale-[1.01]">
      {/* Thumbnail */}
      <div className={`relative overflow-hidden bg-dark-700 ${isShorts ? 'aspect-[9/16]' : 'aspect-video'}`}>
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-900">
            <Play className="w-12 h-12 text-slate-600" />
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Platform badge */}
        <div className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm ${pCfg.bg} ${pCfg.color}`}>
          {pCfg.label}
        </div>

        {/* Featured */}
        {video.featured && (
          <div className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/50 bg-amber-500/20 text-amber-400 flex items-center gap-1 backdrop-blur-sm">
            <Star className="w-2.5 h-2.5 fill-amber-400" /> Featured
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-dark-600 text-slate-500">{video.category}</span>
        </div>
        <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
          {video.title}
        </h3>
        {video.channelName && (
          <p className="text-xs text-slate-500">{video.channelName}</p>
        )}
        {video.description && (
          <p className="text-xs text-slate-500 line-clamp-2">{video.description}</p>
        )}
      </div>
    </div>
  );
};

// ── 主页面 ────────────────────────────────────
export const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);
  const [category, setCategory] = useState<VideoCategory | 'All'>('All');
  const [platform, setPlatform] = useState<VideoPlatform | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPublishedVideos(60).then(setVideos).finally(() => setLoading(false));
  }, []);

  const filtered = videos.filter(v => {
    const matchCat = category === 'All' || v.category === category;
    const matchPlatform = platform === 'ALL' || v.platform === platform;
    const matchSearch = !search ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.channelName?.toLowerCase().includes(search.toLowerCase()) ||
      v.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchPlatform && matchSearch;
  });

  const featured = filtered.filter(v => v.featured);
  const regular = filtered.filter(v => !v.featured);

  // 混合布局：Shorts/Reels 竖版，YouTube 横版
  const shortsVideos = filtered.filter(v => ['YOUTUBE_SHORTS', 'TIKTOK', 'INSTAGRAM'].includes(v.platform));
  const wideVideos = filtered.filter(v => ['YOUTUBE', 'FACEBOOK'].includes(v.platform));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {selectedVideo && <VideoEmbed video={selectedVideo} onClose={() => setSelectedVideo(null)} />}

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Video className="w-4 h-4" /><span>Video Hub</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Videos</h1>
        <p className="text-slate-400 max-w-xl">
          Tutorials, reviews, and industry content from YouTube, TikTok, Instagram & Facebook.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search videos..."
            className="w-full bg-dark-800 border border-dark-700 focus:border-brand-blue rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Platform */}
          <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
            {(['ALL', 'YOUTUBE', 'YOUTUBE_SHORTS', 'TIKTOK', 'INSTAGRAM', 'FACEBOOK'] as const).map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  platform === p ? 'bg-dark-700 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}>
                {p === 'ALL' ? 'All Platforms' : VIDEO_PLATFORM_CONFIG[p as VideoPlatform].label}
              </button>
            ))}
          </div>
          {/* Category */}
          <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 overflow-x-auto">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  category === c ? 'bg-dark-700 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><Loader className="w-8 h-8 text-brand-blue animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32 text-slate-500 space-y-3">
          <Video className="w-12 h-12 mx-auto opacity-30" />
          <p>No videos found.</p>
        </div>
      ) : (
        <div className="space-y-10">

          {/* Featured row */}
          {featured.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400" /> Featured
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featured.map(v => <VideoCard key={v.id} video={v} onClick={() => setSelectedVideo(v)} />)}
              </div>
            </div>
          )}

          {/* Wide videos (YouTube/Facebook) */}
          {wideVideos.filter(v => !v.featured).length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Play className="w-4 h-4" /> Videos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wideVideos.filter(v => !v.featured).map(v => <VideoCard key={v.id} video={v} onClick={() => setSelectedVideo(v)} />)}
              </div>
            </div>
          )}

          {/* Shorts / Reels / TikTok */}
          {shortsVideos.filter(v => !v.featured).length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Video className="w-4 h-4" /> Shorts & Reels
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {shortsVideos.filter(v => !v.featured).map(v => <VideoCard key={v.id} video={v} onClick={() => setSelectedVideo(v)} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
