import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectionReveal } from './common/SectionReveal';

export const About: React.FC = () => {
  const { data } = usePortfolio();
  const personalInfo = data?.personalInfo ?? ({} as any);
  const aboutBio = Array.isArray(data?.aboutBio) ? data.aboutBio : [];
  const pillars = Array.isArray(data?.pillars) ? data.pillars : [];

  // Safely extract info items with robust fallback
  const rawItems = (personalInfo as any)?.aboutInfoItems;
  const infoItems: { label: string; value: string; isEmail?: boolean }[] =
    Array.isArray(rawItems) && rawItems.length > 0
      ? rawItems.filter((it) => it && typeof it === 'object')
      : [
          { label: 'Location', value: personalInfo?.location || 'Dhaka, Bangladesh', isEmail: false },
          { label: 'Education', value: 'B.Sc. in CSE (DIU)', isEmail: false },
          { label: 'Focus', value: 'Software Development & IoT', isEmail: false },
          { label: 'Direct Email', value: personalInfo?.email || 'hasan241-15-127@diu.edu.bd', isEmail: true },
        ];

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
              {personalInfo?.aboutHeading || 'This is Mossadik Hasan'}
            </h2>
          </div>

          {/* Narrative Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            <div className="lg:col-span-7 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base md:text-lg leading-relaxed space-y-4">
              {aboutBio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Dynamic Info Card */}
            <div className="lg:col-span-5 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm">
              <dl className="space-y-3 text-xs sm:text-sm divide-y divide-zinc-200 dark:divide-zinc-800">
                {infoItems.map((item, idx) => {
                  if (!item) return null;
                  const label = item.label || '';
                  const value = item.value || '';
                  const isEmail = Boolean(item.isEmail);

                  return (
                    <div key={idx} className="pt-2 first:pt-0 flex justify-between items-baseline gap-4">
                      <dt className="text-zinc-500 text-xs font-mono uppercase shrink-0">{label}</dt>
                      <dd className="text-right">
                        {isEmail ? (
                          <a
                            href={`mailto:${value}`}
                            className="font-mono text-yellow-600 dark:text-yellow-400 hover:underline flex items-center gap-1 text-xs justify-end"
                          >
                            <span className="truncate max-w-[180px] sm:max-w-none">{value}</span>
                            <ArrowUpRight size={13} className="shrink-0" />
                          </a>
                        ) : (
                          <span className="font-mono text-zinc-800 dark:text-zinc-200">{value}</span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {pillars.map((pillar, idx) => {
              if (!pillar) return null;
              return (
                <div
                  key={pillar.index || idx}
                  className="p-5 sm:p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-md hover:border-yellow-400/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <div className="font-mono text-xs text-yellow-500 dark:text-yellow-400 font-bold mb-2">
                    {pillar.index || `0${idx + 1}`}
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
