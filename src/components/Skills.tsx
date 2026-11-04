import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { renderSkillIcon } from '../utils/skillIcons';
import { SectionReveal } from './common/SectionReveal';

export const Skills: React.FC = () => {
  const { data } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Extract distinct categories
  const categories = ['All', ...Array.from(new Set(data.skills.map((s) => s.category)))];

  const filtered =
    activeCategory === 'All'
      ? data.skills
      : data.skills.filter((s) => s.category === activeCategory);

  return (
    <section
      id="skills"
      className="py-16 lg:py-24 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionReveal>
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
                <span>02</span>
                <span aria-hidden="true">·</span>
                <span>Skills &amp; Tools</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase">
                Core Tech Stack
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all duration-200 whitespace-nowrap shrink-0 ${
                    activeCategory === cat
                      ? 'bg-yellow-400 text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Focused Core Skills Grid */}
          {filtered.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm">
              <p className="text-xs font-mono text-zinc-500">No skills in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filtered.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/30 backdrop-blur-md hover:border-yellow-400/60 hover:bg-white dark:hover:bg-zinc-900/60 hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-out flex items-center gap-3.5 group shadow-sm"
                >
                  <div className="p-2.5 rounded-lg bg-zinc-100/90 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {renderSkillIcon(skill.iconName || skill.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white tracking-tight truncate block">
                      {skill.name}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 uppercase block truncate">
                      {skill.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionReveal>
      </div>
    </section>
  );
};
