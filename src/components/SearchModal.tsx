import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Shield, ArrowRight, Sparkles, Folder, FileText, User } from 'lucide-react';
import { navigateTo } from '../utils/router';
import { usePortfolio } from '../context/PortfolioContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { data } = usePortfolio();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const isAdminQuery = q === '/admin' || q === 'admin' || q.includes('admin');

  const defaultNavigationItems = [
    { label: '/admin', title: 'Admin Control Panel', desc: 'Edit all sections, hero images & everything', icon: Shield, path: '/admin', highlight: true },
    { label: '/home', title: 'Home & Hero Section', desc: 'Creative Technologist headline & metrics', icon: User, path: '/home' },
    { label: '/about', title: 'About Me', desc: 'This is Mossadik Hasan & engineering pillars', icon: User, path: '/about' },
    { label: '/skills', title: 'Technical Stack', desc: 'Core frontend, kinetic & systems tools', icon: Sparkles, path: '/skills' },
    { label: '/projects', title: 'Selected Works', desc: 'Interactive fintech & creative web software', icon: Folder, path: '/projects' },
    { label: '/experience', title: 'Work Experiences', desc: 'Roles at Studio Monolith, Strata Labs & Vertex', icon: FileText, path: '/experience' },
    { label: '/education', title: 'Academic Background', desc: 'DIU B.Sc. in CSE & verified credentials', icon: FileText, path: '/education' },
    { label: '/blog', title: 'Articles & Essays', desc: 'Engineering typography & performance deep dives', icon: FileText, path: '/blog' },
    { label: '/contact', title: 'Get in Touch', desc: 'Direct email, Dhaka time & inquiry form', icon: ArrowRight, path: '/contact' },
  ];

  const handleSelect = (path: string) => {
    onClose();
    navigateTo(path);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminQuery) {
      handleSelect('/admin');
      return;
    }
    if (q.startsWith('/')) {
      handleSelect(q);
      return;
    }
    // Check if query matches a section
    const match = defaultNavigationItems.find((item) =>
      item.label.includes(q) || item.title.toLowerCase().includes(q)
    );
    if (match) {
      handleSelect(match.path);
    }
  };

  const filteredItems = defaultNavigationItems.filter((item) => {
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 pb-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Header Form */}
        <form onSubmit={handleFormSubmit} className="relative border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center px-4 sm:px-6 h-16 gap-3">
            <Search size={20} className="text-yellow-500 dark:text-yellow-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type /admin or search sections, projects..."
              className="w-full bg-transparent text-base sm:text-lg font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-100 dark:bg-zinc-900 shrink-0"
            >
              ESC
            </button>
          </div>
        </form>

        {/* Admin Quick Jump Banner when typing /admin */}
        {isAdminQuery && (
          <div className="p-3 bg-yellow-400/10 dark:bg-yellow-400/15 border-b border-yellow-400/30 flex items-center justify-between gap-3 px-6 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-yellow-400 text-zinc-950 font-bold">
                <Shield size={16} />
              </span>
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white font-mono">
                  Admin Panel Route Detected
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  Press Enter or click below to launch the Portfolio Management Console
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelect('/admin')}
              className="px-3.5 py-1.5 text-xs font-bold font-mono uppercase bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-md transition-colors shrink-0 shadow-sm"
            >
              Enter Admin →
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-1 overscroll-contain">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              No matching section found for "{query}". Try typing <span className="text-yellow-500 font-bold">/admin</span> or <span className="text-yellow-500 font-bold">/skills</span>.
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              const isItemAdmin = item.path === '/admin';
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleSelect(item.path)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                    isItemAdmin
                      ? 'bg-yellow-400/10 dark:bg-yellow-400/10 border border-yellow-400/30 hover:bg-yellow-400/20'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isItemAdmin
                          ? 'bg-yellow-400 text-zinc-950'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 group-hover:text-yellow-500'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-yellow-600 dark:text-yellow-400">
                          {item.label}
                        </span>
                        <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-zinc-400 group-hover:text-yellow-500 transition-colors flex items-center gap-1 shrink-0 ml-2">
                    <span>Jump</span>
                    <ArrowRight size={12} />
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Tip: Type <strong className="text-yellow-600 dark:text-yellow-400 font-semibold">/admin</strong> to open admin panel</span>
          <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">↵ Enter</kbd> to select</span>
        </div>
      </div>
    </div>
  );
};

