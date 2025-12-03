import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Trash2, Search, X, Edit3, FileText, Layers, Clock, Shield } from 'lucide-react';
import { Article, UserTier } from '../../types';

export const AdminArticles: React.FC = () => {
  const { categories, addArticle, updateArticle, deleteArticle } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Flatten articles for display, attaching category ID to each for reference
  const allArticles = categories.flatMap(cat => 
    cat.articles.map(art => ({ ...art, categoryId: cat.id, categoryName: cat.name }))
  );

  const filteredArticles = allArticles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form State
  const initialFormState: Partial<Article> & { categoryId: string } = {
    id: '',
    title: '',
    content: '',
    readTime: '5 min',
    tier: UserTier.OBSERVER,
    category: '', // Display name for category
    categoryId: categories[0]?.id || '' // Logical ID for relation
  };

  const [formData, setFormData] = useState(initialFormState);

  const openEditModal = (article: any) => {
    setEditingId(article.id);
    setFormData({
      id: article.id,
      title: article.title,
      content: article.content,
      readTime: article.readTime,
      tier: article.tier,
      category: article.category,
      categoryId: article.categoryId
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ ...initialFormState, categoryId: categories[0]?.id || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.categoryId) return;

    // Find category name based on ID
    const selectedCat = categories.find(c => c.id === formData.categoryId);
    const categoryName = selectedCat ? selectedCat.name : 'General';

    if (editingId) {
      // Update
      // Note: If category changed, we technically need to move it (delete from old, add to new).
      // For simplicity in this demo, we assume in-place update or strictly same category for now, 
      // or simplistic update that might desync if category ID changed significantly.
      // Real app would handle "move" logic. Here we just update properties.
      updateArticle(formData.categoryId, editingId, {
        title: formData.title,
        content: formData.content,
        readTime: formData.readTime,
        tier: formData.tier,
        category: categoryName
      } as Article);
    } else {
      // Create
      const newArticle: Article = {
        id: formData.title!.toLowerCase().replace(/\s+/g, '-').substring(0, 20) + '-' + Date.now(),
        title: formData.title!,
        content: formData.content!,
        readTime: formData.readTime!,
        tier: formData.tier!,
        category: categoryName
      };
      addArticle(formData.categoryId, newArticle);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (categoryId: string, articleId: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(categoryId, articleId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-white">Knowledge Base CMS</h1>
            <p className="text-slate-400 text-sm">Manage articles across all physics themes.</p>
         </div>
         <button 
           onClick={openCreateModal}
           className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
         >
            <Plus className="w-4 h-4" /> Create Article
         </button>
      </div>

      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
         {/* Search Bar */}
         <div className="p-4 border-b border-dark-700">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search articles by title or category..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl py-2 pl-10 pr-4 text-white focus:border-brand-blue focus:outline-none"
                />
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-dark-900 text-xs text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                        <th className="p-4">Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Access Tier</th>
                        <th className="p-4">Read Time</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                    {filteredArticles.map(article => (
                        <tr key={article.id} className="hover:bg-dark-700/50 transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-white mb-0.5">{article.title}</div>
                                <div className="text-xs text-slate-500 font-mono">ID: {article.id}</div>
                            </td>
                            <td className="p-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-dark-900 border border-dark-600 text-slate-300">
                                    <Layers className="w-3 h-3" /> {article.categoryName}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded border ${
                                    article.tier === UserTier.QUANTUM 
                                        ? 'text-brand-purple bg-brand-purple/10 border-brand-purple/20' 
                                        : article.tier === UserTier.KINETIC 
                                            ? 'text-brand-blue bg-brand-blue/10 border-brand-blue/20'
                                            : 'text-slate-400 bg-dark-900 border-dark-600'
                                }`}>
                                    {article.tier}
                                </span>
                            </td>
                            <td className="p-4 text-slate-400 text-sm">
                                {article.readTime}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => openEditModal(article)}
                                        className="p-2 text-slate-500 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(article.categoryId, article.id)}
                                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredArticles.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500">
                                No articles found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>

      {/* Article Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-dark-800 w-full max-w-4xl rounded-2xl border border-dark-600 shadow-2xl flex flex-col h-[90vh]">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-brand-blue" />
                        {editingId ? 'Edit Article' : 'Create New Article'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Article Title</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                                    placeholder="e.g., Understanding Base Materials"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parent Category</label>
                                <select 
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                    disabled={!!editingId} // Disable category move for simplicity
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> Minimum Tier Access
                                </label>
                                <select 
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                                    value={formData.tier}
                                    onChange={(e) => setFormData({...formData, tier: e.target.value as UserTier})}
                                >
                                    <option value={UserTier.OBSERVER}>Observer (Free)</option>
                                    <option value={UserTier.KINETIC}>Kinetic Force (Paid)</option>
                                    <option value={UserTier.QUANTUM}>Quantum State (Premium)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Read Time
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                                    placeholder="e.g., 5 min"
                                    value={formData.readTime}
                                    onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 h-full">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">HTML Content</label>
                            <textarea 
                                className="w-full h-96 bg-dark-900 border border-dark-600 rounded-lg p-4 text-white font-mono text-sm focus:border-brand-blue outline-none resize-none"
                                placeholder="<h3>Subtitle</h3><p>Content goes here...</p>"
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                            ></textarea>
                            <p className="text-xs text-slate-500">Supports basic HTML tags for formatting.</p>
                        </div>

                    </div>

                    <div className="p-6 border-t border-dark-700 flex justify-end gap-3 bg-dark-800">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            {editingId ? 'Save Changes' : 'Publish Article'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};