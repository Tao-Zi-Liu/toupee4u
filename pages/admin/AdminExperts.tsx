import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Trash2, Search, X } from 'lucide-react';
import { Expert } from '../../types';

export const AdminExperts: React.FC = () => {
  const { experts, addExpert, deleteExpert } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [newExpert, setNewExpert] = useState<Partial<Expert>>({
    name: '',
    role: '',
    specialties: [],
    bio: '',
    methodology: '',
    colorTheme: 'blue',
    availability: 'Available'
  });
  const [tempSpecialty, setTempSpecialty] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpert.name || !newExpert.role) return;

    const expert: Expert = {
        id: newExpert.name.toLowerCase().replace(/\s+/g, '-'),
        name: newExpert.name,
        role: newExpert.role,
        image: `https://placehold.co/400x400/3b82f6/FFF?text=${newExpert.name.charAt(0)}`, // Default Placeholder
        specialties: newExpert.specialties || [],
        bio: newExpert.bio || 'No bio provided.',
        methodology: newExpert.methodology || 'Standard protocols.',
        stats: { experience: '1 Year', consultations: 0, rating: 5.0 },
        availability: 'Available',
        colorTheme: newExpert.colorTheme || 'blue',
        ...newExpert
    } as Expert;

    addExpert(expert);
    setIsModalOpen(false);
    // Reset form
    setNewExpert({ name: '', role: '', specialties: [], bio: '', methodology: '', colorTheme: 'blue' });
  };

  const filteredExperts = experts.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold text-white">Manage Experts</h1>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
         >
            <Plus className="w-4 h-4" /> Add Expert
         </button>
      </div>

      <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
         {/* Search Bar */}
         <div className="p-4 border-b border-dark-700">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search experts..." 
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
                        <th className="p-4">Profile</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                    {filteredExperts.map(expert => (
                        <tr key={expert.id} className="hover:bg-dark-700/50 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                                <img src={expert.image} alt={expert.name} className="w-10 h-10 rounded-full object-cover" />
                                <div className="font-bold text-white">{expert.name}</div>
                            </td>
                            <td className="p-4 text-slate-300">{expert.role}</td>
                            <td className="p-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded border ${expert.availability === 'Available' ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20'}`}>
                                    {expert.availability}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <button 
                                    onClick={() => deleteExpert(expert.id)}
                                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete Expert"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredExperts.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-500">
                                No experts found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>

      {/* Add Expert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-dark-800 w-full max-w-lg rounded-2xl border border-dark-600 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Add New Expert</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleAdd} className="p-6 overflow-y-auto space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                            value={newExpert.name}
                            onChange={(e) => setNewExpert({...newExpert, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Role</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                            value={newExpert.role}
                            onChange={(e) => setNewExpert({...newExpert, role: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Specialties</label>
                        <div className="flex gap-2 mb-2">
                             <input 
                                type="text" 
                                className="flex-1 bg-dark-900 border border-dark-600 rounded-lg p-2 text-white focus:border-brand-blue outline-none text-sm"
                                placeholder="Add specialty..."
                                value={tempSpecialty}
                                onChange={(e) => setTempSpecialty(e.target.value)}
                            />
                            <button 
                                type="button" 
                                onClick={() => {
                                    if(tempSpecialty) {
                                        setNewExpert({...newExpert, specialties: [...(newExpert.specialties || []), tempSpecialty]});
                                        setTempSpecialty('');
                                    }
                                }}
                                className="px-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {newExpert.specialties?.map((s, i) => (
                                <span key={i} className="text-xs bg-brand-blue/20 text-brand-blue px-2 py-1 rounded flex items-center gap-1">
                                    {s} 
                                    <button type="button" onClick={() => {
                                        const newSpecs = [...(newExpert.specialties || [])];
                                        newSpecs.splice(i, 1);
                                        setNewExpert({...newExpert, specialties: newSpecs});
                                    }}><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Bio</label>
                        <textarea 
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none h-24"
                            value={newExpert.bio}
                            onChange={(e) => setNewExpert({...newExpert, bio: e.target.value})}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Color Theme</label>
                        <select 
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                            value={newExpert.colorTheme}
                            onChange={(e) => setNewExpert({...newExpert, colorTheme: e.target.value})}
                        >
                            <option value="blue">Blue</option>
                            <option value="purple">Purple</option>
                            <option value="teal">Teal</option>
                            <option value="pink">Pink</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors mt-4">
                        Create Expert Profile
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};