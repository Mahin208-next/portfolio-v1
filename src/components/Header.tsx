import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Search } from 'lucide-react';
import { navigateTo, useCurrentPath } from '../utils/router';
import { SearchModal } from './SearchModal';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
}) => {
  const { currentPath } = useCurrentPath();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcut to open search modal (Press / or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: '/home', path: '/home' },
    { label: '/about', path: '/about' },
    { label: '/skills', path: '/skills' },
    { label: '/experience', path: '/experience' },
    { label: '/projects', path: '/projects' },
    { label: '/education', path: '/education' },
    { label: '/blog', path: '/blog' },
    { label: '/contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    navigateTo(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          scrolled
            ? 'bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-sm'
            : 'bg-transparent border-b border-transparent backdrop-blur-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo: M. Hasan (M is yellow) */}
          <button
            type="button"
            onClick={() => handleNav('/home')}
            className="text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity flex items-center focus:outline-none font-mono"
          >
            <span className="text-yellow-400 font-extrabold">M</span>
            <span className="text-zinc-900 dark:text-white">. Hasan</span>
          </button>

          {/* Clean nav links with / prefix */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-mono font-medium">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path === '/home' && (currentPath === '/' || currentPath === ''));
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleNav(link.path)}
                  className={`py-1 transition-colors duration-200 whitespace-nowrap shrink-0 relative focus:outline-none ${
                    isActive
                      ? 'text-yellow-400 font-bold'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-yellow-400 dark:hover:text-yellow-400'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Controls: Search, Theme Toggle, Primary Action, Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search Bar Trigger (Type /admin in search) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              title="Search or type /admin (Press / or ⌘K)"
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 hover:border-yellow-400/50 transition-colors"
            >
              <Search size={14} className="text-yellow-500" />
              <span className="hidden xl:inline">Type /admin or search...</span>
              <span className="hidden sm:inline xl:hidden">Search</span>
              <kbd className="hidden sm:inline text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                /
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle color theme"
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* CTA */}
            <button
              type="button"
              onClick={() => handleNav('/contact')}
              className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold tracking-wide uppercase text-zinc-950 bg-yellow-400 hover:bg-yellow-300 rounded-md transition-colors duration-200 whitespace-nowrap shrink-0 shadow-sm font-mono"
            >
              Get in Touch
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white rounded-md transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-6 py-5 shadow-2xl animate-in slide-in-from-top-4 duration-200 space-y-3">
            {/* Mobile Search Bar */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="w-full text-left py-2.5 px-3.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-mono text-xs flex items-center justify-between border border-zinc-200 dark:border-zinc-800"
            >
              <span className="flex items-center gap-2">
                <Search size={14} className="text-yellow-500" />
                <span>Type /admin or search...</span>
              </span>
              <span className="text-[10px] font-bold text-yellow-500 uppercase">Search</span>
            </button>

            <nav className="flex flex-col gap-1.5 text-sm sm:text-base font-mono font-medium text-zinc-700 dark:text-zinc-300">
              {navLinks.map((link) => {
                const isActive =
                  currentPath === link.path ||
                  (link.path === '/home' && (currentPath === '/' || currentPath === ''));
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => handleNav(link.path)}
                    className={`text-left py-2 border-b border-zinc-100 dark:border-zinc-900 transition-colors duration-200 flex items-center justify-between ${
                      isActive
                        ? 'text-yellow-400 font-bold'
                        : 'hover:text-yellow-400'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="text-yellow-400 text-xs">●</span>}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => handleNav('/contact')}
                className="mt-2 text-center py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 bg-yellow-400 hover:bg-yellow-300 rounded-md transition-colors duration-200"
              >
                Get in Touch
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Global Interactive Search & Command Palette */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
