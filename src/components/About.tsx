import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectionReveal } from './common/SectionReveal';

export const About: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo, aboutBio, pillars } = data;

  return (
    <section
      id="about"
      className="py-16 lg:py-24 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionReveal>
          {/* Section Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
              <span>01</span>
              <span aria-hidden="true">·</span>
              <span>About Me</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase">
              This is Mossadik Hasan
            </h2>
          </div>

          {/* Narrative Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            <div className="lg:col-span-7 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base md:text-lg leading-relaxed space-y-4">
              {aboutBio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="lg:col-span-5 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm">
              <dl className="space-y-3 text-xs sm:text-sm divide-y divide-zinc-200 dark:divide-zinc-800">
                <div className="pt-2 first:pt-0 flex justify-between items-baseline">
                  <dt className="text-zinc-500 text-xs font-mono uppercase">Location</dt>
                  <dd className="font-mono text-zinc-800 dark:text-zinc-200">{personalInfo.location}</dd>
                </div>
                <div className="pt-2 flex justify-between items-baseline">
                  <dt className="text-zinc-500 text-xs font-mono uppercase">Education</dt>
                  <dd className="text-zinc-800 dark:text-zinc-200">B.Sc. in CSE (DIU)</dd>
                </div>
                <div className="pt-2 flex justify-between items-baseline">
                  <dt className="text-zinc-500 text-xs font-mono uppercase">Focus</dt>
                  <dd className="text-zinc-800 dark:text-zinc-200">Design Systems &amp; FinTech UI</dd>
                </div>
                <div className="pt-2 flex justify-between items-baseline">
                  <dt className="text-zinc-500 text-xs font-mono uppercase">Direct Email</dt>
                  <dd>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="font-mono text-yellow-600 dark:text-yellow-400 hover:underline flex items-center gap-1 text-xs truncate max-w-[200px] sm:max-w-none"
                    >
                      <span className="truncate">{personalInfo.email}</span>
                      <ArrowUpRight size={13} className="shrink-0" />
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {pillars.map((pillar) => (
              <div
                key={pillar.index}
                className="p-5 sm:p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-md hover:border-yellow-400/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="font-mono text-xs text-yellow-500 dark:text-yellow-400 font-bold mb-2">
                  {pillar.index}
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
