import React, { useState } from 'react';
import { generateArticleFromVideo } from '../../services/geminiService';
import { useData } from '../../contexts/DataContext';
import { Topic, UserTier } from '../../types';
import { Youtube, Search, ArrowRight, Loader, FileText, CheckCircle, Play, MessageSquare, AlertCircle, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Mock data to simulate YouTube API response since we don't have a real API key in this env
const MOCK_VIDEOS = [
  {
    id: 'v1',
    title: 'STOP Ruining Your Lace Front! (Bleaching Knots Tutorial)',
    channel: 'HairSystem DIY',
    views: '45K',
    thumbnail: 'https://placehold.co/320x180/1e293b/FFF?text=Knots+Tutorial',
    description: 'In this video, we discuss why over-bleaching creates orange roots and destroys the structural integrity of the lace.',
    comments: [
        "My knots turned orange after 10 mins, help!",
        "Great tip about using the foil to protect the hair shaft."
    ]
  },
  {
    id: 'v2',
    title: 'Ghost Bond vs Walker Tape: 30 Day Wear Test',
    channel: 'The Bald Truth',
    views: '120K',
    thumbnail: 'https://placehold.co/320x180/334155/FFF?text=Glue+vs+Tape',
    description: 'We put the two most popular adhesives to the test during a humid Florida summer. The results surprised us.',
    comments: [
        "Ghost bond turned into slime after swimming.",
        "Tape is easier to clean but I hate the thickness."
    ]
  },
  {
    id: 'v3',
    title: 'How to Cut a Men\'s Hair System (Fade Guide)',
    channel: 'Barber Lab',
    views: '89K',
    thumbnail: 'https://placehold.co/320x180/0f172a/FFF?text=Fade+Guide',
    description: 'Blending the side hair with the system is the hardest part. Here is the physics of graduation.',
    comments: [
        "What clipper guard do you use for the transition?",
        "My blend always looks heavy."
    ]
  }
];

export const AdminYouTubeCrawler: React.FC = () => {
  const { categories, addTopic } = useData();
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof MOCK_VIDEOS>([]);
  const [selectedVideo, setSelectedVideo] = useState<typeof MOCK_VIDEOS[0] | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [targetCategory, setTargetCategory] = useState(categories[0].id);
  const [articleTitle, setArticleTitle] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(!keyword) return;
    
    setIsSearching(true);
    setResults([]); // Reset
    
    // Simulate network delay
    setTimeout(() => {
        setIsSearching(false);
        // In a real app, this would filter based on keyword or call API
        // For demo, we just return the mock data mixed
        setResults(MOCK_VIDEOS);
        setStep(2);
    }, 1500);
  };

  const handleGenerate = async () => {
    if (!selectedVideo) return;
    setIsGenerating(true);
    
    const html = await generateArticleFromVideo({
        title: selectedVideo.title,
        channel: selectedVideo.channel,
        description: selectedVideo.description,
        comments: selectedVideo.comments
    });

    setGeneratedHtml(html);
    // Simple regex to extract a title from the H3 or just use video title
    setArticleTitle(selectedVideo.title.replace('STOP', 'Preventing').replace('!', '')); 
    setIsGenerating(false);
    setStep(3);
  };

  const handlePublish = () => {
    if (!generatedHtml || !articleTitle) return;

    const newTopic: Topic = {
        id: `auto-${Date.now()}`,
        title: articleTitle,
        description: generatedHtml,
        category: categories.find(c => c.id === targetCategory)?.name || 'General',
        readTime: '6 min', // estimated
        tier: UserTier.KINETIC, // Default for AI content
        articles: []
    };

    addTopic(targetCategory, newTopic);
    alert('Article Published Successfully');
    navigate('/admin/articles');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-dark-700 pb-6">
        <div className="p-3 bg-red-600/10 rounded-xl text-red-500 border border-red-500/20">
            <Youtube className="w-8 h-8" />
        </div>
        <div>
           <h1 className="text-2xl font-bold text-white">Video-to-Knowledge Synthesis</h1>
           <p className="text-slate-400">Crawl YouTube data and transform it into scientific articles using the Truth Engine.</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between px-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-dark-700 -z-10"></div>
          
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-brand-blue text-white' : 'bg-dark-800 text-slate-500 border border-dark-600'}`}>1</div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-brand-blue text-white' : 'bg-dark-800 text-slate-500 border border-dark-600'}`}>2</div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-brand-blue text-white' : 'bg-dark-800 text-slate-500 border border-dark-600'}`}>3</div>
      </div>

      {/* STEP 1: SEARCH */}
      {step === 1 && (
        <div className="bg-dark-800 rounded-2xl border border-dark-700 p-8 shadow-xl animate-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Establish Search Parameters</h2>
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-brand-purple rounded-xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                    <div className="relative flex">
                        <input 
                            type="text" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="e.g., Hair system hairline repair..."
                            className="w-full bg-dark-900 border border-dark-600 rounded-l-xl py-4 pl-6 pr-4 text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                        <button 
                            type="submit"
                            disabled={isSearching || !keyword}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 rounded-r-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSearching ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            Scan
                        </button>
                    </div>
                </div>
                <p className="text-center text-xs text-slate-500 mt-4">
                    The Crawler will retrieve video metadata, transcripts, and top comments for analysis.
                </p>
            </form>
        </div>
      )}

      {/* STEP 2: SELECT RESULTS */}
      {step === 2 && (
         <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Analysis Results</h2>
                <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-white">Reset Search</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((video) => (
                    <div 
                        key={video.id} 
                        onClick={() => setSelectedVideo(video)}
                        className={`bg-dark-800 rounded-xl border overflow-hidden cursor-pointer transition-all group ${
                            selectedVideo?.id === video.id 
                            ? 'border-brand-blue ring-2 ring-brand-blue ring-offset-2 ring-offset-dark-900 transform scale-105' 
                            : 'border-dark-700 hover:border-slate-500'
                        }`}
                    >
                        <div className="relative aspect-video bg-black">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                                    <Play className="w-5 h-5 fill-current" />
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">{video.title}</h3>
                            <div className="flex justify-between items-center text-xs text-slate-500">
                                <span>{video.channel}</span>
                                <span>{video.views} views</span>
                            </div>
                            {selectedVideo?.id === video.id && (
                                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-brand-blue bg-brand-blue/10 px-2 py-1 rounded">
                                    <CheckCircle className="w-3 h-3" /> Selected
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-6">
                <button 
                    onClick={handleGenerate}
                    disabled={!selectedVideo || isGenerating}
                    className="px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    {isGenerating ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" /> Synthesizing Data...
                        </>
                    ) : (
                        <>
                            <FileText className="w-5 h-5" /> Generate Article
                        </>
                    )}
                </button>
            </div>
         </div>
      )}

      {/* STEP 3: PREVIEW & PUBLISH */}
      {step === 3 && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4">
            
            {/* Editor Side */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Article Title</label>
                            <input 
                                type="text" 
                                value={articleTitle}
                                onChange={(e) => setArticleTitle(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white font-bold text-lg focus:border-brand-blue outline-none"
                            />
                        </div>
                        
                        <div className="p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-slate-400">
                                <p className="mb-1 text-white font-bold">AI Synthesis Complete</p>
                                The Truth Engine has converted the video transcript into scientific syntax. Please review for hallucinations before publishing.
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                             <FileText className="w-4 h-4" /> Content Preview (HTML)
                        </label>
                        <textarea 
                            value={generatedHtml}
                            onChange={(e) => setGeneratedHtml(e.target.value)}
                            className="w-full h-[500px] bg-dark-900 border border-dark-600 rounded-xl p-6 text-slate-300 font-mono text-sm leading-relaxed focus:border-brand-blue outline-none resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Publishing Side */}
            <div className="space-y-6">
                <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 sticky top-24">
                    <h3 className="font-bold text-white mb-6">Publishing Options</h3>
                    
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Category</label>
                            <select 
                                value={targetCategory}
                                onChange={(e) => setTargetCategory(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-blue outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="p-4 bg-dark-900 rounded-xl border border-dark-600">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-slate-400">Source Video</span>
                                <span className="text-white font-bold truncate max-w-[100px]">{selectedVideo?.channel}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-slate-400">User Comments</span>
                                <span className="text-brand-blue font-bold flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" /> {selectedVideo?.comments.length}
                                </span>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Tier Access</span>
                                <span className="text-white font-bold">Kinetic</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handlePublish}
                            className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                        >
                            <Save className="w-4 h-4" /> Publish to KB
                        </button>
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full py-3 bg-dark-900 border border-dark-600 hover:bg-dark-800 text-slate-400 hover:text-white font-medium rounded-xl transition-all"
                        >
                            Back to Results
                        </button>
                    </div>
                </div>
            </div>

         </div>
      )}
    </div>
  );
};