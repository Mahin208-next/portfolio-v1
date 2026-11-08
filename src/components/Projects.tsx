import React, { useState } from 'react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types/portfolio';
import { ProjectModal } from './ProjectModal';
import { SectionReveal } from './common/SectionReveal';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const rawCategories = (data?.personalInfo as any)?.projectCategories;
  const categories: string[] =
    Array.isArray(rawCategories) && rawCategories.length > 0
      ? rawCategories.filter((c: any) => typeof c === 'string' && c.trim() !== '')
      : ['All', 'Fintech', 'Creative & Audio', 'Publishing & Tools', 'Design Systems'];

  const isAll = (cat: string) => cat.toLowerCase() === 'all' || cat.toLowerCase() === 'view all';

  const currentCategory = categories.includes(selectedCategory)
    ? selectedCategory
    : (categories[0] || 'All');

  const filteredProjects = isAll(currentCategory)
    ? (data?.projects || [])
    : (data?.projects || []).filter(
        (p) => (p.category || '').trim().toLowerCase() === currentCategory.trim().toLowerCase()
      );

  return (
    <section
      id="projects"
      className="py-16 lg:py-24 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionReveal>
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
                <span>04</span>
                <span aria-hidden="true">·</span>
                <span>Projects</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase">
                Selected Works
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-mono rounded-md transition-all duration-200 whitespace-nowrap shrink-0 ${
                    currentCategory === cat
                      ? 'bg-yellow-400 text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Bento Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {filteredProjects.map((project, index) => {
              const isFeatured = index === 0;
              return (
                <div
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  className={`group cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/40 backdrop-blur-md overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-yellow-400/60 hover:shadow-xl hover:shadow-yellow-400/5 ${
                    isFeatured ? 'lg:col-span-12' : 'lg:col-span-6'
                  }`}
                >
                  <div
                    className={`grid grid-cols-1 ${
                      isFeatured ? 'lg:grid-cols-12 items-stretch' : ''
                    }`}
                  >
                    {/* Image container */}
                    <div
                      className={`relative overflow-hidden bg-zinc-950 ${
                        isFeatured ? 'lg:col-span-7 aspect-[16/10]' : 'aspect-video'
                      }`}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-4 left-4 font-mono text-[11px] text-yellow-400 uppercase tracking-widest bg-zinc-950/85 backdrop-blur-sm px-2.5 py-1 rounded border border-zinc-800 shadow-sm">
                        {project.category}
                      </div>
                    </div>

                    {/* Text details */}
                    <div
                      className={`p-6 sm:p-8 flex flex-col justify-between ${
                        isFeatured ? 'lg:col-span-5' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-2">
                          <span>{project.year}</span>
                          <span aria-hidden="true">·</span>
                          <span>{project.role}</span>
                        </div>

                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors uppercase mb-2">
                          {project.title}
                        </h3>

                        <p className="text-sm font-serif-editorial italic text-zinc-600 dark:text-zinc-400 mb-4">
                          {project.subtitle}
                        </p>

                        <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3 leading-relaxed mb-6">
                          {project.summary}
                        </p>
                      </div>

                      <div>
                        {/* Metrics preview */}
                        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 mb-6">
                          {project.metrics.slice(0, 2).map((m) => (
                            <div key={m.label}>
                              <span className="block text-xs text-zinc-500">
                                {m.label}
                              </span>
                              <span className="font-mono text-sm font-bold text-yellow-500 dark:text-yellow-400 tabular-nums">
                                {m.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono font-medium text-yellow-600 dark:text-yellow-400 group-hover:text-yellow-500">
                          <span className="flex items-center gap-1.5 uppercase tracking-wider">
                            <Layers size={14} />
                            <span>Inspect Architecture</span>
                          </span>
                          <div className="p-1.5 rounded-full bg-yellow-400/10 group-hover:bg-yellow-400 group-hover:text-zinc-950 transition-colors">
                            <ArrowUpRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20">
            <Layers size={28} className="mx-auto text-zinc-400 mb-3" />
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              No projects found in &ldquo;{currentCategory}&rdquo;
            </p>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Assign projects to this category in the Admin Panel to display them here.
            </p>
          </div>
        )}
        </SectionReveal>
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
};
