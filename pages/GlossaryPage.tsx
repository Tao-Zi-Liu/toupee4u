
import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../constants';
import { Search, BookA, Hash } from 'lucide-react';

export const GlossaryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('All');

  /* FIX: Explicitly type alphabet as string array to resolve unknown type errors */
  const alphabet: string[] = ['All', ...Array.from(new Set(GLOSSARY_TERMS.map(t => t.term[0].toUpperCase()))).sort()];

  const filteredTerms = GLOSSARY_TERMS.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = selectedLetter === 'All' || item.term.toUpperCase().startsWith(selectedLetter);
    return matchesSearch && matchesLetter;
  }).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="space-y-8 pb-12">
       {/* Header */}
       <div className="border-b border-dark-700 pb-8">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-brand-purple/10 rounded-xl text-brand-purple border border-brand-purple/20">
                < BookA className="w-8 h-8" />
             </div>
             <div>
                <h4 className="text-xs font-bold text-brand-purple uppercase tracking-widest">Knowledge Base</h4>
                <h1 className="text-4xl font-bold text-white">Technical Lexicon</h1>
             </div>
          </div>
          <p className="text-slate-300 max-w-2xl text-lg">
             A comprehensive dictionary of industry terminology, chemical compounds, and structural components used in non-surgical hair replacement.
          </p>
       </div>

       {/* Controls */}
       <div className="space-y-6">
          <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                  type="text" 
                  placeholder="Search terminology..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple text-lg"
              />
          </div>

          <div className="flex flex-wrap gap-2">
              /* FIX: Explicitly type letter as string to resolve Key and SetStateAction unknown errors */
              {alphabet.map((letter: string) => (
                  <button
                      key={letter}
                      onClick={() => setSelectedLetter(letter)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all border ${
                          selectedLetter === letter 
                          ? 'bg-brand-purple text-white border-brand-purple' 
                          : 'bg-dark-800 text-slate-300 border border-dark-700 hover:border-slate-500 hover:text-white'
                      }`}
                  >
                      {letter}
                  </button>
              ))}
          </div>
       </div>

       {/* Terms Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {filteredTerms.map((item) => (
               <div key={item.id} className="bg-dark-800 rounded-2xl p-6 border border-dark-700 hover:border-brand-purple/50 transition-all hover:bg-dark-800/80 group">
                   <div className="flex items-start justify-between mb-3">
                       <h3 className="text-xl font-bold text-white group-hover:text-brand-purple transition-colors">{item.term}</h3>
                       <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-dark-900 border border-dark-600 px-2 py-1 rounded">
                           {item.category}
                       </span>
                   </div>
                   <p className="text-slate-300 leading-relaxed">
                       {item.definition}
                   </p>
               </div>
           ))}

           {filteredTerms.length === 0 && (
               <div className="col-span-full py-16 text-center border border-dashed border-dark-700 rounded-2xl">
                   <p className="text-slate-500 text-lg">No definitions found.</p>
               </div>
           )}
       </div>
    </div>
  );
};
