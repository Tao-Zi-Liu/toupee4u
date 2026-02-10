import { smartModerate, ModerationResult } from '../services/moderation.service';
import { createPost } from '../services/post.service';
import { getCurrentUser, getCompleteUserProfile } from '../services/auth.service';
import React, { useState, useEffect } from 'react';
// Fixing react-router-dom named imports
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, ImageIcon as ImageIcon, Hash } from 'lucide-react';
import { AlertCircle, Type, Paperclip, X } from 'lucide-react';

export const CreateDiscussionPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Troubleshooting');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // 新增状态
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);
  const [showModerationWarning, setShowModerationWarning] = useState(false);
  const [forcePublish, setForcePublish] = useState(false);
  
  // 加载用户信息
  useEffect(() => {
    async function loadUser() {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      const profile = await getCompleteUserProfile(currentUser.uid);
      setUserProfile(profile);
    }
    loadUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setModerationResult(null);
    setShowModerationWarning(false);

    if (!title.trim() || !content.trim() || !category) {
      setError('Please fill in all required fields');
      return;
    }

    if (!userProfile) {
      setError('User profile not loaded');
      return;
    }

    setLoading(true);

    try {
      // 第一步：审核内容
      if (!forcePublish) {
        console.log('🔍 Moderating content...');
        const combinedText = `${title}\n\n${content}`;
        const modResult = await smartModerate(combinedText);
        
        setModerationResult(modResult);
        
        // 如果有严重问题，阻止发布
        if (modResult.severity === 'high') {
          setShowModerationWarning(true);
          setLoading(false);
          return;
        }
        
        // 如果有中等或轻微问题，显示警告但允许继续
        if (!modResult.isClean) {
          setShowModerationWarning(true);
          setLoading(false);
          return;
        }
      }

      // 第二步：发布帖子
      const postData = {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tags.filter(tag => tag.trim())
      };

      const postId = await createPost(
        postData,
        userProfile.uid,
        userProfile.displayName,
        userProfile.photoURL,
        userProfile.galaxyLevel
      );

      console.log('✅ Post created:', postId);
      
      // 重置强制发布标志
      setForcePublish(false);
      
      // 跳转到论坛
      navigate('/forum');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 强制发布（忽略审核警告）
  const handleForcePublish = () => {
    setForcePublish(true);
    setShowModerationWarning(false);
    // 触发表单提交
    const form = document.querySelector('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  // 修改内容
  const handleModifyContent = () => {
    setShowModerationWarning(false);
    setModerationResult(null);
  };

  const categories = ['Troubleshooting', 'Review', 'Lifestyle', 'Science', 'Adhesives', 'Newbie Help'];

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center gap-4">
        <Link 
          to="/forum" 
          className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-slate-300 hover:text-white hover:border-dark-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Initiate New Sequence</h1>
          <p className="text-slate-300 text-sm">Open a frequency for community analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-xl space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 text-sm">
                {error}
              </div>
            )}
            
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4" /> Subject Line
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Hairline lifting after 3 days with Ghost Bond..."
                className="w-full bg-dark-900 border border-dark-600 rounded-xl p-4 text-white placeholder-slate-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all font-medium"
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" /> Quantum Tag
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      category === cat 
                        ? 'bg-brand-blue/10 border-brand-blue text-brand-blue' 
                        : 'bg-dark-900 border-dark-600 text-slate-300 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4" /> Observation Data
              </label>
              <div className="relative">
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe your system specs (Base type, Adhesive used) and the issue in detail..."
                  className="w-full h-64 bg-dark-900 border border-dark-600 rounded-xl p-4 text-white placeholder-slate-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all resize-none"
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <button type="button" className="p-2 bg-dark-800 rounded-lg text-slate-300 hover:text-white border border-dark-600 hover:border-brand-blue transition-colors" title="Attach Image">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-2 bg-dark-800 rounded-lg text-slate-300 hover:text-white border border-dark-600 hover:border-brand-blue transition-colors" title="Attach File">
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-4 border-t border-dark-700 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/forum')}
                className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-dark-700 transition-colors"
              >
                Abort
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" /> {loading ? 'Processing...' : 'Transmit'}
              </button>
            </div>

          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mt-1">Protocol Guidelines</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-300 list-disc pl-4">
              <li>
                <strong className="text-slate-300">Be Specific:</strong> Mention your base type (Lace vs Poly) and adhesive brand.
              </li>
              <li>
                <strong className="text-slate-300">Upload Visuals:</strong> Close-up shots of the hairline help experts diagnose "lift".
              </li>
              <li>
                <strong className="text-slate-300">Respect Privacy:</strong> Blur faces if necessary.
              </li>
            </ul>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Related Knowledge Base</h3>
            <div className="space-y-3">
              <Link to="/kb/foundations" className="block p-3 rounded-lg bg-dark-900 border border-dark-600 hover:border-brand-blue transition-colors text-xs text-slate-300 hover:text-white">
                Foundations: Base Types Explained
              </Link>
              <Link to="/kb/securement" className="block p-3 rounded-lg bg-dark-900 border border-dark-600 hover:border-brand-blue transition-colors text-xs text-slate-300 hover:text-white">
                Securement: Choosing the Right Glue
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Moderation Warning Modal */}
      {showModerationWarning && moderationResult && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 border-2 border-dark-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                moderationResult.severity === 'high' 
                  ? 'bg-red-500/20 text-red-500' 
                  : moderationResult.severity === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'bg-blue-500/20 text-blue-500'
              }`}>
                {moderationResult.severity === 'high' ? '⛔' : moderationResult.severity === 'medium' ? '⚠️' : 'ℹ️'}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  {moderationResult.severity === 'high' 
                    ? 'Content Blocked' 
                    : 'Content Warning'}
                </h3>
                <p className="text-slate-300 text-sm">
                  Our AI detected some issues with your content:
                </p>
              </div>
            </div>
            
            {moderationResult.issues.length > 0 && (
              <div className="mb-4 bg-dark-900 rounded-lg p-4 border border-dark-600">
                <p className="text-sm font-semibold text-slate-200 mb-2">Issues:</p>
                <ul className="space-y-1">
                  {moderationResult.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-slate-400 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {moderationResult.suggestions.length > 0 && (
              <div className="mb-6 bg-dark-900 rounded-lg p-4 border border-dark-600">
                <p className="text-sm font-semibold text-slate-200 mb-2">Suggestions:</p>
                <ul className="space-y-1">
                  {moderationResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-slate-400 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">→</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={handleModifyContent}
                className="flex-1 px-4 py-2 bg-dark-900 border border-dark-600 text-white hover:border-brand-blue rounded-lg transition-all"
              >
                Modify Content
              </button>
              {moderationResult.severity !== 'high' && (
                <button
                  onClick={handleForcePublish}
                  className="flex-1 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
                >
                  Publish Anyway
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
