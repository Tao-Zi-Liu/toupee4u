
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {Plus,Trash2,Search,X,Edit3,FileText,ChevronRight,ChevronDown,Save,Eye,EyeOff, ArrowUp, ArrowDown,
  Layers, BookOpen, Folder, Check, AlertCircle, Loader
} from 'lucide-react';
import {
  getKBCategories, createKBCategory, createKBTopic, createKBArticle,
  updateKBArticle, deleteKBArticle, KBCategory, KBTopic, KBArticle
} from '../../services/kb.service';
import {
  doc, updateDoc, deleteDoc, addDoc, collection, serverTimestamp, setDoc
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useData } from '../../contexts/DataContext';

// ============================================================
// Rich Text Editor Component
// ============================================================
const RichTextEditor: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const ToolBtn = ({ cmd, val, label, title }: { cmd: string; val?: string; label: string; title: string }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); exec(cmd, val); }}
      title={title}
      className="px-2 py-1 text-xs text-slate-300 hover:text-white hover:bg-dark-600 rounded transition-colors font-medium"
    >
      {label}
    </button>
  );

  return (
    <div className="border border-dark-600 rounded-xl overflow-hidden focus-within:border-brand-blue transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-dark-900 border-b border-dark-700">
        <ToolBtn cmd="bold" label="B" title="Bold" />
        <ToolBtn cmd="italic" label="I" title="Italic" />
        <ToolBtn cmd="underline" label="U" title="Underline" />
        <div className="w-px h-4 bg-dark-600 mx-1" />
        <ToolBtn cmd="formatBlock" val="h2" label="H2" title="Heading 2" />
        <ToolBtn cmd="formatBlock" val="h3" label="H3" title="Heading 3" />
        <ToolBtn cmd="formatBlock" val="p" label="P" title="Paragraph" />
        <div className="w-px h-4 bg-dark-600 mx-1" />
        <ToolBtn cmd="insertUnorderedList" label="• List" title="Bullet List" />
        <ToolBtn cmd="insertOrderedList" label="1. List" title="Numbered List" />
        <div className="w-px h-4 bg-dark-600 mx-1" />
        <ToolBtn cmd="formatBlock" val="blockquote" label="❝ Quote" title="Blockquote" />
        <ToolBtn cmd="formatBlock" val="pre" label="</> Code" title="Code Block" />
        <div className="w-px h-4 bg-dark-600 mx-1" />
        <ToolBtn cmd="removeFormat" label="✕ Clear" title="Clear Formatting" />
        <div className="w-px h-4 bg-dark-600 mx-1" />
        <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setShowVideoInput(!showVideoInput);
          }}
          title="Embed Video"
          className="px-2 py-1 text-xs text-slate-300 hover:text-white hover:bg-dark-600 rounded transition-colors font-medium"
        >
          ▶ Video
        </button>
        
        {showVideoInput && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-dark-700 border border-dark-600 rounded-xl p-3 shadow-xl w-80">
            <p className="text-xs text-slate-400 mb-2">Paste YouTube, Vimeo, or Bilibili URL:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 bg-dark-900 border border-dark-600 rounded-lg px-3 py-1.5 text-white text-xs focus:border-brand-blue focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  if (!videoUrl.trim()) return;
                  let embedUrl = '';
                  
                  const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
                  if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
                  
                  const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
                  if (vimeoMatch) embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
                  
                  const biliMatch = videoUrl.match(/bilibili\.com\/video\/(BV\w+|av\d+)/);
                  if (biliMatch) embedUrl = `https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&autoplay=0`;
                  
                  if (!embedUrl) embedUrl = videoUrl;
                  
                  const iframe = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:16px 0;border-radius:12px;"><iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:12px;" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>`;
                  
                  if (editorRef.current) {
                    editorRef.current.focus();
                    document.execCommand('insertHTML', false, iframe);
                    onChange(editorRef.current.innerHTML);
                  }
                  
                  setVideoUrl('');
                  setShowVideoInput(false);
                }}
                className="px-3 py-1.5 bg-brand-blue hover:bg-blue-600 text-white text-xs rounded-lg transition-colors font-medium"
              >
                Insert
              </button>
        <button
          type="button"
          onClick={() => { setShowVideoInput(false); setVideoUrl(''); }}
          className="px-2 py-1.5 text-slate-400 hover:text-white transition-colors text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  )}
</div>
      </div>
      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => { if (editorRef.current) onChange(editorRef.current.innerHTML); }}
        className="min-h-[320px] max-h-[500px] overflow-y-auto p-4 text-slate-200 text-sm leading-relaxed outline-none
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_h2]:mt-4
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mb-2 [&_h3]:mt-3
          [&_p]:mb-3 [&_p]:text-slate-300
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
          [&_li]:text-slate-300
          [&_blockquote]:border-l-4 [&_blockquote]:border-brand-blue [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:my-3
          [&_pre]:bg-dark-900 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-xs [&_pre]:text-green-400 [&_pre]:my-3 [&_pre]:overflow-x-auto
          [&_strong]:text-white [&_strong]:font-bold
          [&_em]:italic [&_em]:text-slate-300"
      />
    </div>
  );
};

// ============================================================
// Toast Notification
// ============================================================
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium animate-in slide-in-from-bottom-4 duration-300 ${
      type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
    }`}>
      {type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </div>
  );
};

// ============================================================
// Main AdminKB Component
// ============================================================
export const AdminKB: React.FC = () => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [categories, setCategories] = useState<KBCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Data Context for global sync
  const { refreshKB } = useData();

  // UI State
  const [selectedCategory, setSelectedCategory] = useState<KBCategory | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<KBTopic | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [modal, setModal] = useState<'category' | 'topic' | 'article' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [catForm, setCatForm] = useState({ name: '', description: '', physicsTheme: '', iconName: 'Layers' });
  const [topicForm, setTopicForm] = useState({ title: '', description: '', readTime: '10 min', tier: 'NEBULA' });
  const [articleForm, setArticleForm] = useState({ title: '', content: '', readTime: '5 min', tier: 'NEBULA', status: 'published' });

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  // ── Load Data ──────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getKBCategories();
      setCategories(data);
      if (selectedCategory) {
        const updated = data.find(c => c.id === selectedCategory.id);
        setSelectedCategory(updated || null);
        if (selectedTopic && updated) {
          const updatedTopic = updated.topics.find(t => t.id === selectedTopic.id);
          setSelectedTopic(updatedTopic || null);
        }
      }
      // Sync global data context if available
      if (refreshKB) await refreshKB();
    } catch {
      showToast('Failed to load KB data', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory?.id, selectedTopic?.id, refreshKB]);

  useEffect(() => { loadData(); }, []);

  // ── Category Operations ────────────────────────────────────
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'kb_categories', editingId), { ...catForm, updatedAt: serverTimestamp() });
        showToast('Category updated!', 'success');
      } else {
        await addDoc(collection(db, 'kb_categories'), {
          ...catForm, order: categories.length + 1, createdAt: serverTimestamp()
        });
        showToast('Category created!', 'success');
      }
      setModal(null);
      await loadData();
    } catch {
      showToast('Failed to save category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!window.confirm('Delete this category and ALL its topics and articles?')) return;
    try {
      await deleteDoc(doc(db, 'kb_categories', catId));
      if (selectedCategory?.id === catId) { setSelectedCategory(null); setSelectedTopic(null); setSelectedArticle(null); }
      showToast('Category deleted', 'success');
      await loadData();
    } catch { showToast('Failed to delete', 'error'); }
  };

  // ── Topic Operations ───────────────────────────────────────
  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(
          doc(db, 'kb_categories', selectedCategory.id, 'kb_topics', editingId),
          { ...topicForm, category: selectedCategory.name, updatedAt: serverTimestamp() }
        );
        showToast('Topic updated!', 'success');
      } else {
        await addDoc(
          collection(db, 'kb_categories', selectedCategory.id, 'kb_topics'),
          { ...topicForm, category: selectedCategory.name, order: selectedCategory.topics.length + 1, articles: [], createdAt: serverTimestamp() }
        );
        showToast('Topic created!', 'success');
      }
      setModal(null);
      await loadData();
    } catch {
      showToast('Failed to save topic', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!selectedCategory) return;
    if (!window.confirm('Delete this topic and ALL its articles?')) return;
    try {
      await deleteDoc(doc(db, 'kb_categories', selectedCategory.id, 'kb_topics', topicId));
      if (selectedTopic?.id === topicId) { setSelectedTopic(null); setSelectedArticle(null); }
      showToast('Topic deleted', 'success');
      await loadData();
    } catch { showToast('Failed to delete', 'error'); }
  };

  // ── Article Operations ─────────────────────────────────────
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !selectedTopic) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateKBArticle(selectedCategory.id, selectedTopic.id, editingId, articleForm);
        showToast('Article saved!', 'success');
      } else {
        await createKBArticle(selectedCategory.id, selectedTopic.id, {
          ...articleForm,
          order: (selectedTopic.articles?.length || 0) + 1
        });
        showToast('Article created!', 'success');
      }
      setModal(null);
      await loadData();
    } catch {
      showToast('Failed to save article', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!selectedCategory || !selectedTopic) return;
    if (!window.confirm('Delete this article?')) return;
    try {
      await deleteKBArticle(selectedCategory.id, selectedTopic.id, articleId);
      if (selectedArticle?.id === articleId) setSelectedArticle(null);
      showToast('Article deleted', 'success');
      await loadData();
    } catch { showToast('Failed to delete', 'error'); }
  };

  // ── Reorder Articles ───────────────────────────────────────
  const handleReorderArticle = async (articleId: string, direction: 'up' | 'down') => {
    if (!selectedCategory || !selectedTopic) return;
    const articles = [...(selectedTopic.articles || [])];
    const idx = articles.findIndex(a => a.id === articleId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === articles.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [articles[idx], articles[swapIdx]] = [articles[swapIdx], articles[idx]];
    try {
      for (let i = 0; i < articles.length; i++) {
        await updateDoc(
          doc(db, 'kb_categories', selectedCategory.id, 'kb_topics', selectedTopic.id, 'kb_articles', articles[i].id),
          { order: i + 1 }
        );
      }
      showToast('Order updated!', 'success');
      await loadData();
    } catch { showToast('Failed to reorder', 'error'); }
  };

  // ── Toggle Article Status ──────────────────────────────────
  const handleToggleStatus = async (article: KBArticle) => {
    if (!selectedCategory || !selectedTopic) return;
    const newStatus = (article as any).status === 'draft' ? 'published' : 'draft';
    try {
      await updateDoc(
        doc(db, 'kb_categories', selectedCategory.id, 'kb_topics', selectedTopic.id, 'kb_articles', article.id),
        { status: newStatus, updatedAt: serverTimestamp() }
      );
      showToast(`Article ${newStatus}!`, 'success');
      await loadData();
    } catch { showToast('Failed to update status', 'error'); }
  };

  // ── Open Modals ────────────────────────────────────────────
  const openCatModal = (cat?: KBCategory) => {
    if (cat) { setEditingId(cat.id); setCatForm({ name: cat.name, description: cat.description, physicsTheme: cat.physicsTheme, iconName: cat.iconName }); }
    else { setEditingId(null); setCatForm({ name: '', description: '', physicsTheme: '', iconName: 'Layers' }); }
    setModal('category');
  };

  const openTopicModal = (topic?: KBTopic) => {
    if (topic) { setEditingId(topic.id); setTopicForm({ title: topic.title, description: topic.description, readTime: topic.readTime, tier: topic.tier }); }
    else { setEditingId(null); setTopicForm({ title: '', description: '', readTime: '10 min', tier: 'NEBULA' }); }
    setModal('topic');
  };

  const openArticleModal = (article?: KBArticle) => {
    if (article) { setEditingId(article.id); setArticleForm({ title: article.title, content: article.content, readTime: article.readTime, tier: article.tier, status: (article as any).status || 'published' }); }
    else { setEditingId(null); setArticleForm({ title: '', content: '', readTime: '5 min', tier: 'NEBULA', status: 'published' }); }
    setModal('article');
  };

  const tierColors: { [k: string]: string } = {
    NEBULA: 'text-slate-300 bg-dark-900 border-dark-600',
    NOVA: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    GALAXY: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    SUPERNOVA: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-500">
      <Loader className="w-6 h-6 animate-spin mr-3" /> Loading KB data...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
          <p className="text-slate-400 text-sm mt-1">
            {categories.length} categories · {categories.reduce((a, c) => a + c.topics.length, 0)} topics · {categories.reduce((a, c) => a + c.topics.reduce((b, t) => b + (t.articles?.length || 0), 0), 0)} articles
          </p>
        </div>
        <button onClick={() => openCatModal()} className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium transition-colors text-sm">
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dark-800 border border-dark-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:border-brand-blue focus:outline-none"
        />
      </div>

      {/* ── Three Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Column 1: Categories */}
        <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
          <div className="p-4 border-b border-dark-700 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-blue" /> Categories
            </h2>
            <span className="text-xs text-slate-500">{filteredCategories.length}</span>
          </div>
          <div className="divide-y divide-dark-700">
            {filteredCategories.map(cat => (
              <div
                key={cat.id}
                onClick={() => { setSelectedCategory(cat); setSelectedTopic(null); setSelectedArticle(null); }}
                className={`p-4 cursor-pointer transition-colors group ${selectedCategory?.id === cat.id ? 'bg-brand-blue/10 border-l-2 border-brand-blue' : 'hover:bg-dark-700'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{cat.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{cat.topics.length} topics · {cat.physicsTheme}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); openCatModal(cat); }} className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {selectedCategory?.id === cat.id && <ChevronRight className="w-4 h-4 text-brand-blue ml-1 flex-shrink-0" />}
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">No categories found</div>
            )}
          </div>
        </div>

        {/* Column 2: Topics */}
        <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
          <div className="p-4 border-b border-dark-700 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Folder className="w-4 h-4 text-brand-blue" />
              {selectedCategory ? selectedCategory.name : 'Topics'}
            </h2>
            {selectedCategory && (
              <button onClick={() => openTopicModal()} className="p-1.5 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue rounded-lg transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {!selectedCategory ? (
            <div className="p-8 text-center text-slate-500 text-sm">← Select a category</div>
          ) : (
            <div className="divide-y divide-dark-700">
              {selectedCategory.topics.map(topic => (
                <div
                  key={topic.id}
                  onClick={() => { setSelectedTopic(topic); setSelectedArticle(null); }}
                  className={`p-4 cursor-pointer transition-colors group ${selectedTopic?.id === topic.id ? 'bg-brand-blue/10 border-l-2 border-brand-blue' : 'hover:bg-dark-700'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{topic.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tierColors[topic.tier] || tierColors.NEBULA}`}>{topic.tier}</span>
                        <span className="text-slate-500 text-xs">{topic.articles?.length || 0} articles</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); openTopicModal(topic); }} className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteTopic(topic.id); }} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {selectedTopic?.id === topic.id && <ChevronRight className="w-4 h-4 text-brand-blue ml-1 flex-shrink-0" />}
                  </div>
                </div>
              ))}
              {selectedCategory.topics.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">No topics yet.<br />
                  <button onClick={() => openTopicModal()} className="text-brand-blue hover:underline mt-2 text-xs">+ Add first topic</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Column 3: Articles */}
        <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
          <div className="p-4 border-b border-dark-700 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-blue" />
              {selectedTopic ? selectedTopic.title : 'Articles'}
            </h2>
            {selectedTopic && (
              <button onClick={() => openArticleModal()} className="p-1.5 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue rounded-lg transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {!selectedTopic ? (
            <div className="p-8 text-center text-slate-500 text-sm">← Select a topic</div>
          ) : (
            <div className="divide-y divide-dark-700">
              {(selectedTopic.articles || []).map((article, idx) => (
                  <div
                    key={article.id}
                    draggable
                    onDragStart={() => setDragIndex(idx)}
                    onDragOver={(e) => { e.preventDefault(); setDragOverIndex(idx); }}
                    onDragEnd={async () => {
                      if (dragIndex === null || dragOverIndex === null || dragIndex === dragOverIndex) {
                        setDragIndex(null);
                        setDragOverIndex(null);
                        return;
                      }
                      
                      const articles = [...(selectedTopic.articles || [])];
                      const [moved] = articles.splice(dragIndex, 1);
                      articles.splice(dragOverIndex, 0, moved);
                      
                      try {
                        for (let i = 0; i < articles.length; i++) {
                          await updateDoc(
                            doc(db, 'kb_categories', selectedCategory!.id, 'kb_topics', selectedTopic.id, 'kb_articles', articles[i].id),
                            { order: i + 1 }
                          );
                        }
                        showToast('Order updated!', 'success');
                        await loadData();
                      } catch {
                        showToast('Failed to reorder', 'error');
                      }
                      
                      setDragIndex(null);
                      setDragOverIndex(null);
                    }}
                    className={`p-4 transition-colors group cursor-grab active:cursor-grabbing ${
                      dragOverIndex === idx ? 'border-t-2 border-brand-blue' : ''
                    } ${
                      dragIndex === idx ? 'opacity-50' : ''
                    } ${
                      selectedArticle?.id === article.id ? 'bg-brand-blue/10 border-l-2 border-brand-blue' : 'hover:bg-dark-700'
                    }`}
                  >
                  <div className="flex items-start justify-between gap-2">
                      {/* 拖拽手柄 */}
                      <div className="flex items-center mt-1 text-slate-600 hover:text-slate-400 cursor-grab flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-6 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-6 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedArticle(article)}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${(article as any).status === 'draft' ? 'bg-amber-400' : 'bg-green-400'}`} />
                        <p className="text-white text-sm font-medium truncate">{article.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tierColors[article.tier] || tierColors.NEBULA}`}>{article.tier}</span>
                        <span className="text-slate-500 text-xs">{article.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleToggleStatus(article)} className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors" title={(article as any).status === 'draft' ? 'Publish' : 'Draft'}>
                        {(article as any).status === 'draft' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => openArticleModal(article)} className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteArticle(article.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {(!selectedTopic.articles || selectedTopic.articles.length === 0) && (
                <div className="p-8 text-center text-slate-500 text-sm">No articles yet.<br />
                  <button onClick={() => openArticleModal()} className="text-brand-blue hover:underline mt-2 text-xs">+ Add first article</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════ */}

      {/* Category Modal */}
      {modal === 'category' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-dark-800 w-full max-w-lg rounded-2xl border border-dark-600 shadow-2xl">
            <div className="p-6 border-b border-dark-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Category Name</label>
                <input required value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Physics Theme</label>
                <input required value={catForm.physicsTheme} onChange={e => setCatForm({...catForm, physicsTheme: e.target.value})}
                  placeholder="e.g. Material Science"
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Icon</label>
                <select value={catForm.iconName} onChange={e => setCatForm({...catForm, iconName: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none text-sm">
                  {['Layers', 'Microscope', 'BookOpen', 'Zap', 'PenTool', 'Activity', 'ShieldCheck', 'Droplet', 'BookA'].map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Description</label>
                <textarea value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})}
                  rows={3} className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none text-sm resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-5 py-2 text-slate-300 hover:text-white transition-colors text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-medium transition-colors text-sm disabled:opacity-50 flex items-center gap-2">
                  {saving && <Loader className="w-3.5 h-3.5 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Topic Modal */}
      {modal === 'topic' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-dark-800 w-full max-w-lg rounded-2xl border border-dark-600 shadow-2xl">
            <div className="p-6 border-b border-dark-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Topic' : 'New Topic'}</h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveTopic} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Title</label>
                <input required value={topicForm.title} onChange={e => setTopicForm({...topicForm, title: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Read Time</label>
                  <input value={topicForm.readTime} onChange={e => setTopicForm({...topicForm, readTime: e.target.value})}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Access Tier</label>
                  <select value={topicForm.tier} onChange={e => setTopicForm({...topicForm, tier: e.target.value})}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none text-sm">
                    {['NEBULA', 'NOVA', 'GALAXY', 'SUPERNOVA'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Description (HTML)</label>
                <textarea value={topicForm.description} onChange={e => setTopicForm({...topicForm, description: e.target.value})}
                  rows={4} className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none text-sm resize-none font-mono text-xs" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-5 py-2 text-slate-300 hover:text-white transition-colors text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-medium transition-colors text-sm disabled:opacity-50 flex items-center gap-2">
                  {saving && <Loader className="w-3.5 h-3.5 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Modal */}
      {modal === 'article' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-dark-800 w-full max-w-4xl rounded-2xl border border-dark-600 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-dark-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-blue" />
                {editingId ? 'Edit Article' : 'New Article'}
              </h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveArticle} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Title</label>
                    <input required value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})}
                      className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Read Time</label>
                    <input value={articleForm.readTime} onChange={e => setArticleForm({...articleForm, readTime: e.target.value})}
                      className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Access Tier</label>
                    <select value={articleForm.tier} onChange={e => setArticleForm({...articleForm, tier: e.target.value})}
                      className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue focus:outline-none text-sm">
                      {['NEBULA', 'NOVA', 'GALAXY', 'SUPERNOVA'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                  <button type="button" onClick={() => setArticleForm({...articleForm, status: articleForm.status === 'draft' ? 'published' : 'draft'})}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      articleForm.status === 'published' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                    {articleForm.status === 'published' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {articleForm.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Content</label>
                  <RichTextEditor value={articleForm.content} onChange={content => setArticleForm({...articleForm, content})} />
                </div>
              </div>
              <div className="p-6 border-t border-dark-700 bg-dark-900/50 flex justify-end gap-3">
                <button type="button" onClick={() => setModal(null)} className="px-5 py-2 text-slate-300 hover:text-white transition-colors text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="px-8 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all text-sm disabled:opacity-50 flex items-center gap-2">
                  {saving && <Loader className="w-3.5 h-3.5 animate-spin" />}
                  <Save className="w-3.5 h-3.5" />
                  {editingId ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
