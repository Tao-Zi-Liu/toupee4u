import React, { useState, useEffect, useRef } from 'react';
import { Article, UserTier, Expert } from '../types';
import {
  Lock, Clock, ShieldCheck, Orbit, List, ChevronRight, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

interface ArticleViewProps {
  article: Article;
  userTier?: UserTier;
  expert?: Expert;
  prevArticle?: { id: string; title: string; path: string };
  nextArticle?: { id: string; title: string; path: string };
  categoryId?: string;
  topicId?: string;
}

// ── 从HTML内容提取标题生成TOC ──────────────────
function extractHeadings(html: string): { id: string; text: string; level: number }[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3');
  const result: { id: string; text: string; level: number }[] = [];

  headings.forEach((heading, index) => {
    const text = heading.textContent || '';
    const id = `heading-${index}-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 30)}`;
    result.push({
      id,
      text: text.substring(0, 60),
      level: parseInt(heading.tagName[1])
    });
  });

  return result;
}

// ── 为HTML内容中的标题注入ID ──────────────────
function injectHeadingIds(html: string, headings: { id: string; text: string; level: number }[]): string {
  let result = html;
  let headingIndex = 0;

  result = result.replace(/<(h[1-3])([^>]*)>([\s\S]*?)<\/h[1-3]>/gi, (match, tag, attrs, content) => {
    if (headingIndex < headings.length) {
      const id = headings[headingIndex].id;
      headingIndex++;
      return `<${tag} id="${id}"${attrs}>${content}</${tag}>`;
    }
    return match;
  });

  return result;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  userTier = UserTier.NEBULA,
  expert,
  prevArticle,
  nextArticle,
  categoryId,
  topicId
}) => {
  const navigate = useNavigate();
  const { categories } = useData();

  // ── TOC State ─────────────────────────────────
  const [tocHeadings, setTocHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [showMobileToc, setShowMobileToc] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // ── 相关文章 ──────────────────────────────────
  const [relatedArticles, setRelatedArticles] = useState<{
    id: string; title: string; readTime: string; tier: string;
    topicTitle: string; categoryId: string; topicId: string;
  }[]>([]);

  const tiers = [UserTier.NEBULA, UserTier.NOVA, UserTier.GALAXY, UserTier.SUPERNOVA];
  const articleTierIndex = tiers.indexOf(article.tier);
  const userTierIndex = tiers.indexOf(userTier);
  const isLocked = userTierIndex < articleTierIndex;

  // ── 提取TOC ───────────────────────────────────
  useEffect(() => {
    if (!article.content || isLocked) return;
    const headings = extractHeadings(article.content);
    setTocHeadings(headings);
    if (headings.length > 0) setActiveHeading(headings[0].id);
  }, [article.content, isLocked]);

  // ── 滚动监听高亮当前标题 ─────────────────────
  useEffect(() => {
    if (tocHeadings.length === 0) return;

    const handleScroll = () => {
      for (let i = tocHeadings.length - 1; i >= 0; i--) {
        const el = document.getElementById(tocHeadings[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveHeading(tocHeadings[i].id);
            return;
          }
        }
      }
      if (tocHeadings.length > 0) setActiveHeading(tocHeadings[0].id);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocHeadings]);

  // ── 查找相关文章 ──────────────────────────────
  useEffect(() => {
    if (!categoryId || !topicId) return;

    const related: typeof relatedArticles = [];

    for (const cat of categories) {
      for (const topic of cat.topics) {
        for (const art of topic.articles || []) {
          if (art.id === article.id) continue;
          if ((art as any).status === 'draft') continue;

          // 同主题文章优先
          const isSameTopic = topic.id === topicId && cat.id === categoryId;
          // 同分类文章次之
          const isSameCategory = cat.id === categoryId;

          if (isSameTopic || isSameCategory) {
            related.push({
              id: art.id,
              title: art.title,
              readTime: art.readTime,
              tier: art.tier,
              topicTitle: topic.title,
              categoryId: cat.id,
              topicId: topic.id,
            });
          }
        }
      }
    }

    // 同主题排前面，最多4篇
    const sorted = related.sort((a, b) => {
      const aScore = a.topicId === topicId ? 2 : 1;
      const bScore = b.topicId === topicId ? 2 : 1;
      return bScore - aScore;
    });

    setRelatedArticles(sorted.slice(0, 4));
  }, [article.id, categoryId, topicId, categories]);

  // ── 点击TOC标题滚动 ───────────────────────────
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveHeading(id);
      setShowMobileToc(false);
    }
  };

  // ── 处理注入ID后的内容 ────────────────────────
  const processedContent = tocHeadings.length > 0
    ? injectHeadingIds(article.content, tocHeadings)
    : article.content;

  const tierColors: { [k: string]: string } = {
    NEBULA: 'text-slate-400 bg-dark-900 border-dark-700',
    NOVA: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    GALAXY: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    SUPERNOVA: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start relative">

      {/* ══════════════════════════════════════════
          메인 컨텐츠
      ══════════════════════════════════════════ */}
      <div className="flex-1 min-w-0">
        <article className="space-y-10">

          {/* ── 文章头部 ── */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <span className="text-brand-blue flex items-center gap-1.5 bg-brand-blue/10 px-2.5 py-1 rounded-md border border-brand-blue/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Physics Vetted
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {article.readTime} Read
              </span>
              {article.tier !== UserTier.NEBULA && (
                <span className="flex items-center gap-1.5 text-brand-purple">
                  <Orbit className="w-3.5 h-3.5" /> {article.tier} Tier
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              {article.title}
            </h1>

            {/* ── 移动端 TOC 触发按钮 ── */}
            {tocHeadings.length > 0 && !isLocked && (
              <button
                onClick={() => setShowMobileToc(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-slate-300 text-sm font-medium hover:border-brand-blue/50 transition-colors"
              >
                <List className="w-4 h-4 text-brand-blue" />
                Table of Contents
                <span className="ml-auto text-slate-500 text-xs">{tocHeadings.length} sections</span>
              </button>
            )}
          </div>

          {/* ── 文章内容 ── */}
          <div className="relative" ref={contentRef}>
            {isLocked ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/80 to-dark-900 z-10 pointer-events-none" />
                <div className="opacity-20 select-none blur-[2px] article-content">
                  <h3>The Mechanics of Entropy</h3>
                  <p>When analyzing the molecular structure of Swiss lace versus French lace denier...</p>
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
                  <div className="w-full max-w-md bg-dark-800 border-2 border-brand-purple/30 rounded-3xl p-8 shadow-2xl text-center backdrop-blur-md">
                    <div className="w-16 h-16 bg-brand-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-purple">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Astronomical Protocol Restricted</h3>
                    <p className="text-slate-300 text-sm mb-8">
                      This module is available exclusively to <strong>{article.tier}</strong> members.
                    </p>
                    <Link
                      to="/membership"
                      className="block w-full py-4 bg-brand-purple hover:bg-purple-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
                    >
                      Unlock Tier Access
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="article-content max-w-none"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            )}
          </div>

          {/* ── 上下篇导航 ── */}
          {(prevArticle || nextArticle) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-dark-700">
              {prevArticle ? (
                <Link
                  to={prevArticle.path}
                  className="group flex items-center gap-4 p-5 bg-dark-800 border border-dark-700 hover:border-brand-blue/50 rounded-2xl transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-center flex-shrink-0 group-hover:border-brand-blue/30 transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-500 rotate-180" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Previous</p>
                    <p className="text-white text-sm font-semibold truncate group-hover:text-brand-blue transition-colors">
                      {prevArticle.title}
                    </p>
                  </div>
                </Link>
              ) : <div />}

              {nextArticle && (
                <Link
                  to={nextArticle.path}
                  className="group flex items-center gap-4 p-5 bg-dark-800 border border-dark-700 hover:border-brand-blue/50 rounded-2xl transition-all sm:flex-row-reverse sm:text-right"
                >
                  <div className="w-10 h-10 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-center flex-shrink-0 group-hover:border-brand-blue/30 transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Next</p>
                    <p className="text-white text-sm font-semibold truncate group-hover:text-brand-blue transition-colors">
                      {nextArticle.title}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* ── 相关文章推荐 ── */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 border-t border-dark-700">
              <h3 className="text-white font-bold text-lg mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedArticles.map(related => (
                  <Link
                    key={related.id}
                    to={`/kb/${related.categoryId}/${related.topicId}/${related.id}`}
                    className="group flex items-start gap-3 p-4 bg-dark-800 border border-dark-700 hover:border-brand-blue/50 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="w-4 h-4 text-brand-blue" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-semibold group-hover:text-brand-blue transition-colors line-clamp-2">
                        {related.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tierColors[related.tier] || tierColors.NEBULA}`}>
                          {related.tier}
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {related.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      {/* ══════════════════════════════════════════
          TOC 桌面侧边栏
      ══════════════════════════════════════════ */}
      {tocHeadings.length > 0 && !isLocked && (
      <div className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
      <div className="fixed top-24 right-6 xl:right-8 w-56 xl:w-64 bg-dark-800 border border-dark-700 rounded-2xl p-5 max-h-[calc(100vh-8rem)] overflow-y-auto z-10">
            <div className="flex items-center gap-2 mb-4">
              <List className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contents</span>
            </div>
            <nav className="space-y-1">
              {tocHeadings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-all duration-200 truncate ${
                    heading.level === 1 ? 'font-semibold' :
                    heading.level === 2 ? 'pl-4' : 'pl-6'
                  } ${
                    activeHeading === heading.id
                      ? 'text-brand-blue bg-brand-blue/10 font-medium'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-dark-700'
                  }`}
                >
                  {activeHeading === heading.id && (
                    <span className="inline-block w-1 h-1 rounded-full bg-brand-blue mr-1.5 mb-0.5" />
                  )}
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TOC 移动端弹窗
      ══════════════════════════════════════════ */}
      {showMobileToc && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileToc(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-brand-blue" />
                <span className="text-white font-bold">Table of Contents</span>
              </div>
              <button
                onClick={() => setShowMobileToc(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {tocHeadings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`w-full text-left py-3 px-3 rounded-xl transition-all text-sm ${
                    heading.level === 2 ? 'pl-6' : heading.level === 3 ? 'pl-9' : ''
                  } ${
                    activeHeading === heading.id
                      ? 'text-brand-blue bg-brand-blue/10 font-medium'
                      : 'text-slate-300 hover:bg-dark-700'
                  }`}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
