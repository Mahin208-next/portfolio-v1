import React from 'react';
import { ArrowUp } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand & Colophon: M. Hasan (M is yellow) */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
          <span className="font-bold text-zinc-900 dark:text-white tracking-tight font-mono text-base">
            <span className="text-yellow-400 font-extrabold">M</span>
            <span>. Hasan</span>
          </span>
          <span aria-hidden="true" className="text-zinc-400">·</span>
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            Creative Technologist &amp; Senior Frontend Engineer
          </span>
        </div>

        {/* Location & Timezone info */}
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
          <span>{data.personalInfo.location.split('·')[0].trim()}</span>
          <span aria-hidden="true">·</span>
          <span>{data.personalInfo.timezone}</span>
        </div>

        {/* Back to top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-yellow-400 dark:hover:text-yellow-400 transition-colors duration-200"
        >
          <span>Return to Top</span>
          <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
};
