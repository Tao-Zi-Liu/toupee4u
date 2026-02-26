import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArticleView } from '../components/ArticleView';
import { ChevronRight, Home, ArrowLeft, CheckCircle } from 'lucide-react';
import { getCurrentUser } from '../services/auth.service';
import { markArticleRead, checkArticleRead } from '../services/progress.service';

export const ArticlePage: React.FC = () => {
  const { categoryId, topicId, articleId } = useParams<{
    categoryId: string; topicId: string; articleId: string;
  }>();
  const { categories, experts } = useData();

  // ── 进度追踪 State ──────────────────────────
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isRead, setIsRead] = useState(false);
  const [justMarkedRead, setJustMarkedRead] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const markedReadRef = useRef(false);

  // ── 数据查找 ────────────────────────────────
  const category = categories.find(c => c.id === categoryId);
  const topic = category?.topics.find(t => t.id === topicId);
  const articleIndex = topic?.articles.findIndex(a => a.id === articleId) ?? -1;
  const article = topic?.articles[articleIndex];

  const prevArticle = useMemo(() => {
    if (!topic || articleIndex <= 0) return null;
    return topic.articles[articleIndex - 1];
  }, [topic, articleIndex]);

  const nextArticle = useMemo(() => {
    if (!topic || articleIndex === -1 || articleIndex >= topic.articles.length - 1) return null;
    return topic.articles[articleIndex + 1];
  }, [topic, articleIndex]);

  const authoringExpert = useMemo(() => {
    if (categoryId === 'base-fiber') return experts.find(e => e.id === 'aris-chronis');
    if (categoryId === 'maintenance') return experts.find(e => e.id === 'mark-knot');
    if (categoryId === 'foundations') return experts.find(e => e.id === 'elena-vance');
    return experts[0];
  }, [categoryId, experts]);

  // ── 检查是否已读 ────────────────────────────
  useEffect(() => {
    if (!articleId) return;
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    checkArticleRead(currentUser.uid, articleId).then(read => {
      setIsRead(read);
      markedReadRef.current = read;
    });

    // 重置计时器
    startTimeRef.current = Date.now();
    markedReadRef.current = false;
    setJustMarkedRead(false);
    setScrollProgress(0);
  }, [articleId]);

  // ── 滚动进度条 + 自动标记已读 ───────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
      setScrollProgress(progress);

      // 滚动到 80% 且未标记时，自动标记已读
      if (progress >= 80 && !markedReadRef.current) {
        markedReadRef.current = true;
        const currentUser = getCurrentUser();
        if (!currentUser || !article || !category) return;

        const readTimeSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

        markArticleRead(currentUser.uid, {
          articleId: article.id,
          topicId: topicId!,
          categoryId: categoryId!,
          articleTitle: article.title,
          categoryName: category.name,
          readTimeSeconds
        }).then(() => {
          setIsRead(true);
          setJustMarkedRead(true);
          setTimeout(() => setJustMarkedRead(false), 3000);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article, category, categoryId, topicId]);

  // ── 404 状态 ────────────────────────────────
  if (!category || !topic || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-dark-800 rounded-3xl border border-dark-700 flex items-center justify-center shadow-2xl relative">
          <div className="absolute inset-0 bg-red-500/10 rounded-3xl animate-pulse" />
          <span className="text-5xl relative z-10">🕵️‍♂️</span>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Module Signal Lost</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            The technical coordinates for this module could not be synthesized.
          </p>
        </div>
        <Link
          to="/knowledge-map"
          className="inline-flex items-center gap-3 px-8 py-4 bg-brand-blue text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Return to Map Architecture
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-20 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">

      {/* ── 顶部滚动进度条 ── */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-dark-700">
        <div
          className="h-full bg-brand-blue transition-all duration-150 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── 已读提示 Toast ── */}
      {justMarkedRead && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle className="w-4 h-4" />
          Article marked as complete!
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide py-2 px-1 border-b border-dark-800/50">
        <Link to="/" className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-dark-800">
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-dark-700 flex-shrink-0" />
        <Link to="/knowledge-map" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
          Core Architecture
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-dark-700 flex-shrink-0" />
        <Link to={`/kb/${categoryId}`} className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
          {category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-dark-700 flex-shrink-0" />
        <Link to={`/kb/${categoryId}/${topicId}`} className="text-[10px] font-bold text-brand-blue transition-colors uppercase tracking-[0.2em]">
          {topic.title}
        </Link>

        {/* ── 已读状态标记 ── */}
        <div className="ml-auto flex-shrink-0">
          {isRead ? (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" /> Completed
            </span>
          ) : (
            <span className="text-[10px] font-bold text-slate-600 bg-dark-800 border border-dark-700 px-3 py-1 rounded-full">
              {scrollProgress}% read
            </span>
          )}
        </div>
      </nav>

      {/* ── Main Content ── */}
      <ArticleView
          article={article as any}
          expert={authoringExpert}
          categoryId={categoryId}
          topicId={topicId}
          prevArticle={prevArticle ? {
            id: prevArticle.id,
            title: prevArticle.title,
            path: `/kb/${categoryId}/${topicId}/${prevArticle.id}`
          } : undefined}
          nextArticle={nextArticle ? {
            id: nextArticle.id,
            title: nextArticle.title,
            path: `/kb/${categoryId}/${topicId}/${nextArticle.id}`
          } : undefined}
        />
    </div>
  );
};
