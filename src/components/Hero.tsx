import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { navigateTo } from '../utils/router';

export const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo } = data;

  const containerRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLHeadingElement>(null);
  const headlineLine2Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(headlineLine1Ref.current, {
        y: 60,
        opacity: 0,
        skewY: 2,
        duration: 1.0,
      })
      .from(headlineLine2Ref.current, {
        y: 60,
        opacity: 0,
        skewY: -2,
        duration: 1.0,
      }, '-=0.8')
      .from(subtitleRef.current, {
        y: 24,
        opacity: 0,
        duration: 0.7,
      }, '-=0.6')
      .from(imageFrameRef.current, {
        scale: 0.96,
        opacity: 0,
        duration: 1.0,
        ease: 'power2.out',
      }, '-=0.8')
      .from(metricsRef.current?.children || [], {
        y: 16,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
      }, '-=0.5');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Split Screen 2-Column Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-stretch mb-12">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Massive Oversized Kinetic Headline */}
              <div className="overflow-hidden mb-2">
                <h1
                  ref={headlineLine1Ref}
                  className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase leading-[0.95]"
                  style={{ textWrap: 'balance' }}
                >
                  {personalInfo.heroHeadlineLine1 || 'Creative'}
                  <span className="block text-zinc-500 dark:text-zinc-400 font-serif-editorial italic font-normal tracking-normal lowercase text-2xl sm:text-4xl md:text-5xl xl:text-6xl pl-1 sm:pl-2">
                    {personalInfo.heroHeadlineAccent || 'technologist'}
                  </span>
                </h1>
              </div>

              <div className="overflow-hidden mb-6">
                <h2
                  ref={headlineLine2Ref}
                  className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-yellow-500 dark:text-yellow-400 uppercase leading-[1.05]"
                  style={{ textWrap: 'balance' }}
                >
                  {personalInfo.heroHeadlineLine2 || '& Senior Frontend Engineer'}
                </h2>
              </div>

              {/* Lead Editorial Copy */}
              <p
                ref={subtitleRef}
                className="text-sm sm:text-base md:text-lg text-zinc-700 dark:text-zinc-300 max-w-xl leading-relaxed mb-8"
              >
                {personalInfo.tagline}
              </p>

              {/* Working CTA Actions */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => navigateTo('/projects')}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 bg-yellow-400 hover:bg-yellow-300 rounded-md transition-colors shadow-sm"
                >
                  <span>View Projects</span>
                  <ArrowDownRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('/contact')}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 text-xs font-medium tracking-wide uppercase text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:border-yellow-400 rounded-md transition-colors"
                >
                  <span>Contact Me</span>
                </button>
              </div>
            </div>

            {/* Horizontal Docked Social Links Stick in Hero */}
            <div className="mt-8 pt-5 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-4 sm:gap-5 text-xs font-mono overflow-x-auto no-scrollbar">
              <span className="text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-[10px] shrink-0">
                Connect:
              </span>
              <div className="flex items-center gap-4">
                {personalInfo.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-700 dark:text-zinc-300 hover:text-yellow-500 dark:hover:text-yellow-400 font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap"
                  >
                    <span>{social.name}</span>
                    <ArrowUpRight size={12} className="opacity-70" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual Container */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div
              ref={imageFrameRef}
              className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 shadow-xl"
            >
              <div className="aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5] w-full overflow-hidden">
                <img
                  src={personalInfo.heroPortrait}
                  alt={`Portrait of ${personalInfo.name}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div
          ref={metricsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800"
        >
          {personalInfo.stats.map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40"
            >
              <p className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-zinc-900 dark:text-white tabular-nums mb-1">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
