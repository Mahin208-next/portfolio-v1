import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footer = (data?.personalInfo as any)?.footer ?? {};

  const brandText =
    footer.brandText !== undefined && footer.brandText !== ''
      ? footer.brandText
      : data?.personalInfo?.logoText || data?.personalInfo?.name || 'M. Hasan';

  const subtitleText =
    footer.subtitleText !== undefined
      ? footer.subtitleText
      : data?.personalInfo?.title || '';

  const showBrand = footer.showBrand !== false;

  const defaultMiddle = [
    (data?.personalInfo?.location || '').split('·')[0].trim(),
    data?.personalInfo?.timezone,
  ]
    .filter(Boolean)
    .join(' · ');

  const middleText =
    footer.middleText !== undefined ? footer.middleText : defaultMiddle;

  const showMiddle = footer.showMiddle !== false && Boolean(middleText);

  const returnToTopText = footer.returnToTopText || 'Return to Top';
  const showReturnToTop = footer.showReturnToTop !== false;

  const customSections: { id: string; title: string; content: string; url?: string }[] =
    Array.isArray(footer.customSections)
      ? footer.customSections.filter((s: any) => s && (s.title || s.content))
      : [];

  const copyrightText = footer.copyrightText || '';

  return (
    <footer className="py-12 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        {/* Main Bottom Bar Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Brand & Colophon */}
          {showBrand && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="font-bold text-zinc-900 dark:text-white tracking-tight font-mono text-base">
                <span className="text-yellow-400 font-extrabold">
                  {brandText.charAt(0)}
                </span>
                <span>{brandText.slice(1)}</span>
              </span>
              {subtitleText && (
                <>
                  <span aria-hidden="true" className="text-zinc-400">·</span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {subtitleText}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Location & Timezone / Middle Info */}
          {showMiddle && (
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span>{middleText}</span>
            </div>
          )}

          {/* Back to top */}
          {showReturnToTop && (
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-yellow-400 dark:hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
            >
              <span>{returnToTopText}</span>
              <ArrowUp size={14} />
            </button>
          )}
        </div>

        {/* Additional Custom Bottom Sections / Colophon */}
        {(customSections.length > 0 || copyrightText) && (
          <div className="pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-wrap items-center justify-center md:justify-between gap-4 text-xs font-mono text-zinc-500">
            {customSections.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
                {customSections.map((sec, i) => (
                  <div key={sec.id || i} className="flex items-center gap-2">
                    {sec.title && (
                      <span className="text-zinc-400 dark:text-zinc-500 font-medium uppercase text-[11px]">
                        {sec.title}:
                      </span>
                    )}
                    {sec.url ? (
                      <a
                        href={sec.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-700 dark:text-zinc-300 hover:text-yellow-400 dark:hover:text-yellow-400 transition-colors inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
                      >
                        <span>{sec.content}</span>
                        <ArrowUpRight size={11} className="shrink-0" />
                      </a>
                    ) : (
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {sec.content}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {copyrightText && (
              <div className="text-zinc-400 dark:text-zinc-500 text-center md:text-right">
                {copyrightText}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
};
