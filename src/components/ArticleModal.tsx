import React, { useEffect } from 'react';
import { X, Clock, Calendar, BookOpen } from 'lucide-react';
import { BlogPost } from '../types/portfolio';

interface ArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ post, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (post) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto animate-in zoom-in-95 duration-200">
        {/* Top Sticky Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <span className="text-yellow-500 dark:text-yellow-400 font-bold uppercase">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              <span>{post.date}</span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:flex items-center gap-1">
              <Clock size={13} />
              <span>{post.readTime}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close reading view"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-5 sm:p-8 lg:p-10 space-y-6 overscroll-contain">
          {/* Added Image in Header */}
          {post.image && (
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shadow-md">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="font-mono text-[11px] text-yellow-400 uppercase tracking-widest bg-zinc-950/90 backdrop-blur-sm px-2.5 py-1 rounded border border-zinc-800 shadow-sm flex items-center gap-1.5">
                  <BookOpen size={12} />
                  <span>{post.category}</span>
                </span>
                <span className="font-mono text-[11px] text-zinc-300 bg-zinc-950/80 backdrop-blur-sm px-2 py-1 rounded border border-zinc-800">
                  {post.readTime}
                </span>
              </div>
            </div>
          )}

          {/* Article Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Excerpt callout */}
          <div className="border-l-2 border-yellow-400 pl-4 py-2 italic font-serif-editorial text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-900/30 rounded-r-lg">
            {post.excerpt}
          </div>

          {/* Content sections */}
          <div className="text-zinc-700 dark:text-zinc-300 space-y-5 text-sm sm:text-base leading-relaxed font-sans">
            {post.content.split('\n\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('### ')) {
                return (
                  <h3
                    key={index}
                    className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white pt-4 pb-1 uppercase tracking-tight flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <span className="text-yellow-400 font-mono text-sm">✦</span>
                    <span>{trimmed.replace('### ', '')}</span>
                  </h3>
                );
              }

              if (trimmed.startsWith('```')) {
                const code = trimmed.replace(/```[a-z]*\n?/g, '');
                return (
                  <pre
                    key={index}
                    className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-yellow-300 overflow-x-auto leading-relaxed shadow-inner"
                  >
                    <code>{code}</code>
                  </pre>
                );
              }

              if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
                return (
                  <div
                    key={index}
                    className="p-4 my-3 rounded-lg bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 font-mono text-xs sm:text-sm text-center text-zinc-800 dark:text-zinc-200 overflow-x-auto"
                  >
                    {trimmed.replace(/\$\$/g, '')}
                  </div>
                );
              }

              return (
                <p key={index} className="leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-5 sm:px-8 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
          <span>Editorial Publishing &amp; Engineering</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-md transition-colors shadow-sm"
          >
            Close Essay
          </button>
        </div>
      </div>
    </div>
  );
};
