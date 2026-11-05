/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { useCurrentPath, navigateTo } from './utils/router';
import { initSmoothScroll, destroySmoothScroll } from './utils/smoothScroll';
import { BeamsBackground } from './components/ui/beams-background';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/admin/AdminLogin';
import { checkAuth } from './hooks/useApi';

function MainApp() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const { currentPath } = useCurrentPath();

  // Admin auth state
  const [isAdminAuth, setIsAdminAuth] = useState<boolean | null>(null); // null = checking

  useEffect(() => {
    const lenis = initSmoothScroll();
    return () => { destroySmoothScroll(); };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
  }, [darkMode]);

  // When navigating to /admin, verify authentication
  useEffect(() => {
    if (currentPath === '/admin') {
      checkAuth().then((authenticated) => {
        setIsAdminAuth(authenticated);
      });
    } else {
      setIsAdminAuth(null);
    }
  }, [currentPath]);

  // Scroll to section on path change
  useEffect(() => {
    if (currentPath && currentPath !== '/' && currentPath !== '/home' && currentPath !== '/admin') {
      const sectionId = currentPath.replace('/', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => clearTimeout(timer);
    } else if (currentPath === '/' || currentPath === '/home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPath]);

  // ── Admin route ──
  if (currentPath === '/admin') {
    // Still checking auth
    if (isAdminAuth === null) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    // Not authenticated → show login
    if (!isAdminAuth) {
      return (
        <AdminLogin onAuthenticated={() => setIsAdminAuth(true)} />
      );
    }

    // Authenticated → show admin panel
    return (
      <div className={darkMode ? 'dark' : ''}>
        <AdminPanel
          onBackToSite={() => navigateTo('/')}
          onLogout={() => { setIsAdminAuth(false); }}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>
    );
  }

  // ── Main portfolio ──
  return (
    <BeamsBackground
      darkMode={darkMode}
      className={`min-h-screen font-sans selection:bg-yellow-400 selection:text-zinc-950 transition-colors duration-300 ${
        darkMode ? 'text-zinc-100' : 'text-zinc-900'
      }`}
    >
      <div className="relative z-10">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Blog />
          <Contact />
        </main>
        <Footer />
      </div>
    </BeamsBackground>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <MainApp />
    </PortfolioProvider>
  );
}
