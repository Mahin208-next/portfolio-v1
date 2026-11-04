import React, { useEffect } from 'react';
import { X, Github, CheckCircle2 } from 'lucide-react';
import { Project } from '../types/portfolio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <span className="text-yellow-500 dark:text-yellow-400 font-bold uppercase">{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{project.role}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal dialog"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8 overscroll-contain">
          {/* Main Visual */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shadow-md">
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Titles & Summary */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 uppercase">
              {project.title}
            </h3>
            <p className="text-base sm:text-lg font-serif-editorial italic text-yellow-600 dark:text-yellow-400 mb-4">
              {project.subtitle}
            </p>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <p className="text-base sm:text-xl font-mono font-bold text-yellow-500 dark:text-yellow-400 tabular-nums">
                  {m.value}
                </p>
                <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          {/* Engineering Deep Dive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
            <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
              <h4 className="text-xs font-mono uppercase tracking-wider text-rose-500 dark:text-rose-400 mb-2 font-bold">
                The Bottleneck Challenge
              </h4>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 font-bold">
                The Engineered Solution
              </h4>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Stack Used */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
              Full Technology Ecosystem
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-mono rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Production Verified Case Study</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-300 dark:border-zinc-700 rounded-md transition-colors"
              >
                <Github size={14} />
                <span>Source</span>
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-md transition-colors shadow-sm"
            >
              Done Viewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
