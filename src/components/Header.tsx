import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { navigateTo, useCurrentPath } from '../utils/router';
import { usePortfolio } from '../context/PortfolioContext';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  const { currentPath } = useCurrentPath();
  const { data } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home',       path: '/home' },
    { label: 'About',      path: '/about' },
    { label: 'Skills',     path: '/skills' },
    { label: 'Experience', path: '/experience' },
    { label: 'Projects',   path: '/projects' },
    { label: 'Education',  path: '/education' },
    { label: 'Blog',       path: '/blog' },
    { label: 'Contact',    path: '/contact' },
  ];

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    navigateTo(path);
  };

  const isActive = (path: string) =>
    currentPath === path || (path === '/home' && (currentPath === '/' || currentPath === ''));

  // Update sliding indicator position
  useEffect(() => {
    if (activeButtonRef.current && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = activeButtonRef.current.getBoundingClientRect();
      setActiveIndicator({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  }, [currentPath]);

  // Extract dynamic logo & branding from admin-editable personalInfo
  const logoText = data.personalInfo.logoText || data.personalInfo.name || 'M. Hasan';
  const logoImage = data.personalInfo.logoImage || '';
  const logoType = data.personalInfo.logoType || 'text';
  const logoFontSize = data.personalInfo.logoFontSize || 'text-xl';
  const logoFirst = logoText.charAt(0);
  const logoRest = logoText.slice(1);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          scrolled
            ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_1px_20px_rgba(0,0,0,0.04)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-6">

          {/* ── Logo / Website Branding ── */}
          <button
            type="button"
            onClick={() => handleNav('/home')}
            className="shrink-0 flex items-center gap-2.5 focus:outline-none group"
            aria-label="Go to home"
          >
            {(logoType === 'image' || logoType === 'both') && logoImage && (
              <img
                src={logoImage}
                alt={logoText}
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
              />
            )}
            {(logoType === 'text' || logoType === 'both' || !logoImage) && (
              <div className={`font-bold tracking-tight font-mono leading-none ${logoFontSize}`}>
                <span className="font-extrabold text-yellow-400 group-hover:text-yellow-300 transition-colors">
                  {logoFirst}
                </span>
                <span className="text-zinc-900 dark:text-white group-hover:opacity-80 transition-opacity">
                  {logoRest}
                </span>
              </div>
            )}
          </button>

          {/* ── Desktop Nav ── */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center relative"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Sliding background pill */}
            <span
              className="absolute top-1/2 -translate-y-1/2 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800/80 transition-all duration-300 ease-out pointer-events-none"
              style={{ left: activeIndicator.left, width: activeIndicator.width }}
            />

            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  ref={active ? activeButtonRef : null}
                  type="button"
                  onClick={() => handleNav(link.path)}
                  className={`relative z-10 px-3.5 py-1.5 text-[13px] font-medium tracking-tight rounded-md whitespace-nowrap transition-colors duration-200 focus:outline-none ${
                    active
                      ? 'text-zinc-900 dark:text-white font-semibold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {link.label}
                  {/* Active underline dot */}
                  {active && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle color theme"
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all duration-200"
            >
              {darkMode ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
            </button>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => handleNav('/contact')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold text-zinc-950 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 rounded-lg shadow-sm transition-all duration-200 whitespace-nowrap"
            >
              Hire Me
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/97 dark:bg-zinc-950/97 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-5 py-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-0.5" role="navigation">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => handleNav(link.path)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors duration-150 ${
                      active
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />}
                  </button>
                );
              })}

              <div className="pt-3 mt-2 border-t border-zinc-100 dark:border-zinc-900 flex gap-2">
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); setDarkMode(!darkMode); }}
                  className="flex-1 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {darkMode ? <Sun size={15} /> : <Moon size={15} />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/contact')}
                  className="flex-1 py-2.5 text-sm font-semibold text-zinc-950 bg-yellow-400 hover:bg-yellow-300 rounded-lg transition-colors"
                >
                  Hire Me
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
