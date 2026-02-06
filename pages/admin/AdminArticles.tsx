
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Trash2, Search, X, Edit3, FileText } from 'lucide-react';
import { Layers, Clock, Shield, Folder } from 'lucide-react';
import { Topic, UserTier } from '../../types';

export const AdminArticles: React.FC = () => {
  const { categories, addTopic, updateTopic, deleteTopic } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Flatten topics for display
  const allTopics = categories.flatMap(cat => 
    cat.topics.map(topic => ({ ...topic, categoryId: cat.id, categoryName: cat.name }))
  );

  const filteredTopics = allTopics.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form State
  const initialFormState: Partial<Topic> & { categoryId: string } = {
    id: '',
    title: '',
    description: '',
    readTime: '15 min',
    /* Fix: Use UserTier.NEBULA instead of UserTier.OBSERVER */
    tier: UserTier.NEBULA,
    category: '', 
    categoryId: categories[0]?.id || '' 
  };

  const [formData, setFormData] = useState(initialFormState);

  const openEditModal = (topic: any) => {
    setEditingId(topic.id);
    setFormData({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      readTime: topic.readTime,
      tier: topic.tier,
      category: topic.category,
      categoryId: topic.categoryId
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
      updateTopic(formData.categoryId, editingId, {
        title: formData.title,
        description: formData.description,
        readTime: formData.readTime,
        tier: formData.tier,
        category: categoryName
      } as Partial<Topic>);
    } else {
      // Create
      const newTopic: Topic = {
        id: formData.title!.toLowerCase().replace(/\s+/g, '-').substring(0, 20) + '-' + Date.now(),
        title: formData.title!,
        description: formData.description!,
        readTime: formData.readTime!,
        tier: formData.tier!,
        category: categoryName,
        articles: []
      };
      addTopic(formData.categoryId, newTopic);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (categoryId: string, topicId: string) => {
    if (window.confirm('Are you sure you want to delete this topic and all its articles?')) {
      deleteTopic(categoryId, topicId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-white">Topic Management</h1>
            <p className="text-slate-300 text-sm">Manage main topics (Level 2). Articles (Level 3) are managed within Topics.</p>
         </div>
         <button 
           onClick={openCreateModal}
           className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
         >
            <Plus className="w-4 h-4" /> Create Topic
         </button>
      </div>

      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
         {/* Search Bar */}
         <div className="p-4 border-b border-dark-700">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search topics..." 
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
                        <th className="p-4">Topic Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Modules</th>
                        <th className="p-4">Access Tier</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                    {filteredTopics.map(topic => (
                        <tr key={topic.id} className="hover:bg-dark-700/50 transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-white mb-0.5">{topic.title}</div>
                                <div className="text-xs text-slate-500 font-mono">ID: {topic.id}</div>
                            </td>
                            <td className="p-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-dark-900 border border-dark-600 text-slate-300">
                                    <Layers className="w-3 h-3" /> {topic.categoryName}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="flex items-center gap-1 text-slate-300 text-sm">
                                    <Folder className="w-3 h-3" /> {topic.articles.length}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded border ${
                                    /* Fix: Use UserTier.SUPERNOVA instead of UserTier.QUANTUM */
                                    topic.tier === UserTier.SUPERNOVA 
                                        ? 'text-brand-purple bg-brand-purple/10 border-brand-purple/20' 
                                        /* Fix: Use UserTier.GALAXY instead of UserTier.KINETIC */
                                        : topic.tier === UserTier.GALAXY 
                                            ? 'text-brand-blue bg-brand-blue/10 border-brand-blue/20'
                                            : 'text-slate-300 bg-dark-900 border-dark-600'
                                }`}>
                                    {topic.tier}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => openEditModal(topic)}
                                        className="p-2 text-slate-300 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(topic.categoryId, topic.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredTopics.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500">
                                No topics found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>

      {/* Topic Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-dark-800 w-full max-w-4xl rounded-2xl border border-dark-600 shadow-2xl flex flex-col h-[90vh]">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-brand-blue" />
                        {editingId ? 'Edit Topic' : 'Create New Topic'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Topic Title</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target Category</label>
                                <select 
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Read Time Estimate</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                                    value={formData.readTime}
                                    onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Required Membership Tier</label>
                                <select 
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                                    value={formData.tier}
                                    onChange={(e) => setFormData({...formData, tier: e.target.value as UserTier})}
                                >
                                    {Object.values(UserTier).map(tier => (
                                        <option key={tier} value={tier}>{tier}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Overview Content (HTML)</label>
                            <textarea 
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none h-64 font-mono text-sm"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>
                    </div>

                    <div className="p-6 border-t border-dark-700 bg-dark-900/50 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-8 py-2 bg-brand-blue text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
                        >
                            {editingId ? 'Save Changes' : 'Create Topic'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};