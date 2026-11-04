import React from 'react';
import { Award, GraduationCap } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectionReveal } from './common/SectionReveal';

export const Education: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section
      id="education"
      className="py-16 lg:py-24 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionReveal>
          {/* Section Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
              <span>05</span>
              <span aria-hidden="true">·</span>
              <span>Education &amp; Credentials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase">
              Academic Background
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Degree Container */}
            <div className="lg:col-span-7">
              {data.education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/40 backdrop-blur-md space-y-4 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-yellow-500 dark:text-yellow-400">
                        <span>{edu.period}</span>
                        <span aria-hidden="true">·</span>
                        <span>{edu.location}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        {edu.degree}
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-2">
                        <GraduationCap size={18} className="text-yellow-500" />
                        <span>{edu.institution}</span>
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-yellow-400/10 text-yellow-500 shrink-0">
                      <GraduationCap size={24} />
                    </div>
                  </div>

                  {edu.honors && (
                    <div className="p-3.5 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800/40 text-yellow-800 dark:text-yellow-300 text-xs font-mono flex items-center gap-2">
                      <Award size={15} className="shrink-0" />
                      <span>{edu.honors}</span>
                    </div>
                  )}

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Certifications Container */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                Verified Certifications
              </h3>

              {data.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/30 backdrop-blur-md hover:border-yellow-400/50 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                      {cert.name}
                    </h4>
                    <span className="font-mono text-xs text-yellow-500 dark:text-yellow-400 font-semibold tabular-nums shrink-0">
                      {cert.year}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">
                    <span>{cert.issuer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
