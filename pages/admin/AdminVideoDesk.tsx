// pages/admin/AdminVideoDesk.tsx
import React, { useState, useEffect } from 'react';
import {
  Video, Plus, Trash2, Eye, EyeOff, Star, StarOff,
  ExternalLink, Loader, RefreshCw, Youtube, X, Check,
  AlertCircle
} from 'lucide-react';
import {
  detectPlatform, extractVideoId, getThumbnail, getEmbedUrl,
  addVideo, updateVideo, deleteVideo, getAllVideos
} from '../../services/video.service';
import { VideoPost, VideoPlatform, VideoCategory, VideoStatus, VIDEO_PLATFORM_CONFIG } from '../../types';

const CATEGORIES: VideoCategory[] = ['Tutorial', 'Review', 'News', 'Transformation', 'Maintenance', 'Community'];

const PLATFORM_ICONS: Record<VideoPlatform, string> = {
  YOUTUBE: '▶',
  YOUTUBE_SHORTS: '▶',
  TIKTOK: '♪',
  INSTAGRAM: '◈',
  FACEBOOK: 'f',
};

// ── URL 解析预览 ──────────────────────────────
const UrlParser: React.FC<{ onParsed: (data: Partial<VideoPost>) => void }> = ({ onParsed }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [parsed, setParsed] = useState<Partial<VideoPost> | null>(null);

  const parse = () => {
    setError('');
    setParsed(null);
    const platform = detectPlatform(url.trim());
    if (!platform) {
      setError('Unsupported URL. Supported: YouTube, YouTube Shorts, TikTok, Instagram Reels, Facebook Video');
      return;
    }
    const videoId = extractVideoId(url.trim(), platform);
    if (!videoId) {
      setError('Could not extract video ID from URL');
      return;
    }
    const result: Partial<VideoPost> = {
      platform,
      originalUrl: url.trim(),
      videoId,
      embedUrl: getEmbedUrl(platform, videoId),
      thumbnailUrl: getThumbnail(platform, videoId),
    };
    setParsed(result);
    onParsed(result);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={url}
          onChange={e => { setUrl(e.target.value); setError(''); setParsed(null); }}
          onKeyDown={e => e.key === 'Enter' && parse()}
          placeholder="Paste YouTube, TikTok, Instagram Reels, or Facebook video URL..."
          className="flex-1 bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
        />
        <button onClick={parse}
          className="px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all">
          Parse
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
        </div>
      )}
      {parsed && (
        <div className="flex items-center gap-3 bg-emerald-400/5 border border-emerald-400/20 rounded-xl px-3 py-2">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border mr-2 ${VIDEO_PLATFORM_CONFIG[parsed.platform!].bg} ${VIDEO_PLATFORM_CONFIG[parsed.platform!].color}`}>
              {VIDEO_PLATFORM_CONFIG[parsed.platform!].label}
            </span>
            <span className="text-xs text-slate-300 font-mono">{parsed.videoId}</span>
          </div>
          {parsed.thumbnailUrl && (
            <img src={parsed.thumbnailUrl} alt="" className="w-16 h-10 object-cover rounded-lg flex-shrink-0" />
          )}
        </div>
      )}
    </div>
  );
};

// ── 添加视频表单 ──────────────────────────────
const AddVideoForm: React.FC<{ onAdded: () => void; onCancel: () => void }> = ({ onAdded, onCancel }) => {
  const [parsed, setParsed] = useState<Partial<VideoPost>>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoCategory>('Tutorial');
  const [tags, setTags] = useState('');
  const [channelName, setChannelName] = useState('');
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  const canSave = !!parsed.platform && !!title.trim();

  const handleSave = async () => {
    if (!canSave || !parsed.platform) return;
    setSaving(true);
    try {
      await addVideo({
        title: title.trim(),
        description: description.trim(),
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        platform: parsed.platform,
        originalUrl: parsed.originalUrl || '',
        videoId: parsed.videoId || '',
        embedUrl: parsed.embedUrl || '',
        thumbnailUrl: parsed.thumbnailUrl || '',
        channelName: channelName.trim(),
        status: 'PUBLISHED',
        featured,
      });
      onAdded();
    } catch (err: any) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-sm">Add New Video</h3>
        <button onClick={onCancel} className="text-slate-600 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
      </div>

      {/* URL Parser */}
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Video URL *</label>
        <UrlParser onParsed={setParsed} />
      </div>

      {/* Title */}
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Title *</label>
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Video title..."
          className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none" />
      </div>

      {/* Description */}
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
          placeholder="Brief description..."
          className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none resize-none" />
      </div>

      {/* Category + Channel */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value as VideoCategory)}
            className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Channel / Creator</label>
          <input value={channelName} onChange={e => setChannelName(e.target.value)}
            placeholder="e.g. HairSystemPro"
            className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none" />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Tags <span className="font-normal text-slate-600">(comma separated)</span></label>
        <input value={tags} onChange={e => setTags(e.target.value)}
          placeholder="e.g. lace front, tutorial, maintenance"
          className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none" />
      </div>

      {/* Featured toggle */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div onClick={() => setFeatured(p => !p)}
          className={`w-10 h-6 rounded-full transition-all flex items-center ${featured ? 'bg-amber-500' : 'bg-dark-600 border border-dark-500'}`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow transition-all mx-1 ${featured ? 'translate-x-4' : ''}`} />
        </div>
        <span className="text-sm font-bold text-slate-300 group-hover:text-white">Featured video</span>
        <Star className={`w-4 h-4 ${featured ? 'text-amber-500' : 'text-slate-600'}`} />
      </label>

      {/* Save */}
      <div className="flex gap-2 pt-1">
        <button onClick={handleSave} disabled={!canSave || saving}
          className="flex-1 py-2.5 bg-brand-blue hover:bg-blue-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Add Video'}
        </button>
        <button onClick={onCancel}
          className="px-4 py-2.5 bg-dark-700 text-slate-400 font-bold rounded-xl text-sm hover:text-white transition-all">
          Cancel
        </button>
      </div>
    </div>
  );
};

// ── 主组件 ────────────────────────────────────
export const AdminVideoDesk: React.FC = () => {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<VideoPlatform | 'ALL'>('ALL');

  const load = async () => {
    setLoading(true);
    try {
      setVideos(await getAllVideos());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggleStatus = async (video: VideoPost) => {
    if (!video.id) return;
    setActionId(video.id);
    const newStatus: VideoStatus = video.status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';
    await updateVideo(video.id, { status: newStatus });
    setVideos(prev => prev.map(v => v.id === video.id ? { ...v, status: newStatus } : v));
    setActionId(null);
  };

  const handleToggleFeatured = async (video: VideoPost) => {
    if (!video.id) return;
    setActionId(video.id);
    await updateVideo(video.id, { featured: !video.featured });
    setVideos(prev => prev.map(v => v.id === video.id ? { ...v, featured: !v.featured } : v));
    setActionId(null);
  };

  const handleDelete = async (video: VideoPost) => {
    if (!video.id || !window.confirm(`Delete "${video.title}"?`)) return;
    setActionId(video.id);
    await deleteVideo(video.id);
    setVideos(prev => prev.filter(v => v.id !== video.id));
    setActionId(null);
  };

  const filtered = filterPlatform === 'ALL' ? videos : videos.filter(v => v.platform === filterPlatform);
  const published = videos.filter(v => v.status === 'PUBLISHED').length;
  const featured = videos.filter(v => v.featured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Video className="w-6 h-6 text-brand-blue" /> Video Desk
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage embedded videos from YouTube, TikTok, Instagram & Facebook</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={loading}
            className="p-2 bg-dark-800 border border-dark-700 text-slate-400 hover:text-white rounded-xl transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setShowAddForm(true)} disabled={showAddForm}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-all">
            <Plus className="w-4 h-4" /> Add Video
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Videos', value: videos.length, color: 'text-slate-300' },
          { label: 'Published', value: published, color: 'text-emerald-400' },
          { label: 'Featured', value: featured, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <AddVideoForm
          onAdded={() => { setShowAddForm(false); load(); }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Platform Filter */}
      <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 w-fit flex-wrap">
        {(['ALL', 'YOUTUBE', 'YOUTUBE_SHORTS', 'TIKTOK', 'INSTAGRAM', 'FACEBOOK'] as const).map(p => (
          <button key={p} onClick={() => setFilterPlatform(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterPlatform === p ? 'bg-dark-700 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}>
            {p === 'ALL' ? 'All' : VIDEO_PLATFORM_CONFIG[p as VideoPlatform].label}
          </button>
        ))}
      </div>

      {/* Video List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-blue animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500 space-y-3">
          <Video className="w-12 h-12 mx-auto opacity-30" />
          <p>No videos yet. Click "Add Video" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(video => {
            const pCfg = VIDEO_PLATFORM_CONFIG[video.platform];
            const isActing = actionId === video.id;
            return (
              <div key={video.id} className={`bg-dark-800 border rounded-2xl overflow-hidden transition-all ${
                video.status === 'PUBLISHED' ? 'border-dark-700' : 'border-dark-700 opacity-60'
              }`}>
                <div className="flex items-center gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-dark-700 border border-dark-600">
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-lg font-bold">
                        {PLATFORM_ICONS[video.platform]}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${pCfg.bg} ${pCfg.color}`}>
                        {pCfg.label}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-dark-600 text-slate-500">
                        {video.category}
                      </span>
                      {video.featured && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5" /> Featured
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                        video.status === 'PUBLISHED'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-slate-600 bg-dark-700 text-slate-500'
                      }`}>{video.status}</span>
                    </div>
                    <p className="font-bold text-white text-sm truncate">{video.title}</p>
                    {video.channelName && (
                      <p className="text-xs text-slate-500 mt-0.5">{video.channelName}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={video.originalUrl} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-white bg-dark-700 rounded-lg transition-all">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => handleToggleFeatured(video)} disabled={isActing}
                      title={video.featured ? 'Remove featured' : 'Mark as featured'}
                      className={`p-2 rounded-lg transition-all ${video.featured ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-amber-400 bg-dark-700'}`}>
                      {video.featured ? <Star className="w-3.5 h-3.5" /> : <StarOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleToggleStatus(video)} disabled={isActing}
                      title={video.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      className={`p-2 rounded-lg transition-all ${
                        video.status === 'PUBLISHED'
                          ? 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20'
                          : 'text-slate-500 hover:text-emerald-400 bg-dark-700'
                      }`}>
                      {isActing ? <Loader className="w-3.5 h-3.5 animate-spin" /> :
                        video.status === 'PUBLISHED' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleDelete(video)} disabled={isActing}
                      className="p-2 text-slate-500 hover:text-red-400 bg-dark-700 hover:bg-red-400/10 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
