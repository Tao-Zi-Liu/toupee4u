
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
    
    // 验证
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    
    if (!userProfile) {
      setError('User not loaded');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 创建帖子
      const postId = await createPost(
        {
          title: title.trim(),
          content: content.trim(),
          category: category,
          tags: tags
        },
        userProfile.userId,
        userProfile.displayName,
        userProfile.photoURL,
        userProfile.galaxyLevel
      );
      
      console.log('✅ Post created successfully:', postId);
      
      // 跳转到论坛页面
      navigate('/forum');
    } catch (err: any) {
      console.error('❌ Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
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
                    className="px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
                 >
                    <Send className="w-4 h-4" /> Transmit
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
    </div>
  );
};