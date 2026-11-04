import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectionReveal } from './common/SectionReveal';

export const Experience: React.FC = () => {
  const { data } = usePortfolio();
  const [expandedId, setExpandedId] = useState<string>(data.experiences[0]?.id || '');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? '' : id);
  };

  return (
    <section
      id="experience"
      className="py-16 lg:py-24 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionReveal>
          {/* Section Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
              <span>03</span>
              <span aria-hidden="true">·</span>
              <span>Experience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase">
              Work Experiences
            </h2>
          </div>

          {/* Timeline List */}
          <div className="space-y-3">
            {data.experiences.map((exp) => {
              const isExpanded = expandedId === exp.id;
              return (
                <div
                  key={exp.id}
                  className={`rounded-xl border transition-all duration-300 overflow-hidden backdrop-blur-md ${
                    isExpanded
                      ? 'border-yellow-400/60 bg-white/90 dark:bg-zinc-900/60 shadow-lg'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/20 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm'
                  }`}
                >
                  {/* Header Row */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(exp.id)}
                    className="w-full text-left p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors focus:outline-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-yellow-500 dark:text-yellow-400">
                        <span>{exp.period}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-zinc-500">{exp.location}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        {exp.role}
                      </h3>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                        <Briefcase size={14} className="text-yellow-500 dark:text-yellow-400" />
                        <span className="font-semibold text-zinc-800 dark:text-zinc-300">
                          {exp.company}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content Drawer */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Bullet Highlights */}
                      <ul className="space-y-2">
                        {(exp.achievements || []).map((b: string, bIdx: number) => (
                          <li
                            key={bIdx}
                            className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2.5"
                          >
                            <span className="text-amber-500 font-mono text-base leading-none mt-0.5">›</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Technologies used */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {(exp.stack || []).map((tech: string) => (
                          <span
                            key={tech}
                            className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
