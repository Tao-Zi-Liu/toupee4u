// pages/admin/AdminPodcastDesk.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, Upload, Play, Pause, Trash2, Eye, EyeOff, Plus,
  Loader, Clock, Calendar, CheckCircle, X, Save, Radio,
  FileAudio, AlertTriangle, Sparkles, RefreshCw
} from 'lucide-react';
import {
  collection, query, orderBy, getDocs, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase.config';
import { Podcast } from '../PodcastPage';

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(val: any): string {
  if (!val) return '—';
  const d = val?.toDate ? val.toDate() : new Date(val);
  if (isNaN(d.getTime())) return '—';
  return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}

// ── Upload Form ────────────────────────────────────────────────────────────────

interface UploadFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onSaved, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [transcript, setTranscript] = useState('');
  const [tags, setTags] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file.');
      return;
    }
    setAudioFile(file);
    setError('');
    // Get duration
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      setAudioDuration(Math.round(audio.duration));
      URL.revokeObjectURL(url);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!audioFile) { setError('Please select an audio file.'); return; }

    setUploading(true);
    setError('');

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `podcasts/${Date.now()}_${audioFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, audioFile);

      const audioUrl = await new Promise<string>((resolve, reject) => {
        uploadTask.on('state_changed',
          snap => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      // Save to Firestore
      await addDoc(collection(db, 'podcasts'), {
        title: title.trim(),
        description: description.trim(),
        transcript: transcript.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        episodeNumber: episodeNumber ? parseInt(episodeNumber) : null,
        audioUrl,
        audioPath: storageRef.fullPath,
        duration: audioDuration,
        status: 'DRAFT',
        createdAt: serverTimestamp(),
        publishedAt: null,
      });

      onSaved();
    } catch (e: any) {
      setError(e.message || 'Upload failed.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-blue" /> New Episode
        </h3>
        <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Audio Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          audioFile ? 'border-brand-blue/50 bg-brand-blue/5' : 'border-dark-500 hover:border-dark-400'
        }`}
        onClick={() => fileInputRef.current?.click()}>
        <input ref={fileInputRef} type="file" accept="audio/*" className="hidden"
          onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
        {audioFile ? (
          <div>
            <FileAudio className="w-6 h-6 text-brand-blue mx-auto mb-1" />
            <p className="text-xs font-bold text-white">{audioFile.name}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {(audioFile.size / 1024 / 1024).toFixed(1)} MB
              {audioDuration > 0 && ` · ${formatTime(audioDuration)}`}
            </p>
          </div>
        ) : (
          <div>
            <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Drop audio file here or click to browse</p>
            <p className="text-[10px] text-slate-600 mt-1">MP3, WAV, M4A supported</p>
          </div>
        )}
      </div>

      {/* Upload progress */}
      {uploading && (
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Uploading...</span><span>{uploadProgress}%</span>
          </div>
          <div className="h-1.5 bg-dark-700 rounded-full">
            <div className="h-full bg-brand-blue rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {/* Fields */}
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Episode title..."
            className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Episode #</label>
          <input value={episodeNumber} onChange={e => setEpisodeNumber(e.target.value)}
            type="number" placeholder="1"
            className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          rows={3} placeholder="What's this episode about?"
          className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none resize-none" />
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tags (comma separated)</label>
        <input value={tags} onChange={e => setTags(e.target.value)}
          placeholder="hair system, alopecia, maintenance..."
          className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none" />
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Transcript (optional)</label>
        <textarea value={transcript} onChange={e => setTranscript(e.target.value)}
          rows={4} placeholder="Paste NotebookLM transcript here..."
          className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none resize-none" />
      </div>

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} disabled={uploading}
          className="flex-1 py-2 rounded-xl border border-dark-500 text-xs text-slate-400 hover:text-white hover:border-dark-400 transition-all disabled:opacity-50">
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={uploading || !audioFile || !title.trim()}
          className="flex-1 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue/80 text-xs font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {uploading ? <><Loader className="w-3.5 h-3.5 animate-spin" /> Uploading...</> : <><Save className="w-3.5 h-3.5" /> Save as Draft</>}
        </button>
      </div>
    </div>
  );
};

// ── Podcast Row ────────────────────────────────────────────────────────────────

interface PodcastRowProps {
  podcast: Podcast & { audioPath?: string };
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDelete: (id: string, audioPath?: string) => void;
  actionLoading: boolean;
}

const PodcastRow: React.FC<PodcastRowProps> = ({ podcast, onPublish, onUnpublish, onDelete, actionLoading }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); } else { audio.play(); }
    setPlaying(!playing);
  };

  const isPublished = podcast.status === 'PUBLISHED';

  return (
    <div className={`bg-dark-800/60 border rounded-xl p-4 transition-all ${isPublished ? 'border-emerald-500/20' : 'border-dark-600/60'}`}>
      <audio ref={audioRef} src={podcast.audioUrl} preload="none" onEnded={() => setPlaying(false)} />
      <div className="flex items-start gap-3">
        {/* Play button */}
        <button onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-dark-700 hover:bg-brand-blue border border-dark-500 hover:border-brand-blue flex items-center justify-center flex-shrink-0 transition-all">
          {playing ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white ml-0.5" />}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {podcast.episodeNumber && (
              <span className="text-[10px] font-bold text-brand-blue/70">EP{podcast.episodeNumber}</span>
            )}
            <p className="text-sm font-bold text-white truncate">{podcast.title}</p>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isPublished ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
            }`}>{isPublished ? 'Published' : 'Draft'}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500 flex-wrap">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(podcast.duration)}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Created: {formatDate(podcast.createdAt)}</span>
            {podcast.publishedAt && (
              <span className="flex items-center gap-1 text-emerald-500"><CheckCircle className="w-3 h-3" /> Published: {formatDate(podcast.publishedAt)}</span>
            )}
          </div>
          {podcast.description && (
            <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-1">{podcast.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isPublished ? (
            <button onClick={() => onUnpublish(podcast.id!)} disabled={actionLoading}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 bg-dark-700 hover:bg-dark-600 border border-dark-500 rounded-lg text-slate-300 transition-all disabled:opacity-50">
              <EyeOff className="w-3 h-3" /> Unpublish
            </button>
          ) : (
            <button onClick={() => onPublish(podcast.id!)} disabled={actionLoading}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 transition-all disabled:opacity-50">
              <Eye className="w-3 h-3" /> Publish
            </button>
          )}
          <button onClick={() => onDelete(podcast.id!, (podcast as any).audioPath)} disabled={actionLoading}
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-all disabled:opacity-50">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Admin Page ────────────────────────────────────────────────────────────

export const AdminPodcastDesk: React.FC = () => {
  const [podcasts, setPodcasts] = useState<(Podcast & { audioPath?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [generating, setGenerating] = useState(false);
  const [generateMsg, setGenerateMsg] = useState('');

  const handleGeneratePodcast = async () => {
    setGenerating(true);
    setGenerateMsg('');
    try {
      const fn = httpsCallable(getFunctions(), 'generatePodcastManual');
      const result: any = await fn({});
      if (result.data?.skipped) {
        setGenerateMsg("⚠️ Already generated today's podcast.");
      } else {
        setGenerateMsg(`✅ Podcast generated! ~${result.data?.duration}s, ${result.data?.lines} lines.`);
        await load();
      }
    } catch (err: any) {
      setGenerateMsg(`❌ ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const load = async () => {
    try {
      const q = query(collection(db, 'podcasts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const items = snap.docs.map(d => {
        const data = d.data();
        if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate().toISOString();
        if (data.publishedAt?.toDate) data.publishedAt = data.publishedAt.toDate().toISOString();
        return { id: d.id, ...data } as Podcast & { audioPath?: string };
      });
      setPodcasts(items);
    } catch (e) {
      console.error('Failed to load podcasts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handlePublish = async (id: string) => {
    setActionLoading(true);
    try {
      await updateDoc(doc(db, 'podcasts', id), {
        status: 'PUBLISHED',
        publishedAt: serverTimestamp(),
      });
      await load();
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnpublish = async (id: string) => {
    setActionLoading(true);
    try {
      await updateDoc(doc(db, 'podcasts', id), {
        status: 'DRAFT',
        publishedAt: null,
      });
      await load();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, audioPath?: string) => {
    if (!window.confirm('Delete this episode permanently?')) return;
    setActionLoading(true);
    try {
      await deleteDoc(doc(db, 'podcasts', id));
      if (audioPath) {
        try { await deleteObject(ref(storage, audioPath)); } catch {}
      }
      await load();
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = podcasts.filter(p => filter === 'ALL' || p.status === filter);
  const published = podcasts.filter(p => p.status === 'PUBLISHED').length;
  const draft = podcasts.filter(p => p.status === 'DRAFT').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-brand-blue" />
            <h1 className="text-xl font-bold text-white">Podcast Desk</h1>
          </div>
          <p className="text-xs text-slate-500">Upload and manage NotebookLM podcast episodes</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleGeneratePodcast} disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-all">
            {generating ? <><Loader className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Today's Podcast</>}
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-brand-blue/80 rounded-xl text-xs font-bold text-white transition-all">
            <Plus className="w-4 h-4" /> New Episode
          </button>
        </div>
      </div>

      {/* Generate message */}
      {generateMsg && (
        <div className={`text-xs px-4 py-2.5 rounded-xl border ${generateMsg.startsWith('✅') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : generateMsg.startsWith('⚠️') ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {generateMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: podcasts.length, color: 'text-white' },
          { label: 'Published', value: published, color: 'text-emerald-400' },
          { label: 'Draft', value: draft, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800/60 border border-dark-600/60 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upload Form */}
      {showForm && (
        <UploadForm onSaved={() => { setShowForm(false); load(); }} onCancel={() => setShowForm(false)} />
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === f ? 'bg-brand-blue text-white' : 'bg-dark-700 text-slate-400 hover:text-white border border-dark-600'
            }`}>
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader className="w-5 h-5 text-brand-blue animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-dark-600 rounded-2xl">
          <Mic className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No episodes yet. Upload your first episode above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <PodcastRow key={p.id} podcast={p}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onDelete={handleDelete}
              actionLoading={actionLoading} />
          ))}
        </div>
      )}
    </div>
  );
};
