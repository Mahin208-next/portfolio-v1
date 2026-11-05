import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

interface NavItem {
  label: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',       id: 'home' },
  { label: 'About',      id: 'about' },
  { label: 'Skills',     id: 'skills' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects',   id: 'projects' },
  { label: 'Education',  id: 'education' },
  { label: 'Blog',       id: 'blog' },
  { label: 'Contact',    id: 'contact' },
];

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  const { data } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const navRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Scroll detection & active section detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section based on scroll position
      const scrollY = window.scrollY;
      if (scrollY < 180) {
        setActiveSection('home');
        return;
      }

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        if (item.id === 'home') continue;
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop - 120;
          if (scrollY >= top) {
            setActiveSection(item.id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update sliding indicator position
  useEffect(() => {
    if (activeBtnRef.current && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = activeBtnRef.current.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        window.history.pushState({}, '', window.location.pathname);
      }
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.offsetTop - 75;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  // Dynamic branding from admin
  const logoText = data.personalInfo.logoText || data.personalInfo.name || 'M. Hasan';
  const logoImage = data.personalInfo.logoImage || '';
  const logoType = data.personalInfo.logoType || 'text';
  const logoFontSize = data.personalInfo.logoFontSize || 'text-xl';
  const logoFirst = logoText.charAt(0);
  const logoRest = logoText.slice(1);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
        scrolled
          ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200/70 dark:border-zinc-800/70 shadow-xs'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between gap-6">

        {/* ── Logo / Website Branding ── */}
        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className="shrink-0 flex items-center gap-2.5 focus:outline-none group cursor-pointer"
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

        {/* ── Desktop Clean Navigation (No / prefix, no search bar) ── */}
        <nav
          ref={navRef}
          className="hidden lg:flex items-center relative py-1"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Subtle sliding highlight pill */}
          <span
            className="absolute top-1/2 -translate-y-1/2 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 transition-all duration-300 ease-out pointer-events-none"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />

          {NAV_ITEMS.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                ref={active ? activeBtnRef : null}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`relative z-10 px-3.5 py-1.5 text-[13px] tracking-tight rounded-lg whitespace-nowrap transition-colors duration-200 focus:outline-none cursor-pointer ${
                  active
                    ? 'text-zinc-950 dark:text-white font-bold'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium'
                }`}
              >
                {item.label}
                {/* Active yellow accent dot */}
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Right Actions: Theme Toggle + CTA Button ── */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle color theme"
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
          </button>

          {/* CTA Button */}
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-950 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 rounded-lg shadow-xs transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Get in Touch
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border-b border-zinc-200 dark:border-zinc-800 px-5 py-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1" role="navigation">
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                    active
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />}
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-zinc-100 dark:border-zinc-900 flex gap-2">
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); setDarkMode(!darkMode); }}
                className="flex-1 py-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 bg-yellow-400 hover:bg-yellow-300 rounded-lg transition-colors"
              >
                Get in Touch
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
