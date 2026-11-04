import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { navigateTo, useCurrentPath } from '../utils/router';

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
        scrolled
          ? 'bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-sm'
          : 'bg-transparent border-b border-transparent backdrop-blur-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4 md:gap-8">
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
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs xl:text-sm font-mono font-medium">
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

        {/* Controls: Theme Toggle & Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide uppercase text-zinc-950 bg-yellow-400 hover:bg-yellow-300 rounded-md transition-colors duration-200 whitespace-nowrap shrink-0 shadow-sm font-mono"
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
        <div className="lg:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-6 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2.5 text-sm sm:text-base font-mono font-medium text-zinc-700 dark:text-zinc-300">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path === '/home' && (currentPath === '/' || currentPath === ''));
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleNav(link.path)}
                  className={`text-left py-2.5 border-b border-zinc-100 dark:border-zinc-900 transition-colors duration-200 flex items-center justify-between ${
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
              className="mt-3 text-center py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 bg-yellow-400 hover:bg-yellow-300 rounded-md transition-colors duration-200"
            >
              Get in Touch
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
