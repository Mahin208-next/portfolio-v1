import React, { useState } from 'react';
import { ArrowUpRight, Clock, Calendar, BookOpen } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { BlogPost } from '../types/portfolio';
import { ArticleModal } from './ArticleModal';
import { SectionReveal } from './common/SectionReveal';

export const Blog: React.FC = () => {
  const { data } = usePortfolio();
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  return (
    <section
      id="blog"
      className="py-16 lg:py-24 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionReveal>
          {/* Section Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
              <span>06</span>
              <span aria-hidden="true">·</span>
              <span>Blog &amp; Essays</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase">
              Articles
            </h2>
          </div>

          {/* Articles List with Images in Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.blogPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setActivePost(post)}
                className="group cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/30 backdrop-blur-md hover:border-yellow-400/60 hover:bg-white dark:hover:bg-zinc-900/50 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 ease-out shadow-sm flex flex-col overflow-hidden"
              >
                {/* Header Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3">
                    <span className="font-mono text-[10px] text-yellow-400 uppercase tracking-widest bg-zinc-950/85 backdrop-blur-sm px-2.5 py-1 rounded border border-zinc-800 shadow-sm flex items-center gap-1">
                      <BookOpen size={10} />
                      <span>{post.category}</span>
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-3 text-[11px] font-mono text-zinc-300 flex items-center gap-1">
                    <Clock size={11} />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-2">
                      <Calendar size={12} />
                      <span>{post.date}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors leading-snug mb-3">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono font-semibold text-yellow-600 dark:text-yellow-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Full Essay</span>
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionReveal>
      </div>

      {/* Article Detail Modal */}
      <ArticleModal
        post={activePost}
        onClose={() => setActivePost(null)}
      />
    </section>
  );
};
